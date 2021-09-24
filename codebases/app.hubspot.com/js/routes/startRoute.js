'use es6';

import * as params from 'hub-http/helpers/params';
import { fetch as settingsFetch } from 'crm_data/settings/SettingsAPI';
import PortalIdParser from 'PortalIdParser';
import links from 'crm-legacy-links/links';
import { history } from '../router/history';
import { ATMENTION_USER_INVITE_MAP } from 'crm_data/constants/PortalSettingsKeys';
export function startRoute() {
  var _ref = params.parse(window.location.search.substring(1)) || {},
      email = _ref.email;

  if (!email) {
    history.push('/contacts');
  }

  settingsFetch(PortalIdParser.get()).then(function (results) {
    try {
      var _JSON$parse = JSON.parse(results.get(ATMENTION_USER_INVITE_MAP + ":" + email)),
          objectId = _JSON$parse.objectId,
          objectType = _JSON$parse.objectType;

      window.location.href = links.fromObjectTypeAndId(objectType, objectId, true);
    } catch (error) {
      history.push('/contacts');
    }
  }).done();
}