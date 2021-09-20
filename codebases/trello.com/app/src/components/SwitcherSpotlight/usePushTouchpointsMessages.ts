import { useCallback } from 'react';
import { usePushTouchpointsDismissOneTimeMessageMutation } from './PushTouchpointsDismissOneTimeMessageMutation.generated';
import { usePushTouchpointsOneTimeMessageQuery } from './PushTouchpointsOneTimeMessageQuery.generated';

export const DISMISS_NUDGE = 'mando-pt-dismiss-nudge';
export const DISMISS_CARD = 'mando-pt-dismiss-card';
export const DISMISS_HIGHLIGHT = 'mando-pt-dismiss-highlight';

type UsePushTouchpointsMessages = [
  {
    nudgeDismissed: boolean;
    cardDismissed: boolean;
    highlightDismissed: boolean;
  },
  (message: string) => void,
];

export const usePushTouchpointsMessages = (): UsePushTouchpointsMessages => {
  const [
    dismissOneTimeMessage,
  ] = usePushTouchpointsDismissOneTimeMessageMutation();
  const { data } = usePushTouchpointsOneTimeMessageQuery();
  const { oneTimeMessagesDismissed: otmdList } = data?.member || {};

  const nudgeDismissed = !!otmdList?.includes(DISMISS_NUDGE);
  const cardDismissed = !!otmdList?.includes(DISMISS_CARD);
  const highlightDismissed = !!otmdList?.includes(DISMISS_HIGHLIGHT);

  const dismiss = useCallback(
    (message: string) => {
      dismissOneTimeMessage({
        variables: { messageId: message },
        optimisticResponse: {
          __typename: 'Mutation',
          addOneTimeMessagesDismissed: {
            id: 'me',
            oneTimeMessagesDismissed: otmdList?.concat([message]),
            __typename: 'Member',
          },
        },
      });
    },
    [dismissOneTimeMessage, otmdList],
  );

  return [{ nudgeDismissed, cardDismissed, highlightDismissed }, dismiss];
};
