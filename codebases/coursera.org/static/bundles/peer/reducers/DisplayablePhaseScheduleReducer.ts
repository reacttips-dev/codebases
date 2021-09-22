import { DisplayablePhaseSchedule } from 'bundles/peer/types/PeerPermissionsAndProgresses';

import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import { ActionNames } from 'bundles/peer/actions/constants';

type Action = {
  type: typeof ActionNames.LOADED_DISPLAYABLE_PHASE_SCHEDULE;
  displayablePhaseSchedule?: DisplayablePhaseSchedule;
};

type State = {
  loaded: boolean;
  displayablePhaseSchedule?: DisplayablePhaseSchedule;
};

const initialState: State = {
  loaded: false,
  displayablePhaseSchedule: undefined,
};

function displayablePhaseSchedule(state: State = initialState, action: Action) {
  switch (action.type) {
    case ActionNames.LOADED_DISPLAYABLE_PHASE_SCHEDULE:
      return {
        ...state,
        loaded: true,
        displayablePhaseSchedule: action.displayablePhaseSchedule,
      };
    default:
      return state;
  }
}

export const store = createStoreFromReducer(
  displayablePhaseSchedule,
  'DisplayablePhaseScheduleStore',
  [ActionNames.LOADED_DISPLAYABLE_PHASE_SCHEDULE],
  initialState
);

export const reducer = displayablePhaseSchedule;
