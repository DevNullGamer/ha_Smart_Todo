"use strict";(()=>{var xe=Object.defineProperty;var we=Object.getOwnPropertyDescriptor;var m=(i,e,t,r)=>{for(var s=r>1?void 0:r?we(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&xe(e,t,s),s};var O=globalThis,N=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),ie=new WeakMap,D=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(N&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=ie.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&ie.set(t,e))}return e}toString(){return this.cssText}},oe=i=>new D(typeof i=="string"?i:i+"",void 0,B),L=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new D(t,i,B)},ne=(i,e)=>{if(N)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=O.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,i.appendChild(r)}},V=N?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return oe(t)})(i):i;var{is:Ae,defineProperty:ke,getOwnPropertyDescriptor:Ee,getOwnPropertyNames:Se,getOwnPropertySymbols:Te,getPrototypeOf:De}=Object,F=globalThis,ae=F.trustedTypes,Ce=ae?ae.emptyScript:"",ze=F.reactiveElementPolyfillSupport,C=(i,e)=>i,z={toAttribute(i,e){switch(e){case Boolean:i=i?Ce:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},j=(i,e)=>!Ae(i,e),le={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=le){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&ke(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){let{get:s,set:n}=Ee(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??le}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let e=De(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let t=this.properties,r=[...Se(t),...Te(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(V(s))}else e!==void 0&&t.push(V(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ne(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:z).toAttribute(t,r.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let n=r.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:z;this._$Em=s;let a=o.fromAttribute(t,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,t,r,s=!1,n){if(e!==void 0){let o=this.constructor;if(s===!1&&(n=this[e]),r??=o.getPropertyOptions(e),!((r.hasChanged??j)(n,t)||r.useDefault&&r.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,n]of r){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[C("elementProperties")]=new Map,v[C("finalized")]=new Map,ze?.({ReactiveElement:v}),(F.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,ce=i=>i,W=Q.trustedTypes,de=W?W.createPolicy("lit-html",{createHTML:i=>i}):void 0,_e="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,ge="?"+$,Me=`<${ge}>`,A=document,P=()=>A.createComment(""),R=i=>i===null||typeof i!="object"&&typeof i!="function",ee=Array.isArray,Pe=i=>ee(i)||typeof i?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,he=/>/g,x=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ue=/'/g,me=/"/g,ve=/^(?:script|style|textarea|title)$/i,te=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),h=te(1),qe=te(2),Be=te(3),k=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),fe=new WeakMap,w=A.createTreeWalker(A,129);function ye(i,e){if(!ee(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return de!==void 0?de.createHTML(e):e}var Re=(i,e)=>{let t=i.length-1,r=[],s,n=e===2?"<svg>":e===3?"<math>":"",o=M;for(let a=0;a<t;a++){let l=i[a],p,f,d=-1,g=0;for(;g<l.length&&(o.lastIndex=g,f=o.exec(l),f!==null);)g=o.lastIndex,o===M?f[1]==="!--"?o=pe:f[1]!==void 0?o=he:f[2]!==void 0?(ve.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=x):f[3]!==void 0&&(o=x):o===x?f[0]===">"?(o=s??M,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?x:f[3]==='"'?me:ue):o===me||o===ue?o=x:o===pe||o===he?o=M:(o=x,s=void 0);let b=o===x&&i[a+1].startsWith("/>")?" ":"";n+=o===M?l+Me:d>=0?(r.push(p),l.slice(0,d)+_e+l.slice(d)+$+b):l+$+(d===-2?a:b)}return[ye(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},H=class i{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let n=0,o=0,a=e.length-1,l=this.parts,[p,f]=Re(e,t);if(this.el=i.createElement(p,r),w.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=w.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(_e)){let g=f[o++],b=s.getAttribute(d).split($),I=/([.?@])?(.*)/.exec(g);l.push({type:1,index:n,name:I[2],strings:b,ctor:I[1]==="."?K:I[1]==="?"?J:I[1]==="@"?G:S}),s.removeAttribute(d)}else d.startsWith($)&&(l.push({type:6,index:n}),s.removeAttribute(d));if(ve.test(s.tagName)){let d=s.textContent.split($),g=d.length-1;if(g>0){s.textContent=W?W.emptyScript:"";for(let b=0;b<g;b++)s.append(d[b],P()),w.nextNode(),l.push({type:2,index:++n});s.append(d[g],P())}}}else if(s.nodeType===8)if(s.data===ge)l.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf($,d+1))!==-1;)l.push({type:7,index:n}),d+=$.length-1}n++}}static createElement(e,t){let r=A.createElement("template");return r.innerHTML=e,r}};function E(i,e,t=i,r){if(e===k)return e;let s=r!==void 0?t._$Co?.[r]:t._$Cl,n=R(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,t,r)),r!==void 0?(t._$Co??=[])[r]=s:t._$Cl=s),s!==void 0&&(e=E(i,s._$AS(i,e.values),s,r)),e}var X=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??A).importNode(t,!0);w.currentNode=s;let n=w.nextNode(),o=0,a=0,l=r[0];for(;l!==void 0;){if(o===l.index){let p;l.type===2?p=new U(n,n.nextSibling,this,e):l.type===1?p=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(p=new Z(n,this,e)),this._$AV.push(p),l=r[++a]}o!==l?.index&&(n=w.nextNode(),o++)}return w.currentNode=A,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},U=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),R(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==k&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Pe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=H.createElement(ye(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new X(s,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=fe.get(e.strings);return t===void 0&&fe.set(e.strings,t=new H(e)),t}k(e){ee(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let n of e)s===t.length?t.push(r=new i(this.O(P()),this.O(P()),this,this.options)):r=t[s],r._$AI(n),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=ce(e).nextSibling;ce(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,n){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=c}_$AI(e,t=this,r,s){let n=this.strings,o=!1;if(n===void 0)e=E(this,e,t,0),o=!R(e)||e!==this._$AH&&e!==k,o&&(this._$AH=e);else{let a=e,l,p;for(e=n[0],l=0;l<n.length-1;l++)p=E(this,a[r+l],t,l),p===k&&(p=this._$AH[l]),o||=!R(p)||p!==this._$AH[l],p===c?e=c:e!==c&&(e+=(p??"")+n[l+1]),this._$AH[l]=p}o&&!s&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},K=class extends S{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},J=class extends S{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},G=class extends S{constructor(e,t,r,s,n){super(e,t,r,s,n),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??c)===k)return;let r=this._$AH,s=e===c&&r!==c||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,n=e!==c&&(r===c||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Z=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var He=Q.litHtmlPolyfillSupport;He?.(H,U),(Q.litHtmlVersions??=[]).push("3.3.3");var be=(i,e,t)=>{let r=t?.renderBefore??e,s=r._$litPart$;if(s===void 0){let n=t?.renderBefore??null;r._$litPart$=s=new U(e.insertBefore(P(),n),n,void 0,t??{})}return s._$AI(i),s};var re=globalThis,y=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=be(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};y._$litElement$=!0,y.finalized=!0,re.litElementHydrateSupport?.({LitElement:y});var Ue=re.litElementPolyfillSupport;Ue?.({LitElement:y});(re.litElementVersions??=[]).push("4.2.2");var se=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};var Ie={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:j},Oe=(i=Ie,e,t)=>{let{kind:r,metadata:s}=t,n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(t.name,i),r==="accessor"){let{name:o}=t;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,i,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,i,a),a}}}if(r==="setter"){let{name:o}=t;return function(a){let l=this[o];e.call(this,a),this.requestUpdate(o,l,i,!0,a)}}throw Error("Unsupported decorator location: "+r)};function $e(i){return(e,t)=>typeof t=="object"?Oe(i,e,t):((r,s,n)=>{let o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,e,t)}function _(i){return $e({...i,state:!0,attribute:!1})}var T=class extends y{constructor(){super(...arguments);this._config={entity:""}}set hass(t){}setConfig(t){this._config={...t}}_valueChanged(t,r){let s={...this._config,[t]:r};s.filter!=="x_days"&&s.filter!=="x_days_plus_overdue"&&delete s.filter_days,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){let t=this._config.filter??"all",r=t==="x_days"||t==="x_days_plus_overdue";return h`
      <div class="editor-row">
        <label class="editor-label">Entity *</label>
        <input class="editor-input" type="text"
          .value=${this._config.entity}
          placeholder="smart_todo.tasks"
          @input=${s=>this._valueChanged("entity",s.target.value)} />
        <span class="editor-hint">The smart_todo sensor entity ID</span>
      </div>

      <div class="editor-row">
        <label class="editor-label">Title</label>
        <input class="editor-input" type="text"
          .value=${this._config.title??""}
          placeholder="Smart Todo"
          @input=${s=>this._valueChanged("title",s.target.value||void 0)} />
      </div>

      <div class="editor-row">
        <label class="editor-label">Show tasks</label>
        <select class="editor-input"
          .value=${t}
          @change=${s=>this._valueChanged("filter",s.target.value)}>
          <option value="all">All tasks</option>
          <option value="overdue">Only overdue</option>
          <option value="today">Only today</option>
          <option value="today_plus_overdue">Today + overdue</option>
          <option value="x_days">Within X days</option>
          <option value="x_days_plus_overdue">Within X days + overdue</option>
        </select>
      </div>

      ${r?h`
        <div class="editor-row">
          <label class="editor-label">Days (X)</label>
          <input class="editor-input" type="number" min="1" max="365"
            .value=${String(this._config.filter_days??7)}
            @input=${s=>this._valueChanged("filter_days",parseInt(s.target.value)||7)} />
          <span class="editor-hint">Show tasks due within this many days from today</span>
        </div>
      `:c}
    `}};T.styles=L`
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
  `,m([_()],T.prototype,"_config",2),T=m([se("smart-todo-card-editor")],T);var u=class extends y{constructor(){super(...arguments);this._tasks=[];this._loading=!1;this._showForm=!1;this._formTitle="";this._formDue="";this._formPriority=2;this._formAssignee="";this._formRecurrenceType="none";this._formWeekdays=[];this._formTime="09:00";this._formIntervalDays=7;this._formAnchorDate="";this._formSubmitting=!1;this._snoozeDate="";this._snoozeTime="08:00"}static getConfigElement(){return document.createElement("smart-todo-card-editor")}static getStubConfig(){return{entity:"",filter:"all"}}setConfig(t){if(!t.entity)throw new Error('smart-todo-card: "entity" is required in card config.');this._config=t}set hass(t){if(this._hass=t,!this._config?.entity)return;let r=this._hass.states[this._config.entity];if(!r)return;let s=r.last_updated;s!==this._lastUpdated&&(this._lastUpdated=s,clearTimeout(this._debounceTimer),this._debounceTimer=setTimeout(()=>this._fetchTasks(),500))}get hass(){return this._hass}async _fetchTasks(){if(!(!this._hass||!this._config)){this._loading=!0,this._error=void 0;try{let t=await this._hass.callService("smart_todo","get_tasks",{},void 0,!1,!0),r=t.response?.tasks??t.tasks??[];this._tasks=r}catch(t){let r=t instanceof Error?t.message:typeof t=="object"&&t!==null&&"message"in t?String(t.message):JSON.stringify(t);this._error=`Failed to load tasks: ${r}`}finally{this._loading=!1}}}_getFilteredTasks(){let t=this._config?.filter??"all";if(t==="all")return this._tasks;let r=new Date,s=new Date(r.getFullYear(),r.getMonth(),r.getDate()),n=this._config?.filter_days??7;return this._tasks.filter(o=>{if(o.completed)return!1;let a=o.overdue===!0;if(t==="overdue")return a;let l=1/0;if(o.due_at){let d=new Date(o.due_at.replace(/(\.\d{3})\d+/,"$1")),g=new Date(d.getFullYear(),d.getMonth(),d.getDate());l=Math.round((g.getTime()-s.getTime())/864e5)}let p=l===0,f=l>=0&&l<=n;switch(t){case"today":return p&&!a;case"today_plus_overdue":return p||a;case"x_days":return f&&!a;case"x_days_plus_overdue":return f||a;default:return!0}})}render(){if(!this._config)return c;let t=this._getFilteredTasks(),r=t.length,s=t.filter(o=>o.overdue&&!o.completed).length,n=this._config.title??"Smart Todo";return h`
      <ha-card>
        <div class="header">
          <span class="title">${n}</span>
          ${this._loading?c:h`<span class="summary">
                ${r} task${r!==1?"s":""}${s?h` · <span style="color:var(--error-color)">${s} overdue</span>`:""}
              </span>`}
        </div>

        ${this._error?h`<div class="error">${this._error}</div>`:c}

        ${this._loading?h`<div class="loading">Loading tasks…</div>`:this._tasks.length===0?h`<div class="placeholder">No tasks yet — click + to add one.</div>`:t.length===0?h`<div class="placeholder">No tasks match the current filter.</div>`:h`<div class="task-list">
                  ${t.slice().sort((o,a)=>{if(o.completed!==a.completed)return o.completed?1:-1;let l=d=>{if(!d)return Number.MAX_SAFE_INTEGER;let g=new Date(d.replace(/(\.\d{3})\d+/,"$1")).getTime();return isNaN(g)?Number.MAX_SAFE_INTEGER:g},p=l(o.due_at),f=l(a.due_at);return p!==f?p<f?-1:1:o.sort_order-a.sort_order}).map(o=>this._renderTask(o))}
              </div>`}

        ${this._showForm?h`
          <div class="form-panel">
            <div class="form-title">Add task</div>

            <!-- Title (required) -->
            <label class="form-label">Title *</label>
            <input class="form-input" type="text" .value=${this._formTitle}
              @input=${o=>this._formTitle=o.target.value}
              placeholder="Task title" />

            <!-- Due date (optional) -->
            <label class="form-label">Due date</label>
            <input class="form-input" type="date" .value=${this._formDue}
              @input=${o=>this._formDue=o.target.value} />

            <!-- Priority -->
            <label class="form-label">Priority</label>
            <div class="priority-buttons">
              ${[1,2,3].map(o=>h`
                <button class="priority-btn ${this._formPriority===o?"active":""}"
                  style="--btn-color:${this._priorityColor(o)}"
                  @click=${()=>this._formPriority=o}>
                  ${{1:"Low",2:"Medium",3:"High"}[o]}
                </button>`)}
            </div>

            <!-- Assignee -->
            <label class="form-label">Assignee</label>
            <input class="form-input" type="text" .value=${this._formAssignee}
              @input=${o=>this._formAssignee=o.target.value}
              placeholder="Optional" />

            <!-- Recurrence type -->
            <label class="form-label">Recurrence</label>
            <select class="form-input" .value=${this._formRecurrenceType}
              @change=${o=>this._formRecurrenceType=o.target.value}>
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
    `}_openForm(){this._showForm=!0,this._formTitle="",this._formDue="",this._formPriority=2,this._formAssignee="",this._formRecurrenceType="none",this._formWeekdays=[],this._formTime="09:00",this._formIntervalDays=7,this._formAnchorDate=new Date().toISOString().slice(0,10),this._formSubmitting=!1}_renderRecurrenceSubFields(){let t=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];switch(this._formRecurrenceType){case"weekly":case"biweekly":return h`
          <label class="form-label">Day(s)</label>
          <div class="weekday-picker">
            ${t.map((r,s)=>h`
              <button class="day-btn ${this._formWeekdays.includes(s)?"active":""}"
                @click=${()=>this._toggleWeekday(s)}>${r}</button>`)}
          </div>
          <label class="form-label">Time</label>
          <input class="form-input" type="time" .value=${this._formTime}
            @input=${r=>this._formTime=r.target.value} />
          ${this._formRecurrenceType==="biweekly"?h`
            <label class="form-label">Starting from (anchor date)</label>
            <input class="form-input" type="date" .value=${this._formAnchorDate}
              @input=${r=>this._formAnchorDate=r.target.value} />
          `:c}
        `;case"interval_days":case"rolling_days":return h`
          <label class="form-label">Every</label>
          <input class="form-input" type="number" min="1" max="365"
            .value=${String(this._formIntervalDays)}
            @input=${r=>this._formIntervalDays=parseInt(r.target.value)||1} />
          <span class="form-hint">days${this._formRecurrenceType==="rolling_days"?" after completion":""}</span>
        `;default:return c}}_toggleWeekday(t){this._formWeekdays.includes(t)?this._formWeekdays=this._formWeekdays.filter(r=>r!==t):this._formWeekdays=[...this._formWeekdays,t]}_buildRecurrenceDict(){let t=this._formTime?`${this._formTime}:00`:null;switch(this._formRecurrenceType){case"daily":return{mode:"interval_days",interval_days:1};case"weekly":return{mode:"weekly",weekdays:this._formWeekdays,time_of_day:t};case"interval_days":return{mode:"interval_days",interval_days:this._formIntervalDays};case"rolling_days":return{mode:"rolling_days",interval_days:this._formIntervalDays};case"biweekly":return{mode:"biweekly_weekdays",weekdays:this._formWeekdays,time_of_day:t,anchor_date:this._formAnchorDate};default:return null}}async _submitForm(){if(!this._formTitle.trim()||!this._hass)return;this._formSubmitting=!0;let t={title:this._formTitle.trim(),priority:this._formPriority};this._formDue&&(t.due_at=`${this._formDue}T00:00:00`),this._formAssignee.trim()&&(t.assignee=this._formAssignee.trim());let r=this._buildRecurrenceDict();r&&(t.recurrence=r);try{await this._hass.callService("smart_todo","create_task",t,void 0,!1),this._showForm=!1}catch(s){this._error=`Failed to create task: ${s instanceof Error?s.message:String(s)}`}finally{this._formSubmitting=!1}}async _completeTask(t){try{await this._hass.callService("smart_todo","complete_task",{task_id:t},void 0,!1)}catch(r){this._error=`Failed to complete task: ${r instanceof Error?r.message:String(r)}`}}_deleteTask(t){this._confirmDeleteId===t?(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=void 0,this._hass.callService("smart_todo","delete_task",{task_id:t},void 0,!1).catch(r=>{this._error=`Failed to delete task: ${r instanceof Error?r.message:String(r)}`})):(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=t,this._confirmDeleteTimer=setTimeout(()=>{this._confirmDeleteId=void 0},3e3))}_openSnooze(t){this._snoozeTaskId=this._snoozeTaskId===t?void 0:t;let r=new Date;r.setDate(r.getDate()+1),this._snoozeDate=r.toISOString().slice(0,10),this._snoozeTime="08:00"}async _submitSnooze(){if(!this._snoozeTaskId||!this._snoozeDate)return;let t=`${this._snoozeDate}T${this._snoozeTime}:00`;try{await this._hass.callService("smart_todo","snooze_task",{task_id:this._snoozeTaskId,snooze_until:t},void 0,!1),this._snoozeTaskId=void 0}catch(r){this._error=`Failed to snooze task: ${r instanceof Error?r.message:String(r)}`}}_renderSnoozePopover(){return h`
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
    `}_formatDue(t){let r=new Date(t),s=new Date,n=new Date(s.getFullYear(),s.getMonth(),s.getDate()),o=new Date(r.getFullYear(),r.getMonth(),r.getDate()),a=Math.round((o.getTime()-n.getTime())/864e5),l=o<n,p;return a===0?p="Today":a===1?p="Tomorrow":a>1&&a<=6?p=r.toLocaleDateString(void 0,{weekday:"short"}):p=r.toLocaleDateString(void 0,{day:"numeric",month:"short"}),{text:p,overdue:l}}_assigneeInitials(t){let r=t.trim().split(/\s+/);return r.length>=2?(r[0][0]+r[1][0]).toUpperCase():r[0].slice(0,2).toUpperCase()}_dueClass(t){if(t.completed||!t.due_at)return"";let r=new Date(t.due_at),s=new Date,n=new Date(s.getFullYear(),s.getMonth(),s.getDate()),o=new Date(r.getFullYear(),r.getMonth(),r.getDate()),a=Math.round((o.getTime()-n.getTime())/864e5);return a<0?"due-overdue-row":a===0?"due-today-row":a<=2?"due-soon-row":""}_priorityColor(t){return t===3?"var(--error-color, #db4437)":t===2?"var(--primary-color, #0288d1)":"var(--secondary-text-color, #9e9e9e)"}_renderTask(t){let r=t.due_at?this._formatDue(t.due_at):null,s=t.snoozed_until!=null&&new Date(t.snoozed_until)>new Date;return h`
      <div class="task-row ${this._dueClass(t)}">
        <div
          class="task-priority"
          style="background:${this._priorityColor(t.priority)}"
        ></div>
        <div class="task-body">
          <div class="task-title-row">
            <span class="task-title ${t.completed?"completed":""}">${t.title}</span>
            ${t.overdue&&!t.completed?h`<span style="color:var(--error-color,#db4437)">&#9888;</span>`:c}
            ${s?h`<span>&#x1F4A4;</span>`:c}
          </div>
          ${r?h`<div class="task-meta">
                <span class="${r.overdue&&!t.completed?"due-overdue":""}">${r.text}</span>
                ${t.recurrence?h`<span class="recurrence-label">${t.recurrence}</span>`:c}
              </div>`:t.recurrence?h`<div class="task-meta">
                  <span class="recurrence-label">${t.recurrence}</span>
                </div>`:c}
        </div>
        <div class="task-row-right">
          ${t.assignee?h`<div class="assignee-chip">${this._assigneeInitials(t.assignee)}</div>`:c}
          <div class="task-actions">
            <!-- Complete button (hidden if already completed) -->
            ${t.completed?c:h`
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
            ${t.completed?c:h`
              <button class="action-btn snooze" title="Snooze"
                @click=${()=>this._openSnooze(t.id)}>💤</button>
            `}
          </div>
        </div>
      </div>

      <!-- Snooze popover (shown below this task row when active) -->
      ${this._snoozeTaskId===t.id?this._renderSnoozePopover():c}
    `}};u.styles=L`
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
  `,m([_()],u.prototype,"_config",2),m([_()],u.prototype,"_tasks",2),m([_()],u.prototype,"_loading",2),m([_()],u.prototype,"_error",2),m([_()],u.prototype,"_showForm",2),m([_()],u.prototype,"_formTitle",2),m([_()],u.prototype,"_formDue",2),m([_()],u.prototype,"_formPriority",2),m([_()],u.prototype,"_formAssignee",2),m([_()],u.prototype,"_formRecurrenceType",2),m([_()],u.prototype,"_formWeekdays",2),m([_()],u.prototype,"_formTime",2),m([_()],u.prototype,"_formIntervalDays",2),m([_()],u.prototype,"_formAnchorDate",2),m([_()],u.prototype,"_formSubmitting",2),m([_()],u.prototype,"_confirmDeleteId",2),m([_()],u.prototype,"_confirmDeleteTimer",2),m([_()],u.prototype,"_snoozeTaskId",2),m([_()],u.prototype,"_snoozeDate",2),m([_()],u.prototype,"_snoozeTime",2),u=m([se("smart-todo-card")],u);window.customCards=window.customCards??[];window.customCards.push({type:"smart-todo-card",name:"Smart Todo",description:"Manage your Smart Todo recurring tasks.",preview:!0});})();
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
