'use es6';

import get from 'transmute/get';
export var getShouldListenToGdprBannerConsent = function getShouldListenToGdprBannerConsent(data) {
  return get('shouldListenToGdprBannerConsent', data);
};