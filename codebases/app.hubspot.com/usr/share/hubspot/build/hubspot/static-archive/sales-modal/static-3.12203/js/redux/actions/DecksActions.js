'use es6';

import * as DecksApi from 'sales-modal/api/DecksApi';
import Raven from 'Raven';
import partial from 'transmute/partial';
import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import { DECKS_FETCH_STARTED, DECKS_FETCH_SUCCEEDED, DECKS_FETCH_FAILED } from '../actionTypes';
export var fetchDecksStarted = partial(simpleAction, DECKS_FETCH_STARTED);
export var fetchDecksSucceeded = partial(simpleAction, DECKS_FETCH_SUCCEEDED);
export var fetchDecksFailed = partial(simpleAction, DECKS_FETCH_FAILED);
export var fetchDecks = function fetchDecks() {
  return function (dispatch) {
    dispatch(fetchDecksStarted());
    DecksApi.fetch().then(function (payload) {
      return dispatch(fetchDecksSucceeded(payload));
    }, function (err) {
      dispatch(fetchDecksFailed());
      Raven.captureMessage('[sales-modal] Failed to fetch decks', {
        extra: {
          statusCode: err.status,
          statusText: err.statusText,
          responseText: err.responseText
        }
      });
    });
  };
};