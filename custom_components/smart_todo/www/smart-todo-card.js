"use strict";(()=>{var xe=Object.defineProperty;var we=Object.getOwnPropertyDescriptor;var m=(o,t,e,i)=>{for(var s=i>1?void 0:i?we(t,e):t,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(t,e,s):n(s))||s);return i&&s&&xe(t,e,s),s};var N=globalThis,U=N.ShadowRoot&&(N.ShadyCSS===void 0||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),re=new WeakMap,P=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(U&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=re.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&re.set(e,t))}return t}toString(){return this.cssText}},oe=o=>new P(typeof o=="string"?o:o+"",void 0,B),L=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((i,s,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[r+1],o[0]);return new P(e,o,B)},ne=(o,t)=>{if(U)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=N.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,o.appendChild(i)}},V=U?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return oe(e)})(o):o;var{is:ke,defineProperty:Ae,getOwnPropertyDescriptor:Te,getOwnPropertyNames:Ee,getOwnPropertySymbols:Se,getPrototypeOf:De}=Object,F=globalThis,ae=F.trustedTypes,Pe=ae?ae.emptyScript:"",Re=F.reactiveElementPolyfillSupport,R=(o,t)=>o,z={toAttribute(o,t){switch(t){case Boolean:o=o?Pe:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},j=(o,t)=>!ke(o,t),le={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=le){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Ae(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:r}=Te(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let l=s?.call(this);r?.call(this,n),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??le}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=De(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,i=[...Ee(e),...Se(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(V(s))}else t!==void 0&&e.push(V(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ne(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:z).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:z;this._$Em=s;let l=n.fromAttribute(e,r.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(t!==void 0){let n=this.constructor;if(s===!1&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??j)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:n}=r,l=this[s];n!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,r,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[R("elementProperties")]=new Map,y[R("finalized")]=new Map,Re?.({ReactiveElement:y}),(F.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,de=o=>o,W=Q.trustedTypes,ce=W?W.createPolicy("lit-html",{createHTML:o=>o}):void 0,_e="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,ge="?"+$,ze=`<${ge}>`,k=document,C=()=>k.createComment(""),I=o=>o===null||typeof o!="object"&&typeof o!="function",ee=Array.isArray,Me=o=>ee(o)||typeof o?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,he=/>/g,x=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ue=/'/g,me=/"/g,ve=/^(?:script|style|textarea|title)$/i,te=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),p=te(1),qe=te(2),Be=te(3),A=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),fe=new WeakMap,w=k.createTreeWalker(k,129);function ye(o,t){if(!ee(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ce!==void 0?ce.createHTML(t):t}var Ce=(o,t)=>{let e=o.length-1,i=[],s,r=t===2?"<svg>":t===3?"<math>":"",n=M;for(let l=0;l<e;l++){let d=o[l],h,a,_=-1,g=0;for(;g<d.length&&(n.lastIndex=g,a=n.exec(d),a!==null);)g=n.lastIndex,n===M?a[1]==="!--"?n=pe:a[1]!==void 0?n=he:a[2]!==void 0?(ve.test(a[2])&&(s=RegExp("</"+a[2],"g")),n=x):a[3]!==void 0&&(n=x):n===x?a[0]===">"?(n=s??M,_=-1):a[1]===void 0?_=-2:(_=n.lastIndex-a[2].length,h=a[1],n=a[3]===void 0?x:a[3]==='"'?me:ue):n===me||n===ue?n=x:n===pe||n===he?n=M:(n=x,s=void 0);let v=n===x&&o[l+1].startsWith("/>")?" ":"";r+=n===M?d+ze:_>=0?(i.push(h),d.slice(0,_)+_e+d.slice(_)+$+v):d+$+(_===-2?l:v)}return[ye(o,r+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},H=class o{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0,l=t.length-1,d=this.parts,[h,a]=Ce(t,e);if(this.el=o.createElement(h,i),w.currentNode=this.el.content,e===2||e===3){let _=this.el.content.firstChild;_.replaceWith(..._.childNodes)}for(;(s=w.nextNode())!==null&&d.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let _ of s.getAttributeNames())if(_.endsWith(_e)){let g=a[n++],v=s.getAttribute(_).split($),T=/([.?@])?(.*)/.exec(g);d.push({type:1,index:r,name:T[2],strings:v,ctor:T[1]==="."?X:T[1]==="?"?J:T[1]==="@"?K:S}),s.removeAttribute(_)}else _.startsWith($)&&(d.push({type:6,index:r}),s.removeAttribute(_));if(ve.test(s.tagName)){let _=s.textContent.split($),g=_.length-1;if(g>0){s.textContent=W?W.emptyScript:"";for(let v=0;v<g;v++)s.append(_[v],C()),w.nextNode(),d.push({type:2,index:++r});s.append(_[g],C())}}}else if(s.nodeType===8)if(s.data===ge)d.push({type:2,index:r});else{let _=-1;for(;(_=s.data.indexOf($,_+1))!==-1;)d.push({type:7,index:r}),_+=$.length-1}r++}}static createElement(t,e){let i=k.createElement("template");return i.innerHTML=t,i}};function E(o,t,e=o,i){if(t===A)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,r=I(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(o),s._$AT(o,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=E(o,s._$AS(o,t.values),s,i)),t}var G=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??k).importNode(e,!0);w.currentNode=s;let r=w.nextNode(),n=0,l=0,d=i[0];for(;d!==void 0;){if(n===d.index){let h;d.type===2?h=new O(r,r.nextSibling,this,t):d.type===1?h=new d.ctor(r,d.name,d.strings,this,t):d.type===6&&(h=new Z(r,this,t)),this._$AV.push(h),d=i[++l]}n!==d?.index&&(r=w.nextNode(),n++)}return w.currentNode=k,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},O=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),I(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Me(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=H.createElement(ye(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new G(s,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(t){let e=fe.get(t.strings);return e===void 0&&fe.set(t.strings,e=new H(t)),e}k(t){ee(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let r of t)s===e.length?e.push(i=new o(this.O(C()),this.O(C()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=de(t).nextSibling;de(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(t,e=this,i,s){let r=this.strings,n=!1;if(r===void 0)t=E(this,t,e,0),n=!I(t)||t!==this._$AH&&t!==A,n&&(this._$AH=t);else{let l=t,d,h;for(t=r[0],d=0;d<r.length-1;d++)h=E(this,l[i+d],e,d),h===A&&(h=this._$AH[d]),n||=!I(h)||h!==this._$AH[d],h===c?t=c:t!==c&&(t+=(h??"")+r[d+1]),this._$AH[d]=h}n&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},X=class extends S{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},J=class extends S{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},K=class extends S{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??c)===A)return;let i=this._$AH,s=t===c&&i!==c||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var Ie=Q.litHtmlPolyfillSupport;Ie?.(H,O),(Q.litHtmlVersions??=[]).push("3.3.3");var be=(o,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let r=e?.renderBefore??null;i._$litPart$=s=new O(t.insertBefore(C(),r),r,void 0,e??{})}return s._$AI(o),s};var ie=globalThis,b=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=be(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};b._$litElement$=!0,b.finalized=!0,ie.litElementHydrateSupport?.({LitElement:b});var He=ie.litElementPolyfillSupport;He?.({LitElement:b});(ie.litElementVersions??=[]).push("4.2.2");var se=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};var Oe={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:j},Ne=(o=Oe,t,e)=>{let{kind:i,metadata:s}=e,r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),i==="setter"&&((o=Object.create(o)).wrapped=!0),r.set(e.name,o),i==="accessor"){let{name:n}=e;return{set(l){let d=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,d,o,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,o,l),l}}}if(i==="setter"){let{name:n}=e;return function(l){let d=this[n];t.call(this,l),this.requestUpdate(n,d,o,!0,l)}}throw Error("Unsupported decorator location: "+i)};function $e(o){return(t,e)=>typeof e=="object"?Ne(o,t,e):((i,s,r)=>{let n=s.hasOwnProperty(r);return s.constructor.createProperty(r,i),n?Object.getOwnPropertyDescriptor(s,r):void 0})(o,t,e)}function f(o){return $e({...o,state:!0,attribute:!1})}var D=class extends b{constructor(){super(...arguments);this._config={entity:""}}set hass(e){}setConfig(e){this._config={...e}}_valueChanged(e,i){let s={...this._config,[e]:i};s.filter!=="x_days"&&s.filter!=="x_days_plus_overdue"&&delete s.filter_days,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){let e=this._config.filter??"all",i=e==="x_days"||e==="x_days_plus_overdue";return p`
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
          .value=${e}
          @change=${s=>this._valueChanged("filter",s.target.value)}>
          <option value="all">All tasks</option>
          <option value="overdue">Only overdue</option>
          <option value="today">Only today</option>
          <option value="today_plus_overdue">Today + overdue</option>
          <option value="x_days">Within X days</option>
          <option value="x_days_plus_overdue">Within X days + overdue</option>
        </select>
      </div>

      ${i?p`
        <div class="editor-row">
          <label class="editor-label">Days (X)</label>
          <input class="editor-input" type="number" min="1" max="365"
            .value=${String(this._config.filter_days??7)}
            @input=${s=>this._valueChanged("filter_days",parseInt(s.target.value)||7)} />
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
  `,m([f()],D.prototype,"_config",2),D=m([se("smart-todo-card-editor")],D);var u=class extends b{constructor(){super(...arguments);this._tasks=[];this._roster=[];this._loading=!1;this._showForm=!1;this._editingOriginalRecurrence=null;this._formTitle="";this._formDue="";this._formPriority=2;this._formAssignee="";this._formPoints=0;this._formRewardRecipient="";this._formRecurrenceType="none";this._formWeekdays=[];this._formTime="09:00";this._formIntervalDays=7;this._formAnchorDate="";this._formSubmitting=!1;this._snoozeDate="";this._snoozeTime="08:00";this._showHidden=!1;this._pointsPromptSelected=[];this._pointsPromptManualName=""}static getConfigElement(){return document.createElement("smart-todo-card-editor")}static getStubConfig(){return{entity:"",filter:"all"}}setConfig(e){if(!e.entity)throw new Error('smart-todo-card: "entity" is required in card config.');this._config=e,this._showHidden=!1}set hass(e){if(this._hass=e,!this._config?.entity)return;let i=this._hass.states[this._config.entity];if(!i)return;let s=i.last_updated;s!==this._lastUpdated&&(this._lastUpdated=s,clearTimeout(this._debounceTimer),this._debounceTimer=setTimeout(()=>this._fetchTasks(),500))}get hass(){return this._hass}async _fetchTasks(e=!1){if(!(!this._hass||!this._config)){e||(this._loading=!0),this._error=void 0;try{let i=await this._hass.callService("smart_todo","get_tasks",{},void 0,!1,!0),s=i.response,r=i;this._tasks=s?.tasks??r?.tasks??[],this._roster=s?.roster??r?.roster??[]}catch(i){let s=i instanceof Error?i.message:typeof i=="object"&&i!==null&&"message"in i?String(i.message):JSON.stringify(i);this._error=`Failed to load tasks: ${s}`}finally{this._loading=!1}}}_isCompletedToday(e){if(!e.last_completed_at)return!1;let i=new Date(e.last_completed_at.replace(/(\.\d{3})\d+/,"$1")),s=new Date;return i.getFullYear()===s.getFullYear()&&i.getMonth()===s.getMonth()&&i.getDate()===s.getDate()}_getFilteredTasks(){let e=this._config?.filter??"all";if(e==="all")return this._tasks.filter(n=>!this._isCompletedToday(n));let i=new Date,s=new Date(i.getFullYear(),i.getMonth(),i.getDate()),r=this._config?.filter_days??7;return this._tasks.filter(n=>{if(n.completed||this._isCompletedToday(n))return!1;let l=n.overdue===!0;if(e==="overdue")return l;let h=n.snoozed_until!=null&&new Date(n.snoozed_until)>new Date?n.snoozed_until:n.due_at,a=1/0;if(h){let v=new Date(h.replace(/(\.\d{3})\d+/,"$1")),T=new Date(v.getFullYear(),v.getMonth(),v.getDate());a=Math.round((T.getTime()-s.getTime())/864e5)}let _=a===0,g=a>=0&&a<=r;switch(e){case"today":return _&&!l;case"today_plus_overdue":return _||l;case"x_days":return g&&!l;case"x_days_plus_overdue":return g||l;default:return!0}})}_sortTasks(e){return e.slice().sort((i,s)=>{if(i.completed!==s.completed)return i.completed?1:-1;let r=d=>{if(!d)return Number.MAX_SAFE_INTEGER;let h=new Date(d.replace(/(\.\d{3})\d+/,"$1")).getTime();return isNaN(h)?Number.MAX_SAFE_INTEGER:h},n=r(i.due_at),l=r(s.due_at);return n!==l?n<l?-1:1:i.sort_order-s.sort_order})}render(){if(!this._config)return c;let e=this._getFilteredTasks(),i=this._config.filter??"all",s=new Set(e.map(a=>a.id)),r=i==="all"?[]:this._tasks.filter(a=>!s.has(a.id)&&!a.completed&&!this._isCompletedToday(a)),n=r.length>0,l=e.length,d=e.filter(a=>a.overdue&&!a.completed).length,h=this._config.title??"Smart Todo";return p`
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
                      ${this._showHidden?`\u25B2 Hide ${r.length} filtered task${r.length!==1?"s":""}`:`\u25BC Show ${r.length} filtered task${r.length!==1?"s":""}`}
                    </button>
                    ${this._showHidden?p`
                      <div class="hidden-divider">Hidden by filter</div>
                      <div class="task-list">
                        ${this._sortTasks(r).map(a=>p`
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
                      ${this._showHidden?`\u25B2 Hide ${r.length} filtered task${r.length!==1?"s":""}`:`\u25BC Show ${r.length} filtered task${r.length!==1?"s":""}`}
                    </button>
                    ${this._showHidden?p`
                      <div class="hidden-divider">Hidden by filter</div>
                      <div class="task-list">
                        ${this._sortTasks(r).map(a=>p`
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
    `}_openForm(){this._showForm=!0,this._editingTaskId=void 0,this._editingOriginalRecurrence=null,this._formTitle="",this._formDue="",this._formPriority=2,this._formAssignee="",this._formPoints=0,this._formRewardRecipient="",this._formRecurrenceType="none",this._formWeekdays=[],this._formTime="09:00",this._formIntervalDays=7,this._formAnchorDate=new Date().toISOString().slice(0,10),this._formSubmitting=!1}_openEditForm(e){this._showForm=!0,this._editingTaskId=e.id,this._formSubmitting=!1,this._formTitle=e.title,this._formDue=e.due_at?e.due_at.slice(0,10):"",this._formPriority=e.priority,this._formAssignee=e.assignee??"",this._formPoints=e.points,this._formRewardRecipient=e.reward_recipient??"";let i=e.recurrence_rule??null;switch(this._editingOriginalRecurrence=i,this._formWeekdays=i?.weekdays??[],this._formTime=i?.time_of_day?i.time_of_day.slice(0,5):"09:00",this._formIntervalDays=i?.interval_days??7,this._formAnchorDate=i?.anchor_date??new Date().toISOString().slice(0,10),i?.mode){case"weekdays":case"weekly":this._formRecurrenceType="weekly";break;case"biweekly_weekdays":this._formRecurrenceType="biweekly";break;case"monthly":this._formRecurrenceType="monthly";break;case"rolling_days":this._formRecurrenceType="rolling_days";break;case"interval_days":this._formRecurrenceType="interval_days";break;default:this._formRecurrenceType="none"}}_renderRecurrenceSubFields(){let e=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];switch(this._formRecurrenceType){case"weekly":case"biweekly":return p`
          <label class="form-label">Day(s)</label>
          <div class="weekday-picker">
            ${e.map((i,s)=>p`
              <button class="day-btn ${this._formWeekdays.includes(s)?"active":""}"
                @click=${()=>this._toggleWeekday(s)}>${i}</button>`)}
          </div>
          <label class="form-label">Time</label>
          <input class="form-input" type="time" .value=${this._formTime}
            @input=${i=>this._formTime=i.target.value} />
          ${this._formRecurrenceType==="biweekly"?p`
            <label class="form-label">Starting from (anchor date)</label>
            <input class="form-input" type="date" .value=${this._formAnchorDate}
              @input=${i=>this._formAnchorDate=i.target.value} />
          `:c}
        `;case"interval_days":case"rolling_days":return p`
          <label class="form-label">Every</label>
          <input class="form-input" type="number" min="1" max="365"
            .value=${String(this._formIntervalDays)}
            @input=${i=>this._formIntervalDays=parseInt(i.target.value)||1} />
          <span class="form-hint">days${this._formRecurrenceType==="rolling_days"?" after completion":""}</span>
        `;case"monthly":return p`
          <label class="form-label">Day of month</label>
          <input class="form-input" type="date" .value=${this._formAnchorDate}
            @input=${i=>this._formAnchorDate=i.target.value} />
          <span class="form-hint">Only the day number is used — pick any 15th for "the 15th of every month"</span>
          <label class="form-label">Time</label>
          <input class="form-input" type="time" .value=${this._formTime}
            @input=${i=>this._formTime=i.target.value} />
        `;default:return c}}_toggleWeekday(e){this._formWeekdays.includes(e)?this._formWeekdays=this._formWeekdays.filter(i=>i!==e):this._formWeekdays=[...this._formWeekdays,e]}_buildRecurrenceDict(){let e=this._formTime?`${this._formTime}:00`:null;switch(this._formRecurrenceType){case"daily":return{mode:"interval_days",interval_days:1};case"weekly":return{mode:"weekly",weekdays:this._formWeekdays,time_of_day:e};case"interval_days":return{mode:"interval_days",interval_days:this._formIntervalDays};case"rolling_days":return{mode:"rolling_days",interval_days:this._formIntervalDays};case"biweekly":return{mode:"biweekly_weekdays",weekdays:this._formWeekdays,time_of_day:e,anchor_date:this._formAnchorDate};case"monthly":return{mode:"monthly",anchor_date:this._formAnchorDate,time_of_day:e};default:return null}}_recurrenceEquals(e,i){if(e===null&&i===null)return!0;if(e===null||i===null)return!1;let s=r=>JSON.stringify({mode:r.mode??null,interval_days:r.interval_days??null,weekdays:Array.isArray(r.weekdays)?[...r.weekdays].sort((n,l)=>n-l):null,week_parity:r.week_parity??null,anchor_date:r.anchor_date??null,time_of_day:r.time_of_day??null});return s(e)===s(i)}async _submitForm(){if(!this._formTitle.trim()||!this._hass)return;this._formSubmitting=!0;let e=this._editingTaskId!==void 0,i=this._buildRecurrenceDict(),s={title:this._formTitle.trim(),priority:this._formPriority};e?(s.task_id=this._editingTaskId,s.assignee=this._formAssignee.trim()||null,s.points=this._formPoints,s.reward_recipient=this._formPoints>0&&this._formRewardRecipient.trim()?this._formRewardRecipient.trim():null,this._recurrenceEquals(i,this._editingOriginalRecurrence)||(s.recurrence=i),i||(s.due_at=this._formDue?`${this._formDue}T00:00:00`:null)):(this._formDue&&(s.due_at=`${this._formDue}T00:00:00`),this._formAssignee.trim()&&(s.assignee=this._formAssignee.trim()),this._formPoints>0&&(s.points=this._formPoints),this._formPoints>0&&this._formRewardRecipient.trim()&&(s.reward_recipient=this._formRewardRecipient.trim()),i&&(s.recurrence=i));try{await this._hass.callService("smart_todo",e?"update_task":"create_task",s,void 0,!1),this._showForm=!1,this._editingTaskId=void 0,this._editingOriginalRecurrence=null,this._fetchTasks(!0)}catch(r){let n=e?"update":"create";this._error=`Failed to ${n} task: ${r instanceof Error?r.message:String(r)}`}finally{this._formSubmitting=!1}}async _completeTask(e){if(!e.assignee&&!e.reward_recipient&&e.points>0){this._pointsPromptTaskId=e.id,this._pointsPromptSelected=[],this._pointsPromptManualName="";return}await this._submitCompleteTask(e.id)}async _submitCompleteTask(e,i){try{let s={task_id:e};i!==void 0&&(s.recipients=i),await this._hass.callService("smart_todo","complete_task",s,void 0,!1),this._pointsPromptTaskId=void 0,this._fetchTasks(!0)}catch(s){this._error=`Failed to complete task: ${s instanceof Error?s.message:String(s)}`}}_togglePromptRecipient(e){this._pointsPromptSelected=this._pointsPromptSelected.includes(e)?this._pointsPromptSelected.filter(i=>i!==e):[...this._pointsPromptSelected,e]}_confirmPointsPrompt(){if(!this._pointsPromptTaskId)return;let e=this._pointsPromptManualName.trim(),i=e?[...this._pointsPromptSelected,e]:this._pointsPromptSelected,s=[...new Set(i.map(r=>r.trim()).filter(Boolean))];s.length!==0&&this._submitCompleteTask(this._pointsPromptTaskId,s)}_declinePointsPrompt(){this._pointsPromptTaskId&&this._submitCompleteTask(this._pointsPromptTaskId,[])}_renderPointsPromptPopover(e){let i=this._pointsPromptSelected;return p`
      <div class="snooze-popover">
        <span class="form-label">Who completed "${e.title}"?</span>
        ${this._roster.length>0?p`
          <div class="points-roster-picker">
            ${this._roster.map(s=>p`
              <label class="points-roster-option">
                <input type="checkbox" .checked=${i.includes(s)}
                  @change=${()=>this._togglePromptRecipient(s)} />
                ${s}
              </label>
            `)}
          </div>
        `:c}
        <input class="form-input" placeholder="Or type a name"
          list="smart-todo-roster-list"
          .value=${this._pointsPromptManualName}
          @input=${s=>this._pointsPromptManualName=s.target.value} />
        <div class="form-hint">
          ${i.length+(this._pointsPromptManualName.trim()?1:0)>1?`${e.points}pts will be split evenly between everyone selected.`:`${e.points}pts will be awarded to whoever is selected.`}
        </div>
        <div class="form-actions">
          <button class="form-btn cancel" @click=${()=>this._pointsPromptTaskId=void 0}>Cancel</button>
          <button class="form-btn cancel" @click=${()=>this._declinePointsPrompt()}>Don't award points</button>
          <button class="form-btn submit"
            ?disabled=${i.length===0&&!this._pointsPromptManualName.trim()}
            @click=${()=>this._confirmPointsPrompt()}>Confirm</button>
        </div>
      </div>
    `}_deleteTask(e){this._confirmDeleteId===e?(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=void 0,this._hass.callService("smart_todo","delete_task",{task_id:e},void 0,!1).then(()=>this._fetchTasks(!0)).catch(i=>{this._error=`Failed to delete task: ${i instanceof Error?i.message:String(i)}`})):(clearTimeout(this._confirmDeleteTimer),this._confirmDeleteId=e,this._confirmDeleteTimer=setTimeout(()=>{this._confirmDeleteId=void 0},3e3))}_openSnooze(e){this._snoozeTaskId=this._snoozeTaskId===e?void 0:e;let i=new Date;i.setDate(i.getDate()+1),this._snoozeDate=i.toISOString().slice(0,10),this._snoozeTime="08:00"}async _submitSnooze(){if(!this._snoozeTaskId||!this._snoozeDate)return;let e=`${this._snoozeDate}T${this._snoozeTime}:00`;try{await this._hass.callService("smart_todo","snooze_task",{task_id:this._snoozeTaskId,snooze_until:e},void 0,!1),this._snoozeTaskId=void 0,this._fetchTasks(!0)}catch(i){this._error=`Failed to snooze task: ${i instanceof Error?i.message:String(i)}`}}_renderSnoozePopover(){return p`
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
    `}_formatDue(e){let i=new Date(e),s=new Date,r=new Date(s.getFullYear(),s.getMonth(),s.getDate()),n=new Date(i.getFullYear(),i.getMonth(),i.getDate()),l=Math.round((n.getTime()-r.getTime())/864e5),d=n<r,h;return l===0?h="Today":l===1?h="Tomorrow":l>1&&l<=6?h=i.toLocaleDateString(void 0,{weekday:"short"}):h=i.toLocaleDateString(void 0,{day:"numeric",month:"short"}),{text:h,overdue:d}}_assigneeInitials(e){let i=e.trim().split(/\s+/);return i.length>=2?(i[0][0]+i[1][0]).toUpperCase():i[0].slice(0,2).toUpperCase()}_dueClass(e){if(e.completed)return"";let s=e.snoozed_until!=null&&new Date(e.snoozed_until)>new Date?e.snoozed_until:e.due_at;if(!s)return"";let r=new Date(s),n=new Date,l=new Date(n.getFullYear(),n.getMonth(),n.getDate()),d=new Date(r.getFullYear(),r.getMonth(),r.getDate()),h=Math.round((d.getTime()-l.getTime())/864e5);return h<0?"due-overdue-row":h===0?"due-today-row":h<=2?"due-soon-row":""}_priorityColor(e){return e===3?"var(--error-color, #db4437)":e===2?"var(--primary-color, #0288d1)":"var(--secondary-text-color, #9e9e9e)"}_renderTask(e){let i=e.snoozed_until!=null&&new Date(e.snoozed_until)>new Date,s=i?e.snoozed_until:e.due_at,r=s?this._formatDue(s):null;return p`
      <div class="task-row ${this._dueClass(e)}">
        <div
          class="task-priority"
          style="background:${this._priorityColor(e.priority)}"
        ></div>
        <div class="task-body">
          <div class="task-title-row">
            <span class="task-title ${e.completed?"completed":""}">${e.title}</span>
            ${e.overdue&&!e.completed?p`<span style="color:var(--error-color,#db4437)">&#9888;</span>`:c}
            ${i?p`<span>&#x1F4A4;</span>`:c}
          </div>
          ${r?p`<div class="task-meta">
                <span class="${r.overdue&&!e.completed?"due-overdue":""}">${r.text}</span>
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
                @click=${()=>this._completeTask(e)}>✓</button>
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

      <!-- Recipient prompt (shown below this task row when active) -->
      ${this._pointsPromptTaskId===e.id?this._renderPointsPromptPopover(e):c}
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
  `,m([f()],u.prototype,"_config",2),m([f()],u.prototype,"_tasks",2),m([f()],u.prototype,"_roster",2),m([f()],u.prototype,"_loading",2),m([f()],u.prototype,"_error",2),m([f()],u.prototype,"_showForm",2),m([f()],u.prototype,"_editingTaskId",2),m([f()],u.prototype,"_formTitle",2),m([f()],u.prototype,"_formDue",2),m([f()],u.prototype,"_formPriority",2),m([f()],u.prototype,"_formAssignee",2),m([f()],u.prototype,"_formPoints",2),m([f()],u.prototype,"_formRewardRecipient",2),m([f()],u.prototype,"_formRecurrenceType",2),m([f()],u.prototype,"_formWeekdays",2),m([f()],u.prototype,"_formTime",2),m([f()],u.prototype,"_formIntervalDays",2),m([f()],u.prototype,"_formAnchorDate",2),m([f()],u.prototype,"_formSubmitting",2),m([f()],u.prototype,"_confirmDeleteId",2),m([f()],u.prototype,"_confirmDeleteTimer",2),m([f()],u.prototype,"_snoozeTaskId",2),m([f()],u.prototype,"_snoozeDate",2),m([f()],u.prototype,"_snoozeTime",2),m([f()],u.prototype,"_showHidden",2),m([f()],u.prototype,"_pointsPromptTaskId",2),m([f()],u.prototype,"_pointsPromptSelected",2),m([f()],u.prototype,"_pointsPromptManualName",2),u=m([se("smart-todo-card")],u);window.customCards=window.customCards??[];window.customCards.push({type:"smart-todo-card",name:"Smart Todo",description:"Manage your Smart Todo recurring tasks.",preview:!0});})();
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
