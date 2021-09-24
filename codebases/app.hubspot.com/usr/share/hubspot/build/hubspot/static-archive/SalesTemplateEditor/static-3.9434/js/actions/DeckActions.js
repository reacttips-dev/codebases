'use es6';

import createAction from './createAction';
import Raven from 'Raven';
import DeckApi from 'SalesTemplateEditor/api/DeckApi';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';

var _fetching;

export var fetchDecks = function fetchDecks() {
  return function (dispatch) {
    if (_fetching) {
      return;
    }

    _fetching = true;
    dispatch(createAction(ActionTypes.FETCH_DECKS_STARTED));
    DeckApi.fetch().then(function (res) {
      dispatch(createAction(ActionTypes.FETCH_DECKS_SUCCESS, res));
    }, function (err) {
      dispatch(createAction(ActionTypes.FETCH_DECKS_ERROR));

      if (!err || err.status === 0) {
        return;
      }

      Raven.captureMessage("[SalesTemplateEditor] DeckApi fetch failure " + err.status, {
        extra: {
          err: err
        }
      });
    }).finally(function () {
      return _fetching = false;
    });
  };
};