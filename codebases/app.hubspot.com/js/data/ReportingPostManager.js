'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';
import { ACCOUNT_TYPES, BROADCAST_MEDIA_TYPE, getChannelIdFromChannelKey, getChannelSlugFromChannelKey } from '../lib/constants';
var POSTS_PER_PAGE = 10;

var ReportingPostManager = /*#__PURE__*/function () {
  function ReportingPostManager(client) {
    _classCallCheck(this, ReportingPostManager);

    this.client = client;
  }

  _createClass(ReportingPostManager, [{
    key: "buildPostValuesRequest",
    value: function buildPostValuesRequest(dataFilter, channelIds) {
      return {
        count: POSTS_PER_PAGE,
        offset: (dataFilter.postsPage - 1) * POSTS_PER_PAGE,
        filterGroups: [{
          filters: this.buildFilters(dataFilter, channelIds)
        }],
        sorts: [{
          property: dataFilter.postsSortBy,
          order: dataFilter.postsSortDirection.toUpperCase(),
          sortType: 'COUNT'
        }]
      };
    }
  }, {
    key: "buildFilters",
    value: function buildFilters(dataFilter, channelIds) {
      var mediaTypes = [BROADCAST_MEDIA_TYPE.NONE, BROADCAST_MEDIA_TYPE.PHOTO, BROADCAST_MEDIA_TYPE.ANIMATED_GIF, BROADCAST_MEDIA_TYPE.VIDEO, BROADCAST_MEDIA_TYPE.CAROUSEL];
      var filters = [{
        property: 'channelId',
        operator: 'IN',
        values: channelIds
      }, {
        property: 'publishedAt',
        operator: 'BETWEEN',
        dateTimeFormat: 'DATE',
        value: dataFilter.startDate,
        high_value: dataFilter.endDate
      }, {
        property: 'mediaType',
        operator: 'IN',
        values: mediaTypes
      }];

      if (dataFilter.network === ACCOUNT_TYPES.youtube) {
        filters.push({
          property: 'metadata.privacyStatus',
          operator: 'NEQ',
          value: 'PRIVATE'
        });
      }

      if (dataFilter.campaignGuid) {
        filters.push({
          property: 'campaignGuid',
          operator: 'EQ',
          value: dataFilter.campaignGuid
        });
      }

      return filters;
    }
  }, {
    key: "fetchList",
    value: function fetchList(dataFilter, channelIds) {
      return this._fetchPostValues(this.buildPostValuesRequest(dataFilter, channelIds), 'top-posts');
    }
  }, {
    key: "_fetchPostValues",
    value: function _fetchPostValues(searchRequest, source) {
      return this.client.post('social-reporting/v1/search/posts', {
        data: searchRequest,
        query: {
          source: source
        }
      });
    }
  }, {
    key: "fetchForBroadcastGuids",
    value: function fetchForBroadcastGuids(broadcastGuids, channelIds, count) {
      var request = {
        count: count || broadcastGuids.length,
        offset: 0,
        filterGroups: [{
          filters: [{
            property: 'broadcastGuid',
            operator: 'IN',
            values: broadcastGuids
          }, {
            property: 'channelId',
            operator: 'IN',
            values: channelIds
          }]
        }]
      };
      return this._fetchPostValues(request, 'broadcast-guids');
    }
  }, {
    key: "fetchForBroadcast",
    value: function fetchForBroadcast(broadcast) {
      var channelSlug = getChannelSlugFromChannelKey(broadcast.channelKey);
      var channelId = getChannelIdFromChannelKey(broadcast.channelKey);
      return this.fetchSinglePostByParams(channelSlug, channelId, broadcast.foreignIdForBoost || broadcast.foreignId);
    }
  }, {
    key: "fetchSinglePostByParams",
    value: function fetchSinglePostByParams(channelSlug, channelId, foreignId, locale) {
      return this.client.get("social-reporting/v1/posts/" + channelSlug + "/" + channelId + "/" + foreignId, {
        query: {
          includeTargetLabels: true,
          locale: locale
        }
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new ReportingPostManager(http);
    }
  }]);

  return ReportingPostManager;
}();

export { ReportingPostManager as default };