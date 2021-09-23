'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import formatShortDate from 'I18n/utils/formatShortDate';
import { connect } from 'react-redux';
import { getSendLimits, getHasSendLimitDataForStepsWithErrors } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { sendLimitLearnMore } from 'sales-modal/lib/links';
import { SEND_LIMIT_EXCEEDED, THROTTLED } from 'sales-modal/constants/SendTimesNotAvailableReasons';
import { PRIMARY_SEQUENCE_ID } from 'sales-modal/constants/BulkEnrollConstants';
import { isSameDay, getMessagePropsForSendTimeError } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import UILink from 'UIComponents/link/UILink';
import Small from 'UIComponents/elements/Small';
import UIIcon from 'UIComponents/icon/UIIcon';
import { MARIGOLD } from 'HubStyleTokens/colors';
import { EnrollTypes, EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';
var SequenceStepTimeSelectionError = createReactClass({
  displayName: "SequenceStepTimeSelectionError",
  propTypes: {
    enrollType: EnrollTypePropType.isRequired,
    selectedContact: PropTypes.string,
    stepIndex: PropTypes.number.isRequired,
    stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap),
    sendLimits: PropTypes.instanceOf(ImmutableMap),
    timezone: PropTypes.string.isRequired,
    hasSendLimitDataForStepsWithErrors: PropTypes.bool.isRequired
  },
  hasSelectedPrimarySequence: function hasSelectedPrimarySequence() {
    return this.props.enrollType === EnrollTypes.BULK_ENROLL && this.props.selectedContact !== PRIMARY_SEQUENCE_ID;
  },
  getSendLimitWarningDataForStep: function getSendLimitWarningDataForStep() {
    var _this$props = this.props,
        sendLimits = _this$props.sendLimits,
        stepIndex = _this$props.stepIndex;
    return sendLimits.find(function (data) {
      return data.get('stepNumber') - 1 === stepIndex && data.get('availableSendsUntilMidnight') <= 100;
    });
  },
  getClassName: function getClassName() {
    var _this$props2 = this.props,
        stepsWithSendTimeErrors = _this$props2.stepsWithSendTimeErrors,
        stepIndex = _this$props2.stepIndex;
    return stepsWithSendTimeErrors.get(stepIndex) ? 'sequence-send-limit-error-message' : 'sequence-send-limit-warning-message';
  },
  getMessage: function getMessage() {
    var _this$props3 = this.props,
        stepsWithSendTimeErrors = _this$props3.stepsWithSendTimeErrors,
        sendLimits = _this$props3.sendLimits,
        stepIndex = _this$props3.stepIndex,
        timezone = _this$props3.timezone;

    if (stepsWithSendTimeErrors.get(stepIndex) === SEND_LIMIT_EXCEEDED) {
      var _getMessagePropsForSe = getMessagePropsForSendTimeError(stepsWithSendTimeErrors, sendLimits, SEND_LIMIT_EXCEEDED, timezone),
          isDateToday = _getMessagePropsForSe.isDateToday,
          limit = _getMessagePropsForSe.limit,
          formattedDate = _getMessagePropsForSe.formattedDate;

      return /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "enrollModal.delaySelector.sendLimitErrorMessage." + (isDateToday ? 'today_jsx' : 'laterDate_jsx'),
        options: {
          href: sendLimitLearnMore(),
          limit: I18n.formatNumber(limit),
          date: formattedDate
        },
        elements: {
          Link: UILink
        }
      });
    } else if (stepsWithSendTimeErrors.get(stepIndex) === THROTTLED) {
      var _getMessagePropsForSe2 = getMessagePropsForSendTimeError(stepsWithSendTimeErrors, sendLimits, THROTTLED, timezone),
          _isDateToday = _getMessagePropsForSe2.isDateToday,
          _formattedDate = _getMessagePropsForSe2.formattedDate;

      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.delaySelector.sendWindowErrorMessage." + (_isDateToday ? 'today' : 'laterDate'),
        options: {
          date: _formattedDate
        }
      });
    } else {
      var timestamp = sendLimits.findKey(function (data) {
        return data.get('stepNumber') - 1 === stepIndex && data.get('availableSendsUntilMidnight') <= 100;
      });
      var stepWithWarning = this.getSendLimitWarningDataForStep();
      var dateKey = isSameDay(Number(timestamp), timezone) ? 'today_jsx' : 'laterDate_jsx';
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(UIIcon, {
          className: "p-right-2",
          color: MARIGOLD,
          name: "warning"
        }), /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: "enrollModal.delaySelector.sendLimitWarningMessage." + dateKey,
          options: {
            href: sendLimitLearnMore(),
            count: stepWithWarning.get('availableSendsUntilMidnight'),
            date: formatShortDate(I18n.moment(Number(timestamp)).tz(timezone))
          },
          elements: {
            Link: UILink
          }
        })]
      });
    }
  },
  render: function render() {
    var _this$props4 = this.props,
        sendLimits = _this$props4.sendLimits,
        stepsWithSendTimeErrors = _this$props4.stepsWithSendTimeErrors,
        stepIndex = _this$props4.stepIndex,
        hasSendLimitDataForStepsWithErrors = _this$props4.hasSendLimitDataForStepsWithErrors;

    if (this.hasSelectedPrimarySequence() || !sendLimits.size || !hasSendLimitDataForStepsWithErrors || !stepsWithSendTimeErrors.get(stepIndex) && !this.getSendLimitWarningDataForStep()) {
      return null;
    }

    return /*#__PURE__*/_jsx(Small, {
      className: this.getClassName(),
      children: this.getMessage()
    });
  }
});
export default connect(function (state) {
  return {
    enrollType: state.enrollType,
    sendLimits: getSendLimits(state),
    hasSendLimitDataForStepsWithErrors: getHasSendLimitDataForStepsWithErrors(state)
  };
}, {})(SequenceStepTimeSelectionError);