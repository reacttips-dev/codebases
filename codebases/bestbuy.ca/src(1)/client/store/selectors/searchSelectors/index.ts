import {createSelector, Selector} from "reselect";
import {State} from "store";
import {SearchResult, SearchState} from "models";

export const getSearch: Selector<State, SearchState> = (state: State) => state.search;

export const getSearchQuery = createSelector<State, SearchState, string | undefined>(
    [getSearch],
    (state) => state && state.query,
);

export const getSearchResult = createSelector<State, SearchState, SearchResult>(
    [getSearch],
    (state) => state && state.searchResult,
);
