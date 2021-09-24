'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';
import { STREAM_ITEM_PAGE_SIZE } from '../lib/constants';

var StreamManager = /*#__PURE__*/function () {
  function StreamManager(client) {
    _classCallCheck(this, StreamManager);

    this.client = client;
  }

  _createClass(StreamManager, [{
    key: "fetchStream",
    value: function fetchStream(id, search, startAt) {
      var query = {
        limit: STREAM_ITEM_PAGE_SIZE,
        query: search,
        startAt: startAt
      };
      return this.client.get("socialmonitoring/streams/" + id + "/stream_items", {
        query: query
      });
    }
  }, {
    key: "createStream",
    value: function createStream(stream) {
      var data = stream.serialize();
      return this.client.post('socialmonitoring/streams', {
        data: data
      });
    }
  }, {
    key: "saveStream",
    value: function saveStream(stream) {
      var data = stream.serialize();
      return this.client.put("socialmonitoring/streams/" + stream.streamGuid, {
        data: data
      });
    }
  }, {
    key: "deleteStream",
    value: function deleteStream(streamGuid) {
      return this.client.delete("socialmonitoring/streams/" + streamGuid);
    }
  }, {
    key: "markStreamRead",
    value: function markStreamRead(streamGuid, userId) {
      var data = {
        streamGuid: streamGuid,
        userId: userId,
        readAt: new Date().valueOf() * 1000
      };
      return this.client.post('socialmonitoring/user_streams', {
        data: data
      });
    }
  }, {
    key: "fetchStreamPreview",
    value: function fetchStreamPreview(stream) {
      var data = stream.serializeForPreview();
      return this.client.post('socialmonitoring/stream_preview', {
        data: data
      });
    }
  }, {
    key: "fetchStreams",
    value: function fetchStreams() {
      return this.client.get('socialmonitoring/streams');
    }
  }, {
    key: "fetchStreamItemAncestors",
    value: function fetchStreamItemAncestors(channelKey, statusId) {
      return this.client.get("broadcast/v1/twitter/" + channelKey + "/ancestors/" + statusId + "/streamitems");
    }
  }, {
    key: "fetchStreamItem",
    value: function fetchStreamItem(streamGuid, id) {
      return this.client.get("socialmonitoring/streams/" + streamGuid + "/stream_items/" + id);
    }
  }, {
    key: "fetchContactList",
    value: function fetchContactList(listId) {
      return this.client.get("contacts/v1/lists/" + listId);
    }
  }, {
    key: "fetchContactLists",
    value: function fetchContactLists(q) {
      var query = {
        q: q
      };
      return this.client.get('contacts/v1/segment-ui/all', {
        query: query
      });
    }
  }, {
    key: "fetchTwitterLists",
    value: function fetchTwitterLists(channelKey) {
      return this.client.get("broadcast/v1/twitterlists/" + channelKey + "/frontend");
    }
  }, {
    key: "createRivalIqLandscape",
    value: function createRivalIqLandscape() {
      return this.client.post('rivaliq/v1/landscapes');
    }
  }, {
    key: "fetchRivalIqLandscape",
    value: function fetchRivalIqLandscape(landscapeId) {
      return this.client.get("rivaliq/v1/landscapes/" + landscapeId);
    }
  }, {
    key: "fetchRivalIqPosts",
    value: function fetchRivalIqPosts(landscapeId, opts) {
      var query = Object.assign({}, opts);
      return this.client.get("rivaliq/v1/landscapes/" + landscapeId + "/social-posts", {
        query: query
      });
    }
  }, {
    key: "followRivalIqCompany",
    value: function followRivalIqCompany(landscapeId, companyUrl) {
      var data = [companyUrl];
      return this.client.post("rivaliq/v1/landscapes/" + landscapeId + "/companies/by-url", {
        data: data,
        timeout: 15000
      });
    }
  }, {
    key: "unfollowRivalIqCompany",
    value: function unfollowRivalIqCompany(landscapeId, companyId) {
      return this.client.delete("rivaliq/v1/landscapes/" + landscapeId + "/companies/" + companyId);
    }
  }, {
    key: "fetchPendingOperationStatus",
    value: function fetchPendingOperationStatus(pendingOperationKey) {
      return this.client.get("rivaliq/v1/pending-operations/" + pendingOperationKey);
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new StreamManager(http);
    }
  }]);

  return StreamManager;
}();

export { StreamManager as default };