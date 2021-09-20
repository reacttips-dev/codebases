/* eslint-disable import/no-default-export */
import {
  LOAD_CLOSED_BOARDS_ERROR,
  LOAD_CLOSED_BOARDS_REQUEST,
  LOAD_CLOSED_BOARDS_SUCCESS,
  LoadClosedBoardsErrorAction,
  LoadClosedBoardsRequestAction,
  LoadClosedBoardsSuccessAction,
} from 'app/gamma/src/modules/loaders/load-my-closed-boards';

import { createReducer } from '@trello/redux';

export interface ClosedBoardsState {
  isLoading: boolean;
  hasError: boolean;
}

const initialState: ClosedBoardsState = {
  isLoading: false,
  hasError: false,
};

export default createReducer(initialState, {
  [LOAD_CLOSED_BOARDS_REQUEST](
    state,
    { payload }: LoadClosedBoardsRequestAction,
  ) {
    return { isLoading: true, hasError: false };
  },
  [LOAD_CLOSED_BOARDS_SUCCESS](
    state,
    { payload }: LoadClosedBoardsSuccessAction,
  ) {
    return { isLoading: false, hasError: false };
  },
  [LOAD_CLOSED_BOARDS_ERROR](state, { payload }: LoadClosedBoardsErrorAction) {
    return { isLoading: false, hasError: true };
  },
});
