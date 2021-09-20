import { SharedState } from '@trello/shared-state';

interface SearchState {
  displaySavedSearchPromo: boolean;
  displayAddSavedSearchForm: boolean;
}

export const searchState = new SharedState<SearchState>({
  displaySavedSearchPromo: false,
  displayAddSavedSearchForm: false,
});
