/* eslint-disable import/no-default-export */
import api from 'app/gamma/src/api';
import { normalizeReactionsFromNotificationGroups } from 'app/gamma/src/api/normalizers/notification';
import { normalizeReaction } from 'app/gamma/src/api/normalizers/reaction';
import { Analytics } from '@trello/atlassian-analytics';
import { showFlag } from '@trello/nachos/experimental-flags';
import debounce from 'debounce';
import { State } from 'app/gamma/src/modules/types';
import { forTemplate } from '@trello/i18n';

import {
  LOAD_NOTIFICATION_GROUPS_SUCCESS,
  LOAD_UNREAD_NOTIFICATIONS_SUCCESS,
  LoadNotificationGroupsSuccessAction,
  LoadUnreadNotificationsSuccessAction,
} from 'app/gamma/src/modules/loaders/load-notifications';
import {
  isDeletedModel,
  SOCKET_REACTION,
  SocketReactionAction,
  SOCKET_NOTIFICATION,
  SocketNotificationAction,
} from 'app/gamma/src/modules/sockets';
import { getMe } from 'app/gamma/src/selectors/members';
import {
  findMyReaction,
  getPendingUpdates,
  getReactionAnalyticsContextByActionId,
} from 'app/gamma/src/selectors/reactions';
import {
  ReactionResponse,
  NotificationGroupResponse,
} from 'app/gamma/src/types/responses';
import { ReactionModel } from 'app/gamma/src/types/models';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator, createReducer } from '@trello/redux';
import { convertSkinToServerFormat } from 'app/gamma/src/util/model-helpers/reactions';

const format = forTemplate('reactions');

interface ToggleReactionParams {
  idAction: string;
  reaction: ReactionModel;
}

interface PendingUpdate {
  reaction: ReactionModel;
  idAction: string;
  type: 'add' | 'remove';
}

const addReactionApi = (
  idAction: string,
  body: { skinVariation: string; unified: string } | object = {},
) =>
  api.client.rest.post<ReactionResponse>(`actions/${idAction}/reactions`, {
    body,
  });
const removeReactionApi = (idAction: string, reactionId: string) =>
  api.client.rest.del(`actions/${idAction}/reactions/${reactionId}`);

export const ADD_REACTION_REQUEST = Symbol('models/ADD_REACTION_REQUEST');
export const ADD_REACTION_SUCCESS = Symbol('models/ADD_REACTION_SUCCESS');
export const ADD_REACTION_FAILURE = Symbol('models/ADD_REACTION_FAILURE');
export const REMOVE_REACTION_REQUEST = Symbol('models/REMOVE_REACTION_REQUEST');
export const REMOVE_REACTION_FAILURE = Symbol('models/REMOVE_REACTION_FAILURE');
const REGISTER_PENDING_REACTION_UPDATE = Symbol(
  'models/REGISTER_PENDING_REACTION_UPDATE',
);
const CLEAR_PENDING_REACTION_UPDATES = Symbol(
  'models/CLEAR_PENDING_REACTION_UPDATES',
);

export type AddReactionRequest = Action<
  typeof ADD_REACTION_REQUEST,
  ReactionModel
>;
export type AddReactionSuccess = Action<
  typeof ADD_REACTION_SUCCESS,
  ReactionModel
>;
export type AddReactionFailure = Action<
  typeof ADD_REACTION_FAILURE,
  ReactionModel
>;
export type RemoveReactionRequest = Action<
  typeof REMOVE_REACTION_REQUEST,
  ReactionModel
>;
export type RemoveReactionFailure = Action<
  typeof REMOVE_REACTION_FAILURE,
  ReactionModel
>;
type RegisterPendingReactionUpdate = Action<
  typeof REGISTER_PENDING_REACTION_UPDATE,
  PendingUpdate
>;
type ClearPendingReactionUpdates = Action<
  typeof CLEAR_PENDING_REACTION_UPDATES,
  void
>;

export const addReactionRequest = actionCreator<AddReactionRequest>(
  ADD_REACTION_REQUEST,
);
export const addReactionSuccess = actionCreator<AddReactionSuccess>(
  ADD_REACTION_SUCCESS,
);
export const addReactionFailure = actionCreator<AddReactionFailure>(
  ADD_REACTION_FAILURE,
);
export const removeReactionRequest = actionCreator<RemoveReactionRequest>(
  REMOVE_REACTION_REQUEST,
);
export const removeReactionFailure = actionCreator<RemoveReactionFailure>(
  REMOVE_REACTION_FAILURE,
);
const registerPendingReactionUpdate = actionCreator<RegisterPendingReactionUpdate>(
  REGISTER_PENDING_REACTION_UPDATE,
);
const clearPendingReactionUpdates = actionCreator<ClearPendingReactionUpdates>(
  CLEAR_PENDING_REACTION_UPDATES,
);

export interface ReactionState {
  reactions: { [idModel: string]: ReactionModel[] };
  pendingUpdates: {
    [idUpdate: string]: PendingUpdate;
  };
}

const initialState: ReactionState = {
  reactions: {},
  pendingUpdates: {},
};

const cloneState = (state: ReactionState) => {
  const newState: ReactionState = {
    reactions: {},
    pendingUpdates: {},
  };
  Object.keys(state.reactions).forEach((key) => {
    newState.reactions[key] = state.reactions[key].slice();
  });
  Object.keys(state.pendingUpdates).forEach((key) => {
    newState.pendingUpdates[key] = state.pendingUpdates[key];
  });

  return newState;
};

const getPendingUpdateId = (
  idAction: string,
  idEmoji: string,
  idMember: string,
) => {
  // Key pending updates without reaction.id, since it may not exist yet.
  // type: 'add' and type: 'remove' will have the same idUpdate.
  const idUpdate = `${idAction}_${idEmoji}_${idMember}`;

  return idUpdate;
};

const addReactionReducer = (
  state: ReactionState,
  reaction: ReactionModel,
): ReactionState => {
  const newState = cloneState(state);

  if (!newState.reactions[reaction.idModel]) {
    newState.reactions[reaction.idModel] = [];
  }

  newState.reactions[reaction.idModel].push(reaction);

  return newState;
};

const removeReactionReducer = (
  state: ReactionState,
  payload: ReactionModel,
): ReactionState => {
  const newState = cloneState(state);
  newState.reactions[payload.idModel] = newState.reactions[
    payload.idModel
  ].filter(
    (reaction) =>
      reaction.idEmoji !== payload.idEmoji ||
      reaction.idMember !== payload.idMember,
  );

  return newState;
};

const updateReactionReducer = (
  state: ReactionState,
  payload: ReactionModel,
): ReactionState => {
  const newState = cloneState(state);

  // replace the tempReaction (without an id) with the payload
  newState.reactions[payload.idModel] = newState.reactions[payload.idModel].map(
    (reaction) => {
      if (
        reaction.idEmoji === payload.idEmoji &&
        reaction.idMember === payload.idMember
      ) {
        return payload;
      }

      return reaction;
    },
  );

  // Update pendingUpdates as well. The user could have added a pendingUpdate to
  // remove the reaction while the "add reaction" API call was in progress.
  for (const idUpdate in newState.pendingUpdates) {
    const { reaction, idAction } = newState.pendingUpdates[idUpdate];

    if (
      idAction === payload.idModel &&
      reaction.idEmoji === payload.idEmoji &&
      reaction.idMember === payload.idMember
    ) {
      newState.pendingUpdates[idUpdate].reaction = payload;
    }
  }

  return newState;
};

const loadReactionsFromNotifications = (
  state: ReactionState,
  notificationGroupsResponse: NotificationGroupResponse[],
): ReactionState => {
  const newState = cloneState(state);

  const reactionsModel = normalizeReactionsFromNotificationGroups(
    notificationGroupsResponse,
  );
  reactionsModel.forEach((reactionModel) => {
    const idModel = reactionModel.idModel;

    if (!newState.reactions[idModel]) {
      newState.reactions[idModel] = [];
    }

    if (
      !newState.reactions[idModel].some(
        (reaction) => reaction.id === reactionModel.id,
      )
    ) {
      newState.reactions[idModel].push(reactionModel);
    }
  });

  return newState;
};

export default createReducer(initialState, {
  [LOAD_NOTIFICATION_GROUPS_SUCCESS](
    state,
    { payload }: LoadNotificationGroupsSuccessAction,
  ) {
    const { notificationGroupsResponse } = payload;

    return loadReactionsFromNotifications(state, notificationGroupsResponse);
  },
  [LOAD_UNREAD_NOTIFICATIONS_SUCCESS](
    state,
    { payload }: LoadUnreadNotificationsSuccessAction,
  ) {
    const { notificationGroupsResponse } = payload;

    return loadReactionsFromNotifications(state, notificationGroupsResponse);
  },
  [SOCKET_NOTIFICATION](state, { payload }: SocketNotificationAction) {
    const { delta } = payload;

    if (isDeletedModel(delta)) {
      return state;
    } else if (delta && delta.data && delta.data.card && delta.data.card.id) {
      const notificationGroupsResponse: NotificationGroupResponse[] = [
        {
          card: delta.data.card,
          id: `Card:${delta.data.card.id}`,
          notifications: [delta],
        },
      ];

      return loadReactionsFromNotifications(state, notificationGroupsResponse);
    } else {
      return state;
    }
  },
  [ADD_REACTION_REQUEST](state, { payload }: AddReactionRequest) {
    return addReactionReducer(state, payload);
  },
  [ADD_REACTION_SUCCESS](state, { payload }: AddReactionSuccess) {
    return updateReactionReducer(state, payload);
  },
  [ADD_REACTION_FAILURE](state, { payload }: AddReactionFailure) {
    return removeReactionReducer(state, payload);
  },
  [REMOVE_REACTION_REQUEST](state, { payload }: RemoveReactionRequest) {
    return removeReactionReducer(state, payload);
  },
  [REMOVE_REACTION_FAILURE](state, { payload }: RemoveReactionFailure) {
    // Ignore removal failures. They're usually 404s, meaning the reaction
    // already got removed by a previous request (possibly from another tab).
    return state;
  },
  [SOCKET_REACTION](state, { payload }: SocketReactionAction) {
    if (isDeletedModel(payload)) {
      // Find the reaction in the state and remove it, because the deleted
      // response object only provides a single reaction id we have to comb
      // through all the reaction groups to find the given reaction model.
      return {
        ...state,
        reactions: Object.entries(state.reactions).reduce<{
          [idModel: string]: ReactionModel[];
        }>((acc, [idModel, reactionGroup]) => {
          acc[idModel] = reactionGroup.filter(
            (reaction) => reaction.id !== payload.id,
          );

          return acc;
        }, {}),
      };
    } else {
      // See if the reaction has already been added to the state,
      // if it has don't add it again, if not add it the reaction group.
      const normalizedPayload = normalizeReaction(payload);

      const reactionGroup = state.reactions[payload.idModel] || [];
      const existingReaction =
        reactionGroup.some(
          (reaction) =>
            reaction.idEmoji === normalizedPayload.idEmoji &&
            reaction.idMember === normalizedPayload.idMember,
        ) ||
        state.pendingUpdates[
          getPendingUpdateId(payload.idModel, payload.idEmoji, payload.idMember)
        ];

      return existingReaction
        ? updateReactionReducer(state, normalizedPayload)
        : {
            ...state,
            reactions: {
              ...state.reactions,
              [payload.idModel]: [
                ...(state.reactions[payload.idModel] || []),
                normalizedPayload,
              ],
            },
          };
    }
  },
  [REGISTER_PENDING_REACTION_UPDATE](
    state,
    { payload }: RegisterPendingReactionUpdate,
  ) {
    let newState = cloneState(state);
    const { reaction, idAction, type } = payload;
    const idUpdate = getPendingUpdateId(
      idAction,
      reaction.idEmoji,
      reaction.idMember,
    );

    if (newState.pendingUpdates[idUpdate]) {
      // If this idUpdate already exists, that means they're undoing a pending
      // update.

      // Undo the optistic update
      if (type === 'add') {
        // Revert the tempReaction to the removed reaction
        newState = updateReactionReducer(
          newState,
          newState.pendingUpdates[idUpdate].reaction,
        );
      }

      // Cancel the update
      delete newState.pendingUpdates[idUpdate];
    } else {
      // Otherwise, queue the pending update.
      newState.pendingUpdates[idUpdate] = payload;
    }

    return newState;
  },
  [CLEAR_PENDING_REACTION_UPDATES](state) {
    const newState = cloneState(state);

    newState.pendingUpdates = {};

    return newState;
  },
});

/*
These limits live on the server: app/data/limits.js
Limits are attached to actions but not exposed to notifications
https://trello.atlassian.net/browse/WLRS-122 Add reaction limits to notifications
This will help to show the red box immediately rather than making the api request
*/
enum ReactionLimits {
  perAction = 1000,
  uniquePerAction = 17,
}

enum ReactionErrorName {
  ACTION_TOO_MANY_TOTAL_REACTIONS = 'ACTION_TOO_MANY_TOTAL_REACTIONS',
  ACTION_TOO_MANY_UNIQUE_REACTIONS = 'ACTION_TOO_MANY_UNIQUE_REACTIONS',
}

export const debouncedPersistUpdates = debounce((dispatch: Dispatch) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  dispatch(persistUpdates());
}, 1000);

function persistUpdates(): StandardThunkAction {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const pendingUpdates = getPendingUpdates(state);
    dispatch(clearPendingReactionUpdates());

    await Promise.all(
      Object.values(pendingUpdates).map(async (pendingUpdate) => {
        const { idAction, reaction, type } = pendingUpdate;

        const analyticsContext = getReactionAnalyticsContextByActionId(
          state,
          idAction,
        );

        const { actionId, boardId, cardId, listId } = analyticsContext;

        if (type === 'add') {
          try {
            Analytics.sendTrackEvent({
              action: 'added',
              actionSubject: 'reaction',
              source: 'reactionSelectorInlineDialog',
              attributes: {
                reactionId: pendingUpdate.reaction.emoji.id.toLowerCase(),
                commentId: actionId,
                addedTo: 'notificationComment',
              },
              containers: {
                ...(cardId && {
                  card: {
                    id: cardId,
                  },
                }),
                ...(listId && {
                  list: {
                    id: listId,
                  },
                }),
                ...(boardId && {
                  board: {
                    id: boardId,
                  },
                }),
              },
            });

            const newReactionResponse = await addReactionApi(idAction, {
              skinVariation:
                convertSkinToServerFormat(reaction.emoji.skin) || undefined,
              unified: reaction.emoji.unified.toUpperCase(),
            });
            const newReaction = normalizeReaction(newReactionResponse);

            dispatch(addReactionSuccess(newReaction));
          } catch (err) {
            console.error(err);
            const alertNames = ReactionErrorName as { [key: string]: string };
            const alertName = alertNames[err.responseData.error];
            dispatch(addReactionFailure(reaction));

            showFlag({
              id: 'reactions',
              appearance: 'error',
              title:
                alertName === ReactionErrorName.ACTION_TOO_MANY_UNIQUE_REACTIONS
                  ? format('unique-reaction-limit-exceeded', {
                      heart: '❤',
                      number: ReactionLimits.uniquePerAction.toString(),
                    })
                  : format('total-reaction-limit-exceeded', {
                      heart: '❤',
                      number: ReactionLimits.perAction.toString(),
                    }),
              isAutoDismiss: true,
              msTimeout: 3000,
            });
          }
        } else if (type === 'remove') {
          if (!reaction.id) {
            // This means that they're trying to remove an action while the "add
            // reaction" API request is in progress. Wait until the next
            // debounce and try again.
            dispatch(registerPendingReactionUpdate(pendingUpdate));
            window.setTimeout(() => {
              // debounce library doesn't handle recursive calls
              debouncedPersistUpdates(dispatch);
            });

            return;
          }

          try {
            await removeReactionApi(idAction, reaction.id);

            Analytics.sendUIEvent({
              action: 'removed',
              actionSubject: 'reaction',
              source: 'reactionSelectorInlineDialog',
              attributes: {
                reactionId: pendingUpdate.reaction.emoji.id.toLowerCase(),
                commentId: actionId,
                removedFrom: 'notificationComment',
              },
              containers: {
                ...(cardId && {
                  card: {
                    id: cardId,
                  },
                }),
                ...(listId && {
                  list: {
                    id: listId,
                  },
                }),
                ...(boardId && {
                  board: {
                    id: boardId,
                  },
                }),
              },
            });
          } catch (err) {
            console.error(err);
            dispatch(removeReactionFailure(reaction)); // add back reaction
          }
        }
      }),
    );
  };
}

const addReaction = ({
  idAction,
  reaction,
}: ToggleReactionParams): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const me = getMe(state);
    if (!me) {
      return;
    }

    const tempReaction = {
      ...reaction,
      id: '',
      idEmoji: reaction.idEmoji.toUpperCase(),
      idMember: me.id,
      member: me,
    };

    dispatch(addReactionRequest(tempReaction));
    dispatch(
      registerPendingReactionUpdate({
        idAction,
        reaction: tempReaction,
        type: 'add',
      }),
    );

    debouncedPersistUpdates(dispatch);
  };
};

const removeReaction = ({
  idAction,
  reaction,
}: ToggleReactionParams): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const myReaction = findMyReaction(
      state,
      reaction.idEmoji.toUpperCase(),
      idAction,
    );

    if (!myReaction) {
      return;
    }

    dispatch(removeReactionRequest(myReaction));
    dispatch(
      registerPendingReactionUpdate({
        idAction,
        reaction: myReaction,
        type: 'remove',
      }),
    );
    debouncedPersistUpdates(dispatch);
  };
};

export const toggleReaction = ({
  idAction,
  reaction,
}: ToggleReactionParams): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const myReaction = findMyReaction(
      state,
      reaction.idEmoji.toUpperCase(),
      idAction,
    );

    if (myReaction) {
      dispatch(removeReaction({ idAction, reaction }));
    } else {
      dispatch(addReaction({ idAction, reaction }));
    }
  };
};
