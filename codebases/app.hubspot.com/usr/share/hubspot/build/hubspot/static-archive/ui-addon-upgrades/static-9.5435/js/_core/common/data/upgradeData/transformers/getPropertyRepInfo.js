'use es6';

import { createProperty } from 'ui-addon-upgrades/_core/common/data/upgradeData/transformers/createProperty';
import { fetchOwners } from 'ui-addon-upgrades/_core/common/api/fetchOwners';
import { MARKETING_SALES, IGS_NURTURING } from 'ui-addon-upgrades/_core/common/constants/RepTypes';
import logError from 'ui-addon-upgrades/_core/common/reliability/logError';
import * as tracker from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import { HAS_ASSIGNABLE_OVERRIDE } from 'ui-addon-upgrades/_core/utils/commMethodOverrides';
var PROPERTY_KEY = 'repInfo';
var OVERRIDE_ASSIGNABLE_REP_INFO = {
  link: 'https://meetings.hubspotqa.com/dfeehrer',
  name: 'Rev N. Yu',
  type: IGS_NURTURING
};
export var getPropertyRepInfo = function getPropertyRepInfo(upgradeData, upgradeSource, props) {
  if (props.allowModal === false) {
    return createProperty(PROPERTY_KEY, {});
  }

  return fetchOwners().then(function (ownerInfo) {
    var owner = null;

    if (HAS_ASSIGNABLE_OVERRIDE) {
      owner = OVERRIDE_ASSIGNABLE_REP_INFO;
    } else if (ownerInfo.MARKETING_SALES && ownerInfo.MARKETING_SALES.link) {
      owner = ownerInfo.MARKETING_SALES;
      owner.type = MARKETING_SALES;
    } else if (ownerInfo.IGS_NURTURING && ownerInfo.IGS_NURTURING.link) {
      owner = ownerInfo.IGS_NURTURING;
      owner.type = IGS_NURTURING;
    }

    return createProperty(PROPERTY_KEY, owner);
  }).catch(function (err) {
    logError('getPropertyRepInfo', err);
    tracker.track('errorInteraction', Object.assign({
      name: 'rep fetch failed'
    }, upgradeData));
    return createProperty(PROPERTY_KEY, {});
  });
};