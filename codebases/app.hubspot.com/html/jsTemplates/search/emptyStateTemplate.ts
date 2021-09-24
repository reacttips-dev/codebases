import emptyStateIllustration from '../../templates/icons/search/emptyStateIllustration';
import { quickCreateTemplate } from './quickCreateTemplate';
import { text } from 'unified-navigation-ui/utils/NavI18n';
export var emptyStateTemplate = function emptyStateTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      query = _ref.query,
      isFiltered = _ref.isFiltered;

  return "\n<div class=\"navSearch-emptyState\">\n  " + emptyStateIllustration + "\n\n  " + (isFiltered ? "" + text('nav.search.noFilteredResults', {
    defaultValue: 'No results found. Try changing your selected categories or search terms.'
  }) : "" + text('nav.search.noResults', {
    defaultValue: 'No results found.'
  })) + "\n  <div class=\"navSearch-quickActions\">\n  " + quickCreateTemplate({
    query: query
  }) + "\n  </div>\n</div>\n";
};