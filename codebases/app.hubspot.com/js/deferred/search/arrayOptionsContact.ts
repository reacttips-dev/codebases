import joinBodyArray from './joinBodyArray';
export default function (_ref, gates) {
  var highlights = _ref.highlights,
      properties = _ref.properties;
  var cProp = ['email', 'company'];
  var cHighlight = cProp.map(function (p) {
    return p + ".ngrammed";
  });

  var obSel = function obSel(o, s, i) {
    return o && o[s[i]];
  };

  if (gates && Array.isArray(gates) && gates.indexOf('search:no_highlight') > -1) {
    return joinBodyArray([obSel(properties, cProp, 0), obSel(properties, cProp, 1)]);
  }

  var toJoin = [obSel(highlights, cHighlight, 0) || obSel(properties, cProp, 0), obSel(highlights, cHighlight, 1) || obSel(properties, cProp, 1)];
  return joinBodyArray(toJoin);
}