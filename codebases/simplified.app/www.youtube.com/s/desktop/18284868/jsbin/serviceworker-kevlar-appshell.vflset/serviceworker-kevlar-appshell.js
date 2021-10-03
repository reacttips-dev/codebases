/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';var aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(a==Array.prototype||a==Object.prototype)return a;a[b]=c.value;return a};
function ba(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");}
var da=ba(this);function ea(a,b){if(b)a:{var c=da;a=a.split(".");for(var d=0;d<a.length-1;d++){var e=a[d];if(!(e in c))break a;c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&aa(c,a,{configurable:!0,writable:!0,value:b})}}
ea("Object.entries",function(a){return a?a:function(b){var c=[],d;for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&c.push([d,b[d]]);return c}});
ea("Array.prototype.includes",function(a){return a?a:function(b,c){var d=this;d instanceof String&&(d=String(d));var e=d.length;c=c||0;for(0>c&&(c=Math.max(c+e,0));c<e;c++){var f=d[c];if(f===b||Object.is(f,b))return!0}return!1}});
ea("String.prototype.matchAll",function(a){return a?a:function(b){if(b instanceof RegExp&&!b.global)throw new TypeError("RegExp passed into String.prototype.matchAll() must have global tag.");var c=new RegExp(b,b instanceof RegExp?void 0:"g"),d=this,e=!1,f={next:function(){if(e)return{value:void 0,done:!0};var g=c.exec(d);if(!g)return e=!0,{value:void 0,done:!0};""===g[0]&&(c.lastIndex+=1);return{value:g,done:!1}}};
f[Symbol.iterator]=function(){return f};
return f}});
ea("Promise.prototype.finally",function(a){return a?a:function(b){return this.then(function(c){return Promise.resolve(b()).then(function(){return c})},function(c){return Promise.resolve(b()).then(function(){throw c;
})})}});
var q=this||self;function r(a,b){a=a.split(".");b=b||q;for(var c=0;c<a.length;c++)if(b=b[a[c]],null==b)return null;return b}
function fa(){}
function u(a,b){a=a.split(".");var c=q;a[0]in c||"undefined"==typeof c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)a.length||void 0===b?c[d]&&c[d]!==Object.prototype[d]?c=c[d]:c=c[d]={}:c[d]=b}
function ha(a,b){function c(){}
c.prototype=b.prototype;a.ra=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.xa=function(d,e,f){for(var g=Array(arguments.length-2),h=2;h<arguments.length;h++)g[h-2]=arguments[h];return b.prototype[e].apply(d,g)}}
;function ia(a,b){if(Error.captureStackTrace)Error.captureStackTrace(this,ia);else{const c=Error().stack;c&&(this.stack=c)}a&&(this.message=String(a));void 0!==b&&(this.ga=b)}
ha(ia,Error);ia.prototype.name="CustomError";function ja(a,b){Array.prototype.forEach.call(a,b,void 0)}
function ka(a,b){for(let d=1;d<arguments.length;d++){const e=arguments[d];var c=typeof e;c="object"!=c?c:e?Array.isArray(e)?"array":c:"null";if("array"==c||"object"==c&&"number"==typeof e.length){c=a.length||0;const f=e.length||0;a.length=c+f;for(let g=0;g<f;g++)a[c+g]=e[g]}else a.push(e)}}
;function la(a){if(!a||"object"!==typeof a)return a;if("function"===typeof a.clone)return a.clone();if("undefined"!==typeof Map&&a instanceof Map)return new Map(a);if("undefined"!==typeof Set&&a instanceof Set)return new Set(a);const b=Array.isArray(a)?[]:"function"!==typeof ArrayBuffer||"function"!==typeof ArrayBuffer.isView||!ArrayBuffer.isView(a)||a instanceof DataView?{}:new a.constructor(a.length);for(const c in a)b[c]=la(a[c]);return b}
const ma="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function na(a,b){let c,d;for(let e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(let f=0;f<ma.length;f++)c=ma[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}}
;function oa(){}
function v(a){return new oa(pa,a)}
var pa={};v("");var qa=String.prototype.trim?function(a){return a.trim()}:function(a){return/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]};var ra;a:{const a=q.navigator;if(a){const b=a.userAgent;if(b){ra=b;break a}}ra=""}let sa=ra;function y(a){return-1!=sa.indexOf(a)}
;function ta(){return y("Firefox")||y("FxiOS")}
function ua(){return(y("Chrome")||y("CriOS"))&&!y("Edge")}
;var A=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function va(a){return a?decodeURI(a):a}
function wa(a,b,c){if(Array.isArray(b))for(var d=0;d<b.length;d++)wa(a,String(b[d]),c);else null!=b&&c.push(a+(""===b?"":"="+encodeURIComponent(String(b))))}
function xa(a){var b=[],c;for(c in a)wa(c,a[c],b);return b.join("&")}
;function ya(a,b){b=String.fromCharCode.apply(null,b);return null==a?b:a+b}
let za;const Aa="undefined"!==typeof TextDecoder;ta();!y("Android")||ua()||ta();ua();var Ba=y("Safari")&&!(ua()||y("Coast")||y("Opera")||y("Edge")||y("Edg/")||y("OPR")||ta()||y("Silk")||y("Android"))&&!(y("iPhone")&&!y("iPod")&&!y("iPad")||y("iPad")||y("iPod"));var Ca={},Da=null;function Ea(a,b){void 0===b&&(b=0);Fa();b=Ca[b];const c=Array(Math.floor(a.length/3)),d=b[64]||"";let e=0,f=0;for(;e<a.length-2;e+=3){var g=a[e],h=a[e+1],k=a[e+2],l=b[g>>2];g=b[(g&3)<<4|h>>4];h=b[(h&15)<<2|k>>6];k=b[k&63];c[f++]=""+l+g+h+k}l=0;k=d;switch(a.length-e){case 2:l=a[e+1],k=b[(l&15)<<2]||d;case 1:a=a[e],c[f]=""+b[a>>2]+b[(a&3)<<4|l>>4]+k+d}return c.join("")}
function Ga(a){var b=a.length,c=3*b/4;c%3?c=Math.floor(c):-1!="=.".indexOf(a[b-1])&&(c=-1!="=.".indexOf(a[b-2])?c-2:c-1);var d=new Uint8Array(c),e=0;Ha(a,function(f){d[e++]=f});
return d.subarray(0,e)}
function Ha(a,b){function c(k){for(;d<a.length;){var l=a.charAt(d++),p=Da[l];if(null!=p)return p;if(!/^[\s\xa0]*$/.test(l))throw Error("Unknown base64 encoding at char: "+l);}return k}
Fa();for(var d=0;;){var e=c(-1),f=c(0),g=c(64),h=c(64);if(64===h&&-1===e)break;b(e<<2|f>>4);64!=g&&(b(f<<4&240|g>>2),64!=h&&b(g<<6&192|h))}}
function Fa(){if(!Da){Da={};for(var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),b=["+/=","+/","-_=","-_.","-_"],c=0;5>c;c++){var d=a.concat(b[c].split(""));Ca[c]=d;for(var e=0;e<d.length;e++){var f=d[e];void 0===Da[f]&&(Da[f]=e)}}}}
;const Ia="function"===typeof Uint8Array.prototype.slice;let Ja;function Ka(a,b,c,d){if(Ma.length){const e=Ma.pop();d&&(e.I=d.I);a&&Na(e,a,b,c);return e}return new Oa(a,b,c,d)}
function Na(a,b,c,d){b=b.constructor===Uint8Array?b:b.constructor===ArrayBuffer?new Uint8Array(b):b.constructor===Array?new Uint8Array(b):b.constructor===String?Ga(b):b instanceof Uint8Array?new Uint8Array(b.buffer,b.byteOffset,b.byteLength):new Uint8Array(0);a.i=b;a.l=void 0!==c?c:0;a.j=void 0!==d?a.l+d:a.i.length;a.h=a.l}
function Pa(a){const b=a.i;let c=b[a.h+0],d=c&127;if(128>c)return a.h+=1,d;c=b[a.h+1];d|=(c&127)<<7;if(128>c)return a.h+=2,d;c=b[a.h+2];d|=(c&127)<<14;if(128>c)return a.h+=3,d;c=b[a.h+3];d|=(c&127)<<21;if(128>c)return a.h+=4,d;c=b[a.h+4];d|=(c&15)<<28;if(128>c)return a.h+=5,d>>>0;a.h+=5;128<=b[a.h++]&&128<=b[a.h++]&&128<=b[a.h++]&&128<=b[a.h++]&&a.h++;return d}
var Oa=class{constructor(a,b,c,{I:d=!1}={}){this.i=null;this.h=this.j=this.l=0;this.m=!1;this.I=d;a&&Na(this,a,b,c)}clone(){return Ka(this.i,this.l,this.j-this.l)}clear(){this.i=null;this.h=this.j=this.l=0;this.I=this.m=!1}reset(){this.h=this.l}advance(a){this.h+=a}},Ma=[];function Qa(a){var b=a.h;(b=b.h==b.j)||(b=a.j)||(b=a.h,b=b.m||0>b.h||b.h>b.j);if(b)return!1;a.o=a.h.h;b=Pa(a.h);const c=b&7;if(0!=c&&5!=c&&1!=c&&2!=c&&3!=c&&4!=c)return a.j=!0,!1;a.m=b;a.l=b>>>3;a.i=c;return!0}
function Ra(a){switch(a.i){case 0:if(0!=a.i)Ra(a);else{for(a=a.h;a.i[a.h]&128;)a.h++;a.h++}break;case 1:1!=a.i?Ra(a):a.h.advance(8);break;case 2:if(2!=a.i)Ra(a);else{var b=Pa(a.h);a.h.advance(b)}break;case 5:5!=a.i?Ra(a):a.h.advance(4);break;case 3:b=a.l;do{if(!Qa(a)){a.j=!0;break}if(4==a.i){a.l!=b&&(a.j=!0);break}Ra(a)}while(1);break;default:a.j=!0}}
var Sa=class{constructor(a){var {I:b=!1,Z:c=!1}={};this.u={I:b};this.Z=c;this.h=Ka(a,void 0,void 0,this.u);this.o=this.h.h;this.i=this.m=this.l=-1;this.j=!1}reset(){this.h.reset();this.i=this.l=-1}advance(a){this.h.advance(a)}};var Ta="function"===typeof Uint8Array;function Ua(a){return null!==a&&"object"==typeof a&&!Array.isArray(a)&&!(Ta&&a instanceof Uint8Array)}
function Va(a,b,c){if(null!=a)return"object"===typeof a?Ta&&a instanceof Uint8Array?c(a):Wa(a,b,c):b(a)}
function Wa(a,b,c){if(Array.isArray(a)){var d=Array(a.length);for(var e=0;e<a.length;e++)d[e]=Va(a[e],b,c);Array.isArray(a)&&a.U&&Xa(d);return d}d={};for(e in a)d[e]=Va(a[e],b,c);return d}
const Ya=a=>"number"===typeof a?isFinite(a)?a:String(a):a,Za=a=>new Uint8Array(a),$a=a=>a,ab={U:{value:!0,
configurable:!0}};function Xa(a){Array.isArray(a)&&!Object.isFrozen(a)&&Object.defineProperties(a,ab);return a}
;function bb(a){a=a.h;const b=[];for(let c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.push(c);return b}
function cb(a,b){return a.j?(b.h||(b.h=new a.j(b.value),a.isFrozen()&&null(b.h)),b.h):b.value}
class db{constructor(a,b){this.i=a;this.j=b;this.h={};this.l=!0;if(0<this.i.length){for(a=0;a<this.i.length;a++){b=this.i[a];const c=b[0];this.h[c.toString()]=new eb(c,b[1])}this.l=!0}}isFrozen(){return!1}toJSON(){const a=this.v(!1);return Wa(a,Ya,Ea)}v(a){if(this.l){if(this.j){var b=this.h;for(var c in b)if(Object.prototype.hasOwnProperty.call(b,c)){var d=b[c].h;d&&d.v(a)}}}else{this.i.length=0;b=bb(this);b.sort();for(c=0;c<b.length;c++){d=this.h[b[c]];const e=d.h;e&&e.v(a);this.i.push([d.key,d.value])}this.l=
!0}return this.i}clear(){this.h={};this.l=!1}entries(){const a=[],b=bb(this);b.sort();for(let c=0;c<b.length;c++){const d=this.h[b[c]];a.push([d.key,cb(this,d)])}return new fb(a)}keys(){const a=[],b=bb(this);b.sort();for(let c=0;c<b.length;c++)a.push(this.h[b[c]].key);return new fb(a)}values(){const a=[],b=bb(this);b.sort();for(let c=0;c<b.length;c++)a.push(cb(this,this.h[b[c]]));return new fb(a)}forEach(a,b){const c=bb(this);c.sort();for(let d=0;d<c.length;d++){const e=this.h[c[d]];a.call(b,cb(this,
e),e.key,this)}}set(a,b){const c=new eb(a);this.j?(c.h=b,c.value=b.v(!1)):c.value=b;this.h[a.toString()]=c;this.l=!1;return this}get(a){if(a=this.h[a.toString()])return cb(this,a)}has(a){return a.toString()in this.h}[Symbol.iterator](){return this.entries()}}class eb{constructor(a,b){this.key=a;this.value=b;this.h=void 0}}class fb{constructor(a){this.i=0;this.h=a}next(){return this.i<this.h.length?{done:!1,value:this.h[this.i++]}:{done:!0,value:void 0}}[Symbol.iterator](){return this}};let gb;function B(a,b,c){var d=gb;gb=null;a||(a=d);d=this.constructor.ba;a||(a=d?[d]:[]);this.l=d?0:-1;this.h=null;this.i=a;a:{d=this.i.length;a=d-1;if(d&&(d=this.i[a],Ua(d))){this.m=a-this.l;this.j=d;break a}void 0!==b&&-1<b?(this.m=Math.max(b,a+1-this.l),this.j=null):this.m=Number.MAX_VALUE}if(c)for(b=0;b<c.length;b++)a=c[b],a<this.m?(a+=this.l,(d=this.i[a])?Xa(d):this.i[a]=hb):(ib(this),(d=this.j[a])?Xa(d):this.j[a]=hb)}
const hb=Object.freeze(Xa([]));function ib(a){let b=a.m+a.l;a.i[b]||(a.j=a.i[b]={})}
function C(a,b,c=!1){return-1===b?null:c||b>=a.m?a.j?a.j[b]:void 0:a.i[b+a.l]}
function jb(a,b){let c=C(a,b,!1);null==c&&(c=hb);c===hb&&(c=Xa([]),kb(a,b,c,!1));return c}
function lb(a,b,c){a.h||(a.h={});if(b in a.h)return a.h[b];let d=C(a,b);d||(d=Xa([]),kb(a,b,d));c=new db(d,c);return a.h[b]=c}
function kb(a,b,c,d=!1){d||b>=a.m?(ib(a),a.j[b]=c):a.i[b+a.l]=c}
function mb(a,b,c,d,e=!1){if(-1===c)return null;a.h||(a.h={});!a.h[c]&&(e=C(a,c,e),d||e)&&(a.h[c]=new b(e));return a.h[c]}
function nb(a,b,c){a.h||(a.h={});let d=a.h[c];if(!d){let e=jb(a,c);d=[];for(let f=0;f<e.length;f++)d[f]=new b(e[f]);a.h[c]=d}return d}
B.prototype.toJSON=function(){const a=ob(this.v(!1));return Wa(a,Ya,Ea)};
B.prototype.v=function(a){if(this.h)for(let b in this.h){const c=this.h[b];if(Array.isArray(c))for(let d=0;d<c.length;d++)c[d]&&c[d].v(a);else c&&c.v(a)}return this.i};
function ob(a){let b,c=a.length,d=!1;for(let g=a.length;g--;){let h=a[g];if(Array.isArray(h)){var e=h;Array.isArray(h)&&h.U&&!h.length?h=null:h=ob(h);h!=e&&(d=!0)}else if(Ua(h)){a:{var f=h;e={};let k=!1;for(let l in f){let p=f[l];if(Array.isArray(p)){let n=p;Array.isArray(p)&&p.U&&!p.length?p=null:p=ob(p);p!=n&&(k=!0)}null!=p?e[l]=p:k=!0}if(k){for(let l in e){f=e;break a}f=null}}f!=h&&(d=!0);c--;continue}null==h&&c==g+1?(d=!0,c--):d&&(b||(b=a.slice(0,c)),b[g]=h)}if(!d)return a;b||(b=a.slice(0,c));
f&&b.push(f);return b}
B.prototype.clone=function(){var a=this.constructor,b=Wa(this.v(!1),$a,Za);gb=b;a=new a(b);gb=null;pb(a,this);return a};
function pb(a,b){b.o&&(a.o=b.o.slice());const c=b.h;if(c){b=b.j;for(let f in c){const g=c[f];if(g){var d=!(!b||!b[f]),e=+f;if(Array.isArray(g)){if(g.length)for(d=nb(a,g[0].constructor,e),e=0;e<Math.min(d.length,g.length);e++)pb(d[e],g[e])}else if(g instanceof db){if(g.j){const h=lb(a,e,g.j);g.forEach((k,l)=>pb(h.get(l),k))}}else(d=mb(a,g.constructor,e,0,d))&&pb(d,g)}}}}
;function qb(a,b){if(4==b.i)return!1;var c=b.o;Ra(b);if(!b.Z){var d=b.h.i;b=b.h.h;c=c===b?Ja||(Ja=new Uint8Array(0)):Ia?d.slice(c,b):new Uint8Array(d.subarray(c,b));(d=a.o)?d.push(c):a.o=[c]}return!0}
;function D(a,b){var c=void 0;return new (c||(c=Promise))(function(d,e){function f(k){try{h(b.next(k))}catch(l){e(l)}}
function g(k){try{h(b["throw"](k))}catch(l){e(l)}}
function h(k){k.done?d(k.value):(new c(function(l){l(k.value)})).then(f,g)}
h((b=b.apply(a,void 0)).next())})}
;v("csi.gstatic.com");v("googleads.g.doubleclick.net");v("pagead2.googlesyndication.com");v("partner.googleadservices.com");v("pubads.g.doubleclick.net");v("securepubads.g.doubleclick.net");v("tpc.googlesyndication.com");/*

 Copyright 2021 Google LLC
 SPDX-License-Identifier: Apache-2.0
*/
function rb(a){if(!a)return"";a=a.split("#")[0].split("?")[0];a=a.toLowerCase();0==a.indexOf("//")&&(a=window.location.protocol+a);/^[\w\-]*:\/\//.test(a)||(a=window.location.href);var b=a.substring(a.indexOf("://")+3),c=b.indexOf("/");-1!=c&&(b=b.substring(0,c));c=a.substring(0,a.indexOf("://"));if(!c)throw Error("URI is missing protocol: "+a);if("http"!==c&&"https"!==c&&"chrome-extension"!==c&&"moz-extension"!==c&&"file"!==c&&"android-app"!==c&&"chrome-search"!==c&&"chrome-untrusted"!==c&&"chrome"!==
c&&"app"!==c&&"devtools"!==c)throw Error("Invalid URI scheme in origin: "+c);a="";var d=b.indexOf(":");if(-1!=d){var e=b.substring(d+1);b=b.substring(0,d);if("http"===c&&"80"!==e||"https"===c&&"443"!==e)a=":"+e}return c+"://"+b+a}
;var sb="client_dev_mss_url client_dev_regex_map client_dev_root_url expflag jsfeat jsmode client_rollout_override".split(" ");function tb(){function a(){e[0]=1732584193;e[1]=4023233417;e[2]=2562383102;e[3]=271733878;e[4]=3285377520;p=l=0}
function b(n){for(var t=g,m=0;64>m;m+=4)t[m/4]=n[m]<<24|n[m+1]<<16|n[m+2]<<8|n[m+3];for(m=16;80>m;m++)n=t[m-3]^t[m-8]^t[m-14]^t[m-16],t[m]=(n<<1|n>>>31)&4294967295;n=e[0];var w=e[1],x=e[2],z=e[3],ca=e[4];for(m=0;80>m;m++){if(40>m)if(20>m){var N=z^w&(x^z);var La=1518500249}else N=w^x^z,La=1859775393;else 60>m?(N=w&x|z&(w|x),La=2400959708):(N=w^x^z,La=3395469782);N=((n<<5|n>>>27)&4294967295)+N+ca+La+t[m]&4294967295;ca=z;z=x;x=(w<<30|w>>>2)&4294967295;w=n;n=N}e[0]=e[0]+n&4294967295;e[1]=e[1]+w&4294967295;
e[2]=e[2]+x&4294967295;e[3]=e[3]+z&4294967295;e[4]=e[4]+ca&4294967295}
function c(n,t){if("string"===typeof n){n=unescape(encodeURIComponent(n));for(var m=[],w=0,x=n.length;w<x;++w)m.push(n.charCodeAt(w));n=m}t||(t=n.length);m=0;if(0==l)for(;m+64<t;)b(n.slice(m,m+64)),m+=64,p+=64;for(;m<t;)if(f[l++]=n[m++],p++,64==l)for(l=0,b(f);m+64<t;)b(n.slice(m,m+64)),m+=64,p+=64}
function d(){var n=[],t=8*p;56>l?c(h,56-l):c(h,64-(l-56));for(var m=63;56<=m;m--)f[m]=t&255,t>>>=8;b(f);for(m=t=0;5>m;m++)for(var w=24;0<=w;w-=8)n[t++]=e[m]>>w&255;return n}
for(var e=[],f=[],g=[],h=[128],k=1;64>k;++k)h[k]=0;var l,p;a();return{reset:a,update:c,digest:d,ha:function(){for(var n=d(),t="",m=0;m<n.length;m++)t+="0123456789ABCDEF".charAt(Math.floor(n[m]/16))+"0123456789ABCDEF".charAt(n[m]%16);return t}}}
;function ub(a,b,c){var d=String(q.location.href);return d&&a&&b?[b,vb(rb(d),a,c||null)].join(" "):null}
function vb(a,b,c){var d=[],e=[];if(1==(Array.isArray(c)?2:1))return e=[b,a],ja(d,function(h){e.push(h)}),wb(e.join(" "));
var f=[],g=[];ja(c,function(h){g.push(h.key);f.push(h.value)});
c=Math.floor((new Date).getTime()/1E3);e=0==f.length?[c,b,a]:[f.join(":"),c,b,a];ja(d,function(h){e.push(h)});
a=wb(e.join(" "));a=[c,a];0==g.length||a.push(g.join(""));return a.join("_")}
function wb(a){var b=tb();b.update(a);return b.ha().toLowerCase()}
;const xb={};function E(){this.h=document||{cookie:""}}
E.prototype.isEnabled=function(){if(!q.navigator.cookieEnabled)return!1;if(!this.isEmpty())return!0;this.set("TESTCOOKIESENABLED","1",{aa:60});if("1"!==this.get("TESTCOOKIESENABLED"))return!1;this.remove("TESTCOOKIESENABLED");return!0};
E.prototype.set=function(a,b,c){let d,e,f,g=!1,h;"object"===typeof c&&(h=c.Fa,g=c.Ga||!1,f=c.domain||void 0,e=c.path||void 0,d=c.aa);if(/[;=\s]/.test(a))throw Error('Invalid cookie name "'+a+'"');if(/[;\r\n]/.test(b))throw Error('Invalid cookie value "'+b+'"');void 0===d&&(d=-1);this.h.cookie=a+"="+b+(f?";domain="+f:"")+(e?";path="+e:"")+(0>d?"":0==d?";expires="+(new Date(1970,1,1)).toUTCString():";expires="+(new Date(Date.now()+1E3*d)).toUTCString())+(g?";secure":"")+(null!=h?";samesite="+h:"")};
E.prototype.get=function(a,b){const c=a+"=",d=(this.h.cookie||"").split(";");for(let e=0,f;e<d.length;e++){f=qa(d[e]);if(0==f.lastIndexOf(c,0))return f.substr(c.length);if(f==a)return""}return b};
E.prototype.remove=function(a,b,c){const d=void 0!==this.get(a);this.set(a,"",{aa:0,path:b,domain:c});return d};
E.prototype.isEmpty=function(){return!this.h.cookie};
E.prototype.clear=function(){var a=(this.h.cookie||"").split(";");const b=[],c=[];let d,e;for(let f=0;f<a.length;f++)e=qa(a[f]),d=e.indexOf("="),-1==d?(b.push(""),c.push(e)):(b.push(e.substring(0,d)),c.push(e.substring(d+1)));for(a=b.length-1;0<=a;a--)this.remove(b[a])};function yb(){return!!xb.FPA_SAMESITE_PHASE2_MOD||!1}
function zb(a,b,c,d){(a=q[a])||(a=(new E).get(b));return a?ub(a,c,d):null}
function Ab(){var a=[],b=rb(String(q.location.href));const c=[];var d=q.__SAPISID||q.__APISID||q.__3PSAPISID||q.__OVERRIDE_SID;yb()&&(d=d||q.__1PSAPISID);if(d)var e=!0;else e=new E,d=e.get("SAPISID")||e.get("APISID")||e.get("__Secure-3PAPISID")||e.get("SID"),yb()&&(d=d||e.get("__Secure-1PAPISID")),e=!!d;e&&(d=(e=b=0==b.indexOf("https:")||0==b.indexOf("chrome-extension:")||0==b.indexOf("moz-extension:"))?q.__SAPISID:q.__APISID,d||(d=new E,d=d.get(e?"SAPISID":"APISID")||d.get("__Secure-3PAPISID")),
(e=d?ub(d,e?"SAPISIDHASH":"APISIDHASH",a):null)&&c.push(e),b&&yb()&&((b=zb("__1PSAPISID","__Secure-1PAPISID","SAPISID1PHASH",a))&&c.push(b),(a=zb("__3PSAPISID","__Secure-3PAPISID","SAPISID3PHASH",a))&&c.push(a)));return 0==c.length?null:c.join(" ")}
;var Bb=class{constructor(a,b){this.j=a;this.l=b;this.i=0;this.h=null}get(){let a;0<this.i?(this.i--,a=this.h,this.h=a.next,a.next=null):a=this.j();return a}put(a){this.l(a);100>this.i&&(this.i++,a.next=this.h,this.h=a)}};function Cb(a){q.setTimeout(()=>{throw a;},0)}
;class Db{constructor(){this.i=this.h=null}add(a,b){const c=Eb.get();c.set(a,b);this.i?this.i.next=c:this.h=c;this.i=c}remove(){let a=null;this.h&&(a=this.h,this.h=this.h.next,this.h||(this.i=null),a.next=null);return a}}var Eb=new Bb(()=>new Fb,a=>a.reset());
class Fb{constructor(){this.next=this.scope=this.h=null}set(a,b){this.h=a;this.scope=b;this.next=null}reset(){this.next=this.scope=this.h=null}};function Gb(a,b){Hb||Ib();Jb||(Hb(),Jb=!0);Kb.add(a,b)}
var Hb;function Ib(){var a=q.Promise.resolve(void 0);Hb=function(){a.then(Lb)}}
var Jb=!1,Kb=new Db;function Lb(){for(var a;a=Kb.remove();){try{a.h.call(a.scope)}catch(b){Cb(b)}Eb.put(a)}Jb=!1}
;function Mb(a){var b=r("window.location.href");null==a&&(a='Unknown Error of type "null/undefined"');if("string"===typeof a)return{message:a,name:"Unknown error",lineNumber:"Not available",fileName:b,stack:"Not available"};var c=!1;try{var d=a.lineNumber||a.line||"Not available"}catch(g){d="Not available",c=!0}try{var e=a.fileName||a.filename||a.sourceURL||q.$googDebugFname||b}catch(g){e="Not available",c=!0}b=Nb(a);if(!(!c&&a.lineNumber&&a.fileName&&a.stack&&a.message&&a.name)){c=a.message;if(null==
c){if(a.constructor&&a.constructor instanceof Function){if(a.constructor.name)c=a.constructor.name;else if(c=a.constructor,Ob[c])c=Ob[c];else{c=String(c);if(!Ob[c]){var f=/function\s+([^\(]+)/m.exec(c);Ob[c]=f?f[1]:"[Anonymous]"}c=Ob[c]}c='Unknown Error of type "'+c+'"'}else c="Unknown Error of unknown type";"function"===typeof a.toString&&Object.prototype.toString!==a.toString&&(c+=": "+a.toString())}return{message:c,name:a.name||"UnknownError",lineNumber:d,fileName:e,stack:b||"Not available"}}a.stack=
b;return{message:a.message,name:a.name,lineNumber:a.lineNumber,fileName:a.fileName,stack:a.stack}}
function Nb(a,b){b||(b={});b[Pb(a)]=!0;var c=a.stack||"";(a=a.ga)&&!b[Pb(a)]&&(c+="\nCaused by: ",a.stack&&0==a.stack.indexOf(a.toString())||(c+="string"===typeof a?a:a.message+"\n"),c+=Nb(a,b));return c}
function Pb(a){var b="";"function"===typeof a.toString&&(b=""+a);return b+a.stack}
var Ob={};function Qb(){this.j=this.j;this.l=this.l}
Qb.prototype.j=!1;Qb.prototype.dispose=function(){this.j||(this.j=!0,this.u())};
Qb.prototype.u=function(){if(this.l)for(;this.l.length;)this.l.shift()()};class Rb{constructor(){this.promise=new Promise((a,b)=>{this.reject=b})}}
;function F(a){this.h=0;this.u=void 0;this.l=this.i=this.j=null;this.m=this.o=!1;if(a!=fa)try{var b=this;a.call(void 0,function(c){G(b,2,c)},function(c){G(b,3,c)})}catch(c){G(this,3,c)}}
function Sb(){this.next=this.context=this.onRejected=this.i=this.h=null;this.j=!1}
Sb.prototype.reset=function(){this.context=this.onRejected=this.i=this.h=null;this.j=!1};
var Tb=new Bb(function(){return new Sb},function(a){a.reset()});
function Ub(a,b,c){var d=Tb.get();d.i=a;d.onRejected=b;d.context=c;return d}
function Vb(a){if(a instanceof F)return a;var b=new F(fa);G(b,2,a);return b}
F.prototype.then=function(a,b,c){return Wb(this,"function"===typeof a?a:null,"function"===typeof b?b:null,c)};
F.prototype.$goog_Thenable=!0;F.prototype.cancel=function(a){if(0==this.h){var b=new Xb(a);Gb(function(){Yb(this,b)},this)}};
function Yb(a,b){if(0==a.h)if(a.j){var c=a.j;if(c.i){for(var d=0,e=null,f=null,g=c.i;g&&(g.j||(d++,g.h==a&&(e=g),!(e&&1<d)));g=g.next)e||(f=g);e&&(0==c.h&&1==d?Yb(c,b):(f?(d=f,d.next==c.l&&(c.l=d),d.next=d.next.next):Zb(c),$b(c,e,3,b)))}a.j=null}else G(a,3,b)}
function ac(a,b){a.i||2!=a.h&&3!=a.h||bc(a);a.l?a.l.next=b:a.i=b;a.l=b}
function Wb(a,b,c,d){var e=Ub(null,null,null);e.h=new F(function(f,g){e.i=b?function(h){try{var k=b.call(d,h);f(k)}catch(l){g(l)}}:f;
e.onRejected=c?function(h){try{var k=c.call(d,h);void 0===k&&h instanceof Xb?g(h):f(k)}catch(l){g(l)}}:g});
e.h.j=a;ac(a,e);return e.h}
F.prototype.J=function(a){this.h=0;G(this,2,a)};
F.prototype.K=function(a){this.h=0;G(this,3,a)};
function G(a,b,c){if(0==a.h){a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself"));a.h=1;a:{var d=c,e=a.J,f=a.K;if(d instanceof F){ac(d,Ub(e||fa,f||null,a));var g=!0}else{if(d)try{var h=!!d.$goog_Thenable}catch(l){h=!1}else h=!1;if(h)d.then(e,f,a),g=!0;else{h=typeof d;if("object"==h&&null!=d||"function"==h)try{var k=d.then;if("function"===typeof k){cc(d,k,e,f,a);g=!0;break a}}catch(l){f.call(a,l);g=!0;break a}g=!1}}}g||(a.u=c,a.h=b,a.j=null,bc(a),3!=b||c instanceof Xb||dc(a,c))}}
function cc(a,b,c,d,e){function f(k){h||(h=!0,d.call(e,k))}
function g(k){h||(h=!0,c.call(e,k))}
var h=!1;try{b.call(a,g,f)}catch(k){f(k)}}
function bc(a){a.o||(a.o=!0,Gb(a.H,a))}
function Zb(a){var b=null;a.i&&(b=a.i,a.i=b.next,b.next=null);a.i||(a.l=null);return b}
F.prototype.H=function(){for(var a;a=Zb(this);)$b(this,a,this.h,this.u);this.o=!1};
function $b(a,b,c,d){if(3==c&&b.onRejected&&!b.j)for(;a&&a.m;a=a.j)a.m=!1;if(b.h)b.h.j=null,ec(b,c,d);else try{b.j?b.i.call(b.context):ec(b,c,d)}catch(e){fc.call(null,e)}Tb.put(b)}
function ec(a,b,c){2==b?a.i.call(a.context,c):a.onRejected&&a.onRejected.call(a.context,c)}
function dc(a,b){a.m=!0;Gb(function(){a.m&&fc.call(null,b)})}
var fc=Cb;function Xb(a){ia.call(this,a)}
ha(Xb,ia);Xb.prototype.name="cancel";function H(a){Qb.call(this);this.K=1;this.m=[];this.o=0;this.h=[];this.i={};this.ea=!!a}
ha(H,Qb);H.prototype.subscribe=function(a,b,c){var d=this.i[a];d||(d=this.i[a]=[]);var e=this.K;this.h[e]=a;this.h[e+1]=b;this.h[e+2]=c;this.K=e+3;d.push(e);return e};
H.prototype.J=function(a){var b=this.h[a];if(b){var c=this.i[b];if(0!=this.o)this.m.push(a),this.h[a+1]=fa;else{if(c){const d=Array.prototype.indexOf.call(c,a,void 0);0<=d&&Array.prototype.splice.call(c,d,1)}delete this.h[a];delete this.h[a+1];delete this.h[a+2]}}return!!b};
H.prototype.H=function(a,b){var c=this.i[a];if(c){for(var d=Array(arguments.length-1),e=1,f=arguments.length;e<f;e++)d[e-1]=arguments[e];if(this.ea)for(e=0;e<c.length;e++){var g=c[e];gc(this.h[g+1],this.h[g+2],d)}else{this.o++;try{for(e=0,f=c.length;e<f&&!this.j;e++)g=c[e],this.h[g+1].apply(this.h[g+2],d)}finally{if(this.o--,0<this.m.length&&0==this.o)for(;c=this.m.pop();)this.J(c)}}return 0!=e}return!1};
function gc(a,b,c){Gb(function(){a.apply(b,c)})}
H.prototype.clear=function(a){if(a){var b=this.i[a];b&&(b.forEach(this.J,this),delete this.i[a])}else this.h.length=0,this.i={}};
H.prototype.u=function(){H.ra.u.call(this);this.clear();this.m.length=0};/*

Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
var hc="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");var ic=["notification/convert_endpoint_to_url"],jc=["notification/record_interactions"],kc=["notification_registration/set_registration"];var lc=a=>self.btoa(String.fromCharCode.apply(null,Array.from(new Uint8Array(a)))).replace(/\+/g,"-").replace(/\//g,"_");var mc=["notifications_register","notifications_check_registration"];var nc=class extends Error{constructor(a,...b){super(a);this.args=[...b]}};let oc=null;function I(a,b){const c={};c.key=a;c.value=b;return pc().then(d=>new Promise((e,f)=>{try{const g=d.transaction("swpushnotificationsstore","readwrite").objectStore("swpushnotificationsstore").put(c);g.onsuccess=()=>{e()};
g.onerror=()=>{f()}}catch(g){f(g)}}))}
function qc(){return I("IndexedDBCheck","testing IndexedDB").then(()=>J("IndexedDBCheck")).then(a=>"testing IndexedDB"===a?Promise.resolve():Promise.reject()).then(()=>!0).catch(()=>!1)}
function J(a){const b=new nc("Error accessing DB");return pc().then(c=>new Promise((d,e)=>{try{const f=c.transaction("swpushnotificationsstore").objectStore("swpushnotificationsstore").get(a);f.onsuccess=()=>{const g=f.result;d(g?g.value:null)};
f.onerror=()=>{b.params={key:a,source:"onerror"};e(b)}}catch(f){b.params={key:a,
thrownError:String(f)},e(b)}}),()=>null)}
function pc(){return oc?Promise.resolve(oc):new Promise((a,b)=>{const c=self.indexedDB.open("swpushnotificationsdb");c.onerror=b;c.onsuccess=()=>{const d=c.result;if(d.objectStoreNames.contains("swpushnotificationsstore"))oc=d,a(oc);else return self.indexedDB.deleteDatabase("swpushnotificationsdb"),pc()};
c.onupgradeneeded=rc})}
function rc(a){a=a.target.result;a.objectStoreNames.contains("swpushnotificationsstore")&&a.deleteObjectStore("swpushnotificationsstore");a.createObjectStore("swpushnotificationsstore",{keyPath:"key"})}
;const sc={["WEB_UNPLUGGED"]:"^unplugged/",["WEB_UNPLUGGED_ONBOARDING"]:"^unplugged/",["WEB_UNPLUGGED_OPS"]:"^unplugged/",["WEB_UNPLUGGED_PUBLIC"]:"^unplugged/",["WEB_CREATOR"]:"^creator/",["WEB_KIDS"]:"^kids/",["WEB_EXPERIMENTS"]:"^experiments/",["WEB_MUSIC"]:"^music/",["WEB_REMIX"]:"^music/",["WEB_MUSIC_EMBEDDED_PLAYER"]:"^music/",["WEB_MUSIC_EMBEDDED_PLAYER"]:"^main_app/|^sfv/"};
function tc(a){if(1===a.length)return a[0];var b=sc.UNKNOWN_INTERFACE;if(b){b=new RegExp(b);for(var c of a)if(b.exec(c))return c}const d=[];Object.entries(sc).forEach(([e,f])=>{"UNKNOWN_INTERFACE"!==e&&d.push(f)});
c=new RegExp(d.join("|"));a.sort((e,f)=>e.length-f.length);
for(const e of a)if(!c.exec(e))return e;return a[0]}
function uc(a){return`/youtubei/v1/${tc(a)}`}
;var vc=class extends B{constructor(a){super(a)}};var wc=class extends B{constructor(a){super(a)}};wc.ba="yt.sw.adr";var xc,yc;const zc=q.window,K=(null===(xc=null===zc||void 0===zc?void 0:zc.yt)||void 0===xc?void 0:xc.config_)||(null===(yc=null===zc||void 0===zc?void 0:zc.ytcfg)||void 0===yc?void 0:yc.data_)||{};u("yt.config_",K);function L(...a){a=arguments;1<a.length?K[a[0]]=a[1]:1===a.length&&Object.assign(K,a[0])}
function M(a,b){return a in K?K[a]:b}
;function O(a){a=Ac(a);return"string"===typeof a&&"false"===a?!1:!!a}
function Bc(a,b){a=Ac(a);return void 0===a&&void 0!==b?b:Number(a||0)}
function Ac(a){const b=M("EXPERIMENTS_FORCED_FLAGS",{});return void 0!==b[a]?b[a]:M("EXPERIMENT_FLAGS",{})[a]}
;let Cc=0;u("ytDomDomGetNextId",r("ytDomDomGetNextId")||(()=>++Cc));const Dc=[];function Ec(a){Dc.forEach(b=>b(a))}
function Fc(a){return a&&window.yterr?function(){try{return a.apply(this,arguments)}catch(b){Gc(b)}}:a}
function Gc(a){var b=r("yt.logging.errors.log");b?b(a,"ERROR",void 0,void 0,void 0):(b=M("ERRORS",[]),b.push([a,"ERROR",void 0,void 0,void 0]),L("ERRORS",b));Ec(a)}
function Hc(a){var b=r("yt.logging.errors.log");b?b(a,"WARNING",void 0,void 0,void 0):(b=M("ERRORS",[]),b.push([a,"WARNING",void 0,void 0,void 0]),L("ERRORS",b))}
;u("ytEventsEventsListeners",q.ytEventsEventsListeners||{});u("ytEventsEventsCounter",q.ytEventsEventsCounter||{count:0});function Ic(a,b){"function"===typeof a&&(a=Fc(a));return window.setTimeout(a,b)}
;var Jc=class{};var Kc=class extends Jc{start(){const a=r("yt.scheduler.instance.start");a&&a()}};Kc.h||(Kc.h=new Kc);const Lc=/^[\w.]*$/,Mc={q:!0,search_query:!0};function Nc(a,b){b=a.split(b);const c={};for(let f=0,g=b.length;f<g;f++){const h=b[f].split("=");if(1==h.length&&h[0]||2==h.length)try{const k=Oc(h[0]||""),l=Oc(h[1]||"");k in c?Array.isArray(c[k])?ka(c[k],l):c[k]=[c[k],l]:c[k]=l}catch(k){var d=k,e=h[0];const l=String(Nc);d.args=[{key:e,value:h[1],query:a,method:Pc==l?"unchanged":l}];Mc.hasOwnProperty(e)||Hc(d)}}return c}
const Pc=String(Nc);function Qc(a){"?"==a.charAt(0)&&(a=a.substr(1));return Nc(a,"&")}
function Rc(a,b,c){var d=a.split("#",2);a=d[0];d=1<d.length?"#"+d[1]:"";var e=a.split("?",2);a=e[0];e=Qc(e[1]||"");for(var f in b)!c&&null!==e&&f in e||(e[f]=b[f]);b=a;a=xa(e);a?(c=b.indexOf("#"),0>c&&(c=b.length),f=b.indexOf("?"),0>f||f>c?(f=c,e=""):e=b.substring(f+1,c),b=[b.substr(0,f),e,b.substr(c)],c=b[1],b[1]=a?c?c+"&"+a:a:c,a=b[0]+(b[1]?"?"+b[1]:"")+b[2]):a=b;return a+d}
function Sc(a){if(!b)var b=window.location.href;const c=a.match(A)[1]||null,d=va(a.match(A)[3]||null);c&&d?(a=a.match(A),b=b.match(A),a=a[3]==b[3]&&a[1]==b[1]&&a[4]==b[4]):a=d?va(b.match(A)[3]||null)==d&&(Number(b.match(A)[4]||null)||null)==(Number(a.match(A)[4]||null)||null):!0;return a}
function Oc(a){return a&&a.match(Lc)?a:decodeURIComponent(a.replace(/\+/g," "))}
;[...sb];let Tc=!1;function Uc(a,b){const c={method:b.method||"GET",credentials:"same-origin"};b.headers&&(c.headers=b.headers);a=Vc(a,b);const d=Wc(a,b);d&&(c.body=d);b.withCredentials&&(c.credentials="include");const e=b.context||q;let f=!1,g;fetch(a,c).then(h=>{if(!f){f=!0;g&&window.clearTimeout(g);var k=h.ok,l=p=>{p=p||{};k?b.onSuccess&&b.onSuccess.call(e,p,h):b.onError&&b.onError.call(e,p,h);b.onFinish&&b.onFinish.call(e,p,h)};
"JSON"==(b.format||"JSON")&&(k||400<=h.status&&500>h.status)?h.json().then(l,function(){l(null)}):l(null)}}).catch(()=>{b.onError&&b.onError.call(e,{},{})});
b.onFetchTimeout&&0<b.timeout&&(g=Ic(()=>{f||(f=!0,window.clearTimeout(g),b.onFetchTimeout.call(b.context||q))},b.timeout))}
function Vc(a,b){b.includeDomain&&(a=document.location.protocol+"//"+document.location.hostname+(document.location.port?":"+document.location.port:"")+a);const c=M("XSRF_FIELD_NAME",void 0);if(b=b.urlParams)b[c]&&delete b[c],a=Rc(a,b||{},!0);return a}
function Wc(a,b){const c=M("XSRF_FIELD_NAME",void 0),d=M("XSRF_TOKEN",void 0);var e=b.postBody||"",f=b.postParams;const g=M("XSRF_FIELD_NAME",void 0);let h;b.headers&&(h=b.headers["Content-Type"]);b.excludeXsrf||va(a.match(A)[3]||null)&&!b.withCredentials&&va(a.match(A)[3]||null)!=document.location.hostname||"POST"!=b.method||h&&"application/x-www-form-urlencoded"!=h||b.postParams&&b.postParams[g]||(f||(f={}),f[c]=d);f&&"string"===typeof e&&(e=Qc(e),na(e,f),e=b.postBodyFormat&&"JSON"==b.postBodyFormat?
JSON.stringify(e):xa(e));if(!(a=e)&&(a=f)){a:{for(const k in f){f=!1;break a}f=!0}a=!f}!Tc&&a&&"POST"!=b.method&&(Tc=!0,Gc(Error("AJAX request with postData should use POST")));return e}
;q.ytPubsubPubsubInstance||new H;const P=window;var Q=P.ytcsi&&P.ytcsi.now?P.ytcsi.now:P.performance&&P.performance.timing&&P.performance.now&&P.performance.timing.navigationStart?()=>P.performance.timing.navigationStart+P.performance.now():()=>(new Date).getTime();const Xc=Bc("initial_gel_batch_timeout",2E3),Yc=Math.pow(2,16)-1;let R=void 0,Zc=0,$c=0,ad=0,bd=!0;const cd=q.ytLoggingTransportGELQueue_||new Map,dd=q.ytLoggingTransportTokensToCttTargetIds_||{};
function ed(a,b){if("log_event"===a.endpoint){var c="";a.M?c="visitorOnlyApprovedKey":a.B&&(dd[a.B.token]=fd(a.B),c=a.B.token);var d=cd.get(c)||[];cd.set(c,d);d.push(a.payload);b&&(R=new b);a=Bc("tvhtml5_logging_max_batch")||Bc("web_logging_max_batch")||100;b=Q();d.length>=a?gd({writeThenSend:!0},O("flush_only_full_queue")?c:void 0):10<=b-ad&&(hd(),ad=b)}}
function id(a,b){if("log_event"===a.endpoint){var c="";a.M?c="visitorOnlyApprovedKey":a.B&&(dd[a.B.token]=fd(a.B),c=a.B.token);var d=new Map;d.set(c,[a.payload]);b&&(R=new b);return new F(e=>{R&&R.isReady()?jd(d,e,{bypassNetworkless:!0},!0):e()})}}
function gd(a={},b){new F(c=>{window.clearTimeout(Zc);window.clearTimeout($c);$c=0;if(R&&R.isReady())if(void 0!==b){const d=new Map,e=cd.get(b)||[];d.set(b,e);jd(d,c,a);cd.delete(b)}else jd(cd,c,a),cd.clear();else hd(),c()})}
function hd(){O("web_gel_timeout_cap")&&!$c&&($c=Ic(()=>{gd({writeThenSend:!0})},6E4));
window.clearTimeout(Zc);let a=M("LOGGING_BATCH_TIMEOUT",Bc("web_gel_debounce_ms",1E4));O("shorten_initial_gel_batch_timeout")&&bd&&(a=Xc);Zc=Ic(()=>{gd({writeThenSend:!0})},a)}
function jd(a,b,c={},d){var e=R;const f=Math.round(Q());let g=a.size;for(const [l,p]of a){var h=l,k=p;a=la({context:kd(e.config_||ld())});a.events=k;(k=dd[h])&&md(a,h,k);delete dd[h];h="visitorOnlyApprovedKey"===h;nd(a,f,h);O("always_send_and_write")&&(c.writeThenSend=!1);od(e,a,{retry:!0,onSuccess:()=>{g--;g||b()},
onError:()=>{g--;g||b()},
Ba:c,M:h,ya:!!d});bd=!1}}
function nd(a,b,c){a.requestTimeMs=String(b);O("unsplit_gel_payloads_in_logs")&&(a.unsplitGelPayloadsInLogs=!0);!c&&(b=M("EVENT_ID",void 0))&&((c=M("BATCH_CLIENT_COUNTER",void 0)||0)||(c=Math.floor(Math.random()*Yc/2)),c++,c>Yc&&(c=1),L("BATCH_CLIENT_COUNTER",c),a.serializedClientEventId={serializedEventId:b,clientCounter:String(c)})}
function md(a,b,c){let d;if(c.videoId)d="VIDEO";else if(c.playlistId)d="PLAYLIST";else return;a.credentialTransferTokenTargetId=c;a.context=a.context||{};a.context.user=a.context.user||{};a.context.user.credentialTransferTokens=[{token:b,scope:d}]}
function fd(a){const b={};a.videoId?b.videoId=a.videoId:a.playlistId&&(b.playlistId=a.playlistId);return b}
;const pd=q.ytLoggingGelSequenceIdObj_||{};function qd(a,b,c,d={}){const e={},f=Math.round(d.timestamp||Q());e.eventTimeMs=f<Number.MAX_SAFE_INTEGER?f:0;e[a]=b;a=r("_lact",window);a=null==a?-1:Math.max(Date.now()-a,0);e.context={lastActivityMs:String(d.timestamp||!isFinite(a)?-1:a)};O("log_sequence_info_on_gel_web")&&d.da&&(a=e.context,b=d.da,pd[b]=b in pd?pd[b]+1:0,a.sequence={index:pd[b],groupKey:b},d.Aa&&delete pd[d.da]);(d.Ha?id:ed)({endpoint:"log_event",payload:e,B:d.B,M:d.M},c)}
;function rd(){if(!q.matchMedia)return"WEB_DISPLAY_MODE_UNKNOWN";try{return q.matchMedia("(display-mode: standalone)").matches?"WEB_DISPLAY_MODE_STANDALONE":q.matchMedia("(display-mode: minimal-ui)").matches?"WEB_DISPLAY_MODE_MINIMAL_UI":q.matchMedia("(display-mode: fullscreen)").matches?"WEB_DISPLAY_MODE_FULLSCREEN":q.matchMedia("(display-mode: browser)").matches?"WEB_DISPLAY_MODE_BROWSER":"WEB_DISPLAY_MODE_UNKNOWN"}catch(a){return"WEB_DISPLAY_MODE_UNKNOWN"}}
;u("ytglobal.prefsUserPrefsPrefs_",r("ytglobal.prefsUserPrefsPrefs_")||{});const sd={bluetooth:"CONN_DISCO",cellular:"CONN_CELLULAR_UNKNOWN",ethernet:"CONN_WIFI",none:"CONN_NONE",wifi:"CONN_WIFI",wimax:"CONN_CELLULAR_4G",other:"CONN_UNKNOWN",unknown:"CONN_UNKNOWN","slow-2g":"CONN_CELLULAR_2G","2g":"CONN_CELLULAR_2G","3g":"CONN_CELLULAR_3G","4g":"CONN_CELLULAR_4G"},td={"slow-2g":"EFFECTIVE_CONNECTION_TYPE_SLOW_2G","2g":"EFFECTIVE_CONNECTION_TYPE_2G","3g":"EFFECTIVE_CONNECTION_TYPE_3G","4g":"EFFECTIVE_CONNECTION_TYPE_4G"};
function ud(){const a=q.navigator;return a?a.connection:void 0}
;function vd(){return"INNERTUBE_API_KEY"in K&&"INNERTUBE_API_VERSION"in K}
function ld(){return{innertubeApiKey:M("INNERTUBE_API_KEY",void 0),innertubeApiVersion:M("INNERTUBE_API_VERSION",void 0),ia:M("INNERTUBE_CONTEXT_CLIENT_CONFIG_INFO"),ja:M("INNERTUBE_CONTEXT_CLIENT_NAME","WEB"),innertubeContextClientVersion:M("INNERTUBE_CONTEXT_CLIENT_VERSION",void 0),la:M("INNERTUBE_CONTEXT_HL",void 0),ka:M("INNERTUBE_CONTEXT_GL",void 0),ma:M("INNERTUBE_HOST_OVERRIDE",void 0)||"",oa:!!M("INNERTUBE_USE_THIRD_PARTY_AUTH",!1),na:!!M("INNERTUBE_OMIT_API_KEY_WHEN_AUTH_HEADER_IS_PRESENT",
!1),appInstallData:M("SERIALIZED_CLIENT_CONFIG_DATA",void 0)}}
function kd(a){const b={client:{hl:a.la,gl:a.ka,clientName:a.ja,clientVersion:a.innertubeContextClientVersion,configInfo:a.ia}};navigator.userAgent&&(b.client.userAgent=String(navigator.userAgent));var c=q.devicePixelRatio;c&&1!=c&&(b.client.screenDensityFloat=String(c));c=M("EXPERIMENTS_TOKEN","");""!==c&&(b.client.experimentsToken=c);c=[];const d=M("EXPERIMENTS_FORCED_FLAGS",{});for(var e in d)c.push({key:e,value:String(d[e])});e=M("EXPERIMENT_FLAGS",{});for(var f in e)f.startsWith("force_")&&void 0===
d[f]&&c.push({key:f,value:String(e[f])});0<c.length&&(b.request={internalExperimentFlags:c});f=b.client.clientName;if("WEB"===f||"MWEB"===f||1===f||2===f){if(!O("web_include_display_mode_killswitch")){var g;b.client.mainAppWebInfo=null!=(g=b.client.mainAppWebInfo)?g:{};b.client.mainAppWebInfo.webDisplayMode=rd()}}else if(g=b.client.clientName,("WEB_REMIX"===g||76===g)&&!O("music_web_display_mode_killswitch")){var h;b.client.ca=null!=(h=b.client.ca)?h:{};b.client.ca.webDisplayMode=rd()}a.appInstallData&&
(b.client.configInfo=b.client.configInfo||{},b.client.configInfo.appInstallData=a.appInstallData);M("DELEGATED_SESSION_ID")&&!O("pageid_as_header_web")&&(b.user={onBehalfOfUser:M("DELEGATED_SESSION_ID")});a:{if(h=ud()){a=sd[h.type||"unknown"]||"CONN_UNKNOWN";h=sd[h.effectiveType||"unknown"]||"CONN_UNKNOWN";"CONN_CELLULAR_UNKNOWN"===a&&"CONN_UNKNOWN"!==h&&(a=h);if("CONN_UNKNOWN"!==a)break a;if("CONN_UNKNOWN"!==h){a=h;break a}}a=void 0}a&&(b.client.connectionType=a);O("web_log_effective_connection_type")&&
(a=ud(),a=null!==a&&void 0!==a&&a.effectiveType?td.hasOwnProperty(a.effectiveType)?td[a.effectiveType]:"EFFECTIVE_CONNECTION_TYPE_UNKNOWN":void 0,a&&(b.client.effectiveConnectionType=a));a=Object;h=a.assign;g=b.client;e=M("DEVICE","");f={};for(const [k,l]of Object.entries(Qc(e)))e=k,c=l,"cbrand"===e?f.deviceMake=c:"cmodel"===e?f.deviceModel=c:"cbr"===e?f.browserName=c:"cbrver"===e?f.browserVersion=c:"cos"===e?f.osName=c:"cosver"===e?f.osVersion=c:"cplatform"===e&&(f.platform=c);b.client=h.call(a,
g,f);return b}
function wd(a,b,c){c=void 0===c?{}:c;const d={"X-Goog-Visitor-Id":c.visitorData||M("VISITOR_DATA","")};if(b&&b.includes("www.youtube-nocookie.com"))return d;(b=c.wa||M("AUTHORIZATION"))||(a?b=`Bearer ${r("gapi.auth.getToken")().va}`:b=Ab());b&&(d.Authorization=b,d["X-Goog-AuthUser"]=M("SESSION_INDEX",0),O("pageid_as_header_web")&&(d["X-Goog-PageId"]=M("DELEGATED_SESSION_ID")));return d}
;var xd=class{isSupported(){return!0}};const S=[];let T,yd=!1;function zd(a){yd||(T?T.handleError(a):(S.push({type:"ERROR",payload:a}),10<S.length&&S.shift()))}
function Ad(a,b){yd||(T?T.N(a,b):(S.push({type:"EVENT",eventType:a,payload:b}),10<S.length&&S.shift()))}
;function Bd(){if(void 0!==M("DATASYNC_ID",void 0))return M("DATASYNC_ID",void 0);throw new nc("Datasync ID not set","unknown");}
;function Cd(a){if(0<=a.indexOf(":"))throw Error("Database name cannot contain ':'");}
function Dd(a){return a.substr(0,a.indexOf(":"))||a}
;const Ed={["AUTH_INVALID"]:"No user identifier specified.",["EXPLICIT_ABORT"]:"Transaction was explicitly aborted.",["IDB_NOT_SUPPORTED"]:"IndexedDB is not supported.",["MISSING_INDEX"]:"Index not created.",["MISSING_OBJECT_STORE"]:"Object store not created.",["DB_DELETED_BY_MISSING_OBJECT_STORE"]:"Database is deleted because an expected object store was not created.",["UNKNOWN_ABORT"]:"Transaction was aborted for unknown reasons.",["QUOTA_EXCEEDED"]:"The current transaction exceeded its quota limitations.",
["QUOTA_MAYBE_EXCEEDED"]:"The current transaction may have failed because of exceeding quota limitations.",["EXECUTE_TRANSACTION_ON_CLOSED_DB"]:"Can't start a transaction on a closed database",["INCOMPATIBLE_DB_VERSION"]:"The binary is incompatible with the database version"},Fd={["AUTH_INVALID"]:"ERROR",["EXECUTE_TRANSACTION_ON_CLOSED_DB"]:"WARNING",["EXPLICIT_ABORT"]:"IGNORED",["IDB_NOT_SUPPORTED"]:"ERROR",["MISSING_INDEX"]:"WARNING",["MISSING_OBJECT_STORE"]:"ERROR",["DB_DELETED_BY_MISSING_OBJECT_STORE"]:"WARNING",
["QUOTA_EXCEEDED"]:"WARNING",["QUOTA_MAYBE_EXCEEDED"]:"WARNING",["UNKNOWN_ABORT"]:"WARNING",["INCOMPATIBLE_DB_VERSION"]:"WARNING"},Gd={["AUTH_INVALID"]:!1,["EXECUTE_TRANSACTION_ON_CLOSED_DB"]:!1,["EXPLICIT_ABORT"]:!1,["IDB_NOT_SUPPORTED"]:!1,["MISSING_INDEX"]:!1,["MISSING_OBJECT_STORE"]:!1,["DB_DELETED_BY_MISSING_OBJECT_STORE"]:!1,["QUOTA_EXCEEDED"]:!1,["QUOTA_MAYBE_EXCEEDED"]:!0,["UNKNOWN_ABORT"]:!0,["INCOMPATIBLE_DB_VERSION"]:!1};
var U=class extends nc{constructor(a,b={},c=Ed[a],d=Fd[a],e=Gd[a]){super(c,Object.assign({name:"YtIdbKnownError",isSw:void 0===self.document,isIframe:self!==self.top,type:a},b));this.type=a;this.message=c;this.level=d;this.h=e;Object.setPrototypeOf(this,U.prototype)}},Hd=class extends U{constructor(a){super("MISSING_OBJECT_STORE",{qa:a},Ed.MISSING_OBJECT_STORE);Object.setPrototypeOf(this,Hd.prototype)}},Id=class extends Error{constructor(a,b){super();this.index=a;this.objectStore=b;Object.setPrototypeOf(this,
Id.prototype)}};const Jd=["The database connection is closing","Can't start a transaction on a closed database","A mutation operation was attempted on a database that did not allow mutations"];
function Kd(a,b,c,d){b=Dd(b);let e;e=a instanceof Error?a:Error(`Unexpected error: ${a}`);if(e instanceof U)return e;if("QuotaExceededError"===e.name)return new U("QUOTA_EXCEEDED",{objectStoreNames:c,dbName:b});if(Ba&&"UnknownError"===e.name)return new U("QUOTA_MAYBE_EXCEEDED",{objectStoreNames:c,dbName:b});if(e instanceof Id)return new U("MISSING_INDEX",{dbName:b,dbVersion:d,objectStore:e.objectStore,index:e.index});if("InvalidStateError"===e.name&&Jd.some(f=>e.message.includes(f)))return new U("EXECUTE_TRANSACTION_ON_CLOSED_DB",
{objectStoreNames:c,
dbName:b});if("AbortError"===e.name)return new U("UNKNOWN_ABORT",{objectStoreNames:c,dbName:b},e.message);e.args=[{name:"IdbError",Ca:e.name,dbName:b,objectStoreNames:c}];e.level="WARNING";return e}
;function Ld(a){if(!a)throw Error();throw a;}
function Md(a){return a}
var Nd=class{constructor(a){this.h=a}};function Od(a){return new V(new Nd((b,c)=>{a instanceof V?a.then(b,c):b(a)}))}
function Pd(a,b,c,d,e){try{if("FULFILLED"!==a.state.status)throw Error("calling handleResolve before the promise is fulfilled.");const f=c(a.state.value);f instanceof V?Qd(a,b,f,d,e):d(f)}catch(f){e(f)}}
function Rd(a,b,c,d,e){try{if("REJECTED"!==a.state.status)throw Error("calling handleReject before the promise is rejected.");const f=c(a.state.reason);f instanceof V?Qd(a,b,f,d,e):d(f)}catch(f){e(f)}}
function Qd(a,b,c,d,e){b===c?e(new TypeError("Circular promise chain detected.")):c.then(f=>{f instanceof V?Qd(a,b,f,d,e):d(f)},f=>{e(f)})}
var V=class{constructor(a){this.state={status:"PENDING"};this.h=[];this.onRejected=[];a=a.h;const b=d=>{if("PENDING"===this.state.status){this.state={status:"FULFILLED",value:d};for(const e of this.h)e()}},c=d=>{if("PENDING"===this.state.status){this.state={status:"REJECTED",
reason:d};for(const e of this.onRejected)e()}};
try{a(b,c)}catch(d){c(d)}}static all(a){return new V(new Nd((b,c)=>{const d=[];let e=a.length;0===e&&b(d);for(let f=0;f<a.length;++f)Od(a[f]).then(g=>{d[f]=g;e--;0===e&&b(d)}).catch(g=>{c(g)})}))}static reject(a){return new V(new Nd((b,c)=>{c(a)}))}then(a,b){const c=null!==a&&void 0!==a?a:Md,d=null!==b&&void 0!==b?b:Ld;
return new V(new Nd((e,f)=>{"PENDING"===this.state.status?(this.h.push(()=>{Pd(this,this,c,e,f)}),this.onRejected.push(()=>{Rd(this,this,d,e,f)})):"FULFILLED"===this.state.status?Pd(this,this,c,e,f):"REJECTED"===this.state.status&&Rd(this,this,d,e,f)}))}catch(a){return this.then(void 0,a)}};function Sd(a,b,c){const d=()=>{try{a.removeEventListener("success",e),a.removeEventListener("error",f)}catch(g){}},e=()=>{b(a.result);
d()},f=()=>{c(a.error);
d()};
a.addEventListener("success",e);a.addEventListener("error",f)}
function Td(a){return new Promise((b,c)=>{Sd(a,b,c)})}
function W(a){return new V(new Nd((b,c)=>{Sd(a,b,c)}))}
;function Ud(a,b){return new V(new Nd((c,d)=>{const e=()=>{const f=a?b(a):null;f?f.then(g=>{a=g;e()},d):c()};
e()}))}
;function X(a,b,c,d){return D(a,function*(){const e={mode:"readonly",D:!1,tag:"IDB_TRANSACTION_TAG_UNKNOWN"};"string"===typeof c?e.mode=c:Object.assign(e,c);this.transactionCount++;const f=e.D?3:1;let g=0,h;for(;!h;){g++;const l=Math.round(Q());try{const p=this.h.transaction(b,e.mode);var k=d;const n=new Vd(p),t=yield Wd(n,k),m=Math.round(Q());Xd(this,l,m,g,void 0,b.join(),e);return t}catch(p){k=Math.round(Q());const n=Kd(p,this.h.name,b.join(),this.h.version);if(n instanceof U&&!n.h||g>=f)Xd(this,
l,k,g,n,b.join(),e),h=n}}return Promise.reject(h)})}
function Yd(a,b,c){a=a.h.createObjectStore(b,c);return new Zd(a)}
function Xd(a,b,c,d,e,f,g){b=c-b;e?(e instanceof U&&("QUOTA_EXCEEDED"===e.type||"QUOTA_MAYBE_EXCEEDED"===e.type)&&Ad("QUOTA_EXCEEDED",{dbName:Dd(a.h.name),objectStoreNames:f,transactionCount:a.transactionCount,transactionMode:g.mode}),e instanceof U&&"UNKNOWN_ABORT"===e.type&&(c-=a.j,0>c&&c>=Math.pow(2,31)&&(c=0),Ad("TRANSACTION_UNEXPECTEDLY_ABORTED",{objectStoreNames:f,transactionDuration:b,transactionCount:a.transactionCount,dbDuration:c}),a.i=!0),$d(a,!1,d,f,b,g.tag),zd(e)):$d(a,!0,d,f,b,g.tag)}
function $d(a,b,c,d,e,f="IDB_TRANSACTION_TAG_UNKNOWN"){Ad("TRANSACTION_ENDED",{objectStoreNames:d,connectionHasUnknownAbortedTransaction:a.i,duration:e,isSuccessful:b,tryCount:c,tag:f})}
var ae=class{constructor(a,b){this.h=a;this.options=b;this.transactionCount=0;this.j=Math.round(Q());this.i=!1}add(a,b,c){return X(this,[a],{mode:"readwrite",D:!0},d=>d.objectStore(a).add(b,c))}clear(a){return X(this,[a],{mode:"readwrite",
D:!0},b=>b.objectStore(a).clear())}close(){var a;
this.h.close();(null===(a=this.options)||void 0===a?0:a.closed)&&this.options.closed()}count(a,b){return X(this,[a],{mode:"readonly",D:!0},c=>c.objectStore(a).count(b))}delete(a,b){return X(this,[a],{mode:"readwrite",
D:!0},c=>c.objectStore(a).delete(b))}get(a,b){return X(this,[a],{mode:"readonly",
D:!0},c=>c.objectStore(a).get(b))}put(a,b,c){return X(this,[a],{mode:"readwrite",
D:!0},d=>d.objectStore(a).put(b,c))}objectStoreNames(){return Array.from(this.h.objectStoreNames)}getName(){return this.h.name}};
function be(a,b,c){a=a.h.openCursor(b.query,b.direction);return ce(a).then(d=>Ud(d,c))}
function de(a,b){return be(a,{query:b},c=>c.delete().then(()=>c.continue())).then(()=>{})}
var Zd=class{constructor(a){this.h=a}add(a,b){return W(this.h.add(a,b))}autoIncrement(){return this.h.autoIncrement}clear(){return W(this.h.clear()).then(()=>{})}count(a){return W(this.h.count(a))}delete(a){return a instanceof IDBKeyRange?de(this,a):W(this.h.delete(a))}get(a){return W(this.h.get(a))}index(a){try{return new ee(this.h.index(a))}catch(b){if(b instanceof Error&&"NotFoundError"===b.name)throw new Id(a,this.h.name);
throw b;}}getName(){return this.h.name}keyPath(){return this.h.keyPath}put(a,b){return W(this.h.put(a,b))}};function Wd(a,b){const c=new Promise((d,e)=>{try{b(a).then(f=>{d(f)}).catch(e)}catch(f){e(f),a.abort()}});
return Promise.all([c,a.done]).then(([d])=>d)}
var Vd=class{constructor(a){this.h=a;this.j=new Map;this.i=!1;this.done=new Promise((b,c)=>{this.h.addEventListener("complete",()=>{b()});
this.h.addEventListener("error",d=>{d.currentTarget===d.target&&c(this.h.error)});
this.h.addEventListener("abort",()=>{var d=this.h.error;if(d)c(d);else if(!this.i){d=U;var e=this.h.objectStoreNames;const f=[];for(let g=0;g<e.length;g++){const h=e.item(g);if(null===h)throw Error("Invariant: item in DOMStringList is null");f.push(h)}d=new d("UNKNOWN_ABORT",{objectStoreNames:f.join(),dbName:this.h.db.name,mode:this.h.mode});c(d)}})})}abort(){this.h.abort();
this.i=!0;throw new U("EXPLICIT_ABORT");}objectStore(a){a=this.h.objectStore(a);let b=this.j.get(a);b||(b=new Zd(a),this.j.set(a,b));return b}};function fe(a,b,c){const {query:d=null,direction:e="next"}=b;a=a.h.openCursor(d,e);return ce(a).then(f=>Ud(f,c))}
var ee=class{constructor(a){this.h=a}count(a){return W(this.h.count(a))}delete(a){return fe(this,{query:a},b=>b.delete().then(()=>b.continue()))}get(a){return W(this.h.get(a))}getKey(a){return W(this.h.getKey(a))}keyPath(){return this.h.keyPath}unique(){return this.h.unique}};
function ce(a){return W(a).then(b=>b?new ge(a,b):null)}
var ge=class{constructor(a,b){this.request=a;this.cursor=b}advance(a){this.cursor.advance(a);return ce(this.request)}continue(a){this.cursor.continue(a);return ce(this.request)}delete(){return W(this.cursor.delete()).then(()=>{})}getKey(){return this.cursor.key}update(a){return W(this.cursor.update(a))}};function he(a,b,c){return new Promise((d,e)=>{let f;f=void 0!==b?self.indexedDB.open(a,b):self.indexedDB.open(a);const g=c.blocked,h=c.blocking,k=c.ta,l=c.upgrade,p=c.closed;let n;const t=()=>{n||(n=new ae(f.result,{closed:p}));return n};
f.addEventListener("upgradeneeded",m=>{try{if(null===m.newVersion)throw Error("Invariant: newVersion on IDbVersionChangeEvent is null");if(null===f.transaction)throw Error("Invariant: transaction on IDbOpenDbRequest is null");m.dataLoss&&"none"!==m.dataLoss&&Ad("IDB_DATA_CORRUPTED",{reason:m.dataLossMessage||"unknown reason",dbName:Dd(a)});const w=t(),x=new Vd(f.transaction);l&&l(w,z=>m.oldVersion<z&&m.newVersion>=z,x);
x.done.catch(z=>{e(z)})}catch(w){e(w)}});
f.addEventListener("success",()=>{const m=f.result;h&&m.addEventListener("versionchange",()=>{h(t())});
m.addEventListener("close",()=>{Ad("IDB_UNEXPECTEDLY_CLOSED",{dbName:Dd(a),dbVersion:m.version});k&&k()});
d(t())});
f.addEventListener("error",()=>{e(f.error)});
g&&f.addEventListener("blocked",()=>{g()})})}
function ie(a,b,c={}){return he(a,b,c)}
function je(a,b={}){return D(this,function*(){const c=self.indexedDB.deleteDatabase(a),d=b.blocked;d&&c.addEventListener("blocked",()=>{d()});
yield Td(c)})}
;function ke(a,b){return new U("INCOMPATIBLE_DB_VERSION",{dbName:a.name,oldVersion:a.options.version,newVersion:b})}
var le=class{constructor(a,b){this.name=a;this.options=b;this.l=!0;this.j=!1}i(a,b,c={}){return ie(a,b,c)}delete(a={}){return je(this.name,a)}open(){if(!this.l)throw ke(this);if(this.h)return this.h;let a;const b=()=>{this.h===a&&(this.h=void 0)},c={blocking:e=>{e.close()},
closed:b,ta:b,upgrade:this.options.upgrade},d=()=>D(this,function*(){var e,f,g=null!==(e=Error().stack)&&void 0!==e?e:"";try{var h=yield this.i(this.name,this.options.version,c);a:{var k=h,l=this.options;for(const n of Object.keys(l.O)){const {L:t,Ea:m=Number.MAX_VALUE}=l.O[n];if(k.h.version>=t&&!(k.h.version>=m)&&!k.h.objectStoreNames.contains(n)){var p=n;break a}}p=void 0}if(void 0!==p){if(!this.j)return this.j=!0,yield this.delete(),zd(new U("DB_DELETED_BY_MISSING_OBJECT_STORE",{dbName:this.name,
qa:p})),d();throw new Hd(p);}return h}catch(n){if(n instanceof DOMException?"VersionError"===n.name:"DOMError"in self&&n instanceof DOMError?"VersionError"===n.name:n instanceof Object&&"message"in n&&"An attempt was made to open a database using a lower version than the existing version."===n.message){g=yield this.i(this.name,void 0,Object.assign(Object.assign({},c),{upgrade:void 0}));h=g.h.version;if(void 0!==this.options.version&&h>this.options.version+1)throw g.close(),this.l=!1,ke(this,h);return g}b();
n instanceof Error&&!O("ytidb_async_stack_killswitch")&&(n.stack=`${n.stack}\n${g.substring(g.indexOf("\n")+1)}`);throw Kd(n,this.name,"",null!==(f=this.options.version)&&void 0!==f?f:-1);}});
return this.h=a=d()}};const me=new le("YtIdbMeta",{O:{databases:{L:1}},upgrade(a,b){b(1)&&Yd(a,"databases",{keyPath:"actualName"})}});function ne(a){return D(this,function*(){return X(yield me.open(),["databases"],{D:!0,mode:"readwrite"},b=>{const c=b.objectStore("databases");return c.get(a.actualName).then(d=>{if(d?a.actualName!==d.actualName||a.publicName!==d.publicName||a.userIdentifier!==d.userIdentifier:1)return c.put(a).then(()=>{})})})})}
function oe(a){return D(this,function*(){if(a)return(yield me.open()).delete("databases",a)})}
;let pe;const qe=new class{constructor(){}}(new class{constructor(){}});function re(){return D(this,function*(){return new xd})}
function se(){if(void 0!==pe)return pe;yd=!0;return pe=re().then(a=>{yd=!1;return a.isSupported()})}
function te(){return se().then(a=>a?qe:void 0)}
;new Rb;function ue(a){try{Bd();var b=!0}catch(c){b=!1}if(!b)throw a=new U("AUTH_INVALID",{dbName:a}),zd(a),a;b=Bd();return{actualName:`${a}:${b}`,publicName:a,userIdentifier:b}}
function ve(a,b,c,d){var e;return D(this,function*(){var f=null!==(e=Error().stack)&&void 0!==e?e:"";if(!(yield te())){var g=new U("IDB_NOT_SUPPORTED",{context:{caller:"openDbImpl",publicName:a,version:b}});O("ytidb_async_stack_killswitch")||(g.stack=`${g.stack}\n${f.substring(f.indexOf("\n")+1)}`);zd(g);throw g;}Cd(a);f=c?{actualName:a,publicName:a,userIdentifier:void 0}:ue(a);try{return yield ne(f),yield ie(f.actualName,b,d)}catch(h){try{yield oe(f.actualName)}catch(k){}throw h;}})}
function we(a,b,c={}){return ve(a,b,!1,c)}
function xe(a,b,c={}){return ve(a,b,!0,c)}
function ye(a,b={}){return D(this,function*(){if(yield te()){Cd(a);var c=ue(a);yield je(c.actualName,b);yield oe(c.actualName)}})}
function ze(a,b={}){return D(this,function*(){if(yield te())Cd(a),yield je(a,b),yield oe(a)})}
;const Ae=r("ytPubsub2Pubsub2Instance")||new H;H.prototype.subscribe=H.prototype.subscribe;H.prototype.unsubscribeByKey=H.prototype.J;H.prototype.publish=H.prototype.H;H.prototype.clear=H.prototype.clear;u("ytPubsub2Pubsub2Instance",Ae);u("ytPubsub2Pubsub2SubscribedKeys",r("ytPubsub2Pubsub2SubscribedKeys")||{});u("ytPubsub2Pubsub2TopicToKeys",r("ytPubsub2Pubsub2TopicToKeys")||{});u("ytPubsub2Pubsub2IsAsync",r("ytPubsub2Pubsub2IsAsync")||{});u("ytPubsub2Pubsub2SkipSubKey",null);function Be(a,b){let c;return()=>{c||(c=new Ce(a,b));return c}}
var Ce=class extends le{constructor(a,b){super(a,b);this.options=b;Cd(a)}i(a,b,c={}){return(this.options.W?xe:we)(a,b,Object.assign({},c))}delete(a={}){return(this.options.W?ze:ye)(this.name,a)}};const De=["client.name","client.version"];function Ee(a){if(!a.errorMetadata||!a.errorMetadata.kvPairs)return a;a.errorMetadata.kvPairs=a.errorMetadata.kvPairs.filter(b=>b.key?De.includes(b.key):!1);
return a}
;var Fe;Fe=Be("ServiceWorkerLogsDatabase",{O:{["SWHealthLog"]:{L:1}},W:!0,upgrade:(a,b)=>{b(1)&&Yd(a,"SWHealthLog",{keyPath:"id",autoIncrement:!0}).h.createIndex("swHealthNewRequest",["interface","timestamp"],{unique:!1})},
version:1});function Ge(a){return D(this,function*(){var b=yield Fe().open(),c=b.put,d=M("INNERTUBE_CONTEXT_CLIENT_NAME",0);const e=Object.assign({},a);e.clientError&&(e.clientError=Ee(e.clientError));e.interface=d;return c.call(b,"SWHealthLog",e)})}
;const He=q.ytNetworklessLoggingInitializationOptions||{isNwlInitialized:!1,databaseToken:void 0,potentialEsfErrorCounter:0,isIdbSupported:!1};u("ytNetworklessLoggingInitializationOptions",He);function od(a,b,c){!M("VISITOR_DATA")&&.01>Math.random()&&Hc(new nc("Missing VISITOR_DATA when sending innertube request.","log_event",b,c));if(!a.isReady())throw a=new nc("innertube xhrclient not ready","log_event",b,c),Gc(a),a;const d={headers:{"Content-Type":"application/json"},method:"POST",postParams:b,postBodyFormat:"JSON",onTimeout:()=>{c.onTimeout()},
onFetchTimeout:c.onTimeout,onSuccess:(p,n)=>{if(c.onSuccess)c.onSuccess(n)},
onFetchSuccess:p=>{if(c.onSuccess)c.onSuccess(p)},
onError:(p,n)=>{if(c.onError)c.onError(n)},
onFetchError:p=>{if(c.onError)c.onError(p)},
timeout:c.timeout,withCredentials:!0};b="";var e=a.config_.ma;e&&(b=e);e=wd(a.config_.oa||!1,b,c);Object.assign(d.headers,e);(e=d.headers.Authorization)&&!b&&(d.headers["x-origin"]=window.location.origin);const f=`/${"youtubei"}/${a.config_.innertubeApiVersion}/${"log_event"}`;let g={alt:"json"},h=a.config_.na&&e;O("omit_innertube_api_key_for_Bearer_auth_header")&&(h=h&&e.startsWith("Bearer"));h||(g.key=a.config_.innertubeApiKey);const k=Rc(`${b}${f}`,g||{},!0),l=()=>{try{Uc(k,d)}catch(p){if("InvalidAccessError"==
p.name)Hc(Error("An extension is blocking network request."));else throw p;}};
O("use_new_nwl")||r("ytNetworklessLoggingInitializationOptions")&&He.isNwlInitialized?se().then(p=>{l(p)}):l(!1)}
class Ie{constructor(a){this.config_=null;a?this.config_=a:vd()&&(this.config_=ld())}isReady(){!this.config_&&vd()&&(this.config_=ld());return!!this.config_}};let Je=Ie;function Ke(a,b,c={}){let d=Je;M("ytLoggingEventsDefaultDisabled",!1)&&Je==Ie&&(d=null);qd(a,b,d,c)}
;const Le=[{V:a=>`Cannot read property '${a.key}'`,
S:{Error:[{s:/(Permission denied) to access property "([^']+)"/,groups:["reason","key"]}],TypeError:[{s:/Cannot read property '([^']+)' of (null|undefined)/,groups:["key","value"]},{s:/\u65e0\u6cd5\u83b7\u53d6\u672a\u5b9a\u4e49\u6216 (null|undefined) \u5f15\u7528\u7684\u5c5e\u6027\u201c([^\u201d]+)\u201d/,groups:["value","key"]},{s:/\uc815\uc758\ub418\uc9c0 \uc54a\uc74c \ub610\ub294 (null|undefined) \ucc38\uc870\uc778 '([^']+)' \uc18d\uc131\uc744 \uac00\uc838\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4./,
groups:["value","key"]},{s:/No se puede obtener la propiedad '([^']+)' de referencia nula o sin definir/,groups:["key"]},{s:/Unable to get property '([^']+)' of (undefined or null) reference/,groups:["key","value"]},{s:/(null) is not an object \(evaluating '(?:([^.]+)\.)?([^']+)'\)/,groups:["value","base","key"]}]}},{V:a=>`Cannot call '${a.key}'`,
S:{TypeError:[{s:/(?:([^ ]+)?\.)?([^ ]+) is not a function/,groups:["base","key"]},{s:/([^ ]+) called on (null or undefined)/,groups:["key","value"]},{s:/Object (.*) has no method '([^ ]+)'/,groups:["base","key"]},{s:/Object doesn't support property or method '([^ ]+)'/,groups:["key"]},{s:/\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u306f '([^']+)' \u30d7\u30ed\u30d1\u30c6\u30a3\u307e\u305f\u306f\u30e1\u30bd\u30c3\u30c9\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093/,groups:["key"]},{s:/\uac1c\uccb4\uac00 '([^']+)' \uc18d\uc131\uc774\ub098 \uba54\uc11c\ub4dc\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4./,
groups:["key"]}]}},{V:a=>`${a.key} is not defined`,
S:{ReferenceError:[{s:/(.*) is not defined/,groups:["key"]},{s:/Can't find variable: (.*)/,groups:["key"]}]}}];var Ne={C:[],A:[{fa:Me,weight:500}]};function Me(a){if("JavaException"===a.name)return!0;a=a.stack;return a.includes("chrome://")||a.includes("chrome-extension://")||a.includes("moz-extension://")}
;function Oe(){if(!Pe){var a=Pe=new Qe;a.C.length=0;a.A.length=0;Re(a,Ne)}return Pe}
function Re(a,b){b.C&&a.C.push.apply(a.C,b.C);b.A&&a.A.push.apply(a.A,b.A)}
var Qe=class{constructor(){this.A=[];this.C=[]}},Pe;const Se=new H;function Te(a){const b=a.length;let c=0;const d=()=>a.charCodeAt(c++);
do{var e=Ue(d);if(Infinity===e)break;const f=e>>3;switch(e&7){case 0:e=Ue(d);if(2===f)return e;break;case 1:if(2===f)return;c+=8;break;case 2:e=Ue(d);if(2===f)return a.substr(c,e);c+=e;break;case 5:if(2===f)return;c+=4;break;default:return}}while(c<b)}
function Ue(a){let b=a(),c=b&127;if(128>b)return c;b=a();c|=(b&127)<<7;if(128>b)return c;b=a();c|=(b&127)<<14;if(128>b)return c;b=a();return 128>b?c|(b&127)<<21:Infinity}
;function Ve(a,b,c,d){if(a)if(Array.isArray(a)){var e=d;for(d=0;d<a.length&&!(a[d]&&(e+=We(d,a[d],b,c),500<e));d++);d=e}else if("object"===typeof a)for(e in a){if(a[e]){var f=e;var g=a[e],h=b,k=c;f="string"!==typeof g||"clickTrackingParams"!==f&&"trackingParams"!==f?0:(g=Te(atob(g.replace(/-/g,"+").replace(/_/g,"/"))))?We(`${f}.ve`,g,h,k):0;d+=f;d+=We(e,a[e],b,c);if(500<d)break}}else c[b]=Xe(a),d+=c[b].length;else c[b]=Xe(a),d+=c[b].length;return d}
function We(a,b,c,d){c+=`.${a}`;a=Xe(b);d[c]=a;return c.length+a.length}
function Xe(a){return("string"===typeof a?a:String(JSON.stringify(a))).substr(0,500)}
;var Ye=new Set,Ze=0,$e=0,af=0,bf=[];const cf=["PhantomJS","Googlebot","TO STOP THIS SECURITY SCAN go/scan"];function df(a){ef(a)}
function ef(a,b="ERROR"){var c={};c.name=M("INNERTUBE_CONTEXT_CLIENT_NAME",1);c.version=M("INNERTUBE_CONTEXT_CLIENT_VERSION",void 0);ff(a,c||{},b)}
function ff(a,b,c="ERROR"){if(a){a.hasOwnProperty("level")&&a.level&&(c=a.level);if(O("console_log_js_exceptions")){var d=[];d.push(`Name: ${a.name}`);d.push(`Message: ${a.message}`);a.hasOwnProperty("params")&&d.push(`Error Params: ${JSON.stringify(a.params)}`);a.hasOwnProperty("args")&&d.push(`Error args: ${JSON.stringify(a.args)}`);d.push(`File name: ${a.fileName}`);d.push(`Stacktrace: ${a.stack}`);window.console.log(d.join("\n"),a)}if(!(5<=Ze)){var e=Mb(a);d=e.message||"Unknown Error";const w=
e.name||"UnknownError";var f=e.stack||a.i||"Not available";if(f.startsWith(`${w}: ${d}`)){var g=f.split("\n");g.shift();f=g.join("\n")}g=e.lineNumber||"Not available";e=e.fileName||"Not available";let x=0;if(a.hasOwnProperty("args")&&a.args&&a.args.length)for(var h=0;h<a.args.length&&!(x=Ve(a.args[h],`params.${h}`,b,x),500<=x);h++);else if(a.hasOwnProperty("params")&&a.params){const z=a.params;if("object"===typeof a.params)for(h in z){if(!z[h])continue;const ca=`params.${h}`,N=Xe(z[h]);b[ca]=N;x+=
ca.length+N.length;if(500<x)break}else b.params=Xe(z)}if(bf.length)for(h=0;h<bf.length&&!(x=Ve(bf[h],`params.context.${h}`,b,x),500<=x);h++);navigator.vendor&&!b.hasOwnProperty("vendor")&&(b["device.vendor"]=navigator.vendor);b={message:d,name:w,lineNumber:g,fileName:e,stack:f,params:b,sampleWeight:1};d=Number(a.columnNumber);isNaN(d)||(b.lineNumber=`${b.lineNumber}:${d}`);if("IGNORED"===a.level)var k=0;else a:{a=Oe();d=b;for(k of a.C)if(d.message&&d.message.match(k.pa)){k=k.weight;break a}for(var l of a.A)if(l.fa(d)){k=
l.weight;break a}k=1}b.sampleWeight=k;k=b;for(var p of Le)if(p.S[k.name]){l=p.S[k.name];for(var n of l)if(l=k.message.match(n.s)){k.params["params.error.original"]=l[0];a=n.groups;b={};for(d=0;d<a.length;d++)b[a[d]]=l[d+1],k.params[`params.error.${a[d]}`]=l[d+1];k.message=p.V(b);break}}k.params||(k.params={});p=Oe();k.params["params.errorServiceSignature"]=`msg=${p.C.length}&cb=${p.A.length}`;k.params["params.serviceWorker"]="true";q.document&&q.document.querySelectorAll&&(k.params["params.fscripts"]=
String(document.querySelectorAll("script:not([nonce])").length));v("sample").constructor!==oa&&(k.params["params.fconst"]="true");window.yterr&&"function"===typeof window.yterr&&window.yterr(k);if(0!==k.sampleWeight&&!Ye.has(k.message)){"ERROR"===c?(Se.H("handleError",k),O("record_app_crashed_web")&&0===af&&1===k.sampleWeight&&(af++,Ke("appCrashed",{appCrashType:"APP_CRASH_TYPE_BREAKPAD"})),$e++):"WARNING"===c&&Se.H("handleWarning",k);b:{for(t of cf)if((p=sa)&&0<=p.toLowerCase().indexOf(t.toLowerCase())){var t=
!0;break b}t=!1}if(t)var m=void 0;else{p={stackTrace:k.stack};k.fileName&&(p.filename=k.fileName);t=k.lineNumber&&k.lineNumber.split?k.lineNumber.split(":"):[];0!==t.length&&(1!==t.length||isNaN(Number(t[0]))?2!==t.length||isNaN(Number(t[0]))||isNaN(Number(t[1]))||(p.lineNumber=Number(t[0]),p.columnNumber=Number(t[1])):p.lineNumber=Number(t[0]));t={level:"ERROR_LEVEL_UNKNOWN",message:k.message,errorClassName:k.name,sampleWeight:k.sampleWeight};"ERROR"===c?t.level="ERROR_LEVEL_ERROR":"WARNING"===c&&
(t.level="ERROR_LEVEL_WARNNING");p={isObfuscated:!0,browserStackInfo:p};n={pageUrl:window.location.href,kvPairs:[]};M("FEXP_EXPERIMENTS")&&(n.experimentIds=M("FEXP_EXPERIMENTS"));if(l=k.params)for(m of Object.keys(l))n.kvPairs.push({key:`client.${m}`,value:String(l[m])});m=M("SERVER_NAME",void 0);l=M("SERVER_VERSION",void 0);m&&l&&(n.kvPairs.push({key:"server.name",value:m}),n.kvPairs.push({key:"server.version",value:l}));m={errorMetadata:n,stackTrace:p,logMessage:t}}m&&(Ke("clientError",m),("ERROR"===
c||O("errors_flush_gel_always_killswitch"))&&gd());try{Ye.add(k.message)}catch(z){}Ze++}}}}
;function gf(a){return D(a,function*(){var b=yield q.fetch(this.i);if(200!==b.status)return Promise.reject("Server error when retrieving AmbientData");b=yield b.text();if(!b.startsWith(")]}'\n"))return Promise.reject("Incorrect JSPB formatting");a:{b=JSON.parse(b.substring(5));for(let c=0;c<b.length;c++)if(b[c][0]===(new wc).constructor.ba){b=new wc(b[c]);break a}b=null}return b?b:Promise.reject("AmbientData missing from response")})}
function hf(a=!1){return D(jf.h,function*(){if(a||!this.h)this.h=gf(this).then(this.j).catch(b=>{delete this.h;ef(b)});
return this.h})}
var jf=class{constructor(a){this.i=a}j(a){const b=mb(a,vc,2);if(b){const c=C(b,5);c&&(q.__SAPISID=c);null!=C(b,7)&&L("VISITOR_DATA",C(b,7));null!=C(b,4)&&L("SESSION_INDEX",String(C(b,4)));null!=C(b,8)&&L("DELEGATED_SESSION_ID",C(b,8))}return a}};function kf(a){const b={};var c=Ab();c&&(b.Authorization=c,c=a=null===a||void 0===a?void 0:a.sessionIndex,void 0===c&&(c=Number(M("SESSION_INDEX",0)),c=isNaN(c)?0:c),b["X-Goog-AuthUser"]=c,"INNERTUBE_HOST_OVERRIDE"in K||(b["X-Origin"]=window.location.origin),void 0===a&&"DELEGATED_SESSION_ID"in K&&(b["X-Goog-PageId"]=M("DELEGATED_SESSION_ID")));return b}
var lf=class{constructor(){this.sa=!0}};var mf={identityType:"UNAUTHENTICATED_IDENTITY_TYPE_UNKNOWN"};let nf=Date.now().toString();let of=q.ytLoggingDocDocumentNonce_;
if(!of){var pf;a:{if(window.crypto&&window.crypto.getRandomValues)try{const d=Array(16),e=new Uint8Array(16);window.crypto.getRandomValues(e);for(let f=0;f<d.length;f++)d[f]=e[f];pf=d;break a}catch(d){}const c=Array(16);for(let d=0;16>d;d++){const e=Date.now();for(let f=0;f<e%23;f++)c[d]=Math.random();c[d]=Math.floor(256*Math.random())}if(nf){let d=1;for(let e=0;e<nf.length;e++)c[d%16]=c[d%16]^c[(d-1)%16]/4^nf.charCodeAt(e),d++}pf=c}const a=pf,b=[];for(let c=0;c<a.length;c++)b.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(a[c]&
63));of=b.join("")};function qf(a,b){b.encryptedTokenJarContents&&(a.h[b.encryptedTokenJarContents]=b,"string"===typeof b.expirationSeconds&&setTimeout(()=>{delete a.h[b.encryptedTokenJarContents]},1E3*Number(b.expirationSeconds)))}
var rf=class{constructor(){this.h={}}handleResponse(a,b){var c,d,e;b=(null===(d=null===(c=b.G.context)||void 0===c?void 0:c.request)||void 0===d?void 0:d.consistencyTokenJars)||[];if(a=null===(e=a.responseContext)||void 0===e?void 0:e.consistencyTokenJar){for(const f of b)delete this.h[f.encryptedTokenJarContents];qf(this,a)}}};function sf(){var a=M("INNERTUBE_CONTEXT");if(!a)return ef(Error("Error: No InnerTubeContext shell provided in ytconfig.")),{};a=la(a);O("web_no_tracking_params_in_shell_killswitch")||delete a.clickTracking;a.client||(a.client={});var b=a.client;b.utcOffsetMinutes=-Math.floor((new Date).getTimezoneOffset());var c=M("EXPERIMENTS_TOKEN","");c?b.experimentsToken=c:delete b.experimentsToken;rf.h||(rf.h=new rf);b=rf.h.h;c=[];let d=0;for(const e in b)c[d++]=b[e];a.request=Object.assign(Object.assign({},
a.request),{consistencyTokenJars:c});a.user=Object.assign({},a.user);return a}
;function tf(a){var b=a;if(a=M("INNERTUBE_HOST_OVERRIDE")){a=String(a);var c=String,d=b.match(A);b=d[5];var e=d[6];d=d[7];var f="";b&&(f+=b);e&&(f+="?"+e);d&&(f+="#"+d);b=a+c(f)}return b}
;var uf=class{};const vf={["GET_DATASYNC_IDS"]:class extends uf{}};function wf(a){var b={za:{}};lf.h||(lf.h=new lf);var c=lf.h;if(void 0!==xf.h){const d=xf.h;a=[b!==d.l,a!==d.j,c!==d.i,!1,!1,void 0!==d.h];if(a.some(e=>e))throw new nc("InnerTubeTransportService is already initialized",a);
}else xf.h=new xf(b,a,c)}
function yf(a,b,c){return D(a,function*(){var d;if(this.i.sa){const e=null===(d=null===b||void 0===b?void 0:b.Y)||void 0===d?void 0:d.sessionIndex;d=kf({sessionIndex:e});d=Object.assign(Object.assign({},zf(c)),d)}else d=Af(this,b,c);return d})}
function Bf(a,b,c){var d,e;return D(a,function*(){for(var f of[])f.Da(b.G.context);if(null===(d=this.h)||void 0===d?0:d.l(b.input,b.G))return this.h.j(b.input,b.G);f=JSON.stringify(b.G);b.T=Object.assign(Object.assign({},b.T),{headers:c});let g=Object.assign({},b.T);"POST"===b.T.method&&(g=Object.assign(Object.assign({},g),{body:f}));f=yield this.j.fetch(b.input,g,b.config);!f&&(null===(e=this.h)||void 0===e?0:e.h(b.input,b.G))&&(f=yield this.h.i(b.input,b.G));return f})}
function Cf(a,b,c){var d={Y:{identity:mf}};b.context||(b.context=sf());return new F(e=>D(a,function*(){var f=tf(c);f=Sc(f)?"same-origin":"cors";f=yield yf(this,d,f);var g=tf(c);M("INNERTUBE_OMIT_API_KEY_WHEN_AUTH_HEADER_IS_PRESENT")&&(null===f||void 0===f?0:f.Authorization)||(g=Rc(g,{key:M("INNERTUBE_API_KEY")},!1));var h={method:"POST",mode:Sc(g)?"same-origin":"cors",credentials:Sc(g)?"same-origin":"include"};e(Bf(this,{input:g,T:h,G:b,config:d},f))}))}
function Af(a,b,c){var d;return D(a,function*(){var e={sessionIndex:null===(d=null===b||void 0===b?void 0:b.Y)||void 0===d?void 0:d.sessionIndex};e=yield Vb(kf(e));return Promise.resolve(Object.assign(Object.assign({},zf(c)),e))})}
function zf(a){const b={"Content-Type":"application/json"},c=M("VISITOR_DATA");c&&(b["X-Goog-Visitor-Id"]=c);"cors"!==a&&((a=M("INNERTUBE_CONTEXT_CLIENT_NAME"))&&(b["X-Youtube-Client-Name"]=a),(a=M("INNERTUBE_CONTEXT_CLIENT_VERSION"))&&(b["X-Youtube-Client-Version"]=a),(a=M("CHROME_CONNECTED_HEADER"))&&(b["X-Youtube-Chrome-Connected"]=a),O("forward_domain_admin_state_on_embeds")&&(a=M("DOMAIN_ADMIN_STATE"))&&(b["X-Youtube-Domain-Admin-State"]=a));return b}
var xf=class{constructor(a,b,c){this.l=a;this.j=b;this.i=c;this.h=void 0;a.X||(a.X={});a.X=Object.assign(Object.assign({},vf),a.X)}};let Df;function Ef(){Df||(wf({fetch:(a,b)=>Vb(fetch(new Request(a,b)))}),Df=xf.h);
return Df}
;function Y(a){return D(this,function*(){yield Ff();ef(a,"WARNING")})}
function Gf(a){D(this,function*(){var b=yield te();O("nwl_sw_health_payloads")&&b?yield Ge(a):(yield hf(),b={timestamp:a.timestamp},b=a.appShellAssetLoadReport?{payloadName:"appShellAssetLoadReport",payload:a.appShellAssetLoadReport,options:b}:a.clientError?{payloadName:"clientError",payload:a.clientError,options:b}:void 0,b&&Ke(b.payloadName,b.payload))})}
function Ff(){return D(this,function*(){try{yield hf()}catch(a){}})}
;const Hf={granted:"GRANTED",denied:"DENIED",unknown:"UNKNOWN"};function If(a){var b=a.data;a=b.type;b=b.data;"notifications_register"===a?(I("IDToken",b),Jf()):"notifications_check_registration"===a&&Kf(b)}
function Lf(){return self.clients.matchAll({type:"window",includeUncontrolled:!0}).then(a=>{if(a)for(const b of a)b.postMessage({type:"update_unseen_notifications_count_signal"})})}
function Mf(a){const b=[];a.forEach(c=>{b.push({key:c.key,value:c.value})});
return b}
function Nf(a){return D(this,function*(){const b=Mf(a.payload.chrome.extraUrlParams),c={recipientId:a.recipientId,endpoint:a.payload.chrome.endpoint,extraUrlParams:b},d=uc(ic);return Of().then(e=>Cf(e,c,d).then(f=>{f.json().then(g=>{if(!g||!g.endpointUrl)return Promise.resolve();a.payload.chrome.postedEndpoint&&Pf(a.payload.chrome.postedEndpoint);return Qf(a,g.endpointUrl)})}))})}
function Qf(a,b){a.deviceId&&I("DeviceId",a.deviceId);a.timestampSec&&I("TimestampLowerBound",a.timestampSec);const c=a.payload.chrome;return self.registration.showNotification(c.title,{body:c.body,icon:c.iconUrl,data:{nav:b,id:c.notificationId,attributionTag:c.attributionTag,clickEndpoint:c.clickEndpoint},tag:c.notificationTag||c.title+c.body+c.iconUrl,requireInteraction:!0}).then(()=>{Rf(a.displayCap)}).catch(()=>{})}
function Pf(a){if(!a.recordNotificationInteractionsEndpoint)return Promise.reject();const b={serializedRecordNotificationInteractionsRequest:a.recordNotificationInteractionsEndpoint.serializedInteractionsRequest},c=uc(jc);return Of().then(d=>Cf(d,b,c))}
function Rf(a){-1!==a&&self.registration.getNotifications().then(b=>{for(let c=0;c<b.length-a;c++)b[c].close()})}
function Kf(a){const b=[Sf(a),J("RegistrationTimestamp").then(Tf),Uf(),Vf(),Wf()];Promise.all(b).catch(()=>{I("IDToken",a);Jf();return Promise.resolve()})}
function Tf(a){return 9E7>=Date.now()-(a||0)?Promise.resolve():Promise.reject()}
function Sf(a){return J("IDToken").then(b=>a===b?Promise.resolve():Promise.reject())}
function Uf(){return J("Permission").then(a=>Notification.permission===a?Promise.resolve():Promise.reject())}
function Vf(){return J("Endpoint").then(a=>Xf().then(b=>a===b?Promise.resolve():Promise.reject()))}
function Wf(){return J("application_server_key").then(a=>Yf().then(b=>a===b?Promise.resolve():Promise.reject()))}
function Zf(){var a=Notification.permission;if(Hf[a])return Hf[a]}
function Jf(){I("RegistrationTimestamp",0);Promise.all([Xf(),$f(),ag(),Yf()]).then(([a,b,c,d])=>{b=b?lc(b):null;c=c?lc(c):null;d=d?Ea(new Uint8Array(d),4):null;bg(a,b,c,d)}).catch(()=>{bg()})}
function bg(a=null,b=null,c=null,d=null){qc().then(e=>{e&&(I("Endpoint",a),I("P256dhKey",b),I("AuthKey",c),I("application_server_key",d),I("Permission",Notification.permission),Promise.all([J("DeviceId"),J("NotificationsDisabled")]).then(([f,g])=>{if(null!==f&&void 0!==f)var h=f;else{f=[];var k;h=h||hc.length;for(k=0;256>k;k++)f[k]=hc[0|Math.random()*h];h=f.join("")}cg(h,null!==a&&void 0!==a?a:void 0,null!==b&&void 0!==b?b:void 0,null!==c&&void 0!==c?c:void 0,null!==d&&void 0!==d?d:void 0,null!==
g&&void 0!==g?g:void 0)}))})}
function cg(a,b,c,d,e,f){D(this,function*(){const g={notificationRegistration:{chromeRegistration:{deviceId:a,pushParams:{applicationServerKey:e,authKey:d,p256dhKey:c,browserEndpoint:b},notificationsDisabledInApp:f,permission:Zf()}}},h=uc(kc);return Of().then(k=>Cf(k,g,h).then(()=>{I("DeviceId",a);I("RegistrationTimestamp",Date.now());I("TimestampLowerBound",Date.now())},l=>{Y(l)}))})}
function Xf(){return self.registration.pushManager.getSubscription().then(a=>a?Promise.resolve(a.endpoint):Promise.resolve(null))}
function $f(){return self.registration.pushManager.getSubscription().then(a=>a&&a.getKey?Promise.resolve(a.getKey("p256dh")):Promise.resolve(null))}
function ag(){return self.registration.pushManager.getSubscription().then(a=>a&&a.getKey?Promise.resolve(a.getKey("auth")):Promise.resolve(null))}
function Yf(){return self.registration.pushManager.getSubscription().then(a=>a?Promise.resolve(a.options.applicationServerKey):Promise.resolve(null))}
function Of(){return D(this,function*(){try{return yield hf(!0),Ef()}catch(a){return yield Y(a),Promise.reject(a)}})}
;let dg=void 0;function eg(a){return D(this,function*(){dg||(dg=yield a.open("yt-appshell-assets"));return dg})}
function fg(a,b){return D(this,function*(){const c=yield eg(a),d=b.map(e=>gg(c,e));
return Promise.all(d)})}
function hg(a,b){return D(this,function*(){let c;try{c=yield a.match(b,{cacheName:"yt-appshell-assets"})}catch(d){}return c})}
function ig(a,b){return D(this,function*(){const c=yield eg(a),d=(yield c.keys()).filter(e=>!b.includes(e.url)).map(e=>c.delete(e));
return Promise.all(d)})}
function jg(a,b,c){return D(this,function*(){yield(yield eg(a)).put(b,c)})}
function kg(a,b){D(this,function*(){yield(yield eg(a)).delete(b)})}
function gg(a,b){return D(this,function*(){return(yield a.match(b))?Promise.resolve():a.add(b)})}
;var Z;Z=Be("yt-serviceworker-metadata",{O:{["auth"]:{L:1},["resource-manifest-assets"]:{L:2}},W:!0,upgrade(a,b){b(1)&&Yd(a,"resource-manifest-assets");b(2)&&Yd(a,"auth")},version:2});let lg=null;function mg(){return D(ng,function*(){const a=yield te();if(a)return ng.h||(ng.h=new ng(a)),ng.h})}
function og(a,b){return D(a,function*(){yield X(yield Z().open(),["resource-manifest-assets"],"readwrite",c=>{const d=c.objectStore("resource-manifest-assets"),e=Date.now();return d.put(b,e).then(()=>{lg=e;let f=!0;return be(d,{query:IDBKeyRange.bound(0,Date.now()),direction:"prev"},g=>f?(f=!1,g.advance(5)):d.delete(g.getKey()).then(()=>g.continue()))})})})}
function pg(a,b){return D(a,function*(){let c=!1,d=0;yield X(yield Z().open(),["resource-manifest-assets"],"readonly",e=>be(e.objectStore("resource-manifest-assets"),{query:IDBKeyRange.bound(0,Date.now()),direction:"prev"},f=>{if(f.cursor.value.includes(b))c=!0;else return d+=1,f.continue()}));
return c?d:-1})}
function qg(a){return D(a,function*(){lg||(yield X(yield Z().open(),["resource-manifest-assets"],"readonly",b=>be(b.objectStore("resource-manifest-assets"),{query:IDBKeyRange.bound(0,Date.now()),direction:"prev"},c=>{lg=c.getKey()})));
return lg})}
var ng=class{constructor(a){this.token=a}};function rg(){return D(sg,function*(){const a=yield te();if(a)return sg.h||(sg.h=new sg(a)),sg.h})}
function tg(a,b){return D(a,function*(){yield(yield Z().open()).put("auth",b,"shell_identifier_key")})}
function ug(a){return D(a,function*(){return(yield(yield Z().open()).get("auth","shell_identifier_key"))||""})}
function vg(a){return D(a,function*(){yield(yield Z().open()).clear("auth")})}
var sg=class{constructor(a){this.token=a}};function wg(){D(this,function*(){const a=yield rg();a&&(yield vg(a))})}
;function xg(a,b){for(;Qa(b);)switch(b.m){case 10:var c=b,d=Pa(c.h);c=c.h;var e=c.h;c.h+=d;var f=c.i,g=d;if(Aa)d=f,c=e,f=g,(e=za)||(e=za=new TextDecoder("utf-8",{fatal:!1})),d=e.decode(d.subarray(c,c+f));else{var h=c=d=void 0;let k;g=e+g;const l=[];let p=null;for(;e<g;)k=f[e++],128>k?l.push(k):224>k?e>=g?l.push(65533):(h=f[e++],194>k||128!==(h&192)?(e--,l.push(65533)):l.push((k&31)<<6|h&63)):240>k?e>=g-1?l.push(65533):(h=f[e++],128!==(h&192)||224===k&&160>h||237===k&&160<=h||128!==((c=f[e++])&192)?
(e--,l.push(65533)):l.push((k&15)<<12|(h&63)<<6|c&63)):244>=k?e>=g-2?l.push(65533):(h=f[e++],128!==(h&192)||0!==(k<<28)+(h-144)>>30||128!==((c=f[e++])&192)||128!==((d=f[e++])&192)?(e--,l.push(65533)):(h=(k&7)<<18|(h&63)<<12|(c&63)<<6|d&63,h-=65536,l.push((h>>10&1023)+55296,(h&1023)+56320))):l.push(65533),8192<=l.length&&(p=ya(p,l),l.length=0);d=ya(p,l)}kb(a,1,d);break;default:if(!qb(a,b))return a}return a}
var yg=class extends B{constructor(a){super(a)}};function zg(a){a:{var b=new Ag;for(a=new Sa(a);Qa(a);)switch(a.m){case 10:var c=b,d=a,e=new yg,f=xg;const h=d.h.j;var g=Pa(d.h);g=d.h.h+g;d.h.j=g;f(e,d);d.h.h=g;d.h.j=h;d=e;f=yg;e=nb(c,f,1);d=d?d:new f;c=jb(c,1);e.push(d);c.push(d.v(!1));break;default:if(!qb(b,a))break a}}return b}
var Ag=class extends B{constructor(){super(void 0,-1,Bg)}},Bg=[1];function Cg(a){return D(this,function*(){const b=a.headers.get("X-Resource-Manifest");return b?Promise.resolve(Dg(b)):Promise.reject(Error("No resource manifest header"))})}
function Dg(a){return nb(zg(decodeURIComponent(a)),yg,1).reduce((b,c)=>{(c=C(c,1))&&b.push(c);return b},[])}
;function Eg(a){return D(a,function*(){const b=yield hf();if(b&&null!=C(b,3)){var c=yield rg();c&&(c=yield ug(c),C(b,3)!==c&&(kg(this.h,this.i),wg()))}})}
function Fg(a){return D(a,function*(){let b,c;try{c=yield Gg(this,this.j),b=yield Cg(c),yield fg(this.h,b)}catch(d){return Promise.reject(d)}try{yield Hg(this),yield jg(this.h,this.i,c)}catch(d){return Promise.reject(d)}if(b)try{yield Ig(this,b,this.i)}catch(d){}return Promise.resolve()})}
function Jg(a){return D(a,function*(){yield Eg(this);return Fg(this)})}
function Gg(a,b){return D(a,function*(){try{return yield q.fetch(new Request(b))}catch(c){return Promise.reject(c)}})}
function Hg(a){return D(a,function*(){var b=yield hf();let c;b&&null!=C(b,3)&&(c=C(b,3));return c?(b=yield rg())?Promise.resolve(tg(b,c)):Promise.reject(Error("Could not get AuthMonitor instance")):Promise.reject(Error("Could not get datasync ID"))})}
function Ig(a,b,c){return D(a,function*(){const d=yield mg();if(d)try{yield og(d,b)}catch(e){yield Y(e)}b.push(c);try{yield ig(this.h,b)}catch(e){yield Y(e)}return Promise.resolve()})}
function Kg(a,b){return D(a,function*(){return hg(this.h,b)})}
function Lg(a){return D(a,function*(){return hg(this.h,this.i)})}
var Mg=class{constructor(){var a=self.location.origin+"/app_shell",b=self.location.origin+"/app_shell_home";this.h=self.caches;this.j=a;this.i=b}};function Ng(a,b){return D(a,function*(){const c=b.request,d=yield Kg(this.h,c.url);if(d)return Gf({appShellAssetLoadReport:{assetPath:c.url,cacheHit:!0},timestamp:Q()}),d;Og(c);return Pg(b)})}
function Qg(a,b){return D(a,function*(){const c=yield Rg(this,b);if(c.response&&(c.response.ok||"opaqueredirect"===c.response.type||429===c.response.status||303===c.response.status||300<=c.response.status&&400>c.response.status))return c.response;const d=yield Lg(this.h);if(d)return Sg(this),d;Tg(this);return c.response?c.response:Promise.reject(c.error)})}
function Ug(a,b){b=new URL(b);if(!a.i.includes(b.pathname))return!1;if(!b.search)return!0;for(const c of a.l)if(a=b.searchParams.get(c.key),void 0===c.value||a===c.value)if(b.searchParams.delete(c.key),!b.search)return!0;return!1}
function Vg(a,b){return D(a,function*(){const c=yield Lg(this.h);if(!c)return Tg(this),Pg(b);Sg(this);var d;a:{if(c.headers&&(d=c.headers.get("date"))&&(d=Date.parse(d),!isNaN(d))){d=Math.round(Q()-d);break a}d=-1}if(!(-1<d&&7<=d/864E5))return c;d=yield Rg(this,b);return d.response&&d.response.ok?d.response:c})}
function Pg(a){return Promise.resolve(a.preloadResponse).then(b=>b||q.fetch(a.request))}
function Og(a){const b={assetPath:a.url,cacheHit:!1};mg().then(c=>{if(c){var d=qg(c).then(e=>{e&&(b.currentAppBundleTimestampSec=String(Math.floor(e/1E3)))});
c=pg(c,a.url).then(e=>{b.appBundleVersionDiffCount=e});
Promise.all([d,c]).catch(e=>{Y(e)}).finally(()=>{Gf({appShellAssetLoadReport:b,
timestamp:Q()})})}else Gf({appShellAssetLoadReport:b,
timestamp:Q()})})}
function Sg(a){Gf({appShellAssetLoadReport:{assetPath:a.h.i,cacheHit:!0},timestamp:Q()})}
function Tg(a){Gf({appShellAssetLoadReport:{assetPath:a.h.i,cacheHit:!1},timestamp:Q()})}
function Rg(a,b){return D(a,function*(){try{return{response:yield Pg(b)}}catch(c){return{error:c}}})}
var ah=class{constructor(){var a=Wg,b=Xg,c=Yg,d=Zg;const e=[];e.push({key:"feature",value:"ytca"});for(var f of sb)e.push({key:f});f=$g();this.h=a;this.m=b;this.o=c;this.i=d;this.l=e;this.j=f}};var Zg=["/","/feed/downloads"];const bh=[/^\/$/,/^\/feed\/downloads$/],ch=[/^\/$/,/^\/feed\/\w*/,/^\/results$/,/^\/playlist$/,/^\/watch$/,/^\/channel\/\w*/];function $g(){return new RegExp((O("kevlar_sw_app_wide_fallback")?ch:bh).map(a=>a.source).join("|"))}
var Xg=/^https:\/\/[\w-]*\.?youtube\.com.*(\.css$|\.js$|\.ico$|\/ytmweb\/_\/js\/|\/ytmweb\/_\/ss\/)/,Yg=/^https:\/\/[\w-]*\.?youtube\.com.*(purge_shell=1|\/signin|\/logout)/;var dh=class{constructor(){var a=Wg,b=new ah;this.h=self;this.i=a;this.m=b;this.H=mc}init(){this.h.oninstall=this.o.bind(this);this.h.onactivate=this.j.bind(this);this.h.onfetch=this.l.bind(this);this.h.onmessage=this.u.bind(this)}o(a){a.waitUntil(this.h.skipWaiting());const b=Jg(this.i).catch(c=>{Y(c);return Promise.resolve()});
a.waitUntil(b)}j(a){const b=[this.h.clients.claim()];this.h.registration.navigationPreload&&b.push(this.h.registration.navigationPreload.enable());a.waitUntil(Promise.all(b))}l(a){return D(this,function*(){var b=this.m,c=!!this.h.registration.navigationPreload;const d=a.request;if(b.o.test(d.url))jf.h&&(delete jf.h.h,q.__SAPISID=void 0,L("VISITOR_DATA",void 0),L("SESSION_INDEX",void 0),L("DELEGATED_SESSION_ID",void 0)),c=a.respondWith,b=b.h,kg(b.h,b.i),wg(),b=Pg(a),c.call(a,b);else if(b.m.test(d.url))a.respondWith(Ng(b,
a));else if("navigate"===d.mode){if(O("sw_nav_request_network_first")){var e=new URL(d.url);e=b.j.test(e.pathname)}else e=!1;e?a.respondWith(Qg(b,a)):Ug(b,d.url)?a.respondWith(Vg(b,a)):c&&a.respondWith(Pg(a))}})}u(a){const b=a.data;
this.H.includes(b.type)?If(a):"refresh_shell"===b.type&&Fg(this.i).catch(c=>{Y(c)})}};function eh(){let a=r("ytglobal.storage_");a||(a=new fh,u("ytglobal.storage_",a));return a}
var fh=class{estimate(){var a,b;return D(this,function*(){const c=navigator;if(null===(a=c.storage)||void 0===a?0:a.estimate)return c.storage.estimate();if(null===(b=c.webkitTemporaryStorage)||void 0===b?0:b.queryUsageAndQuota)return gh()})}};
function gh(){const a=navigator;return new Promise((b,c)=>{var d;null!==(d=a.webkitTemporaryStorage)&&void 0!==d&&d.queryUsageAndQuota?a.webkitTemporaryStorage.queryUsageAndQuota((e,f)=>{b({usage:e,quota:f})},e=>{c(e)}):c(Error("webkitTemporaryStorage is not supported."))})}
u("ytglobal.storageClass_",fh);function hh(a,b){eh().estimate().then(c=>{c=Object.assign(Object.assign({},b),{isSw:void 0===self.document,isIframe:self!==self.top,deviceStorageUsageMbytes:ih(null===c||void 0===c?void 0:c.usage),deviceStorageQuotaMbytes:ih(null===c||void 0===c?void 0:c.quota)});a.h("idbQuotaExceeded",c)})}
class jh{constructor(){var a=kh;this.handleError=lh;this.h=a;this.i=!1;void 0===self.document||self.addEventListener("beforeunload",()=>{this.i=!0});
this.j=Math.random()<=Bc("ytidb_transaction_ended_event_rate_limit",.02)}N(a,b){switch(a){case "IDB_DATA_CORRUPTED":O("idb_data_corrupted_killswitch")||this.h("idbDataCorrupted",b);break;case "IDB_UNEXPECTEDLY_CLOSED":this.h("idbUnexpectedlyClosed",b);break;case "IS_SUPPORTED_COMPLETED":O("idb_is_supported_completed_killswitch")||this.h("idbIsSupportedCompleted",b);break;case "QUOTA_EXCEEDED":hh(this,b);break;case "TRANSACTION_ENDED":this.j&&this.h("idbTransactionEnded",b);break;case "TRANSACTION_UNEXPECTEDLY_ABORTED":a=
Object.assign(Object.assign({},b),{hasWindowUnloaded:this.i}),this.h("idbTransactionAborted",a)}}}function ih(a){return"undefined"===typeof a?"-1":String(Math.ceil(a/1048576))}
;Re(Oe(),{C:[{pa:/Failed to fetch/,weight:500}],A:[]});var {handleError:lh=df,N:kh=Ke}={handleError:function(a){return D(this,function*(){yield Ff();ef(a)})},
N:function(a,b){return D(this,function*(){yield Ff();Ke(a,b)})}};
for(T=new jh;0<S.length;){const a=S.shift();switch(a.type){case "ERROR":T.handleError(a.payload);break;case "EVENT":T.N(a.eventType,a.payload)}}jf.h=new jf(`${self.location.origin}/sw.js_data`);self.onnotificationclick=function(a){a.notification.close();const b=a.notification.data,c=self.clients.matchAll({type:"window",includeUncontrolled:!0});c.then(d=>{a:{var e=b.nav;for(const f of d)if(f.url===e){f.focus();break a}self.clients.openWindow(e)}});
a.waitUntil(c);a.waitUntil(Pf(b.clickEndpoint))};
self.onpush=function(a){a.waitUntil(J("NotificationsDisabled").then(b=>{if(b)return Promise.resolve();if(a.data&&a.data.text().length)try{return Nf(a.data.json())}catch(c){return Promise.resolve(c.message)}return Promise.resolve()}));
a.waitUntil(Lf())};
self.onpushsubscriptionchange=function(){Jf()};
const Wg=new Mg;(new dh).init();
