import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent } from '@trello/error-reporting';
import { getMandoPtCache, setMandoPtCache } from './retrieveCachedResponse';

export const setOptimisticCardDismiss = (userId: string) => {
  try {
    const cache = getMandoPtCache(userId);
    cache.optimisticCardDismiss = true;
    setMandoPtCache(userId, cache);
  } catch (err) {
    sendErrorEvent(err, {
      tags: {
        ownershipArea: 'trello-workflowers',
        feature: Feature.PushTouchpointsSwitcherSpotlight,
      },
      extraData: {
        subjectMethod: 'setOptimisticCardDismiss',
      },
    });
  }
};
