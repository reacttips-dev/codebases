import API from 'app/gamma/src/api';
import { Action, actionCreator } from '@trello/redux';

import { ActionResponse } from 'app/gamma/src/types/responses';
import { StandardThunkAction } from '../../types';
import { Dispatch } from 'app/gamma/src/types';

// Action types
export const LOAD_ACTION_SUCCESS = Symbol('loaders/LOAD_ACTION_SUCCESS');
export const LOAD_ACTION_ERROR = Symbol('loaders/LOAD_ACTION_ERROR');

export type LoadActionSuccessAction = Action<
  typeof LOAD_ACTION_SUCCESS,
  ActionResponse
>;
export type LoadActionErrorAction = Action<typeof LOAD_ACTION_ERROR, Error>;

// Action creators
const loadActionSuccess = actionCreator<LoadActionSuccessAction>(
  LOAD_ACTION_SUCCESS,
);
const loadActionError = actionCreator<LoadActionErrorAction>(LOAD_ACTION_ERROR);

export const loadAction = (idAction: string): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      const action = await API.client.rest.get<ActionResponse>(
        `actions/${idAction}`,
        {
          query: {
            display: true,
            memberCreator: true,
          },
        },
      );

      dispatch(loadActionSuccess(action));
    } catch (err) {
      dispatch(loadActionError(err));
    }
  };
};
