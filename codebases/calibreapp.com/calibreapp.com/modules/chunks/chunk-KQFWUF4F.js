import{d as r}from"./chunk-IHNDKV3B.js";import{a as C}from"./chunk-2FC4P7GA.js";import{b as s}from"./chunk-4JRWSVEX.js";import{a as u}from"./chunk-V454E5QD.js";import{f as p,i as c}from"./chunk-ORNWO27Z.js";var o=p(c()),i=p(u()),n=p(C());var f=i.default.div`
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
  position: relative;

  &:hover {
    > * {
      opacity: 1;
      visibility: visible;
    }
  }
`,v=i.default.div`
  cursor: pointer;
  font-size: 14px;
  background-color: ${t=>t.theme.colors.grey100};
  border-radius: 3px;
  padding: 3px 5px;
  margin-right: 9px;
`,x=i.default.div`
  background-color: RGBA(255, 255, 255, 0.9);
  bottom: 0;
  left: 0;
  opacity: 0;
  text-align: center;
  position: absolute;
  right: 0;
  transition: ${s({attribute:"opacity"})};
  visibility: hidden;
  top: 0;
`,m=i.default.div`
  display: flex;
  align-items: center;
`,y=({children:t,text:d,prompt:l,layout:b})=>{let[e,a]=(0,o.useState)(!1);return(0,o.useEffect)(()=>{typeof window!="undefined"&&setTimeout(()=>a(!1),1e3)},[e]),o.default.createElement(n.CopyToClipboard,{text:d||t,onCopy:()=>a(!0)},b==="overlay"?o.default.createElement(f,{position:"relative"},t,o.default.createElement(x,null,o.default.createElement(r,{label:e?"Copied!":l}))):o.default.createElement(m,null,o.default.createElement(v,{position:"relative",layout:"button"},t),o.default.createElement("div",null,o.default.createElement(r,{label:e?"Copied!":l}))))};y.defaultProps={prompt:"Copy",layout:"overlay"};var k=y;export{k as a};
//# sourceMappingURL=chunk-KQFWUF4F.js.map
