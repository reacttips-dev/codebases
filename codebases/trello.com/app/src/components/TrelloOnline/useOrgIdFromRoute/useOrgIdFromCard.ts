import { useCardQuery } from './CardQuery.generated';
import { useOrgIdFromBoard } from './useOrgIdFromBoard';
import { sendErrorEvent } from '@trello/error-reporting';

export const useOrgIdFromCard = (cardId: string): string => {
  const { data, error } = useCardQuery({
    variables: { id: cardId },
    skip: !cardId,
  });

  if (error)
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-nusku' },
    });

  const boardId = data?.card?.idBoard || '';
  return useOrgIdFromBoard(boardId);
};
