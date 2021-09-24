'use es6';

import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import * as DeckActionTypes from '../constants/DeckActionTypes';
import * as DeckApi from '../api/DeckApi';
export var fetchDecksSucceeded = createAction(DeckActionTypes.DECK_FETCH_SUCCEEDED, identity);
var _pendingFetch = null;
export var fetchDecks = function fetchDecks() {
  return function (dispatch) {
    if (_pendingFetch == null) {
      _pendingFetch = DeckApi.fetch().then(function (response) {
        dispatch(fetchDecksSucceeded(response));
      }).finally(function () {
        _pendingFetch = null;
      });
    }
  };
};