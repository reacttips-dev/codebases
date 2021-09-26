import{b as B,c as k,e as v}from"./chunk-JXNVBN57.js";import{a as b}from"./chunk-4JRWSVEX.js";import{b as h,c as o}from"./chunk-FJD4SS3V.js";import{a as l}from"./chunk-V454E5QD.js";import{d as s}from"./chunk-CL7MNENB.js";import{a as m,b as p,c as n,f as e,i as g}from"./chunk-ORNWO27Z.js";var w=e(l());var C=(0,w.default)(o)`
  position: relative;
  background: white;
  border-radius: 3px;
  box-shadow: 0 1px 0 ${({theme:t})=>t.colors.greyOutline};
  // minus the primary nav height, secondary nav height, offset, container margin
  min-height: calc(100vh - 60px - 48px - ${({offset:t})=>t}px - 40px);
`;C.defaultProps={m:3,offset:0};var Q=C;var P=e(l());var G=(0,P.default)(h)`
  display: ${({display:t})=>t};
  // minus the primary nav height
  min-height: ${({minHeight:t})=>t};
`;G.defaultProps={display:"flex",minHeight:"calc(100vh - 60px)"};var U=G;var $=e(l());var M=(0,$.default)(o)``;M.defaultProps={};var V=M;var F=e(l());var H=(0,F.default)(o)`
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;H.defaultProps={backgroundColor:"white",borderBottom:"1px solid",borderBottomColor:"grey100",p:4};var d=H;var T=e(l());var L=(0,T.default)(o)`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;L.defaultProps={p:4};var X=L;var S=e(l());var O=(0,S.default)(o)`
  display: grid;
  overflow-x: auto;
`;O.defaultProps={gridColumnGap:4,gridTemplateColumns:["minmax(0, 1fr)","minmax(0, 1fr)","minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)"]};var x=O;var I=e(l());var W=(0,I.default)(o)`
  grid-column: 1;

  ${b(0)` 
    grid-column: ${({span:t})=>t?`span ${t}`:"initial"};
  `};
`;W.defaultProps={mb:4};var c=W;var r=e(g());var _=oo=>{var y=oo,{id:t,span:f,link:u,mb:a,values:D,children:E}=y,J=n(y,["id","span","link","mb","values","children"]);return r.default.createElement(x,m({},J),r.default.createElement(c,{span:f},r.default.createElement(s,{id:`${t}.title`,defaultMessage:"null"},i=>i[0]==="null"?null:r.default.createElement(o,{mb:a},r.default.createElement(k,{as:"h2",level:"sm"},i))),r.default.createElement(s,{id:`${t}.description`,defaultMessage:"null",values:p(m({},D),{link:u?r.default.createElement(v,{href:u,target:"_blank"},r.default.createElement(s,{id:`${t}.link`})):null})},i=>i[0]==="null"?null:r.default.createElement(o,{mt:2,mb:a},r.default.createElement(B,null,i.map((K,N)=>r.default.createElement(r.default.Fragment,{key:N},K))))),E))};_.defaultProps={span:2,mb:2};var Y=_;var j=e(g());var q=u=>{var a=u,{variant:t}=a,f=n(a,["variant"]);return j.default.createElement(d,p(m({},f),{py:t==="button"?"21px":4}))};q.defaultProps=p(m({},d.defaultProps),{display:"flex",flexWrap:["wrap","nowrap"],alignItems:"center",p:null,py:4,px:4});var Z=q;var z=e(l());var A=(0,z.default)(o)`
  background-color: white;
`;A.defaultProps={px:4,pt:4,mb:-4};var R=A;export{Q as a,U as b,V as c,d,R as e,X as f,x as g,c as h,Y as i,Z as j};
//# sourceMappingURL=chunk-AQDAG4C2.js.map
