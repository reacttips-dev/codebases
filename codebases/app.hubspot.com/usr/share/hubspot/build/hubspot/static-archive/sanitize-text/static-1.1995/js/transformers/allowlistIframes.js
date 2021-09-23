'use es6';

var doesMatchAnyRegex = function doesMatchAnyRegex(_ref) {
  var _ref$regexes = _ref.regexes,
      regexes = _ref$regexes === void 0 ? [] : _ref$regexes,
      _ref$string = _ref.string,
      string = _ref$string === void 0 ? '' : _ref$string;
  return regexes.some(function (regex) {
    return string.match(regex);
  });
};

export var allowlistIframes = function allowlistIframes(_ref2) {
  var node = _ref2.node,
      node_name = _ref2.node_name,
      allowedDomainsForIframe = _ref2.allowedDomainsForIframe;

  if (node_name === 'iframe' && node && node.attributes && node.getAttribute('src') && !doesMatchAnyRegex({
    regexes: allowedDomainsForIframe,
    string: node.getAttribute('src')
  })) {
    node.removeAttribute('src');
    return {
      node: node
    };
  }

  return null;
};