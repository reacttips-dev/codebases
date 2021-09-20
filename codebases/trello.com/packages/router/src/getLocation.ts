import { locationState, LocationState } from './locationState';

export function getLocation(): LocationState {
  return locationState.value;
}
