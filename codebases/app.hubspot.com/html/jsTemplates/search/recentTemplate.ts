import { headerTemplate } from './headerTemplate';
import { resultSectionTemplate } from './resultSectionTemplate';
import { quickCreateTemplate } from './quickCreateTemplate';
import { text } from 'unified-navigation-ui/utils/NavI18n';
export var recentTemplate = function recentTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      resultSections = _ref.resultSections,
      spellingCorrectionText = _ref.spellingCorrectionText,
      showCreateActions = _ref.showCreateActions,
      query = _ref.query,
      searchHeader = _ref.searchHeader;

  return "\n<div class=\"navSearch-container__inner\">\n<div class=\"navSearch-error\"></div>\n" + headerTemplate({
    searchHeader: searchHeader,
    spellingCorrectionText: spellingCorrectionText
  }) + "\n  <div class=\"navSearch-resultsContainer navSearch-resultsContainer-recent\">\n  " + (resultSections ? Object.keys(resultSections).map(function (section) {
    return resultSectionTemplate(Object.assign({}, resultSections[section]));
  }).join('') : "<div style=\"font-size: 2rem; text-align: center; margin-bottom: 3rem;\">" + text('nav.search.fetchingRecentResults', {
    defaultValue: 'Fetching your recent results…'
  }) + "</div>") + "\n  </div>\n  " + (resultSections && showCreateActions ? quickCreateTemplate({
    query: query
  }) : '') + "\n</div>\n";
};