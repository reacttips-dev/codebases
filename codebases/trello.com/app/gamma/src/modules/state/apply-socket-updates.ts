import { gammaUpdaterClient } from 'app/gamma/src/api/gamma-updater-client';
import { State } from 'app/gamma/src/modules/types';
import { loadBoard } from 'app/gamma/src/modules/loaders/load-board';
import {
  socketBoard,
  socketCard,
  socketMember,
  socketNotification,
  socketOrganization,
  socketReaction,
} from 'app/gamma/src/modules/sockets';
import { Store } from 'redux';
import { Deleted, LiveUpdate } from 'app/scripts/init/live-updater';
import { getBoardById } from 'app/gamma/src/selectors/boards';
import { isFilteringByUnreadNotifications } from 'app/src/components/NotificationsMenu/notificationsMenuState';
import { BoardResponse } from 'app/gamma/src/types/responses';
import { Dispatch } from 'app/gamma/src/types';

export function applySocketUpdates(store: Store<State>) {
  const { getState } = store;
  const dispatch = store.dispatch as Dispatch;

  gammaUpdaterClient.subscribe(
    (update: LiveUpdate): ReturnType<typeof dispatch> => {
      // eslint-disable-next-line default-case
      switch (update.typeName) {
        case 'Board':
          if (
            !getBoardById(getState(), update.delta.id) &&
            !(update.delta as Deleted).deleted &&
            !(update.delta as BoardResponse).prefs
          ) {
            /*
             * If we receive a socket update to add a new board we don't have in state that does
             * not have prefs defined - fetch the model from the server and then add it rather than
             * put a partial model into the state
             */
            return dispatch(loadBoard(update.delta.id));
          }

          return dispatch(socketBoard(update.delta));

        case 'Card':
          return dispatch(socketCard(update.delta));

        case 'Member':
          return dispatch(socketMember(update.delta));

        case 'Notification':
          return dispatch(
            socketNotification({
              delta: update.delta,
              isFilteringByUnreadNotifications: isFilteringByUnreadNotifications(),
            }),
          );

        case 'Organization':
          return dispatch(socketOrganization(update.delta));

        case 'Reaction':
          return dispatch(socketReaction(update.delta));
      }
    },
  );
}
