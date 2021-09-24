'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import I18n from 'I18n';
import http from 'hub-http/clients/apiClient';
import { BROADCAST_STATUS_TYPE, SIMPLE_DATE_FORMAT } from '../lib/constants';
var LONG_TIMEOUT = 30000; // 1 million days = 2,739 years
// We used to only get the number of failed posts within the last 30 days
// The backend endpoint still expects a date to be passed in,
// so we just pass a very very old date to make sure we get basically everything

var FAILED_BROADCAST_AGE_WINDOW_DAYS = 1000000;

var BroadcastManager = /*#__PURE__*/function () {
  function BroadcastManager(client) {
    _classCallCheck(this, BroadcastManager);

    this.client = client;
  }

  _createClass(BroadcastManager, [{
    key: "getParamsFromDataFilter",
    value: function getParamsFromDataFilter(dataFilter) {
      var isUngatedForManageDash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var params = {
        type: dataFilter.requestedStatusType || BROADCAST_STATUS_TYPE.published,
        includeTotal: true,
        includeCampaignNames: false,
        includeChannels: false,
        count: dataFilter.pageSize,
        offset: (dataFilter.page - 1) * dataFilter.pageSize,
        sortBy: dataFilter.sortBy,
        sortOrder: dataFilter.sortOrder,
        c: dataFilter.getSelectedChannelKeys().toArray()
      };

      if (!isUngatedForManageDash && params.type === BROADCAST_STATUS_TYPE.failed) {
        // failed broadcasts are filtered to last 30 days
        params.since = I18n.moment().utc().subtract(30, 'days').valueOf();
      } else if (params.type === BROADCAST_STATUS_TYPE.published) {
        params.startRange = I18n.moment(dataFilter.startDate).valueOf();
        params.endRange = I18n.moment(dataFilter.endDate).endOf('day').valueOf();
      }

      if (dataFilter.campaignGuid) {
        params.campaignGuids = [dataFilter.campaignGuid];
      }

      if (dataFilter.createdBy) {
        params.createdBy = dataFilter.createdBy;
      }

      params.type = params.type.toUpperCase();
      return params;
    }
  }, {
    key: "fetch",
    value: function fetch() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var polling = arguments.length > 1 ? arguments[1] : undefined;
      var data = Object.assign({}, {
        count: 10
      }, {}, params);
      var query = {
        polling: polling
      };
      return this.client.post('broadcast/v2/broadcasts/fetch-broadcasts', {
        data: data,
        query: query,
        timeout: LONG_TIMEOUT
      });
    }
  }, {
    key: "fetchSimple",
    value: function fetchSimple(query, timeout) {
      return this.client.get('broadcast/v2/broadcasts', {
        query: query,
        timeout: timeout || undefined
      });
    }
  }, {
    key: "fetchUploaded",
    value: function fetchUploaded() {
      return this.client.get('broadcast/v2/bulk/fetch-uploaded');
    }
  }, {
    key: "fetchInDateRange",
    value: function fetchInDateRange(monthMoment, channelKeys, statusType) {
      var postTargetOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var dayStartOfMonth = monthMoment.clone().startOf('month');
      var dayEndOfMonth = monthMoment.clone().endOf('month');
      var query = Object.assign({
        startRange: dayStartOfMonth.startOf('week').valueOf(),
        endRange: dayEndOfMonth.endOf('week').valueOf(),
        type: statusType.toUpperCase(),
        c: channelKeys,
        count: 5000
      }, postTargetOptions);
      return this.fetchSimple(query, LONG_TIMEOUT // see SM-6076, this is for portals with A LOT of accounts
      );
    }
  }, {
    key: "fetchList",
    value: function fetchList(guids) {
      return this.client.get('broadcast/v2/broadcasts/list', {
        query: {
          ids: guids
        }
      });
    }
  }, {
    key: "getById",
    value: function getById(id) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.client.get("broadcast/v2/broadcasts/" + id, {
        query: query
      });
    }
  }, {
    key: "getInteractions",
    value: function getInteractions(id) {
      return this.client.get("broadcast/v2/broadcasts/" + id + "/interactions/page", {
        timeout: LONG_TIMEOUT
      });
    }
  }, {
    key: "fetchStatusCounts",
    value: function fetchStatusCounts(polling, channelKeys) {
      var recentOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var daysAgo = recentOnly ? 30 : FAILED_BROADCAST_AGE_WINDOW_DAYS;
      var startDate = I18n.moment().utc().subtract(daysAgo, 'days').valueOf();
      var data = {
        startDate: startDate,
        channelKeys: channelKeys
      };
      var query = {
        polling: polling
      };
      return this.client.put('broadcast/v2/broadcasts/counts', {
        data: data,
        query: query
      });
    }
  }, {
    key: "fetchStatusCountsWithPublished",
    value: function fetchStatusCountsWithPublished(polling, channelKeys) {
      var recentOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var daysAgo = recentOnly ? 30 : FAILED_BROADCAST_AGE_WINDOW_DAYS;
      var startDate = I18n.moment().utc().subtract(daysAgo, 'days').format(SIMPLE_DATE_FORMAT);
      var query = {
        polling: polling,
        c: channelKeys,
        startDate: startDate
      };
      return this.client.get('broadcast/v2/broadcasts/counts-with-published', {
        query: query
      });
    }
  }, {
    key: "update",
    value: function update(id, data) {
      var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.client.put("broadcast/v2/broadcasts/" + id + "/update", {
        data: data,
        query: query
      });
    }
  }, {
    key: "patch",
    value: function patch(id, data) {
      return this.client.patch("broadcast/v2/broadcasts/" + id, {
        data: data
      });
    }
  }, {
    key: "updateMultiple",
    value: function updateMultiple(broadcastGuids, settingsChanges) {
      var data = {
        broadcastGuids: broadcastGuids,
        settingsChanges: settingsChanges
      };
      return this.client.put('broadcast/v2/broadcasts/patchMultiple', {
        data: data
      });
    }
  }, {
    key: "fetchBroadcast",
    value: function fetchBroadcast(id, query) {
      return this.client.get("broadcast/v2/broadcasts/" + id, {
        query: query
      });
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      return this.client.delete("broadcast/v2/broadcasts/" + id);
    }
  }, {
    key: "makeDraft",
    value: function makeDraft(id) {
      return this.client.put("broadcast/v2/broadcasts/" + id + "/make-draft");
    }
  }, {
    key: "makeDrafts",
    value: function makeDrafts(broadcastGuids) {
      return this.updateMultiple(broadcastGuids, {
        status: BROADCAST_STATUS_TYPE.draft.toUpperCase()
      });
    }
  }, {
    key: "createBroadcastGroup",
    value: function createBroadcastGroup(data, query) {
      return this.client.post('broadcast/v2/broadcasts/group', {
        data: data,
        query: query,
        timeout: LONG_TIMEOUT
      });
    }
  }, {
    key: "fetchPagePreview",
    value: function fetchPagePreview(urls, channelType) {
      var data = urls.map(function (url) {
        return {
          url: url
        };
      });
      var query = {
        excludedImageExtensions: ['bmp', 'svg'],
        channelType: channelType
      };
      return this.client.put('broadcast/v1/preview/pages', {
        data: data,
        query: query,
        timeout: 15000
      });
    }
  }, {
    key: "fetchVideoInsights",
    value: function fetchVideoInsights(broadcastGuid) {
      return this.client.get("broadcast/v1/facebook/" + broadcastGuid + "/video-insights");
    }
  }, {
    key: "fetchTwitterStatus",
    value: function fetchTwitterStatus(channelKey, twitterStatusId) {
      return this.client.get("broadcast/v1/twitter/" + channelKey + "/status/" + twitterStatusId);
    }
  }, {
    key: "exportBroadcasts",
    value: function exportBroadcasts(emailAddress, broadcastStatusType) {
      var data = {
        emailAddress: emailAddress,
        broadcastStatusType: broadcastStatusType
      };
      return this.client.post('broadcast/v2/broadcasts/export', {
        data: data
      });
    }
  }, {
    key: "moveBulkMessages",
    value: function moveBulkMessages(bulkAction) {
      return this.client.put("broadcast/v2/bulk/move-bulk/" + bulkAction, {
        timeout: 15000
      });
    }
  }, {
    key: "fetchTargetingLocationOptions",
    value: function fetchTargetingLocationOptions(network, query) {
      return this.client.get("broadcast/v2/" + network + "/target-locations", {
        timeout: 15000,
        query: query
      });
    }
  }, {
    key: "fetchTargetingLanguageOptions",
    value: function fetchTargetingLanguageOptions(network, query) {
      return this.client.get("broadcast/v2/" + network + "/target-languages", {
        timeout: 15000,
        query: query
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new BroadcastManager(http);
    }
  }]);

  return BroadcastManager;
}();

export { BroadcastManager as default };