import { useSharedState } from '@trello/shared-state';

import { spotlightState } from './spotlightState';

export function useSpotlight() {
  return useSharedState(spotlightState);
}
