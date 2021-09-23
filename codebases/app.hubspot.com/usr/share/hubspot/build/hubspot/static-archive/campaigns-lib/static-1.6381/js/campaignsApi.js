'use es6';

import http from 'hub-http/clients/apiClient';
export function fetchCampaigns() {
  return http.get('campaigns/v1/campaigns');
}
export function fetchIsCampaignAtLimit(_ref) {
  var assetObjectType = _ref.assetObjectType,
      campaignGuid = _ref.campaignGuid,
      _ref$numOfObjectsToAs = _ref.numOfObjectsToAssociate,
      numOfObjectsToAssociate = _ref$numOfObjectsToAs === void 0 ? 1 : _ref$numOfObjectsToAs;
  return http.get('campaigns/v1/assets/associations/is-limit-reached', {
    query: {
      campaignGuid: campaignGuid,
      assetObjectType: assetObjectType,
      numOfObjectsToAssociate: numOfObjectsToAssociate
    }
  });
}