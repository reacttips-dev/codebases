'use es6';

import { FAVICON_INDICATOR } from '../constants/userAttributes';
import UserAttributesManager from '../manager/UserAttributesManager';
import { isFaviconExperimentActive } from '../util/ExperimentUtil';
import { showFaviconDot } from '../util/FaviconUtil';
import { getCurrentUserId, hasGateSync } from '../util/UserUtil';
var FAVICON_GATE = 'Notifications:Favicon';

function shouldShowFavicon() {
  if (isFaviconExperimentActive()) {
    return Promise.resolve(true);
  }

  if (!hasGateSync(FAVICON_GATE)) {
    return Promise.resolve(false);
  }

  return getCurrentUserId().then(function (userId) {
    var userAttributesManager = new UserAttributesManager(userId);
    return userAttributesManager.getAttributeValue(FAVICON_INDICATOR);
  }).then(function (attributeValue) {
    return attributeValue !== false;
  }).catch(function (e) {
    throw e;
  });
}

export function resetFavicon() {
  shouldShowFavicon().then(function (shouldShow) {
    if (shouldShow) {
      showFaviconDot(false);
    }
  }).catch(function (e) {
    throw e;
  });
}
export function setFaviconDot() {
  shouldShowFavicon().then(function (shouldShow) {
    if (shouldShow) {
      showFaviconDot(true);
    }
  }).catch(function (e) {
    throw e;
  });
}