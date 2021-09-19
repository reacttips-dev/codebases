import { LOCATION_CHANGE } from 'react-router-redux';

import { ADD_AD_TO_QUEUE, RESET_AD_QUEUE } from 'constants/reduxActions';

export const defaultState = {
  queuedAds: []
};

export default function appAdvertisement(state = defaultState, action) {
  const { type, ads } = action;

  switch (type) {
    case ADD_AD_TO_QUEUE:
      return { ...state, queuedAds: state.queuedAds.concat(ads) };
    case RESET_AD_QUEUE:
    case LOCATION_CHANGE:
      return { ...state, queuedAds: [] };
    default:
      return state;
  }
}
