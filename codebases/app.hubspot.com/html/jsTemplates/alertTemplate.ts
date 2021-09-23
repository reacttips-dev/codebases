import { close_icon } from '../templates/icons/close_icon';
import { escape } from 'unified-navigation-ui/utils/escape';
export var alertTemplate = function alertTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      level = _ref.level,
      title = _ref.title,
      _ref$dangerouslySetDe = _ref.dangerouslySetDescription,
      dangerouslySetDescription = _ref$dangerouslySetDe === void 0 ? '' : _ref$dangerouslySetDe,
      _ref$description = _ref.description,
      description = _ref$description === void 0 ? '' : _ref$description,
      link = _ref.link,
      _ref$unsafeLink = _ref.unsafeLink,
      unsafeLink = _ref$unsafeLink === void 0 ? false : _ref$unsafeLink,
      _ref$linkText = _ref.linkText,
      linkText = _ref$linkText === void 0 ? '' : _ref$linkText,
      isCondensed = _ref.isCondensed;

  return level && title ? "\n  <div class=\"" + (isCondensed ? 'isCondensed' : 'm-all-4') + " user-pref-alert\">\n    <div class=\"hs-nav-v4-alert hs-nav-v4-alert--" + escape(level) + "\">\n    <div class=\"hs-nav-v4-alert__inner\">\n      <h2 class=\"hs-nav-v4-alert__title" + (isCondensed ? ' isCondensed' : '') + "\">" + escape(title) + "</h2>\n      <div class=\"hs-nav-v4-alert__body\">" + (dangerouslySetDescription || '') + (description ? escape(description) : '') + (link ? "<a href=\"" + encodeURI(link) + "\" class=\"hs-nav-v4-alert__link\">\n        " + escape(linkText) + "</a>" : '') + "\n      " + (unsafeLink ? "<a href=\"" + unsafeLink + "\" class=\"hs-nav-v4-alert__link\">\n        " + escape(linkText) + "</a>" : '') + "\n      </div>\n      " + close_icon + "\n    </div>\n    </div>\n  </div>\n" : '';
};