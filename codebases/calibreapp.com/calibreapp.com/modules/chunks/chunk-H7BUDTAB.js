import{b as w}from"./chunk-4JRWSVEX.js";import{a as j}from"./chunk-TKNWVBCA.js";import{a as O}from"./chunk-V454E5QD.js";import{a as I}from"./chunk-5ZVMZG6E.js";import{a as d,c as $,d as f,f as c,i as D}from"./chunk-ORNWO27Z.js";var b=f((_,y)=>{"use strict";function G(r){for(var e=5381,t=r.length;t;)e=e*33^r.charCodeAt(--t);return e>>>0}y.exports=G});var S=f((J,M)=>{var B=(r,e,t)=>[[r,e,t],[(r+120)%360,e,t],[(r+240)%360,e,t]];M.exports=B});var P=f((K,k)=>{var p=(r,e,t)=>(t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*(2/3-t)*6:r),C=(r,e,t)=>{let o,s,a;if(r=r/360,e==0)o=s=a=t;else{let n=t<.5?t*(1+e):t+e-t*e,l=2*t-n;o=p(l,n,r+1/3),s=p(l,n,r),a=p(l,n,r-1/3)}return[Math.max(0,Math.min(Math.round(o*255),255)),Math.max(0,Math.min(Math.round(s*255),255)),Math.max(0,Math.min(Math.round(a*255),255))]};k.exports=C});var T=f((L,R)=>{var E=b(),F=S(),z=P(),H=()=>Math.floor(Math.random()*Date.now()),U=(r,e)=>{let t=E(r),o=F(t%360,1,.5),s=z(o[0][0],o[0][1],o[0][2]),a=z(o[1][0],o[1][1],o[1][2]),n=`rgb(${s[0]}, ${s[1]}, ${s[2]})`,l=`rgb(${a[0]}, ${a[1]}, ${a[2]})`,h=H();return`<?xml version="1.0" encoding="UTF-8"?>
<svg ${e!=null?`width="${e}px" height="${e}px"`:""} viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="${h}">
      <stop stop-color="${n}" offset="0%"></stop>
      <stop stop-color="${l}" offset="100%"></stop>
    </linearGradient>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <rect id="Rectangle" fill="url(#${h})" x="0" y="0" width="80" height="80"></rect>
  </g>
</svg>`};R.exports=U});var u=c(D()),g=c(I()),x=c(O()),i=c(j()),q=c(T());var W=(0,i.variant)({key:"avatarStyles",prop:"variant"}),A={small:{fontSize:10,height:22,width:22},medium:{fontSize:20,height:34,width:34},large:{fontSize:30,height:75,width:75}},m=x.default.img`
  background: white;
  display: inline-block;
  object-fit: cover;
  vertical-align: middle;
  ${w("border-color")};
  ${W}
  ${i.border}
  ${i.color}
  ${i.height}
  ${i.width}
}
`;m.defaultProps={variant:"default",borderRadius:"50%",borderStyle:"solid",borderWidth:"2px"};var Z=(0,x.default)(m)`
  align-items: center;
  display: flex;
  ${i.fontSize}
`;Z.defaultProps={as:"div"};var v=a=>{var n=a,{name:r,url:e,email:t,size:o}=n,s=$(n,["name","url","email","size"]);let l=A[o];if(e)return u.default.createElement(m,d(d({alt:r,src:e},l),s));{let h=r||t||new Date;return u.default.createElement(m,d(d({alt:r,src:`data:image/svg+xml;base64,${btoa((0,q.default)(h))}`},l),s))}};v.propTypes={size:g.default.oneOf(Object.keys(A)),name:g.default.string.isRequired,email:g.default.string};v.defaultProps={name:"",variant:"default",size:"medium"};var Q=v;export{W as a,A as b,Q as c};
//# sourceMappingURL=chunk-H7BUDTAB.js.map
