import { useMemo } from 'react';
import { memberId } from '@trello/session-cookie';
import { useTrelloInviteFromSlackQuery } from './TrelloInviteFromSlackQuery.generated';

export const useTrelloInviteFromSlack = (idBoard: string, skip: boolean) => {
  const { data, loading, error } = useTrelloInviteFromSlackQuery({
    variables: {
      memberId: memberId || 'me',
      idBoard: idBoard,
    },
    skip,
  });
  const isSlackSeachDisabledKey =
    'slack-search-disabled-' + memberId + '-' + data?.board?.shortLink;
  const oneTimeMessagesDismissed = useMemo(
    () => data?.member?.oneTimeMessagesDismissed ?? [],
    [data?.member?.oneTimeMessagesDismissed],
  );
  const isSlackSearchDismissed = oneTimeMessagesDismissed.includes(
    isSlackSeachDisabledKey,
  );

  return {
    isSlackSearchDismissed,
    loading,
    error,
  };
};
