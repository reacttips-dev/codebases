'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import partial from 'transmute/partial';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIMicroTimeInput from 'UIComponents/input/UIMicroTimeInput';
var TIME_INTERVAL = 1;

var TimeRangeSelection = function TimeRangeSelection(props) {
  var sendWindowStartsAtMin = props.sendWindowStartsAtMin,
      sendWindowEndsAtMin = props.sendWindowEndsAtMin,
      handleTempEmailTimeUpdate = props.handleTempEmailTimeUpdate,
      readOnly = props.readOnly;

  var handleChange = function handleChange(field, e) {
    handleTempEmailTimeUpdate(field, e.target.value);
  };

  return /*#__PURE__*/_jsxs("div", {
    className: "p-top-1 m-left-2 display-inline",
    children: [/*#__PURE__*/_jsx(UIMicroTimeInput, {
      interval: TIME_INTERVAL,
      value: sendWindowStartsAtMin,
      onChange: partial(handleChange, 'sendWindowStartsAtMin'),
      max: sendWindowEndsAtMin,
      readOnly: readOnly,
      "aria-label": I18n.text('enrollModal.sequenceOptions.enrollmentSettings.followUpEmails.sendWindow.aria.timeRangeStart')
    }), /*#__PURE__*/_jsx(UIIcon, {
      name: "next",
      size: 11,
      className: "m-left-2 m-right-2"
    }), /*#__PURE__*/_jsx(UIMicroTimeInput, {
      interval: TIME_INTERVAL,
      value: sendWindowEndsAtMin,
      onChange: partial(handleChange, 'sendWindowEndsAtMin'),
      min: sendWindowStartsAtMin,
      readOnly: readOnly,
      "aria-label": I18n.text('enrollModal.sequenceOptions.enrollmentSettings.followUpEmails.sendWindow.aria.timeRangeEnd')
    })]
  });
};

TimeRangeSelection.propTypes = {
  sendWindowStartsAtMin: PropTypes.number.isRequired,
  sendWindowEndsAtMin: PropTypes.number.isRequired,
  handleTempEmailTimeUpdate: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired
};
export default TimeRangeSelection;