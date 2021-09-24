'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';
import I18n from 'I18n';
import { clone } from 'underscore';
import PortalIdParser from 'PortalIdParser';
import { FEED_ACTION_TYPES, FEED_ARCHIVE_STATUS, FEED_INTERACTION_TYPES, NETWORKS_TO_IDS } from '../lib/constants';
var LONG_TIMEOUT = 15000;

var FeedManager = /*#__PURE__*/function () {
  function FeedManager(client) {
    _classCallCheck(this, FeedManager);

    this.favoriteItem = this._itemActionCreator(FEED_ACTION_TYPES.FAVORITE);
    this.unfavoriteItem = this._itemActionCreator(FEED_ACTION_TYPES.UNFAVORITE);
    this.retweetItem = this._itemActionCreator(FEED_ACTION_TYPES.RETWEET);
    this.unretweetItem = this._itemActionCreator(FEED_ACTION_TYPES.UNRETWEET);
    this.replyToItem = this._itemActionCreator(FEED_ACTION_TYPES.REPLY);
    this.quoteItem = this._itemActionCreator(FEED_ACTION_TYPES.SHARED);
    this.mentionItem = this._itemActionCreator(FEED_ACTION_TYPES.NEW_MESSAGE);
    this.client = client;
  }

  _createClass(FeedManager, [{
    key: "fetchFeedItem",
    value: function fetchFeedItem(id) {
      return this.client.get("socialmonitoring/v1/socialFeed/" + id);
    }
  }, {
    key: "archiveFeedItem",
    value: function archiveFeedItem(id) {
      var query = {
        readAt: new Date().valueOf()
      };
      return this.client.put("socialmonitoring/v1/socialFeed/" + id, {
        query: query
      });
    }
  }, {
    key: "unarchiveFeedItem",
    value: function unarchiveFeedItem(id) {
      var query = {
        readAt: 0
      };
      return this.client.put("socialmonitoring/v1/socialFeed/" + id, {
        query: query
      });
    }
  }, {
    key: "archiveBulk",
    value: function archiveBulk(channelKeys, interactionType) {
      if (interactionType === FEED_ARCHIVE_STATUS.ALL) {
        interactionType = null;
      }

      var data = {
        channelKeys: channelKeys,
        interactionType: interactionType,
        startAt: I18n.moment().utc().valueOf()
      };
      return this.client.put('socialmonitoring/v2/feed/mark-read', {
        data: data,
        timeout: LONG_TIMEOUT
      });
    }
  }, {
    key: "isValidArchivedStatus",
    value: function isValidArchivedStatus(archivedStatus) {
      return Object.keys(FEED_ARCHIVE_STATUS).includes(archivedStatus);
    }
  }, {
    key: "fetchFeed",
    value: function fetchFeed(options) {
      // endpoint actually gets params from POST, but stick the short ones in GET for debugging (not channelKeys)
      var interactionType = options.interactionType === FEED_INTERACTION_TYPES.ALL ? null : options.interactionType;
      var query = Object.assign({}, options, {}, {
        interactionType: interactionType,
        count: 10,
        portalId: PortalIdParser.get()
      });

      if (query.archivedStatus === FEED_ARCHIVE_STATUS.ALL || !this.isValidArchivedStatus(query.archivedStatus)) {
        delete query.archivedStatus;
      }

      var data = clone(query);
      delete query.channelKeys;
      return this.client.post('socialmonitoring/v2/feed', {
        query: query,
        data: data,
        timeout: LONG_TIMEOUT
      });
    }
  }, {
    key: "fetchBroadcastFeed",
    value: function fetchBroadcastFeed(id) {
      return this.client.get("socialmonitoring/v1/socialFeed/broadcast/" + id, {
        timeout: LONG_TIMEOUT
      });
    }
  }, {
    key: "fetchInboxCountsV2",
    value: function fetchInboxCountsV2(channelKeys) {
      var data = {
        channelKeys: channelKeys
      };
      return this.client.post('socialmonitoring/v2/feed/counts', {
        data: data,
        timeout: LONG_TIMEOUT
      });
    }
  }, {
    key: "fetchSocialItemActions",
    value: function fetchSocialItemActions(remoteUserId, network) {
      var query = {
        remoteUserId: remoteUserId,
        networkId: network.toUpperCase()
      };
      return this.client.get('socialmonitoring/v1/socialInteractions', {
        query: query
      });
    }
  }, {
    key: "_doCreateItemAction",
    value: function _doCreateItemAction(network, channelKey, parentId, data) {
      data.networkId = NETWORKS_TO_IDS.indexOf(network);
      return this.client.post("broadcast/v1/" + network + "/" + channelKey + "/socialItemAction/" + parentId, {
        data: data
      });
    }
  }, {
    key: "_itemActionCreator",
    value: function _itemActionCreator(type) {
      var _this = this;

      return function (network, channelKey, parentId) {
        var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        params.type = type;
        return _this._doCreateItemAction(network, channelKey, parentId, params);
      };
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new FeedManager(http);
    }
  }]);

  return FeedManager;
}();

export { FeedManager as default };