import { useBoardQuery } from './BoardQuery.generated';
import { sendErrorEvent } from '@trello/error-reporting';

export const useOrgIdFromBoard = (boardId: string): string => {
  const { data, error } = useBoardQuery({
    variables: { id: boardId },
    skip: !boardId,
  });

  if (error)
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-nusku' },
    });

  return data?.board?.idOrganization ?? '';
};
