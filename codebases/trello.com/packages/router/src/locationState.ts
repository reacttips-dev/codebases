import { SharedState } from '@trello/shared-state';

export interface LocationState {
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
}

const { pathname, search, hash, hostname } = window.location;
export const locationState = new SharedState<LocationState>({
  hostname,
  pathname,
  search,
  hash,
});
