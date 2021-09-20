/* eslint-disable import/no-default-export */
import API from 'app/gamma/src/api';
import { normalizeAction } from 'app/gamma/src/api/normalizers/action';
import { ActionResponse } from 'app/gamma/src/types/responses';
import { ActionModel } from 'app/gamma/src/types/models';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator, createReducer } from '@trello/redux';

// Action types
import {
  LOAD_ACTION_SUCCESS,
  LoadActionSuccessAction,
} from 'app/gamma/src/modules/loaders/load-actions';
import { LOAD_BOARD_SUCCESS } from 'app/gamma/src/modules/loaders/load-board';
import { State } from 'app/gamma/src/modules/types';

const SET_COMMENT_TEXT = Symbol('models/SET_COMMENT_TEXT');

type SetCommentTextAction = Action<typeof SET_COMMENT_TEXT, ActionResponse>;

const setCommentTextAction = actionCreator<SetCommentTextAction>(
  SET_COMMENT_TEXT,
);

export type ActionsState = ActionModel[];
const initialState: ActionsState = [];

export default createReducer(initialState, {
  [LOAD_ACTION_SUCCESS](state, { payload }: LoadActionSuccessAction) {
    const action = normalizeAction(payload);
    const existingAction = state.find((a) => a.id === action.id) || {};

    return state
      .filter((a) => a.id !== action.id)
      .concat([{ ...existingAction, ...action }]);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [LOAD_BOARD_SUCCESS](state, { payload }: any) {
    return [].concat(payload.actions).map((action) => normalizeAction(action));
  },

  [SET_COMMENT_TEXT](state, { payload }: SetCommentTextAction) {
    const { id, data } = payload;
    const text = data && data.text;

    return state.map((action) =>
      action.id !== id ? action : { ...action, text },
    );
  },
});

export const setCommentText = ({
  idAction,
  text,
}: {
  idAction: string;
  text: string;
}): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      const action = await API.client.rest.put<ActionResponse>(
        `actions/${idAction}`,
      );

      dispatch(setCommentTextAction(action));
    } catch (err) {
      console.error(err);
    }
  };
};
