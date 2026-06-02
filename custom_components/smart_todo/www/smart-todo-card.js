"use strict";(()=>{var $e=Object.defineProperty;var xe=Object.getOwnPropertyDescriptor;var m=(o,e,t,s)=>{for(var r=s>1?void 0:s?xe(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(e,t,r):n(r))||r);return s&&r&&$e(e,t,r),r};var O=globalThis,N=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),se=new WeakMap,T=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(N&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=se.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&se.set(t,e))}return e}toString(){return this.cssText}},re=o=>new T(typeof o=="string"?o:o+"",void 0,W),q=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((s,r,i)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+o[i+1],o[0]);return new T(t,o,W)},ie=(o,e)=>{if(N)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=O.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,o.appendChild(s)}},B=N?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return re(t)})(o):o;var{is:Ae,defineProperty:we,getOwnPropertyDescriptor:ke,getOwnPropertyNames:Ee,getOwnPropertySymbols:Se,getPrototypeOf:Te}=Object,I=globalThis,oe=I.trustedTypes,De=oe?oe.emptyScript:"",ze=I.reactiveElementPolyfillSupport,D=(o,e)=>o,z={toAttribute(o,e){switch(e){case Boolean:o=o?De:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},L=(o,e)=>!Ae(o,e),ne={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:L};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ne){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&we(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){let{get:r,set:i}=ke(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:r,set(n){let l=r?.call(this);i?.call(this,n),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ne}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let e=Te(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let t=this.properties,s=[...Ee(t),...Se(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(B(r))}else e!==void 0&&t.push(B(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ie(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:z).toAttribute(t,s.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let i=s.getPropertyOptions(r),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:z;this._$Em=r;let l=n.fromAttribute(t,i.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(e,t,s,r=!1,i){if(e!==void 0){let n=this.constructor;if(r===!1&&(i=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??L)(i,t)||s.useDefault&&s.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:i},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,i]of s){let{wrapped:n}=i,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,i,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[D("elementProperties")]=new Map,y[D("finalized")]=new Map,ze?.({ReactiveElement:y}),(I.reactiveElementVersions??=[]).push("2.1.2");var Z=globalThis,ae=o=>o,F=Z.trustedTypes,le=F?F.createPolicy("lit-html",{createHTML:o=>o}):void 0,me="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,fe="?"+b,Pe=`<${fe}>`,w=document,C=()=>w.createComment(""),R=o=>o===null||typeof o!="object"&&typeof o!="function",Q=Array.isArray,Ce=o=>Q(o)||typeof o?.[Symbol.iterator]=="function",V=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ce=/-->/g,de=/>/g,x=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pe=/'/g,he=/"/g,_e=/^(?:script|style|textarea|title)$/i,ee=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),u=ee(1),We=ee(2),qe=ee(3),k=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),ue=new WeakMap,A=w.createTreeWalker(w,129);function ge(o,e){if(!Q(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return le!==void 0?le.createHTML(e):e}var Re=(o,e)=>{let t=o.length-1,s=[],r,i=e===2?"<svg>":e===3?"<math>":"",n=P;for(let l=0;l<t;l++){let a=o[l],d,_,p=-1,g=0;for(;g<a.length&&(n.lastIndex=g,_=n.exec(a),_!==null);)g=n.lastIndex,n===P?_[1]==="!--"?n=ce:_[1]!==void 0?n=de:_[2]!==void 0?(_e.test(_[2])&&(r=RegExp("</"+_[2],"g")),n=x):_[3]!==void 0&&(n=x):n===x?_[0]===">"?(n=r??P,p=-1):_[1]===void 0?p=-2:(p=n.lastIndex-_[2].length,d=_[1],n=_[3]===void 0?x:_[3]==='"'?he:pe):n===he||n===pe?n=x:n===ce||n===de?n=P:(n=x,r=void 0);let v=n===x&&o[l+1].startsWith("/>")?" ":"";i+=n===P?a+Pe:p>=0?(s.push(d),a.slice(0,p)+me+a.slice(p)+b+v):a+b+(p===-2?l:v)}return[ge(o,i+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},M=class o{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let i=0,n=0,l=e.length-1,a=this.parts,[d,_]=Re(e,t);if(this.el=o.createElement(d,s),A.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=A.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(me)){let g=_[n++],v=r.getAttribute(p).split(b),H=/([.?@])?(.*)/.exec(g);a.push({type:1,index:i,name:H[2],strings:v,ctor:H[1]==="."?K:H[1]==="?"?J:H[1]==="@"?G:S}),r.removeAttribute(p)}else p.startsWith(b)&&(a.push({type:6,index:i}),r.removeAttribute(p));if(_e.test(r.tagName)){let p=r.textContent.split(b),g=p.length-1;if(g>0){r.textContent=F?F.emptyScript:"";for(let v=0;v<g;v++)r.append(p[v],C()),A.nextNode(),a.push({type:2,index:++i});r.append(p[g],C())}}}else if(r.nodeType===8)if(r.data===fe)a.push({type:2,index:i});else{let p=-1;for(;(p=r.data.indexOf(b,p+1))!==-1;)a.push({type:7,index:i}),p+=b.length-1}i++}}static createElement(e,t){let s=w.createElement("template");return s.innerHTML=e,s}};function E(o,e,t=o,s){if(e===k)return e;let r=s!==void 0?t._$Co?.[s]:t._$Cl,i=R(e)?void 0:e._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(o),r._$AT(o,t,s)),s!==void 0?(t._$Co??=[])[s]=r:t._$Cl=r),r!==void 0&&(e=E(o,r._$AS(o,e.values),r,s)),e}var Y=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,r=(e?.creationScope??w).importNode(t,!0);A.currentNode=r;let i=A.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new U(i,i.nextSibling,this,e):a.type===1?d=new a.ctor(i,a.name,a.strings,this,e):a.type===6&&(d=new X(i,this,e)),this._$AV.push(d),a=s[++l]}n!==a?.index&&(i=A.nextNode(),n++)}return A.currentNode=w,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},U=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),R(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==k&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ce(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=M.createElement(ge(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(t);else{let i=new Y(r,this),n=i.u(this.options);i.p(t),this.T(n),this._$AH=i}}_$AC(e){let t=ue.get(e.strings);return t===void 0&&ue.set(e.strings,t=new M(e)),t}k(e){Q(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let i of e)r===t.length?t.push(s=new o(this.O(C()),this.O(C()),this,this.options)):s=t[r],s._$AI(i),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ae(e).nextSibling;ae(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,i){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(e,t=this,s,r){let i=this.strings,n=!1;if(i===void 0)e=E(this,e,t,0),n=!R(e)||e!==this._$AH&&e!==k,n&&(this._$AH=e);else{let l=e,a,d;for(e=i[0],a=0;a<i.length-1;a++)d=E(this,l[s+a],t,a),d===k&&(d=this._$AH[a]),n||=!R(d)||d!==this._$AH[a],d===c?e=c:e!==c&&(e+=(d??"")+i[a+1]),this._$AH[a]=d}n&&!r&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},K=class extends S{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},J=class extends S{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},G=class extends S{constructor(e,t,s,r,i){super(e,t,s,r,i),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??c)===k)return;let s=this._$AH,r=e===c&&s!==c||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==c&&(s===c||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},X=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var Me=Z.litHtmlPolyfillSupport;Me?.(M,U),(Z.litHtmlVersions??=[]).push("3.3.3");var ye=(o,e,t)=>{let s=t?.renderBefore??e,r=s._$litPart$;if(r===void 0){let i=t?.renderBefore??null;s._$litPart$=r=new U(e.insertBefore(C(),i),i,void 0,t??{})}return r._$AI(o),r};var te=globalThis,$=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ye(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};$._$litElement$=!0,$.finalized=!0,te.litElementHydrateSupport?.({LitElement:$});var Ue=te.litElementPolyfillSupport;Ue?.({LitElement:$});(te.litElementVersions??=[]).push("4.2.2");var ve=o=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(o,e)}):customElements.define(o,e)};var He={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:L},Oe=(o=He,e,t)=>{let{kind:s,metadata:r}=t,i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),s==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(t.name,o),s==="accessor"){let{name:n}=t;return{set(l){let a=e.get.call(this);e.set.call(this,l),this.requestUpdate(n,a,o,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,o,l),l}}}if(s==="setter"){let{name:n}=t;return function(l){let a=this[n];e.call(this,l),this.requestUpdate(n,a,o,!0,l)}}throw Error("Unsupported decorator location: "+s)};function be(o){return(e,t)=>typeof t=="object"?Oe(o,e,t):((s,r,i)=>{let n=r.hasOwnProperty(i);return r.constructor.createProperty(i,s),n?Object.getOwnPropertyDescriptor(r,i):void 0})(o,e,t)}function f(o){return be({...o,state:!0,attribute:!1})}var h=class extends ${constructor(){super(...arguments);this._tasks=[];this._loading=!1;this._showForm=!1;this._formTitle="";this._formDue="";this._formPriority=2;this._formAssignee="";this._formRecurrenceType="none";this._formWeekdays=[];this._formTime="09:00";this._formIntervalDays=7;this._formAnchorDate="";this._formSubmitting=!1;this._snoozeDate="";this._snoozeTime="08:00"}setConfig(t){if(!t.entity)throw new Error('smart-todo-card: "entity" is required in card config.');this._config=t}set hass(t){if(this._hass=t,!this._config?.entity)return;let s=this._hass.states[this._config.entity];if(!s)return;let r=s.last_updated;r!==this._lastUpdated&&(this._lastUpdated=r,clearTimeout(this._debounceTimer),this._debounceTimer=setTimeout(()=>this._fetchTasks(),500))}get hass(){return this._hass}async _fetchTasks(){if(!(!this._hass||!this._config)){this._loading=!0,this._error=void 0;try{let t=await this._hass.callService("smart_todo","get_tasks",{},void 0,!1,!0),s=t.response?.tasks??t.tasks??[];this._tasks=s}catch(t){let s=t instanceof Error?t.message:typeof t=="object"&&t!==null&&"message"in t?String(t.message):JSON.stringify(t);this._error=`Failed to load tasks: ${s}`}finally{this._loading=!1}}}render(){if(!this._config)return c;let t=this._tasks.length,s=this._tasks.filter(i=>i.overdue&&!i.completed).length,r=this._config.title??"Smart Todo";return u`
      <ha-card>
        <div class="header">
          <span class="title">${r}</span>
          ${this._loading?c:u`<span class="summary">
                ${t} task${t!==1?"s":""}${s?u` · <span style="color:var(--error-color)">${s} overdue</span>`:""}
              </span>`}
        </div>

        ${this._error?u`<div class="error">${this._error}</div>`:c}

        ${this._loading?u`<div class="loading">Loading tasks…</div>`:this._tasks.length===0?u`<div class="placeholder">No tasks yet — click + to add one.</div>`:u`<div class="task-list">
                ${this._tasks.slice().sort((i,n)=>{if(i.completed!==n.completed)return i.completed?1:-1;let l=_=>{if(!_)return Number.MAX_SAFE_INTEGER;let p=new Date(_).getTime();return isNaN(p)?Number.MAX_SAFE_INTEGER:p},a=l(i.due_at),d=l(n.due_at);return a!==d?a<d?-1:1:i.sort_order-n.sort_order}).map(i=>this._renderTask(i))}
              </div>`}

        ${this._showForm?u`
          <div class="form-panel">
            <div class="form-title">Add task</div>

            <!-- Title (required) -->
            <label class="form-label">Title *</label>
            <input class="form-input" type="text" .value=${this._formTitle}
              @input=${i=>this._formTitle=i.target.value}
              placeholder="Task title" />

            <!-- Due date (optional) -->
            <label class="form-label">Due date</label>
            <input class="form-input" type="date" .value=${this._formDue}
              @input=${i=>this._formDue=i.target.value} />

            <!-- Priority -->
            <label class="form-label">Priority</label>
            <div class="priority-buttons">
              ${[1,2,3].map(i=>u`
                <button class="priority-btn ${this._formPriority===i?"active":""}"
                  style="--btn-color:${this._priorityColor(i)}"
                  @click=${()=>this._formPriority=i}>
                  ${{1:"Low",2:"Medium",3:"High"}[i]}
                </button>`)}
            </div>

            <!-- Assignee -->
            <label class="form-label">Assignee</label>
            <input class="form-input" type="text" .value=${this._formAssignee}
              @input=${i=>this._formAssignee=i.target.value}
              placeholder="Optional" />

            <!-- Recurrence type -->
            <label class="form-label">Recurrence</label>
            <select class="form-input" .value=${this._formRecurrenceType}
              @change=${i=>this._formRecurrenceType=i.target.value}>
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
              <button class="form-btn cancel" @click=${()=>this._showForm=!1}>Cancel</button>
              <button class="form-btn submit" ?disabled=${this._formSubmitting||!this._formTitle.trim()}
                @click=${()=>this._submitForm()}>
                ${this._formSubmitting?"Adding\u2026":"Add task"}
              </button>
            </div>
          </div>
        `:c}

        <button class="fab" @click=${()=>this._openForm()} title="Add task">+</button>
      </ha-card>
    `}_openForm(){this._showForm=!0,this._formTitle="",this._formDue="",this._formPriority=2,this._formAssignee="",this._formRecurrenceType="none",this._formWeekdays=[],this._formTime="09:00",this._formIntervalDays=7,this._formAnchorDate=new Date().toISOString().slice(0,10),this._formSubmitting=!1}_renderRecurrenceSubFields(){let t=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];switch(this._formRecurrenceType){case"weekly":case"biweekly":return u`
          <label class="form-label">Day(s)</label>
          <div class="weekday-picker">
            ${t.map((s,r)=>u`
              <button class="day-btn ${this._formWeekdays.includes(r)?"active":""}"
                @click=${()=>this._toggleWeekday(r)}>${s}</button>`)}
          </div>
          <label class="form-label">Time</label>
          <input class="form-input" type="time" .value=${this._formTime}
            @input=${s=>this._formTime=s.target.value} />
          ${this._formRecurrenceType==="biweekly"?u`
            <label class="form-label">Starting from (anchor date)</label>
            <input class="form-input" type="date" .value=${this._formAnchorDate}
              @input=${s=>this._formAnchorDate=s.target.value} />
          `:c}
        `;case"interval_days":case"rolling_days":return u`
          <label class="form-label">Every</label>
          <input class="form-input" type="number" min="1" max="365"
            .value=${String(this._formIntervalDays)}
            @input=${s=>this._formIntervalDays=parseInt(s.target.value)||1} />
          <span class="form-hint">days${this._formRecurrenceType==="rolling_days"?" after completion":""}</span>
        `;default:return c}}_toggleWeekday(t){this._formWeekdays.includes(t)?this._formWeekdays=this._formWeekdays.filter(s=>s!==t):this._formWeekdays=[...this._formWeekdays,t]}_buildRecurrenceDict(){let t=this._formTime?`${this._formTime}:00`:null;switch(this._formRecurrenceType){case"daily":return{mode:"interval_days",interval_days:1};case"weekly":return{mode:"weekly",weekdays:this._formWeekdays,time_of_day:t};case"interval_days":return{mode:"interval_days",interval_days:this._formIntervalDays};case"rolling_days":return{mode:"rolling_days",interval_days:this._formIntervalDays};case"biweekly":return{mode:"biweekly_weekdays",weekdays:this._formWeekdays,time_of_day:t,anchor_date:this._formAnchorDate};default:return null}}async _submitForm(){if(!this._formTitle.trim()||!this._hass)return;this._formSubmitting=!0;let t={title:this._formTitle.trim(),priority:this._formPriority};this._formDue&&(t.due_at=`${this._formDue}T00:00:00`),this._formAssignee.trim()&&(t.assignee=this._formAssignee.trim());let s=this._buildRecurrenceDict();s&&(t.recurrence=s);try{await this._hass.callService("smart_todo","create_task",t,void 0,!1),this._showForm=!1}catch(r){this._error=`Failed to create task: ${r instanceof Error?r.message:String(r)}`}finally{this._formSubmitting=!1}}async _completeTask(t){try{await this._hass.callService("smart_todo","complete_task",{task_id:t},void 0,!1)}catch(s){this._error=`Failed to complete task: ${s instanceof Error?s.message:String(s)}`}}_deleteTask(t){this._confirmDeleteId===t?(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=void 0,this._hass.callService("smart_todo","delete_task",{task_id:t},void 0,!1).catch(s=>{this._error=`Failed to delete task: ${s instanceof Error?s.message:String(s)}`})):(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=t,this._confirmDeleteTimer=setTimeout(()=>{this._confirmDeleteId=void 0},3e3))}_openSnooze(t){this._snoozeTaskId=this._snoozeTaskId===t?void 0:t;let s=new Date;s.setDate(s.getDate()+1),this._snoozeDate=s.toISOString().slice(0,10),this._snoozeTime="08:00"}async _submitSnooze(){if(!this._snoozeTaskId||!this._snoozeDate)return;let t=`${this._snoozeDate}T${this._snoozeTime}:00`;try{await this._hass.callService("smart_todo","snooze_task",{task_id:this._snoozeTaskId,snooze_until:t},void 0,!1),this._snoozeTaskId=void 0}catch(s){this._error=`Failed to snooze task: ${s instanceof Error?s.message:String(s)}`}}_renderSnoozePopover(){return u`
      <div class="snooze-popover">
        <span class="form-label">Snooze until</span>
        <div class="snooze-inputs">
          <input type="date" class="form-input snooze-date" .value=${this._snoozeDate}
            @input=${t=>this._snoozeDate=t.target.value} />
          <input type="time" class="form-input snooze-time" .value=${this._snoozeTime}
            @input=${t=>this._snoozeTime=t.target.value} />
        </div>
        <div class="form-actions">
          <button class="form-btn cancel" @click=${()=>this._snoozeTaskId=void 0}>Cancel</button>
          <button class="form-btn submit" @click=${()=>this._submitSnooze()}>Snooze</button>
        </div>
      </div>
    `}_formatDue(t){let s=new Date(t),r=new Date,i=new Date(r.getFullYear(),r.getMonth(),r.getDate()),n=new Date(s.getFullYear(),s.getMonth(),s.getDate()),l=Math.round((n.getTime()-i.getTime())/864e5),a=n<i,d;return l===0?d="Today":l===1?d="Tomorrow":l>1&&l<=6?d=s.toLocaleDateString(void 0,{weekday:"short"}):d=s.toLocaleDateString(void 0,{day:"numeric",month:"short"}),{text:d,overdue:a}}_assigneeInitials(t){let s=t.trim().split(/\s+/);return s.length>=2?(s[0][0]+s[1][0]).toUpperCase():s[0].slice(0,2).toUpperCase()}_dueClass(t){if(t.completed||!t.due_at)return"";let s=new Date(t.due_at),r=new Date,i=new Date(r.getFullYear(),r.getMonth(),r.getDate()),n=new Date(s.getFullYear(),s.getMonth(),s.getDate()),l=Math.round((n.getTime()-i.getTime())/864e5);return l<0?"due-overdue-row":l===0?"due-today-row":l<=2?"due-soon-row":""}_priorityColor(t){return t===3?"var(--error-color, #db4437)":t===2?"var(--primary-color, #0288d1)":"var(--secondary-text-color, #9e9e9e)"}_renderTask(t){let s=t.due_at?this._formatDue(t.due_at):null,r=t.snoozed_until!=null&&new Date(t.snoozed_until)>new Date;return u`
      <div class="task-row ${this._dueClass(t)}">
        <div
          class="task-priority"
          style="background:${this._priorityColor(t.priority)}"
        ></div>
        <div class="task-body">
          <div class="task-title-row">
            <span class="task-title ${t.completed?"completed":""}">${t.title}</span>
            ${t.overdue&&!t.completed?u`<span style="color:var(--error-color,#db4437)">&#9888;</span>`:c}
            ${r?u`<span>&#x1F4A4;</span>`:c}
          </div>
          ${s?u`<div class="task-meta">
                <span class="${s.overdue&&!t.completed?"due-overdue":""}">${s.text}</span>
                ${t.recurrence?u`<span class="recurrence-label">${t.recurrence}</span>`:c}
              </div>`:t.recurrence?u`<div class="task-meta">
                  <span class="recurrence-label">${t.recurrence}</span>
                </div>`:c}
        </div>
        <div class="task-row-right">
          ${t.assignee?u`<div class="assignee-chip">${this._assigneeInitials(t.assignee)}</div>`:c}
          <div class="task-actions">
            <!-- Complete button (hidden if already completed) -->
            ${t.completed?c:u`
              <button class="action-btn complete" title="Complete"
                @click=${()=>this._completeTask(t.id)}>✓</button>
            `}

            <!-- Delete button — two-tap confirmation -->
            <button class="action-btn delete ${this._confirmDeleteId===t.id?"confirming":""}"
              title="${this._confirmDeleteId===t.id?"Tap again to confirm":"Delete"}"
              @click=${()=>this._deleteTask(t.id)}>
              ${this._confirmDeleteId===t.id?"\u2713?":"\u{1F5D1}"}
            </button>

            <!-- Snooze button (hidden if completed) -->
            ${t.completed?c:u`
              <button class="action-btn snooze" title="Snooze"
                @click=${()=>this._openSnooze(t.id)}>💤</button>
            `}
          </div>
        </div>
      </div>

      <!-- Snooze popover (shown below this task row when active) -->
      ${this._snoozeTaskId===t.id?this._renderSnoozePopover():c}
    `}};h.styles=q`
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
      border: 1px solid var(--divider-color, rgba(255,255,255,0.2));
      border-radius: 6px;
      background: var(--input-fill-color, rgba(255,255,255,0.08));
      color: var(--primary-text-color, #e0e0e0);
      font-size: 0.9rem;
      box-sizing: border-box;
      transition: border-color 0.15s;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--primary-color, #0288d1);
    }
    .form-input::placeholder {
      color: var(--secondary-text-color, rgba(255,255,255,0.5));
      opacity: 0.8;
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
      background: var(--input-fill-color, rgba(255,255,255,0.08));
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
  `,m([f()],h.prototype,"_config",2),m([f()],h.prototype,"_tasks",2),m([f()],h.prototype,"_loading",2),m([f()],h.prototype,"_error",2),m([f()],h.prototype,"_showForm",2),m([f()],h.prototype,"_formTitle",2),m([f()],h.prototype,"_formDue",2),m([f()],h.prototype,"_formPriority",2),m([f()],h.prototype,"_formAssignee",2),m([f()],h.prototype,"_formRecurrenceType",2),m([f()],h.prototype,"_formWeekdays",2),m([f()],h.prototype,"_formTime",2),m([f()],h.prototype,"_formIntervalDays",2),m([f()],h.prototype,"_formAnchorDate",2),m([f()],h.prototype,"_formSubmitting",2),m([f()],h.prototype,"_confirmDeleteId",2),m([f()],h.prototype,"_confirmDeleteTimer",2),m([f()],h.prototype,"_snoozeTaskId",2),m([f()],h.prototype,"_snoozeDate",2),m([f()],h.prototype,"_snoozeTime",2),h=m([ve("smart-todo-card")],h);window.customCards=window.customCards??[];window.customCards.push({type:"smart-todo-card",name:"Smart Todo",description:"Manage your Smart Todo recurring tasks.",preview:!1});})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
