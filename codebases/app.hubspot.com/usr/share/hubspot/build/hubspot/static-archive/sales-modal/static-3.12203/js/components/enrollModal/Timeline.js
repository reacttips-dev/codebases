'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import UIStepIndicator from 'UIComponents/connectedStep/UIStepIndicator';
import Small from 'UIComponents/elements/Small';
import { ALERT_DANGER, OLAF, SORBET, KOALA, SLINKY, BATTLESHIP } from 'HubStyleTokens/colors';
import { SCHEDULE_TASK, SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import * as TaskTypes from 'customer-data-objects/engagement/TaskTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconCircle from 'UIComponents/icon/UIIconCircle';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import StepDateTime from './timeline/StepDateTime';
import StepDateTimeReadOnlyView from './timeline/StepDateTimeReadOnlyView';
import { isAttemptedOrFinishedStep } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import getVisibleSteps from 'sales-modal/utils/enrollModal/getVisibleSteps';
import getFirstPausingStepIndex from 'sales-modal/utils/enrollModal/getFirstPausingStepIndex';
import { getSelectedEnrollmentDependencies } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { HAS_SEND_LIMIT_ERRORS, HAS_MISSING_MERGE_TAGS, HAS_PRIVATE_TEMPLATE, HAS_NO_TIME_SLOTS } from 'sales-modal/constants/StepErrorTypes';
import { EnrollTypes, EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';
import { EnrollmentStates } from 'sales-modal/constants/EnrollmentStates';
var Timeline = createReactClass({
  displayName: "Timeline",
  propTypes: {
    dependencies: PropTypes.instanceOf(ImmutableMap).isRequired,
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
    enrollType: EnrollTypePropType.isRequired,
    erroringSteps: PropTypes.instanceOf(ImmutableMap).isRequired,
    firstSendType: PropTypes.string.isRequired,
    onStepSelect: PropTypes.func.isRequired
  },
  getStepTypeLabel: function getStepTypeLabel(step) {
    var stepOrder = step.get('stepOrder');
    var action = step.get('action');

    if (action === SEND_TEMPLATE) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sequenceTimeline.stepName.autoEmail",
        options: {
          stepOrder: stepOrder + 1
        }
      });
    } else if (action === SCHEDULE_TASK) {
      var taskType = step.getIn(['actionMeta', 'taskMeta', 'taskType']) || TaskTypes.TODO;
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sequenceTimeline.stepName." + taskType,
        options: {
          stepOrder: stepOrder + 1
        }
      });
    }

    return null;
  },
  getStepNames: function getStepNames() {
    var _this = this;

    var _this$props = this.props,
        sequenceEnrollment = _this$props.sequenceEnrollment,
        dependencies = _this$props.dependencies,
        enrollType = _this$props.enrollType,
        firstSendType = _this$props.firstSendType;
    var stepEnrollments = sequenceEnrollment.stepEnrollments;
    var enrollmentPaused = sequenceEnrollment.get('enrollmentState') === EnrollmentStates.PAUSED && enrollType !== EnrollTypes.RESUME;
    var firstPausingStepIndex;

    if (!enrollmentPaused) {
      firstPausingStepIndex = getFirstPausingStepIndex(dependencies, stepEnrollments, sequenceEnrollment.get('startingStepOrder'));
    }

    var DateTimeComponent = enrollType === EnrollTypes.VIEW ? StepDateTimeReadOnlyView : StepDateTime;
    return getVisibleSteps(sequenceEnrollment).map(function (step, index) {
      return /*#__PURE__*/_jsxs(UIFlex, {
        direction: "column",
        children: [/*#__PURE__*/_jsxs(UIFlex, {
          children: [/*#__PURE__*/_jsx("span", {
            className: "step-name",
            children: _this.getStepTypeLabel(step)
          }), _this.getErrorForStep(index)]
        }), /*#__PURE__*/_jsx(Small, {
          use: "help",
          children: /*#__PURE__*/_jsx(DateTimeComponent, {
            sequenceEnrollment: sequenceEnrollment,
            stepIndex: index,
            enrollmentPaused: enrollmentPaused,
            firstPausingStepIndex: firstPausingStepIndex,
            firstSendType: firstSendType
          })
        })]
      }, index);
    }).toArray();
  },
  getErrorForStep: function getErrorForStep(index) {
    var erroringSteps = this.props.erroringSteps;
    var stepErrors = erroringSteps.get(index);

    if (!stepErrors) {
      return null;
    }

    var tooltipKey = 'other';

    if (stepErrors.has(HAS_PRIVATE_TEMPLATE)) {
      tooltipKey = 'privateTemplate';
    } else if (stepErrors.size > 1) {
      tooltipKey = 'other';
    } else if (stepErrors.has(HAS_MISSING_MERGE_TAGS)) {
      tooltipKey = 'mergeTags';
    } else if (stepErrors.has(HAS_SEND_LIMIT_ERRORS) || stepErrors.has(HAS_NO_TIME_SLOTS)) {
      tooltipKey = 'sendLimit';
    }

    return /*#__PURE__*/_jsx(UITooltip, {
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sequenceTimeline.errorWithEmail." + tooltipKey
      }),
      placement: "bottom right",
      children: /*#__PURE__*/_jsx(UIIcon, {
        className: "p-left-1",
        color: ALERT_DANGER,
        name: "warning",
        size: "xxs"
      })
    });
  },
  getIconForStep: function getIconForStep(_ref) {
    var index = _ref.index,
        stepIndex = _ref.stepIndex;
    var sequenceEnrollment = this.props.sequenceEnrollment;
    var stepEnrollments = sequenceEnrollment.stepEnrollments;
    var selectedStep = index === stepIndex;
    var startingStepOrder = sequenceEnrollment.get('startingStepOrder');
    var isSkipped = index < startingStepOrder;
    var isCompleted = stepEnrollments ? Boolean(isAttemptedOrFinishedStep(index, stepEnrollments)) : false;
    var skippedOrCompleteStep = isSkipped || isCompleted;
    var borderColor = BATTLESHIP;

    if (selectedStep) {
      borderColor = skippedOrCompleteStep ? SLINKY : SORBET;
    }

    var backgroundColor = skippedOrCompleteStep ? KOALA : OLAF;
    return /*#__PURE__*/_jsx(UIIconCircle, {
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      color: borderColor,
      name: isCompleted ? 'success' : 'blank',
      legacy: true,
      size: 10
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx("div", {
      className: "timeline",
      children: /*#__PURE__*/_jsx(UIStepIndicator, {
        direction: "vertical",
        stepNames: this.getStepNames(),
        onStepClick: this.props.onStepSelect,
        StepIconComponent: this.getIconForStep
      })
    });
  }
});
export default connect(function (state) {
  return {
    dependencies: getSelectedEnrollmentDependencies(state),
    enrollType: state.enrollType
  };
})(Timeline);