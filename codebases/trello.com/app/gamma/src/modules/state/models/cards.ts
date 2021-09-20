/* eslint-disable import/no-default-export */
import { normalizeCard } from 'app/gamma/src/api/normalizers/card';
import {
  LOAD_BOARD_SUCCESS,
  LoadBoardSuccessAction,
} from 'app/gamma/src/modules/loaders/load-board';
import {
  LOAD_CARD_SUCCESS,
  LoadCardSuccessAction,
} from 'app/gamma/src/modules/loaders/load-card';
import { SOCKET_CARD, SocketCardAction } from 'app/gamma/src/modules/sockets';
import { CardModel } from 'app/gamma/src/types/models';
import { createReducer } from '@trello/redux';
import { PERFORM_SEARCH_SUCCESS, PerformSearchSuccessAction } from './search';
import updateModelList from './util/updateModelList';
import {
  LOAD_NOTIFICATION_GROUPS_SUCCESS,
  LoadNotificationGroupsSuccessAction,
} from 'app/gamma/src/modules/loaders/load-notifications';
import { CardResponse } from 'app/gamma/src/types/responses';

// Reducer
export type CardState = CardModel[];
const initialState: CardState = [];

export default createReducer(initialState, {
  [LOAD_BOARD_SUCCESS](state, { payload }: LoadBoardSuccessAction) {
    return updateModelList(state, payload.cards || [], normalizeCard);
  },

  [LOAD_CARD_SUCCESS](state, { payload }: LoadCardSuccessAction) {
    return updateModelList(state, payload, normalizeCard);
  },

  [SOCKET_CARD](state, { payload }: SocketCardAction) {
    return updateModelList(state, payload, normalizeCard);
  },

  [PERFORM_SEARCH_SUCCESS](state, { payload }: PerformSearchSuccessAction) {
    return updateModelList(state, payload.cards || [], normalizeCard);
  },

  [LOAD_NOTIFICATION_GROUPS_SUCCESS](
    state,
    { payload }: LoadNotificationGroupsSuccessAction,
  ) {
    const { notificationGroupsResponse } = payload;

    const cards = notificationGroupsResponse
      .map((notification) => notification.card)
      .filter(
        (potentialCard): potentialCard is CardResponse =>
          potentialCard !== undefined,
      );

    return updateModelList(state, cards, normalizeCard);
  },
});
