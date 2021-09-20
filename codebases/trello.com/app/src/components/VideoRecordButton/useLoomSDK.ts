import { useSharedState } from '@trello/shared-state';

import { loomSDKState } from './loomSDKState';

export function useLoomSDK() {
  return useSharedState(loomSDKState);
}
