'use es6';

import events from '../events.yaml';
import { createTracker } from 'usage-tracker';
import { screen, app } from './queryParamUtils';
export var tracker = createTracker({
  events: events,
  properties: {
    namespace: 'trial-banner-ui'
  }
});
export var syncTracker = createTracker({
  events: events,
  properties: {
    namespace: 'trial-banner-ui'
  },
  isBeforeUnload: true
});
export var getCommonTrackingProperties = function getCommonTrackingProperties(_ref) {
  var apiName = _ref.apiName,
      expiresAt = _ref.expiresAt,
      upgradeProduct = _ref.upgradeProduct,
      isMultiTrial = _ref.isMultiTrial;
  return {
    screen: screen,
    app: app,
    expires: expiresAt,
    apiName: apiName,
    upgradeProduct: upgradeProduct,
    isMultiTrial: isMultiTrial
  };
};