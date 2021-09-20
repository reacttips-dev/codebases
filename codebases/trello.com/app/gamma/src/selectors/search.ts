import { State } from 'app/gamma/src/modules/types';
import {
  SearchResultsModel,
  SearchSuggestionsResultsModel,
} from 'app/gamma/src/types/models';

export const getSearchResults = (state: State): SearchResultsModel =>
  state.models.search.results;

export const getSearchSuggestions = (
  state: State,
): SearchSuggestionsResultsModel => state.models.search.suggestions;

export const getSelectedSuggestion = (state: State): string =>
  state.models.search.selectedSuggestion;

export const getCurrentSearchQuery = (state: State): string =>
  state.models.search.currentQuery;

export const getLastSearchQuery = (state: State): string =>
  state.models.search.lastQuery;

export const isSearchLoading = (state: State): boolean =>
  state.models.search.isLoading;

export const isSearchError = (state: State): boolean =>
  state.models.search.searchError;

export const getSearchErrorCount = (state: State): number =>
  state.models.search.serviceUnavailableErrorCount;
