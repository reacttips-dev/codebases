import RESULT_TYPES from 'unified-navigation-ui/deferred/search/const/RESULT_TYPES';
import { escape } from 'unified-navigation-ui/utils/escape';
import { text } from 'unified-navigation-ui/utils/NavI18n';
var ACTIVITY = RESULT_TYPES.ACTIVITY,
    TRANSCRIPT = RESULT_TYPES.TRANSCRIPT;
export var resultCardTemplate = function resultCardTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$resultType = _ref.resultType,
      resultType = _ref$resultType === void 0 ? '' : _ref$resultType,
      _ref$resultId = _ref.resultId,
      resultId = _ref$resultId === void 0 ? '' : _ref$resultId,
      icon = _ref.icon,
      avatarUrl = _ref.avatarUrl,
      displayText = _ref.displayText,
      associatedUrlText = _ref.associatedUrlText,
      subText = _ref.subText,
      url = _ref.url,
      callDate = _ref.callDate,
      mentions = _ref.mentions,
      section = _ref.section;

  var resultTypeLocal = resultType ? escape(resultType) : '';
  var resultIdLocal = resultId ? escape(resultId) : '';
  var sectionLocal = section ? escape(section) : '';
  return "<div class=\"navSearch-resultWrapper\">\n    <" + (resultType === ACTIVITY ? 'div' : 'a') + " id=\"" + resultTypeLocal + "-" + resultIdLocal + "-" + sectionLocal + "\" " + (resultType !== ACTIVITY ? "href=\"" + (url ? encodeURI(url) : '') + "\"" : '') + " class=\"navSearch-result " + (resultType === TRANSCRIPT ? 'transcript' : '') + " " + (resultType === ACTIVITY ? 'activity' : 'default') + "\">\n    " + (avatarUrl ? "<div class=\"navSearch-avatar\"><img src=\"" + avatarUrl + "\"></div>" : '') + "\n    " + (icon && !avatarUrl ? "<div class=\"navSearch-icon\"><img src=\"" + icon + "\"></div>" : '') + "\n    <div class=\"navSearch-body\">\n      <div class=\"navSearch-bodyLeft\">\n        " + (displayText ? "<div class=\"navSearch-displayText\">" + escape(displayText) + "</div>" : '') + "\n        " + (associatedUrlText && associatedUrlText.text ? "<div class=\"navSearch-associatedUrls\">\n          <a id=\"" + resultTypeLocal + "-" + resultIdLocal + "-" + sectionLocal + "-activitylink\" href=\"" + (url ? encodeURI(url) : '') + "\">" + escape(associatedUrlText.text) + "</a></div>" : '') + "\n        " + (subText ? resultTypeLocal === TRANSCRIPT ? "<div class=\"navSearch-utterance\">" + escape("\"..." + subText) + "</div>" : "<div class=\"navSearch-subText\">" + escape(subText) + "</div>" : '') + "\n      </div>\n      " + (resultTypeLocal === TRANSCRIPT && (callDate || mentions) ? "<div class=\"navSearch-bodyRight\">\n              <div class=\"navSearch-bodyRightTop\">" + (callDate || '') + "</div>\n              <div class=\"navSearch-bodyRightBottom\">\n                " + (mentions ? text("nav.search.mentions." + (mentions === '1' ? 'one' : 'other'), {
    count: mentions
  }) : '') + "\n              </div>\n            </div>" : '') + "\n    </div>\n  </" + (resultType === ACTIVITY ? 'div' : 'a') + ">\n</div>";
};