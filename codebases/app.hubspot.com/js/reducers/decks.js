'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as DeckActionTypes from '../constants/DeckActionTypes';
var initialState = ImmutableMap();
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case DeckActionTypes.DECK_FETCH_SUCCEEDED:
      return action.payload.reduce(function (decks, deck) {
        return decks.set(deck.get('id'), deck);
      }, ImmutableMap());

    default:
      return state;
  }
});