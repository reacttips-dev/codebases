'use es6';

import { fetchSettings } from 'self-service-api/core/api/settingsApi';
import settingsAdapter from 'self-service-api/adapters/settingsAdapter';

var getSettings = function getSettings(optionalArgs) {
  return fetchSettings(optionalArgs).then(settingsAdapter);
};

export default getSettings;