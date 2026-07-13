"use strict";(()=>{var xe=Object.defineProperty;var we=Object.getOwnPropertyDescriptor;var m=(o,t,e,r)=>{for(var i=r>1?void 0:r?we(t,e):t,s=o.length-1,n;s>=0;s--)(n=o[s])&&(i=(r?n(t,e,i):n(i))||i);return r&&i&&xe(t,e,i),i};var U=globalThis,N=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),se=new WeakMap,R=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(N&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=se.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&se.set(e,t))}return t}toString(){return this.cssText}},oe=o=>new R(typeof o=="string"?o:o+"",void 0,B),L=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((r,i,s)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[s+1],o[0]);return new R(e,o,B)},ne=(o,t)=>{if(N)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),i=U.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,o.appendChild(r)}},V=N?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return oe(e)})(o):o;var{is:ke,defineProperty:Ae,getOwnPropertyDescriptor:Te,getOwnPropertyNames:Ee,getOwnPropertySymbols:Se,getPrototypeOf:De}=Object,F=globalThis,ae=F.trustedTypes,Re=ae?ae.emptyScript:"",ze=F.reactiveElementPolyfillSupport,z=(o,t)=>o,P={toAttribute(o,t){switch(t){case Boolean:o=o?Re:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},j=(o,t)=>!ke(o,t),le={attribute:!0,type:String,converter:P,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=le){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(t,r,e);i!==void 0&&Ae(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){let{get:i,set:s}=Te(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let l=i?.call(this);s?.call(this,n),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??le}static _$Ei(){if(this.hasOwnProperty(z("elementProperties")))return;let t=De(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(z("properties"))){let e=this.properties,r=[...Ee(e),...Se(e)];for(let i of r)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let i of r)e.unshift(V(i))}else t!==void 0&&e.push(V(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ne(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:P).toAttribute(e,r.type);this._$Em=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(t,e){let r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:P;this._$Em=i;let l=n.fromAttribute(e,s.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,r,i=!1,s){if(t!==void 0){let n=this.constructor;if(i===!1&&(s=this[t]),r??=n.getPropertyOptions(t),!((r.hasChanged??j)(s,e)||r.useDefault&&r.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:i,wrapped:s},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:n}=s,l=this[i];n!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,s,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[z("elementProperties")]=new Map,v[z("finalized")]=new Map,ze?.({ReactiveElement:v}),(F.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,de=o=>o,W=Q.trustedTypes,ce=W?W.createPolicy("lit-html",{createHTML:o=>o}):void 0,_e="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,ge="?"+$,Pe=`<${ge}>`,k=document,M=()=>k.createComment(""),H=o=>o===null||typeof o!="object"&&typeof o!="function",ee=Array.isArray,Ce=o=>ee(o)||typeof o?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,he=/>/g,x=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ue=/'/g,me=/"/g,ye=/^(?:script|style|textarea|title)$/i,te=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),p=te(1),qe=te(2),Be=te(3),A=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),fe=new WeakMap,w=k.createTreeWalker(k,129);function ve(o,t){if(!ee(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ce!==void 0?ce.createHTML(t):t}var Me=(o,t)=>{let e=o.length-1,r=[],i,s=t===2?"<svg>":t===3?"<math>":"",n=C;for(let l=0;l<e;l++){let d=o[l],h,a,f=-1,g=0;for(;g<d.length&&(n.lastIndex=g,a=n.exec(d),a!==null);)g=n.lastIndex,n===C?a[1]==="!--"?n=pe:a[1]!==void 0?n=he:a[2]!==void 0?(ye.test(a[2])&&(i=RegExp("</"+a[2],"g")),n=x):a[3]!==void 0&&(n=x):n===x?a[0]===">"?(n=i??C,f=-1):a[1]===void 0?f=-2:(f=n.lastIndex-a[2].length,h=a[1],n=a[3]===void 0?x:a[3]==='"'?me:ue):n===me||n===ue?n=x:n===pe||n===he?n=C:(n=x,i=void 0);let y=n===x&&o[l+1].startsWith("/>")?" ":"";s+=n===C?d+Pe:f>=0?(r.push(h),d.slice(0,f)+_e+d.slice(f)+$+y):d+$+(f===-2?l:y)}return[ve(o,s+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},I=class o{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let s=0,n=0,l=t.length-1,d=this.parts,[h,a]=Me(t,e);if(this.el=o.createElement(h,r),w.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(i=w.nextNode())!==null&&d.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let f of i.getAttributeNames())if(f.endsWith(_e)){let g=a[n++],y=i.getAttribute(f).split($),T=/([.?@])?(.*)/.exec(g);d.push({type:1,index:s,name:T[2],strings:y,ctor:T[1]==="."?X:T[1]==="?"?J:T[1]==="@"?K:S}),i.removeAttribute(f)}else f.startsWith($)&&(d.push({type:6,index:s}),i.removeAttribute(f));if(ye.test(i.tagName)){let f=i.textContent.split($),g=f.length-1;if(g>0){i.textContent=W?W.emptyScript:"";for(let y=0;y<g;y++)i.append(f[y],M()),w.nextNode(),d.push({type:2,index:++s});i.append(f[g],M())}}}else if(i.nodeType===8)if(i.data===ge)d.push({type:2,index:s});else{let f=-1;for(;(f=i.data.indexOf($,f+1))!==-1;)d.push({type:7,index:s}),f+=$.length-1}s++}}static createElement(t,e){let r=k.createElement("template");return r.innerHTML=t,r}};function E(o,t,e=o,r){if(t===A)return t;let i=r!==void 0?e._$Co?.[r]:e._$Cl,s=H(t)?void 0:t._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(o),i._$AT(o,e,r)),r!==void 0?(e._$Co??=[])[r]=i:e._$Cl=i),i!==void 0&&(t=E(o,i._$AS(o,t.values),i,r)),t}var G=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);w.currentNode=i;let s=w.nextNode(),n=0,l=0,d=r[0];for(;d!==void 0;){if(n===d.index){let h;d.type===2?h=new O(s,s.nextSibling,this,t):d.type===1?h=new d.ctor(s,d.name,d.strings,this,t):d.type===6&&(h=new Z(s,this,t)),this._$AV.push(h),d=r[++l]}n!==d?.index&&(s=w.nextNode(),n++)}return w.currentNode=k,i}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},O=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),H(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ce(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=I.createElement(ve(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new G(i,this),n=s.u(this.options);s.p(e),this.T(n),this._$AH=s}}_$AC(t){let e=fe.get(t.strings);return e===void 0&&fe.set(t.strings,e=new I(t)),e}k(t){ee(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let s of t)i===e.length?e.push(r=new o(this.O(M()),this.O(M()),this,this.options)):r=e[i],r._$AI(s),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=de(t).nextSibling;de(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,s){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=c}_$AI(t,e=this,r,i){let s=this.strings,n=!1;if(s===void 0)t=E(this,t,e,0),n=!H(t)||t!==this._$AH&&t!==A,n&&(this._$AH=t);else{let l=t,d,h;for(t=s[0],d=0;d<s.length-1;d++)h=E(this,l[r+d],e,d),h===A&&(h=this._$AH[d]),n||=!H(h)||h!==this._$AH[d],h===c?t=c:t!==c&&(t+=(h??"")+s[d+1]),this._$AH[d]=h}n&&!i&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},X=class extends S{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},J=class extends S{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},K=class extends S{constructor(t,e,r,i,s){super(t,e,r,i,s),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??c)===A)return;let r=this._$AH,i=t===c&&r!==c||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==c&&(r===c||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var He=Q.litHtmlPolyfillSupport;He?.(I,O),(Q.litHtmlVersions??=[]).push("3.3.3");var be=(o,t,e)=>{let r=e?.renderBefore??t,i=r._$litPart$;if(i===void 0){let s=e?.renderBefore??null;r._$litPart$=i=new O(t.insertBefore(M(),s),s,void 0,e??{})}return i._$AI(o),i};var re=globalThis,b=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=be(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};b._$litElement$=!0,b.finalized=!0,re.litElementHydrateSupport?.({LitElement:b});var Ie=re.litElementPolyfillSupport;Ie?.({LitElement:b});(re.litElementVersions??=[]).push("4.2.2");var ie=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};var Oe={attribute:!0,type:String,converter:P,reflect:!1,hasChanged:j},Ue=(o=Oe,t,e)=>{let{kind:r,metadata:i}=e,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((o=Object.create(o)).wrapped=!0),s.set(e.name,o),r==="accessor"){let{name:n}=e;return{set(l){let d=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,d,o,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,o,l),l}}}if(r==="setter"){let{name:n}=e;return function(l){let d=this[n];t.call(this,l),this.requestUpdate(n,d,o,!0,l)}}throw Error("Unsupported decorator location: "+r)};function $e(o){return(t,e)=>typeof e=="object"?Ue(o,t,e):((r,i,s)=>{let n=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),n?Object.getOwnPropertyDescriptor(i,s):void 0})(o,t,e)}function _(o){return $e({...o,state:!0,attribute:!1})}var D=class extends b{constructor(){super(...arguments);this._config={entity:""}}set hass(e){}setConfig(e){this._config={...e}}_valueChanged(e,r){let i={...this._config,[e]:r};i.filter!=="x_days"&&i.filter!=="x_days_plus_overdue"&&delete i.filter_days,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let e=this._config.filter??"all",r=e==="x_days"||e==="x_days_plus_overdue";return p`
      <div class="editor-row">
        <label class="editor-label">Entity *</label>
        <input class="editor-input" type="text"
          .value=${this._config.entity}
          placeholder="smart_todo.tasks"
          @input=${i=>this._valueChanged("entity",i.target.value)} />
        <span class="editor-hint">The smart_todo sensor entity ID</span>
      </div>

      <div class="editor-row">
        <label class="editor-label">Title</label>
        <input class="editor-input" type="text"
          .value=${this._config.title??""}
          placeholder="Smart Todo"
          @input=${i=>this._valueChanged("title",i.target.value||void 0)} />
      </div>

      <div class="editor-row">
        <label class="editor-label">Show tasks</label>
        <select class="editor-input"
          .value=${e}
          @change=${i=>this._valueChanged("filter",i.target.value)}>
          <option value="all">All tasks</option>
          <option value="overdue">Only overdue</option>
          <option value="today">Only today</option>
          <option value="today_plus_overdue">Today + overdue</option>
          <option value="x_days">Within X days</option>
          <option value="x_days_plus_overdue">Within X days + overdue</option>
        </select>
      </div>

      ${r?p`
        <div class="editor-row">
          <label class="editor-label">Days (X)</label>
          <input class="editor-input" type="number" min="1" max="365"
            .value=${String(this._config.filter_days??7)}
            @input=${i=>this._valueChanged("filter_days",parseInt(i.target.value)||7)} />
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
  `,m([_()],D.prototype,"_config",2),D=m([ie("smart-todo-card-editor")],D);var u=class extends b{constructor(){super(...arguments);this._tasks=[];this._roster=[];this._loading=!1;this._showForm=!1;this._editingOriginalRecurrence=null;this._formTitle="";this._formDue="";this._formPriority=2;this._formAssignee="";this._formPoints=0;this._formRewardRecipient="";this._formRecurrenceType="none";this._formWeekdays=[];this._formTime="09:00";this._formIntervalDays=7;this._formAnchorDate="";this._formSubmitting=!1;this._snoozeDate="";this._snoozeTime="08:00";this._showHidden=!1}static getConfigElement(){return document.createElement("smart-todo-card-editor")}static getStubConfig(){return{entity:"",filter:"all"}}setConfig(e){if(!e.entity)throw new Error('smart-todo-card: "entity" is required in card config.');this._config=e,this._showHidden=!1}set hass(e){if(this._hass=e,!this._config?.entity)return;let r=this._hass.states[this._config.entity];if(!r)return;let i=r.last_updated;i!==this._lastUpdated&&(this._lastUpdated=i,clearTimeout(this._debounceTimer),this._debounceTimer=setTimeout(()=>this._fetchTasks(),500))}get hass(){return this._hass}async _fetchTasks(e=!1){if(!(!this._hass||!this._config)){e||(this._loading=!0),this._error=void 0;try{let r=await this._hass.callService("smart_todo","get_tasks",{},void 0,!1,!0),i=r.response,s=r;this._tasks=i?.tasks??s?.tasks??[],this._roster=i?.roster??s?.roster??[]}catch(r){let i=r instanceof Error?r.message:typeof r=="object"&&r!==null&&"message"in r?String(r.message):JSON.stringify(r);this._error=`Failed to load tasks: ${i}`}finally{this._loading=!1}}}_isCompletedToday(e){if(!e.last_completed_at)return!1;let r=new Date(e.last_completed_at.replace(/(\.\d{3})\d+/,"$1")),i=new Date;return r.getFullYear()===i.getFullYear()&&r.getMonth()===i.getMonth()&&r.getDate()===i.getDate()}_getFilteredTasks(){let e=this._config?.filter??"all";if(e==="all")return this._tasks.filter(n=>!this._isCompletedToday(n));let r=new Date,i=new Date(r.getFullYear(),r.getMonth(),r.getDate()),s=this._config?.filter_days??7;return this._tasks.filter(n=>{if(n.completed||this._isCompletedToday(n))return!1;let l=n.overdue===!0;if(e==="overdue")return l;let h=n.snoozed_until!=null&&new Date(n.snoozed_until)>new Date?n.snoozed_until:n.due_at,a=1/0;if(h){let y=new Date(h.replace(/(\.\d{3})\d+/,"$1")),T=new Date(y.getFullYear(),y.getMonth(),y.getDate());a=Math.round((T.getTime()-i.getTime())/864e5)}let f=a===0,g=a>=0&&a<=s;switch(e){case"today":return f&&!l;case"today_plus_overdue":return f||l;case"x_days":return g&&!l;case"x_days_plus_overdue":return g||l;default:return!0}})}_sortTasks(e){return e.slice().sort((r,i)=>{if(r.completed!==i.completed)return r.completed?1:-1;let s=d=>{if(!d)return Number.MAX_SAFE_INTEGER;let h=new Date(d.replace(/(\.\d{3})\d+/,"$1")).getTime();return isNaN(h)?Number.MAX_SAFE_INTEGER:h},n=s(r.due_at),l=s(i.due_at);return n!==l?n<l?-1:1:r.sort_order-i.sort_order})}render(){if(!this._config)return c;let e=this._getFilteredTasks(),r=this._config.filter??"all",i=new Set(e.map(a=>a.id)),s=r==="all"?[]:this._tasks.filter(a=>!i.has(a.id)&&!a.completed&&!this._isCompletedToday(a)),n=s.length>0,l=e.length,d=e.filter(a=>a.overdue&&!a.completed).length,h=this._config.title??"Smart Todo";return p`
      <ha-card>
        <div class="header">
          <span class="title">${h}</span>
          ${this._loading?c:p`<span class="summary">
                ${l} task${l!==1?"s":""}${d?p` · <span style="color:var(--error-color)">${d} overdue</span>`:""}
              </span>`}
        </div>

        ${this._error?p`<div class="error">${this._error}</div>`:c}

        ${this._loading?p`<div class="loading">Loading tasks…</div>`:this._tasks.length===0?p`<div class="placeholder">No tasks yet — click + to add one.</div>`:e.length===0?p`<div class="placeholder">
                  No tasks match the current filter.
                  ${n?p`<br>
                    <button class="filter-expand-btn"
                      @click=${()=>{this._showHidden=!this._showHidden}}>
                      ${this._showHidden?`\u25B2 Hide ${s.length} filtered task${s.length!==1?"s":""}`:`\u25BC Show ${s.length} filtered task${s.length!==1?"s":""}`}
                    </button>
                    ${this._showHidden?p`
                      <div class="hidden-divider">Hidden by filter</div>
                      <div class="task-list">
                        ${this._sortTasks(s).map(a=>p`
                          <div class="filtered-hidden-wrapper">
                            ${this._renderTask(a)}
                          </div>
                        `)}
                      </div>
                    `:c}
                  `:c}
                </div>`:p`
                  <div class="task-list">
                    ${this._sortTasks(e).map(a=>this._renderTask(a))}
                  </div>
                  ${n?p`
                    <button class="filter-expand-btn"
                      @click=${()=>{this._showHidden=!this._showHidden}}>
                      ${this._showHidden?`\u25B2 Hide ${s.length} filtered task${s.length!==1?"s":""}`:`\u25BC Show ${s.length} filtered task${s.length!==1?"s":""}`}
                    </button>
                    ${this._showHidden?p`
                      <div class="hidden-divider">Hidden by filter</div>
                      <div class="task-list">
                        ${this._sortTasks(s).map(a=>p`
                          <div class="filtered-hidden-wrapper">
                            ${this._renderTask(a)}
                          </div>
                        `)}
                      </div>
                    `:c}
                  `:c}
                `}

        ${this._showForm?p`
          <div class="form-panel">
            <div class="form-title">${this._editingTaskId?"Edit task":"Add task"}</div>

            <!-- Title (required) -->
            <label class="form-label">Title *</label>
            <input class="form-input" type="text" .value=${this._formTitle}
              @input=${a=>this._formTitle=a.target.value}
              placeholder="Task title" />

            <!-- Due date (optional) -->
            <label class="form-label">Due date</label>
            <input class="form-input" type="date" .value=${this._formDue}
              @input=${a=>this._formDue=a.target.value} />

            <!-- Priority -->
            <label class="form-label">Priority</label>
            <div class="priority-buttons">
              ${[1,2,3].map(a=>p`
                <button class="priority-btn ${this._formPriority===a?"active":""}"
                  style="--btn-color:${this._priorityColor(a)}"
                  @click=${()=>this._formPriority=a}>
                  ${{1:"Low",2:"Medium",3:"High"}[a]}
                </button>`)}
            </div>

            <!-- Assignee -->
            <label class="form-label">Assignee</label>
            <input class="form-input" type="text" .value=${this._formAssignee}
              list="smart-todo-roster-list"
              @input=${a=>this._formAssignee=a.target.value}
              placeholder="Optional" />

            <!-- Points -->
            <label class="form-label">Points</label>
            <input class="form-input" type="number" min="0" .value=${String(this._formPoints)}
              @input=${a=>this._formPoints=parseInt(a.target.value)||0}
              placeholder="0" />

            <!-- Reward recipient (only meaningful when Points > 0) -->
            ${this._formPoints>0?p`
              <label class="form-label">Reward recipient</label>
              <input class="form-input" type="text" .value=${this._formRewardRecipient}
                list="smart-todo-roster-list"
                @input=${a=>this._formRewardRecipient=a.target.value}
                placeholder="Defaults to assignee" />
            `:c}

            <datalist id="smart-todo-roster-list">
              ${this._roster.map(a=>p`<option value=${a}></option>`)}
            </datalist>

            <!-- Recurrence type -->
            <label class="form-label">Recurrence</label>
            <select class="form-input" .value=${this._formRecurrenceType}
              @change=${a=>this._formRecurrenceType=a.target.value}>
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
                @click=${()=>{this._showForm=!1,this._editingTaskId=void 0,this._editingOriginalRecurrence=null}}>Cancel</button>
              <button class="form-btn submit" ?disabled=${this._formSubmitting||!this._formTitle.trim()}
                @click=${()=>this._submitForm()}>
                ${this._formSubmitting?this._editingTaskId?"Saving\u2026":"Adding\u2026":this._editingTaskId?"Save changes":"Add task"}
              </button>
            </div>
          </div>
        `:c}

        <button class="fab" @click=${()=>this._openForm()} title="Add task">+</button>
      </ha-card>
    `}_openForm(){this._showForm=!0,this._editingTaskId=void 0,this._editingOriginalRecurrence=null,this._formTitle="",this._formDue="",this._formPriority=2,this._formAssignee="",this._formPoints=0,this._formRewardRecipient="",this._formRecurrenceType="none",this._formWeekdays=[],this._formTime="09:00",this._formIntervalDays=7,this._formAnchorDate=new Date().toISOString().slice(0,10),this._formSubmitting=!1}_openEditForm(e){this._showForm=!0,this._editingTaskId=e.id,this._formSubmitting=!1,this._formTitle=e.title,this._formDue=e.due_at?e.due_at.slice(0,10):"",this._formPriority=e.priority,this._formAssignee=e.assignee??"",this._formPoints=e.points,this._formRewardRecipient=e.reward_recipient??"";let r=e.recurrence_rule??null;switch(this._editingOriginalRecurrence=r,this._formWeekdays=r?.weekdays??[],this._formTime=r?.time_of_day?r.time_of_day.slice(0,5):"09:00",this._formIntervalDays=r?.interval_days??7,this._formAnchorDate=r?.anchor_date??new Date().toISOString().slice(0,10),r?.mode){case"weekdays":case"weekly":this._formRecurrenceType="weekly";break;case"biweekly_weekdays":this._formRecurrenceType="biweekly";break;case"monthly":this._formRecurrenceType="monthly";break;case"rolling_days":this._formRecurrenceType="rolling_days";break;case"interval_days":this._formRecurrenceType="interval_days";break;default:this._formRecurrenceType="none"}}_renderRecurrenceSubFields(){let e=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];switch(this._formRecurrenceType){case"weekly":case"biweekly":return p`
          <label class="form-label">Day(s)</label>
          <div class="weekday-picker">
            ${e.map((r,i)=>p`
              <button class="day-btn ${this._formWeekdays.includes(i)?"active":""}"
                @click=${()=>this._toggleWeekday(i)}>${r}</button>`)}
          </div>
          <label class="form-label">Time</label>
          <input class="form-input" type="time" .value=${this._formTime}
            @input=${r=>this._formTime=r.target.value} />
          ${this._formRecurrenceType==="biweekly"?p`
            <label class="form-label">Starting from (anchor date)</label>
            <input class="form-input" type="date" .value=${this._formAnchorDate}
              @input=${r=>this._formAnchorDate=r.target.value} />
          `:c}
        `;case"interval_days":case"rolling_days":return p`
          <label class="form-label">Every</label>
          <input class="form-input" type="number" min="1" max="365"
            .value=${String(this._formIntervalDays)}
            @input=${r=>this._formIntervalDays=parseInt(r.target.value)||1} />
          <span class="form-hint">days${this._formRecurrenceType==="rolling_days"?" after completion":""}</span>
        `;case"monthly":return p`
          <label class="form-label">Day of month</label>
          <input class="form-input" type="date" .value=${this._formAnchorDate}
            @input=${r=>this._formAnchorDate=r.target.value} />
          <span class="form-hint">Only the day number is used — pick any 15th for "the 15th of every month"</span>
          <label class="form-label">Time</label>
          <input class="form-input" type="time" .value=${this._formTime}
            @input=${r=>this._formTime=r.target.value} />
        `;default:return c}}_toggleWeekday(e){this._formWeekdays.includes(e)?this._formWeekdays=this._formWeekdays.filter(r=>r!==e):this._formWeekdays=[...this._formWeekdays,e]}_buildRecurrenceDict(){let e=this._formTime?`${this._formTime}:00`:null;switch(this._formRecurrenceType){case"daily":return{mode:"interval_days",interval_days:1};case"weekly":return{mode:"weekly",weekdays:this._formWeekdays,time_of_day:e};case"interval_days":return{mode:"interval_days",interval_days:this._formIntervalDays};case"rolling_days":return{mode:"rolling_days",interval_days:this._formIntervalDays};case"biweekly":return{mode:"biweekly_weekdays",weekdays:this._formWeekdays,time_of_day:e,anchor_date:this._formAnchorDate};case"monthly":return{mode:"monthly",anchor_date:this._formAnchorDate,time_of_day:e};default:return null}}_recurrenceEquals(e,r){if(e===null&&r===null)return!0;if(e===null||r===null)return!1;let i=s=>JSON.stringify({mode:s.mode??null,interval_days:s.interval_days??null,weekdays:Array.isArray(s.weekdays)?[...s.weekdays].sort((n,l)=>n-l):null,week_parity:s.week_parity??null,anchor_date:s.anchor_date??null,time_of_day:s.time_of_day??null});return i(e)===i(r)}async _submitForm(){if(!this._formTitle.trim()||!this._hass)return;this._formSubmitting=!0;let e=this._editingTaskId!==void 0,r=this._buildRecurrenceDict(),i={title:this._formTitle.trim(),priority:this._formPriority};e?(i.task_id=this._editingTaskId,i.assignee=this._formAssignee.trim()||null,i.points=this._formPoints,i.reward_recipient=this._formPoints>0&&this._formRewardRecipient.trim()?this._formRewardRecipient.trim():null,this._recurrenceEquals(r,this._editingOriginalRecurrence)||(i.recurrence=r),r||(i.due_at=this._formDue?`${this._formDue}T00:00:00`:null)):(this._formDue&&(i.due_at=`${this._formDue}T00:00:00`),this._formAssignee.trim()&&(i.assignee=this._formAssignee.trim()),this._formPoints>0&&(i.points=this._formPoints),this._formPoints>0&&this._formRewardRecipient.trim()&&(i.reward_recipient=this._formRewardRecipient.trim()),r&&(i.recurrence=r));try{await this._hass.callService("smart_todo",e?"update_task":"create_task",i,void 0,!1),this._showForm=!1,this._editingTaskId=void 0,this._editingOriginalRecurrence=null,this._fetchTasks(!0)}catch(s){let n=e?"update":"create";this._error=`Failed to ${n} task: ${s instanceof Error?s.message:String(s)}`}finally{this._formSubmitting=!1}}async _completeTask(e){try{await this._hass.callService("smart_todo","complete_task",{task_id:e},void 0,!1),this._fetchTasks(!0)}catch(r){this._error=`Failed to complete task: ${r instanceof Error?r.message:String(r)}`}}_deleteTask(e){this._confirmDeleteId===e?(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=void 0,this._hass.callService("smart_todo","delete_task",{task_id:e},void 0,!1).then(()=>this._fetchTasks(!0)).catch(r=>{this._error=`Failed to delete task: ${r instanceof Error?r.message:String(r)}`})):(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=e,this._confirmDeleteTimer=setTimeout(()=>{this._confirmDeleteId=void 0},3e3))}_openSnooze(e){this._snoozeTaskId=this._snoozeTaskId===e?void 0:e;let r=new Date;r.setDate(r.getDate()+1),this._snoozeDate=r.toISOString().slice(0,10),this._snoozeTime="08:00"}async _submitSnooze(){if(!this._snoozeTaskId||!this._snoozeDate)return;let e=`${this._snoozeDate}T${this._snoozeTime}:00`;try{await this._hass.callService("smart_todo","snooze_task",{task_id:this._snoozeTaskId,snooze_until:e},void 0,!1),this._snoozeTaskId=void 0,this._fetchTasks(!0)}catch(r){this._error=`Failed to snooze task: ${r instanceof Error?r.message:String(r)}`}}_renderSnoozePopover(){return p`
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
    `}_formatDue(e){let r=new Date(e),i=new Date,s=new Date(i.getFullYear(),i.getMonth(),i.getDate()),n=new Date(r.getFullYear(),r.getMonth(),r.getDate()),l=Math.round((n.getTime()-s.getTime())/864e5),d=n<s,h;return l===0?h="Today":l===1?h="Tomorrow":l>1&&l<=6?h=r.toLocaleDateString(void 0,{weekday:"short"}):h=r.toLocaleDateString(void 0,{day:"numeric",month:"short"}),{text:h,overdue:d}}_assigneeInitials(e){let r=e.trim().split(/\s+/);return r.length>=2?(r[0][0]+r[1][0]).toUpperCase():r[0].slice(0,2).toUpperCase()}_dueClass(e){if(e.completed)return"";let i=e.snoozed_until!=null&&new Date(e.snoozed_until)>new Date?e.snoozed_until:e.due_at;if(!i)return"";let s=new Date(i),n=new Date,l=new Date(n.getFullYear(),n.getMonth(),n.getDate()),d=new Date(s.getFullYear(),s.getMonth(),s.getDate()),h=Math.round((d.getTime()-l.getTime())/864e5);return h<0?"due-overdue-row":h===0?"due-today-row":h<=2?"due-soon-row":""}_priorityColor(e){return e===3?"var(--error-color, #db4437)":e===2?"var(--primary-color, #0288d1)":"var(--secondary-text-color, #9e9e9e)"}_renderTask(e){let r=e.snoozed_until!=null&&new Date(e.snoozed_until)>new Date,i=r?e.snoozed_until:e.due_at,s=i?this._formatDue(i):null;return p`
      <div class="task-row ${this._dueClass(e)}">
        <div
          class="task-priority"
          style="background:${this._priorityColor(e.priority)}"
        ></div>
        <div class="task-body">
          <div class="task-title-row">
            <span class="task-title ${e.completed?"completed":""}">${e.title}</span>
            ${e.overdue&&!e.completed?p`<span style="color:var(--error-color,#db4437)">&#9888;</span>`:c}
            ${r?p`<span>&#x1F4A4;</span>`:c}
          </div>
          ${s?p`<div class="task-meta">
                <span class="${s.overdue&&!e.completed?"due-overdue":""}">${s.text}</span>
                ${e.recurrence?p`<span class="recurrence-label">${e.recurrence}</span>`:c}
              </div>`:e.recurrence?p`<div class="task-meta">
                  <span class="recurrence-label">${e.recurrence}</span>
                </div>`:c}
        </div>
        <div class="task-row-right">
          ${e.points>0?p`<div class="points-badge"
                title="${[e.reward_recipient?`Reward recipient: ${e.reward_recipient}`:"Falls back to assignee",e.points_earned>0?`Earned ${e.points_earned}pt(s) so far`:null].filter(Boolean).join(" \xB7 ")}">
                ${e.points}pts
              </div>`:c}
          ${e.assignee?p`<div class="assignee-chip">${this._assigneeInitials(e.assignee)}</div>`:c}
          <div class="task-actions">
            <!-- Complete button (hidden if already completed) -->
            ${e.completed?c:p`
              <button class="action-btn complete" title="Complete"
                @click=${()=>this._completeTask(e.id)}>✓</button>
            `}

            <!-- Edit button -->
            <button class="action-btn edit" title="Edit"
              @click=${()=>this._openEditForm(e)}>✎</button>

            <!-- Delete button — two-tap confirmation -->
            <button class="action-btn delete ${this._confirmDeleteId===e.id?"confirming":""}"
              title="${this._confirmDeleteId===e.id?"Tap again to confirm":"Delete"}"
              @click=${()=>this._deleteTask(e.id)}>
              ${this._confirmDeleteId===e.id?"\u2713?":"\u{1F5D1}"}
            </button>

            <!-- Snooze button (hidden if completed) -->
            ${e.completed?c:p`
              <button class="action-btn snooze" title="Snooze"
                @click=${()=>this._openSnooze(e.id)}>💤</button>
            `}
          </div>
        </div>
      </div>

      <!-- Snooze popover (shown below this task row when active) -->
      ${this._snoozeTaskId===e.id?this._renderSnoozePopover():c}
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
  `,m([_()],u.prototype,"_config",2),m([_()],u.prototype,"_tasks",2),m([_()],u.prototype,"_roster",2),m([_()],u.prototype,"_loading",2),m([_()],u.prototype,"_error",2),m([_()],u.prototype,"_showForm",2),m([_()],u.prototype,"_editingTaskId",2),m([_()],u.prototype,"_formTitle",2),m([_()],u.prototype,"_formDue",2),m([_()],u.prototype,"_formPriority",2),m([_()],u.prototype,"_formAssignee",2),m([_()],u.prototype,"_formPoints",2),m([_()],u.prototype,"_formRewardRecipient",2),m([_()],u.prototype,"_formRecurrenceType",2),m([_()],u.prototype,"_formWeekdays",2),m([_()],u.prototype,"_formTime",2),m([_()],u.prototype,"_formIntervalDays",2),m([_()],u.prototype,"_formAnchorDate",2),m([_()],u.prototype,"_formSubmitting",2),m([_()],u.prototype,"_confirmDeleteId",2),m([_()],u.prototype,"_confirmDeleteTimer",2),m([_()],u.prototype,"_snoozeTaskId",2),m([_()],u.prototype,"_snoozeDate",2),m([_()],u.prototype,"_snoozeTime",2),m([_()],u.prototype,"_showHidden",2),u=m([ie("smart-todo-card")],u);window.customCards=window.customCards??[];window.customCards.push({type:"smart-todo-card",name:"Smart Todo",description:"Manage your Smart Todo recurring tasks.",preview:!0});})();
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
