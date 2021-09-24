function u(e,r,s=r){let n=1,i=4,t=e;if(typeof t=="string"&&(t=t.trim()),typeof t!="string"||t.length<i||typeof r!="number"||r<=i||r>=t.length-n)return e;if(s>=r)return`${t.substring(0,r-n)}\u2026`;let f=t.substring(0,s),c=t.slice(s+n-r);return`${f}\u2026${c}`}export{u as a};
//# sourceMappingURL=chunk-YOWIORHC.js.map
