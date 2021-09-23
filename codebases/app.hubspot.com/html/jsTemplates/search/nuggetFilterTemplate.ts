import RESULT_TYPES from 'unified-navigation-ui/deferred/search/const/RESULT_TYPES';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import checkbox from '../../templates/icons/search/checkbox';
import { arrow_down_icon } from '../../templates/icons/arrow_down_icon';
export var nuggetFilterTemplate = function nuggetFilterTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      seeAllNuggetFilters = _ref.seeAllNuggetFilters,
      _ref$availableResultS = _ref.availableResultSections,
      availableResultSections = _ref$availableResultS === void 0 ? [] : _ref$availableResultS,
      _ref$selectedResultSe = _ref.selectedResultSections,
      selectedResultSections = _ref$selectedResultSe === void 0 ? null : _ref$selectedResultSe;

  var capitalize = function capitalize(s) {
    if (typeof s !== 'string') return '';
    return "" + s.charAt(0).toUpperCase() + s.slice(1);
  };

  var allResultTypes = Object.values(RESULT_TYPES).filter(function (type) {
    return type !== RESULT_TYPES.RECENTLY_MODIFIED && type !== RESULT_TYPES.RECENTLY_SEARCHED && type !== RESULT_TYPES.CUSTOM_OBJECT;
  }).map(function (type) {
    return {
      value: type.toLowerCase(),
      enabled: availableResultSections ? availableResultSections.length > 0 ? availableResultSections.indexOf(type) > -1 : true : false,
      selected: selectedResultSections ? selectedResultSections.indexOf(type) > -1 : false
    };
  }).sort(function (a, b) {
    return a.enabled > b.enabled ? -1 : 1;
  });

  var filterConfig = function filterConfig(type) {
    var enabled = !type.enabled && !type.selected ? 'disabled' : '';
    var filterText = text("nav.search.headings." + type.value, {
      defaultValue: capitalize(type.value.replace(/_/g, ' '))
    });
    var selected = type.selected ? 'selected' : '';
    return {
      enabled: enabled,
      filterText: filterText,
      selected: selected
    };
  };

  var renderFilterCheckboxes = function renderFilterCheckboxes(type, index) {
    if (index < 5) {
      return '';
    }

    var _filterConfig = filterConfig(type),
        enabled = _filterConfig.enabled,
        filterText = _filterConfig.filterText,
        selected = _filterConfig.selected;

    return "<div class=\"navSearch-filter-checkbox " + enabled + " " + selected + "\" id=\"" + type.value + "\">\n          <input tabindex=\"0\" type=\"checkbox\"/>\n          <span class=\"checkbox-indicator\">\n            <span class=\"checkbox-check " + selected + " \">" + checkbox + "</span>\n          </span>\n          <span class=\"checkbox-label\">" + filterText + "</span>\n        </div>";
  };

  var renderFilterButtons = function renderFilterButtons(type, index) {
    if (index > 4) {
      return '';
    }

    var _filterConfig2 = filterConfig(type),
        enabled = _filterConfig2.enabled,
        filterText = _filterConfig2.filterText,
        selected = _filterConfig2.selected;

    return "<button class=\"navSearch-filter-button " + selected + "\" id=\"" + type.value + "\" " + enabled + ">" + filterText + "</button>";
  };

  return "\n    <div class=\"navSearch-nugget-buttons\">\n      <span class=\"navSearch-filter-title\">" + text('nav.search.filterBy', {
    defaultValue: 'Filter by'
  }) + ": </span>\n      " + allResultTypes.map(function (type, index) {
    return renderFilterButtons(type, index);
  }).join('') + "\n      <button id=\"navSearch-filter-buttons-seeAll\" class=\"navSearch-filter-buttons-seeAll\">\n        More Filters " + arrow_down_icon + "\n      </button>\n    </div>\n\n    <div class=\"navSearch-filter-nugget-checkboxes " + (!seeAllNuggetFilters ? 'hidden' : '') + "\">" + allResultTypes.map(function (type, index) {
    return renderFilterCheckboxes(type, index);
  }).join('') + "</div>";
};