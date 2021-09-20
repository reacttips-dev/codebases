/* eslint-disable import/no-default-export */
import { normalizeBoard } from 'app/gamma/src/api/normalizers/board';
import { Action, actionCreator, createReducer } from '@trello/redux';

// Action types
import {
  LOAD_BOARD_SUCCESS,
  LoadBoardSuccessAction,
} from 'app/gamma/src/modules/loaders/load-board';
import {
  LOAD_CARD_SUCCESS,
  LoadCardSuccessAction,
} from 'app/gamma/src/modules/loaders/load-card';
import {
  LOAD_MISSING_BOARDS_SUCCESS,
  LoadMissingBoardsSuccessAction,
  LOAD_MY_BOARDS_SUCCESS,
  LoadMyBoardsSuccessAction,
} from 'app/gamma/src/modules/loaders/load-my-boards';
import {
  LOAD_CLOSED_BOARDS_SUCCESS,
  LoadClosedBoardsSuccessAction,
} from 'app/gamma/src/modules/loaders/load-my-closed-boards';

import {
  BOARD_SEARCH_SUCCESS,
  BoardSearchSuccessAction,
  GetSearchSuggestionsAction,
  PERFORM_SEARCH_SUCCESS,
  PerformSearchSuccessAction,
  SET_SEARCHED_SUGGESTIONS,
} from './search';

import { SOCKET_BOARD, SocketBoardAction } from 'app/gamma/src/modules/sockets';
import {
  CREATE_BOARD_SUBMIT_DONE,
  CreateBoardSubmitDoneAction,
} from 'app/gamma/src/modules/state/ui/create-menu';
import { BoardModel } from 'app/gamma/src/types/models';
import { BoardResponse } from 'app/gamma/src/types/responses';
import { createStateUpdater } from './util/create-state-updater';

// Helpers
function byId<T extends { id: string }>(items: T[]): Map<string, T> {
  const map: Map<string, T> = new Map(
    items.map((item): [string, T] => [item.id, item]),
  );

  return map;
}

export type BoardState = BoardModel[];
const ADD_MEMBER_TO_BOARD = Symbol('models/ADD_MEMBER_TO_BOARD');

export const SET_BOARD_CLOSED = Symbol('models/SET_BOARD_CLOSED');

const DELETE_BOARD = Symbol('models/DELETE_BOARD');
const REMOVE_MEMBER_FROM_BOARD = Symbol('models/REMOVE_MEMBER_FROM_BOARD');

// Actions
type AddMemberToBoardAction = Action<typeof ADD_MEMBER_TO_BOARD, BoardResponse>;

export type SetBoardClosedAction = Action<
  typeof SET_BOARD_CLOSED,
  BoardResponse
>;
type DeleteBoardAction = Action<typeof DELETE_BOARD, string>;
type RemoveMemberFromBoardAction = Action<
  typeof REMOVE_MEMBER_FROM_BOARD,
  { idBoard: string; idMember: string }
>;

export const addMemberToBoardAction = actionCreator<AddMemberToBoardAction>(
  ADD_MEMBER_TO_BOARD,
);

export const setBoardClosedAction = actionCreator<SetBoardClosedAction>(
  SET_BOARD_CLOSED,
);
export const deleteBoardAction = actionCreator<DeleteBoardAction>(DELETE_BOARD);
export const removeMemberFromBoardAction = actionCreator<RemoveMemberFromBoardAction>(
  REMOVE_MEMBER_FROM_BOARD,
);

// Reducer
const initialState: BoardState = [];
// eslint-disable-next-line @trello/no-module-logic
const updateBoardsState = createStateUpdater(normalizeBoard);

export default createReducer(initialState, {
  [CREATE_BOARD_SUBMIT_DONE](state, { payload }: CreateBoardSubmitDoneAction) {
    return updateBoardsState(state, payload);
  },
  [LOAD_MY_BOARDS_SUCCESS](state, { payload }: LoadMyBoardsSuccessAction) {
    return updateBoardsState(state, payload.boards);
  },
  [LOAD_MISSING_BOARDS_SUCCESS](
    state,
    { payload }: LoadMissingBoardsSuccessAction,
  ) {
    return updateBoardsState(state, payload);
  },
  [LOAD_BOARD_SUCCESS](state, { payload }: LoadBoardSuccessAction) {
    return updateBoardsState(state, payload);
  },
  [LOAD_CARD_SUCCESS](state, { payload }: LoadCardSuccessAction) {
    return updateBoardsState(state, payload);
  },
  [PERFORM_SEARCH_SUCCESS](state, { payload }: PerformSearchSuccessAction) {
    const { boards = [], cards = [] } = payload;

    return updateBoardsState(state, [
      ...boards,
      ...cards
        .map((card) => (card.board ? card.board : null))
        .filter((board): board is BoardResponse => board !== null),
    ]);
  },
  [BOARD_SEARCH_SUCCESS](state, { payload }: BoardSearchSuccessAction) {
    const existingById = byId(state);
    const newById = byId(payload.boards);

    return [
      ...state.map((board) => {
        const update = newById.get(board.id);

        return update ? normalizeBoard(update, board) : board;
      }),
      ...payload.boards
        .filter((response) => !existingById.has(response.id))
        .map((response) => normalizeBoard(response)),
    ];
  },
  [SET_SEARCHED_SUGGESTIONS](state, { payload }: GetSearchSuggestionsAction) {
    return updateBoardsState(state, payload.boards);
  },
  [SOCKET_BOARD](state, { payload }: SocketBoardAction) {
    return updateBoardsState(state, payload);
  },
  [ADD_MEMBER_TO_BOARD](state, { payload }: AddMemberToBoardAction) {
    const { id, memberships } = normalizeBoard(payload);

    return state.map((board) =>
      board.id !== id
        ? board
        : {
            ...board,
            memberships,
          },
    );
  },
  [REMOVE_MEMBER_FROM_BOARD](state, { payload }: RemoveMemberFromBoardAction) {
    const { idBoard, idMember } = payload;

    return state.map((board) =>
      board.id !== idBoard
        ? board
        : {
            ...board,
            memberships: (board.memberships || []).filter(
              (membership) => membership.idMember !== idMember,
            ),
          },
    );
  },
  [SET_BOARD_CLOSED](state, { payload }: SetBoardClosedAction) {
    return updateBoardsState(state, payload);
  },
  [DELETE_BOARD](state, { payload }: DeleteBoardAction) {
    return updateBoardsState(state, { id: payload, deleted: true });
  },
  [LOAD_CLOSED_BOARDS_SUCCESS](
    state,
    { payload = [] }: LoadClosedBoardsSuccessAction,
  ) {
    return updateBoardsState(state, payload);
  },
});
