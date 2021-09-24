'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';
import { pick } from 'underscore';
import { stringify } from 'hub-http/helpers/params';
import ViewTypes from 'ui-addon-calendars/constants/CalendarViewTypes';
import { ACCOUNT_TYPES, MEDIA_FILTER_OPTIONS, SIMPLE_DATE_FORMAT, UPLOADED_BROADCAST_ISSUE_FILTER, getNetworkFromChannelKey } from '../../lib/constants';
import { getDateRangePresetValue, RANGE_TYPES, safeStringifyDate } from '../../lib/dateUtils';
var DEFAULTS = {
  dateRangeKey: RANGE_TYPES.LAST_THIRTY_DAYS,
  startDate: null,
  endDate: null,
  page: 1,
  pageSize: 10,
  total: null,
  sortBy: null,
  sortOrder: null,
  excludedChannelKeys: ImmutableSet(),
  allChannelKeys: ImmutableSet(),
  network: null,
  campaignGuid: null,
  createdBy: null,
  uploadedIssueFilterState: UPLOADED_BROADCAST_ISSUE_FILTER.ALL_POSTS,
  broadcastStatusType: null,
  requestedStatusType: null,
  broadcastsLastRequested: null,
  shouldPollBroadcasts: null,
  mediaType: MEDIA_FILTER_OPTIONS.all,
  calendarViewType: ViewTypes.MONTH,
  calendarDate: I18n.moment().portalTz(),
  showDrafts: true,
  noRedirect: null,
  channelsCachedAt: null
};
var SUPPORTED_QUERY_PARAMS = ['dateRangeKey', 'archivedStatus', 'campaignGuid', 'createdBy', 'mediaType', 'startDate', 'endDate', 'search', 'noRedirect'];

var DataFilter = /*#__PURE__*/function (_Record) {
  _inherits(DataFilter, _Record);

  function DataFilter() {
    _classCallCheck(this, DataFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(DataFilter).apply(this, arguments));
  }

  _createClass(DataFilter, [{
    key: "getSelectedChannelKeys",
    value: function getSelectedChannelKeys() {
      var _this = this;

      var allChannelKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.allChannelKeys;

      if (!this.network) {
        return allChannelKeys;
      }

      allChannelKeys = allChannelKeys.filter(function (ck) {
        return getNetworkFromChannelKey(ck) === _this.network;
      }); // since we recall the channel picker state in localStorage, is better to remember the deselected channels so that
      // newly added ones will be selected (also makes it simpler to maintain state immediately after connecting a new account)

      return allChannelKeys.subtract(this.excludedChannelKeys);
    }
  }, {
    key: "hasPartialChannelSelection",
    value: function hasPartialChannelSelection() {
      return Boolean(this.network);
    }
  }, {
    key: "isFilteringEngaged",
    value: function isFilteringEngaged() {
      return this.hasPartialChannelSelection() || this.dateRangeKey !== DEFAULTS.dateRangeKey || this.campaignGuid;
    }
  }, {
    key: "daysApart",
    value: function daysApart() {
      return I18n.moment(this.endDate).diff(I18n.moment(this.startDate), 'days');
    }
  }, {
    key: "getPeriod",
    value: function getPeriod() {
      return this.dateRangeKey === RANGE_TYPES.LAST_THREE_MONTHS || this.daysApart() >= 90 ? 'monthly' : 'daily';
    }
  }, {
    key: "getReportsHistogramPeriod",
    value: function getReportsHistogramPeriod() {
      return this.dateRangeKey === RANGE_TYPES.LAST_THREE_MONTHS || this.daysApart() >= 90 ? 'MONTH' : 'DAY';
    }
  }, {
    key: "getDateParams",
    value: function getDateParams() {
      if (this.dateRangeKey !== DEFAULTS.dateRangeKey) {
        if (this.dateRangeKey === RANGE_TYPES.CUSTOM) {
          return {
            dateRangeKey: this.dateRangeKey,
            startDate: this.startDate,
            endDate: this.endDate
          };
        }

        return {
          dateRangeKey: this.dateRangeKey
        };
      }

      return {};
    }
  }, {
    key: "getCalendarDateParam",
    value: function getCalendarDateParam() {
      return I18n.moment(this.calendarDate).isSame(I18n.moment().portalTz(), this.calendarViewType.toLowerCase()) ? null : this.calendarDate.format(SIMPLE_DATE_FORMAT);
    }
  }, {
    key: "getCalendarMonthParam",
    value: function getCalendarMonthParam() {
      return this.calendarViewType !== ViewTypes.MONTH ? this.calendarViewType.toLowerCase() : null;
    }
  }, {
    key: "getUrlForParams",
    value: function getUrlForParams(currentPath) {
      var isCalendarMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var queryParams = {};

      if (this.dateRangeKey && this.dateRangeKey !== DEFAULTS.dateRangeKey) {
        queryParams = Object.assign({}, queryParams, {}, this.getDateParams());
      }

      if (this.campaignGuid) {
        queryParams.campaignGuid = this.campaignGuid;
      }

      if (this.createdBy) {
        queryParams.createdBy = this.createdBy;
      }

      if (this.network) {
        queryParams.network = this.network;
      }

      if (this.mediaType && this.mediaType !== DEFAULTS.mediaType) {
        queryParams.mediaType = this.mediaType;
      }

      if (!this.showDrafts) {
        queryParams.showDrafts = false;
      }

      if (isCalendarMode) {
        queryParams.view = this.getCalendarMonthParam(queryParams);
        queryParams.date = this.getCalendarDateParam(queryParams);
      }

      if (this.noRedirect) {
        queryParams.noRedirect = true;
      }

      var parsedQueryParams = stringify(queryParams);

      if (parsedQueryParams.length === 0) {
        return "" + currentPath.pathname;
      }

      var url = currentPath.pathname + "?" + parsedQueryParams;
      return url;
    }
  }], [{
    key: "createFrom",
    // just used for tests
    value: function createFrom() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (attrs.allChannelKeys) {
        attrs.allChannelKeys = ImmutableSet(attrs.allChannelKeys);
      }

      if (attrs.excludedChannelKeys) {
        attrs.excludedChannelKeys = ImmutableSet(attrs.excludedChannelKeys);
      } // a passed date range type will end up creating it own startDate/endDate here, or will fall back to default LAST_30_DAYS to do so


      var dateRange = getDateRangePresetValue(attrs.dateRangeKey || DEFAULTS.dateRangeKey); // unless its CUSTOM, in which case honor them (todo - should probably validate though)

      attrs.startDate = attrs.startDate || safeStringifyDate(dateRange.startDate);
      attrs.endDate = attrs.endDate || safeStringifyDate(dateRange.endDate);
      return new DataFilter(attrs);
    }
  }, {
    key: "createFromQueryParams",
    value: function createFromQueryParams(params) {
      var modelParameters = pick(params, SUPPORTED_QUERY_PARAMS);

      if (!Object.values(RANGE_TYPES || {}).includes(modelParameters.dateRangeKey)) {
        modelParameters.dateRangeKey = DEFAULTS.dateRangeKey;
      }

      if (params.network && Object.keys(ACCOUNT_TYPES).includes(params.network)) {
        modelParameters.network = params.network;
      }

      if (params.view) {
        if (ViewTypes[params.view.toUpperCase()]) {
          modelParameters.calendarViewType = ViewTypes[params.view.toUpperCase()];
        } else {
          modelParameters.calendarViewType = ViewTypes.MONTH;
        }

        if (params.date) {
          modelParameters.calendarDate = I18n.moment(params.date).portalTz();
        }
      }

      if (params.showDrafts) {
        modelParameters.showDrafts = params.showDrafts.toLowerCase() === 'true';
      }

      if (modelParameters.createdBy) {
        modelParameters.createdBy = parseInt(modelParameters.createdBy, 10);
      }

      return DataFilter.createFrom(modelParameters);
    }
  }]);

  return DataFilter;
}(Record(DEFAULTS));

export { DataFilter as default };