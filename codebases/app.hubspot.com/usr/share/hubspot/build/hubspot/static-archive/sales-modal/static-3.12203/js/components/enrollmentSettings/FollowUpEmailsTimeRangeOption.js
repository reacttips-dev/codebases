'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { recommendedSendTimeLearnMore } from 'sales-modal/lib/links';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILink from 'UIComponents/link/UILink';
import Small from 'UIComponents/elements/Small';
import TimeRangeSelection from './TimeRangeSelection';
import { EnrollTypePropType, EnrollTypes } from 'sales-modal/constants/EnrollTypes';

var FollowUpEmailsTimeRangeOption = function FollowUpEmailsTimeRangeOption(_ref) {
  var enrollType = _ref.enrollType,
      sendWindowStartsAtMin = _ref.sendWindowStartsAtMin,
      sendWindowEndsAtMin = _ref.sendWindowEndsAtMin,
      handleTempSettingsUpdate = _ref.handleTempSettingsUpdate,
      readOnly = _ref.readOnly;

  var handleTimeUpdate = function handleTimeUpdate(field, value) {
    handleTempSettingsUpdate(field, value);
  };

  return /*#__PURE__*/_jsxs("div", {
    className: "p-top-2",
    children: [/*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.sequenceOptions.enrollmentSettings.followUpEmails.sendWindow.label"
    }), /*#__PURE__*/_jsx(TimeRangeSelection, {
      sendWindowStartsAtMin: sendWindowStartsAtMin,
      sendWindowEndsAtMin: sendWindowEndsAtMin,
      handleTempEmailTimeUpdate: handleTimeUpdate,
      readOnly: readOnly
    }), enrollType !== EnrollTypes.BULK_ENROLL && /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "dynamicFilter",
        size: "small",
        className: "m-top-1"
      }), /*#__PURE__*/_jsx(Small, {
        children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: "enrollModal.sequenceOptions.enrollmentSettings.emails.helpText_jsx",
          options: {
            href: recommendedSendTimeLearnMore(),
            external: true
          },
          elements: {
            Link: UILink
          }
        })
      })]
    })]
  });
};

FollowUpEmailsTimeRangeOption.propTypes = {
  enrollType: EnrollTypePropType.isRequired,
  sendWindowStartsAtMin: PropTypes.number.isRequired,
  sendWindowEndsAtMin: PropTypes.number.isRequired,
  handleTempSettingsUpdate: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired
};
export default FollowUpEmailsTimeRangeOption;