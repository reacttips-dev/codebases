'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useCallback, useRef } from 'react';
import { callIfPossible } from 'UIComponents/core/Functions';
import allSettled from 'hs-promise-utils/allSettled';
import I18n from 'I18n';
import { DEFAULT_CACHE_GRACE_PERIOD, DEFAULT_NUMBER_OF_RECENTLY_USED, RECENTLY_USED_PREFIX } from '../constants/campaignSelect';
import { SORT_VALUES, SORT_DIR_VALUES, PAGE_DEFAULT_LIMIT } from '../constants/campaignDaoConstants';
import { getCrmSearchCampaign, getCrmSearchCampaignsPaginated } from '../data/CampaignDao';
export default function useLoadCampaignSelectOptions(_ref) {
  var _ref$numberOfRecently = _ref.numberOfRecentlyUsed,
      numberOfRecentlyUsed = _ref$numberOfRecently === void 0 ? DEFAULT_NUMBER_OF_RECENTLY_USED : _ref$numberOfRecently,
      onCurrentValueNotFound = _ref.onCurrentValueNotFound,
      _ref$pageLimit = _ref.pageLimit,
      pageLimit = _ref$pageLimit === void 0 ? PAGE_DEFAULT_LIMIT : _ref$pageLimit,
      _ref$recentlyUsedCach = _ref.recentlyUsedCacheGracePeriod,
      recentlyUsedCacheGracePeriod = _ref$recentlyUsedCach === void 0 ? DEFAULT_CACHE_GRACE_PERIOD : _ref$recentlyUsedCach,
      value = _ref.value,
      _ref$createdCampaigns = _ref.createdCampaigns,
      createdCampaigns = _ref$createdCampaigns === void 0 ? [] : _ref$createdCampaigns,
      multi = _ref.multi,
      _ref$disabledOptionsB = _ref.disabledOptionsByName,
      disabledOptionsByName = _ref$disabledOptionsB === void 0 ? [] : _ref$disabledOptionsB;
  var recentlyUsedCacheRef = useRef([]);
  var recentlyUsedCacheTimestampRef = useRef();
  var paginatedCacheRef = useRef([]);
  var currentValueOptionRef = useRef();
  var findCampaignByGuid = useCallback(function (campaign) {
    if (multi) {
      return value.indexOf(campaign.guid) > -1;
    }

    return campaign.guid === value;
  }, [value, multi]);
  var shouldDisableCampaign = useCallback(function (campaignName) {
    return disabledOptionsByName.some(function (disabledOption) {
      return disabledOption.toUpperCase() === campaignName.toUpperCase();
    });
  }, [disabledOptionsByName]);
  var loadOptions = useCallback(function (input, callback) {
    var pagination = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      offset: 0
    };
    var timestamp = new Date().valueOf();
    var payload = {
      name: input,
      offset: pagination.offset,
      limit: pageLimit
    };
    var isRecentlyUsedExpired = !recentlyUsedCacheTimestampRef.current || timestamp - recentlyUsedCacheTimestampRef.current > recentlyUsedCacheGracePeriod;
    var getRecentlyUsedCrmSearchPromise = isRecentlyUsedExpired ? getCrmSearchCampaignsPaginated({
      sort: SORT_VALUES.UPDATED_AT,
      sortDir: SORT_DIR_VALUES.DESC,
      limit: numberOfRecentlyUsed
    }) : Promise.resolve();
    allSettled([getRecentlyUsedCrmSearchPromise, getCrmSearchCampaignsPaginated(payload)]).then(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          recent = _ref3[0],
          paginated = _ref3[1];

      var recentlyUsedFailingReason = recent.reason,
          _recent$value = recent.value,
          recentlyUsedResponse = _recent$value === void 0 ? {
        results: []
      } : _recent$value;
      var paginatedFailingReason = paginated.reason,
          _paginated$value = paginated.value,
          paginatedResponse = _paginated$value === void 0 ? {
        results: []
      } : _paginated$value;

      if (recentlyUsedFailingReason || paginatedFailingReason) {
        // if one of the call fails, we reject the promise
        return Promise.reject();
      }

      if (recentlyUsedResponse.results.length > 0) {
        // If we have recently used payload we cache it and the timestamp
        recentlyUsedCacheRef.current = recentlyUsedResponse.results;
        recentlyUsedCacheTimestampRef.current = timestamp;
      } // Add recently made campaigns from the select that might not
      // be synced to come through crm-search just yet.


      var missingCreatedCampaigns = createdCampaigns.filter(function (campaign) {
        return !recentlyUsedCacheRef.current.find(function (recentCampaign) {
          return recentCampaign.guid === campaign.guid;
        });
      });

      if (missingCreatedCampaigns.length > 0) {
        recentlyUsedCacheRef.current = missingCreatedCampaigns.concat(recentlyUsedCacheRef.current);
      } // We add the paginated campaigns to the cache,
      // concatenating them if we're on the next page
      // otherwise resetting the cache..


      paginatedCacheRef.current = pagination.offset > 0 ? paginatedCacheRef.current.concat(paginatedResponse.results) : paginatedResponse.results;
      var isCurrentValueListed = value && (recentlyUsedCacheRef.current.some(findCampaignByGuid) || paginatedCacheRef.current.some(findCampaignByGuid));

      if (isCurrentValueListed) {
        // if the value is listed we ensure to unset the current value option
        currentValueOptionRef.current = undefined;
      }

      var hasValue = multi && value ? value.length > 0 : value;

      if (hasValue && !isCurrentValueListed && !currentValueOptionRef.current) {
        // If we have a current value and it isn't listed in either the recently used
        // or in the paginated result or the current value option has not been set
        // we fetch it and save it into the cache
        return getCrmSearchCampaign(value).then(function (_ref4) {
          var currentValueResponse = _ref4.results;

          if (currentValueResponse.length === 0) {
            callIfPossible(onCurrentValueNotFound);
            return paginatedResponse;
          } // If we have a response for the current value fetch
          // we set it to currentValueOptionRef


          currentValueOptionRef.current = currentValueResponse.map(function (campaign) {
            return Object.assign({}, campaign, {
              text: campaign.display_name,
              value: campaign.guid
            });
          });
          return paginatedResponse;
        }).catch(function () {
          return paginatedResponse;
        });
      }

      return Promise.resolve(paginatedResponse);
    }).then(function (paginatedResponse) {
      var options = [];
      var length = paginatedResponse.total;

      if (currentValueOptionRef.current) {
        // if we have a current value option we add it on top
        options.push.apply(options, _toConsumableArray(currentValueOptionRef.current));
        length += currentValueOptionRef.current.length;
      }

      if (recentlyUsedCacheRef.current.length > 0) {
        options.push({
          text: I18n.text('campaignSelect.recentlyUsed'),
          options: recentlyUsedCacheRef.current.map(function (campaign) {
            // if recently used were previously saved, we add them on top of the options
            var isCurrentOptionListedInPaginated = paginatedCacheRef.current.find(function (cachedCampaign) {
              return cachedCampaign.guid === campaign.guid;
            });
            return Object.assign({}, campaign, {
              text: campaign.display_name,
              value: "" + ( // if the the current value is not listed in the paginated results
              // and is actually the iterator campaign, we won't add a prefix
              // so that the UISelect will select it
              !isCurrentOptionListedInPaginated || multi ? '' : RECENTLY_USED_PREFIX) + campaign.guid,
              disabled: shouldDisableCampaign(campaign.display_name)
            });
          })
        });
        length += recentlyUsedCacheRef.current.length;
      } // we finally push the paginated campaigns


      options.push({
        text: I18n.text('campaignSelect.allCampaigns'),
        options: paginatedCacheRef.current.map(function (campaign) {
          return Object.assign({}, campaign, {
            text: campaign.display_name,
            value: campaign.guid,
            disabled: shouldDisableCampaign(campaign.display_name)
          });
        })
      });
      callback(null, {
        options: options,
        pagination: {
          hasMore: paginatedResponse.hasMore,
          length: length,
          offset: paginatedResponse.offset
        }
      });
    }).catch(function () {
      callback(null, {
        options: [],
        pagination: pagination
      });
    }).done();
  }, [currentValueOptionRef, findCampaignByGuid, numberOfRecentlyUsed, onCurrentValueNotFound, pageLimit, paginatedCacheRef, recentlyUsedCacheGracePeriod, recentlyUsedCacheRef, value, createdCampaigns, multi, shouldDisableCampaign]);
  return loadOptions;
}