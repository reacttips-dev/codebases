import{a as d}from"./chunk-YG5VU5UW.js";import{a as w}from"./chunk-CWNFCDZO.js";import{b as a}from"./chunk-4JRWSVEX.js";import{c as n}from"./chunk-FJD4SS3V.js";import{a as $}from"./chunk-V454E5QD.js";import{a as c,c as p,f as i,i as v}from"./chunk-ORNWO27Z.js";var e=i(v()),u=i($()),f=i(w());var C=(0,u.default)(n)`
  height: ${({open:o,maxHeight:t})=>o?t:0}px;
  opacity: ${({open:o})=>o?1:0};
  overflow: hidden;
  position: relative;
  visibiltiy: ${({open:o})=>o?"visible":"hidden"};
  transition: ${a()};
`,h=o=>{let l=o,{duration:t,type:k,message:b,onDismiss:r}=l,y=p(l,["duration","type","message","onDismiss"]),m=(0,e.useRef)(null),{height:F}=(0,f.default)(m),[x,s]=(0,e.useState)();(0,e.useEffect)(()=>{if(s(!0),t){let g=setTimeout(()=>s(!1),t);return()=>clearTimeout(g)}},[o]);let B=()=>{s(!1),r()};return e.default.createElement(C,{open:x,maxHeight:F},e.default.createElement(n,c({ref:m},y),e.default.createElement(d,{type:k,onDismiss:r?B:null},b)))};h.defaultProps={duration:5e3,p:3};var T=h;export{T as a};
//# sourceMappingURL=chunk-KCN7NYIH.js.map
