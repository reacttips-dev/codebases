import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent } from '@trello/error-reporting';
import { LastVisitedBoard } from 'app/src/components/SwitcherSpotlight/types';

export const boardHasEnoughMembers = (
  boardId: string,
  lastVisitedBoard: LastVisitedBoard,
) => {
  try {
    if (!lastVisitedBoard || typeof lastVisitedBoard !== 'object') {
      return false;
    }

    const { id, collaboratorStamp } = lastVisitedBoard;
    const memberIds: number = JSON.parse(collaboratorStamp || '[]').length;

    if (boardId !== id || memberIds < 2) {
      return false;
    }

    return true;
  } catch (err) {
    sendErrorEvent(err, {
      tags: {
        ownershipArea: 'trello-workflowers',
        feature: Feature.PushTouchpointsSwitcherSpotlight,
      },
      extraData: {
        subjectMethod: 'boardHasEnoughMembers',
        boardId,
      },
    });

    return false;
  }
};
