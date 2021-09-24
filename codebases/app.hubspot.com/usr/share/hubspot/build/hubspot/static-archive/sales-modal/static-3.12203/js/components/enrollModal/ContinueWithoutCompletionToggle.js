'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import partial from 'transmute/partial';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as SequenceStepDependencyTypes from 'sales-modal/constants/SequenceStepDependencyTypes';
import { getIsPrimarySequence, getSelectedEnrollmentDependencies } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import * as EnrollmentEditorActions from 'sales-modal/redux/actions/EnrollmentEditorActions';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UICheckbox from 'UIComponents/input/UICheckbox';
import { EnrollTypes, EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';

var ContinueWithoutCompletionToggle = function ContinueWithoutCompletionToggle(_ref) {
  var dependencies = _ref.dependencies,
      enrollmentToggleStepDependency = _ref.enrollmentToggleStepDependency,
      enrollType = _ref.enrollType,
      isLastStep = _ref.isLastStep,
      isPrimarySequence = _ref.isPrimarySequence,
      readOnly = _ref.readOnly,
      step = _ref.step;
  var reliesOnStepOrder = step.get('stepOrder');
  var requiredByStepOrder = reliesOnStepOrder + 1;
  var checked = !dependencies.has(reliesOnStepOrder);
  var readOnlyInBulkEnroll = enrollType === EnrollTypes.BULK_ENROLL && !isPrimarySequence;
  var isCheckboxReadOnly = readOnly || readOnlyInBulkEnroll;
  return /*#__PURE__*/_jsxs(UICheckbox, {
    size: "small",
    checked: checked,
    readOnly: isCheckboxReadOnly,
    onChange: partial(enrollmentToggleStepDependency, {
      requiredByStepOrder: requiredByStepOrder,
      reliesOnStepOrder: reliesOnStepOrder,
      dependencyType: SequenceStepDependencyTypes.TASK_COMPLETION
    }),
    children: [/*#__PURE__*/_jsx(UITooltip, {
      disabled: !readOnlyInBulkEnroll,
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sendTimes.bulkEnrollDisabled.pausingStepToggle.schedule_task"
      }),
      maxWidth: 280,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: isLastStep ? 'enrollModal.taskStepDetails.continueWithoutCompletion.lastStepLabel' : 'enrollModal.taskStepDetails.continueWithoutCompletion.label'
      })
    }), /*#__PURE__*/_jsx(UIHelpIcon, {
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: isLastStep ? 'enrollModal.taskStepDetails.continueWithoutCompletion.lastStepTooltip' : 'enrollModal.taskStepDetails.continueWithoutCompletion.tooltip'
      }),
      tooltipPlacement: "bottom left",
      className: "m-left-1"
    })]
  });
};

ContinueWithoutCompletionToggle.propTypes = {
  dependencies: PropTypes.instanceOf(ImmutableMap).isRequired,
  enrollmentToggleStepDependency: PropTypes.func.isRequired,
  enrollType: EnrollTypePropType.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  isPrimarySequence: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  step: PropTypes.instanceOf(ImmutableMap).isRequired
};
export default connect(function (state) {
  return {
    dependencies: getSelectedEnrollmentDependencies(state),
    enrollType: state.enrollType,
    isPrimarySequence: getIsPrimarySequence(state)
  };
}, {
  enrollmentToggleStepDependency: EnrollmentEditorActions.enrollmentToggleStepDependency
})(ContinueWithoutCompletionToggle);