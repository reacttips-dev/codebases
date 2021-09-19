import { INFLUENCER_TRACKING_LOCAL_STORAGE_KEY } from 'constants/appConstants';
import { loadFromLocalStorage, saveToLocalStorage } from 'helpers/localStorageUtilities';

export const getInfluencerToken = () => {
  const influencerTracking = loadFromLocalStorage(INFLUENCER_TRACKING_LOCAL_STORAGE_KEY);
  const { infToken, timestamp } = influencerTracking || {};

  if (infToken && timestamp && !isNaN(timestamp)) {
    const currentTimestamp = Date.now();
    const diffInHours = (currentTimestamp - timestamp) / 3600000; // (1000 * 60 * 60)

    if (diffInHours <= 24) {
      return infToken;
    }
  }
  return undefined;
};

export const saveInfluencerToken = infToken => {
  saveToLocalStorage(INFLUENCER_TRACKING_LOCAL_STORAGE_KEY, {
    infToken,
    timestamp: Date.now()
  });
};

export const clearInfluencerLocalStorage = () => {
  localStorage.removeItem(INFLUENCER_TRACKING_LOCAL_STORAGE_KEY);
};
