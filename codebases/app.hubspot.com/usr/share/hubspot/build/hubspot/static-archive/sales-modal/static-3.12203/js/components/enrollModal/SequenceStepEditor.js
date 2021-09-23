'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import Big from 'UIComponents/elements/Big';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { stepHasEmailTemplateId, getStepEmailTemplateBody } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
import { SCHEDULE_TASK } from 'sales-modal/constants/SequenceStepTypes';
import AsyncLoadSequenceStepEditor from './AsyncLoadSequenceStepEditor';
import EmailTemplateStepEditor from './EmailTemplateStepEditor';
import TaskStepEditor from './TaskStepEditor';
import SequenceStepCard from './SequenceStepCard';
import SequenceStepTemplateError from './SequenceStepTemplateError';
import SequenceStepCompletionTime from './timeSelection/SequenceStepCompletionTime';
import SequenceStepSkippedMessage from './timeSelection/SequenceStepSkippedMessage';
import SequenceStepTimeSelection from './timeSelection/SequenceStepTimeSelection';
import HR from 'UIComponents/elements/HR';
import StepEditorDetailsSection from './StepEditorDetailsSection';
import { EnrollTypePropType, EnrollTypes } from '../../constants/EnrollTypes';
var SequenceStepEditor = createReactClass({
  displayName: "SequenceStepEditor",
  propTypes: {
    completedStep: PropTypes.instanceOf(ImmutableMap),
    step: PropTypes.instanceOf(ImmutableMap).isRequired,
    isReadyToLoad: PropTypes.bool.isRequired,
    initialTouchDelay: PropTypes.number,
    startingStepOrder: PropTypes.number.isRequired,
    stepIndex: PropTypes.number.isRequired,
    contact: PropTypes.instanceOf(ContactRecord),
    user: PropTypes.object,
    email: PropTypes.string,
    firstSendType: PropTypes.string.isRequired,
    isSubjectThreaded: PropTypes.bool.isRequired,
    isFirstEditableStep: PropTypes.bool.isRequired,
    sendOnWeekdays: PropTypes.bool.isRequired,
    decks: PropTypes.instanceOf(ImmutableMap),
    stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap),
    isLastStep: PropTypes.bool.isRequired,
    timezone: PropTypes.string.isRequired,
    enrollType: EnrollTypePropType.isRequired
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return this.props.step !== nextProps.step || this.props.startingStepOrder !== nextProps.startingStepOrder || this.props.initialTouchDelay !== nextProps.initialTouchDelay || this.props.isSubjectThreaded !== nextProps.isSubjectThreaded || this.props.isFirstEditableStep !== nextProps.isFirstEditableStep || this.props.sendOnWeekdays !== nextProps.sendOnWeekdays || this.props.contact !== nextProps.contact || this.props.firstSendType !== nextProps.firstSendType || this.props.isReadyToLoad !== nextProps.isReadyToLoad || this.props.stepsWithSendTimeErrors !== nextProps.stepsWithSendTimeErrors || this.props.timezone !== nextProps.timezone || this.props.enrollType !== nextProps.enrollType;
  },
  isSkipped: function isSkipped() {
    return this.props.startingStepOrder > this.props.step.get('stepOrder');
  },
  isCompleted: function isCompleted() {
    return Boolean(this.props.completedStep);
  },
  isReadOnly: function isReadOnly() {
    return this.props.enrollType === EnrollTypes.VIEW || this.isSkipped() || this.isCompleted();
  },
  renderStepTimeSelection: function renderStepTimeSelection() {
    var _this$props = this.props,
        completedStep = _this$props.completedStep,
        step = _this$props.step,
        startingStepOrder = _this$props.startingStepOrder,
        isFirstEditableStep = _this$props.isFirstEditableStep,
        sendOnWeekdays = _this$props.sendOnWeekdays,
        stepIndex = _this$props.stepIndex,
        firstSendType = _this$props.firstSendType,
        stepsWithSendTimeErrors = _this$props.stepsWithSendTimeErrors,
        timezone = _this$props.timezone;

    if (completedStep) {
      return /*#__PURE__*/_jsx(Big, {
        children: /*#__PURE__*/_jsx(SequenceStepCompletionTime, {
          completedStep: completedStep,
          showTaskLink: true,
          timezone: timezone
        })
      });
    }

    if (this.isSkipped()) {
      return /*#__PURE__*/_jsx(SequenceStepSkippedMessage, {});
    }

    return /*#__PURE__*/_jsx(SequenceStepTimeSelection, {
      firstSendType: firstSendType,
      isFirstEditableStep: isFirstEditableStep,
      sendOnWeekdays: sendOnWeekdays,
      startingStepOrder: startingStepOrder,
      step: step,
      stepIndex: stepIndex,
      stepsWithSendTimeErrors: stepsWithSendTimeErrors,
      stepType: step.get('action')
    });
  },
  renderStepEditor: function renderStepEditor() {
    var _this$props2 = this.props,
        step = _this$props2.step,
        isSubjectThreaded = _this$props2.isSubjectThreaded,
        decks = _this$props2.decks,
        contact = _this$props2.contact,
        user = _this$props2.user,
        email = _this$props2.email,
        isLastStep = _this$props2.isLastStep;
    var isTaskStep = step.get('action') === SCHEDULE_TASK;
    return /*#__PURE__*/_jsxs(StepEditorDetailsSection, {
      isDisabled: this.isSkipped() || this.isCompleted(),
      children: [isTaskStep && /*#__PURE__*/_jsx(TaskStepEditor, {
        step: step,
        decks: decks,
        email: email,
        isLastStep: isLastStep,
        readOnly: this.isReadOnly()
      }), isTaskStep && stepHasEmailTemplateId(step) && /*#__PURE__*/_jsx(HR, {
        distance: "small"
      }), stepHasEmailTemplateId(step) && /*#__PURE__*/_jsx(EmailTemplateStepEditor, {
        step: step,
        isSubjectThreaded: isSubjectThreaded,
        decks: decks,
        contact: contact,
        user: user,
        email: email,
        readOnly: this.isReadOnly()
      })]
    });
  },
  render: function render() {
    var _this = this;

    var _this$props3 = this.props,
        isReadyToLoad = _this$props3.isReadyToLoad,
        step = _this$props3.step;

    if (stepHasEmailTemplateId(step) && !getStepEmailTemplateBody(step)) {
      return /*#__PURE__*/_jsx(SequenceStepTemplateError, {});
    }

    return /*#__PURE__*/_jsx("div", {
      className: "step-editor-container m-bottom-6",
      "data-step-order": step.get('stepOrder'),
      ref: function ref(c) {
        return _this.step = c;
      },
      children: /*#__PURE__*/_jsxs(SequenceStepCard, {
        isReadyToLoad: isReadyToLoad,
        step: step,
        children: [this.renderStepTimeSelection(), /*#__PURE__*/_jsx(HR, {
          distance: "small"
        }), this.renderStepEditor()]
      })
    });
  }
});
export default AsyncLoadSequenceStepEditor(SequenceStepEditor);