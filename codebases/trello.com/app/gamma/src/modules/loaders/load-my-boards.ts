import API from 'app/gamma/src/api';
import { Action, actionCreator } from '@trello/redux';

import { BoardResponse, MemberResponse } from 'app/gamma/src/types/responses';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import {
  BOARD_FIELDS,
  BOARD_FIELDS_MINIMAL,
  TEAM_FIELDS_MINIMAL,
} from './fields';

import { getMissingBoardIds } from 'app/gamma/src/selectors/boards';
import { State } from 'app/gamma/src/modules/types';

// Ation types
export const LOAD_MY_BOARDS_REQUEST = Symbol('loaders/LOAD_MY_BOARDS_REQUEST');
export const LOAD_MY_BOARDS_SUCCESS = Symbol('loaders/LOAD_MY_BOARDS_SUCCESS');
export const LOAD_MY_BOARDS_ERROR = Symbol('loaders/LOAD_MY_BOARDS_ERROR');

export const LOAD_MISSING_BOARDS_REQUEST = Symbol(
  'loaders/LOAD_MISSING_BOARD_REQUEST',
);
export const LOAD_MISSING_BOARDS_SUCCESS = Symbol(
  'loaders/LOAD_MISSING_BOARD_SUCCESS',
);
export const LOAD_MISSING_BOARDS_ERROR = Symbol(
  'loaders/LOAD_MISSING_BOARD_ERROR',
);

export type LoadMyBoardsRequestAction = Action<
  typeof LOAD_MY_BOARDS_REQUEST,
  string
>;

export type LoadMyBoardsSuccessAction = Action<
  typeof LOAD_MY_BOARDS_SUCCESS,
  MemberResponse
>;

export type LoadMyBoardsErrorAction = Action<
  typeof LOAD_MY_BOARDS_ERROR,
  Error
>;

export type LoadMissingBoardsRequestAction = Action<
  typeof LOAD_MISSING_BOARDS_REQUEST,
  string[]
>;

export type LoadMissingBoardsSuccessAction = Action<
  typeof LOAD_MISSING_BOARDS_SUCCESS,
  BoardResponse[]
>;
export type LoadMissingBoardsErrorAction = Action<
  typeof LOAD_MISSING_BOARDS_ERROR,
  Error
>;

// Action creators
const loadMyBoardsRequest = actionCreator<LoadMyBoardsRequestAction>(
  LOAD_MY_BOARDS_REQUEST,
);
const loadMyBoardsSuccess = actionCreator<LoadMyBoardsSuccessAction>(
  LOAD_MY_BOARDS_SUCCESS,
);
const loadMyBoardsError = actionCreator<LoadMyBoardsErrorAction>(
  LOAD_MY_BOARDS_ERROR,
);

const loadMissingBoardsRequest = actionCreator<LoadMissingBoardsRequestAction>(
  LOAD_MISSING_BOARDS_REQUEST,
);

const loadMissingBoardsSuccess = actionCreator<LoadMissingBoardsSuccessAction>(
  LOAD_MISSING_BOARDS_SUCCESS,
);

const loadMissingBoardsErrror = actionCreator<LoadMissingBoardsErrorAction>(
  LOAD_MISSING_BOARDS_ERROR,
);

export const loadBoardsForBoardsMenu = (idMe: string): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      dispatch(loadMyBoardsRequest(idMe));

      const me = await API.client.rest.get<MemberResponse>('members/me', {
        query: {
          boards: 'open,starred',
          board_fields: BOARD_FIELDS_MINIMAL,
          boardStars: true,
          organizations: 'all',
          organization_fields: TEAM_FIELDS_MINIMAL,
          board_organization: true,
          board_organization_fields: TEAM_FIELDS_MINIMAL,
          board_myPermLevel: true,
          board_memberships: 'me',
        },
      });

      dispatch(loadMyBoardsSuccess(me));
    } catch (err) {
      dispatch(loadMyBoardsError(err));
    }

    const missingIds = getMissingBoardIds(getState());

    dispatch(loadMissingBoardsRequest(missingIds));

    try {
      const missingBoards = await Promise.all(
        missingIds.map((boardId: string) => {
          return API.client.rest.get<BoardResponse>(`boards/${boardId}`, {
            query: {
              fields: BOARD_FIELDS,
            },
          });
        }),
      );

      dispatch(loadMissingBoardsSuccess(missingBoards));
    } catch (err) {
      dispatch(loadMissingBoardsErrror(err));
    }
  };
};
