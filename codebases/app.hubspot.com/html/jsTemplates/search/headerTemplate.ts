import { arrow_left_icon } from '../../templates/icons/arrow_left_icon';
import { escape } from '../../../js/utils/escape';
import { close_icon } from '../../templates/icons/close_icon';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import { capitalize } from 'unified-navigation-ui/utils/capitalize';
export var headerTemplate = function headerTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      checkboxFiltersGated = _ref.checkboxFiltersGated,
      spellingCorrectionText = _ref.spellingCorrectionText,
      isSearchButton = _ref.isSearchButton,
      searchHeader = _ref.searchHeader,
      _ref$selectedCategori = _ref.selectedCategories,
      selectedCategories = _ref$selectedCategori === void 0 ? [] : _ref$selectedCategori;

  var searchText = escape(searchHeader || text('nav.search.searchHeader.empty', {
    defaultValue: 'Type something to start searching'
  }));

  var renderFilterButtons = function renderFilterButtons(type) {
    var buttonText = text("nav.search.headings." + type.toLowerCase(), {
      defaultValue: capitalize(type.toLowerCase().replace(/_/g, ' '))
    });
    return "<button class=\"navSearch-filter-button-header\" id=\"" + type.toLowerCase() + "\">" + buttonText + "</button>";
  };

  return "\n  <div class=\"navSearch-header\">\n  <div class=\"navSearch-status\">\n    <div class=\"navSearch-headerText\">\n      " + (isSearchButton ? "<button class=\"navSearch-button navSearch-button-transparent\">" + arrow_left_icon + "\n          " + searchText + "</button>" : spellingCorrectionText ? "<div class=\"navSearch-spellCorrectText\">" + (spellingCorrectionText || '') + "</div>" : searchText) + "\n      <span class=\"navSearch-filter-buttons\">" + (isSearchButton || checkboxFiltersGated ? '' : selectedCategories.map(renderFilterButtons).join('')) + "\n      </span>\n    </div>\n    <div class=\"navSearch-filters\"></div>\n  </div>\n  <button class=\"closeSearch\" aria-label=\"close search\">" + close_icon + "</button>\n</div>\n";
};