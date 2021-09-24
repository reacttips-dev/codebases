import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

/* eslint no-use-before-define: ["error", { "functions": false }] */
import { NavEventType, dispatchNavEvent } from 'unified-navigation-ui/deferred/analytics/navEvent';
import navQuerySelector from 'unified-navigation-ui/utils/navQuerySelector';
import navQuerySelectorAll from 'unified-navigation-ui/utils/navQuerySelectorAll';
import isNavAncestor from 'unified-navigation-ui/utils/isNavAncestor';
import closeIcon from 'bender-url!unified-navigation-ui/html/templates/icons/search/close_icon.svg';
import emptyStateIllo from 'bender-url!unified-navigation-ui/html/templates/icons/search/empty_state_illo.svg';
import transform from './transform';
import RESULT_TYPES from './const/RESULT_TYPES';
import Views from './Views';
import * as SearchAPI from './SearchAPI';
import { getQueryParam, updateQueryParam } from 'unified-navigation-ui/utils/queryParamHelpers';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import debounce from 'hs-lodash/debounce';
import { resultCardTemplate } from '../../../html/jsTemplates/search/resultCardTemplate';
import { recentTemplate } from '../../../html/jsTemplates/search/recentTemplate';
import { layoutTwoColumnTemplate } from '../../../html/jsTemplates/search/layoutTwoColumnTemplate';
import { layoutTemplate } from '../../../html/jsTemplates/search/layoutTemplate';
import { escape } from '../../utils/escape';
import * as tempStorage from 'unified-navigation-ui/utils/tempStorage';
import { get, set } from 'unified-navigation-ui/js/utils/tempStorage';
import sendRecentFeedback from 'unified-navigation-ui/utils/sendRecentFeedback';
import * as checkboxFilters from './checkboxFilters';
import { nuggetFilterTemplate } from '../../../html/jsTemplates/search/nuggetFilterTemplate';
import * as feedbackModal from './feedbackModal';
import html2canvas from 'unified-navigation-ui/js/libraries/html2canvas';
var GLOBAL_SEARCH_QUERY_PARAM = 'globalSearchQuery';
var GLOBAL_SEARCH_FILTER_QUERY_PARAM = 'searchFilters';
var SCROLL_TO_TRIGGER_PAGE = 200;
var RESULTS_PER_PAGE = 30; // Cached values

var searchParent; // .navSearch-v2

var searchInput; // .navSearch-v2 .navSearch-input

var searchContainer; // .navSearch-v2 .navSearch-container

var searchNuggetFilters;
var filterCheckboxContainer;
var canShowCreateActions = true;
var shouldFetchRecents = true;
var debounceSearchTimeout;
var recents = {}; // State variables

var resetTimeout = false;
var currentQuery;
var currentView = Views.RECENTS;
var viewAllState = {
  queryIdentifier: null,
  sectionId: null,
  offset: 0
};
var gates = [];
var scopes = [];
var feedbackEmail = '';
var feedbackUserId = '';
var rez;
var isFilteredSearch = false;
var seeAllNuggetFilters = false;
var utterances = [];
var resultSectionKeys = [];
var selectedCategories = [];
var customObjects = [];
var screenshot = '';

function getCanShowCreateActions(scopeList) {
  return scopeList.indexOf('bet-contact-creation-flow-access') === -1 && scopeList.some(function (scope) {
    return ['crm-edit-all', 'crm-edit-team-owned', 'crm-edit-unassigned', 'contacts-write'].indexOf(scope) !== -1;
  });
}

export function navigationOverrideHandler(evt) {
  if (window.hubspot.navigation.searchResultListener && typeof window.hubspot.navigation.searchResultListener === 'function') {
    if (!(evt.metaKey || evt.ctrlKey)) {
      closeSearch();
    }

    window.hubspot.navigation.searchResultListener(evt);
  }
}
export function resultClickHandler(_ref, evt) {
  var result = _ref.result,
      correlationId = _ref.correlationId,
      isTwoColumn = _ref.isTwoColumn,
      sectionIds = _ref.sectionIds;
  var canGetObjectName = result.resultType === RESULT_TYPES.CUSTOM_OBJECT;
  var objectName = canGetObjectName ? [RESULT_TYPES.RECENTLY_MODIFIED, RESULT_TYPES.RECENTLY_SEARCHED].indexOf(result.section.toUpperCase()) > -1 ? result.properties.pluralForm.toUpperCase() : result.section.toUpperCase() : null;
  var recentSearch = {
    resultId: result.resultId,
    resultType: result.resultType,
    properties: result.properties,
    objectName: objectName,
    url: result.url,
    correlationId: correlationId,
    isTwoColumn: isTwoColumn,
    query: currentQuery,
    displayedTypes: sectionIds
  };
  var storedRecentSearch = get('recent_search') ? JSON.parse(get('recent_search')) : undefined;

  if (storedRecentSearch && Array.isArray(storedRecentSearch)) {
    storedRecentSearch.push(recentSearch);
    set('recent_search', JSON.stringify(storedRecentSearch));
  } else {
    set('recent_search', JSON.stringify([recentSearch]));
  }

  setTimeout(sendRecentFeedback, 3000);
  navigationOverrideHandler(evt);
}
export function resultFeedbackClickHandler(_ref2) {
  var correlationId = _ref2.correlationId,
      queryResults = _ref2.queryResults;
  var fullSearchResultsContainer = searchParent.querySelector('.navSearch-container__inner');
  html2canvas(fullSearchResultsContainer).then(function (canvas) {
    screenshot = canvas.toDataURL().replace('data:image/png;base64,', '');
    feedbackModal.render({
      correlationId: correlationId,
      gates: gates,
      maxScrollDepth: searchContainer.scrollTop,
      query: currentQuery,
      queryResults: queryResults,
      scopes: scopes,
      screenshot: screenshot,
      userId: feedbackUserId
    });
  });
}
export function feedbackHandler() {
  currentView = Views.FEEDBACK;
  var query = currentQuery;
  currentQuery = null;
  keyHandler({
    evt: {
      target: {
        value: query
      }
    }
  });
}
export function feedbackBackHandler(evt) {
  currentView = Views.ALL_CATEGORIES;
  currentQuery = null;
  keyHandler({
    evt: evt
  });
}
export function seeMoreHandler(_ref3) {
  var sectionId = _ref3.sectionId,
      responseSection = _ref3.responseSection;

  if (!currentQuery) {
    return;
  }

  if (gates.indexOf('search:nugget-filters') > -1) {
    removeNuggetCategoryFilters();
    resultSectionKeys = [];
  }

  if (gates.indexOf('search:checkbox-filters') > -1) {
    checkboxFilters.remove(customObjects);
    resultSectionKeys = [];
    searchInput.classList.remove('filters-applied');
  }

  isFilteredSearch = false;
  selectedCategories = [];
  currentView = Views.VIEW_ALL;
  var query = currentQuery;
  currentQuery = null;
  viewAllState.sectionId = sectionId;
  keyHandler({
    evt: {
      target: {
        value: query
      }
    },
    responseSection: responseSection,
    types: [viewAllState.sectionId]
  });
}
var debouncedScrollHandler = debounce(scrollHandler, 100);

function scrollHandler(evt) {
  var res = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : rez;
  var _evt$target = evt.target,
      scrollHeight = _evt$target.scrollHeight,
      clientHeight = _evt$target.clientHeight,
      scrollTop = _evt$target.scrollTop;
  var scrollRemaining = scrollHeight - clientHeight - scrollTop;

  if (scrollRemaining <= SCROLL_TO_TRIGGER_PAGE) {
    var _viewAllState = viewAllState,
        queryIdentifier = _viewAllState.queryIdentifier,
        sectionId = _viewAllState.sectionId,
        offset = _viewAllState.offset;
    var query = currentQuery;
    searchContainer.removeEventListener('scroll', debouncedScrollHandler);
    searchParent.classList.add('loading-more');
    var rezSection = res && res.sectionResults && res.sectionResults[viewAllState.sectionId || ''];
    SearchAPI.search({
      query: query,
      types: [sectionId] || [],
      offset: offset,
      offsetA: rezSection.nextOffsetA,
      offsetB: rezSection.nextOffsetB,
      limit: RESULTS_PER_PAGE
    }, function (response) {
      // Multiple searches in progress, dropping some results
      if (currentQuery !== query) {
        return;
      }

      var _transform = transform(response, {}, gates),
          resultSections = _transform.resultSections,
          totalResults = _transform.totalResults,
          listeners = _transform.listeners;

      var resultSection = resultSections[sectionId || ''];

      if (resultSection) {
        var newResultElements = '';

        for (var i = 0; i < resultSection.results.length; i++) {
          newResultElements += resultCardTemplate(resultSection.results[i]);
        }

        searchContainer.querySelector("#" + sectionId + ".navSearch-resultSection .navSearch-results").insertAdjacentHTML('beforeend', newResultElements);

        if (resultSection.hasMore) {
          searchContainer.addEventListener('scroll', debouncedScrollHandler);
        }
      }

      searchParent.classList.remove('loading-more');
      viewAllState.offset += totalResults;
      addListeners(listeners);
      dispatchNavEvent(NavEventType.SEARCH, {
        queryIdentifier: queryIdentifier,
        searchTerm: query,
        paginated: true,
        resultSections: resultSections,
        resultOffset: offset,
        selectedCategories: selectedCategories,
        totalResults: offset + totalResults
      });
    });
  }
}

function addListeners(listeners) {
  return listeners && listeners.map(function (obj) {
    var target = obj.target,
        listener = obj.listener;

    if (!target.match(/:/)) {
      var element = navQuerySelector(target);

      if (element) {
        element.addEventListener('click', listener);
      }
    }

    return obj;
  });
}

function addQuickActionListeners() {
  var globalQuickActions = [].slice.call(navQuerySelectorAll('.navSearch-v2 .navSearch-resultsContainer > .navSearch-quickActions a'));

  if (globalQuickActions) {
    globalQuickActions.map(function (button) {
      button.addEventListener('click', function (evt) {
        navigationOverrideHandler(evt);
      });
      return button;
    });
  }
}

function addCloseListener() {
  var closeSearchButton = navQuerySelector('.navSearch-v2 .navSearch-container .closeSearch');
  closeSearchButton.addEventListener('click', closeSearch);
}

var addSpellcheckListener = function addSpellcheckListener(spellCorrection) {
  var spellCheckbutton = navQuerySelector('.navSearch-v2 .navSearch-container .spellCheck');

  if (spellCheckbutton !== null) {
    spellCheckbutton.addEventListener('click', function () {
      spellCheckClick(spellCorrection);
    });
  }
};

function utteranceTextResize() {
  utterances.forEach(function (utterance) {
    var utteranceText = utterance.text.substring(0, 200);
    utterance.node.innerHTML = utteranceText;

    while (utterance.node.scrollHeight > utterance.node.offsetHeight) {
      utterance.node.innerHTML = utterance.node.innerText.slice(0, -1);
    }
  });
}

function renderNuggetCategoryFilters() {
  var navHeader = document.querySelector('.navSearch-header');

  if (navHeader) {
    navHeader.classList.add('filters');
  }

  searchNuggetFilters.innerHTML = nuggetFilterTemplate({
    seeAllNuggetFilters: seeAllNuggetFilters,
    availableResultSections: resultSectionKeys,
    selectedResultSections: selectedCategories
  });
  addNuggetFilterButtonListener(selectedCategories);
  addSeeAllNuggetFiltersListener();
  handleMoreFiltersHighlight();
}

function handleMoreFiltersHighlight() {
  var seeAllButton = navQuerySelector('.navSearch-filter-buttons-seeAll');
  var filterCheckboxes = [].slice.call(document.querySelectorAll('.navSearch-filter-checkbox'));

  if (filterCheckboxes.some(function (checkbox) {
    return checkbox.classList.contains('selected');
  })) {
    seeAllButton.classList.add('selected');
  }
}

function removeNuggetCategoryFilters() {
  var filterNuggetCheckboxContainer = document.querySelector('.navSearch-filter-nugget-checkboxes');
  filterNuggetCheckboxContainer.classList.add('hidden');
  seeAllNuggetFilters = false;
  var navHeader = document.querySelector('.navSearch-header');

  if (navHeader) {
    navHeader.classList.remove('filters');
  }

  var inputButton = document.querySelector('.navSearch-input-button');

  if (inputButton) {
    inputButton.classList.add('hidden');
    searchInput.classList.remove('nuggets-filtered');
  }

  isFilteredSearch = false;
  selectedCategories = [];
  resultSectionKeys = [];
}

function clearNuggetFilters() {
  removeNuggetCategoryFilters();
  keyHandler({
    evt: {
      target: {
        value: searchInput.value
      }
    },
    types: []
  });
}

function addNuggetFilterCounterListener() {
  var inputButton = document.querySelector('.navSearch-input-button');
  inputButton.addEventListener('click', clearNuggetFilters);
}

function renderNuggetFilterCounter(inputButton, types) {
  currentView = Views.VIEW_ALL;
  isFilteredSearch = true;
  searchInput.classList.add('nuggets-filtered');
  inputButton.classList.remove('hidden');
  inputButton.innerHTML = text('nav.search.filterCount', {
    filterCount: types.length,
    defaultValue: "Filters: " + types.length
  }) + " x";
  inputButton.removeEventListener('click', clearNuggetFilters);
  addNuggetFilterCounterListener();
}

function addNuggetFilterButtonListener() {
  var categoryFilters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var types = categoryFilters;
  var filterButtons = [].slice.call(document.querySelectorAll('.navSearch-filter-button'));
  var filterCheckboxes = [].slice.call(document.querySelectorAll('.navSearch-filter-checkbox'));
  var inputButton = document.querySelector('.navSearch-input-button');

  if (types.length > 0) {
    renderNuggetFilterCounter(inputButton, types);
  }

  var allFilters = filterButtons.concat(filterCheckboxes);

  _toConsumableArray(allFilters).forEach(function (button) {
    if (!button.classList.contains('disabled')) {
      button.addEventListener('click', function () {
        var fill = button.querySelector('.checkbox-check');

        if (types.indexOf(button.id.toUpperCase()) > -1) {
          if (fill) {
            fill.classList.remove('selected');
          }

          types = types.filter(function (type) {
            return type !== button.id.toUpperCase();
          });

          if (types.length === 0) {
            clearNuggetFilters();
          } else {
            inputButton.innerHTML = text('nav.search.filterCount', {
              filterCount: types.length,
              defaultValue: "Filters: " + types.length
            }) + " x";
            keyHandler({
              evt: {
                target: {
                  value: searchInput.value
                }
              },
              types: types
            });
          }
        } else {
          if (fill) {
            fill.classList.add('selected');
          }

          types.push(button.id.toUpperCase());
          renderNuggetFilterCounter(inputButton, types);
          keyHandler({
            evt: {
              target: {
                value: searchInput.value
              }
            },
            types: types
          });
        }
      });
    }
  });
}

function addSeeAllNuggetFiltersListener() {
  var filterNuggetCheckboxContainer = document.querySelector('.navSearch-filter-nugget-checkboxes');
  var seeAllButton = navQuerySelector('.navSearch-filter-buttons-seeAll');
  seeAllButton.addEventListener('click', function () {
    if (seeAllNuggetFilters === true) {
      filterNuggetCheckboxContainer.classList.add('hidden');
      seeAllNuggetFilters = false;
    } else {
      filterNuggetCheckboxContainer.classList.remove('hidden');
      seeAllNuggetFilters = true;
    }
  });
}

function renderCheckboxFilterCounter(filterCounter, types) {
  currentView = Views.VIEW_ALL;
  isFilteredSearch = true;
  filterCounter.innerHTML = "(" + types.length + ")";
  searchInput.classList.add('filters-applied');
}

function addFilterCheckboxesListener() {
  var categoryFilters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var types = categoryFilters;
  var filterCheckboxes = filterCheckboxContainer.querySelectorAll('.navSearch-filter-checkbox');
  var filterCounter = searchParent.querySelector('.navSearch-filter-counter');

  if (types.length > 0) {
    renderCheckboxFilterCounter(filterCounter, types);
  }

  _toConsumableArray(filterCheckboxes).forEach(function (checkbox) {
    if (!checkbox.classList.contains('disabled')) {
      checkbox.addEventListener('click', function () {
        var fill = checkbox.querySelector('.checkbox-check');

        if (fill) {
          if (types.indexOf(checkbox.id.toUpperCase()) > -1) {
            fill.classList.remove('selected');
            types = types.filter(function (type) {
              return type !== checkbox.id.toUpperCase();
            });
            filterCounter.innerHTML = "(" + types.length + ")";
            searchInput.classList.add('filters-applied');

            if (types.length === 0) {
              filterCounter.innerHTML = '';
              isFilteredSearch = false;
              viewAllState.sectionId = null;
              searchInput.classList.remove('filters-applied');
            }

            keyHandler({
              evt: {
                target: {
                  value: searchInput.value
                }
              },
              types: types
            });
          } else {
            fill.classList.add('selected');
            renderCheckboxFilterCounter(filterCounter, types);
            types.push(checkbox.id.toUpperCase());
            keyHandler({
              evt: {
                target: {
                  value: searchInput.value
                }
              },
              types: types
            });
          }
        }
      });
    }
  });
}

function keyHandler(_ref4) {
  var evt = _ref4.evt,
      responseSection = _ref4.responseSection,
      _ref4$types = _ref4.types,
      types = _ref4$types === void 0 ? [] : _ref4$types;
  var query = evt.target.value.replace(/^\s+/, ''); // Ignore leading spaces in queries

  var wasCorrected = evt.target.wasCorrected;

  if (query === currentQuery && !isFilteredSearch && types === selectedCategories) {
    return;
  }

  searchContainer.removeEventListener('scroll', debouncedScrollHandler);
  selectedCategories = types;
  currentQuery = query;

  if (query.length < 2) {
    // Show recents
    resultSectionKeys = [];

    if (gates.indexOf('search:checkbox-filters') > -1) {
      checkboxFilters.render(customObjects, resultSectionKeys, selectedCategories);
      addFilterCheckboxesListener(selectedCategories);
      checkboxFilters.addHeaderButtonListeners();
    }

    updateQueryParam(GLOBAL_SEARCH_QUERY_PARAM);
    updateQueryParam(GLOBAL_SEARCH_FILTER_QUERY_PARAM, selectedCategories.toString());
    currentView = Views.RECENTS;
    var searchHeader = text('nav.search.searchHeader.empty');
    var showCreateActions = canShowCreateActions;

    if (document.activeElement !== searchInput) {
      searchInput.focus();
    }

    if (shouldFetchRecents) {
      // Fetch recents
      searchParent.classList.add('loading');
      searchParent.querySelector('.navSearch-headerText').innerHTML = escape(searchHeader);
      SearchAPI.getRecents(function (response) {
        shouldFetchRecents = false;
        setTimeout(function () {
          return shouldFetchRecents = true;
        }, 60000); // Refetch recents after a minute

        var res = {
          RECENTLY_SEARCHED: {
            results: _toConsumableArray(response.recentSearch)
          },
          RECENTLY_MODIFIED: {
            results: _toConsumableArray(response.modifiedSearch)
          }
        };
        recents = Object.assign({}, transform(res, {
          maxResultsPerSection: 5
        }, gates)); // Drops results into cache if search in progress

        if (currentQuery !== query) {
          return;
        }

        searchContainer.innerHTML = recentTemplate(Object.assign({
          searchHeader: searchHeader,
          showCreateActions: showCreateActions
        }, recents));
        searchParent.classList.remove('loading');

        if (gates.indexOf('search:nugget-filters') > -1) {
          searchNuggetFilters = searchParent.querySelector('.navSearch-filters');
          renderNuggetCategoryFilters();
        }

        var _recents = recents,
            queryIdentifier = _recents.queryIdentifier,
            resultSections = _recents.resultSections,
            totalResults = _recents.totalResults,
            listeners = _recents.listeners;
        addListeners(listeners);
        addCloseListener();
        dispatchNavEvent(NavEventType.SEARCH, {
          queryIdentifier: queryIdentifier,
          searchTerm: query,
          resultSections: resultSections,
          selectedCategories: selectedCategories,
          totalResults: totalResults
        });
      });
    } else {
      // Use cached recents
      searchContainer.innerHTML = recentTemplate(Object.assign({
        RESULT_TYPES: RESULT_TYPES,
        showCreateActions: showCreateActions,
        closeIcon: closeIcon,
        emptyStateIllo: emptyStateIllo,
        searchHeader: searchHeader
      }, recents));
      searchParent.classList.remove('loading');

      if (gates.indexOf('search:nugget-filters') > -1) {
        searchNuggetFilters = searchParent.querySelector('.navSearch-filters');
        renderNuggetCategoryFilters();
      }

      var _recents2 = recents,
          queryIdentifier = _recents2.queryIdentifier,
          resultSections = _recents2.resultSections,
          totalResults = _recents2.totalResults,
          listeners = _recents2.listeners;
      addListeners(listeners);
      addCloseListener();
      dispatchNavEvent(NavEventType.SEARCH, {
        queryIdentifier: queryIdentifier,
        searchTerm: query,
        resultSections: resultSections,
        selectedCategories: selectedCategories,
        totalResults: totalResults
      });
    }
  } else {
    // Search
    updateQueryParam(GLOBAL_SEARCH_QUERY_PARAM, query);
    updateQueryParam(GLOBAL_SEARCH_FILTER_QUERY_PARAM, selectedCategories.toString());
    var apiParams = {
      query: query,
      wasCorrected: wasCorrected
    };
    var transformArguments = {};
    var seeAllText = text('nav.search.seeAllLink', {
      defaultValue: 'See all'
    });
    var isSearchButton = false;

    var _searchHeader;

    var _showCreateActions = canShowCreateActions;
    var isCustomObjectSearch = Object.values(RESULT_TYPES).indexOf(viewAllState.sectionId) === -1;

    if (viewAllState.sectionId) {
      apiParams['types'] = !isCustomObjectSearch ? [viewAllState.sectionId] : ['CUSTOM_OBJECT'];
    }

    currentView = isFilteredSearch || viewAllState.sectionId ? Views.VIEW_ALL : Views.ALL_CATEGORIES;

    if ([Views.RECENTS, Views.ALL_CATEGORIES].indexOf(currentView) !== -1) {
      // Search all types
      currentView = Views.ALL_CATEGORIES;
      transformArguments['generateHero'] = true;
      transformArguments['maxResultsPerSection'] = 4;
      _searchHeader = text('nav.search.searchHeader.query', {
        query: query
      });
      searchParent.querySelector('.navSearch-headerText').innerHTML = escape(_searchHeader);
    } else if (currentView === Views.VIEW_ALL) {
      // Search single section
      apiParams['limit'] = isFilteredSearch ? 6 : RESULTS_PER_PAGE;
      _searchHeader = isFilteredSearch ? gates.indexOf('search:checkbox-filters') > -1 ? text('nav.search.searchHeader.filteredSearch', {
        query: query,
        defaultValue: "Search results for \"" + query + "\" filtered by"
      }) : text('nav.search.searchHeader.seeAll', {
        query: query,
        defaultValue: "See all results for \"" + query + "\""
      }) : text('nav.search.searchHeader.back', {
        query: query,
        defaultValue: "Back to all results for \"" + query + "\""
      });
      isSearchButton = !isFilteredSearch;
      seeAllText = isFilteredSearch ? seeAllText = text('nav.search.seeAllLink', {
        defaultValue: 'See all'
      }) : '';
      searchParent.querySelector('.navSearch-headerText').innerHTML = escape(_searchHeader);
      _showCreateActions = false;
    }

    clearTimeout(debounceSearchTimeout);
    debounceSearchTimeout = setTimeout(function () {
      searchParent.classList.add('loading');
      apiParams = responseSection ? Object.assign({}, apiParams, {
        nextOffset: responseSection.nextOffset,
        nextOffsetA: responseSection.nextOffsetA,
        nextOffsetB: responseSection.nextOffsetB
      }) : apiParams;
      SearchAPI.search(apiParams, function (response) {
        // Multiple searches in progress, dropping some results
        if (currentQuery !== query) {
          return;
        }

        var trimmedQuery = query.trim();

        var _transform2 = transform(response, transformArguments, gates),
            queryIdentifier = _transform2.queryIdentifier,
            hero = _transform2.hero,
            resultSections = _transform2.resultSections,
            totalResults = _transform2.totalResults,
            listeners = _transform2.listeners,
            isTwoColumn = _transform2.isTwoColumn;

        resultSectionKeys = !hero && totalResults === 0 ? null : Object.keys(resultSections);
        var spellingCorrection = response && response.spellingCorrection && response.spellingCorrection;
        var spellingCorrectionText = spellingCorrection && text('nav.search.searchHeader.spellCheck', {
          spellingCorrection: spellingCorrection
        });
        var emptyStateVars = {
          query: trimmedQuery
        };
        var layoutParams = {
          feedbackEmail: feedbackEmail,
          seeAllText: seeAllText,
          RESULT_TYPES: RESULT_TYPES,
          searchHeader: _searchHeader,
          spellingCorrectionText: spellingCorrectionText,
          isSearchButton: isSearchButton,
          closeIcon: closeIcon,
          showCreateActions: _showCreateActions,
          empty: !hero && totalResults === 0,
          hero: hero,
          hideViewAll: currentView === Views.VIEW_ALL,
          resultSections: resultSections,
          selectedCategories: selectedCategories,
          checkboxFiltersGated: gates.indexOf('search:checkbox-filters') === -1,
          emptyStateVars: emptyStateVars,
          showSidebar: isTwoColumn && !isFilteredSearch
        };

        if (gates.indexOf('search:two-column') > -1) {
          searchContainer.innerHTML = layoutTwoColumnTemplate(layoutParams);
        } else {
          searchContainer.innerHTML = layoutTemplate(layoutParams);
        }

        if (gates.indexOf('search:checkbox-filters') > -1) {
          if (isFilteredSearch || currentView === Views.ALL_CATEGORIES) {
            checkboxFilters.render(customObjects, resultSectionKeys, selectedCategories);
            addFilterCheckboxesListener(selectedCategories);
            checkboxFilters.addHeaderButtonListeners();
          }
        }

        if (gates.indexOf('search:nugget-filters') > -1) {
          searchNuggetFilters = searchParent.querySelector('.navSearch-filters');

          if (isFilteredSearch || currentView === Views.ALL_CATEGORIES) {
            renderNuggetCategoryFilters();
          }
        }

        searchParent.classList.remove('loading');
        addSpellcheckListener(spellingCorrection);
        var utteranceElements = [].slice.call(navQuerySelectorAll('.navSearch-utterance'));
        utteranceElements.forEach(function (utterance) {
          utterances.push({
            node: utterance,
            text: utterance.innerHTML
          });
        });
        utteranceTextResize();
        window.addEventListener('resize', utteranceTextResize);
        searchContainer.scrollTop = 0;
        var paginated = false;

        if (currentView === Views.VIEW_ALL) {
          viewAllState.queryIdentifier = queryIdentifier;
          viewAllState.offset = totalResults;
          paginated = true;
          var backLinkElement = searchParent.querySelector('.navSearch-headerText button.navSearch-button');

          if (backLinkElement) {
            backLinkElement.addEventListener('click', function () {
              searchInput.value = query;
              currentView = Views.ALL_CATEGORIES;
              var value = currentQuery;
              currentQuery = null;
              viewAllState = {
                queryIdentifier: null,
                sectionId: null,
                offset: 0
              };
              keyHandler({
                evt: {
                  target: {
                    value: value
                  }
                }
              });
            });
          }

          var resultSection = resultSections[viewAllState.sectionId];

          if (resultSection && resultSection.hasMore && !isFilteredSearch) {
            rez = response;
            searchContainer.addEventListener('scroll', debouncedScrollHandler);
          }
        }

        addListeners(listeners);
        addQuickActionListeners();
        addCloseListener();

        if (gates.indexOf('search:user-freeform-feedback') > -1 && !(gates.indexOf('search:filters-feedback-round1') > -1 && !tempStorage.get('filtersFeedbackHandled'))) {
          var feedbackModalPrompt = navQuerySelector('.navSearch-feedback-modal-prompt');
          feedbackModalPrompt.classList.add('shown');
          feedbackModalPrompt.addEventListener('click', function () {
            resultFeedbackClickHandler({
              correlationId: response.correlationId,
              queryResults: response.sectionResults
            });
          });
        }

        dispatchNavEvent(NavEventType.SEARCH, {
          queryIdentifier: queryIdentifier,
          searchTerm: query,
          paginated: paginated,
          hero: hero,
          resultSections: resultSections,
          resultOffset: 0,
          selectedCategories: selectedCategories,
          totalResults: totalResults
        });
      });
    }, 400);
  }
}

function setupSearch(scopeList, gateList, userId, userEmail) {
  canShowCreateActions = getCanShowCreateActions(scopeList);
  searchParent = navQuerySelector('.navSearch-v2');
  searchInput = searchParent.querySelector('.navSearch-input');
  searchContainer = searchParent.querySelector('.navSearch-container');
  searchContainer.classList.add('hidden');
  gates = gateList;
  scopes = scopeList;
  feedbackEmail = userEmail;
  feedbackUserId = userId;
  var initialFilter;
  var initialQuery = getQueryParam(GLOBAL_SEARCH_QUERY_PARAM);
  var initialFilterString = getQueryParam(GLOBAL_SEARCH_FILTER_QUERY_PARAM);

  if (!initialFilterString) {
    initialFilter = null;
  } else if (initialFilterString && initialFilterString.indexOf(',') > -1) {
    initialFilter = initialFilterString.split(',');
  } else {
    initialFilter = [initialFilterString];
  }

  resetState();

  var cleanupSearch = function cleanupSearch(e) {
    if (!isNavAncestor(e.target, searchParent)) {
      closeSearch();
      navQuerySelector().removeEventListener('mousedown', cleanupSearch);
      window.removeEventListener('mousedown', cleanupSearch);
    }
  };

  searchInput.addEventListener('focus', function () {
    if (!searchParent.classList.contains('open')) {
      openSearch(searchInput.value);
      navQuerySelector().addEventListener('mousedown', cleanupSearch);
      window.addEventListener('mousedown', cleanupSearch);
    }
  });
  searchInput.addEventListener('keyup', function (evt) {
    keyHandler({
      evt: evt,
      types: selectedCategories
    });
  });
  window.addEventListener('keyup', function (evt) {
    var key = evt.which || evt.keyCode;

    if (key === 27) {
      closeSearch();
    }
  });

  if (gates.indexOf('search:checkbox-filters') > -1) {
    filterCheckboxContainer = searchParent.querySelector('.navSearch-filter-checkboxes');
    checkboxFilters.addSeeCheckboxesListener();
    checkboxFilters.render(customObjects, resultSectionKeys, selectedCategories);
    addFilterCheckboxesListener(selectedCategories);
  }

  if (initialQuery && initialFilter) {
    isFilteredSearch = true;
    openSearch(initialQuery, initialFilter);
  } else if (initialQuery) {
    openSearch(initialQuery);
  } else if (initialFilter) {
    isFilteredSearch = true;
    openSearch('', initialFilter);
  }
}

function resetState() {
  currentQuery = null;
  currentView = Views.RECENTS;
  viewAllState = {
    queryIdentifier: null,
    sectionId: null,
    offset: 0
  };
  searchContainer.removeEventListener('scroll', debouncedScrollHandler);
  searchInput.value = '';
  updateQueryParam(GLOBAL_SEARCH_QUERY_PARAM);
  updateQueryParam(GLOBAL_SEARCH_FILTER_QUERY_PARAM);
  searchContainer.innerHTML = recentTemplate(Object.assign({
    RESULT_TYPES: RESULT_TYPES,
    searchHeader: text('nav.search.searchHeader.empty'),
    closeIcon: closeIcon,
    emptyStateIllo: emptyStateIllo,
    showCreateActions: canShowCreateActions
  }, recents));
  addCloseListener();
}

function openSearch(initialQuery, initialFilter) {
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = false;
  }

  var body = document.documentElement;

  if (body.classList.contains('navSearch-open')) {
    return;
  }

  body.classList.add('navSearch-open');
  searchContainer.classList.remove('hidden');
  setTimeout(function () {
    searchParent.classList.add('open');
    window.scrollTo(0, 0); // Ensure that nav is fully onscreen when search is opened

    if (initialQuery && initialFilter) {
      searchInput.value = initialQuery;
      keyHandler({
        evt: {
          target: {
            value: initialQuery
          }
        },
        types: initialFilter
      });
    } else if (initialQuery) {
      searchInput.value = initialQuery;
      keyHandler({
        evt: {
          target: {
            value: initialQuery
          }
        }
      });
    } else if (initialFilter) {
      keyHandler({
        evt: {
          target: {
            value: initialQuery
          }
        },
        types: initialFilter
      });
    } else {
      keyHandler({
        evt: {
          target: {
            value: ''
          }
        }
      });
    }
  }, 0);
  SearchAPI.getCustomObjects(function (response) {
    if (gates.indexOf('GlobalSearch:custom-objects') > -1) {
      customObjects = response.results.map(function (result) {
        return result.labels.plural.toUpperCase();
      });
    }

    if (gates.indexOf('search:checkbox-filters') > -1) {
      var searchIcon = searchParent.querySelector('a.navSearch-icon');
      searchIcon.classList.add('checkboxes-ungated');
      var input = searchParent.querySelector('input.navSearch-input');
      input.classList.add('checkboxes-ungated');
      checkboxFilters.render(customObjects, resultSectionKeys, selectedCategories);
      addFilterCheckboxesListener(selectedCategories);
      checkboxFilters.addHeaderButtonListeners();
    }
  });

  if (gates.indexOf('search:nugget-filters') > -1) {
    searchNuggetFilters = searchParent.querySelector('.navSearch-filters');
    renderNuggetCategoryFilters();
  }
}

function spellCheckClick(spellCorrection) {
  keyHandler({
    evt: {
      target: {
        value: spellCorrection,
        wasCorrected: true
      }
    },
    types: selectedCategories
  });
  searchInput.value = spellCorrection;
}

function closeSearch() {
  if (gates.indexOf('search:checkbox-filters') > -1) {
    checkboxFilters.remove(customObjects);
    isFilteredSearch = false;
    selectedCategories = [];
    resultSectionKeys = [];
  }

  if (gates.indexOf('search:nugget-filters') > -1) {
    removeNuggetCategoryFilters();
  }

  var body = document.documentElement;

  if (!body.classList.contains('navSearch-open')) {
    return;
  }

  body.classList.remove('navSearch-open');
  searchParent.classList.remove('open');
  searchInput.blur();
  resetTimeout = setTimeout(function () {
    searchContainer.classList.add('hidden');
    resetState();
  }, 300);
}

export { setupSearch, openSearch, closeSearch };