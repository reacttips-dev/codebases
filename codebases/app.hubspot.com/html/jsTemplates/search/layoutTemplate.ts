import { headerTemplate } from './headerTemplate';
import { heroTemplate } from './heroTemplate';
import { quickCreateTemplate } from './quickCreateTemplate';
import { emptyStateTemplate } from './emptyStateTemplate';
import { resultSectionTemplate } from './resultSectionTemplate';
import { feedbackModalTemplate } from '../../../html/jsTemplates/search/feedbackModalTemplate';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import { capitalize } from 'unified-navigation-ui/utils/capitalize';
import emptyStateIllustration from '../../templates/icons/search/emptyStateIllustration';

var renderMainSectionResults = function renderMainSectionResults(_ref) {
  var emptyStateVars = _ref.emptyStateVars,
      resultSections = _ref.resultSections,
      seeAllText = _ref.seeAllText,
      _ref$selectedCategori = _ref.selectedCategories,
      selectedCategories = _ref$selectedCategori === void 0 ? [] : _ref$selectedCategori;

  if (!resultSections) {
    return '';
  }

  var filteredResultSections = [];
  var emptyResultSections = [];

  if (selectedCategories.length > 0) {
    filteredResultSections = Object.keys(resultSections).filter(function (section) {
      return selectedCategories.indexOf(section) > -1;
    });
    emptyResultSections = selectedCategories.filter(function (category) {
      return filteredResultSections.indexOf(category) === -1;
    }).map(function (section) {
      return "\n        " + text("nav.search.headings." + section, {
        defaultValue: capitalize(section.toLowerCase().replace(/_/g, ' '))
      });
    });
  } else {
    filteredResultSections = Object.keys(resultSections);
  }

  if (selectedCategories.length > 0 && filteredResultSections.length === 0) {
    return emptyStateTemplate(Object.assign({}, emptyStateVars, {
      isFiltered: true
    }));
  }

  return "\n    " + filteredResultSections.map(function (section) {
    return resultSectionTemplate(Object.assign({
      seeAllText: seeAllText,
      sectionId: section
    }, resultSections[section]));
  }).join('') + "\n    " + (emptyResultSections.length > 0 ? "<h2>" + emptyResultSections.join(', ') + "</h2>\n          <div class=\"navSearch-emptyState-section\">\n            " + emptyStateIllustration + "\n            " + text("nav.search.noFilteredResultCategories." + (emptyResultSections.length === 1 ? 'one' : 'other'), {
    defaultValue: "No results found in " + emptyResultSections.join(' or ') + "."
  }) + "\n          </div>" : '');
};

export var layoutTemplate = function layoutTemplate() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      searchHeader = _ref2.searchHeader,
      spellingCorrectionText = _ref2.spellingCorrectionText,
      isSearchButton = _ref2.isSearchButton,
      checkboxFiltersGated = _ref2.checkboxFiltersGated,
      empty = _ref2.empty,
      hero = _ref2.hero,
      resultSections = _ref2.resultSections,
      _ref2$selectedCategor = _ref2.selectedCategories,
      selectedCategories = _ref2$selectedCategor === void 0 ? [] : _ref2$selectedCategor,
      showCreateActions = _ref2.showCreateActions,
      emptyStateVars = _ref2.emptyStateVars,
      seeAllText = _ref2.seeAllText;

  return "<div class=\"navSearch-container__inner\">\n  <div class=\"navSearch-modal-container\">" + feedbackModalTemplate() + "</div>\n  <div class=\"navSearch-error\"></div>\n  " + headerTemplate({
    checkboxFiltersGated: checkboxFiltersGated,
    searchHeader: searchHeader,
    spellingCorrectionText: spellingCorrectionText,
    isSearchButton: isSearchButton,
    selectedCategories: selectedCategories
  }) + "\n  <div class=\"navSearch-resultsContainer\">\n    " + (empty ? emptyStateTemplate(Object.assign({}, emptyStateVars)) : "\n      " + (hero ? "<div class=\"navSearch-heroWrapper\">" + heroTemplate(hero) + "</div>" : '') + "\n      " + renderMainSectionResults({
    emptyStateVars: emptyStateVars,
    resultSections: resultSections,
    seeAllText: seeAllText,
    selectedCategories: selectedCategories
  }) + "\n\n    <div class=\"navSearch-scrollLoader\">\n      <div class=\"loading-dot dot-1\"></div>\n      <div class=\"loading-dot dot-2\"></div>\n      <div class=\"loading-dot dot-3\"></div>\n    </div>") + "\n  </div>\n  " + (!empty && showCreateActions ? quickCreateTemplate(Object.assign({}, emptyStateVars)) : '') + "\n  <div class=\"navSearch-feedback-modal-prompt\">" + text('nav.search.feedback.howUseful', {
    defaultValue: 'How useful are these results?'
  }) + "</div>\n  <div id=\"searchFeedbackWidgetHolder\"></div>\n</div>\n";
};