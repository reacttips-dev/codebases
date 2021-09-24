'use es6';

import { SYNC_SEARCH_TERM } from './searchActionTypes';
export var syncSearchTermAction = function syncSearchTermAction(searchTerm) {
  return {
    type: SYNC_SEARCH_TERM,
    payload: {
      searchTerm: searchTerm
    }
  };
};