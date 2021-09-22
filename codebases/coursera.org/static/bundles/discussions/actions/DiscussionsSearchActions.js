import { FluxibleActions, loadingStates } from 'bundles/discussions/constants';
import SearchApi from 'bundles/discussions/api/SearchApi';

const receiveSearchResults = (actionContext, forumId, query, pageNum, response) => {
  actionContext.dispatch(FluxibleActions.SEARCH_RESULTS_RECEIVED, {
    pageNum,
    forumId,
    query,
    naptimeResponse: response,
  });
};

const searchApiError = (actionContext, err) => {
  actionContext.dispatch(FluxibleActions.SEARCH_API_ERROR, { err });
};

export const search = function (
  actionContext,
  { query, filterQueryString, forumId, contextId, forumType, reset = false, pageNum = 1, includeDeleted },
  done
) {
  actionContext.dispatch(FluxibleActions.UPDATE_LOADING_STATE, loadingStates.LOADING);

  if (reset) {
    actionContext.dispatch(FluxibleActions.CLEAR_DISCUSSIONS_SEARCH_STORE);
  }

  SearchApi.searchFor({
    query,
    filterQueryString,
    forumType,
    forumId,
    contextId,
    pageNum,
    includeDeleted,
  })
    .then((response) => receiveSearchResults(actionContext, forumId, query, pageNum, response))
    .fail((error) => searchApiError(actionContext, error))
    .done(() => done());
};

export const goToPage = function (
  actionContext,
  { query, filterQueryString, pageNum, forum, forumId, contextId, forumType, includeDeleted },
  done
) {
  const store = actionContext.getStore('DiscussionsSearchStore');
  const res = store.searchResults({ forumId, pageNum });
  actionContext.dispatch(FluxibleActions.UPDATE_LOADING_STATE, loadingStates.LOADING);
  if (res.length === 0) {
    SearchApi.searchFor({
      query,
      filterQueryString,
      forumType,
      forumId,
      contextId,
      pageNum,
      includeDeleted,
    })
      .then((response) => {
        actionContext.dispatch(FluxibleActions.SEARCH_PAGE_CHANGE, {
          pageNum,
          filterQueryString,
          naptimeResponse: response,
          forumId,
          query,
        });
      })
      .fail((error) => searchApiError(actionContext, error))
      .done(() => done());
  } else {
    actionContext.dispatch(FluxibleActions.SEARCH_PAGE_CHANGE, {
      pageNum,
      filterQueryString,
      forumId,
      query,
    });
    done();
  }
};

export default { search, goToPage };
