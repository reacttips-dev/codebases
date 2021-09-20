import {
  getMandoPtCache,
  reconstructCollaborators,
} from './retrieveCachedResponse';
import { JoinableSiteUser } from 'app/src/components/SwitcherSpotlight/types';
import { NOT_A_BOARD } from 'app/src/components/SwitcherSpotlight/useCurrentBoardId';

export const replaceNonBoardWithLastVisited = (
  boardId: string,
  userId: string,
  collaborators: JoinableSiteUser[],
) => {
  const {
    lastVisitedBoard: { id, collaboratorStamp },
    collaborators: cachedCollaboratorDetails,
  } = getMandoPtCache(userId);

  const result = {
    resolvedBoardId: boardId,
    resolvedCollaborators: collaborators,
  };

  // When NOT on a board and last visited board data is there
  // Resolve to that data in order to show the correct board info
  // Inside the Switcher Menu
  if (boardId === NOT_A_BOARD && id && collaboratorStamp) {
    result.resolvedBoardId = id;
    result.resolvedCollaborators = reconstructCollaborators(
      collaboratorStamp,
      cachedCollaboratorDetails,
    );
  }

  return result;
};
