'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import * as EnrollmentEditorActions from 'sales-modal/redux/actions/EnrollmentEditorActions';
import { PlatformPropType } from 'sales-modal/constants/Platform';
import { getPlatform as getPlatformSelector } from 'sales-modal/redux/selectors/SenderSelectors';
import { getSendTimeAlertType as getSendTimeAlertTypeSelector, getFirstStepWithCloseToSendLimitWarning as getFirstStepWithCloseToSendLimitWarningSelector, getSendLimits as getSendLimitsSelector, getHasSendLimitDataForStepsWithErrors as getHasSendLimitDataForStepsWithErrorsSelector } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import SendTimeAlert from './SendTimeAlert';

var SendTimeAlertContainer = function SendTimeAlertContainer(_ref) {
  var sendTimeAlertTracking = _ref.sendTimeAlertTracking,
      viewedSendTimeAlert = _ref.viewedSendTimeAlert,
      platform = _ref.platform,
      warningType = _ref.warningType,
      stepWithCloseToLimitError = _ref.stepWithCloseToLimitError,
      sendLimits = _ref.sendLimits,
      stepsWithSendTimeErrors = _ref.stepsWithSendTimeErrors,
      timezone = _ref.timezone,
      className = _ref.className,
      hasSendLimitDataForStepsWithErrors = _ref.hasSendLimitDataForStepsWithErrors;
  useEffect(function () {
    if (!sendTimeAlertTracking.get(warningType)) {
      UsageTracker.track('dailyLimitNotices', {
        type: warningType,
        source: platform
      });
      viewedSendTimeAlert(warningType);
    }
  }, [warningType, sendTimeAlertTracking, platform, viewedSendTimeAlert]);

  if (!sendLimits.size || !hasSendLimitDataForStepsWithErrors) {
    return null;
  }

  return /*#__PURE__*/_jsx(SendTimeAlert, {
    className: className,
    warningType: warningType,
    stepWithCloseToLimitError: stepWithCloseToLimitError,
    sendLimits: sendLimits,
    stepsWithSendTimeErrors: stepsWithSendTimeErrors,
    timezone: timezone
  });
};

SendTimeAlertContainer.propTypes = {
  platform: PlatformPropType.isRequired,
  sendTimeAlertTracking: PropTypes.instanceOf(ImmutableMap).isRequired,
  viewedSendTimeAlert: PropTypes.func.isRequired,
  warningType: PropTypes.string.isRequired,
  stepWithCloseToLimitError: PropTypes.array,
  sendLimits: PropTypes.instanceOf(ImmutableMap).isRequired,
  stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap),
  timezone: PropTypes.string,
  className: PropTypes.string,
  hasSendLimitDataForStepsWithErrors: PropTypes.bool.isRequired
};
export default connect(function (state) {
  return {
    sendTimeAlertTracking: state.enrollmentState.sendTimeAlertTracking,
    platform: getPlatformSelector(state),
    warningType: getSendTimeAlertTypeSelector(state),
    stepWithCloseToLimitError: getFirstStepWithCloseToSendLimitWarningSelector(state),
    sendLimits: getSendLimitsSelector(state),
    hasSendLimitDataForStepsWithErrors: getHasSendLimitDataForStepsWithErrorsSelector(state)
  };
}, {
  viewedSendTimeAlert: EnrollmentEditorActions.viewedSendTimeAlert
})(SendTimeAlertContainer);