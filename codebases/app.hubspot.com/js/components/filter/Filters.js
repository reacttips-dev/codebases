'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import UIMicroDateRange from 'UIComponents/dates/UIMicroDateRange';
import UISelect from 'UIComponents/input/UISelect';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import CampaignFilter from 'campaigns-lib/components/campaignSelect/CampaignFilter';
import { BROADCAST_STATUS_TYPE, MEDIA_FILTERS_ORDERED, UPLOADED_BROADCAST_ISSUE_FILTER } from '../../lib/constants';
import { passPropsFor } from '../../lib/utils';
import { abstractChannelsProp, mapProp, orderedMapProp, uiProp } from '../../lib/propTypes';
import NetworkChannelSelect from '../channel/NetworkChannelSelect';
import SocialContext from '../app/SocialContext';
import UserSelect from '../notifications/UserSelect';
import { SHORT_DATE_RANGE_PRESETS, safeParseDate, safeStringifyDate } from '../../lib/dateUtils';

var Filters = /*#__PURE__*/function (_Component) {
  _inherits(Filters, _Component);

  function Filters() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Filters);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Filters)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onSelectCampaign = function (e) {
      _this.props.updateDataFilter({
        campaignGuid: e.target.value
      });
    };

    _this.onSelectDateRange = function (e) {
      var dateRange = e.target.value;

      if (!(dateRange.startDate && dateRange.endDate)) {
        // ignore if user presses 'clear', we need both dates
        return;
      }

      var updateAttrs = {
        dateRangeKey: dateRange.presetId || 'CUSTOM',
        endDate: safeStringifyDate(dateRange.endDate),
        startDate: safeStringifyDate(dateRange.startDate)
      };

      _this.props.updateDataFilter(updateAttrs);
    };

    _this.onChangeUploadedIssueState = function (evt) {
      _this.context.trackInteraction('bulk filtering by issues');

      if (_this.props.dataFilter.uploadedIssueFilterState !== evt.target.value) {
        _this.props.updateDataFilter({
          uploadedIssueFilterState: evt.target.value
        });
      }
    };

    _this.onChangeCreatedBy = function (e) {
      _this.context.trackInteraction('change created by');

      _this.props.updateDataFilter({
        createdBy: e.target.value
      });
    };

    return _this;
  }

  _createClass(Filters, [{
    key: "renderUploadedIssueFilterPopover",
    value: function renderUploadedIssueFilterPopover() {
      if (this.props.dataFilter.broadcastStatusType !== BROADCAST_STATUS_TYPE.uploaded) {
        return null;
      }

      var selectOptions = [{
        text: I18n.text('sui.filters.uploadedIssue.allPosts'),
        value: UPLOADED_BROADCAST_ISSUE_FILTER.ALL_POSTS
      }, {
        text: I18n.text('sui.filters.uploadedIssue.issues'),
        value: UPLOADED_BROADCAST_ISSUE_FILTER.ISSUES
      }];
      return /*#__PURE__*/_jsx(UISelect, {
        value: this.props.dataFilter.uploadedIssueFilterState,
        className: "uploaded-issue-select",
        dropdownClassName: "uploaded-issue-filter-states style-select",
        menuWidth: 250,
        placeholder: I18n.text("sui.filters.uploadedIssue.allPosts"),
        buttonUse: 'transparent',
        options: selectOptions,
        onChange: this.onChangeUploadedIssueState
      });
    }
  }, {
    key: "renderChannelPopover",
    value: function renderChannelPopover() {
      var _this$props = this.props,
          channels = _this$props.channels,
          dataFilter = _this$props.dataFilter;

      if (!channels) {
        return /*#__PURE__*/_jsx("span", {
          className: "channel-select-loading",
          children: /*#__PURE__*/_jsx(UILoadingSpinner, {})
        });
      }

      var selectedChannelKeys = dataFilter.getSelectedChannelKeys(); // ensure everything the DF says selected is actually a channel option, keeping channels in order (or else react-select ends up jumping scroll position)

      var value = channels.keySeq().toOrderedSet().intersect(selectedChannelKeys);
      return /*#__PURE__*/_createElement(NetworkChannelSelect, Object.assign({}, passPropsFor(this.props, NetworkChannelSelect), {
        key: "channel-select",
        channels: channels,
        value: value,
        network: this.props.dataFilter.network
      }));
    }
  }, {
    key: "renderCampaignPicker",
    value: function renderCampaignPicker() {
      var _this$props2 = this.props,
          hasCampaignsReadAccess = _this$props2.hasCampaignsReadAccess,
          dataFilter = _this$props2.dataFilter;
      return /*#__PURE__*/_jsx(CampaignFilter, {
        className: "m-x-2",
        hasCampaignsReadAccess: hasCampaignsReadAccess,
        onChange: this.onSelectCampaign,
        value: dataFilter.campaignGuid
      });
    }
  }, {
    key: "renderDateRangePicker",
    value: function renderDateRangePicker() {
      var dataFilter = this.props.dataFilter;

      if (dataFilter.broadcastStatusType !== BROADCAST_STATUS_TYPE.published) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIMicroDateRange, {
        use: "on-dark",
        tz: "portalTz",
        "data-test-id": "date-range-picker",
        onChange: this.onSelectDateRange,
        presets: SHORT_DATE_RANGE_PRESETS,
        value: {
          presetId: dataFilter.dateRangeKey,
          startDate: safeParseDate(dataFilter.startDate),
          endDate: safeParseDate(dataFilter.endDate)
        }
      });
    }
  }, {
    key: "renderMediaTypeFilter",
    value: function renderMediaTypeFilter() {
      var _this2 = this;

      var options = MEDIA_FILTERS_ORDERED.map(function (value) {
        return {
          text: I18n.text("sui.filters.mediaType." + value),
          value: value
        };
      });
      return /*#__PURE__*/_jsx(UISelect, {
        className: "media-type-filter filter",
        options: options,
        buttonUse: "transparent",
        value: this.props.dataFilter.mediaType,
        onChange: function onChange(e) {
          return _this2.props.updateDataFilter({
            mediaType: e.target.value
          });
        }
      });
    }
  }, {
    key: "renderShowDraftSelect",
    value: function renderShowDraftSelect() {
      var _this3 = this;

      return /*#__PURE__*/_jsx(UICheckbox, {
        className: "show-drafts",
        checked: this.props.dataFilter.showDrafts,
        size: "small",
        inline: true,
        onChange: function onChange(e) {
          return _this3.props.updateDataFilter({
            showDrafts: e.target.checked
          });
        },
        children: /*#__PURE__*/_jsx("span", {
          style: {
            color: 'initial'
          },
          children: I18n.text('sui.filters.showDrafts')
        })
      });
    }
  }, {
    key: "renderCreatedBy",
    value: function renderCreatedBy() {
      if (!this.props.users) {
        return null;
      }

      return /*#__PURE__*/_jsx(UserSelect, Object.assign({}, passPropsFor(this.props, UserSelect), {
        value: this.props.dataFilter.createdBy,
        showLabel: false,
        onChange: this.onChangeCreatedBy
      }));
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs("section", {
        className: "publishing-filters filters",
        children: [this.renderChannelPopover(), this.renderDateRangePicker(), this.renderCampaignPicker(), this.renderCreatedBy(), this.props.showMediaTypeFilter && this.renderMediaTypeFilter(), this.props.showDraftSelect && this.renderShowDraftSelect(), this.renderUploadedIssueFilterPopover()]
      });
    }
  }]);

  return Filters;
}(Component);

Filters.propTypes = {
  channels: abstractChannelsProp,
  users: orderedMapProp,
  ui: uiProp,
  showCalendarSwitcher: PropTypes.bool,
  showMediaTypeFilter: PropTypes.bool,
  push: PropTypes.func,
  showDraftSelect: PropTypes.bool,
  onDarkBg: PropTypes.bool,
  dataFilter: PropTypes.object,
  updateDataFilter: PropTypes.func,
  updateSelectedNetwork: PropTypes.func,
  updateStorage: PropTypes.func,
  hasCampaignsReadAccess: PropTypes.bool.isRequired,
  currentLocation: PropTypes.object,
  uploadedErrors: mapProp,
  location: PropTypes.object.isRequired,
  portalId: PropTypes.number.isRequired
};
Filters.defaultProps = {
  showMediaTypeFilter: false
};
Filters.contextType = SocialContext;
export { Filters as default };