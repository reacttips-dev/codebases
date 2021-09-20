import { client } from '@trello/graphql';
import { Action, actionCreator } from '@trello/redux';
import { memberId } from '@trello/session-cookie';
import { BoardResponse } from 'app/gamma/src/types/responses';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { ClosedBoardsDocument } from './ClosedBoardsQuery.generated';

// Action types
export const LOAD_CLOSED_BOARDS_REQUEST = Symbol(
  'loaders/LOAD_CLOSED_BOARDS_REQUEST',
);
export const LOAD_CLOSED_BOARDS_SUCCESS = Symbol(
  'loaders/LOAD_CLOSED_BOARDS_SUCCESS',
);
export const LOAD_CLOSED_BOARDS_ERROR = Symbol(
  'loaders/LOAD_CLOSED_BOARDS_ERROR',
);

export type LoadClosedBoardsRequestAction = Action<
  typeof LOAD_CLOSED_BOARDS_REQUEST,
  null
>;
export type LoadClosedBoardsSuccessAction = Action<
  typeof LOAD_CLOSED_BOARDS_SUCCESS,
  BoardResponse[]
>;
export type LoadClosedBoardsErrorAction = Action<
  typeof LOAD_CLOSED_BOARDS_ERROR,
  Error
>;

// Action creators
const loadClosedBoardsRequest = actionCreator<LoadClosedBoardsRequestAction>(
  LOAD_CLOSED_BOARDS_REQUEST,
);
export const loadClosedBoardsSuccess = actionCreator<LoadClosedBoardsSuccessAction>(
  LOAD_CLOSED_BOARDS_SUCCESS,
);
const loadClosedBoardsError = actionCreator<LoadClosedBoardsErrorAction>(
  LOAD_CLOSED_BOARDS_ERROR,
);

export const loadClosedBoards = (): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(loadClosedBoardsRequest());

    const { data, error } = await client.query({
      query: ClosedBoardsDocument,
      variables: {
        id: memberId || '',
      },
      fetchPolicy: 'network-only',
    });

    if (error) {
      dispatch(loadClosedBoardsError(error));
    } else if (data) {
      dispatch(loadClosedBoardsSuccess(data?.member?.boards));
    }
  };
};
