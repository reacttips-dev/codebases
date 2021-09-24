'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import { Fragment } from 'react';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { getDateAndTime } from 'sales-modal/utils/enrollModal/getDateAndTime';
import { getReadOnlyTimeInfo } from 'sales-modal/utils/enrollModal/SendTimeUtils';

var StepTimeReadOnlyViewTooltip = function StepTimeReadOnlyViewTooltip(_ref) {
  var stepIndex = _ref.stepIndex,
      sequenceEnrollment = _ref.sequenceEnrollment,
      children = _ref.children;

  var _getReadOnlyTimeInfo = getReadOnlyTimeInfo({
    stepIndex: stepIndex,
    sequenceEnrollment: sequenceEnrollment
  }),
      stepEnrollment = _getReadOnlyTimeInfo.stepEnrollment,
      executedTimestamp = _getReadOnlyTimeInfo.executedTimestamp,
      scheduledExecution = _getReadOnlyTimeInfo.scheduledExecution,
      absoluteTime = _getReadOnlyTimeInfo.absoluteTime;

  var absoluteTimeHumanReadable = getDateAndTime(I18n.moment.userTz(absoluteTime));

  var stepDetails = /*#__PURE__*/_jsxs("p", {
    children: [/*#__PURE__*/_jsx("b", {
      children: "sequenceEnrollment.steps details:"
    }), /*#__PURE__*/_jsx("br", {}), "absoluteTime: ", absoluteTime, /*#__PURE__*/_jsx("br", {}), absoluteTimeHumanReadable.date, " at ", absoluteTimeHumanReadable.time, " (user tz)"]
  });

  var stepEnrollmentDetails = stepEnrollment ? /*#__PURE__*/_jsxs("p", {
    children: [/*#__PURE__*/_jsx("b", {
      children: "stepEnrollment details:"
    }), /*#__PURE__*/_jsx("br", {}), "stepEnrollmentState: ", "" + stepEnrollment.get('state'), executedTimestamp && /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("br", {}), "executedTimestamp:", ' ', Math.abs(executedTimestamp - absoluteTime) < 30000 ? /*#__PURE__*/_jsx("i", {
        children: "similar to absoluteTime"
      }) : "" + executedTimestamp]
    }), /*#__PURE__*/_jsx("br", {}), "scheduledExecution:", ' ', scheduledExecution === absoluteTime ? /*#__PURE__*/_jsx("i", {
      children: "same as absoluteTime"
    }) : "" + scheduledExecution]
  }) : null;
  return /*#__PURE__*/_jsx(UITooltip, {
    use: "longform",
    maxWidth: 600,
    title: /*#__PURE__*/_jsxs(Fragment, {
      children: [stepDetails, stepEnrollmentDetails]
    }),
    placement: "right",
    children: children
  });
};

export default StepTimeReadOnlyViewTooltip;