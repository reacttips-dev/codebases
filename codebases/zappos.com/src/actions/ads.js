import throttle from 'lodash.throttle';

import { fireApsAds } from 'helpers/apsAdvertisement';
import { ADD_AD_TO_QUEUE, RESET_AD_QUEUE } from 'constants/reduxActions';

// For adding GAM ads to a single call
export const addAdToQueue = ads => (dispatch, getState) => {
  dispatch({
    type: ADD_AD_TO_QUEUE, ads
  });
  throttledFireAds(dispatch, getState);
};

export const throttledFireAds = throttle((dispatch, getState) => {
  const { ads: { queuedAds }, cookies: { hideThirdPartyAds } } = getState();
  if (queuedAds.length && !hideThirdPartyAds) {
    fireApsAds(queuedAds);
    dispatch({ type: RESET_AD_QUEUE });
  }
}, 1000, { leading: false });
