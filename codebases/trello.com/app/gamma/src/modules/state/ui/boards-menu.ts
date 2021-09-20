/* eslint-disable import/no-default-export */

import { getBoardsMenu } from 'app/gamma/src/selectors/boards';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import {
  BoardsMenuSelectedItemModel,
  ReopenBoardPopoverModel,
} from 'app/gamma/src/types/models';
import { Action, actionCreator, createReducer } from '@trello/redux';
import {
  getSidebarValues,
  setSidebarValues,
} from 'app/gamma/src/util/application-storage/sidebar';
import {
  LOAD_MY_BOARDS_ERROR,
  LOAD_MY_BOARDS_REQUEST,
  LOAD_MY_BOARDS_SUCCESS,
} from 'app/gamma/src/modules/loaders/load-my-boards';
import {
  SET_BOARD_CLOSED,
  deleteBoardAction,
  removeMemberFromBoardAction,
  setBoardClosedAction,
} from 'app/gamma/src/modules/state/models/boards';
import {
  CREATE_BOARD_SUBMIT_DONE,
  CreateBoardSubmitDoneAction,
} from 'app/gamma/src/modules/state/ui/create-menu';
import {
  BOARD_SEARCH_SUCCESS,
  BoardSearchSuccessAction,
  RESET_PAST_QUERIES,
} from 'app/gamma/src/modules/state/models/search';
import { State } from 'app/gamma/src/modules/types';
import API from 'app/gamma/src/api';
import { getMyId } from 'app/gamma/src/selectors/session';
import { Analytics } from '@trello/atlassian-analytics';
import { BoardResponse } from 'app/gamma/src/types/responses';

type IdTeam = string | null;

// Action types
const ADD_BOARD_TO_RECENT = Symbol('ADD_BOARD_TO_RECENT');
const REMOVE_BOARD_FROM_RECENT = Symbol('REMOVE_BOARD_FROM_RECENT');
const SHOW_LESS_ACTIVE_BOARDS = Symbol('SHOW_LESS_ACTIVE_BOARDS');
const UPDATE_SIDEBAR_STATE = Symbol('UPDATE_SIDEBAR_STATE');
const TOGGLE_DELETING_BOARD = Symbol('TOGGLE_DELETING_BOARD');
const SET_BOARDS_MENU_SEARCH_TEXT = Symbol('SET_BOARDS_MENU_SEARCH_TEXT');
const SET_SELECTED_BOARD = Symbol('SET_SELECTED_BOARD');
const SET_REOPEN_BOARD_POPOVER_DATA = Symbol('SET_REOPEN_BOARD_POPOVER_DATA');

type AddBoardToRecent = Action<typeof ADD_BOARD_TO_RECENT, { id: string }>;
type RemoveBoardFromRecent = Action<
  typeof REMOVE_BOARD_FROM_RECENT,
  { id: string }
>;
type ShowLessActiveBoardsAction = Action<
  typeof SHOW_LESS_ACTIVE_BOARDS,
  IdTeam
>;

type UpdateSidebarStateAction = Action<typeof UPDATE_SIDEBAR_STATE, null>;
type ToggleDeletingBoardAction = Action<typeof TOGGLE_DELETING_BOARD, string>;
type SetBoardsMenuSearchText = Action<
  typeof SET_BOARDS_MENU_SEARCH_TEXT,
  string
>;
type SetSelectedBoardAction = Action<
  typeof SET_SELECTED_BOARD,
  BoardsMenuSelectedItemModel | null
>;
type SetReopenBoardPopoverData = Action<
  typeof SET_REOPEN_BOARD_POPOVER_DATA,
  ReopenBoardPopoverModel
>;

// Actions Creators
export const updateSidebarState = actionCreator<UpdateSidebarStateAction>(
  UPDATE_SIDEBAR_STATE,
);
export const setReopenBoardPopoverData = actionCreator<SetReopenBoardPopoverData>(
  SET_REOPEN_BOARD_POPOVER_DATA,
);
export const setBoardsMenuSelectedBoard = (
  selected: BoardsMenuSelectedItemModel | null,
) => actionCreator<SetSelectedBoardAction>(SET_SELECTED_BOARD)(selected);
export const toggleDeletingBoard = actionCreator<ToggleDeletingBoardAction>(
  TOGGLE_DELETING_BOARD,
);
export const setBoardsMenuSearchText = actionCreator<SetBoardsMenuSearchText>(
  SET_BOARDS_MENU_SEARCH_TEXT,
);
export const addBoardToRecent = actionCreator<AddBoardToRecent>(
  ADD_BOARD_TO_RECENT,
);
export const removeBoardFromRecent = actionCreator<RemoveBoardFromRecent>(
  REMOVE_BOARD_FROM_RECENT,
);
export const showLessActiveBoards = (idTeam: IdTeam) =>
  actionCreator<ShowLessActiveBoardsAction>(SHOW_LESS_ACTIVE_BOARDS)(idTeam);

// Reducer
export interface BoardsMenuState {
  idRecentBoards: string[];
  isDeletingBoard: {
    [key: string]: boolean;
  };
  loading: boolean;
  pastQueries: {
    query: string;
    limited: boolean;
  }[];
  reopenBoardPopover: ReopenBoardPopoverModel | null;
  searchText: string;
  selectedBoard: BoardsMenuSelectedItemModel | null;
  teamsShowingLessActiveBoards: IdTeam[];
}

// eslint-disable-next-line @trello/no-module-logic
const sidebar = getSidebarValues();
const initialState: BoardsMenuState = {
  idRecentBoards: (sidebar && sidebar.idRecentBoards) || [],
  isDeletingBoard: {},
  loading: false,
  pastQueries: [],
  reopenBoardPopover: null,
  searchText: '',
  selectedBoard: null,
  teamsShowingLessActiveBoards: [],
};

export default createReducer(initialState, {
  [CREATE_BOARD_SUBMIT_DONE](state, { payload }: CreateBoardSubmitDoneAction) {
    return {
      ...state,
      idRecentBoards: payload
        ? [
            payload.id,
            ...state.idRecentBoards.filter((idBoard) => idBoard !== payload.id),
          ].slice(0, 16)
        : state.idRecentBoards,
    };
  },
  [SHOW_LESS_ACTIVE_BOARDS](
    state: BoardsMenuState,
    { payload }: ShowLessActiveBoardsAction,
  ) {
    return {
      ...state,
      teamsShowingLessActiveBoards: [
        ...state.teamsShowingLessActiveBoards,
        payload,
      ],
    };
  },

  [LOAD_MY_BOARDS_REQUEST](state) {
    return {
      ...state,
      loading: true,
    };
  },

  [LOAD_MY_BOARDS_SUCCESS](state) {
    return {
      ...state,
      loading: false,
    };
  },

  [LOAD_MY_BOARDS_ERROR](state) {
    return {
      ...state,
      loading: false,
    };
  },

  [ADD_BOARD_TO_RECENT](state, { payload }: AddBoardToRecent) {
    return {
      ...state,
      // Follow the same rules as sidebar-state.js:
      // - Filter the board out of the recents list (in case it already exists)
      // - unshift the board to the beginning of the list
      // - clamp to a max size of 16
      idRecentBoards: [
        payload.id,
        ...state.idRecentBoards.filter((idBoard) => idBoard !== payload.id),
      ].slice(0, 16),
    };
  },

  [REMOVE_BOARD_FROM_RECENT](state, { payload }: RemoveBoardFromRecent) {
    return {
      ...state,
      idRecentBoards: state.idRecentBoards.filter(
        (currID) => currID !== payload.id,
      ),
    };
  },

  [TOGGLE_DELETING_BOARD](
    state,
    { payload: idBoard }: ToggleDeletingBoardAction,
  ) {
    return {
      ...state,
      isDeletingBoard: {
        ...state.isDeletingBoard,
        [idBoard]: !state.isDeletingBoard[idBoard],
      },
    };
  },

  [SET_BOARDS_MENU_SEARCH_TEXT](state, { payload }: SetBoardsMenuSearchText) {
    return {
      ...state,
      searchText: payload || '',
      selectedBoard: null,
    };
  },

  [UPDATE_SIDEBAR_STATE](state) {
    const storageState = getSidebarValues();

    return {
      ...state,
      idRecentBoards: (storageState && storageState.idRecentBoards) || [],
    };
  },

  [SET_SELECTED_BOARD](state, { payload }: SetSelectedBoardAction) {
    return {
      ...state,
      selectedBoard: payload,
    };
  },

  [SET_REOPEN_BOARD_POPOVER_DATA](
    state,
    { payload }: SetReopenBoardPopoverData,
  ) {
    return {
      ...state,
      reopenBoardPopover: payload,
    };
  },

  [SET_BOARD_CLOSED](state) {
    return {
      ...state,
      reopenBoardPopover: null,
    };
  },

  [BOARD_SEARCH_SUCCESS](state, { payload }: BoardSearchSuccessAction) {
    return {
      ...state,
      pastQueries: [
        {
          query: payload.query,
          limited: payload.limited,
          timestamp: payload.timestamp,
        },
        ...state.pastQueries,
      ].slice(0, 10),
    };
  },

  [RESET_PAST_QUERIES](state) {
    return {
      ...state,
      pastQueries: [],
    };
  },
});

// Side effects
const updateLocalStorage = (state: BoardsMenuState) => {
  setSidebarValues({
    ...getSidebarValues(),
    idRecentBoards: state.idRecentBoards,
  });
};

export const removeRecentBoardByID = (
  id: string,
): StandardThunkAction<void> => {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(removeBoardFromRecent({ id }));
    updateLocalStorage(getBoardsMenu(getState()));
  };
};

export const deleteBoard = ({
  idBoard,
  traceId,
}: {
  idBoard: string;
  traceId: string;
}): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      await API.withTracing(traceId, { task: 'delete-board' }).rest.del(
        `boards/${idBoard}`,
      );
      dispatch(deleteBoardAction(idBoard));
      Analytics.sendTrackEvent({
        action: 'deleted',
        actionSubject: 'board',
        source: 'closedBoardsModal',
        containers: {
          board: {
            id: idBoard,
          },
        },
        attributes: {
          taskId: traceId,
        },
      });
      Analytics.taskSucceeded({
        taskName: 'delete-board',
        source: 'closedBoardsModal',
        traceId,
      });
    } catch (err) {
      console.error(err);
      Analytics.taskFailed({
        taskName: 'delete-board',
        source: 'closedBoardsModal',
        error: err,
        traceId,
      });
    }
  };
};

export const removeMemberFromBoard = ({
  idBoard,
  idMember,
}: {
  idBoard: string;
  idMember: string;
}): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    const traceId = Analytics.startTask({
      taskName: 'delete-membership/board',
      source: 'closedBoardsModal',
    });

    try {
      await API.withTracing(traceId, {
        task: 'delete-membership/board',
      }).rest.del(`boards/${idBoard}/members/${idMember}`);
      dispatch(removeMemberFromBoardAction({ idBoard, idMember }));
      Analytics.sendTrackEvent({
        action: 'removed',
        actionSubject: 'member',
        source: 'closedBoardsModal',
        containers: {
          board: {
            id: idBoard,
          },
        },
        attributes: {
          taskId: traceId,
        },
      });

      Analytics.taskSucceeded({
        taskName: 'delete-membership/board',
        source: 'closedBoardsModal',
        traceId,
      });
    } catch (err) {
      console.error(err);
      Analytics.taskFailed({
        taskName: 'delete-membership/board',
        source: 'closedBoardsModal',
        traceId,
        error: err,
      });
    }
  };
};

export const removeMeFromBoard = ({
  idBoard,
}: {
  idBoard: string;
}): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const myId = getMyId(getState());
    dispatch(removeMemberFromBoard({ idBoard, idMember: myId }));
  };
};

export const setBoardClosed = ({
  idBoard,
  closed,
  keepBillableGuests = false,
  traceId,
}: {
  idBoard: string;
  closed: boolean;
  keepBillableGuests?: boolean;
  traceId: string;
}): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      const board = await API.withTracing(traceId, {
        task: 'edit-board/closed',
      }).rest.put<BoardResponse>(`boards/${idBoard}/closed`, {
        query: {
          value: closed,
          keepBillableGuests,
        },
      });
      dispatch(setBoardClosedAction(board));

      Analytics.sendTrackEvent({
        action: 'reopened',
        actionSubject: 'board',
        source: 'closedBoardsModal',
        containers: {
          board: {
            id: idBoard,
          },
        },
        attributes: {
          taskId: traceId,
        },
      });

      Analytics.taskSucceeded({
        taskName: 'edit-board/closed',
        source: 'closedBoardsModal',
        traceId,
      });
    } catch (err) {
      Analytics.taskFailed({
        taskName: 'edit-board/closed',
        source: 'closedBoardsModal',
        traceId,
        error: err,
      });
      console.error(err);
    }
  };
};
