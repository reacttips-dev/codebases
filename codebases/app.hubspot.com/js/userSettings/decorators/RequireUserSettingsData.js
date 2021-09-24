'use es6';

import fetchAsyncDataHOC from '../../async-data-fetcher/fetchAsyncDataHOC';
import { withRequire } from '../../async-data-fetcher/withRequire';
import { getUserSettings as requestor } from '../actions/userSettingsActions';
import { USER_SETTINGS_KEYS } from '../constants/UserSettingsKeys';
import { getUserSettingsAsyncDataFromState as selector } from '../selectors/getUserSettingsData';
var RequireUserSettingsData = fetchAsyncDataHOC({
  name: 'RequireUserSettingsData',
  requestor: requestor,
  selector: selector,
  shouldAutoRetry: true,
  resolveRequestParams: function resolveRequestParams() {
    return {
      userSettingsKeys: USER_SETTINGS_KEYS
    };
  }
});
export var withUserSettingsData = withRequire(RequireUserSettingsData);