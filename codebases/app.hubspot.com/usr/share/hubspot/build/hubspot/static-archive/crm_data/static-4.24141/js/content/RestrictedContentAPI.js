'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { Map as ImmutableMap } from 'immutable';
var PUBLIC_ACCESS_LIST = 'contentmembership/public-access/list/';
var PUBLIC_ACCESS_CONTACT = 'contentmembership/public-access/contact/';
var MEMBERS_API = 'contentmembership/members/';
var FULL = '/full';

var responseTransform = function responseTransform(id, resp) {
  return ImmutableMap(_defineProperty({}, id, resp.get('objects')));
};

export function fetchVisibleContentsForList(ids) {
  var id = ids.first();
  return ImmutableAPI.get("" + PUBLIC_ACCESS_LIST + id + FULL).then(responseTransform.bind(null, id));
}
export function fetchVisibleContentsForContact(ids) {
  var id = ids.first();
  return ImmutableAPI.get("" + PUBLIC_ACCESS_CONTACT + id + FULL).then(responseTransform.bind(null, id));
}
export function resendRegistrationEmail(email) {
  return ImmutableAPI.get("" + MEMBERS_API + email + "/resend");
}
export function sendPasswordResetRequest(email) {
  return ImmutableAPI.post("" + MEMBERS_API + email + "/reset");
}
export function getUserRegistration(email) {
  return ImmutableAPI.get("" + MEMBERS_API + email);
}