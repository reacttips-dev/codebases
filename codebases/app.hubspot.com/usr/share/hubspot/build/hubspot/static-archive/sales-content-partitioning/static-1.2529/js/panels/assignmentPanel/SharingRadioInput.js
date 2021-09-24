'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _SHARING_OPTION_LANG_;

import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { PRIVATE, EVERYONE, SPECIFIC } from 'sales-content-partitioning/constants/SharingOptionTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILockBadge from 'UIComponents/badge/UILockBadge';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
var SHARING_OPTION_LANG_KEYS = (_SHARING_OPTION_LANG_ = {}, _defineProperty(_SHARING_OPTION_LANG_, PRIVATE, 'salesContentPartitioning.assignmentPanel.sharingOptions.private'), _defineProperty(_SHARING_OPTION_LANG_, EVERYONE, 'salesContentPartitioning.assignmentPanel.sharingOptions.shareEveryone'), _defineProperty(_SHARING_OPTION_LANG_, SPECIFIC, 'salesContentPartitioning.assignmentPanel.sharingOptions.shareSpecific'), _SHARING_OPTION_LANG_);

var SharingRadioInput = function SharingRadioInput(_ref) {
  var selectedValue = _ref.selectedValue,
      option = _ref.option,
      showLock = _ref.showLock,
      onChange = _ref.onChange,
      readOnly = _ref.readOnly;
  return /*#__PURE__*/_jsx(UIRadioInput, {
    value: option,
    checked: selectedValue === option,
    name: "sharingOptions",
    onChange: onChange,
    readOnly: readOnly,
    children: /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: SHARING_OPTION_LANG_KEYS[option]
      }), showLock && /*#__PURE__*/_jsx(UILockBadge, {})]
    })
  });
};

SharingRadioInput.propTypes = {
  option: PropTypes.oneOf([PRIVATE, EVERYONE, SPECIFIC]).isRequired,
  selectedValue: PropTypes.oneOf([PRIVATE, EVERYONE, SPECIFIC]).isRequired,
  showLock: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};
export default SharingRadioInput;