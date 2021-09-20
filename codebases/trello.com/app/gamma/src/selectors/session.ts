import { State } from 'app/gamma/src/modules/types';
import { MemberModel } from 'app/gamma/src/types/models';

export const getMyId = (state: State) => state.models.session.idMe;

export const getToken = (state: State) => state.models.session.token;

export const isLoggedIn = (state: State) => !!state.models.session.idMe;

export const isMe = (state: State, memberOrId: string | MemberModel) => {
  const myId = getMyId(state);
  if (typeof memberOrId === 'string') {
    return myId === memberOrId;
  } else if (memberOrId.id) {
    return myId === memberOrId.id;
  }

  return false;
};
