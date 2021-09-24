'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import once from 'transmute/once';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import { enrollmentSetTimezone } from 'sales-modal/redux/actions/EnrollmentEditorActions';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import getTimezoneGroups from 'timezone-utils/utils/getTimezoneGroups';
import groupsToSelectOpts from 'timezone-utils/utils/groupsToSelectOpts';
import { EnrollTypePropType, EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import * as LocalStorageKeys from 'sales-modal/constants/LocalStorageKeys';
import * as localSettings from 'sales-modal/lib/localSettings';
import UISelect from 'UIComponents/input/UISelect';
var getTimezones = once(function () {
  return groupsToSelectOpts(getTimezoneGroups());
});
var defaultTimezone = 'US/Eastern';
var SequenceSetTimezone = createReactClass({
  displayName: "SequenceSetTimezone",
  propTypes: {
    timezone: PropTypes.string.isRequired,
    enrollmentSetTimezone: PropTypes.func.isRequired,
    enrollType: EnrollTypePropType.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      isLoaded: false
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    this.delayLoad = setTimeout(function () {
      _this.setState({
        isLoaded: true
      });
    }, 1000);
  },
  componentWillUnmount: function componentWillUnmount() {
    clearTimeout(this.delayLoad);
  },
  handleTimezoneChange: function handleTimezoneChange(_ref) {
    var value = _ref.target.value;
    localSettings.set(LocalStorageKeys.TIMEZONE_SELECTION, value);
    this.props.enrollmentSetTimezone(value);
    UsageTracker.track('sequencesUsage', {
      action: 'Changed time zone',
      subscreen: 'enroll'
    });
  },
  renderSelect: function renderSelect() {
    var isLoaded = this.state.isLoaded;
    var _this$props = this.props,
        timezone = _this$props.timezone,
        enrollType = _this$props.enrollType;
    var options = isLoaded ? getTimezones() : [];
    var defaultValue = isLoaded ? getTimezoneGroups().resolve(timezone, defaultTimezone) : I18n.text('enrollModal.sequenceOptions.timezoneSetting.selectedTimezone');
    return /*#__PURE__*/_jsx(UISelect, {
      "data-test-id": "timezone-select",
      menuWidth: 500,
      buttonUse: "transparent",
      onChange: this.handleTimezoneChange,
      options: options,
      value: defaultValue,
      disabled: enrollType === EnrollTypes.VIEW || !isLoaded
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("strong", {
        className: "m-left-3",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.sequenceOptions.timezoneSetting.timezone"
        })
      }), this.renderSelect()]
    });
  }
});
export default connect(function (state) {
  return {
    enrollType: state.enrollType
  };
}, {
  enrollmentSetTimezone: enrollmentSetTimezone
})(SequenceSetTimezone);