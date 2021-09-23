'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import http from 'hub-http/clients/apiClient';
import CampaignRecord from '../data/CampaignRecord';
import { getCrmSearchCampaignOptions, mapCrmSearchCampaignsToLegacy, fetchesToPromiseAll } from '../util/campaignDaoUtils';
import { mapCrmSearchCampaignToLegacyFull, mapCrmSearchCampaignsToLegacyFull } from '../util/campaignDaoUtilsWithDLB';
import { getCampaignPollPromise } from '../util/getCampaignPoll';
import { BASE_URL, CRM_SEARCH_CAMPAIGNS_URL, CAMPAIGN_DEFAULTS, CRM_SEARCH_SORT_VALUES, CRM_SEARCH_CAMPAIGN_PROPERTIES_FULL, CRM_SEARCH_ERROR_OBJECT } from '../constants/campaignDaoConstants';
export function loadLimitUsage() {
  return http.get(BASE_URL + "/attribution-enabled/count");
}
export function createCampaign(campaign, userId) {
  return http.post(BASE_URL, {
    data: Object.assign({}, CAMPAIGN_DEFAULTS, {}, campaign, {
      createdBy: userId
    })
  });
}
export function deleteCampaign(campaign) {
  return http.delete(BASE_URL + "/" + campaign.guid);
}
export function updateCampaign(campaign, query) {
  return http.put(BASE_URL + "/" + campaign.guid, {
    query: query,
    data: campaign.toJS()
  });
}
export var getCrmSearchCampaignsPaginatedRaw = function getCrmSearchCampaignsPaginatedRaw(options) {
  return http.post(CRM_SEARCH_CAMPAIGNS_URL, {
    data: getCrmSearchCampaignOptions({
      offset: options.offset,
      limit: options.limit,
      nameSearch: options.name,
      sortProperty: CRM_SEARCH_SORT_VALUES[options.sort],
      sortDir: options.sortDir,
      properties: options.properties
    })
  });
};
export var getCrmSearchCampaignsPaginated = function getCrmSearchCampaignsPaginated(options) {
  return getCrmSearchCampaignsPaginatedRaw(options).then(mapCrmSearchCampaignsToLegacy);
};
export var setGetCrmSearchCampaignsPaginatedForTesting = function setGetCrmSearchCampaignsPaginatedForTesting(f) {
  getCrmSearchCampaignsPaginated = f;
};
export var getCrmSearchCampaignsPaginatedFull = function getCrmSearchCampaignsPaginatedFull(options) {
  return getCrmSearchCampaignsPaginatedRaw(options).then(mapCrmSearchCampaignsToLegacyFull);
};
export function getCampaignLegacy(campaignId) {
  return http.get(BASE_URL + "/" + campaignId).then(CampaignRecord.from);
}
export function getCampaignCrmRaw(campaignId) {
  return http.post(CRM_SEARCH_CAMPAIGNS_URL, {
    data: getCrmSearchCampaignOptions({
      offset: 0,
      limit: 1,
      guidValue: campaignId,
      properties: CRM_SEARCH_CAMPAIGN_PROPERTIES_FULL
    })
  });
}
export function getCampaignCrm(campaignId) {
  return getCampaignCrmRaw(campaignId).then(function (campaign) {
    // crm-search does not return a 404 when no campaign is found
    // it returns a 200 with an empty array as "results"
    // so I manually added this check here to keep the same behaviour
    // as the previous endpoint ('campaigns/v1/campaigns')
    return campaign.results.length ? campaign : Promise.reject(CRM_SEARCH_ERROR_OBJECT);
  }).then(mapCrmSearchCampaignToLegacyFull);
}
/**
 * Fetches both the `campaigns/v1/campaigns` and the `crm-search` endpoints
 * If campaign was created less than 5 seconds ago, the `campaigns/v1/campaigns` result is returned
 * If it's created more than 5 seconds ago, and the `crm-search` has valid results, this is returned
 * Else, a poll to the `crm-search` is created for a while hoping to get the correct result
 * This is necessary because the `crm-search` has a delay when indexing a newly created or cloned campaign
 * @function
 * @param {string} campaignGuid - The campaignGuid to be fetched.
 * @param {function} [legacyGetCampaignFetcher=getCampaignLegacy] - The function that fetches `campaigns/v1/campaigns`.
 * @param {function} [crmGetCampaignFetcher=getCampaignCrm] - The function that fetches `crm-search`.
 * @returns {Promise} - Promise with an instance of "CampaignRecord" if response is resolved
 */

export var getCampaign = function getCampaign(campaignGuid) {
  var legacyGetCampaignFetcher = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getCampaignLegacy;
  var crmGetCampaignFetcher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getCampaignCrmRaw;
  var getter = fetchesToPromiseAll(legacyGetCampaignFetcher, crmGetCampaignFetcher);
  return getter(campaignGuid).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        legacyResult = _ref2[0],
        crmResult = _ref2[1];

    if (legacyResult.createdAt + 5000 > Date.now()) {
      if (!(legacyResult instanceof CampaignRecord)) {
        return CampaignRecord.from(legacyResult);
      }

      return legacyResult;
    }

    if (crmResult) {
      if (crmResult instanceof CampaignRecord) {
        return crmResult;
      } else if (crmResult.results && crmResult.results.length) {
        return mapCrmSearchCampaignToLegacyFull(crmResult);
      }
    }

    return Promise.reject(CRM_SEARCH_ERROR_OBJECT);
  }).catch(function (err) {
    if (!err.requestFailed) {
      return Promise.reject(err);
    }

    return getCampaignPollPromise({
      campaignGuid: campaignGuid
    });
  });
};
export function getCampaigns() {
  return http.get(BASE_URL).then(function (campaigns) {
    return campaigns.map(CampaignRecord.from);
  });
}
export function getCrmSearchCampaign(campaignId) {
  return http.post(CRM_SEARCH_CAMPAIGNS_URL, {
    data: getCrmSearchCampaignOptions({
      offset: 0,
      limit: Array.isArray(campaignId) ? campaignId.length : 1,
      guidValue: campaignId
    })
  }).then(mapCrmSearchCampaignsToLegacy);
}
export function cloneCampaign(campaign, campaignProps) {
  return http.post(BASE_URL + "/" + campaign.guid + "/clone", {
    data: campaignProps
  }).then(function (response) {
    return getCampaign(response.campaignId).then(function (c) {
      return {
        campaign: c,
        progressionId: response.progressionId
      };
    });
  });
}
export function getCampaignUtms(campaignId) {
  return http.get(BASE_URL + "/" + campaignId + "/utms");
}
export var fetchCampaignsBatch = function fetchCampaignsBatch() {
  var guid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return http.get(BASE_URL + "/guids", {
    query: {
      guid: guid
    }
  });
};
export var setFetchCampaignsBatchForTesting = function setFetchCampaignsBatchForTesting(f) {
  fetchCampaignsBatch = f;
};