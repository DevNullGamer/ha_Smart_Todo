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

interface SmartTodoCardConfig {
  entity: string;
  title?: string;
}

@customElement('smart-todo-card')
export class SmartTodoCard extends LitElement {
  private _hass!: Hass;

  @state() private _config?: SmartTodoCardConfig;
  @state() private _tasks: Task[] = [];
  @state() private _loading = false;
  @state() private _error?: string;

  @state() private _showForm = false;
  @state() private _formTitle = '';
  @state() private _formDue = '';
  @state() private _formPriority = 2;
  @state() private _formAssignee = '';
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
  `;

  setConfig(config: SmartTodoCardConfig): void {
    if (!config.entity) {
      throw new Error('smart-todo-card: "entity" is required in card config.');
    }
    this._config = config;
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

  private async _fetchTasks(): Promise<void> {
    if (!this._hass || !this._config) return;
    this._loading = true;
    this._error = undefined;
    try {
      const raw = await this._hass.callService(
        'smart_todo',
        'get_tasks',
        {},
        undefined,
        false,   // notifyOnFailure
        true,    // returnResponse
      ) as { tasks?: Task[] } | { response?: { tasks?: Task[] } };
      // HA wraps service response data under .response in some versions
      const tasks = (raw as { response?: { tasks?: Task[] } }).response?.tasks
        ?? (raw as { tasks?: Task[] }).tasks
        ?? [];
      this._tasks = tasks;
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

  override render() {
    if (!this._config) return nothing;

    const totalTasks = this._tasks.length;
    const overdueCnt = this._tasks.filter(t => t.overdue && !t.completed).length;
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
            : html`<div class="task-list">
                ${this._tasks
                  .slice()
                  .sort((a, b) => {
                    if (a.completed !== b.completed) return a.completed ? 1 : -1;
                    const toMs = (s: string | null | undefined) => {
                      if (!s) return Number.MAX_SAFE_INTEGER;
                      // Truncate microseconds → milliseconds so all browsers parse correctly
                      const ms = new Date(s.replace(/(\.\d{3})\d+/, '$1')).getTime();
                      return isNaN(ms) ? Number.MAX_SAFE_INTEGER : ms;
                    };
                    const aMs = toMs(a.due_at);
                    const bMs = toMs(b.due_at);
                    if (aMs !== bMs) return aMs < bMs ? -1 : 1;
                    return a.sort_order - b.sort_order;
                  })
                  .map(task => this._renderTask(task))}
              </div>`}

        ${this._showForm ? html`
          <div class="form-panel">
            <div class="form-title">Add task</div>

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
              @input=${(e: Event) => this._formAssignee = (e.target as HTMLInputElement).value}
              placeholder="Optional" />

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
            </select>

            <!-- Conditional sub-fields -->
            ${this._renderRecurrenceSubFields()}

            <!-- Form actions -->
            <div class="form-actions">
              <button class="form-btn cancel" @click=${() => this._showForm = false}>Cancel</button>
              <button class="form-btn submit" ?disabled=${this._formSubmitting || !this._formTitle.trim()}
                @click=${() => this._submitForm()}>
                ${this._formSubmitting ? 'Adding…' : 'Add task'}
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
    this._formTitle = '';
    this._formDue = '';
    this._formPriority = 2;
    this._formAssignee = '';
    this._formRecurrenceType = 'none';
    this._formWeekdays = [];
    this._formTime = '09:00';
    this._formIntervalDays = 7;
    this._formAnchorDate = new Date().toISOString().slice(0, 10); // today YYYY-MM-DD
    this._formSubmitting = false;
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
      default:
        return null;
    }
  }

  private async _submitForm(): Promise<void> {
    if (!this._formTitle.trim() || !this._hass) return;
    this._formSubmitting = true;

    const data: Record<string, unknown> = {
      title: this._formTitle.trim(),
      priority: this._formPriority,
    };
    if (this._formDue) data['due_at'] = `${this._formDue}T00:00:00`;
    if (this._formAssignee.trim()) data['assignee'] = this._formAssignee.trim();
    const recurrence = this._buildRecurrenceDict();
    if (recurrence) data['recurrence'] = recurrence;

    try {
      await this._hass.callService('smart_todo', 'create_task', data, undefined, false);
      this._showForm = false;
      // Re-fetch will trigger via hass last_updated change
    } catch (err) {
      this._error = `Failed to create task: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      this._formSubmitting = false;
    }
  }

  private async _completeTask(taskId: string): Promise<void> {
    try {
      await this._hass.callService('smart_todo', 'complete_task', { task_id: taskId }, undefined, false);
    } catch (err) {
      this._error = `Failed to complete task: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  private _deleteTask(taskId: string): void {
    if (this._confirmDeleteId === taskId) {
      // Second tap — confirmed
      clearTimeout(this._confirmDeleteTimer);
      this._confirmDeleteId = undefined;
      this._hass.callService('smart_todo', 'delete_task', { task_id: taskId }, undefined, false)
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
    if (task.completed || !task.due_at) return '';
    const due = new Date(task.due_at);
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
    const due = task.due_at ? this._formatDue(task.due_at) : null;
    const isSnoozed =
      task.snoozed_until != null &&
      new Date(task.snoozed_until) > new Date();

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
          ${task.assignee
            ? html`<div class="assignee-chip">${this._assigneeInitials(task.assignee)}</div>`
            : nothing}
          <div class="task-actions">
            <!-- Complete button (hidden if already completed) -->
            ${!task.completed ? html`
              <button class="action-btn complete" title="Complete"
                @click=${() => this._completeTask(task.id)}>✓</button>
            ` : nothing}

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
    `;
  }
}

// HA type for task row (populated in Stage 3)
export interface Task {
  id: string;
  title: string;
  notes?: string | null;
  priority: number;
  priority_label: string;
  assignee?: string | null;
  due_at?: string | null;
  completed: boolean;
  overdue: boolean;
  snoozed_until?: string | null;
  recurrence?: string | null;
  last_completed_at?: string | null;
  created_at: string;
  sort_order: number;
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
  preview: false,
});
