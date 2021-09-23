'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import StepExecutionTime from '../StepExecutionTime';
import TaskCompletionTime from '../TaskCompletionTime';
import * as links from '../../../lib/links';
import * as TasksActions from '../../../redux/actions/TasksActions';
import { hasRequestedTaskForCompletedStep, taskForCompletedStep, taskIdFromCompletedStep } from 'sales-modal/redux/selectors/TasksSelectors';

function SequenceStepCompletionTime(_ref) {
  var createdTaskId = _ref.createdTaskId,
      completedStep = _ref.completedStep,
      fetchTask = _ref.fetchTask,
      hasRequestedTask = _ref.hasRequestedTask,
      _ref$showTaskLink = _ref.showTaskLink,
      showTaskLink = _ref$showTaskLink === void 0 ? false : _ref$showTaskLink,
      task = _ref.task,
      timezone = _ref.timezone,
      showReadOnlyTooltip = _ref.showReadOnlyTooltip,
      readOnlyTooltipProps = _ref.readOnlyTooltipProps;
  useEffect(function () {
    if (createdTaskId && !hasRequestedTask) {
      fetchTask(createdTaskId);
    }
  }, [createdTaskId, fetchTask, hasRequestedTask]);
  var isCompleted = Boolean(task && task.metadata.status === 'COMPLETED');
  var shouldRenderTaskLink = Boolean(createdTaskId && showTaskLink && !isCompleted);
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(StepExecutionTime, {
      completedStep: completedStep,
      timezone: timezone,
      showReadOnlyTooltip: showReadOnlyTooltip,
      readOnlyTooltipProps: readOnlyTooltipProps
    }), shouldRenderTaskLink && /*#__PURE__*/_jsx(UILink, {
      className: "m-left-3",
      external: true,
      href: links.task(createdTaskId),
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.goToTask"
      })
    }), isCompleted && /*#__PURE__*/_jsx("div", {
      className: "m-top-1",
      children: /*#__PURE__*/_jsx(TaskCompletionTime, {
        task: task,
        timezone: timezone
      })
    })]
  });
}

export default connect(function (state, ownProps) {
  return {
    createdTaskId: taskIdFromCompletedStep(state, ownProps),
    hasRequestedTask: hasRequestedTaskForCompletedStep(state, ownProps),
    task: taskForCompletedStep(state, ownProps)
  };
}, {
  fetchTask: TasksActions.fetchTask
})(SequenceStepCompletionTime);