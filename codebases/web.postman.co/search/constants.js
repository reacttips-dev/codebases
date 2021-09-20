// Route name for SRP
export const DISABLE_USER_SEARCH = true;
export const SEARCH_PAGE_ROUTE_NAME = 'search';

// Recent Search Constants
export const RECENT_SEARCH_VERSION = 'rs-01-01-2021';
export const RECENT_SEARCH_SIZE = 3;

// Toggle switch for Cross Ranking in SearchBox
export const ENABLE_CROSS_RANK = true;

// Feature flags and metrics associated with them
// Experiment name is the key
export const SEARCH_FEATURE_FLAGS = {
  related_collections_callout: {
    metric: 'callout_view_clicked',
    flag: 'search-cb-callout-enabled-temp'
  }
};

export const RELATED_COLLECTIONS_CB = 'related-collections';
export const RELATED_COLLECTIONS_CB_COUNT = 10;
export const RELATED_COLLECTIONS_CALLOUT_DELAY = 1000;
