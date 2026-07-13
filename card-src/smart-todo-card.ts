import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// HA type stubs — avoids needing @types/home-assistant-frontend as a dep
interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
  last_updated: string;
}

interface Hass {
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: unknown,
    notifyOnFailure?: boolean,
    returnResponse?: boolean,
  ): Promise<unknown>;
  language: string;
}

type FilterMode =
  | 'all'
  | 'overdue'
  | 'today'
  | 'today_plus_overdue'
  | 'x_days'
  | 'x_days_plus_overdue';

interface SmartTodoCardConfig {
  entity: string;
  title?: string;
  filter?: FilterMode;
  filter_days?: number;
}

@customElement('smart-todo-card-editor')
class SmartTodoCardEditor extends LitElement {
  @state() private _config: SmartTodoCardConfig = { entity: '' };

  set hass(_hass: Hass) { /* no-op — entity picker not used */ }

  setConfig(config: SmartTodoCardConfig): void {
    this._config = { ...config };
  }

  private _valueChanged(field: keyof SmartTodoCardConfig, value: unknown): void {
    const updated = { ...this._config, [field]: value } as SmartTodoCardConfig;
    if (updated.filter !== 'x_days' && updated.filter !== 'x_days_plus_overdue') {
      delete updated.filter_days;
    }
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: updated },
      bubbles: true,
      composed: true,
    }));
  }

  static override styles = css`
    .editor-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 12px;
    }
    .editor-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .editor-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 0.9rem;
      box-sizing: border-box;
    }
    .editor-input:focus {
      outline: none;
      border-color: var(--primary-color, #0288d1);
    }
    .editor-hint {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
  `;

  override render() {
    const filter = this._config.filter ?? 'all';
    const showDays = filter === 'x_days' || filter === 'x_days_plus_overdue';

    return html`
      <div class="editor-row">
        <label class="editor-label">Entity *</label>
        <input class="editor-input" type="text"
          .value=${this._config.entity}
          placeholder="smart_todo.tasks"
          @input=${(e: Event) =>
            this._valueChanged('entity', (e.target as HTMLInputElement).value)} />
        <span class="editor-hint">The smart_todo sensor entity ID</span>
      </div>

      <div class="editor-row">
        <label class="editor-label">Title</label>
        <input class="editor-input" type="text"
          .value=${this._config.title ?? ''}
          placeholder="Smart Todo"
          @input=${(e: Event) =>
            this._valueChanged('title', (e.target as HTMLInputElement).value || undefined)} />
      </div>

      <div class="editor-row">
        <label class="editor-label">Show tasks</label>
        <select class="editor-input"
          .value=${filter}
          @change=${(e: Event) =>
            this._valueChanged('filter', (e.target as HTMLSelectElement).value as FilterMode)}>
          <option value="all">All tasks</option>
          <option value="overdue">Only overdue</option>
          <option value="today">Only today</option>
          <option value="today_plus_overdue">Today + overdue</option>
          <option value="x_days">Within X days</option>
          <option value="x_days_plus_overdue">Within X days + overdue</option>
        </select>
      </div>

      ${showDays ? html`
        <div class="editor-row">
          <label class="editor-label">Days (X)</label>
          <input class="editor-input" type="number" min="1" max="365"
            .value=${String(this._config.filter_days ?? 7)}
            @input=${(e: Event) =>
              this._valueChanged('filter_days', parseInt((e.target as HTMLInputElement).value) || 7)} />
          <span class="editor-hint">Show tasks due within this many days from today</span>
        </div>
      ` : nothing}
    `;
  }
}

@customElement('smart-todo-card')
export class SmartTodoCard extends LitElement {
  private _hass!: Hass;

  @state() private _config?: SmartTodoCardConfig;
  @state() private _tasks: Task[] = [];
  @state() private _roster: string[] = [];
  @state() private _loading = false;
  @state() private _error?: string;

  @state() private _showForm = false;
  @state() private _editingTaskId?: string;
  // Captured when the edit form opens; used to detect whether the user
  // actually changed the recurrence rule before deciding whether to send it
  // in the patch (see _submitForm).
  private _editingOriginalRecurrence: RecurrenceRuleDict | null = null;
  @state() private _formTitle = '';
  @state() private _formDue = '';
  @state() private _formPriority = 2;
  @state() private _formAssignee = '';
  @state() private _formPoints = 0;
  @state() private _formRewardRecipient = '';
  @state() private _formRecurrenceType = 'none';
  // Sub-fields
  @state() private _formWeekdays: number[] = [];   // 0=Mon…6=Sun
  @state() private _formTime = '09:00';
  @state() private _formIntervalDays = 7;
  @state() private _formAnchorDate = '';           // for biweekly; defaults to today on form open
  @state() private _formSubmitting = false;

  @state() private _confirmDeleteId?: string;
  @state() private _confirmDeleteTimer?: ReturnType<typeof setTimeout>;
  @state() private _snoozeTaskId?: string;
  @state() private _snoozeDate = '';
  @state() private _snoozeTime = '08:00';
  @state() private _showHidden = false;

  // Recipient prompt — shown on completing a points-bearing task that has
  // neither an assignee nor a reward_recipient, so there's no one to
  // auto-credit.
  @state() private _pointsPromptTaskId?: string;
  @state() private _pointsPromptSelected: string[] = [];
  @state() private _pointsPromptManualName = '';

  private _lastUpdated?: string;
  private _debounceTimer?: ReturnType<typeof setTimeout>;

  static override styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
      position: relative;
      padding-bottom: 56px;
    }
    .fab {
      position: absolute;
      bottom: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color, #0288d1);
      color: white;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      z-index: 1;
    }
    .form-panel {
      border-top: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      padding: 16px 0 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-title {
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 4px;
      color: var(--primary-text-color);
    }
    .form-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--secondary-text-color);
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .form-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(255,255,255,0.25));
      border-radius: 6px;
      background-color: rgba(255,255,255,0.08);
      color: var(--primary-text-color, #e0e0e0);
      font-size: 0.9rem;
      box-sizing: border-box;
      transition: border-color 0.15s;
      color-scheme: dark;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--primary-color, #0288d1);
    }
    .form-input::placeholder {
      color: var(--secondary-text-color, rgba(255,255,255,0.5));
      opacity: 0.85;
    }
    .form-input option {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color);
    }
    .form-hint {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .priority-buttons {
      display: flex;
      gap: 8px;
    }
    .priority-btn {
      flex: 1;
      padding: 6px;
      border: 2px solid var(--btn-color, #ccc);
      border-radius: 4px;
      background: transparent;
      color: var(--btn-color, #666);
      cursor: pointer;
      font-size: 0.85rem;
    }
    .priority-btn.active {
      background: var(--btn-color, #ccc);
      color: white;
    }
    .weekday-picker {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .day-btn {
      padding: 4px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: transparent;
      cursor: pointer;
      font-size: 0.8rem;
      color: var(--primary-text-color);
    }
    .day-btn.active {
      background: var(--primary-color, #0288d1);
      color: white;
      border-color: var(--primary-color, #0288d1);
    }
    .form-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
    }
    .form-btn {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .form-btn.cancel {
      background: transparent;
      color: var(--secondary-text-color);
    }
    .form-btn.submit {
      background: var(--primary-color, #0288d1);
      color: white;
    }
    .form-btn.submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .summary {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .loading {
      text-align: center;
      padding: 24px;
      color: var(--secondary-text-color);
    }
    .error {
      background: var(--error-color, #db4437);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 8px;
      font-size: 0.85rem;
    }
    .placeholder {
      text-align: center;
      padding: 32px 16px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .task-list {
      display: flex;
      flex-direction: column;
    }
    .task-row {
      display: flex;
      align-items: stretch;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      gap: 0;
    }
    .task-row:last-child {
      border-bottom: none;
    }
    .task-row.due-today-row {
      background: rgba(255, 170, 0, 0.13);
      border-radius: 6px;
      margin: 2px -6px;
      padding-left: 6px;
      padding-right: 6px;
      border-bottom-color: transparent;
    }
    .task-row.due-soon-row {
      background: rgba(255, 170, 0, 0.05);
      border-radius: 6px;
      margin: 2px -6px;
      padding-left: 6px;
      padding-right: 6px;
    }
    .task-row.due-overdue-row {
      background: rgba(219, 68, 55, 0.08);
      border-radius: 6px;
      margin: 2px -6px;
      padding-left: 6px;
      padding-right: 6px;
      border-bottom-color: transparent;
    }
    .task-priority {
      width: 4px;
      border-radius: 2px;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .task-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .task-title-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .task-title {
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .task-title.completed {
      text-decoration: line-through;
      opacity: 0.5;
    }
    .task-meta {
      display: flex;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      align-items: center;
    }
    .due-overdue {
      color: var(--error-color, #db4437);
    }
    .recurrence-label {
      font-style: italic;
    }
    .task-row-right {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 8px;
    }
    .assignee-chip {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--primary-color, #0288d1);
      color: white;
      font-size: 0.65rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      text-transform: uppercase;
    }
    .points-badge {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--primary-text-color);
      background: var(--secondary-background-color, rgba(255,170,0,0.15));
      border: 1px solid rgba(255, 170, 0, 0.4);
      border-radius: 10px;
      padding: 2px 7px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .task-actions {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .action-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 4px;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      opacity: 0.6;
      transition: opacity 0.15s, background 0.15s;
    }
    .action-btn:hover {
      opacity: 1;
      background: var(--divider-color, #f0f0f0);
    }
    .action-btn.complete:hover {
      color: var(--success-color, #43a047);
    }
    .action-btn.delete.confirming {
      color: var(--error-color, #db4437);
      opacity: 1;
      background: var(--divider-color, #fbe9e7);
    }
    .snooze-popover {
      background-color: rgba(255,255,255,0.08);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: 6px;
      padding: 12px;
      margin: 4px 0 8px 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .snooze-inputs {
      display: flex;
      gap: 8px;
    }
    .snooze-date { flex: 2; }
    .snooze-time { flex: 1; }
    .points-roster-picker {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .points-roster-option {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .filter-expand-btn {
      background: none;
      border: 1px solid var(--divider-color, rgba(255,255,255,0.15));
      border-radius: 6px;
      cursor: pointer;
      padding: 6px 12px;
      margin-top: 8px;
      font-size: 0.8rem;
      color: var(--primary-color, #0288d1);
      display: block;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    .filter-expand-btn:hover {
      background: var(--divider-color, rgba(255,255,255,0.08));
    }
    .hidden-divider {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      text-align: center;
      padding: 6px 0 4px;
      opacity: 0.6;
    }
    .filtered-hidden-wrapper {
      opacity: 0.45;
    }
  `;

  static getConfigElement(): HTMLElement {
    return document.createElement('smart-todo-card-editor');
  }

  static getStubConfig(): SmartTodoCardConfig {
    return { entity: '', filter: 'all' };
  }

  setConfig(config: SmartTodoCardConfig): void {
    if (!config.entity) {
      throw new Error('smart-todo-card: "entity" is required in card config.');
    }
    this._config = config;
    this._showHidden = false;
  }

  set hass(hass: Hass) {
    this._hass = hass;
    if (!this._config?.entity) return;

    const entityState = this._hass.states[this._config.entity];
    if (!entityState) return;

    const lastUpdated = entityState.last_updated;
    if (lastUpdated === this._lastUpdated) return;
    this._lastUpdated = lastUpdated;

    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => this._fetchTasks(), 500);
  }

  get hass(): Hass {
    return this._hass;
  }

  private async _fetchTasks(silent = false): Promise<void> {
    if (!this._hass || !this._config) return;
    if (!silent) this._loading = true;
    this._error = undefined;
    try {
      const raw = await this._hass.callService(
        'smart_todo',
        'get_tasks',
        {},
        undefined,
        false,   // notifyOnFailure
        true,    // returnResponse
      ) as GetTasksResult | { response?: GetTasksResult };
      // HA wraps service response data under .response in some versions.
      // Each field falls back independently (not "response as a whole, else
      // top-level as a whole") in case a given HA version populates one
      // field under .response and leaves the other at the top level.
      const response = (raw as { response?: GetTasksResult }).response;
      const top = raw as GetTasksResult;
      this._tasks = response?.tasks ?? top?.tasks ?? [];
      this._roster = response?.roster ?? top?.roster ?? [];
    } catch (err) {
      const msg = err instanceof Error
        ? err.message
        : (typeof err === 'object' && err !== null && 'message' in err)
          ? String((err as { message: unknown }).message)
          : JSON.stringify(err);
      this._error = `Failed to load tasks: ${msg}`;
    } finally {
      this._loading = false;
    }
  }

  private _isCompletedToday(task: Task): boolean {
    if (!task.last_completed_at) return false;
    const t = new Date(task.last_completed_at.replace(/(\.\d{3})\d+/, '$1'));
    const n = new Date();
    return t.getFullYear() === n.getFullYear()
      && t.getMonth() === n.getMonth()
      && t.getDate() === n.getDate();
  }

  private _getFilteredTasks(): Task[] {
    const mode = this._config?.filter ?? 'all';
    if (mode === 'all') return this._tasks.filter(t => !this._isCompletedToday(t));

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const days = this._config?.filter_days ?? 7;

    return this._tasks.filter(task => {
      if (task.completed || this._isCompletedToday(task)) return false;

      const isOverdue = task.overdue === true;

      if (mode === 'overdue') return isOverdue;

      const isSnoozed = task.snoozed_until != null && new Date(task.snoozed_until) > new Date();
      const effectiveDueStr = isSnoozed ? task.snoozed_until! : task.due_at;

      let diffDays = Infinity;
      if (effectiveDueStr) {
        const due = new Date(effectiveDueStr.replace(/(\.\d{3})\d+/, '$1'));
        const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
        diffDays = Math.round((dueDay.getTime() - todayStart.getTime()) / 86400000);
      }

      const isToday = diffDays === 0;
      const inWindow = diffDays >= 0 && diffDays <= days;

      switch (mode) {
        case 'today':                return isToday && !isOverdue;
        case 'today_plus_overdue':   return isToday || isOverdue;
        case 'x_days':               return inWindow && !isOverdue;
        case 'x_days_plus_overdue':  return inWindow || isOverdue;
        default:                     return true;
      }
    });
  }

  private _sortTasks(tasks: Task[]): Task[] {
    return tasks.slice().sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const toMs = (s: string | null | undefined) => {
        if (!s) return Number.MAX_SAFE_INTEGER;
        const ms = new Date(s.replace(/(\.\d{3})\d+/, '$1')).getTime();
        return isNaN(ms) ? Number.MAX_SAFE_INTEGER : ms;
      };
      const aMs = toMs(a.due_at);
      const bMs = toMs(b.due_at);
      if (aMs !== bMs) return aMs < bMs ? -1 : 1;
      return a.sort_order - b.sort_order;
    });
  }

  override render() {
    if (!this._config) return nothing;

    const filtered = this._getFilteredTasks();
    const mode = this._config.filter ?? 'all';
    const filteredIds = new Set(filtered.map(t => t.id));
    const hidden = mode === 'all' ? [] : this._tasks.filter(t =>
      !filteredIds.has(t.id) && !t.completed && !this._isCompletedToday(t)
    );
    const hasHidden = hidden.length > 0;
    const totalTasks = filtered.length;
    const overdueCnt = filtered.filter(t => t.overdue && !t.completed).length;
    const title = this._config.title ?? 'Smart Todo';

    return html`
      <ha-card>
        <div class="header">
          <span class="title">${title}</span>
          ${!this._loading
            ? html`<span class="summary">
                ${totalTasks} task${totalTasks !== 1 ? 's' : ''}${overdueCnt ? html` · <span style="color:var(--error-color)">${overdueCnt} overdue</span>` : ''}
              </span>`
            : nothing}
        </div>

        ${this._error
          ? html`<div class="error">${this._error}</div>`
          : nothing}

        ${this._loading
          ? html`<div class="loading">Loading tasks…</div>`
          : this._tasks.length === 0
            ? html`<div class="placeholder">No tasks yet — click + to add one.</div>`
            : filtered.length === 0
              ? html`<div class="placeholder">
                  No tasks match the current filter.
                  ${hasHidden ? html`<br>
                    <button class="filter-expand-btn"
                      @click=${() => { this._showHidden = !this._showHidden; }}>
                      ${this._showHidden
                        ? `▲ Hide ${hidden.length} filtered task${hidden.length !== 1 ? 's' : ''}`
                        : `▼ Show ${hidden.length} filtered task${hidden.length !== 1 ? 's' : ''}`}
                    </button>
                    ${this._showHidden ? html`
                      <div class="hidden-divider">Hidden by filter</div>
                      <div class="task-list">
                        ${this._sortTasks(hidden).map(task => html`
                          <div class="filtered-hidden-wrapper">
                            ${this._renderTask(task)}
                          </div>
                        `)}
                      </div>
                    ` : nothing}
                  ` : nothing}
                </div>`
              : html`
                  <div class="task-list">
                    ${this._sortTasks(filtered).map(task => this._renderTask(task))}
                  </div>
                  ${hasHidden ? html`
                    <button class="filter-expand-btn"
                      @click=${() => { this._showHidden = !this._showHidden; }}>
                      ${this._showHidden
                        ? `▲ Hide ${hidden.length} filtered task${hidden.length !== 1 ? 's' : ''}`
                        : `▼ Show ${hidden.length} filtered task${hidden.length !== 1 ? 's' : ''}`}
                    </button>
                    ${this._showHidden ? html`
                      <div class="hidden-divider">Hidden by filter</div>
                      <div class="task-list">
                        ${this._sortTasks(hidden).map(task => html`
                          <div class="filtered-hidden-wrapper">
                            ${this._renderTask(task)}
                          </div>
                        `)}
                      </div>
                    ` : nothing}
                  ` : nothing}
                `}

        ${this._showForm ? html`
          <div class="form-panel">
            <div class="form-title">${this._editingTaskId ? 'Edit task' : 'Add task'}</div>

            <!-- Title (required) -->
            <label class="form-label">Title *</label>
            <input class="form-input" type="text" .value=${this._formTitle}
              @input=${(e: Event) => this._formTitle = (e.target as HTMLInputElement).value}
              placeholder="Task title" />

            <!-- Due date (optional) -->
            <label class="form-label">Due date</label>
            <input class="form-input" type="date" .value=${this._formDue}
              @input=${(e: Event) => this._formDue = (e.target as HTMLInputElement).value} />

            <!-- Priority -->
            <label class="form-label">Priority</label>
            <div class="priority-buttons">
              ${[1, 2, 3].map(p => html`
                <button class="priority-btn ${this._formPriority === p ? 'active' : ''}"
                  style="--btn-color:${this._priorityColor(p)}"
                  @click=${() => this._formPriority = p}>
                  ${{ 1: 'Low', 2: 'Medium', 3: 'High' }[p as 1 | 2 | 3]}
                </button>`)}
            </div>

            <!-- Assignee -->
            <label class="form-label">Assignee</label>
            <input class="form-input" type="text" .value=${this._formAssignee}
              list="smart-todo-roster-list"
              @input=${(e: Event) => this._formAssignee = (e.target as HTMLInputElement).value}
              placeholder="Optional" />

            <!-- Points -->
            <label class="form-label">Points</label>
            <input class="form-input" type="number" min="0" .value=${String(this._formPoints)}
              @input=${(e: Event) => this._formPoints = parseInt((e.target as HTMLInputElement).value) || 0}
              placeholder="0" />

            <!-- Reward recipient (only meaningful when Points > 0) -->
            ${this._formPoints > 0 ? html`
              <label class="form-label">Reward recipient</label>
              <input class="form-input" type="text" .value=${this._formRewardRecipient}
                list="smart-todo-roster-list"
                @input=${(e: Event) => this._formRewardRecipient = (e.target as HTMLInputElement).value}
                placeholder="Defaults to assignee" />
            ` : nothing}

            <datalist id="smart-todo-roster-list">
              ${this._roster.map(name => html`<option value=${name}></option>`)}
            </datalist>

            <!-- Recurrence type -->
            <label class="form-label">Recurrence</label>
            <select class="form-input" .value=${this._formRecurrenceType}
              @change=${(e: Event) => this._formRecurrenceType = (e.target as HTMLSelectElement).value}>
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="interval_days">Every N days</option>
              <option value="rolling_days">N days after completion</option>
              <option value="biweekly">Every other week</option>
              <option value="monthly">Monthly</option>
            </select>

            <!-- Conditional sub-fields -->
            ${this._renderRecurrenceSubFields()}

            <!-- Form actions -->
            <div class="form-actions">
              <button class="form-btn cancel"
                @click=${() => {
                  this._showForm = false;
                  this._editingTaskId = undefined;
                  this._editingOriginalRecurrence = null;
                }}>Cancel</button>
              <button class="form-btn submit" ?disabled=${this._formSubmitting || !this._formTitle.trim()}
                @click=${() => this._submitForm()}>
                ${this._formSubmitting
                  ? (this._editingTaskId ? 'Saving…' : 'Adding…')
                  : (this._editingTaskId ? 'Save changes' : 'Add task')}
              </button>
            </div>
          </div>
        ` : nothing}

        <button class="fab" @click=${() => this._openForm()} title="Add task">+</button>
      </ha-card>
    `;
  }
  private _openForm(): void {
    this._showForm = true;
    this._editingTaskId = undefined;
    this._editingOriginalRecurrence = null;
    this._formTitle = '';
    this._formDue = '';
    this._formPriority = 2;
    this._formAssignee = '';
    this._formPoints = 0;
    this._formRewardRecipient = '';
    this._formRecurrenceType = 'none';
    this._formWeekdays = [];
    this._formTime = '09:00';
    this._formIntervalDays = 7;
    this._formAnchorDate = new Date().toISOString().slice(0, 10); // today YYYY-MM-DD
    this._formSubmitting = false;
  }

  private _openEditForm(task: Task): void {
    this._showForm = true;
    this._editingTaskId = task.id;
    this._formSubmitting = false;

    this._formTitle = task.title;
    this._formDue = task.due_at ? task.due_at.slice(0, 10) : '';
    this._formPriority = task.priority;
    this._formAssignee = task.assignee ?? '';
    this._formPoints = task.points;
    this._formRewardRecipient = task.reward_recipient ?? '';

    const rule = task.recurrence_rule ?? null;
    this._editingOriginalRecurrence = rule;
    this._formWeekdays = rule?.weekdays ?? [];
    this._formTime = rule?.time_of_day ? rule.time_of_day.slice(0, 5) : '09:00';
    this._formIntervalDays = rule?.interval_days ?? 7;
    this._formAnchorDate = rule?.anchor_date ?? new Date().toISOString().slice(0, 10);

    switch (rule?.mode) {
      case 'weekdays':
      case 'weekly':
        this._formRecurrenceType = 'weekly';
        break;
      case 'biweekly_weekdays':
        this._formRecurrenceType = 'biweekly';
        break;
      case 'monthly':
        this._formRecurrenceType = 'monthly';
        break;
      case 'rolling_days':
        this._formRecurrenceType = 'rolling_days';
        break;
      case 'interval_days':
        this._formRecurrenceType = 'interval_days';
        break;
      default:
        this._formRecurrenceType = 'none';
    }
  }

  private _renderRecurrenceSubFields() {
    const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    switch (this._formRecurrenceType) {
      case 'weekly':
      case 'biweekly':
        return html`
          <label class="form-label">Day(s)</label>
          <div class="weekday-picker">
            ${DAY_NAMES.map((d, i) => html`
              <button class="day-btn ${this._formWeekdays.includes(i) ? 'active' : ''}"
                @click=${() => this._toggleWeekday(i)}>${d}</button>`)}
          </div>
          <label class="form-label">Time</label>
          <input class="form-input" type="time" .value=${this._formTime}
            @input=${(e: Event) => this._formTime = (e.target as HTMLInputElement).value} />
          ${this._formRecurrenceType === 'biweekly' ? html`
            <label class="form-label">Starting from (anchor date)</label>
            <input class="form-input" type="date" .value=${this._formAnchorDate}
              @input=${(e: Event) => this._formAnchorDate = (e.target as HTMLInputElement).value} />
          ` : nothing}
        `;
      case 'interval_days':
      case 'rolling_days':
        return html`
          <label class="form-label">Every</label>
          <input class="form-input" type="number" min="1" max="365"
            .value=${String(this._formIntervalDays)}
            @input=${(e: Event) => this._formIntervalDays = parseInt((e.target as HTMLInputElement).value) || 1} />
          <span class="form-hint">days${this._formRecurrenceType === 'rolling_days' ? ' after completion' : ''}</span>
        `;
      case 'monthly':
        return html`
          <label class="form-label">Day of month</label>
          <input class="form-input" type="date" .value=${this._formAnchorDate}
            @input=${(e: Event) => this._formAnchorDate = (e.target as HTMLInputElement).value} />
          <span class="form-hint">Only the day number is used — pick any 15th for "the 15th of every month"</span>
          <label class="form-label">Time</label>
          <input class="form-input" type="time" .value=${this._formTime}
            @input=${(e: Event) => this._formTime = (e.target as HTMLInputElement).value} />
        `;
      default:
        return nothing;
    }
  }

  private _toggleWeekday(day: number): void {
    if (this._formWeekdays.includes(day)) {
      this._formWeekdays = this._formWeekdays.filter(d => d !== day);
    } else {
      this._formWeekdays = [...this._formWeekdays, day];
    }
  }

  private _buildRecurrenceDict(): Record<string, unknown> | null {
    const timeStr = this._formTime ? `${this._formTime}:00` : null; // "HH:MM" -> "HH:MM:SS"

    switch (this._formRecurrenceType) {
      case 'daily':
        return { mode: 'interval_days', interval_days: 1 };
      case 'weekly':
        return {
          mode: 'weekly',
          weekdays: this._formWeekdays,
          time_of_day: timeStr,
        };
      case 'interval_days':
        return { mode: 'interval_days', interval_days: this._formIntervalDays };
      case 'rolling_days':
        return { mode: 'rolling_days', interval_days: this._formIntervalDays };
      case 'biweekly':
        return {
          mode: 'biweekly_weekdays',
          weekdays: this._formWeekdays,
          time_of_day: timeStr,
          anchor_date: this._formAnchorDate,
        };
      case 'monthly':
        return {
          mode: 'monthly',
          anchor_date: this._formAnchorDate,
          time_of_day: timeStr,
        };
      default:
        return null;
    }
  }

  /**
   * Structural equality for recurrence rules, used to decide whether an edit
   * actually changed the recurrence (see _submitForm). _buildRecurrenceDict()
   * only includes the fields relevant to its mode (a sparse dict), while
   * task.recurrence_rule (RecurrenceRule.to_dict() in models.py) always
   * includes all six fields with null for unused ones — normalize both to
   * the same shape, and sort weekdays, before comparing so a reorder or a
   * missing-vs-null key difference doesn't register as a change.
   */
  private _recurrenceEquals(
    a: Record<string, unknown> | null,
    b: RecurrenceRuleDict | null,
  ): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    const norm = (r: Record<string, unknown>) => JSON.stringify({
      mode: r.mode ?? null,
      interval_days: r.interval_days ?? null,
      weekdays: Array.isArray(r.weekdays) ? [...(r.weekdays as number[])].sort((x, y) => x - y) : null,
      week_parity: r.week_parity ?? null,
      anchor_date: r.anchor_date ?? null,
      time_of_day: r.time_of_day ?? null,
    });
    return norm(a) === norm(b as unknown as Record<string, unknown>);
  }

  private async _submitForm(): Promise<void> {
    if (!this._formTitle.trim() || !this._hass) return;
    this._formSubmitting = true;

    const isEditing = this._editingTaskId !== undefined;
    const recurrence = this._buildRecurrenceDict();
    const data: Record<string, unknown> = {
      title: this._formTitle.trim(),
      priority: this._formPriority,
    };

    if (isEditing) {
      // Unlike create (below), an edit must be able to explicitly CLEAR a
      // field — reduce points back to 0, remove a due date, drop the
      // recurrence — not just add one. Send every editable field with its
      // current value, using null for "empty," so update_task's patch
      // semantics (key absent = unchanged, key present = set/clear) do the
      // right thing either way.
      data['task_id'] = this._editingTaskId;
      data['assignee'] = this._formAssignee.trim() || null;
      data['points'] = this._formPoints;
      data['reward_recipient'] =
        this._formPoints > 0 && this._formRewardRecipient.trim()
          ? this._formRewardRecipient.trim()
          : null;
      // Only send recurrence if it actually changed. update_task
      // unconditionally recomputes due_at from `now` whenever "recurrence"
      // is present in the patch at all (coordinator.py) — sending back an
      // unchanged rule on every edit (e.g. just fixing a typo in the title)
      // would silently reset a fixed-cadence task's due-date anchor to
      // "now + interval" instead of preserving its existing schedule.
      if (!this._recurrenceEquals(recurrence, this._editingOriginalRecurrence)) {
        data['recurrence'] = recurrence;
      }
      // update_task applies an explicit due_at patch AFTER recomputing it
      // from the recurrence rule (coordinator.py), so sending both would let
      // a stale pre-filled due_at silently overwrite the freshly recalculated
      // one. due_at is only meaningfully user-controlled for non-recurring
      // tasks — for recurring ones, leave it to the recurrence recalculation.
      if (!recurrence) {
        data['due_at'] = this._formDue ? `${this._formDue}T00:00:00` : null;
      }
    } else {
      if (this._formDue) data['due_at'] = `${this._formDue}T00:00:00`;
      if (this._formAssignee.trim()) data['assignee'] = this._formAssignee.trim();
      if (this._formPoints > 0) data['points'] = this._formPoints;
      // Matches the form's render-gate (reward recipient is only shown/editable
      // when Points > 0) — otherwise a recipient typed before resetting Points
      // back to 0 would silently submit anyway even though the field is hidden.
      if (this._formPoints > 0 && this._formRewardRecipient.trim()) {
        data['reward_recipient'] = this._formRewardRecipient.trim();
      }
      if (recurrence) data['recurrence'] = recurrence;
    }

    try {
      await this._hass.callService(
        'smart_todo',
        isEditing ? 'update_task' : 'create_task',
        data,
        undefined,
        false,
      );
      this._showForm = false;
      this._editingTaskId = undefined;
      this._editingOriginalRecurrence = null;
      void this._fetchTasks(true);
    } catch (err) {
      const verb = isEditing ? 'update' : 'create';
      this._error = `Failed to ${verb} task: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      this._formSubmitting = false;
    }
  }

  private async _completeTask(task: Task): Promise<void> {
    // Unassigned + points-bearing tasks have no one to auto-credit — ask who
    // actually did it instead of silently completing with no points awarded.
    if (!task.assignee && !task.reward_recipient && task.points > 0) {
      this._pointsPromptTaskId = task.id;
      this._pointsPromptSelected = [];
      this._pointsPromptManualName = '';
      return;
    }
    await this._submitCompleteTask(task.id);
  }

  private async _submitCompleteTask(taskId: string, recipients?: string[]): Promise<void> {
    try {
      const data: Record<string, unknown> = { task_id: taskId };
      if (recipients !== undefined) data['recipients'] = recipients;
      await this._hass.callService('smart_todo', 'complete_task', data, undefined, false);
      this._pointsPromptTaskId = undefined;
      void this._fetchTasks(true);
    } catch (err) {
      this._error = `Failed to complete task: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  private _togglePromptRecipient(name: string): void {
    this._pointsPromptSelected = this._pointsPromptSelected.includes(name)
      ? this._pointsPromptSelected.filter(n => n !== name)
      : [...this._pointsPromptSelected, name];
  }

  private _confirmPointsPrompt(): void {
    if (!this._pointsPromptTaskId) return;
    const manual = this._pointsPromptManualName.trim();
    const combined = manual
      ? [...this._pointsPromptSelected, manual]
      : this._pointsPromptSelected;
    const recipients = [...new Set(combined.map(n => n.trim()).filter(Boolean))];
    if (recipients.length === 0) return;
    void this._submitCompleteTask(this._pointsPromptTaskId, recipients);
  }

  private _declinePointsPrompt(): void {
    if (!this._pointsPromptTaskId) return;
    void this._submitCompleteTask(this._pointsPromptTaskId, []);
  }

  private _renderPointsPromptPopover(task: Task) {
    const selected = this._pointsPromptSelected;
    return html`
      <div class="snooze-popover">
        <span class="form-label">Who completed "${task.title}"?</span>
        ${this._roster.length > 0 ? html`
          <div class="points-roster-picker">
            ${this._roster.map(name => html`
              <label class="points-roster-option">
                <input type="checkbox" .checked=${selected.includes(name)}
                  @change=${() => this._togglePromptRecipient(name)} />
                ${name}
              </label>
            `)}
          </div>
        ` : nothing}
        <input class="form-input" placeholder="Or type a name"
          list="smart-todo-roster-list"
          .value=${this._pointsPromptManualName}
          @input=${(e: Event) => this._pointsPromptManualName = (e.target as HTMLInputElement).value} />
        <div class="form-hint">
          ${selected.length + (this._pointsPromptManualName.trim() ? 1 : 0) > 1
            ? `${task.points}pts will be split evenly between everyone selected.`
            : `${task.points}pts will be awarded to whoever is selected.`}
        </div>
        <div class="form-actions">
          <button class="form-btn cancel" @click=${() => this._pointsPromptTaskId = undefined}>Cancel</button>
          <button class="form-btn cancel" @click=${() => this._declinePointsPrompt()}>Don't award points</button>
          <button class="form-btn submit"
            ?disabled=${selected.length === 0 && !this._pointsPromptManualName.trim()}
            @click=${() => this._confirmPointsPrompt()}>Confirm</button>
        </div>
      </div>
    `;
  }

  private _deleteTask(taskId: string): void {
    if (this._confirmDeleteId === taskId) {
      // Second tap — confirmed
      clearTimeout(this._confirmDeleteTimer);
      this._confirmDeleteId = undefined;
      this._hass.callService('smart_todo', 'delete_task', { task_id: taskId }, undefined, false)
        .then(() => this._fetchTasks(true))
        .catch((err: unknown) => {
          this._error = `Failed to delete task: ${err instanceof Error ? err.message : String(err)}`;
        });
    } else {
      // First tap — enter confirm state
      clearTimeout(this._confirmDeleteTimer);
      this._confirmDeleteId = taskId;
      // Auto-cancel confirm after 3 seconds
      this._confirmDeleteTimer = setTimeout(() => {
        this._confirmDeleteId = undefined;
      }, 3000);
    }
  }

  private _openSnooze(taskId: string): void {
    this._snoozeTaskId = this._snoozeTaskId === taskId ? undefined : taskId;
    // Default snooze to tomorrow 08:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this._snoozeDate = tomorrow.toISOString().slice(0, 10);
    this._snoozeTime = '08:00';
  }

  private async _submitSnooze(): Promise<void> {
    if (!this._snoozeTaskId || !this._snoozeDate) return;
    const snoozeUntil = `${this._snoozeDate}T${this._snoozeTime}:00`;
    try {
      await this._hass.callService('smart_todo', 'snooze_task', {
        task_id: this._snoozeTaskId,
        snooze_until: snoozeUntil,
      }, undefined, false);
      this._snoozeTaskId = undefined;
      void this._fetchTasks(true);
    } catch (err) {
      this._error = `Failed to snooze task: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  private _renderSnoozePopover() {
    return html`
      <div class="snooze-popover">
        <span class="form-label">Snooze until</span>
        <div class="snooze-inputs">
          <input type="date" class="form-input snooze-date" .value=${this._snoozeDate}
            @input=${(e: Event) => this._snoozeDate = (e.target as HTMLInputElement).value} />
          <input type="time" class="form-input snooze-time" .value=${this._snoozeTime}
            @input=${(e: Event) => this._snoozeTime = (e.target as HTMLInputElement).value} />
        </div>
        <div class="form-actions">
          <button class="form-btn cancel" @click=${() => this._snoozeTaskId = undefined}>Cancel</button>
          <button class="form-btn submit" @click=${() => this._submitSnooze()}>Snooze</button>
        </div>
      </div>
    `;
  }

  private _formatDue(isoString: string): { text: string; overdue: boolean } {
    const due = new Date(isoString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffDays = Math.round((dueDay.getTime() - today.getTime()) / 86400000);
    const isPast = dueDay < today;

    let text: string;
    if (diffDays === 0) text = 'Today';
    else if (diffDays === 1) text = 'Tomorrow';
    else if (diffDays > 1 && diffDays <= 6)
      text = due.toLocaleDateString(undefined, { weekday: 'short' });
    else
      text = due.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

    return { text, overdue: isPast };
  }

  private _assigneeInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }

  private _dueClass(task: Task): string {
    if (task.completed) return '';
    const isSnoozed = task.snoozed_until != null && new Date(task.snoozed_until) > new Date();
    const effectiveDue = isSnoozed ? task.snoozed_until! : task.due_at;
    if (!effectiveDue) return '';
    const due = new Date(effectiveDue);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffDays = Math.round((dueDay.getTime() - todayStart.getTime()) / 86400000);
    if (diffDays < 0) return 'due-overdue-row';
    if (diffDays === 0) return 'due-today-row';
    if (diffDays <= 2) return 'due-soon-row';
    return '';
  }

  private _priorityColor(priority: number): string {
    if (priority === 3) return 'var(--error-color, #db4437)';
    if (priority === 2) return 'var(--primary-color, #0288d1)';
    return 'var(--secondary-text-color, #9e9e9e)';
  }

  private _renderTask(task: Task) {
    const isSnoozed =
      task.snoozed_until != null &&
      new Date(task.snoozed_until) > new Date();
    const effectiveDueStr = isSnoozed ? task.snoozed_until! : task.due_at;
    const due = effectiveDueStr ? this._formatDue(effectiveDueStr) : null;

    return html`
      <div class="task-row ${this._dueClass(task)}">
        <div
          class="task-priority"
          style="background:${this._priorityColor(task.priority)}"
        ></div>
        <div class="task-body">
          <div class="task-title-row">
            <span class="task-title ${task.completed ? 'completed' : ''}">${task.title}</span>
            ${task.overdue && !task.completed
              ? html`<span style="color:var(--error-color,#db4437)">&#9888;</span>`
              : nothing}
            ${isSnoozed ? html`<span>&#x1F4A4;</span>` : nothing}
          </div>
          ${due
            ? html`<div class="task-meta">
                <span class="${due.overdue && !task.completed ? 'due-overdue' : ''}">${due.text}</span>
                ${task.recurrence
                  ? html`<span class="recurrence-label">${task.recurrence}</span>`
                  : nothing}
              </div>`
            : task.recurrence
              ? html`<div class="task-meta">
                  <span class="recurrence-label">${task.recurrence}</span>
                </div>`
              : nothing}
        </div>
        <div class="task-row-right">
          ${task.points > 0
            ? html`<div class="points-badge"
                title="${[
                  task.reward_recipient
                    ? `Reward recipient: ${task.reward_recipient}`
                    : 'Falls back to assignee',
                  // points_earned is a lifetime cumulative total (it never
                  // resets on recurrence), so it's shown as separate context
                  // in the tooltip rather than as an "earned/potential"
                  // ratio next to task.points — for a recurring task
                  // completed several times that ratio can exceed 100% and
                  // reads as a bug (e.g. "15/5pts").
                  task.points_earned > 0 ? `Earned ${task.points_earned}pt(s) so far` : null,
                ].filter(Boolean).join(' · ')}">
                ${task.points}pts
              </div>`
            : nothing}
          ${task.assignee
            ? html`<div class="assignee-chip">${this._assigneeInitials(task.assignee)}</div>`
            : nothing}
          <div class="task-actions">
            <!-- Complete button (hidden if already completed) -->
            ${!task.completed ? html`
              <button class="action-btn complete" title="Complete"
                @click=${() => this._completeTask(task)}>✓</button>
            ` : nothing}

            <!-- Edit button -->
            <button class="action-btn edit" title="Edit"
              @click=${() => this._openEditForm(task)}>✎</button>

            <!-- Delete button — two-tap confirmation -->
            <button class="action-btn delete ${this._confirmDeleteId === task.id ? 'confirming' : ''}"
              title="${this._confirmDeleteId === task.id ? 'Tap again to confirm' : 'Delete'}"
              @click=${() => this._deleteTask(task.id)}>
              ${this._confirmDeleteId === task.id ? '✓?' : '🗑'}
            </button>

            <!-- Snooze button (hidden if completed) -->
            ${!task.completed ? html`
              <button class="action-btn snooze" title="Snooze"
                @click=${() => this._openSnooze(task.id)}>💤</button>
            ` : nothing}
          </div>
        </div>
      </div>

      <!-- Snooze popover (shown below this task row when active) -->
      ${this._snoozeTaskId === task.id ? this._renderSnoozePopover() : nothing}

      <!-- Recipient prompt (shown below this task row when active) -->
      ${this._pointsPromptTaskId === task.id ? this._renderPointsPromptPopover(task) : nothing}
    `;
  }
}

// Structured recurrence rule (RecurrenceRule.to_dict() in models.py) —
// needed to prefill the edit form's recurrence sub-fields; the plain
// `recurrence` string on Task is only a human-readable description.
export interface RecurrenceRuleDict {
  mode: string;
  interval_days: number | null;
  weekdays: number[] | null;
  week_parity: string | null;
  anchor_date: string | null;   // "YYYY-MM-DD"
  time_of_day: string | null;   // "HH:MM:SS"
}

// HA type for task row (populated in Stage 3)
export interface Task {
  id: string;
  title: string;
  notes?: string | null;
  priority: number;
  priority_label: string;
  assignee?: string | null;
  points: number;
  reward_recipient?: string | null;
  points_earned: number;
  due_at?: string | null;
  completed: boolean;
  overdue: boolean;
  snoozed_until?: string | null;
  recurrence?: string | null;
  recurrence_rule?: RecurrenceRuleDict | null;
  last_completed_at?: string | null;
  created_at: string;
  sort_order: number;
}

// Shape of the get_tasks service response (services.py's async_get_tasks).
export interface GetTasksResult {
  tasks: Task[];
  roster: string[];
}

// HACS card discovery
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: 'smart-todo-card',
  name: 'Smart Todo',
  description: 'Manage your Smart Todo recurring tasks.',
  preview: true,
});
