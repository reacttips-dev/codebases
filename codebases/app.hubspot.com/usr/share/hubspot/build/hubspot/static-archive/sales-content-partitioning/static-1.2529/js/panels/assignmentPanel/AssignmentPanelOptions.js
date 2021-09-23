'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { PRIVATE, EVERYONE, SPECIFIC } from 'sales-content-partitioning/constants/SharingOptionTypes';
import { getContentTypeKey } from 'sales-content-partitioning/utils/langKeys';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SharingRadioInput from './SharingRadioInput';

var AssignmentPanelOptions = function AssignmentPanelOptions(_ref) {
  var objectType = _ref.objectType,
      sharingOption = _ref.sharingOption,
      canAssignContent = _ref.canAssignContent,
      handleSharingOptionChange = _ref.handleSharingOptionChange;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx("b", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentPartitioning.assignmentPanel.message." + getContentTypeKey(objectType)
      })
    }), /*#__PURE__*/_jsx(SharingRadioInput, {
      option: PRIVATE,
      selectedValue: sharingOption,
      onChange: handleSharingOptionChange
    }), /*#__PURE__*/_jsx(SharingRadioInput, {
      option: EVERYONE,
      selectedValue: sharingOption,
      onChange: handleSharingOptionChange
    }), /*#__PURE__*/_jsx(SharingRadioInput, {
      option: SPECIFIC,
      selectedValue: sharingOption,
      onChange: handleSharingOptionChange,
      readOnly: !canAssignContent,
      showLock: !canAssignContent
    })]
  });
};

AssignmentPanelOptions.propTypes = {
  objectType: PropTypes.string.isRequired,
  sharingOption: PropTypes.oneOf([PRIVATE, EVERYONE, SPECIFIC]).isRequired,
  canAssignContent: PropTypes.bool.isRequired,
  handleSharingOptionChange: PropTypes.func.isRequired
};
export default AssignmentPanelOptions;