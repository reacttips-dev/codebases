'use es6';

import getSettings from 'self-service-api/api/getSettings';
import logError from 'ui-addon-upgrades/_core/common/reliability/logError';
export var getUserSettings = function getUserSettings(optionalArgs) {
  return getSettings(optionalArgs).then(function (settings) {
    return settings;
  }).catch(function (err) {
    logError('getUserSettings', err);
    return [];
  });
};