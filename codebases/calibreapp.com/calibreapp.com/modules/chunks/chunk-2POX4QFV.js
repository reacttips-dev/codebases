import{a as y}from"./chunk-POPT6TP2.js";import{c as b,d as x}from"./chunk-JELGMUFY.js";import{a as u}from"./chunk-RZQ4QVPP.js";import{a as S}from"./chunk-WNVFIGRJ.js";import{a as w}from"./chunk-V454E5QD.js";import{a,f as c,i as g}from"./chunk-ORNWO27Z.js";var e=c(g());var v=({children:t,sortBy:o,sortDirection:d,name:r,onSortDirection:p,onSortBy:s})=>{let[i]=u(y);return e.default.createElement("th",{className:o===r?"active":""},e.default.createElement(S,{attribute:r,onUpdateSortBy:n=>{i({variables:{summarySortBy:n}}),s(n)},onUpdateSortDirection:n=>{i({variables:{summarySortDirection:n}}),p(n)},sortBy:o,sortDirection:d},t))},H=({TitleCell:t,name:o,metrics:d,sortBy:r,onSortBy:p,sortDirection:s,onSortDirection:i})=>e.default.createElement("thead",null,e.default.createElement("tr",null,t&&e.default.createElement(t,null)||o&&e.default.createElement(v,{name:"name",sortBy:r,onSortBy:p,sortDirection:s,onSortDirection:i},o)||null,!d||d.map((l,f)=>e.default.createElement(v,{key:f,name:l.name,sortBy:r,onSortBy:p,sortDirection:s,onSortDirection:i},e.default.createElement(b,a({},l))," ",e.default.createElement(x,a({},l)))))),z=H;var h=c(g()),m=c(w()),$=m.default.div`
  margin-left: -15px;
  overflow-x: auto;
  padding-left: 15px;
  position: relative;
`,D=m.default.table`
  width: 100%;

  thead td,
  thead th {
    padding-bottom: ${t=>t.theme.space[2]};
    vertical-align: bottom;
    white-space: nowrap;
    min-width: 190px;
  }

  th {
    font-weight: 600;
    font-size: ${t=>t.theme.fontSizes[1]};
    color: ${t=>t.theme.colors.grey300};
    text-transform: uppercase;

    &.active {
      color: ${t=>t.theme.colors.grey400};
    }
  }

  th,
  td {
    text-align: right;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  tbody td {
    border-top: 1px solid ${t=>t.theme.colors.grey50};
    padding: ${t=>t.theme.space[2]} 0;
  }
`,B=t=>h.default.createElement($,null,h.default.createElement(D,a({},t)));B.defaultProps={};var T=B;export{z as a,T as b};
//# sourceMappingURL=chunk-2POX4QFV.js.map
