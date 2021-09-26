import{a as E}from"./chunk-2OWL4LTV.js";import{C as h,q as f}from"./chunk-SOUDSSPT.js";import{e as s}from"./chunk-FJD4SS3V.js";import{a as z}from"./chunk-V454E5QD.js";import{a as u,c as l,f as n,i as d}from"./chunk-ORNWO27Z.js";var e=n(d()),b=n(E()),S=n(z());var a=n(d()),L=(o,t)=>{let[r,p]=(0,a.useState)(o);return(0,a.useEffect)(()=>{let c=setTimeout(()=>{p(o)},t);return()=>{clearTimeout(c)}},[o,t]),r},x=L;var N=(0,S.default)(s)`
  position: relative;

  > span {
    pointer-events: none;
    position: absolute;
  }

  input {
    box-sizing: border-box;
    padding-left: 30px;
    width: 100%;

    ::placeholder {
      opacity: 1;
    }
  }
`,I=(0,e.forwardRef)(function(V,y){var i=V,{className:t,onChange:r,placeholder:p,type:c,loading:g}=i,T=l(i,["className","onChange","placeholder","type","loading"]);let B=(0,b.default)(t,"form__text_input"),[m,D]=(0,e.useState)(""),_=x(m,250);return(0,e.useEffect)(()=>{r&&r(m)},[_]),e.default.createElement(N,u({},T),g?e.default.createElement(s,{as:"span",mt:"11px",ml:"10px"},e.default.createElement(h,null)):e.default.createElement(s,{as:"span",mt:"8px",ml:"10px"},e.default.createElement(f,null)),e.default.createElement("input",{name:"search",ref:y,type:c,className:B,onChange:w=>D(w.target.value),placeholder:p,autoComplete:"off"}))});I.defaultProps={type:"search",placeholder:"Search",fontSize:"14px"};var P=I;export{x as a,P as b};
//# sourceMappingURL=chunk-5AD3ZUGZ.js.map
