/* eslint-disable import/no-default-export */
import API from 'app/gamma/src/api';
import { normalizeBoardStar } from 'app/gamma/src/api/normalizers/board';
import {
  isDeletedModel,
  SOCKET_MEMBER,
  SocketMemberAction,
} from 'app/gamma/src/modules/sockets';
import { getMyId } from 'app/gamma/src/selectors/session';
import {
  getBoardStarForBoard,
  getMyOpenBoardsStarsSortedByPosition,
} from 'app/gamma/src/selectors/boards';
import { BoardStarModel } from 'app/gamma/src/types/models';
import { Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator, createReducer } from '@trello/redux';

// Action types
import {
  LOAD_HEADER_SUCCESS,
  LoadHeaderSuccessAction,
} from 'app/gamma/src/modules/loaders/load-header';
import {
  LOAD_MY_BOARDS_SUCCESS,
  LoadMyBoardsSuccessAction,
} from 'app/gamma/src/modules/loaders/load-my-boards';
import { calculatePos } from 'app/gamma/src/util/position';
import { StandardThunkAction } from '../../../types';
import { Analytics } from '@trello/atlassian-analytics';
import { State } from 'app/gamma/src/modules/types';

export interface BoardStarUpdate {
  idBoard: string;
  idMember: string;
  position: number;
}

export interface PlaceholderError {
  id: string;
  err: Error;
}

const ADD_BOARD_STAR_REQUEST = Symbol('models/ADD_BOARD_STAR_REQUEST');
const ADD_BOARD_STAR_SUCCESS = Symbol('models/ADD_BOARD_STAR_SUCCESS');
const ADD_BOARD_STAR_ERROR = Symbol('models/ADD_BOARD_STAR_ERROR');

const REMOVE_BOARD_STAR_REQUEST = Symbol('models/REMOVE_BOARD_STAR_REQUEST');
const REMOVE_BOARD_STAR_SUCCESS = Symbol('models/REMOVE_BOARD_STAR_SUCCESS');
const REMOVE_BOARD_STAR_ERROR = Symbol('models/REMOVE_BOARD_STAR_ERROR');

const UPDATE_POS_REQUEST = Symbol('models/UPDATE_POS_REQUEST');
const UPDATE_POS_SUCCESS = Symbol('models/UPDATE_POS_SUCCESS');
const UPDATE_POS_ERROR = Symbol('models/UPDATE_POS_ERROR');

type AddBoardStarRequestAction = Action<
  typeof ADD_BOARD_STAR_REQUEST,
  BoardStarModel
>;
type AddBoardStarSuccessAction = Action<
  typeof ADD_BOARD_STAR_SUCCESS,
  BoardStarModel
>;
type AddBoardStarErrorAction = Action<
  typeof ADD_BOARD_STAR_ERROR,
  PlaceholderError
>;

type RemoveBoardStarRequestAction = Action<
  typeof REMOVE_BOARD_STAR_REQUEST,
  string
>;
type RemoveBoardStarSuccessAction = Action<
  typeof REMOVE_BOARD_STAR_SUCCESS,
  string
>;
type RemoveBoardStarErrorAction = Action<
  typeof REMOVE_BOARD_STAR_ERROR,
  PlaceholderError
>;

type UpdatePosRequestAction = Action<typeof UPDATE_POS_REQUEST, BoardStarModel>;
type UpdatePosSuccessAction = Action<typeof UPDATE_POS_SUCCESS, BoardStarModel>;
type UpdatePosErrorAction = Action<typeof UPDATE_POS_ERROR, BoardStarModel>;

const addBoardStarRequestAction = actionCreator<AddBoardStarRequestAction>(
  ADD_BOARD_STAR_REQUEST,
);
const addBoardStarSuccessAction = actionCreator<AddBoardStarSuccessAction>(
  ADD_BOARD_STAR_SUCCESS,
);
const addBoardStarErrorAction = actionCreator<AddBoardStarErrorAction>(
  ADD_BOARD_STAR_ERROR,
);

const removeBoardStarRequestAction = actionCreator<RemoveBoardStarRequestAction>(
  REMOVE_BOARD_STAR_REQUEST,
);
const removeBoardStarSuccessAction = actionCreator<RemoveBoardStarSuccessAction>(
  REMOVE_BOARD_STAR_SUCCESS,
);
const removeBoardStarErrorAction = actionCreator<RemoveBoardStarErrorAction>(
  REMOVE_BOARD_STAR_ERROR,
);

const boardStarPosUpdateActionStart = actionCreator<UpdatePosRequestAction>(
  UPDATE_POS_REQUEST,
);
const boardStarPosUpdateActionSuccess = actionCreator<UpdatePosSuccessAction>(
  UPDATE_POS_SUCCESS,
);
const boardStarPosUpdateActionError = actionCreator<UpdatePosErrorAction>(
  UPDATE_POS_ERROR,
);

const PLACEHOLDER_PREFIX = 'placeholder-';

export const isPlaceholder = (entry: BoardStarModel) => {
  return entry.id.indexOf(PLACEHOLDER_PREFIX) === 0;
};

export type BoardStarState = BoardStarModel[];

// Helpers

/**
 * Finds and updates the state for an individual board star entry. If no
 * matching board star is found in the state array, this will just return
 * the existing state
 */
const updateBoardStar = (state: BoardStarState, boardStar: BoardStarModel) => {
  if (state.some((item) => item.id === boardStar.id)) {
    return state.map((item) =>
      item.id === boardStar.id ? { ...item, ...boardStar } : item,
    );
  }

  return state;
};

// Reducer
const initialState: BoardStarState = [];

export default createReducer(initialState, {
  [LOAD_HEADER_SUCCESS](state, { payload }: LoadHeaderSuccessAction) {
    return payload.boardStars
      ? payload.boardStars.map((star) => normalizeBoardStar(star))
      : [];
  },
  [LOAD_MY_BOARDS_SUCCESS](state, { payload }: LoadMyBoardsSuccessAction) {
    return payload.boardStars
      ? payload.boardStars.map((star) => normalizeBoardStar(star))
      : [];
  },
  [ADD_BOARD_STAR_REQUEST](state, { payload }: AddBoardStarRequestAction) {
    return [...state, payload];
  },
  [ADD_BOARD_STAR_SUCCESS](state, { payload }: AddBoardStarSuccessAction) {
    return state.map((boardStar) =>
      boardStar.idBoard === payload.idBoard ? payload : boardStar,
    );
  },
  [ADD_BOARD_STAR_ERROR](state, { id }: AddBoardStarErrorAction) {
    return state.filter((boardStar) => boardStar.id !== `placeholder-${id}`);
  },
  [REMOVE_BOARD_STAR_REQUEST](
    state,
    { payload }: RemoveBoardStarSuccessAction,
  ) {
    return state.map((boardStar) =>
      boardStar.id === payload ? { ...boardStar, deleted: true } : boardStar,
    );
  },
  [REMOVE_BOARD_STAR_SUCCESS](
    state,
    { payload }: RemoveBoardStarSuccessAction,
  ) {
    return state.filter((boardStar) => boardStar.id !== payload);
  },
  [REMOVE_BOARD_STAR_ERROR](state, { id }: RemoveBoardStarErrorAction) {
    return state.filter((boardStar) =>
      boardStar.id === id ? { ...boardStar, deleted: false } : boardStar,
    );
  },
  [UPDATE_POS_REQUEST](state, { payload }: UpdatePosRequestAction) {
    return updateBoardStar(state, payload);
  },
  [UPDATE_POS_SUCCESS](state, { payload }: UpdatePosSuccessAction) {
    return updateBoardStar(state, payload);
  },
  [UPDATE_POS_ERROR](state, { payload }: UpdatePosErrorAction) {
    return updateBoardStar(state, payload);
  },
  [SOCKET_MEMBER](state, { payload }: SocketMemberAction) {
    if (!isDeletedModel(payload) && payload.boardStars !== undefined) {
      // Keep any optimistic updates, so we have to keep track of which
      // entries are placeholders or marked deleted

      const deletedStars = new Map<string, boolean>();

      state.forEach((entry) => {
        if (entry.deleted === true) {
          deletedStars.set(entry.id, true);
        }
      });

      return [
        ...payload.boardStars.map((entry) => {
          if (deletedStars.get(entry.id)) {
            return { ...entry, deleted: true };
          } else {
            return entry;
          }
        }),
        ...state.filter((entry) => isPlaceholder(entry)),
      ];
    } else {
      return state;
    }
  },
});

// Action creators
export const addBoardStar = ({
  idBoard,
  idMember,
}: {
  idBoard: string;
  idMember: string;
}): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const boardStars: BoardStarModel[] = getState().models.boardStars;

    dispatch(
      addBoardStarRequestAction({
        id: PLACEHOLDER_PREFIX + idBoard,
        idBoard,
        pos:
          boardStars.reduce(
            (acc, boardStar): number => Math.max(acc, boardStar.pos),
            0,
          ) + 1,
      }),
    );

    try {
      const boardStar = await API.client.rest.post<BoardStarModel>(
        `members/${idMember}/boardStars`,
        {
          body: {
            idBoard,
            pos: 'bottom',
          },
        },
      );

      dispatch(addBoardStarSuccessAction(boardStar));
    } catch (err) {
      dispatch(
        addBoardStarErrorAction({
          err,
          id: idBoard,
        }),
      );
    }
  };
};

export const removeBoardStar = ({
  idBoardStar,
  idMember,
}: {
  idBoardStar: string;
  idMember: string;
}): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(removeBoardStarRequestAction(idBoardStar));

    try {
      await API.client.rest.del(
        `members/${idMember}/boardStars/${idBoardStar}`,
      );

      dispatch(removeBoardStarSuccessAction(idBoardStar));
    } catch (err) {
      dispatch(
        removeBoardStarErrorAction({
          err,
          id: idBoardStar,
        }),
      );
    }
  };
};

export const toggleBoardStar = ({
  idBoard,
}: {
  idBoard: string;
}): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();

    const idMember = getMyId(state);
    const boardStar = getBoardStarForBoard(state, idBoard);

    if (boardStar) {
      dispatch(removeBoardStar({ idBoardStar: boardStar.id, idMember }));
    } else {
      dispatch(addBoardStar({ idBoard, idMember }));
    }
    Analytics.sendUpdatedBoardFieldEvent({
      field: 'star',
      value: boardStar ? false : true,
      source: 'boardsMenuInlineDialog',
      containers: {
        board: {
          id: boardStar && boardStar.id,
        },
      },
    });
  };
};

export const updateBoardStarPosition = ({
  idBoard,
  idMember,
  position,
}: BoardStarUpdate): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const boardStar = getBoardStarForBoard(state, idBoard);

    if (boardStar) {
      try {
        const starredBoards = getMyOpenBoardsStarsSortedByPosition(state);
        const newPos = calculatePos(position, starredBoards, boardStar);

        // ui update - so that it stays where you drop it
        dispatch(boardStarPosUpdateActionStart({ ...boardStar, pos: newPos }));

        const boardStarReponse = await API.client.rest.put<BoardStarModel>(
          `members/${idMember}/boardStars/${boardStar.id}`,
          {
            body: {
              pos: newPos,
            },
          },
        );

        // server update - update state with any other data from response
        dispatch(boardStarPosUpdateActionSuccess(boardStarReponse));
      } catch (err) {
        // error update - set to original board star state
        dispatch(boardStarPosUpdateActionError(boardStar));
      }
    }
  };
};
