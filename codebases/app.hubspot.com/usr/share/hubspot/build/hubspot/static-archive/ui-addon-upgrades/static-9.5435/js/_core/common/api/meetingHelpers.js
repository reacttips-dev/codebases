'use es6';

import { stringify } from 'hub-http/helpers/params';
import { getUserInfo } from 'ui-addon-upgrades/_core/common/api/getUserInfo';
var linkParams;
var BASE_PARAMS = {
  embed: true
};
export function prefetchMeetingData() {
  getUserInfo().then(function (_ref) {
    var user = _ref.user,
        portal = _ref.portal;
    linkParams = {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      website: portal.domain
    };
  }).catch(function () {
    linkParams = {
      firstName: null,
      lastName: null,
      email: null,
      website: null
    };
  });
}
export function getInlineMeetingParams(upgradeData) {
  var meeting_funnel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'in-app';
  var meeting_medium = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pql';
  var hasAssignedRep = !!(upgradeData.repInfo && upgradeData.repInfo.link);
  var attributionSource = hasAssignedRep ? 'rep' : 'ISC';
  var meetingParams = {
    meeting_funnel: meeting_funnel,
    meeting_medium: meeting_medium,
    meeting_product: upgradeData.upgradeProduct,
    meeting_source: upgradeData.source,
    meeting_type: attributionSource,
    meeting_campaign: attributionSource
  };
  return stringify(Object.assign({}, linkParams, {}, meetingParams, {}, BASE_PARAMS));
}