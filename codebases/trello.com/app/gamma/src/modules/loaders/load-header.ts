import API from 'app/gamma/src/api';
import { MemberResponse } from 'app/gamma/src/types/responses';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator } from '@trello/redux';
import { MEMBER_FIELDS_HEADER } from './fields';
import { State } from 'app/gamma/src/modules/types';

// Action types
export const LOAD_HEADER_REQUEST = Symbol('loaders/LOAD_HEADER_REQUEST');
export const LOAD_HEADER_SUCCESS = Symbol('loaders/LOAD_HEADER_SUCCESS');
export const LOAD_HEADER_ERROR = Symbol('loaders/LOAD_HEADER_ERROR');

export type LoadHeaderRequestAction = Action<
  typeof LOAD_HEADER_REQUEST,
  string
>;
export type LoadHeaderSuccessAction = Action<
  typeof LOAD_HEADER_SUCCESS,
  MemberResponse
>;
export type LoadHeaderErrorAction = Action<typeof LOAD_HEADER_ERROR, Error>;

// Action creators
const loadHeaderRequest = actionCreator<LoadHeaderRequestAction>(
  LOAD_HEADER_REQUEST,
);
const loadHeaderSuccess = actionCreator<LoadHeaderSuccessAction>(
  LOAD_HEADER_SUCCESS,
);
const loadHeaderError = actionCreator<LoadHeaderErrorAction>(LOAD_HEADER_ERROR);

export const loadHeader = (idMember: string): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      dispatch(loadHeaderRequest(idMember));
      const member: MemberResponse = await API.client.rest.get<MemberResponse>(
        `members/${idMember}`,
        {
          query: {
            boardStars: true,
            channels: true,
            campaigns: true,
            enterprises: true,
            enterpriseLicenses: true,
            enterprise_fields: 'name,displayName,organizationPrefs',
            enterprise_filter: 'saml,member,member-unconfirmed',
            fields: MEMBER_FIELDS_HEADER,
            missedTransferDate: true,
            enterpriseToExplicitlyOwnBoards: true,
            notifications: 'all',
            notifications_display: true,
            notifications_limit: 10,
            organizations: 'all',
            organization_fields:
              'name,displayName,idEnterprise,memberships,products',
            organization_enterprise: true,
            savedSearches: true,
          },
        },
      );

      dispatch(loadHeaderSuccess(member));
    } catch (err) {
      console.error(err);
      dispatch(loadHeaderError(err));
    }
  };
};
