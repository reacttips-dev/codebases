import navQuerySelectorAll from 'unified-navigation-ui/utils/navQuerySelectorAll';
import each from 'unified-navigation-ui/utils/each';
import getCurrentApp from 'unified-navigation-ui/utils/getCurrentApp';
import { NavEventType, addClickTracking, addFocusTracking, addHoverTracking, addNavEventListener } from './navEvent';
import { addHeroClickHandlerNew, addQuickActionClickHandlerNew, addSearchResultClickHandlerNew, addSeeMoreClickHandlerNew, addSearchFilterClickHandler, addNuggetFilterButtonClickHandler, addFeedbackModalButtonClickHandler, navSearchEvent } from './navSearchEvent';
import { setupNavUsageTrackers } from './NavUsageTrackers';
import { isMobile } from 'unified-navigation-ui/utils/eventListeners';
var SEARCH_EXPERIMENTS = ['search:new-ui'];

function mapResultsForAnalytics(paginated, hero, resultSections, resultOffset) {
  var mappedData = {
    resultIds: {},
    results: {}
  };
  var sectionKeys = Object.keys(resultSections);

  for (var categoryIndex = 0; categoryIndex < sectionKeys.length; categoryIndex++) {
    var sectionKey = sectionKeys[categoryIndex];
    mappedData.resultIds[sectionKey] = [];

    for (var i = 0; i < resultSections[sectionKey].results.length; i++) {
      var result = resultSections[sectionKey].results[i];
      var resultId = result.resultType + "-" + result.resultId + "-" + sectionKey.toLowerCase();
      var itemIndex = paginated ? i + resultOffset : i;
      mappedData.resultIds[sectionKey].push(result.resultId);
      mappedData.results[resultId] = {
        category: sectionKey.toLowerCase(),
        categoryIndex: categoryIndex,
        itemIndex: hero && categoryIndex === 0 ? itemIndex + 1 : itemIndex,
        // Increase itemIndex by one if this is the first category and there is a hero
        highlightFields: result.highlightFields
      };
    }
  }

  if (hero) {
    if (Object.prototype.hasOwnProperty.call(mappedData, hero.section)) {
      mappedData.resultIds[hero.section].push(hero.resultId);
    } else {
      mappedData.resultIds[hero.section] = [hero.resultId];
    }

    mappedData.results[hero.resultType + "-" + hero.resultId + "-" + hero.section.toLowerCase() + "-hero"] = {
      category: hero.section.toLowerCase(),
      categoryIndex: 0,
      itemIndex: 0,
      highlightFields: hero.highlightFields
    };
  }

  return mappedData;
}

export default function setupAnalytics(_ref) {
  var userId = _ref.userId,
      userEmail = _ref.userEmail,
      gates = _ref.gates;
  setupNavUsageTrackers(userEmail);
  each(navQuerySelectorAll('button[data-tracking*="click"]'), addClickTracking);
  each(navQuerySelectorAll('a[data-tracking*="click"]'), addClickTracking);
  each(navQuerySelectorAll('a[data-tracking*="hover"]'), addHoverTracking);
  each(navQuerySelectorAll('a[data-tracking*="focus"]'), addFocusTracking);
  each(navQuerySelectorAll('.locked-item'), addHoverTracking);
  each(navQuerySelectorAll('.locked-item-control'), addHoverTracking);
  addNavEventListener(NavEventType.ACCOUNTS, function () {
    each(navQuerySelectorAll('.navAccountSwitcher a[data-tracking*="click"]'), addClickTracking);
  }); // Search analytics

  var nuggetFilterButtonEventSetup = false; // otherwise this button gets analytics handler attached many times

  var experiments = SEARCH_EXPERIMENTS.filter(function (experiment) {
    return gates.indexOf(experiment) > -1;
  });
  addNavEventListener(NavEventType.SEARCH, function (_ref2) {
    var searchEventData = _ref2.detail;

    if (!searchEventData && ['queryIdentifier', 'searchTerm', 'resultSections', 'totalResults'].every(function (prop) {
      return Object.prototype.hasOwnProperty.call(searchEventData, prop);
    })) {
      return;
    }

    var queryIdentifier = searchEventData.queryIdentifier,
        searchTerm = searchEventData.searchTerm,
        paginated = searchEventData.paginated,
        hero = searchEventData.hero,
        resultSections = searchEventData.resultSections,
        resultOffset = searchEventData.resultOffset,
        selectedCategories = searchEventData.selectedCategories,
        totalResults = searchEventData.totalResults;

    var _mapResultsForAnalyti = mapResultsForAnalytics(paginated, hero, resultSections, resultOffset),
        resultIds = _mapResultsForAnalyti.resultIds,
        results = _mapResultsForAnalyti.results;
    /*
    ResultIds = {
      <sectionId>: list of result ids
    }
     results = {
      <resultType-resultId>: {
        category,
        categoryIndex,
        itemIndex,
        highlightFields
      }
    }
    */


    navSearchEvent('navSearchBarInteraction', {
      currentUrl: window.location.pathname,
      currentApp: getCurrentApp(),
      isNewNav: true,
      queryIdentifier: queryIdentifier,
      userId: userId,
      searchTerm: searchTerm,
      mobile: isMobile(),
      totalResults: totalResults,
      results: JSON.stringify(resultIds),
      experiments: experiments
    });
    each(navQuerySelectorAll('.navSearch-v2 .navSearch-hero a.navSearch-underlay-link' + // All non-activity results are themselves the a tag
    ', ' + '.navSearch-v2 .navSearch-hero .navSearch-associatedUrls a' // Activity results have the a tag inside of the result
    ), addHeroClickHandlerNew(gates, userId, searchTerm, {
      queryIdentifier: queryIdentifier,
      totalResults: totalResults,
      results: results
    }, experiments));
    each(navQuerySelectorAll('.navSearch-v2 a.navSearch-result' + ', ' + '.navSearch-v2 .navSearch-result .navSearch-associatedUrls a' // Activity results have the a tag inside of the result
    ), addSearchResultClickHandlerNew(gates, userId, searchTerm, {
      queryIdentifier: queryIdentifier,
      totalResults: totalResults,
      results: results,
      selectedCategories: selectedCategories
    }, experiments));
    each(navQuerySelectorAll('.navSearch-v2 .navSearch-quickActions [data-quick-action-type]'), addQuickActionClickHandlerNew(userId, searchTerm, {
      queryIdentifier: queryIdentifier,
      totalResults: totalResults
    }, experiments));

    if (!paginated) {
      each(navQuerySelectorAll('.navSearch-v2 .navSearch-seeAll'), addSeeMoreClickHandlerNew(gates, userId, searchTerm, {
        queryIdentifier: queryIdentifier,
        totalResults: totalResults,
        selectedCategories: selectedCategories
      }, experiments));
    }

    if (!nuggetFilterButtonEventSetup) {
      each(navQuerySelectorAll('.navSearch-v2 .navSearch-input-button'), addNuggetFilterButtonClickHandler(gates, userId, searchTerm, {
        queryIdentifier: queryIdentifier,
        totalResults: totalResults
      }, experiments));
      nuggetFilterButtonEventSetup = true;
    }

    each(navQuerySelectorAll('.navSearch-v2 .navSearch-filter-checkbox' + ', ' + '.navSearch-v2 .navSearch-filter-button'), addSearchFilterClickHandler(gates, userId, searchTerm, {
      queryIdentifier: queryIdentifier,
      totalResults: totalResults
    }, experiments));
    each(navQuerySelectorAll('.navSearch-v2 .navSearch-feedback-modal-prompt' + ', ' + '.navSearch-v2 .navSearch-modal-send'), addFeedbackModalButtonClickHandler(gates, userId, searchTerm, {
      queryIdentifier: queryIdentifier,
      totalResults: totalResults,
      selectedCategories: selectedCategories
    }, experiments));
  });
}