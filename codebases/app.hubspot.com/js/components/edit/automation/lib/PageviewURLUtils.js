'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export var HTTPS_PROTOCOL = 'https://';
export var HTTP_PROTOCOL = 'http://';
export var PROTOCOL_OPTIONS = [HTTPS_PROTOCOL, HTTP_PROTOCOL].map(function (value) {
  return {
    value: value,
    text: value
  };
});
export function splitProtocolAndDomain() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var fallbackProtocol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var protocol = fallbackProtocol;
  var domain = value;

  if (value.startsWith(HTTPS_PROTOCOL)) {
    protocol = HTTPS_PROTOCOL;
    domain = value.substr(8);
  } else if (value.startsWith(HTTP_PROTOCOL)) {
    protocol = HTTP_PROTOCOL;
    domain = value.substr(7);
  }

  return [protocol, domain];
}
export function valueContainsProtocol(value) {
  var _splitProtocolAndDoma = splitProtocolAndDomain(value),
      _splitProtocolAndDoma2 = _slicedToArray(_splitProtocolAndDoma, 1),
      protocol = _splitProtocolAndDoma2[0];

  return !!protocol;
}