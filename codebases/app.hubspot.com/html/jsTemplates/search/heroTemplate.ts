import { escape } from '../../../js/utils/escape';
import RESULT_TYPES from '../../../js/deferred/search/const/RESULT_TYPES';
var TRANSCRIPT = RESULT_TYPES.TRANSCRIPT;
export var heroTemplate = function heroTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$resultType = _ref.resultType,
      resultType = _ref$resultType === void 0 ? '' : _ref$resultType,
      _ref$resultId = _ref.resultId,
      resultId = _ref$resultId === void 0 ? '' : _ref$resultId,
      url = _ref.url,
      avatarUrl = _ref.avatarUrl,
      icon = _ref.icon,
      displayText = _ref.displayText,
      associatedUrlText = _ref.associatedUrlText,
      section = _ref.section,
      subText = _ref.subText,
      quickActions = _ref.quickActions;

  var resultTypeLocal = escape(resultType) || '';
  var resultIdLocal = escape(resultId) || '';
  var sectionLocal = escape(section) || '';
  return "<div class=\"navSearch-hero\">\n  <a id=\"" + resultTypeLocal + "-" + resultIdLocal + "-" + sectionLocal.toLowerCase() + "-hero\" href=\"" + (escape(url) || '') + "\" class=\"navSearch-underlay-link " + (resultType === TRANSCRIPT ? 'transcript' : '') + "\"></a>\n  " + (avatarUrl ? "<div class=\"navSearch-avatar\"><img src=\"" + encodeURI(avatarUrl) + "\"></div>" : '') + "\n  " + (icon && !avatarUrl ? "<div class=\"navSearch-icon\"><img src=\"" + encodeURI(icon) + "\"></div>" : '') + "\n  <div class=\"navSearch-body\">\n    " + (displayText ? "<div class=\"navSearch-displayText\">" + escape(displayText) + "</div>" : '') + "\n    " + (associatedUrlText && associatedUrlText.text ? "<div class=\"navSearch-associatedUrls\">\n      <a id=\"" + resultTypeLocal + "-" + resultIdLocal + "-activitylink\" href=\"" + (url ? encodeURI(url) : '') + "\">" + escape(associatedUrlText.text) + "</a></div>" : '') + "\n    " + (subText ? resultTypeLocal === TRANSCRIPT ? "<div class=\"navSearch-utterance\">" + escape("\"..." + subText) + "</div>" : "<div class=\"navSearch-subText\">" + escape(subText) + "</div>" : '') + "\n\n\n  </div>\n  " + (quickActions ? "<div class=\"navSearch-quickActions\">" + quickActions.map(function (_ref2, index) {
    var id = _ref2.id,
        href = _ref2.href,
        quickActionType = _ref2.quickActionType,
        text = _ref2.text;
    text = text ? escape(text) : '';
    id = id ? escape(id) : '';

    if (href) {
      return "<a id=\"" + id + "\" href=\"" + encodeURI(href) + "\" data-quick-action-type=\"" + (escape(quickActionType) || '') + "\"\n      class=\"navSearch-button navSearch-button-tertiary" + (quickActions.length === index + 1 ? '' : '-light') + "\">" + text + "</a>\n    ";
    }

    return "<button id=\"" + id + "\" data-quick-action-type=\"" + (escape(quickActionType) || '') + "\"\n    class=\"navSearch-button navSearch-button-tertiary" + (quickActions.length === index + 1 ? '' : '-light') + "\">" + text + "</button>\n ";
  }).join('') + "</div>" : '') + "\n</div>\n";
};