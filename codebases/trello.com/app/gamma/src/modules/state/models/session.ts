/* eslint-disable import/no-default-export */
import { Action, actionCreator, createReducer } from '@trello/redux';

import { setLocalStorageUser } from 'app/gamma/src/util/application-storage';

const LOGIN_GOOGLE = Symbol('models/LOGIN_GOOGLE');
const SET_MEMBER = Symbol('models/SET_MEMBER');

type LoginAction = Action<typeof LOGIN_GOOGLE, TokenPayload>;
type SetMemberAction = Action<typeof SET_MEMBER, UserIdPayload>;

interface UserIdPayload {
  idMe: string | null;
}

interface TokenPayload {
  id: string;
  token: string;
}

export interface SessionState {
  idMe: string;
  token?: string;
}
// Reducer
const initialState: SessionState = {
  idMe: '',
};

export default createReducer(initialState, {
  [LOGIN_GOOGLE](state, { payload }: LoginAction) {
    const { id } = payload;

    return { ...state, idMe: id };
  },

  [SET_MEMBER](state, { payload }: SetMemberAction) {
    const { idMe } = payload;
    if (!idMe) {
      return state;
    }

    setLocalStorageUser(idMe);

    return { ...state, idMe };
  },
});

export const loginGoogle = actionCreator<LoginAction>(LOGIN_GOOGLE);
export const setMember = actionCreator<SetMemberAction>(SET_MEMBER);
