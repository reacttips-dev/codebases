/* eslint-disable import/no-default-export */
import API from 'app/gamma/src/api';
import { normalizeSearchResults } from 'app/gamma/src/api/normalizers/search-results';
import {
  BOARD_FIELDS,
  BOARD_FIELDS_SEARCH_RESULT,
} from 'app/gamma/src/modules/loaders/fields';
import { getCurrentSearchQuery } from 'app/gamma/src/selectors/search';
import {
  SearchResultsModel,
  SearchSuggestionsResultsModel,
  SearchSuggestionType,
} from 'app/gamma/src/types/models';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { BoardResponse, SearchResponse } from 'app/gamma/src/types/responses';
import { Action, actionCreator, createReducer } from '@trello/redux';

import {
  getKeywordSuggestionTypes,
  getSearchableBoardSuggestion,
  getSearchableMemberSuggestion,
} from 'app/gamma/src/util/model-helpers/search-suggestions';
import { State } from 'app/gamma/src/modules/types';
import type { TrelloClientSearchParams } from 'app/gamma/src/api/trello-client-js/trello-client-js.types';

// Action types
export const CLEAR_SEARCH_QUERY = Symbol('models/CLEAR_SEARCH_QUERY');
export const CLEAR_SEARCH_SUGGESTIONS = Symbol(
  'models/CLEAR_SEARCH_SUGGESTIONS',
);
export const PERFORM_SEARCH = Symbol('models/PERFORM_SEARCH');
export const PERFORM_SEARCH_SUCCESS = Symbol('models/PERFORM_SEARCH_SUCCESS');
export const PERFORM_SEARCH_ERROR = Symbol('models/PERFORM_SEARCH_ERROR');
export const SET_SEARCH_QUERY = Symbol('models/SET_SEARCH_QUERY');
export const SET_KEYWORD_SUGGESTIONS = Symbol(
  'model/SET_KEYWORD_SEARCH_SUGGESTIONS',
);
export const SET_SEARCHED_SUGGESTIONS = Symbol('models/GET_SEARCH_SUGGESTIONS');
const SET_SELECTED_SUGGESTION = Symbol('models/SET_SELECTED_SUGGESTION');
export const BOARD_SEARCH_SUCCESS = Symbol('models/BOARD_SEARCH_SUCCESS');
export const RESET_PAST_QUERIES = Symbol('models/RESET_PAST_QUERIES');

export type PerformSearchAction = Action<
  typeof PERFORM_SEARCH,
  { query: string; cardsPage: number }
>;
export type PerformSearchSuccessAction = Action<
  typeof PERFORM_SEARCH_SUCCESS,
  SearchResponse
>;
export type PerformSearchErrorAction = Action<
  typeof PERFORM_SEARCH_ERROR,
  { query: string; statusCode?: number }
>;
export type ClearSearchQueryAction = Action<typeof CLEAR_SEARCH_QUERY, null>;
export type SetSearchQueryAction = Action<
  typeof SET_SEARCH_QUERY,
  { query: string }
>;
export type SetKeywordSearchSuggestionsAction = Action<
  typeof SET_KEYWORD_SUGGESTIONS,
  { keywords: SearchSuggestionType[] }
>;
export type GetSearchSuggestionsAction = Action<
  typeof SET_SEARCHED_SUGGESTIONS,
  SearchResponse
>;
export type ClearSearchSuggestionsAction = Action<
  typeof CLEAR_SEARCH_SUGGESTIONS,
  null
>;
type SetSelectedSuggestionAction = Action<
  typeof SET_SELECTED_SUGGESTION,
  string | null
>;
export type BoardSearchSuccessAction = Action<
  typeof BOARD_SEARCH_SUCCESS,
  {
    query: string;
    boards: BoardResponse[];
    limited: boolean;
    timestamp: number;
  }
>;
export type ResetPastQueriesAction = Action<typeof RESET_PAST_QUERIES, null>;

// Reducer
export interface SearchState {
  currentQuery: string;
  lastQuery: string;
  isLoading: boolean;
  searchError: boolean;
  /*
   * We track the number of "Service Unavailable" (503) errors during
   * a fixed window. We define the fixed window as the current minute
   * since epoch.
   */
  serviceUnavailableErrorFixedWindow: number;
  serviceUnavailableErrorCount: number;
  results: SearchResultsModel;
  suggestions: SearchSuggestionsResultsModel;
  selectedSuggestion: string;
}

export const initialState: SearchState = {
  currentQuery: '',
  lastQuery: '',
  isLoading: false,
  searchError: false,
  serviceUnavailableErrorFixedWindow: 0,
  serviceUnavailableErrorCount: 0,
  results: {
    noMatchesFound: false,
    cardsPage: 0,
    hasMoreCards: false,
    totalCards: [],
    idBoards: [],
    idCards: [],
    idMembers: [],
    idTeams: [],
  },
  suggestions: {
    keywords: [],
    idMembers: [],
    idBoards: [],
  },
  selectedSuggestion: '',
};

export default createReducer(initialState, {
  [SET_SELECTED_SUGGESTION](state, { payload }: SetSelectedSuggestionAction) {
    return {
      ...state,
      selectedSuggestion: payload,
    };
  },
  /*
   * Set the currentQuery to whatever is in the text box as the user types
   */
  [SET_SEARCH_QUERY](state: SearchState, { payload }: SetSearchQueryAction) {
    return payload.query
      ? {
          ...state,
          currentQuery: payload.query,
          lastQuery: payload.query,
        }
      : initialState;
  },

  /*
   * Set keyword suggestions for the current query
   */
  [SET_KEYWORD_SUGGESTIONS](
    state: SearchState,
    { payload }: SetKeywordSearchSuggestionsAction,
  ) {
    return {
      ...state,
      suggestions: {
        keywords: payload.keywords,
        idBoards: [],
        idMembers: [],
      },
    };
  },

  /*
   * Show Board or Member search suggestions if any are returned
   */
  [SET_SEARCHED_SUGGESTIONS](
    state: SearchState,
    { payload }: GetSearchSuggestionsAction,
  ) {
    if (state.currentQuery !== payload.query) {
      return state;
    }
    const normalized = normalizeSearchResults(payload);

    return {
      ...state,
      suggestions: {
        keywords: [],
        idBoards: normalized.idBoards,
        idMembers: normalized.idMembers,
      },
    };
  },

  /*
   * Explicitly clear out all search suggestions
   */
  [CLEAR_SEARCH_SUGGESTIONS](state: SearchState) {
    return {
      ...state,
      suggestions: initialState.suggestions,
    };
  },

  /*
   * Reset search results when doing a new search. When doing a "show more"
   * search, keep existing results in order to append to them
   */
  [PERFORM_SEARCH](state: SearchState, { payload }: PerformSearchAction) {
    let results = initialState.results;
    if (payload.cardsPage > 0) {
      results = {
        ...state.results,
        cardsPage: payload.cardsPage,
      };
    }

    return {
      ...state,
      results,
      isLoading: true,
      searchError: false,
    };
  },

  /*
   * Reset search state to initial state when the input is cleared
   */
  [CLEAR_SEARCH_QUERY](
    { lastQuery }: SearchState,
    { payload }: ClearSearchQueryAction,
  ) {
    return {
      ...initialState,
      lastQuery,
    };
  },

  /*
   * Only process search results if the payload's search query is the same as the
   * currentQuery in the search input box. We only want to display 8 results, but
   * we request 9 so we'll know if there are more results to show. Unfortunately,
   * the limit affects the page size. So on page 0 we have one extra card, on page 1
   * we have 2 extra cards, etc.
   */
  [PERFORM_SEARCH_SUCCESS](
    state: SearchState,
    { payload }: PerformSearchSuccessAction,
  ) {
    const {
      cardsPage,
      idCards,
      idBoards,
      idMembers,
      idTeams,
      noMatchesFound,
      query,
      limit,
    } = normalizeSearchResults(payload);
    if (state.currentQuery !== query) {
      return state;
    }

    const totalCards =
      cardsPage > 0 ? state.results.totalCards.concat(idCards) : idCards;
    const numCardsToShow = (cardsPage + 1) * limit;
    const hasMoreCards = numCardsToShow < totalCards.length;
    const results = {
      noMatchesFound: cardsPage === 0 && noMatchesFound,
      idCards: totalCards.slice(0, numCardsToShow),
      totalCards,
      idBoards,
      idMembers,
      idTeams,
      hasMoreCards,
      cardsPage,
    };

    return {
      ...state,
      isLoading: false,
      searchError: false,
      results,
    };
  },

  /*
   * If the search API request fails, show an error
   */
  [PERFORM_SEARCH_ERROR](
    state: SearchState,
    { payload }: PerformSearchErrorAction,
  ) {
    if (state.currentQuery !== payload.query) {
      return state;
    }

    /*
     * We track the number of errors in the current fixed window.
     * The current fixed window is defined as the number of minutes
     * since Epoch time. If the current fixed window is different
     * from the tracked fixed window, we reset the error count to 0
     */
    const currentFixedWindowMinute = Math.floor(Date.now() / 1000 / 60);
    let serviceUnavailableErrorCount =
      currentFixedWindowMinute === state.serviceUnavailableErrorFixedWindow
        ? state.serviceUnavailableErrorCount
        : 0;
    if (payload.statusCode === 503) {
      serviceUnavailableErrorCount += 1;
    }

    return {
      ...state,
      isLoading: false,
      searchError: true,
      serviceUnavailableErrorFixedWindow: currentFixedWindowMinute,
      serviceUnavailableErrorCount,
    };
  },
});

// Action creators
export const clearSearchQuery = actionCreator<ClearSearchQueryAction>(
  CLEAR_SEARCH_QUERY,
);

export const clearSearchSuggestions = actionCreator<ClearSearchSuggestionsAction>(
  CLEAR_SEARCH_SUGGESTIONS,
);

export const setSearchQuery = ({
  query,
}: {
  query: string;
}): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(actionCreator(SET_SEARCH_QUERY)({ query }));
  };
};

export const performSearch = ({
  cardsPage = 0,
}: {
  cardsPage?: number;
}): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const query = getCurrentSearchQuery(getState());

    try {
      if (query.length === 0) {
        clearSearchQuery();

        return;
      }

      dispatch(actionCreator(PERFORM_SEARCH)({ query, cardsPage }));

      // When we ship the react version of /search, this limit should be set to 12.
      // The logic was removed temporarily to expediate the removal of the routing state from redux.
      const limit = 8;
      const results = await API.client.search(
        {
          board_fields: BOARD_FIELDS_SEARCH_RESULT as TrelloClientSearchParams['board_fields'],
          boards_limit: 8,
          card_attachments: 'cover',
          card_board: true,
          card_list: true,
          card_members: true,
          card_stickers: true,
          cards_limit: limit + 1,
          cards_page: cardsPage,
          members_limit: 8,
          modelTypes: ['cards', 'boards', 'organizations', 'members'],
          organization_fields: 'all',
          organizations_limit: 6,
          partial: true,
          query,
        },
        true,
      );

      dispatch(
        actionCreator(PERFORM_SEARCH_SUCCESS)({
          ...results,
          cardsPage,
          query,
          limit,
        }),
      );
    } catch (err) {
      const statusCode = typeof err === 'object' ? err.statusCode : undefined;
      dispatch(actionCreator(PERFORM_SEARCH_ERROR)({ query, statusCode }));
    }
  };
};

export const getSearchSuggestions = (caretPos: number): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const query = getCurrentSearchQuery(getState());
    const keywords = getKeywordSuggestionTypes(query, caretPos);
    const memberSuggestionName = getSearchableMemberSuggestion(query, caretPos);
    const boardSuggestionName = getSearchableBoardSuggestion(query, caretPos);

    dispatch(actionCreator(SET_KEYWORD_SUGGESTIONS)({ keywords }));

    if (memberSuggestionName || boardSuggestionName) {
      try {
        const results = await API.client.search({
          board_fields: BOARD_FIELDS as TrelloClientSearchParams['board_fields'],
          members_limit: 6,
          boards_limit: 6,
          modelTypes: memberSuggestionName ? ['members'] : ['boards'],
          partial: true,
          query: memberSuggestionName || boardSuggestionName,
        });

        dispatch(
          actionCreator(SET_SEARCHED_SUGGESTIONS)({
            ...results,
            query,
          }),
        );
      } catch (e) {
        // :nothingtodohere:
      }
    }
  };
};

export const setSelectedSuggestion = (selected: string | null) =>
  actionCreator<SetSelectedSuggestionAction>(SET_SELECTED_SUGGESTION)(selected);

export const boardSearchResultsSuccess = actionCreator<BoardSearchSuccessAction>(
  BOARD_SEARCH_SUCCESS,
);
export const resetPastQueries = actionCreator<ResetPastQueriesAction>(
  RESET_PAST_QUERIES,
);
