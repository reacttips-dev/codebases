import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { headerTemplate } from './headerTemplate';
import { heroTemplate } from './heroTemplate';
import { quickCreateTemplate } from './quickCreateTemplate';
import { emptyStateTemplate } from './emptyStateTemplate';
import { resultSectionTemplate } from './resultSectionTemplate';
import { feedbackModalTemplate } from '../../../html/jsTemplates/search/feedbackModalTemplate';
import { escape } from '../../../js/utils/escape';
import RESULT_TYPES from '../../../js/deferred/search/const/RESULT_TYPES';
import { checkNavColumn } from 'unified-navigation-ui/utils/sidebar';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import { capitalize } from 'unified-navigation-ui/utils/capitalize';
import emptyStateIllustration from '../../templates/icons/search/emptyStateIllustration';

var linkTitle = function linkTitle(_ref) {
  var linkUrl = _ref.linkUrl,
      linkText = _ref.linkText,
      resultId = _ref.resultId,
      resultType = _ref.resultType,
      section = _ref.section;
  return "<a class=\"navSearch-result\" id=\"" + resultType + "-" + resultId + "-" + section + "\" href=\"" + linkUrl + "\">" + escape(linkText) + "</a>";
};

var sectionTemplate = function sectionTemplate(_ref2) {
  var sectionHeader = _ref2.sectionHeader,
      results = _ref2.results;
  return "\n    <div class=\"navSearch-rightColSection\">\n      <h2>" + sectionHeader + "</h2>\n      <ul>\n        " + results.map(function (result) {
    return "\n            <li>\n              " + linkTitle({
      linkUrl: result.url,
      linkText: result.displayText,
      resultType: result.resultType,
      resultId: result.resultId,
      section: result.section
    }) + "\n              " + (result.subText && "<p>" + escape(result.subText) + "</p>") + "\n            </li>";
  }).join('') + "\n      </ul>\n    </div>";
};

var renderMainSectionResults = function renderMainSectionResults(_ref3) {
  var emptyStateVars = _ref3.emptyStateVars,
      resultSections = _ref3.resultSections,
      selectedCategories = _ref3.selectedCategories,
      showSidebar = _ref3.showSidebar,
      seeAllText = _ref3.seeAllText;

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

  if (showSidebar) {
    filteredResultSections = filteredResultSections.filter(function (item) {
      return !checkNavColumn(item);
    });
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

var renderSidebarResults = function renderSidebarResults(sections, helpSection) {
  return "<div class=\"navSearch-rightCol\">\n        " + Object.keys(sections).filter(function (key) {
    return key === RESULT_TYPES.NAVIGATION;
  }).map(function (key) {
    return sectionTemplate(sections[key]);
  }) + "\n        " + (helpSection && helpSection.length > 0 ? sectionTemplate({
    sectionHeader: 'Help',
    results: helpSection
  }) : '') + "\n      </div>";
};

export var layoutTwoColumnTemplate = function layoutTwoColumnTemplate() {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      searchHeader = _ref4.searchHeader,
      spellingCorrectionText = _ref4.spellingCorrectionText,
      isSearchButton = _ref4.isSearchButton,
      checkboxFiltersGated = _ref4.checkboxFiltersGated,
      empty = _ref4.empty,
      hero = _ref4.hero,
      resultSections = _ref4.resultSections,
      _ref4$selectedCategor = _ref4.selectedCategories,
      selectedCategories = _ref4$selectedCategor === void 0 ? [] : _ref4$selectedCategor,
      showCreateActions = _ref4.showCreateActions,
      emptyStateVars = _ref4.emptyStateVars,
      seeAllText = _ref4.seeAllText,
      showSidebar = _ref4.showSidebar;

  if (showSidebar && hero && hero.resultType === RESULT_TYPES.NAVIGATION) {
    if (resultSections.NAVIGATION) {
      resultSections.NAVIGATION.results.unshift(hero);
    } else {
      resultSections.NAVIGATION = {
        sectionHeader: 'Navigation',
        results: [hero]
      };
    }
  }

  var helpSectionResults = showSidebar ? Object.keys(resultSections).filter(checkNavColumn).reduce(function (result, key) {
    if (key !== RESULT_TYPES.NAVIGATION) {
      result.push.apply(result, _toConsumableArray(resultSections[key].results));
    }

    return result;
  }, []) : null;
  return "<div class=\"navSearch-container__inner two-column-layout\">\n    <div class=\"navSearch-modal-container\">" + feedbackModalTemplate() + "</div>\n    <div class=\"navSearch-error\"></div>\n    <div class=\"twoColumnModifier\">\n      " + headerTemplate({
    checkboxFiltersGated: checkboxFiltersGated,
    searchHeader: searchHeader,
    spellingCorrectionText: spellingCorrectionText,
    isSearchButton: isSearchButton,
    selectedCategories: selectedCategories
  }) + "\n    </div>\n    <div class=\"layoutContainer " + (showSidebar ? 'two-cols' : '') + "\">\n      <div class=\"navSearch-container__inner\">\n        <div class=\"navSearch-resultsContainer\">\n          " + (empty ? emptyStateTemplate(Object.assign({}, emptyStateVars)) : "\n                " + (hero ? "<div class=\"navSearch-heroWrapper\">" + heroTemplate(hero) + "</div>" : '') + "\n                " + renderMainSectionResults({
    emptyStateVars: emptyStateVars,
    resultSections: resultSections,
    seeAllText: seeAllText,
    selectedCategories: selectedCategories,
    showSidebar: showSidebar
  }) + "\n                <div class=\"navSearch-scrollLoader\">\n                  <div class=\"loading-dot dot-1\"></div>\n                  <div class=\"loading-dot dot-2\"></div>\n                  <div class=\"loading-dot dot-3\"></div>\n                </div>") + "\n        </div>\n        " + (showSidebar ? renderSidebarResults(resultSections, helpSectionResults) : '') + "\n        " + (!empty && showCreateActions ? quickCreateTemplate(Object.assign({}, emptyStateVars)) : '') + "\n      </div>\n    </div>\n    <div class=\"navSearch-feedback-modal-prompt\">" + text('nav.search.feedback.howUseful', {
    defaultValue: 'How useful are these results?'
  }) + "</div>\n    <div id=\"searchFeedbackWidgetHolder\"></div>\n  </div>";
};