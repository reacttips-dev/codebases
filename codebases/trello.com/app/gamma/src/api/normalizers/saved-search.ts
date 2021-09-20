import { SavedSearchModel } from 'app/gamma/src/types/models';
import { SavedSearchResponse } from 'app/gamma/src/types/responses';
import genericNormalizer from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeSavedSearch = genericNormalizer<
  SavedSearchResponse,
  SavedSearchModel
>(({ from }) => ({
  id: from('id'),
  name: from('name'),
  pos: from('pos'),
  query: from('query'),
}));
