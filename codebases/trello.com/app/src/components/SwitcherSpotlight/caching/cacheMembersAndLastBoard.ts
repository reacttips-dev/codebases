import { JoinableSiteUser } from 'app/src/components/SwitcherSpotlight/types';
import {
  getMandoPtCache,
  setMandoPtCache,
  hashCollaborators,
} from './retrieveCachedResponse';
import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent } from '@trello/error-reporting';

export const cacheMembersAndLastBoard = (
  newMembersInfo: JoinableSiteUser[] | undefined,
  boardId: string,
  userId: string,
) => {
  try {
    const cache = getMandoPtCache(userId);
    const members = newMembersInfo ?? [];

    members.forEach((member) => {
      cache.collaborators[member.accountId] = member;
    });

    cache.lastVisitedBoard = {
      id: boardId,
      collaboratorStamp: hashCollaborators(members),
    };

    setMandoPtCache(userId, cache);
  } catch (err) {
    sendErrorEvent(err, {
      tags: {
        ownershipArea: 'trello-workflowers',
        feature: Feature.PushTouchpointsSwitcherSpotlight,
      },
      extraData: {
        subjectMethod: 'cacheMembersAndLastBoard',
        membersCount: `${newMembersInfo?.length ?? 0}`,
        boardId,
      },
    });
  }
};
