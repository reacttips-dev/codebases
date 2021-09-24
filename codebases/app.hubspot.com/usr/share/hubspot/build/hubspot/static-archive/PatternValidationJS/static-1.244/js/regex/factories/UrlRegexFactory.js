'use es6';

import UrlParts from '../parts/UrlParts';
var BLACKLISTED_WRAPPING_CHARS = '\\s\\(\\)\\[\\]\\{\\}';
export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$isGlobal = _ref.isGlobal,
      isGlobal = _ref$isGlobal === void 0 ? false : _ref$isGlobal,
      _ref$protocolRequired = _ref.protocolRequired,
      protocolRequired = _ref$protocolRequired === void 0 ? false : _ref$protocolRequired,
      _ref$domain = _ref.domain,
      domain = _ref$domain === void 0 ? UrlParts.domain : _ref$domain,
      _ref$protocol = _ref.protocol,
      protocol = _ref$protocol === void 0 ? UrlParts.protocol : _ref$protocol,
      _ref$path = _ref.path,
      path = _ref$path === void 0 ? UrlParts.path : _ref$path,
      _ref$file = _ref.file,
      file = _ref$file === void 0 ? UrlParts.file : _ref$file,
      _ref$search = _ref.search,
      search = _ref$search === void 0 ? UrlParts.search : _ref$search;

  var flags = 'i';
  var maybeProtocol = protocolRequired ? protocol : protocol + "?";
  var urlRegexStr = "" + maybeProtocol + domain + "(?:" + path + "(?:" + file + ")?)?" + search + "?";

  if (isGlobal) {
    flags = flags + "g";
    urlRegexStr = "[^" + BLACKLISTED_WRAPPING_CHARS + "]*?" + urlRegexStr + "[^" + BLACKLISTED_WRAPPING_CHARS + "]*?";
  } else {
    urlRegexStr = "^" + urlRegexStr + "$";
  }

  return new RegExp(urlRegexStr, flags);
});