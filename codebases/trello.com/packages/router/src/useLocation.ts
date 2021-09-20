import { useSharedState } from '@trello/shared-state';

import { locationState, LocationState } from './locationState';

export function useLocation(): LocationState {
  const [location] = useSharedState(locationState);
  return location;
}
