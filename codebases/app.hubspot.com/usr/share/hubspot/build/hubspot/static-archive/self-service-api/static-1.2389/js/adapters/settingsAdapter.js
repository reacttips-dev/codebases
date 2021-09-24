'use es6';

import { fromJS } from 'immutable';
import { listToMap } from 'self-service-api/core/utilities/listToMap';

var settingsAdapter = function settingsAdapter(settings) {
  return fromJS(listToMap(settings.settings, 'key'));
};

export default settingsAdapter;