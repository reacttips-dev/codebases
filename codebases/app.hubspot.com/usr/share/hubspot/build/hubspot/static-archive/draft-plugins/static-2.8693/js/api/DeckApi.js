'use es6';

import { fromJS } from 'immutable';
import http from 'hub-http/clients/apiClient';
export function fetchDeck(id) {
  return http.get("presentations/v1/deck/" + id).then(fromJS);
}
export function createDeckLink(deckId, skipForm, sharedWith) {
  return http.post("presentations/v1/deck/" + deckId + "/share", {
    query: {
      isLive: true,
      skipForm: skipForm,
      sharedWith: sharedWith
    }
  }).then(fromJS);
}