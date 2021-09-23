'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';
import { logBreadcrumb } from '../lib/utils';
/* eslint-disable no-console */

var RelationshipManager = /*#__PURE__*/function () {
  function RelationshipManager(client) {
    var _this = this;

    _classCallCheck(this, RelationshipManager);

    this._wrapWithAbort = function (operation, operationId) {
      var xhr;

      var abort = function abort() {
        xhr = _this.operations[operation + ":" + operationId];

        if (xhr) {
          logBreadcrumb("Aborting: " + operation + " - " + operationId);
          xhr.abort();
          delete _this.operations[operation + ":" + operationId];
        } else {
          logBreadcrumb("No XHR found for: " + operation + " - " + operationId);
        }

        return xhr;
      };

      var withXhr = function withXhr(_xhr) {
        _this.operations[operation + ":" + operationId] = _xhr;
      };

      return {
        abort: abort,
        withXhr: withXhr
      };
    };

    this._handleSuccess = function (search) {
      return function (data) {
        return {
          search: search,
          data: data || []
        };
      };
    };

    this._handleFailure = function (search) {
      return function (e) {
        if (e.errorCode !== 'ABORT') {
          throw e;
        }

        return {
          search: search,
          data: []
        };
      };
    };

    this.client = client;
    this.operations = {};
  }

  _createClass(RelationshipManager, [{
    key: "fetchRelationships",
    value: function fetchRelationships(fromIds, toIds) {
      var data = {
        fromIds: fromIds,
        toIds: toIds
      };
      return this.client.post('broadcast/v1/twitter/relationships', {
        data: data
      });
    }
  }, {
    key: "follow",
    value: function follow(channelGuid, remoteUserId, otherRemoteUserId, userId) {
      var data = {
        type: 'FOLLOW',
        remoteUserIdOfActor: remoteUserId,
        remoteUserIdOfActedUpon: otherRemoteUserId,
        userId: userId
      };
      return this.client.post("broadcast/v1/twitter/" + channelGuid + "/socialItemAction/FOLLOW_" + remoteUserId + ":" + otherRemoteUserId, {
        data: data
      });
    }
  }, {
    key: "unfollow",
    value: function unfollow(channelGuid, remoteUserId, otherRemoteUserId, userId) {
      var data = {
        type: 'UNFOLLOW',
        remoteUserIdOfActor: remoteUserId,
        remoteUserIdOfActedUpon: otherRemoteUserId,
        userId: userId
      };
      return this.client.post("broadcast/v1/twitter/" + channelGuid + "/socialItemAction/UNFOLLOW_" + remoteUserId + ":" + otherRemoteUserId, {
        data: data
      });
    }
  }, {
    key: "fetchAtMentions",
    value: function fetchAtMentions(search) {
      var _this$_wrapWithAbort = this._wrapWithAbort("twitter-mention", search),
          abort = _this$_wrapWithAbort.abort,
          withXhr = _this$_wrapWithAbort.withXhr;

      var query = {
        prefix: search
      };
      var promise = this.client.get('broadcast/v1/twitter/autocomplete', {
        query: query,
        withXhr: withXhr
      }).then(this._handleSuccess(search)).catch(this._handleFailure(search));
      return {
        promise: promise,
        abort: abort
      };
    }
  }, {
    key: "fetchFacebookPages",
    value: function fetchFacebookPages(channelKey, search) {
      var _this$_wrapWithAbort2 = this._wrapWithAbort("facebook-mention", search),
          abort = _this$_wrapWithAbort2.abort,
          withXhr = _this$_wrapWithAbort2.withXhr;

      var query = {
        query: search
      };
      var promise = this.client.get("broadcast/v2/facebook/" + channelKey + "/search/pages", {
        query: query,
        withXhr: withXhr
      }).then(this._handleSuccess(search)).catch(this._handleFailure(search));
      return {
        promise: promise,
        abort: abort
      };
    }
  }, {
    key: "fetchLinkedinCompanies",
    value: function fetchLinkedinCompanies(channelKey, search) {
      var _this$_wrapWithAbort3 = this._wrapWithAbort("linkedin-mention", search),
          abort = _this$_wrapWithAbort3.abort,
          withXhr = _this$_wrapWithAbort3.withXhr;

      var query = {
        query: search,
        entity: 'organization'
      };
      var promise = this.client.get("broadcast/v2/linkedin/channels/" + channelKey + "/search", {
        query: query,
        withXhr: withXhr
      }).then(this._handleSuccess(search)).catch(this._handleFailure(search));
      return {
        promise: promise,
        abort: abort
      };
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new RelationshipManager(http);
    }
  }]);

  return RelationshipManager;
}();

export { RelationshipManager as default };