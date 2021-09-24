import{a as m}from"./chunk-TKNWVBCA.js";import{a as c}from"./chunk-V454E5QD.js";import{a as d}from"./chunk-5ZVMZG6E.js";import{a as n,f as o}from"./chunk-ORNWO27Z.js";var s=o(d()),t=o(c()),i=o(m()),y={DEFAULT:"",CENTER:"center"},r={START:"flex-start",CENTER:"center"},a=t.default.div`
  display: flex;
  align-items: ${e=>e.rowAlign};

  ${e=>e.rowAlign==="center"&&`
    .media__body {
      flex: initial;
    }
  `}

  ${e=>e.align==="center"&&`
    @media only screen and (min-width: ${l=>l.theme.breakpoints.sm}) {
      justify-content: center;
    }
  `}
`;a.propTypes={align:s.default.oneOf(Object.values(y)),rowAlign:s.default.oneOf(Object.values(r))};a.defaultProps={rowAlign:r.START};var p=t.default.div`
  ${i.space}
`;p.propTypes=n({},i.space.propTypes);p.defaultProps={className:"media__object",mr:2};var f=t.default.div`
  flex: 1;
  max-width: 100%;
`;f.defaultProps={className:"media__body"};export{a,p as b,f as c};
//# sourceMappingURL=chunk-PBHYLXIU.js.map
