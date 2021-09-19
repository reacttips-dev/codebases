import {
  LOCATION_UPDATED,
  RAFFLE_SUBMIT_ERROR,
  RAFFLE_SUBMIT_IN_PROGRESS,
  RAFFLE_SUBMIT_SUCCESS
} from 'constants/reduxActions';

export const defaultState = {
  inProgress: false,
  success: false,
  error: null
};

export default function raffle(state = defaultState, action) {
  const { type } = action;

  switch (type) {
    case RAFFLE_SUBMIT_SUCCESS:
      return { ...defaultState, success: true };
    case RAFFLE_SUBMIT_ERROR:
      return { ...defaultState, error: true };
    case RAFFLE_SUBMIT_IN_PROGRESS:
      return { ...defaultState, inProgress: true };
    case LOCATION_UPDATED:
      return defaultState;
    default:
      return state;
  }
}
