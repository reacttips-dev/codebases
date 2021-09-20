import { SharedState } from '@trello/shared-state';

type spotlightScreen =
  | 'first-nav-expanded'
  | 'second-top-nav-dropdowns'
  | 'third-search-bar'
  | 'fourth-nav-collapse';

interface SpotlightScreenState {
  screen: spotlightScreen;
  totalScreens: number;
}

export const spotlightState = new SharedState<SpotlightScreenState | undefined>(
  undefined,
);
