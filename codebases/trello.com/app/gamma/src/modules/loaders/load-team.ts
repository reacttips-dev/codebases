import API from 'app/gamma/src/api';
import { OrganizationsResponse } from 'app/gamma/src/types/responses';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator } from '@trello/redux';
import { TEAM_FIELDS } from './fields';
import { State } from 'app/gamma/src/modules/types';

export const LOAD_TEAM_REQUEST = Symbol('loaders/LOAD_TEAM_REQUEST');
export const LOAD_TEAM_SUCCESS = Symbol('loaders/LOAD_TEAM_SUCCESS');
export const LOAD_TEAM_ERROR = Symbol('loaders/LOAD_TEAM_ERROR');

export type LoadTeamRequestAction = Action<typeof LOAD_TEAM_REQUEST, string>;

export type LoadTeamSuccessAction = Action<
  typeof LOAD_TEAM_SUCCESS,
  OrganizationsResponse
>;

export type LoadTeamErrorAction = Action<typeof LOAD_TEAM_ERROR, Error>;

// Action creators
const loadTeamRequest = actionCreator<LoadTeamRequestAction>(LOAD_TEAM_REQUEST);
const loadTeamSuccess = actionCreator<LoadTeamSuccessAction>(LOAD_TEAM_SUCCESS);
const loadTeamError = actionCreator<LoadTeamErrorAction>(LOAD_TEAM_ERROR);

export const loadTeam = (teamName: string): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      dispatch(loadTeamRequest(teamName));

      const team = await API.client.rest.get<OrganizationsResponse>(
        `organizations/${teamName}`,
        {
          query: {
            fields: TEAM_FIELDS,
          },
        },
      );

      dispatch(loadTeamSuccess(team));
    } catch (err) {
      dispatch(loadTeamError(err));
    }
  };
};
