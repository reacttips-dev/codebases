import navQuerySelector from 'unified-navigation-ui/utils/navQuerySelector';
import getCurrentApp from 'unified-navigation-ui/utils/getCurrentApp';
import { getNavLinkUsageTracker, getNavUsageTracker } from './NavUsageTrackers';
import { isMobile } from 'unified-navigation-ui/utils/eventListeners';
import RESULT_TYPES from 'unified-navigation-ui/deferred/search/const/RESULT_TYPES';
var RECENTLY_MODIFIED = RESULT_TYPES.RECENTLY_MODIFIED,
    RECENTLY_SEARCHED = RESULT_TYPES.RECENTLY_SEARCHED;

function determineUngatedFilter(gates) {
  return gates.indexOf('search:nugget-filters') > -1 ? 'nuggets' : gates.indexOf('search:checkbox-filters') > -1 ? 'checkboxes' : '';
}

export var NavSearchEventType = {
  SEARCHED: 'SEARCHED',
  CLICKED_HERO: 'CLICKED_HERO',
  CLICKED_RESULT: 'CLICKED_RESULT',
  CLICKED_SEE_MORE: 'CLICKED_SEE_MORE',
  CLICKED_RECENT_SEARCH: 'CLICKED_RECENT_SEARCH',
  CLICKED_RECENTLY_MODIFIED: 'CLICKED_RECENTLY_MODIFIED',
  CLICKED_FEEDBACK_MODAL_PROMPT: 'CLICKED_FEEDBACK_MODAL_PROMPT',
  CLICKED_FEEDBACK_MODAL_SEND: 'CLICKED_FEEDBACK_MODAL_SEND'
};
export function navSearchEvent(eventType, eventInfo) {
  var NavUsageTracker = getNavUsageTracker();

  if (!NavUsageTracker) {
    // Usage Tracking Client failed to be created
    return;
  }

  NavUsageTracker.track(eventType, eventInfo);
}

function navLinkSearchEvent(eventType, eventInfo) {
  var NavLinkUsageTracker = getNavLinkUsageTracker();

  if (!NavLinkUsageTracker) {
    // Usage Tracking Client failed to be created
    return;
  }

  NavLinkUsageTracker.track(eventType, eventInfo);
}

export function addSearchResultClickHandler(userId, queryIdentifier, experiments) {
  return function (element) {
    element.addEventListener('click', function () {
      var resultElement = element.parentElement;
      var categoryElement = resultElement.parentElement.parentElement;
      var eventType = NavSearchEventType.CLICKED_RESULT;

      if (categoryElement.id === 'recently_searched') {
        eventType = NavSearchEventType.CLICKED_RECENT_SEARCH;
      } else if (categoryElement.id === 'recently_modified') {
        eventType = NavSearchEventType.CLICKED_RECENTLY_MODIFIED;
      }

      navLinkSearchEvent('navSearchResultsInteraction', {
        queryIdentifier: queryIdentifier,
        eventType: eventType,
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        isNewNav: true,
        destinationUrl: element.getAttribute('href') || '',
        userId: userId,
        searchTerm: navQuerySelector('#navSearch-input').value,
        isHero: false,
        category: categoryElement.id || '',
        categoryIndex: parseInt(categoryElement.getAttribute('data-index'), 10),
        itemIndex: parseInt(resultElement.getAttribute('data-index'), 10),
        highlightFields: element.getAttribute('data-highlight-fields').split(',') || [],
        totalResults: parseInt(navQuerySelector('#navSearch-resultsWrapper').getAttribute('data-total'), 10),
        mobile: isMobile(),
        experiments: experiments
      });
    });
  };
}
export function addSeeMoreClickHandler(userId, queryIdentifier, experiments) {
  return function (element) {
    element.addEventListener('click', function () {
      var categoryElement = element.parentElement;
      navLinkSearchEvent('navSearchResultsInteraction', {
        queryIdentifier: queryIdentifier,
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        isNewNav: true,
        destinationUrl: element.getAttribute('href') || '',
        eventType: NavSearchEventType.CLICKED_SEE_MORE,
        userId: userId,
        searchTerm: navQuerySelector('#navSearch-input').value,
        isHero: false,
        category: categoryElement.id || '',
        categoryIndex: parseInt(categoryElement.getAttribute('data-index'), 10),
        itemIndex: NaN,
        highlightFields: [],
        totalResults: parseInt(navQuerySelector('#navSearch-resultsWrapper').getAttribute('data-total'), 10),
        mobile: isMobile(),
        experiments: experiments
      });
    });
  };
}
export function addQuickActionClickHandler(userId, queryIdentifier) {
  return function (element) {
    element.addEventListener('click', function () {
      navLinkSearchEvent('navSearchQuickLinksInteraction', {
        queryIdentifier: queryIdentifier,
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        isNewNav: true,
        destinationUrl: element.getAttribute('href') || '',
        userId: userId,
        searchTerm: navQuerySelector('#navSearch-input').value,
        totalResults: parseInt(navQuerySelector('#navSearch-resultsWrapper').getAttribute('data-total'), 10),
        mobile: isMobile()
      });
    });
  };
}
export function addSearchResultClickHandlerNew(gates, userId, searchTerm, _ref, experiments) {
  var queryIdentifier = _ref.queryIdentifier,
      totalResults = _ref.totalResults,
      results = _ref.results,
      selectedCategories = _ref.selectedCategories;
  return function (element) {
    // Activities have ids that look like "ACTIVITY-ba1ceb7c-activitylink" and we're slicing off that -activitylink
    var elementId = element.id.replace('-activitylink', '');

    if (!Object.prototype.hasOwnProperty.call(results, elementId)) {
      return;
    }

    var resultData = results[elementId];
    element.addEventListener('click', function () {
      var eventType = NavSearchEventType.CLICKED_RESULT;

      if (resultData.category.toUpperCase() === RECENTLY_SEARCHED) {
        eventType = NavSearchEventType.CLICKED_RECENT_SEARCH;
      } else if (resultData.category.toUpperCase() === RECENTLY_MODIFIED) {
        eventType = NavSearchEventType.CLICKED_RECENTLY_MODIFIED;
      }

      navLinkSearchEvent('navSearchResultsInteraction', {
        queryIdentifier: queryIdentifier,
        eventType: eventType,
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        isNewNav: true,
        destinationUrl: element.getAttribute('href') || '',
        userId: userId,
        searchTerm: searchTerm,
        isHero: false,
        isTwoColumn: gates.indexOf('search:two-column') > -1,
        category: resultData.category,
        categoryIndex: resultData.categoryIndex,
        itemIndex: resultData.itemIndex,
        highlightFields: resultData.highlightFields || [],
        totalResults: totalResults,
        mobile: isMobile(),
        experiments: experiments,
        filtersApplied: selectedCategories,
        ungatedFilter: determineUngatedFilter(gates)
      });
    });
  };
}
export function addHeroClickHandlerNew(gates, userId, searchTerm, _ref2, experiments) {
  var queryIdentifier = _ref2.queryIdentifier,
      totalResults = _ref2.totalResults,
      results = _ref2.results;
  return function (element) {
    // Activities have ids that look like "ACTIVITY-ba1ceb7c-activitylink" and we're slicing off that -activitylink
    var elementId = element.id.replace('-activitylink', '');

    if (!Object.prototype.hasOwnProperty.call(results, elementId)) {
      return;
    }

    var resultData = results[elementId];
    element.addEventListener('click', function () {
      navLinkSearchEvent('navSearchResultsInteraction', {
        queryIdentifier: queryIdentifier,
        eventType: NavSearchEventType.CLICKED_HERO,
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        isNewNav: true,
        destinationUrl: element.getAttribute('href') || '',
        userId: userId,
        searchTerm: searchTerm,
        isHero: true,
        isTwoColumn: gates.indexOf('search:two-column') > -1,
        category: resultData.category,
        categoryIndex: resultData.categoryIndex,
        itemIndex: resultData.itemIndex,
        highlightFields: resultData.highlightFields || [],
        totalResults: totalResults,
        mobile: isMobile(),
        experiments: experiments,
        filtersApplied: [],
        ungatedFilter: determineUngatedFilter(gates)
      });
    });
  };
}
export function addSeeMoreClickHandlerNew(gates, userId, searchTerm, _ref3, experiments) {
  var queryIdentifier = _ref3.queryIdentifier,
      selectedCategories = _ref3.selectedCategories,
      totalResults = _ref3.totalResults;
  return function (element) {
    element.addEventListener('click', function () {
      navLinkSearchEvent('navSearchResultsInteraction', {
        queryIdentifier: queryIdentifier,
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        isNewNav: true,
        destinationUrl: element.getAttribute('href') || '',
        eventType: NavSearchEventType.CLICKED_SEE_MORE,
        userId: userId,
        searchTerm: searchTerm,
        isHero: false,
        isTwoColumn: gates.indexOf('search:two-column') > -1,
        category: element.dataset['section'].toLowerCase(),
        categoryIndex: parseInt(element.dataset['index'], 10),
        itemIndex: NaN,
        highlightFields: [],
        totalResults: totalResults,
        mobile: isMobile(),
        experiments: experiments,
        filtersApplied: selectedCategories,
        ungatedFilter: determineUngatedFilter(gates)
      });
    });
  };
}
export function addQuickActionClickHandlerNew(userId, searchTerm, _ref4, experiments) {
  var queryIdentifier = _ref4.queryIdentifier,
      totalResults = _ref4.totalResults;
  return function (element) {
    element.addEventListener('click', function () {
      navLinkSearchEvent('navSearchQuickLinksInteraction', {
        queryIdentifier: queryIdentifier,
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        isNewNav: true,
        destinationUrl: element.getAttribute('href') || '',
        userId: userId,
        searchTerm: searchTerm,
        quickActionType: element.dataset['quickActionType'],
        totalResults: totalResults,
        mobile: isMobile(),
        experiments: experiments
      });
    });
  };
}
export function addSearchFilterClickHandler(gates, userId, searchTerm, _ref5, experiments) {
  var queryIdentifier = _ref5.queryIdentifier,
      totalResults = _ref5.totalResults;
  return function (element) {
    var selected = !element.classList.contains('selected');
    var elementId = element.id;
    element.addEventListener('click', function () {
      navLinkSearchEvent('navSearchFiltersInteraction', {
        category: elementId,
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        deselectedAll: false,
        experiments: experiments,
        isNewNav: true,
        isTwoColumn: gates.indexOf('search:two-column') > -1,
        mobile: isMobile(),
        queryIdentifier: queryIdentifier,
        searchTerm: searchTerm,
        selected: selected,
        totalResults: totalResults,
        userId: userId,
        ungatedFilter: determineUngatedFilter(gates)
      });
    });
  };
}
export function addNuggetFilterButtonClickHandler(gates, userId, searchTerm, _ref6, experiments) {
  var queryIdentifier = _ref6.queryIdentifier,
      totalResults = _ref6.totalResults;
  return function (element) {
    element.addEventListener('click', function () {
      navLinkSearchEvent('navSearchFiltersInteraction', {
        category: '',
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        deselectedAll: true,
        experiments: experiments,
        isNewNav: true,
        isTwoColumn: gates.indexOf('search:two-column') > -1,
        mobile: isMobile(),
        queryIdentifier: queryIdentifier,
        searchTerm: searchTerm,
        selected: false,
        totalResults: totalResults,
        userId: userId,
        ungatedFilter: determineUngatedFilter(gates)
      });
    });
  };
}
export function addFeedbackModalButtonClickHandler(gates, userId, searchTerm, _ref7, experiments) {
  var queryIdentifier = _ref7.queryIdentifier,
      totalResults = _ref7.totalResults,
      selectedCategories = _ref7.selectedCategories;
  return function (element) {
    element.addEventListener('click', function () {
      var eventType = element.classList.contains('navSearch-feedback-modal-prompt') ? NavSearchEventType.CLICKED_FEEDBACK_MODAL_PROMPT : NavSearchEventType.CLICKED_FEEDBACK_MODAL_SEND;
      navLinkSearchEvent('navSearchFeedbackModalInteraction', {
        currentUrl: window.location.pathname,
        currentApp: getCurrentApp(),
        eventType: eventType,
        experiments: experiments,
        filtersApplied: selectedCategories,
        isTwoColumn: gates.indexOf('search:two-column') > -1,
        mobile: isMobile(),
        queryIdentifier: queryIdentifier,
        searchTerm: searchTerm,
        totalResults: totalResults,
        userId: userId,
        ungatedFilter: determineUngatedFilter(gates)
      });
    });
  };
}