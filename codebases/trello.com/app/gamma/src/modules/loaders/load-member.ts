import API from 'app/gamma/src/api';
import type { TrelloClientQuery } from 'app/gamma/src/api/trello-client-js/trello-client-js.types';
import { MemberResponse } from 'app/gamma/src/types/responses';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator } from '@trello/redux';
import {
  MEMBER_FIELDS_MINIMAL,
  MEMBER_FIELDS_NON_PUBLIC,
} from 'app/gamma/src/modules/loaders/fields';

// Action types
export const LOAD_MEMBER_REQUEST = Symbol('loaders/LOAD_MEMBER_REQUEST');
export const LOAD_MEMBER_SUCCESS = Symbol('loaders/LOAD_MEMBER_SUCCESS');
export const LOAD_MEMBER_ERROR = Symbol('loaders/LOAD_MEMBER_ERROR');

export type LoadMemberRequestAction = Action<
  typeof LOAD_MEMBER_REQUEST,
  string
>;
export type LoadMemberSuccessAction = Action<
  typeof LOAD_MEMBER_SUCCESS,
  MemberResponse
>;
export type LoadMemberErrorAction = Action<typeof LOAD_MEMBER_ERROR, Error>;

// Action creators
const loadMemberRequest = actionCreator<LoadMemberRequestAction>(
  LOAD_MEMBER_REQUEST,
);
export const loadMemberSuccess = actionCreator<LoadMemberSuccessAction>(
  LOAD_MEMBER_SUCCESS,
);
const loadMemberError = actionCreator<LoadMemberErrorAction>(LOAD_MEMBER_ERROR);

const fetchMember = (
  idMemberOrUsername: string,
  query: TrelloClientQuery | undefined,
) => {
  return API.client.rest.get<MemberResponse>(`members/${idMemberOrUsername}`, {
    query,
  });
};

export const loadMemberProfile = (
  idMemberOrUsername: string,
): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(loadMemberRequest(idMemberOrUsername));

      const member = await fetchMember(idMemberOrUsername, {
        fields: MEMBER_FIELDS_MINIMAL,
        tokens: 'all',
        sessions: 'all',
        credentials: 'all',
        logins: true,
      });

      dispatch(loadMemberSuccess(member));
    } catch (err) {
      dispatch(loadMemberError(err));
    }
  };
};

export const loadMemberNonPublicFields = (
  idMemberOrUsername: string,
): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(loadMemberRequest(idMemberOrUsername));

      const member = await fetchMember(idMemberOrUsername, {
        fields: MEMBER_FIELDS_NON_PUBLIC,
      });

      dispatch(loadMemberSuccess(member));
    } catch (err) {
      dispatch(loadMemberError(err));
    }
  };
};
