'use es6';

import { connectPromiseSingle } from 'crm_data/flux/connectPromiseSingle';
import CurrentOwnerIdStore from 'crm_data/owners/CurrentOwnerIdStore';
import Immutable from 'immutable';
import * as ImmutableAPI from './ImmutableAPI';
import { getFrom, hasFrom, setFrom } from '../settings/LocalSettings';
import memoize from 'transmute/memoize';
import User from 'hub-http-shims/UserDataJS/user';
var Owner = connectPromiseSingle({
  stores: [CurrentOwnerIdStore],
  deref: function deref() {
    return CurrentOwnerIdStore.get();
  }
});
var showJITAWarning = memoize(function (url) {
  return User.then(function (user) {
    return (// eslint-disable-next-line no-console
      console.warn("Hey " + (user.get('first_name') || 'there') + "!\n\nJust so you know, your changes to `" + url + "` were only saved locally.\n\nBecause you logged in with JITA, we can't save your data to the server. Saving\nyour changes locally allows you to test the UI, but that means if customers are\nhaving trouble saving data to the server at `" + url + "` you might not be able to\nreproduce problem by logging into their portals.\n\nTo help us resolve the issue as quickly as possible:\n\n1. Try to reproduce the problem in a portal you can log into without JITA.\n\n2. If you can't reproduce the issue in a different portal, include any debugging\ninformation (console errors, etc) that customers can see from their end when you\nopen a ticket.\n\n3. If you have any questions, head over to #support-crm!\n\nThank you!\nThe CRM Team")
    );
  }).done();
});
export function get(url, data) {
  var fromJS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Immutable.fromJS;
  return Owner().then(function (ownerId) {
    if (ownerId !== -1) {
      return ImmutableAPI.get(url, data, fromJS);
    }

    var urlKey = encodeURIComponent(url);

    if (hasFrom(sessionStorage, urlKey)) {
      return fromJS(getFrom(sessionStorage, urlKey));
    } // if no cache entry is set, we try to read from the API
    // when we get a response great!
    // when we get a 404 just return `null`


    return ImmutableAPI.get(url, data, fromJS).catch(function (err) {
      if (err.status === 404) {
        return null;
      }

      throw err;
    });
  });
}
export function post(url, data) {
  var fromJS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Immutable.fromJS;
  return Owner().then(function (ownerId) {
    if (ownerId !== -1) {
      return ImmutableAPI.post(url, data, fromJS);
    }

    setFrom(sessionStorage, encodeURIComponent(url), data);
    showJITAWarning(url);
    return fromJS(data);
  });
}