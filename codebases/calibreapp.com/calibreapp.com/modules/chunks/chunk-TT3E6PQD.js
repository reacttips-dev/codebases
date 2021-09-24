import{a as b}from"./chunk-TKNWVBCA.js";import{a as $}from"./chunk-V454E5QD.js";import{a as d,c as n,f as p,i as y}from"./chunk-ORNWO27Z.js";var l=p(y()),e=p($()),o=p(b()),f={xxs:{maxWidth:"1px"},xs:{width:"30px"},sm:{maxWidth:"100px"},md:{},lg:{maxWidth:"250px"}},x=e.default.div`
  margin-left: -15px;
  overflow-x: ${({overflow:t})=>t};
  padding-left: 15px;
  position: relative;
  table {
    opacity: ${({disabled:t})=>t?"0.5":"1"};
  }

  tr {
    pointer-events: ${({disabled:t})=>t?"none":"auto"};
  }
`;x.defaultProps={overflow:"auto"};var m=e.default.table`
  max-width: 100%;
  overflow-x: auto;
  text-align: left;
  width: 100%;

  ${({bleed:t})=>t?"":`
  td:first-of-type, th:first-of-type {padding-left: 0;}
  td:last-of-type, th:last-of-type {padding-right: 0;}
`}
`,c=w=>{var s=w,{header:t,overflow:r,disabled:i}=s,h=n(s,["header","overflow","disabled"]);return l.default.createElement(x,{overflow:r,disabled:i},t,l.default.createElement(m,d({},h)))};c.defaultProps={bleed:!0};var T=e.default.thead``,W=e.default.tr`
  ${({selectable:t})=>!t||"cursor: pointer;"};
`,a=e.default.td`
  vertical-align: ${({verticalAlign:t})=>t};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${({maxWidth:t})=>t};
  opacity: ${({disabled:t})=>t?".5":"1"};

  ${o.color}
  ${o.border}
  ${o.fontSize}
  ${o.space}
  ${o.textAlign}
  ${o.width}
`;a.defaultProps={borderBottomWidth:0,borderLeftWidth:0,borderRightWidth:0,borderTopWidth:"1px",borderStyle:"solid",borderColor:"grey100",py:2,px:3,verticalAlign:"middle"};var S=t=>l.default.createElement(a,d(d({},f[t.level]),t)),g=(0,e.default)(a)`
  text-transform: ${({textTransform:t})=>t};
  overflow: visible;
  ${({active:t,theme:r})=>t?`color: ${r.colors.grey400}`:null}
`,u=t=>l.default.createElement(g,d(d({},f[t.level]),t));u.defaultProps={as:"th",borderTopWidth:0,color:"grey400",fontSize:"14px",fontWeight:600,textTransform:"uppercase"};var v=e.default.tbody`
  :nth-child(odd) tr {
    background: ${({stripedColor:t,theme:r,backgroundColor:i})=>t?r.colors[t]:r.colors[i]};
  }

  ${o.border}
  ${o.color}
`;v.defaultProps={backgroundColor:"white"};var P=c;export{T as a,W as b,S as c,u as d,v as e,P as f};
//# sourceMappingURL=chunk-TT3E6PQD.js.map
