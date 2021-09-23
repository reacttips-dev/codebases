'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { getOrigin } from './LocationUtil';
export function getInfoFromLocationOrigin() {
  var origin = getOrigin();
  var regex = /^https:\/\/(app|local)(-([a-zA-Z0-9]+))?\.hubspot(qa)?\.com/;
  var match = regex.exec(origin);

  if (!match) {
    return null;
  }

  var _match = _slicedToArray(match, 5),
      url = _match[0],
      subDomain = _match[1],
      hubletPrefixed = _match[2],
      hublet = _match[3],
      env = _match[4];

  var res = {
    url: url,
    hubletPrefixed: hubletPrefixed,
    hublet: hublet,
    isLocal: subDomain === 'local',
    isQa: env === 'qa'
  };
  return res;
}
export function getApiDomain() {
  var originInfo = getInfoFromLocationOrigin();
  var url = "https://api" + (originInfo && originInfo.hubletPrefixed ? originInfo.hubletPrefixed : '') + ".hubspot" + (originInfo && originInfo.isQa ? 'qa' : '') + ".com";
  return url;
}
export function getPreferencesUrl(portalId, type) {
  var originInfo = getInfoFromLocationOrigin();
  var url = "https://app" + (originInfo && originInfo.hubletPrefixed ? originInfo.hubletPrefixed : '') + ".hubspot" + (originInfo && originInfo.isQa ? 'qa' : '') + ".com/notification-preferences/" + portalId + "/desktop?highlight=" + type;
  return url;
}