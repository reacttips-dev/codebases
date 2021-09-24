'use es6';

import { Map as ImmutableMap } from 'immutable';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
var initialState = ImmutableMap({
  decks: null,
  error: null
});
export default function decks() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case ActionTypes.FETCH_DECKS_STARTED:
      return initialState;

    case ActionTypes.FETCH_DECKS_SUCCESS:
      {
        var decksMap = action.payload.get('results').reduce(function (_decksMap, deck) {
          return _decksMap.set(deck.get('id'), deck);
        }, ImmutableMap());
        return state.set('decks', decksMap).set('error', false);
      }

    case ActionTypes.FETCH_DECKS_ERROR:
      return state.set('error', true);

    default:
      return state;
  }
}