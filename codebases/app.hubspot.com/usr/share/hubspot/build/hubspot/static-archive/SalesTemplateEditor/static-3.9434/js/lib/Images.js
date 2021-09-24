'use es6';

import bender from 'hubspot.bender';

var getImagePath = function getImagePath(path) {
  return bender.staticDomainPrefix + "/salesImages/" + bender.depVersions.salesImages + "/" + path;
};

export var MEETINGS_PLUGIN_ZERO_STATE = getImagePath('sales-pro-onboarding/pql-modal/pql-meetings.png');