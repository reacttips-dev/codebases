import { SharedState } from '@trello/shared-state';

interface NavigationState {
  isNavigating: boolean;
}

export const navigationState = new SharedState<NavigationState>({
  isNavigating: false,
});
