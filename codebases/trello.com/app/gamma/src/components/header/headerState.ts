import { SharedState } from '@trello/shared-state';

interface HeaderState {
  brandingColor: string | undefined;
  brandingLogo: string | undefined;
  brandingName: string | undefined;
}

export const headerState = new SharedState<HeaderState>({
  brandingColor: undefined,
  brandingLogo: undefined,
  brandingName: undefined,
});
