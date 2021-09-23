'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map as ImmutableMap, List } from 'immutable';
import { connect } from 'react-redux';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import * as EnrollmentEditorActions from 'sales-modal/redux/actions/EnrollmentEditorActions';
import { getStepsWithSendTimeErrors as getStepsWithSendTimeErrorsSelector, getOriginalEditedEnrollment as getOriginalEditedeEnrollmentSelector, getIsFirstStepWithCloseToSendLimitWarningToday as getIsFirstStepWithCloseToSendLimitWarningTodaySelector, getSelectedSequenceEnrollmentRecordHasBeenEdited, getRecommendedSendTimes, getSequenceEnrollmentHasErrors, getStepErrorTypes, getSequenceEnrollmentIsUploadingImage } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { stepHasEmailTemplateId } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import isEnrollmentScheduled from 'sales-modal/utils/enrollModal/isEnrollmentScheduled';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import { getSendTimesWereChanged } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import { executionAttemptedOrFinished } from 'sales-modal/utils/stepEnrollmentStates';
import { scrollToStep } from 'sales-modal/utils/enrollModal/ScrollUtils';
import { BUSINESS_DAYS } from 'sales-modal/constants/EligibleFollowUpDays';
import UIFlex from 'UIComponents/layout/UIFlex';
import SequenceStepEditor from 'sales-modal/components/enrollModal/SequenceStepEditor';
import EnrollmentProgress from 'sales-modal/components/enrollModal/EnrollmentProgress';
import Timeline from 'sales-modal/components/enrollModal/Timeline';
import EnrollmentEditorHeader from './EnrollmentEditorHeader';
import EnrollmentEditorFooter from './EnrollmentEditorFooter';
import EnrollmentEditorFooterReadOnlyView from './EnrollmentEditorFooterReadOnlyView';
import MissingMergeTags from './MissingMergeTags';
import SendTimeError from './SendTimeError';
import getVisibleSteps from 'sales-modal/utils/enrollModal/getVisibleSteps';
import { EnrollTypePropType, EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import { PlatformPropType } from 'sales-modal/constants/Platform';
import { EnrollmentStates } from '../../constants/EnrollmentStates';
var ENROLL_MODAL_CONTAINER_CLASSNAME = 'enroll-modal-content-container';
var EnrollmentEditor = createReactClass({
  displayName: "EnrollmentEditor",
  mixins: [PureRenderMixin],
  propTypes: {
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
    decks: PropTypes.instanceOf(ImmutableMap),
    isWithinSalesModal: PropTypes.bool,
    email: PropTypes.string.isRequired,
    contact: PropTypes.instanceOf(ContactRecord),
    user: PropTypes.object,
    onConfirm: PropTypes.func,
    onReject: PropTypes.func.isRequired,
    goBackToSequences: PropTypes.func,
    enrollmentSetMergeTags: PropTypes.func.isRequired,
    stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap).isRequired,
    platform: PlatformPropType.isRequired,
    enrollmentFetchSendTimeEligibility: PropTypes.func.isRequired,
    fetchSendLimits: PropTypes.func.isRequired,
    originalEnrollment: PropTypes.instanceOf(ImmutableMap),
    isFirstStepWithCloseToSendLimitWarningToday: PropTypes.bool.isRequired,
    hasMadeChanges: PropTypes.bool,
    recommendedSendTimes: PropTypes.instanceOf(List),
    enrollType: EnrollTypePropType,
    properties: PropTypes.instanceOf(ImmutableMap),
    sequenceEnrollmentHasErrors: PropTypes.bool.isRequired,
    erroringSteps: PropTypes.instanceOf(ImmutableMap),
    isUploadingImage: PropTypes.bool.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      hasMadeChanges: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      enrollmentProgress: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        sequenceEnrollment = _this$props.sequenceEnrollment,
        platform = _this$props.platform;
    var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);

    if (firstEditableStepIndex !== 0) {
      this.scrollTo(firstEditableStepIndex);
    }

    UsageTracker.track('pageView', {
      app: platform
    });
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    var _this$props2 = this.props,
        sequenceEnrollment = _this$props2.sequenceEnrollment,
        enrollmentFetchSendTimeEligibility = _this$props2.enrollmentFetchSendTimeEligibility,
        fetchSendLimits = _this$props2.fetchSendLimits,
        enrollType = _this$props2.enrollType;
    var enrollmentProgress = this.state.enrollmentProgress;

    if (enrollmentProgress == null) {
      var currentStartingStep = sequenceEnrollment.get('startingStepOrder');
      var previousStartingStep = prevProps.sequenceEnrollment.get('startingStepOrder');

      if (currentStartingStep !== previousStartingStep) {
        this.scrollTo(currentStartingStep);
      }
    }

    if (getSendTimesWereChanged(sequenceEnrollment, prevProps.sequenceEnrollment) && sequenceEnrollment.get('enrollmentState') !== EnrollmentStates.PAUSED && enrollType !== EnrollTypes.VIEW) {
      enrollmentFetchSendTimeEligibility();
      fetchSendLimits(sequenceEnrollment);
    }
  },
  scrollTo: function scrollTo(stepIndex) {
    var _this = this;

    setTimeout(function () {
      return scrollToStep(stepIndex, _this.steps);
    });
  },
  renderStepEditors: function renderStepEditors() {
    var _this$props3 = this.props,
        contact = _this$props3.contact,
        decks = _this$props3.decks,
        email = _this$props3.email,
        sequenceEnrollment = _this$props3.sequenceEnrollment,
        stepsWithSendTimeErrors = _this$props3.stepsWithSendTimeErrors,
        user = _this$props3.user,
        enrollType = _this$props3.enrollType;
    var firstSendType = sequenceEnrollment.firstSendType,
        startingStepOrder = sequenceEnrollment.startingStepOrder,
        initialTouchDelay = sequenceEnrollment.initialTouchDelay,
        timezone = sequenceEnrollment.timezone,
        stepEnrollments = sequenceEnrollment.stepEnrollments,
        sequenceSettings = sequenceEnrollment.sequenceSettings;
    var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);
    var steps = getVisibleSteps(this.props.sequenceEnrollment);
    var lastStepIndex = steps.last().get('stepOrder');
    var firstEmailStepOrder = sequenceEnrollment.get('steps').findIndex(function (step) {
      var stepIsNotSkipped = step.get('stepOrder') >= sequenceEnrollment.startingStepOrder;
      return stepHasEmailTemplateId(step) && stepIsNotSkipped;
    });
    var completedStepsMap = stepEnrollments ? ImmutableMap(stepEnrollments.filter(executionAttemptedOrFinished).map(function (step) {
      return [step.get('stepOrder'), step];
    })) : ImmutableMap();
    return steps.map(function (step) {
      var stepOrder = step.get('stepOrder');
      var isSubjectThreaded = sequenceSettings.get('useThreadedFollowUps') && firstEmailStepOrder !== -1 && stepOrder > firstEmailStepOrder;
      var isFirstEditableStep = firstEditableStepIndex === stepOrder;
      var isLastStep = stepOrder === lastStepIndex;
      var sendOnWeekdays = sequenceSettings.get('eligibleFollowUpDays') === BUSINESS_DAYS;
      return /*#__PURE__*/_jsx(SequenceStepEditor, {
        stepsContainerNodeClassname: ENROLL_MODAL_CONTAINER_CLASSNAME,
        step: step,
        startingStepOrder: startingStepOrder,
        initialTouchDelay: initialTouchDelay,
        stepIndex: stepOrder,
        contact: contact,
        user: user,
        email: email,
        firstSendType: firstSendType,
        isFirstEditableStep: isFirstEditableStep,
        isSubjectThreaded: isSubjectThreaded,
        sendOnWeekdays: sendOnWeekdays,
        decks: decks,
        stepsWithSendTimeErrors: stepsWithSendTimeErrors,
        isLastStep: isLastStep,
        completedStep: completedStepsMap.get(step.get('stepOrder')),
        timezone: timezone,
        enrollType: enrollType
      }, "editor." + stepOrder);
    });
  },
  renderHeader: function renderHeader() {
    var _this$props4 = this.props,
        sequenceEnrollment = _this$props4.sequenceEnrollment,
        isWithinSalesModal = _this$props4.isWithinSalesModal,
        goBackToSequences = _this$props4.goBackToSequences,
        contact = _this$props4.contact;
    return /*#__PURE__*/_jsx(EnrollmentEditorHeader, {
      goBackToSequences: goBackToSequences,
      sequenceEnrollment: sequenceEnrollment,
      contact: contact,
      isWithinSalesModal: isWithinSalesModal,
      timezone: sequenceEnrollment.timezone
    });
  },
  renderBody: function renderBody() {
    var _this2 = this;

    var _this$props5 = this.props,
        sequenceEnrollment = _this$props5.sequenceEnrollment,
        contact = _this$props5.contact,
        user = _this$props5.user,
        enrollmentSetMergeTags = _this$props5.enrollmentSetMergeTags,
        stepsWithSendTimeErrors = _this$props5.stepsWithSendTimeErrors,
        properties = _this$props5.properties,
        erroringSteps = _this$props5.erroringSteps;
    var firstSendType = sequenceEnrollment.firstSendType;
    return /*#__PURE__*/_jsxs(UIFlex, {
      className: "modal-body",
      children: [/*#__PURE__*/_jsx(Timeline, {
        sequenceEnrollment: sequenceEnrollment,
        erroringSteps: erroringSteps,
        onStepSelect: this.scrollTo,
        firstSendType: firstSendType
      }), /*#__PURE__*/_jsxs("div", {
        className: ENROLL_MODAL_CONTAINER_CLASSNAME,
        ref: function ref(el) {
          return _this2.steps = el;
        },
        children: [/*#__PURE__*/_jsx(MissingMergeTags, {
          sequenceEnrollment: sequenceEnrollment,
          contact: contact,
          user: user,
          enrollmentSetMergeTags: enrollmentSetMergeTags,
          properties: properties
        }), /*#__PURE__*/_jsx(SendTimeError, {
          onStepLinkClick: this.scrollTo,
          stepsWithSendTimeErrors: stepsWithSendTimeErrors
        }), this.renderStepEditors()]
      })]
    });
  },
  renderFooter: function renderFooter() {
    var _this3 = this;

    var _this$props6 = this.props,
        email = _this$props6.email,
        sequenceEnrollment = _this$props6.sequenceEnrollment,
        enrollType = _this$props6.enrollType,
        onConfirm = _this$props6.onConfirm,
        onReject = _this$props6.onReject,
        stepsWithSendTimeErrors = _this$props6.stepsWithSendTimeErrors,
        originalEnrollment = _this$props6.originalEnrollment,
        isFirstStepWithCloseToSendLimitWarningToday = _this$props6.isFirstStepWithCloseToSendLimitWarningToday,
        hasMadeChanges = _this$props6.hasMadeChanges,
        recommendedSendTimes = _this$props6.recommendedSendTimes,
        sequenceEnrollmentHasErrors = _this$props6.sequenceEnrollmentHasErrors,
        erroringSteps = _this$props6.erroringSteps,
        isUploadingImage = _this$props6.isUploadingImage;

    if (enrollType === EnrollTypes.VIEW) {
      return /*#__PURE__*/_jsx(EnrollmentEditorFooterReadOnlyView, {
        email: email,
        onReject: onReject
      });
    }

    return /*#__PURE__*/_jsx(EnrollmentEditorFooter, {
      sequenceEnrollment: sequenceEnrollment,
      email: email,
      enrollType: enrollType,
      onConfirm: onConfirm,
      onReject: onReject,
      setEnrollmentProgress: function setEnrollmentProgress(status) {
        return _this3.setState({
          enrollmentProgress: status
        });
      },
      stepsWithSendTimeErrors: stepsWithSendTimeErrors,
      originalEnrollment: originalEnrollment,
      isFirstStepWithCloseToSendLimitWarningToday: isFirstStepWithCloseToSendLimitWarningToday,
      hasMadeChanges: hasMadeChanges,
      recommendedSendTimes: recommendedSendTimes,
      sequenceEnrollmentHasErrors: sequenceEnrollmentHasErrors,
      erroringSteps: erroringSteps,
      isUploadingImage: isUploadingImage
    });
  },
  render: function render() {
    var _this$props7 = this.props,
        sequenceEnrollment = _this$props7.sequenceEnrollment,
        onReject = _this$props7.onReject;
    var enrollmentProgress = this.state.enrollmentProgress;

    if (enrollmentProgress !== null && enrollmentProgress !== 'pending') {
      return /*#__PURE__*/_jsx(EnrollmentProgress, {
        progress: enrollmentProgress,
        sequenceEnrollment: sequenceEnrollment,
        scheduled: isEnrollmentScheduled(sequenceEnrollment),
        onCloseModal: onReject
      });
    }

    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "stretch",
      className: "sequence-enrollment-editor sequence-enroll-modal",
      "data-selenium-test": "sequence-enrollment-editor",
      direction: "column",
      children: [this.renderHeader(), this.renderBody(), this.renderFooter()]
    });
  }
});
export default connect(function (state) {
  return {
    enrollType: state.enrollType,
    stepsWithSendTimeErrors: getStepsWithSendTimeErrorsSelector(state),
    originalEnrollment: getOriginalEditedeEnrollmentSelector(state),
    isFirstStepWithCloseToSendLimitWarningToday: getIsFirstStepWithCloseToSendLimitWarningTodaySelector(state),
    hasMadeChanges: getSelectedSequenceEnrollmentRecordHasBeenEdited(state),
    recommendedSendTimes: getRecommendedSendTimes(state),
    properties: state.properties,
    sequenceEnrollmentHasErrors: getSequenceEnrollmentHasErrors(state),
    erroringSteps: getStepErrorTypes(state),
    isUploadingImage: getSequenceEnrollmentIsUploadingImage(state)
  };
}, {
  enrollmentSetMergeTags: EnrollmentEditorActions.enrollmentSetMergeTags,
  enrollmentFetchSendTimeEligibility: EnrollmentEditorActions.enrollmentFetchSendTimeEligibility,
  fetchSendLimits: EnrollmentEditorActions.fetchSendLimits
})(EnrollmentEditor);