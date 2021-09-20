/* eslint-disable @trello/disallow-filenames */
import { TrelloStorage } from '@trello/storage';
import { State } from 'app/gamma/src/modules/types';
import { Store } from 'redux';
import { getMyId } from 'app/gamma/src/selectors/session';

const STORAGE_KEY = 'idMe';

export const saveLastSession = (store: Store<State>) => {
  let idLast: string | undefined = undefined;

  const update = () => {
    const state = store.getState();
    const idMe = getMyId(state);

    if (idMe && idLast !== idMe) {
      idLast = idMe;
      TrelloStorage.set(STORAGE_KEY, idMe);
    }
  };

  // use mousedown events to mean "this is the most recent session"
  document.addEventListener('mousedown', update);

  // Watch out of a change that causes the token to get set or unset
  store.subscribe(update);
};

export const getLastMemberId = () => {
  return TrelloStorage.get(STORAGE_KEY);
};

export const getLastToken = () => {
  return TrelloStorage.get('token');
};
