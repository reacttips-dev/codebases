'use es6';

import get from 'transmute/get';
export var isActiveHubSpotOwner = function isActiveHubSpotOwner(owner) {
  return Boolean(get('activeUserId', owner));
};
export var isOnlyActiveSalesforceOwner = function isOnlyActiveSalesforceOwner(owner) {
  return Boolean(get('activeSalesforceId', owner)) && !isActiveHubSpotOwner(owner);
};