import { loadingStates, FluxibleActions } from 'bundles/discussions/constants';
import { isEmpty } from 'underscore';
import { hydrateSearchResults } from 'bundles/discussions/utils/hydrateSearchResults';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const buildSearchResultsKey = (forumId, query, pageNum) => `${forumId}~${pageNum}`;
const buildQueryBasedKey = (forumId, query) => `${forumId}~${query}`;

class SearchStore extends BaseStore {
  static storeName = 'DiscussionsSearchStore';

  static handlers = {
    [FluxibleActions.SEARCH_RESULTS_RECEIVED]({ naptimeResponse, pageNum, filterQueryString, forumId, query }) {
      this.currentPage = pageNum;

      this._searchResults[buildSearchResultsKey(forumId, query, this.currentPage)] = hydrateSearchResults(
        naptimeResponse
      );
      this.pageCount[buildQueryBasedKey(forumId, query)] = Math.ceil(naptimeResponse.paging.total / 15);
      this.numResults[buildQueryBasedKey(forumId, query)] = naptimeResponse.paging.total;
      this.loadingState = loadingStates.DONE;
      this.emitChange();
    },

    [FluxibleActions.SEARCH_PAGE_CHANGE]({ pageNum, filterQueryString, naptimeResponse, forumId, query }) {
      // TODO: We don't do anything with filterQueryString because we're just resetting
      // the store when filterQueryString changes ... but think about actually
      // storing all results indexing by an additional filterQueryString.
      if (naptimeResponse) {
        this._searchResults[buildSearchResultsKey(forumId, query, pageNum)] = hydrateSearchResults(naptimeResponse);
        this.pageCount[buildQueryBasedKey(forumId, query)] = Math.ceil(naptimeResponse.paging.total / 15);
        this.numResults[buildQueryBasedKey(forumId, query)] = naptimeResponse.paging.total;
      }
      this.loadingState = loadingStates.DONE;
      this.currentPage = pageNum;
      this.emitChange();
    },

    [FluxibleActions.SEARCH_API_ERROR]() {
      this.loadingState = loadingStates.ERROR;
      this.emitChange();
    },

    [FluxibleActions.UPDATE_LOADING_STATE](loadingState) {
      this.loadingState = loadingState;
      this.emitChange();
    },

    [FluxibleActions.CLEAR_DISCUSSIONS_SEARCH_STORE]() {
      this.currentPage = 1;
      this.pageCount = {};
      this.numResults = {};
      this._loadingState = loadingStates.LOADING;
      this._searchResults = {};
      this.emitChange();
    },
  };

  constructor(dispatcher) {
    super(dispatcher);

    // Public
    this.currentPage = 1;

    // keyed on forumId~query
    this.pageCount = {};
    // keyed on forumId~query
    this.numResults = {};

    // Private, access using getters/setters
    this._loadingState = loadingStates.LOADING;

    // compound key of forumId~pageNum
    this._searchResults = {};
  }

  get query() {
    return this._query;
  }

  set query(query) {
    this._query = decodeURIComponent(query);
  }

  get loadingState() {
    return this._loadingState;
  }

  set loadingState(state) {
    if (
      Object.keys(loadingStates)
        .map((key) => loadingStates[key])
        .indexOf(state) < 0
    ) {
      throw new Error('Invalid loading state');
    }

    this._loadingState = state;
  }

  searchResults(options = {}) {
    const { forumId, pageNum, query } = options;

    if (!forumId) {
      return isEmpty(this._searchResults) ? null : this._searchResults;
    }

    return this._searchResults[buildSearchResultsKey(forumId, query, pageNum)] || [];
  }

  getNumResults(options = {}) {
    const { forumId, query } = options;

    if (!forumId) {
      return 0;
    }

    // Treat no query as a query on empty string.
    return this.numResults[buildQueryBasedKey(forumId, query || '')] || 0;
  }

  getPageCount(options = {}) {
    const { forumId, query } = options;

    if (!forumId) {
      return 0;
    }

    // Treat no query as a query on empty string.
    return this.pageCount[buildQueryBasedKey(forumId, query || '')] || 0;
  }
}

export default SearchStore;
