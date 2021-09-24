import RESULT_TYPES from 'unified-navigation-ui/deferred/search/const/RESULT_TYPES';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import { capitalize } from 'unified-navigation-ui/utils/capitalize';
import checkbox from '../../templates/icons/search/checkbox';
import { close_icon } from '../../templates/icons/close_icon';
export var dropdownFilterTemplate = function dropdownFilterTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$customObjects = _ref.customObjects,
      customObjects = _ref$customObjects === void 0 ? [] : _ref$customObjects,
      availableResultSections = _ref.availableResultSections,
      selectedResultSections = _ref.selectedResultSections;

  var allResultTypes = Object.values(RESULT_TYPES).filter(function (type) {
    return type !== RESULT_TYPES.RECENTLY_MODIFIED && type !== RESULT_TYPES.RECENTLY_SEARCHED && type !== RESULT_TYPES.CUSTOM_OBJECT;
  }).concat(customObjects).map(function (type) {
    return {
      value: type.toLowerCase(),
      enabled: availableResultSections ? availableResultSections.length > 0 ? availableResultSections.indexOf(type) > -1 : true : false,
      selected: selectedResultSections ? selectedResultSections.indexOf(type) > -1 : false
    };
  }).sort(function (a, b) {
    return a.enabled > b.enabled ? -1 : 1;
  });

  var checkboxes = function checkboxes(type) {
    var label = text("nav.search.headings." + type.value, {
      defaultValue: capitalize(type.value.replace(/_/g, ' '))
    });
    return "<div class=\"navSearch-filter-checkbox " + (type.selected ? 'selected' : '') + " " + (!type.enabled && !type.selected ? 'disabled' : '') + "\"  id=\"" + type.value + "\">\n          <input tabindex=\"0\" type=\"checkbox\"/>\n          <span class=\"checkbox-indicator\">\n            <span class=\"checkbox-check " + (type.selected ? 'selected' : '') + "\">" + checkbox + "</span>\n          </span>\n          <span class=\"checkbox-label\">" + label + "</span>\n        </div>";
  };

  var checkboxFilters = allResultTypes.map(function (type) {
    return "" + checkboxes(type);
  }).join('');
  return checkboxFilters + "<button class=\"close-checkboxes\">" + close_icon + "</button>";
};