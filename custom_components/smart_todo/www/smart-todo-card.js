"use strict";(()=>{var xe=Object.defineProperty;var we=Object.getOwnPropertyDescriptor;var m=(o,t,e,s)=>{for(var r=s>1?void 0:s?we(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&xe(t,e,r),r};var O=globalThis,N=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),ie=new WeakMap,z=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(N&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ie.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ie.set(e,t))}return t}toString(){return this.cssText}},oe=o=>new z(typeof o=="string"?o:o+"",void 0,B),L=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((s,r,i)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+o[i+1],o[0]);return new z(e,o,B)},ne=(o,t)=>{if(N)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=O.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,o.appendChild(s)}},V=N?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return oe(e)})(o):o;var{is:Ae,defineProperty:ke,getOwnPropertyDescriptor:Se,getOwnPropertyNames:Ee,getOwnPropertySymbols:Te,getPrototypeOf:De}=Object,F=globalThis,ae=F.trustedTypes,ze=ae?ae.emptyScript:"",Ce=F.reactiveElementPolyfillSupport,C=(o,t)=>o,M={toAttribute(o,t){switch(t){case Boolean:o=o?ze:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},j=(o,t)=>!Ae(o,t),le={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=le){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&ke(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:i}=Se(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let d=r?.call(this);i?.call(this,n),this.requestUpdate(t,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??le}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let t=De(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let e=this.properties,s=[...Ee(e),...Te(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(V(r))}else t!==void 0&&e.push(V(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ne(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:M).toAttribute(e,s.type);this._$Em=t,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let i=s.getPropertyOptions(r),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:M;this._$Em=r;let d=n.fromAttribute(e,i.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(t,e,s,r=!1,i){if(t!==void 0){let n=this.constructor;if(r===!1&&(i=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??j)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:i},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,i]of s){let{wrapped:n}=i,d=this[r];n!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,i,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[C("elementProperties")]=new Map,y[C("finalized")]=new Map,Ce?.({ReactiveElement:y}),(F.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,de=o=>o,W=Q.trustedTypes,ce=W?W.createPolicy("lit-html",{createHTML:o=>o}):void 0,_e="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,ge="?"+$,Me=`<${ge}>`,A=document,H=()=>A.createComment(""),R=o=>o===null||typeof o!="object"&&typeof o!="function",ee=Array.isArray,Pe=o=>ee(o)||typeof o?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,he=/>/g,x=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ue=/'/g,fe=/"/g,ve=/^(?:script|style|textarea|title)$/i,te=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),h=te(1),qe=te(2),Be=te(3),k=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),me=new WeakMap,w=A.createTreeWalker(A,129);function ye(o,t){if(!ee(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ce!==void 0?ce.createHTML(t):t}var He=(o,t)=>{let e=o.length-1,s=[],r,i=t===2?"<svg>":t===3?"<math>":"",n=P;for(let d=0;d<e;d++){let a=o[d],p,l,u=-1,g=0;for(;g<a.length&&(n.lastIndex=g,l=n.exec(a),l!==null);)g=n.lastIndex,n===P?l[1]==="!--"?n=pe:l[1]!==void 0?n=he:l[2]!==void 0?(ve.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=x):l[3]!==void 0&&(n=x):n===x?l[0]===">"?(n=r??P,u=-1):l[1]===void 0?u=-2:(u=n.lastIndex-l[2].length,p=l[1],n=l[3]===void 0?x:l[3]==='"'?fe:ue):n===fe||n===ue?n=x:n===pe||n===he?n=P:(n=x,r=void 0);let v=n===x&&o[d+1].startsWith("/>")?" ":"";i+=n===P?a+Me:u>=0?(s.push(p),a.slice(0,u)+_e+a.slice(u)+$+v):a+$+(u===-2?d:v)}return[ye(o,i+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},I=class o{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let i=0,n=0,d=t.length-1,a=this.parts,[p,l]=He(t,e);if(this.el=o.createElement(p,s),w.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=w.nextNode())!==null&&a.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let u of r.getAttributeNames())if(u.endsWith(_e)){let g=l[n++],v=r.getAttribute(u).split($),S=/([.?@])?(.*)/.exec(g);a.push({type:1,index:i,name:S[2],strings:v,ctor:S[1]==="."?K:S[1]==="?"?J:S[1]==="@"?G:T}),r.removeAttribute(u)}else u.startsWith($)&&(a.push({type:6,index:i}),r.removeAttribute(u));if(ve.test(r.tagName)){let u=r.textContent.split($),g=u.length-1;if(g>0){r.textContent=W?W.emptyScript:"";for(let v=0;v<g;v++)r.append(u[v],H()),w.nextNode(),a.push({type:2,index:++i});r.append(u[g],H())}}}else if(r.nodeType===8)if(r.data===ge)a.push({type:2,index:i});else{let u=-1;for(;(u=r.data.indexOf($,u+1))!==-1;)a.push({type:7,index:i}),u+=$.length-1}i++}}static createElement(t,e){let s=A.createElement("template");return s.innerHTML=t,s}};function E(o,t,e=o,s){if(t===k)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,i=R(t)?void 0:t._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(o),r._$AT(o,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=E(o,r._$AS(o,t.values),r,s)),t}var X=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??A).importNode(e,!0);w.currentNode=r;let i=w.nextNode(),n=0,d=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new U(i,i.nextSibling,this,t):a.type===1?p=new a.ctor(i,a.name,a.strings,this,t):a.type===6&&(p=new Z(i,this,t)),this._$AV.push(p),a=s[++d]}n!==a?.index&&(i=w.nextNode(),n++)}return w.currentNode=A,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},U=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),R(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==k&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=I.createElement(ye(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let i=new X(r,this),n=i.u(this.options);i.p(e),this.T(n),this._$AH=i}}_$AC(t){let e=me.get(t.strings);return e===void 0&&me.set(t.strings,e=new I(t)),e}k(t){ee(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let i of t)r===e.length?e.push(s=new o(this.O(H()),this.O(H()),this,this.options)):s=e[r],s._$AI(i),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=de(t).nextSibling;de(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(t,e=this,s,r){let i=this.strings,n=!1;if(i===void 0)t=E(this,t,e,0),n=!R(t)||t!==this._$AH&&t!==k,n&&(this._$AH=t);else{let d=t,a,p;for(t=i[0],a=0;a<i.length-1;a++)p=E(this,d[s+a],e,a),p===k&&(p=this._$AH[a]),n||=!R(p)||p!==this._$AH[a],p===c?t=c:t!==c&&(t+=(p??"")+i[a+1]),this._$AH[a]=p}n&&!r&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},K=class extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},J=class extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},G=class extends T{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??c)===k)return;let s=this._$AH,r=t===c&&s!==c||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==c&&(s===c||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var Re=Q.litHtmlPolyfillSupport;Re?.(I,U),(Q.litHtmlVersions??=[]).push("3.3.3");var be=(o,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let i=e?.renderBefore??null;s._$litPart$=r=new U(t.insertBefore(H(),i),i,void 0,e??{})}return r._$AI(o),r};var se=globalThis,b=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=be(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};b._$litElement$=!0,b.finalized=!0,se.litElementHydrateSupport?.({LitElement:b});var Ie=se.litElementPolyfillSupport;Ie?.({LitElement:b});(se.litElementVersions??=[]).push("4.2.2");var re=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};var Ue={attribute:!0,type:String,converter:M,reflect:!1,hasChanged:j},Oe=(o=Ue,t,e)=>{let{kind:s,metadata:r}=e,i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),s==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(e.name,o),s==="accessor"){let{name:n}=e;return{set(d){let a=t.get.call(this);t.set.call(this,d),this.requestUpdate(n,a,o,!0,d)},init(d){return d!==void 0&&this.C(n,void 0,o,d),d}}}if(s==="setter"){let{name:n}=e;return function(d){let a=this[n];t.call(this,d),this.requestUpdate(n,a,o,!0,d)}}throw Error("Unsupported decorator location: "+s)};function $e(o){return(t,e)=>typeof e=="object"?Oe(o,t,e):((s,r,i)=>{let n=r.hasOwnProperty(i);return r.constructor.createProperty(i,s),n?Object.getOwnPropertyDescriptor(r,i):void 0})(o,t,e)}function _(o){return $e({...o,state:!0,attribute:!1})}var D=class extends b{constructor(){super(...arguments);this._config={entity:""}}set hass(e){}setConfig(e){this._config={...e}}_valueChanged(e,s){let r={...this._config,[e]:s};r.filter!=="x_days"&&r.filter!=="x_days_plus_overdue"&&delete r.filter_days,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r},bubbles:!0,composed:!0}))}render(){let e=this._config.filter??"all",s=e==="x_days"||e==="x_days_plus_overdue";return h`
      <div class="editor-row">
        <label class="editor-label">Entity *</label>
        <input class="editor-input" type="text"
          .value=${this._config.entity}
          placeholder="smart_todo.tasks"
          @input=${r=>this._valueChanged("entity",r.target.value)} />
        <span class="editor-hint">The smart_todo sensor entity ID</span>
      </div>

      <div class="editor-row">
        <label class="editor-label">Title</label>
        <input class="editor-input" type="text"
          .value=${this._config.title??""}
          placeholder="Smart Todo"
          @input=${r=>this._valueChanged("title",r.target.value||void 0)} />
      </div>

      <div class="editor-row">
        <label class="editor-label">Show tasks</label>
        <select class="editor-input"
          .value=${e}
          @change=${r=>this._valueChanged("filter",r.target.value)}>
          <option value="all">All tasks</option>
          <option value="overdue">Only overdue</option>
          <option value="today">Only today</option>
          <option value="today_plus_overdue">Today + overdue</option>
          <option value="x_days">Within X days</option>
          <option value="x_days_plus_overdue">Within X days + overdue</option>
        </select>
      </div>

      ${s?h`
        <div class="editor-row">
          <label class="editor-label">Days (X)</label>
          <input class="editor-input" type="number" min="1" max="365"
            .value=${String(this._config.filter_days??7)}
            @input=${r=>this._valueChanged("filter_days",parseInt(r.target.value)||7)} />
          <span class="editor-hint">Show tasks due within this many days from today</span>
        </div>
      `:c}
    `}};D.styles=L`
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
  `,m([_()],D.prototype,"_config",2),D=m([re("smart-todo-card-editor")],D);var f=class extends b{constructor(){super(...arguments);this._tasks=[];this._loading=!1;this._showForm=!1;this._formTitle="";this._formDue="";this._formPriority=2;this._formAssignee="";this._formRecurrenceType="none";this._formWeekdays=[];this._formTime="09:00";this._formIntervalDays=7;this._formAnchorDate="";this._formSubmitting=!1;this._snoozeDate="";this._snoozeTime="08:00";this._showHidden=!1}static getConfigElement(){return document.createElement("smart-todo-card-editor")}static getStubConfig(){return{entity:"",filter:"all"}}setConfig(e){if(!e.entity)throw new Error('smart-todo-card: "entity" is required in card config.');this._config=e,this._showHidden=!1}set hass(e){if(this._hass=e,!this._config?.entity)return;let s=this._hass.states[this._config.entity];if(!s)return;let r=s.last_updated;r!==this._lastUpdated&&(this._lastUpdated=r,clearTimeout(this._debounceTimer),this._debounceTimer=setTimeout(()=>this._fetchTasks(),500))}get hass(){return this._hass}async _fetchTasks(){if(!(!this._hass||!this._config)){this._loading=!0,this._error=void 0;try{let e=await this._hass.callService("smart_todo","get_tasks",{},void 0,!1,!0),s=e.response?.tasks??e.tasks??[];this._tasks=s}catch(e){let s=e instanceof Error?e.message:typeof e=="object"&&e!==null&&"message"in e?String(e.message):JSON.stringify(e);this._error=`Failed to load tasks: ${s}`}finally{this._loading=!1}}}_isCompletedToday(e){if(!e.last_completed_at)return!1;let s=new Date(e.last_completed_at.replace(/(\.\d{3})\d+/,"$1")),r=new Date;return s.getFullYear()===r.getFullYear()&&s.getMonth()===r.getMonth()&&s.getDate()===r.getDate()}_getFilteredTasks(){let e=this._config?.filter??"all";if(e==="all")return this._tasks.filter(n=>!this._isCompletedToday(n));let s=new Date,r=new Date(s.getFullYear(),s.getMonth(),s.getDate()),i=this._config?.filter_days??7;return this._tasks.filter(n=>{if(n.completed||this._isCompletedToday(n))return!1;let d=n.overdue===!0;if(e==="overdue")return d;let p=n.snoozed_until!=null&&new Date(n.snoozed_until)>new Date?n.snoozed_until:n.due_at,l=1/0;if(p){let v=new Date(p.replace(/(\.\d{3})\d+/,"$1")),S=new Date(v.getFullYear(),v.getMonth(),v.getDate());l=Math.round((S.getTime()-r.getTime())/864e5)}let u=l===0,g=l>=0&&l<=i;switch(e){case"today":return u&&!d;case"today_plus_overdue":return u||d;case"x_days":return g&&!d;case"x_days_plus_overdue":return g||d;default:return!0}})}_sortTasks(e){return e.slice().sort((s,r)=>{if(s.completed!==r.completed)return s.completed?1:-1;let i=a=>{if(!a)return Number.MAX_SAFE_INTEGER;let p=new Date(a.replace(/(\.\d{3})\d+/,"$1")).getTime();return isNaN(p)?Number.MAX_SAFE_INTEGER:p},n=i(s.due_at),d=i(r.due_at);return n!==d?n<d?-1:1:s.sort_order-r.sort_order})}render(){if(!this._config)return c;let e=this._getFilteredTasks(),s=this._config.filter??"all",r=new Set(e.map(l=>l.id)),i=s==="all"?[]:this._tasks.filter(l=>!r.has(l.id)&&!l.completed&&!this._isCompletedToday(l)),n=i.length>0,d=e.length,a=e.filter(l=>l.overdue&&!l.completed).length,p=this._config.title??"Smart Todo";return h`
      <ha-card>
        <div class="header">
          <span class="title">${p}</span>
          ${this._loading?c:h`<span class="summary">
                ${d} task${d!==1?"s":""}${a?h` · <span style="color:var(--error-color)">${a} overdue</span>`:""}
              </span>`}
        </div>

        ${this._error?h`<div class="error">${this._error}</div>`:c}

        ${this._loading?h`<div class="loading">Loading tasks…</div>`:this._tasks.length===0?h`<div class="placeholder">No tasks yet — click + to add one.</div>`:e.length===0?h`<div class="placeholder">
                  No tasks match the current filter.
                  ${n?h`<br>
                    <button class="filter-expand-btn"
                      @click=${()=>{this._showHidden=!this._showHidden}}>
                      ${this._showHidden?`\u25B2 Hide ${i.length} filtered task${i.length!==1?"s":""}`:`\u25BC Show ${i.length} filtered task${i.length!==1?"s":""}`}
                    </button>
                    ${this._showHidden?h`
                      <div class="hidden-divider">Hidden by filter</div>
                      <div class="task-list">
                        ${this._sortTasks(i).map(l=>h`
                          <div class="filtered-hidden-wrapper">
                            ${this._renderTask(l)}
                          </div>
                        `)}
                      </div>
                    `:c}
                  `:c}
                </div>`:h`
                  <div class="task-list">
                    ${this._sortTasks(e).map(l=>this._renderTask(l))}
                  </div>
                  ${n?h`
                    <button class="filter-expand-btn"
                      @click=${()=>{this._showHidden=!this._showHidden}}>
                      ${this._showHidden?`\u25B2 Hide ${i.length} filtered task${i.length!==1?"s":""}`:`\u25BC Show ${i.length} filtered task${i.length!==1?"s":""}`}
                    </button>
                    ${this._showHidden?h`
                      <div class="hidden-divider">Hidden by filter</div>
                      <div class="task-list">
                        ${this._sortTasks(i).map(l=>h`
                          <div class="filtered-hidden-wrapper">
                            ${this._renderTask(l)}
                          </div>
                        `)}
                      </div>
                    `:c}
                  `:c}
                `}

        ${this._showForm?h`
          <div class="form-panel">
            <div class="form-title">Add task</div>

            <!-- Title (required) -->
            <label class="form-label">Title *</label>
            <input class="form-input" type="text" .value=${this._formTitle}
              @input=${l=>this._formTitle=l.target.value}
              placeholder="Task title" />

            <!-- Due date (optional) -->
            <label class="form-label">Due date</label>
            <input class="form-input" type="date" .value=${this._formDue}
              @input=${l=>this._formDue=l.target.value} />

            <!-- Priority -->
            <label class="form-label">Priority</label>
            <div class="priority-buttons">
              ${[1,2,3].map(l=>h`
                <button class="priority-btn ${this._formPriority===l?"active":""}"
                  style="--btn-color:${this._priorityColor(l)}"
                  @click=${()=>this._formPriority=l}>
                  ${{1:"Low",2:"Medium",3:"High"}[l]}
                </button>`)}
            </div>

            <!-- Assignee -->
            <label class="form-label">Assignee</label>
            <input class="form-input" type="text" .value=${this._formAssignee}
              @input=${l=>this._formAssignee=l.target.value}
              placeholder="Optional" />

            <!-- Recurrence type -->
            <label class="form-label">Recurrence</label>
            <select class="form-input" .value=${this._formRecurrenceType}
              @change=${l=>this._formRecurrenceType=l.target.value}>
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
    `}_openForm(){this._showForm=!0,this._formTitle="",this._formDue="",this._formPriority=2,this._formAssignee="",this._formRecurrenceType="none",this._formWeekdays=[],this._formTime="09:00",this._formIntervalDays=7,this._formAnchorDate=new Date().toISOString().slice(0,10),this._formSubmitting=!1}_renderRecurrenceSubFields(){let e=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];switch(this._formRecurrenceType){case"weekly":case"biweekly":return h`
          <label class="form-label">Day(s)</label>
          <div class="weekday-picker">
            ${e.map((s,r)=>h`
              <button class="day-btn ${this._formWeekdays.includes(r)?"active":""}"
                @click=${()=>this._toggleWeekday(r)}>${s}</button>`)}
          </div>
          <label class="form-label">Time</label>
          <input class="form-input" type="time" .value=${this._formTime}
            @input=${s=>this._formTime=s.target.value} />
          ${this._formRecurrenceType==="biweekly"?h`
            <label class="form-label">Starting from (anchor date)</label>
            <input class="form-input" type="date" .value=${this._formAnchorDate}
              @input=${s=>this._formAnchorDate=s.target.value} />
          `:c}
        `;case"interval_days":case"rolling_days":return h`
          <label class="form-label">Every</label>
          <input class="form-input" type="number" min="1" max="365"
            .value=${String(this._formIntervalDays)}
            @input=${s=>this._formIntervalDays=parseInt(s.target.value)||1} />
          <span class="form-hint">days${this._formRecurrenceType==="rolling_days"?" after completion":""}</span>
        `;default:return c}}_toggleWeekday(e){this._formWeekdays.includes(e)?this._formWeekdays=this._formWeekdays.filter(s=>s!==e):this._formWeekdays=[...this._formWeekdays,e]}_buildRecurrenceDict(){let e=this._formTime?`${this._formTime}:00`:null;switch(this._formRecurrenceType){case"daily":return{mode:"interval_days",interval_days:1};case"weekly":return{mode:"weekly",weekdays:this._formWeekdays,time_of_day:e};case"interval_days":return{mode:"interval_days",interval_days:this._formIntervalDays};case"rolling_days":return{mode:"rolling_days",interval_days:this._formIntervalDays};case"biweekly":return{mode:"biweekly_weekdays",weekdays:this._formWeekdays,time_of_day:e,anchor_date:this._formAnchorDate};default:return null}}async _submitForm(){if(!this._formTitle.trim()||!this._hass)return;this._formSubmitting=!0;let e={title:this._formTitle.trim(),priority:this._formPriority};this._formDue&&(e.due_at=`${this._formDue}T00:00:00`),this._formAssignee.trim()&&(e.assignee=this._formAssignee.trim());let s=this._buildRecurrenceDict();s&&(e.recurrence=s);try{await this._hass.callService("smart_todo","create_task",e,void 0,!1),this._showForm=!1}catch(r){this._error=`Failed to create task: ${r instanceof Error?r.message:String(r)}`}finally{this._formSubmitting=!1}}async _completeTask(e){try{await this._hass.callService("smart_todo","complete_task",{task_id:e},void 0,!1)}catch(s){this._error=`Failed to complete task: ${s instanceof Error?s.message:String(s)}`}}_deleteTask(e){this._confirmDeleteId===e?(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=void 0,this._hass.callService("smart_todo","delete_task",{task_id:e},void 0,!1).catch(s=>{this._error=`Failed to delete task: ${s instanceof Error?s.message:String(s)}`})):(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=e,this._confirmDeleteTimer=setTimeout(()=>{this._confirmDeleteId=void 0},3e3))}_openSnooze(e){this._snoozeTaskId=this._snoozeTaskId===e?void 0:e;let s=new Date;s.setDate(s.getDate()+1),this._snoozeDate=s.toISOString().slice(0,10),this._snoozeTime="08:00"}async _submitSnooze(){if(!this._snoozeTaskId||!this._snoozeDate)return;let e=`${this._snoozeDate}T${this._snoozeTime}:00`;try{await this._hass.callService("smart_todo","snooze_task",{task_id:this._snoozeTaskId,snooze_until:e},void 0,!1),this._snoozeTaskId=void 0}catch(s){this._error=`Failed to snooze task: ${s instanceof Error?s.message:String(s)}`}}_renderSnoozePopover(){return h`
      <div class="snooze-popover">
        <span class="form-label">Snooze until</span>
        <div class="snooze-inputs">
          <input type="date" class="form-input snooze-date" .value=${this._snoozeDate}
            @input=${e=>this._snoozeDate=e.target.value} />
          <input type="time" class="form-input snooze-time" .value=${this._snoozeTime}
            @input=${e=>this._snoozeTime=e.target.value} />
        </div>
        <div class="form-actions">
          <button class="form-btn cancel" @click=${()=>this._snoozeTaskId=void 0}>Cancel</button>
          <button class="form-btn submit" @click=${()=>this._submitSnooze()}>Snooze</button>
        </div>
      </div>
    `}_formatDue(e){let s=new Date(e),r=new Date,i=new Date(r.getFullYear(),r.getMonth(),r.getDate()),n=new Date(s.getFullYear(),s.getMonth(),s.getDate()),d=Math.round((n.getTime()-i.getTime())/864e5),a=n<i,p;return d===0?p="Today":d===1?p="Tomorrow":d>1&&d<=6?p=s.toLocaleDateString(void 0,{weekday:"short"}):p=s.toLocaleDateString(void 0,{day:"numeric",month:"short"}),{text:p,overdue:a}}_assigneeInitials(e){let s=e.trim().split(/\s+/);return s.length>=2?(s[0][0]+s[1][0]).toUpperCase():s[0].slice(0,2).toUpperCase()}_dueClass(e){if(e.completed)return"";let r=e.snoozed_until!=null&&new Date(e.snoozed_until)>new Date?e.snoozed_until:e.due_at;if(!r)return"";let i=new Date(r),n=new Date,d=new Date(n.getFullYear(),n.getMonth(),n.getDate()),a=new Date(i.getFullYear(),i.getMonth(),i.getDate()),p=Math.round((a.getTime()-d.getTime())/864e5);return p<0?"due-overdue-row":p===0?"due-today-row":p<=2?"due-soon-row":""}_priorityColor(e){return e===3?"var(--error-color, #db4437)":e===2?"var(--primary-color, #0288d1)":"var(--secondary-text-color, #9e9e9e)"}_renderTask(e){let s=e.snoozed_until!=null&&new Date(e.snoozed_until)>new Date,r=s?e.snoozed_until:e.due_at,i=r?this._formatDue(r):null;return h`
      <div class="task-row ${this._dueClass(e)}">
        <div
          class="task-priority"
          style="background:${this._priorityColor(e.priority)}"
        ></div>
        <div class="task-body">
          <div class="task-title-row">
            <span class="task-title ${e.completed?"completed":""}">${e.title}</span>
            ${e.overdue&&!e.completed?h`<span style="color:var(--error-color,#db4437)">&#9888;</span>`:c}
            ${s?h`<span>&#x1F4A4;</span>`:c}
          </div>
          ${i?h`<div class="task-meta">
                <span class="${i.overdue&&!e.completed?"due-overdue":""}">${i.text}</span>
                ${e.recurrence?h`<span class="recurrence-label">${e.recurrence}</span>`:c}
              </div>`:e.recurrence?h`<div class="task-meta">
                  <span class="recurrence-label">${e.recurrence}</span>
                </div>`:c}
        </div>
        <div class="task-row-right">
          ${e.assignee?h`<div class="assignee-chip">${this._assigneeInitials(e.assignee)}</div>`:c}
          <div class="task-actions">
            <!-- Complete button (hidden if already completed) -->
            ${e.completed?c:h`
              <button class="action-btn complete" title="Complete"
                @click=${()=>this._completeTask(e.id)}>✓</button>
            `}

            <!-- Delete button — two-tap confirmation -->
            <button class="action-btn delete ${this._confirmDeleteId===e.id?"confirming":""}"
              title="${this._confirmDeleteId===e.id?"Tap again to confirm":"Delete"}"
              @click=${()=>this._deleteTask(e.id)}>
              ${this._confirmDeleteId===e.id?"\u2713?":"\u{1F5D1}"}
            </button>

            <!-- Snooze button (hidden if completed) -->
            ${e.completed?c:h`
              <button class="action-btn snooze" title="Snooze"
                @click=${()=>this._openSnooze(e.id)}>💤</button>
            `}
          </div>
        </div>
      </div>

      <!-- Snooze popover (shown below this task row when active) -->
      ${this._snoozeTaskId===e.id?this._renderSnoozePopover():c}
    `}};f.styles=L`
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
  `,m([_()],f.prototype,"_config",2),m([_()],f.prototype,"_tasks",2),m([_()],f.prototype,"_loading",2),m([_()],f.prototype,"_error",2),m([_()],f.prototype,"_showForm",2),m([_()],f.prototype,"_formTitle",2),m([_()],f.prototype,"_formDue",2),m([_()],f.prototype,"_formPriority",2),m([_()],f.prototype,"_formAssignee",2),m([_()],f.prototype,"_formRecurrenceType",2),m([_()],f.prototype,"_formWeekdays",2),m([_()],f.prototype,"_formTime",2),m([_()],f.prototype,"_formIntervalDays",2),m([_()],f.prototype,"_formAnchorDate",2),m([_()],f.prototype,"_formSubmitting",2),m([_()],f.prototype,"_confirmDeleteId",2),m([_()],f.prototype,"_confirmDeleteTimer",2),m([_()],f.prototype,"_snoozeTaskId",2),m([_()],f.prototype,"_snoozeDate",2),m([_()],f.prototype,"_snoozeTime",2),m([_()],f.prototype,"_showHidden",2),f=m([re("smart-todo-card")],f);window.customCards=window.customCards??[];window.customCards.push({type:"smart-todo-card",name:"Smart Todo",description:"Manage your Smart Todo recurring tasks.",preview:!0});})();
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
