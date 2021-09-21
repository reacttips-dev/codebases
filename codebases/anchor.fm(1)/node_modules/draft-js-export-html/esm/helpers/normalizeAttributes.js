// Lifted from: https://github.com/facebook/react/blob/master/src/renderers/dom/shared/HTMLDOMPropertyConfig.js
var ATTR_NAME_MAP = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
};

function normalizeAttributes(attributes) {
  if (attributes == null) {
    return attributes;
  }

  var normalized = {};
  var didNormalize = false;

  for (var _i = 0, _Object$keys = Object.keys(attributes); _i < _Object$keys.length; _i++) {
    var name = _Object$keys[_i];
    var newName = name;

    if (ATTR_NAME_MAP.hasOwnProperty(name)) {
      newName = ATTR_NAME_MAP[name];
      didNormalize = true;
    }

    normalized[newName] = attributes[name];
  }

  return didNormalize ? normalized : attributes;
}

export default normalizeAttributes;