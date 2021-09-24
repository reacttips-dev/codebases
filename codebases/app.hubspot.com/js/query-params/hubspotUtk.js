'use es6';

import { getWindowLocation } from './getWindowLocation';
import { setQueryParam } from './setQueryParam';
export var getHubspotUtk = function getHubspotUtk() {
  return getWindowLocation().paramValue('hubspotUtk');
};
export var setHubspotUtk = function setHubspotUtk(value) {
  setQueryParam({
    key: 'hubspotUtk',
    value: value
  });
};