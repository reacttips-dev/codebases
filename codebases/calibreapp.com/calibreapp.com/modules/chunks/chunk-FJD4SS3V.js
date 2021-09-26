import{a as g}from"./chunk-TKNWVBCA.js";import{a as _}from"./chunk-V454E5QD.js";import{a as D}from"./chunk-5ZVMZG6E.js";import{a as s,d as v,f as b}from"./chunk-ORNWO27Z.js";var h=v(l=>{"use strict";l.__esModule=!0;l.default=l.createPropTypes=l.propType=void 0;var d=j(D()),n=g();function j(e){return e&&e.__esModule?e:{default:e}}function T(){return T=Object.assign||function(e){for(var p=1;p<arguments.length;p++){var t=arguments[p];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},T.apply(this,arguments)}var O=d.default.oneOfType([d.default.number,d.default.string,d.default.array,d.default.object]);l.propType=O;var a=function(p){return p.reduce(function(t,o){var u;return T({},t,(u={},u[o]=O,u))},{})};l.createPropTypes=a;var z={space:a(n.space.propNames),color:a(n.color.propNames),layout:a(n.layout.propNames),typography:a(n.typography.propNames),flexbox:a(n.flexbox.propNames),border:a(n.border.propNames),background:a(n.background.propNames),position:a(n.position.propNames),grid:a(n.grid.propNames),shadow:a(n.shadow.propNames),buttonStyle:a(n.buttonStyle.propNames),textStyle:a(n.textStyle.propNames),colorStyle:a(n.colorStyle.propNames)};l.default=z});var $=v(i=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});i.Flex=i.Box=void 0;var N=P(_()),y=g(),c=P(h());function P(e){return e&&e.__esModule?e:{default:e}}function S(e,p){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);p&&(o=o.filter(function(u){return Object.getOwnPropertyDescriptor(e,u).enumerable})),t.push.apply(t,o)}return t}function I(e){for(var p=1;p<arguments.length;p++){var t=arguments[p]!=null?arguments[p]:{};p%2?S(t,!0).forEach(function(o){M(e,o,t[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):S(t).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))})}return e}function M(e,p,t){return p in e?Object.defineProperty(e,p,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[p]=t,e}var C=(0,y.compose)(y.space,y.color,y.layout,y.typography,y.flexbox),m=(0,N.default)("div").withConfig({displayName:"src__Box",componentId:"sc-1sbtrzs-0"})({boxSizing:"border-box"},C);i.Box=m;m.displayName="Box";m.propTypes=I({},c.default.space,{},c.default.color,{},c.default.layout,{},c.default.typography,{},c.default.flexbox);var w=(0,N.default)(m).withConfig({displayName:"src__Flex",componentId:"sc-1sbtrzs-1"})({display:"flex"});i.Flex=w;w.displayName="Flex"});var f=b(_()),x=b($()),r=b(g()),B=(0,r.variant)({key:"gridStyles",prop:"variant"}),F=(0,f.default)(x.Flex)`
  ${r.border}
  ${r.textAlign}
  ${r.grid}
  ${({height:e})=>e&&`height: ${e};`}
  ${B}
`;F.propTypes=s(s(s(s(s(s({},r.border.propTypes),r.color.propTypes),r.fontSize.propTypes),r.space.propTypes),r.textAlign.propTypes),r.width.propTypes);var q=(0,f.default)(x.Box)`
  ${r.border}
  ${r.color}
  ${r.textAlign}
  ${r.grid}
  ${({height:e})=>e&&`height: ${e};`}
  ${B}
  ${r.boxShadow}
`;q.propTypes=s(s(s(s(s(s(s({},r.border.propTypes),r.color.propTypes),r.fontSize.propTypes),r.space.propTypes),r.textAlign.propTypes),r.width.propTypes),r.boxShadow.propTypes);var R=(0,f.default)(F)`
  display: inline-flex;
`,A=(0,f.default)(q)`
  display: inline-block;
`;export{$ as a,F as b,q as c,R as d,A as e};
//# sourceMappingURL=chunk-FJD4SS3V.js.map
