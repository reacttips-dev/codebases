'use es6';

import SafeStorage from 'SafeStorage';
import noAuthHttpClient from 'hub-http/clients/noAuthApiClient';
import authHttpClient from 'hub-http/clients/apiClient';
import { debug } from '../util/DebugUtil';
import { getCurrentPortalId } from '../util/PortalUtil';
import { getCurrentUserId } from '../util/UserUtil';
import PresenceManager from '../manager/PresenceManager';
import { catchAndRethrowNetworkError } from '../util/RavenUtil';
var DEPRECATED_KEY_PRESENCE_TOKEN = 'NOTIFICATIONS_PRESENCE_TOKEN';
var KEY_PRESENCE_TOKEN = "NOTIFICATIONS_" + getCurrentPortalId() + "_PRESENCE_TOKEN";

function getNoAuthPresenceUrl(portalId, userId) {
  return "/presence/v1/presence/portal/" + portalId + "/user/" + userId;
}

function callNoAuthPresenceEndpoint() {
  getCurrentUserId().then(function (userId) {
    return noAuthHttpClient.put(getNoAuthPresenceUrl(getCurrentPortalId(), userId), {
      data: {
        token: SafeStorage.getItem(KEY_PRESENCE_TOKEN)
      }
    });
  }).catch(catchAndRethrowNetworkError).catch(function () {
    SafeStorage.removeItem(KEY_PRESENCE_TOKEN);
  }).done();
}

function callAuthPresenceEndpoint() {
  authHttpClient.put("/presence/v1/presence").then(function (token) {
    SafeStorage.setItem(KEY_PRESENCE_TOKEN, token); // Cleanup old unnamespaced token. This code can be removed eventually

    SafeStorage.removeItem(DEPRECATED_KEY_PRESENCE_TOKEN);
  }).catch(catchAndRethrowNetworkError).catch(function (error) {
    // Stop pinging the service the user gets back a 403
    // https://hubspot.slack.com/archives/C2AR97NDV/p1574274291309800?thread_ts=1574006542.268100&cid=C2AR97NDV
    if (error && error.status && error.status === 403) {
      PresenceManager.stopPing();
    }
  }).done();
}

export function ping() {
  debug('Ping presence API');

  if (SafeStorage.getItem(KEY_PRESENCE_TOKEN)) {
    callNoAuthPresenceEndpoint();
  } else {
    callAuthPresenceEndpoint();
  }
}