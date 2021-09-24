import{a as d}from"./chunk-TKNWVBCA.js";import{a as m}from"./chunk-V454E5QD.js";import{a}from"./chunk-5ZVMZG6E.js";import{a as n,f as o}from"./chunk-ORNWO27Z.js";var t=o(a()),s=o(m()),c=o(d()),r={DEFAULT:void 0,NEUTRAL:"neutral",SUCCESS:"success",WARNING:"warning",ERROR:"error",OK:"ok",LIGHT:"light"},g=e=>{switch(e.type){case r.SUCCESS:return`
        color: ${e.theme.colors.green500};
        background-color: ${e.theme.colors.green200};
        border-color: ${e.theme.colors.green200};
        font-weight: 500;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      `;case r.ERROR:return`
        color: ${e.theme.colors.red500};
        background-color: ${e.theme.colors.red200};
        border-color: ${e.theme.colors.red200};
        font-weight: 500;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      `;case r.WARNING:return`
        color: ${e.theme.colors.yellow500};
        background-color: ${e.theme.colors.yellow300};
        border-color: ${e.theme.colors.yellow300};
        font-weight: 500;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      `;case r.NEUTRAL:return`
        color: ${e.theme.colors.grey500};
        background-color: ${e.theme.colors.grey200};
        border-color: ${e.theme.colors.grey200};
        font-weight: 500;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      `;case r.OK:return`
        color: ${e.theme.colors.green300};
        background-color: ${e.theme.colors.green100};
        border-color: ${e.theme.colors.green100};
        text-transform: uppercase;
      `;case r.LIGHT:return`
        color: ${e.theme.colors.grey300};
        border-color: ${e.theme.colors.grey200};
      `;case r.DEFAULT:default:return`
        color: ${e.theme.colors.grey500};
        background-color: ${e.theme.colors.grey200};
        border-color: ${e.theme.colors.grey200};
      `}},l=s.default.span`
  border: 1px solid transparent;
  border-radius: 3px;
  display: inline-block;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  text-align: center;
  vertical-align: middle;

  ${e=>e.rounded&&`
    border-radius: 100%;
    height: 0.7rem;
    width: 0.7rem;
  `};

  ${e=>g(e)}
  ${c.space}
`;l.propTypes=n({type:t.default.oneOf(Object.values(r)),rounded:t.default.bool},c.space.propTypes);l.defaultProps={py:"2px",px:1};var h=l;export{h as a};
//# sourceMappingURL=chunk-TZWC6Q34.js.map
