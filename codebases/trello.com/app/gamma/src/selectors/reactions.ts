import { ReactionAnalyticsContextType } from 'app/gamma/src/components/reaction-analytics-context/context';
import { State } from 'app/gamma/src/modules/types';
import { isMe } from 'app/gamma/src/selectors/session';
import { canComment } from 'app/gamma/src/selectors/boards';
import { MemberModel, ReactorsNames } from 'app/gamma/src/types/models';
import {
  getNotificationByActionId,
  getNotificationGroupByNotificationId,
} from './notifications';

export const getReactionsByActionId = (state: State, idAction?: string) => {
  const reactions = idAction ? state.models.reactions.reactions[idAction] : [];

  return reactions || [];
};

export const findMyReaction = (
  state: State,
  idEmoji: string,
  idAction?: string,
) => {
  const reactions = getReactionsByActionId(state, idAction);

  return reactions.find(
    (reaction) =>
      reaction.idEmoji === idEmoji && isMe(state, reaction.idMember),
  );
};

export const getPendingUpdates = (state: State) =>
  state.models.reactions.pendingUpdates;

export const getReactionAnalyticsContextByActionId = (
  state: State,
  idAction?: string,
): ReactionAnalyticsContextType => {
  if (!idAction) {
    return {
      actionId: '',
      boardId: '',
      cardId: '',
      listId: '',
    };
  }

  const notification = getNotificationByActionId(state, idAction);
  const notificationGroup = notification
    ? getNotificationGroupByNotificationId(state, notification.id)
    : null;

  return {
    actionId: idAction,
    boardId:
      (notification &&
        notification.data &&
        notification.data.board &&
        notification.data.board.id) ||
      '',
    cardId:
      (notification &&
        notification.data &&
        notification.data.card &&
        notification.data.card.id) ||
      '',
    listId:
      (notificationGroup &&
        notificationGroup.card &&
        notificationGroup.card.list &&
        notificationGroup.card.list.id) ||
      '',
  };
};

export const checkReactionPerms = (
  state: State,
  member: MemberModel,
  idBoard: string,
) => {
  return canComment(state, member, idBoard);
};

export const getMemberReactorsFullNames = (
  state: State,
  idAction: string,
): ReactorsNames => {
  const reactions = getReactionsByActionId(state, idAction);

  const uniqueReactors = [];
  const memberIdMap = new Map();
  for (const reaction of reactions) {
    if (!memberIdMap.has(reaction.member.id)) {
      memberIdMap.set(reaction.member.id, true);
      if (reaction.member && reaction.member.id && reaction.member.name) {
        uniqueReactors.push({
          id: reaction.member.id,
          name: reaction.member.name,
        });
      }
    }
  }

  return uniqueReactors;
};
