/* eslint-disable import/no-default-export */
import { loadMemberNonPublicFields } from 'app/gamma/src/modules/loaders/load-member';
import {
  BoardResponse,
  CardResponse,
  MemberResponse,
  NotificationResponse,
  OrganizationsResponse,
  ReactionResponse,
} from 'app/gamma/src/types/responses';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';

import { Action, actionCreator, createReducer } from '@trello/redux';
import { getMemberById } from 'app/gamma/src/selectors/members';
import { State } from 'app/gamma/src/modules/types';

export const SOCKET_BOARD = Symbol('socket/SOCKET_BOARD');
export const SOCKET_CARD = Symbol('socket/SOCKET_CARD');
export const SOCKET_NOTIFICATION = Symbol('socket/SOCKET_NOTIFICATION');
export const SOCKET_REACTION = Symbol('socket/SOCKET_REACTION');
export const SOCKET_MEMBER = Symbol('socket/SOCKET_MEMBER');
export const SOCKET_ORGANIZATION = Symbol('socket/SOCKET_ORGANIZATION');
export const SOCKET_CHECK_NON_PUBLIC_AVAILABLE = Symbol(
  'socket/SOCKET_CHECK_NON_PUBLIC_AVAILABLE',
);
export const SOCKET_DROP_NON_PUBLIC = Symbol('socket/SOCKET_DROP_NON_PUBLIC');
export const SOCKET_RESET_CHECK_NON_PUBLIC_AVAILABLE = Symbol(
  'socket/SOCKET_RESET_CHECK_NON_PUBLIC_AVAILABLE',
);

export interface DeletedModel {
  id: string;
  deleted: true;
}

export type SocketBoardAction = Action<
  typeof SOCKET_BOARD,
  BoardResponse | DeletedModel
>;
export type SocketCardAction = Action<
  typeof SOCKET_CARD,
  CardResponse | DeletedModel
>;
export type SocketNotificationAction = Action<
  typeof SOCKET_NOTIFICATION,
  {
    delta: NotificationResponse | DeletedModel;
    isFilteringByUnreadNotifications: boolean;
  }
>;
export type SocketMemberAction = Action<
  typeof SOCKET_MEMBER,
  MemberResponse | DeletedModel
>;

export type SocketOrganizationAction = Action<
  typeof SOCKET_ORGANIZATION,
  OrganizationsResponse | DeletedModel
>;

export type SocketReactionAction = Action<
  typeof SOCKET_REACTION,
  ReactionResponse | DeletedModel
>;

export type SocketCheckNonPublicAvailable = Action<
  typeof SOCKET_CHECK_NON_PUBLIC_AVAILABLE,
  string
>;

export type SocketResetCheckNonPublicAvailable = Action<
  typeof SOCKET_RESET_CHECK_NON_PUBLIC_AVAILABLE,
  string
>;

export type SocketDropNonPublic = Action<typeof SOCKET_DROP_NON_PUBLIC, string>;

interface CheckedNonPublicAvailable {
  [memberid: string]: boolean;
}

export interface SocketState {
  checkedNonPublicAvailable: CheckedNonPublicAvailable;
}

const initialState: SocketState = {
  checkedNonPublicAvailable: {},
};

export default createReducer(initialState, {
  [SOCKET_CHECK_NON_PUBLIC_AVAILABLE]: (
    state,
    { payload: memberId }: SocketCheckNonPublicAvailable,
  ) => {
    return {
      ...state,
      checkedNonPublicAvailable: {
        ...state.checkedNonPublicAvailable,
        [memberId]: true,
      },
    };
  },
  [SOCKET_RESET_CHECK_NON_PUBLIC_AVAILABLE]: (
    state,
    { payload: memberId }: SocketResetCheckNonPublicAvailable,
  ) => {
    return {
      ...state,
      checkedNonPublicAvailable: {
        ...Object.entries(
          state.checkedNonPublicAvailable,
        ).reduce<CheckedNonPublicAvailable>((out, [id]) => {
          if (id !== memberId) {
            out[id] = true;
          }

          return out;
        }, {}),
      },
    };
  },
});

export const socketBoard = actionCreator<SocketBoardAction>(SOCKET_BOARD);
export const socketCard = actionCreator<SocketCardAction>(SOCKET_CARD);
const socketMemberAction = actionCreator<SocketMemberAction>(SOCKET_MEMBER);
export const socketNotification = actionCreator<SocketNotificationAction>(
  SOCKET_NOTIFICATION,
);
export const socketOrganization = actionCreator<SocketOrganizationAction>(
  SOCKET_ORGANIZATION,
);
export const socketReaction = actionCreator<SocketReactionAction>(
  SOCKET_REACTION,
);

const socketCheckNonPublicAvailable = actionCreator<SocketCheckNonPublicAvailable>(
  SOCKET_CHECK_NON_PUBLIC_AVAILABLE,
);
const socketDropNonPublic = actionCreator<SocketDropNonPublic>(
  SOCKET_DROP_NON_PUBLIC,
);
const socketResetCheckNonPublicAvailable = actionCreator<SocketResetCheckNonPublicAvailable>(
  SOCKET_RESET_CHECK_NON_PUBLIC_AVAILABLE,
);

export function isDeletedModel<T>(
  entry: T | DeletedModel,
): entry is DeletedModel {
  return entry && (entry as DeletedModel).deleted === true;
}

export const socketMember = (
  member: MemberResponse | DeletedModel,
): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    if (!isDeletedModel(member)) {
      const existingMember = getMemberById(getState(), member.id);

      if (existingMember) {
        if (member.nonPublicModified) {
          // We don't need to drop nonPublic here, as we'll reload the nonPublic
          // data and overwrite the locally cached one anyway; dropping it and
          // loading causes the UI to "flash" to the public data before reloading
          // nonPublic
          dispatch(loadMemberNonPublicFields(member.id));
        } else if (member.nonPublicAvailable) {
          const { checkedNonPublicAvailable } = getState().sockets;
          const isNonPublicAlreadyLoaded =
            existingMember.nonPublic &&
            Object.keys(existingMember.nonPublic).length > 0;

          if (
            !checkedNonPublicAvailable ||
            (!checkedNonPublicAvailable[member.id] && !isNonPublicAlreadyLoaded)
          ) {
            dispatch(loadMemberNonPublicFields(member.id));
            dispatch(socketCheckNonPublicAvailable(member.id));
          }
        } else {
          dispatch(socketDropNonPublic(member.id));
          if (!member.nonPublicAvailable) {
            dispatch(socketResetCheckNonPublicAvailable(member.id));
          }
        }
      }
    }

    dispatch(socketMemberAction(member));
  };
};
