import { resultCardTemplate } from './resultCardTemplate';
import { escape } from 'unified-navigation-ui/utils/escape';
export var resultSectionTemplate = function resultSectionTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      sectionId = _ref.sectionId,
      sectionHeader = _ref.sectionHeader,
      results = _ref.results,
      hasMore = _ref.hasMore,
      sectionIndex = _ref.sectionIndex,
      hideViewAll = _ref.hideViewAll,
      seeAllText = _ref.seeAllText;

  return "\n  <div id=\"" + (sectionId ? escape(sectionId) : '') + "\" class=\"navSearch-resultSection\">\n  <h2>" + (sectionHeader ? escape(sectionHeader) : '') + "</h2>\n    <div class=\"navSearch-results\">\n      " + (Array.isArray(results) ? results.map(resultCardTemplate).join('') : '') + "\n    </div>\n    " + (!hideViewAll ? hasMore ? "<button data-section=\"" + (sectionId ? escape(sectionId) : '') + "\" data-index=\"" + (sectionIndex ? escape(sectionIndex) : '') + "\" class=\"navSearch-button navSearch-button-transparent navSearch-seeAll\">" + (seeAllText ? escape(seeAllText) : '') + "</button>" : '' : '') + "\n</div>\n";
};