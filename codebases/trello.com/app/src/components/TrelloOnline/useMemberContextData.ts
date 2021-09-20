import { useMemberContextDataQuery } from './MemberContextDataQuery.generated';
import { sendErrorEvent } from '@trello/error-reporting';

export const useMemberContextData = () => {
  const { data, error } = useMemberContextDataQuery();

  if (error)
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-nusku' },
    });

  return data;
};
