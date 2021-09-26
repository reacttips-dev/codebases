import{b as T,d as k}from"./chunk-4JRWSVEX.js";import{b as S,c as f}from"./chunk-FJD4SS3V.js";import{a as z}from"./chunk-TKNWVBCA.js";import{a as b}from"./chunk-V454E5QD.js";import{m as h}from"./chunk-4DDSFSZM.js";import{a as v}from"./chunk-5ZVMZG6E.js";import{a as r,b as n,c,f as s,i as u}from"./chunk-ORNWO27Z.js";var l=s(u()),w=s(b());var $=(0,w.default)(f)``;$.defaultProps=n(r({},f.defaultProps),{backgroundColor:"blue50",borderColor:"blue200",borderWidth:"1px",borderStyle:"solid",borderRadius:"50%",color:"blue400",fontSize:"16px",fontWeight:500,width:"24px",height:"24px",mr:"10px",pt:"1px",lineHeight:"20px",textAlign:"center"});var L=({index:e,children:t})=>l.default.createElement(S,{alignItems:"center",mb:"12px"},l.default.createElement($,null,e+1),l.default.createElement(f,{flex:1},t)),O=({children:e})=>l.default.Children.toArray(e).map((t,d)=>l.default.createElement(L,{key:d,index:d},t)),C=O;var m=s(u());var g=s(v()),i=s(b()),o=s(z());var y={heading:{xs:{color:"grey400",fontSize:14,textTransform:"uppercase",letterSpacing:"-0.02em"},sm:{color:"grey500",fontSize:18},md:{color:"grey500",fontSize:20}},paragraph:{xs:{color:"grey400",fontSize:14},sm:{color:"grey400",fontSize:16},lg:{color:"grey400",fontSize:20}}},a=i.default.span`
  margin: 0;
  text-transform: ${({textTransform:e})=>e};
  word-break: break-word;

  a,
  a:visited {
    color: ${({theme:e})=>e.colors.blue300};
  }

  ${o.space}
  ${o.typography}
  ${o.color}
  ${o.colorStyle}
  ${o.textStyle}
`,x=d=>{var p=d,{level:e}=p,t=c(p,["level"]);return m.default.createElement(a,r(r({},y.paragraph[e]),t))};x.defaultProps={fontWeight:1,color:"grey400",lineHeight:"lg",level:"sm"};x.propTypes=n(r(r(r(r(r({},o.space.propTypes),o.typography.propTypes),o.color.propTypes),o.colorStyle.propTypes),o.textStyle.propTypes),{level:g.default.oneOf(Object.keys(y.paragraph))});var P=d=>{var p=d,{level:e}=p,t=c(p,["level"]);return m.default.createElement(a,r(r({},y.heading[e]),t))};P.defaultProps={as:"h1",fontWeight:3,level:"md",margin:0};P.propTypes=n(r(r({},o.color.propTypes),o.typography.propTypes),{level:g.default.oneOf(Object.keys(y.heading))});var W=i.default.a`
  appearance: none;
  background: none;
  outline: 0;
  border: 0;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: ${T({attribute:"color"})};

  ${k}
  ${o.typography}
  ${o.space}
`,I=d=>{var p=d,{to:e}=p,t=c(p,["to"]);return m.default.createElement(W,r({as:e?h:"a",to:e},t))};I.defaultProps={variant:"base",fontSize:"base"};var H=(0,i.default)(a)``;H.defaultProps={as:"strong",fontWeight:3,color:"grey500"};var j=(0,i.default)(a)`
  border-radius: 3px;
  border: 1px solid ${({theme:e})=>e.colors.grey100};
  display: inline-block;
  font-family: Menlo, Monaco, Consolas, Courier, monospace;
  font-size: 14px;
  font-weight: normal;
  max-width: 100%;
  overflow: auto;
  padding: 5px;
  white-space: nowrap;
`;j.defaultProps=n(r({},a.defaultProps),{backgroundColor:"grey50"});var E=(0,i.default)(a)`
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`,G=x;export{C as a,x as b,P as c,W as d,I as e,H as f,j as g,E as h,G as i};
//# sourceMappingURL=chunk-JXNVBN57.js.map
