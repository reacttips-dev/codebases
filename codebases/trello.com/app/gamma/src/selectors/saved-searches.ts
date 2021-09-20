import { State } from 'app/gamma/src/modules/types';
import { SavedSearchModel } from 'app/gamma/src/types/models';

export const getSavedSearches = (state: State): SavedSearchModel[] => {
  return Object.values(state.models.savedSearches).sort(
    (a, b) => (a.pos || 0) - (b.pos || 0),
  );
};

export const getMatchingSavedSearchNameByQuery = (state: State): string => {
  const matchingSavedSearch = getSavedSearches(state).filter(
    (e) => e.query === state.models.search.currentQuery,
  );
  if (matchingSavedSearch.length) {
    return matchingSavedSearch[0].name;
  } else {
    return '';
  }
};

export const getSavedSearchById = (state: State, id: string) =>
  getSavedSearches(state).find((savedSearch) => savedSearch.id === id);
