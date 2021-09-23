'use es6';

import { Map as ImmutableMap, fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function fetch() {
  var url = 'presentations/v1/deck';
  return apiClient.get(url).then(fromJS).then(function (decksData) {
    return decksData.get('results').reduce(function (_decksMap, deck) {
      return _decksMap.set(deck.get('id'), deck);
    }, ImmutableMap());
  });
}