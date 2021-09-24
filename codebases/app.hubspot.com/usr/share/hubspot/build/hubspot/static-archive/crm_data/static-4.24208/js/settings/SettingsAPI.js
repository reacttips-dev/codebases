'use es6';

import quickFetch from 'quick-fetch';
import { Map as ImmutableMap, fromJS } from 'immutable';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { enforceKey, enforcePortalId } from './SettingsAPICommon';
import { logError } from 'customer-data-ui-utilities/eventLogging/eventLogger';
var defaultQuery = fromJS({
  length: 500,
  internal: false
});

function reduceSetting(reduction, setting) {
  return reduction.set(setting.get('key'), setting.get('value'));
}

function parseSettings(results) {
  return results.get('settings').reduce(reduceSetting, ImmutableMap());
}

function setQuery(portalId, key, value) {
  return {
    hubId: portalId,
    internal: false,
    key: key,
    value: value
  };
}

function uri(portalId) {
  return "hubs-settings/v1/hubs/" + portalId + "/settings";
}

function getSettings(portalId) {
  enforcePortalId(portalId);
  return ImmutableAPI.get(uri(portalId), defaultQuery.toJS()).then(parseSettings);
}

export function fetch(portalId) {
  var earlySettingsRequest = quickFetch.getRequestStateByName('hubSettingsQuickFetch');

  if (earlySettingsRequest) {
    return new Promise(function (resolve, reject) {
      earlySettingsRequest.whenFinished(function (response) {
        quickFetch.removeEarlyRequest('hubSettingsQuickFetch');
        resolve(parseSettings(fromJS(response)));
      });
      earlySettingsRequest.onError(function (request, error) {
        logError({
          error: new Error('SettingsAPI: Settings early requester failed'),
          extraData: {
            request: request,
            error: error
          },
          tags: {
            requestName: 'Hub Settings'
          }
        });
        quickFetch.removeEarlyRequest('hubSettingsQuickFetch');
        reject(ImmutableMap());
      });
    }).catch(function () {
      return getSettings(portalId);
    });
  }

  return getSettings(portalId);
}
export function set(portalId, key, value) {
  enforcePortalId(portalId);
  enforceKey(key);
  return ImmutableAPI.post(uri(portalId), setQuery(portalId, key, value));
}
export function del(portalId, key) {
  enforcePortalId(portalId);
  enforceKey(key);
  return ImmutableAPI.delete(uri(portalId) + "/" + key, defaultQuery.toJS());
}