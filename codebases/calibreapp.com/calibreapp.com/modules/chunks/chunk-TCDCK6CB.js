import{a as x}from"./chunk-VSZVUKJA.js";import{a as v}from"./chunk-TZWC6Q34.js";import{c as b,t as w}from"./chunk-SOUDSSPT.js";import{c as f,e as c}from"./chunk-JXNVBN57.js";import{b as a,c as t}from"./chunk-FJD4SS3V.js";import{a as F}from"./chunk-V454E5QD.js";import{m as L}from"./chunk-4DDSFSZM.js";import{a as m,b as B,c as p,f as h,i as z}from"./chunk-ORNWO27Z.js";var o=h(z()),i=h(F());var M=i.default.ul`
  list-style-type: none;
  min-width: 280px;
`,U=d=>{var l=d,{children:r,forwardedRef:e}=l,n=p(l,["children","forwardedRef"]);return o.default.createElement(M,m({ref:e},n),r)},k=(0,i.default)(t)`
  overflow-x: ${({overflowX:r})=>r};

  &:last-child {
    border-bottom: 0;
  }
`;k.defaultProps={as:"li",borderBottomWidth:"1px",borderBottomStyle:"solid",borderBottomColor:"greyOutline",backgroundColor:"white",overflowX:"initial"};var j=i.default.div`
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;

  > * {
    margin-left: ${r=>r.theme.space[2]};
  }

  > :first-child {
    margin-left: 0;
  }
`,I=({link:r,title:e})=>r&&o.default.createElement(L,{to:r},o.default.createElement(f,{as:"h3",level:"sm",fontSize:"16px"},e))||o.default.createElement(f,{as:"h3",level:"sm",fontSize:"16px"},e),S=(0,i.default)(a)`
  cursor: ${({onClick:r})=>r?"pointer":"default"};

  &:hover {
    background-color: ${({theme:r,onClick:e,expanded:n})=>e&&!n?r.colors.grey50:"none"};
  }
`;S.defaultProps={p:3};var D=(0,i.default)(t)`
  line-height: 0;
  vertical-align: unset;
  transform: rotate(${({rotate:r})=>r});
  transform-origin: center center;
`,G=N=>{var y=N,{verticalAlign:r,itemType:e,preview:n,title:d,badges:l,meta:s,link:g,children:$,forwardedRef:W,onExpand:A,expanded:u,actions:C,p:E}=y,H=p(y,["verticalAlign","itemType","preview","title","badges","meta","link","children","forwardedRef","onExpand","expanded","actions","p"]);return o.default.createElement(k,B(m({},H),{ref:W}),o.default.createElement(S,{alignItems:r,flexWrap:["wrap","nowrap"],onClick:A,expanded:u,p:E},e==="drag"&&o.default.createElement(t,{mr:3,className:"draggable"},o.default.createElement(w,null))||e=="expand"&&o.default.createElement(D,{mr:3,px:1,color:"grey300",rotate:u?"180deg":0},o.default.createElement(c,{variant:"muted",as:"button"},o.default.createElement(b,null)))||null,n?o.default.createElement(o.default.Fragment,null,o.default.createElement(t,{mr:3},n),o.default.createElement(t,{flex:1,style:{overflow:"hidden"},mr:3},o.default.createElement(a,{alignItems:"center"},o.default.createElement(t,null,o.default.createElement(I,{title:d,link:g})),l.map((P,T)=>o.default.createElement(t,{key:T,ml:1},o.default.createElement(v,{type:"neutral"},P)))),s?o.default.createElement(x,{items:s}):null)):o.default.createElement(t,{flex:1},o.default.createElement(I,{title:d,link:g}),s?o.default.createElement(x,{items:s}):null),o.default.createElement(t,{mt:[3,0],width:[1,"auto"]},o.default.createElement(j,null,C))),o.default.createElement(t,{px:3},$))};G.defaultProps={badges:[],verticalAlign:"center"};export{U as a,G as b};
//# sourceMappingURL=chunk-TCDCK6CB.js.map
