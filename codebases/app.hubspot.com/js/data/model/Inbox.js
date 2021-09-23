'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import I18n from 'I18n';
import { pick } from 'underscore';
import PortalStorage from '../../lib/storage';
import { FEED_ARCHIVE_STATUS, FEED_INTERACTION_TYPES } from '../../lib/constants';
import { stringify } from 'hub-http/helpers/params';
var portalStorage = PortalStorage.getInstance();
var DEFAULTS = {
  unreadCount: null,
  inboxCounts: null,
  lastFeedFetchCounts: null,
  feedHasLoaded: false,
  hasMore: null,
  startAt: I18n.moment().utc().valueOf(),
  archivedStatus: FEED_ARCHIVE_STATUS.UNARCHIVED,
  pageSize: 10,
  monitoringSearch: '',
  interactingAs: portalStorage.get().interactingAs,
  interactionType: FEED_INTERACTION_TYPES.ALL,
  feedKey: null
};
var SUPPORTED_QUERY_PARAMS = ['archivedStatus', 'monitoringSearch']; // keeps track of Inbox UI state, doesn't map to a real entity

var Inbox = /*#__PURE__*/function (_Record) {
  _inherits(Inbox, _Record);

  function Inbox() {
    _classCallCheck(this, Inbox);

    return _possibleConstructorReturn(this, _getPrototypeOf(Inbox).apply(this, arguments));
  }

  _createClass(Inbox, [{
    key: "getUnreadCountForInteractionType",
    value: function getUnreadCountForInteractionType(interactionType) {
      if (interactionType === FEED_INTERACTION_TYPES.ALL) {
        return this.unreadCount;
      }

      return this.inboxCounts && this.inboxCounts.get(interactionType);
    }
  }, {
    key: "getNewCountForInteractionType",
    value: function getNewCountForInteractionType(interactionType) {
      if (!(this.inboxCounts && this.lastFeedFetchCounts)) {
        return 0;
      }

      if (interactionType === FEED_INTERACTION_TYPES.ALL) {
        var totalAtLastFetch = (this.lastFeedFetchCounts.get(FEED_INTERACTION_TYPES.CONVERSATIONS) || 0) + (this.lastFeedFetchCounts.get(FEED_INTERACTION_TYPES.INTERACTIONS) || 0) + (this.lastFeedFetchCounts.get(FEED_INTERACTION_TYPES.FOLLOWERS) || 0);
        return Math.max(this.getUnreadCountForInteractionType(interactionType) - totalAtLastFetch, 0);
      }

      return this.lastFeedFetchCounts.has(interactionType) ? Math.max(this.getUnreadCountForInteractionType(interactionType) - this.lastFeedFetchCounts.get(interactionType), 0) : 0;
    }
  }, {
    key: "getArchivedStatus",
    value: function getArchivedStatus() {
      if (this.archivedStatus !== DEFAULTS.archivedStatus) {
        return {
          archivedStatus: this.archivedStatus
        };
      }

      return {};
    }
  }, {
    key: "getUrlParams",
    value: function getUrlParams(currentLocation) {
      var queryParams = currentLocation.query;

      if (this.archivedStatus) {
        queryParams = Object.assign({}, queryParams, {}, this.getArchivedStatus());
      }

      if (this.monitoringSearch) {
        queryParams.search = this.monitoringSearch;
      }

      var parsedQueryParams = stringify(queryParams);

      if (parsedQueryParams.length === 0) {
        return "" + currentLocation.pathname;
      }

      return currentLocation.pathname + "?" + parsedQueryParams;
    }
  }], [{
    key: "createFromQueryParams",
    value: function createFromQueryParams(params) {
      var modelParameters = pick(params, SUPPORTED_QUERY_PARAMS);

      if (!Object.keys(FEED_ARCHIVE_STATUS).includes(params.archivedStatus)) {
        modelParameters.archivedStatus = DEFAULTS.archivedStatus;
      }

      if (params.search) {
        modelParameters.monitoringSearch = params.search;
      } else {
        modelParameters.monitoringSearch = DEFAULTS.monitoringSearch;
      }

      return new Inbox(modelParameters);
    }
  }]);

  return Inbox;
}(Record(DEFAULTS));

export { Inbox as default };