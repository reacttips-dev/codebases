'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map as ImmutableMap, List } from 'immutable';
import { connect } from 'react-redux';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import formatName from 'I18n/utils/formatName';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import ConnectedAccount from 'customer-data-email/schema/connectedAccount/ConnectedAccount';
import { getStepsWithSendTimeErrors as getStepsWithSendTimeErrorsSelector, getUnenrolledContacts as getUnenrolledContactsSelector } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import * as EnrollmentEditorActions from 'sales-modal/redux/actions/EnrollmentEditorActions';
import * as EnrollmentStateActions from 'sales-modal/redux/actions/EnrollmentStateActions';
import { getSelectedContact as getSelectedContactSelector } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { PRIMARY_SEQUENCE_ID } from 'sales-modal/constants/BulkEnrollConstants';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import { stepHasEmailTemplateId } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import getVisibleSteps from 'sales-modal/utils/enrollModal/getVisibleSteps';
import { contactProfile } from 'sales-modal/lib/links';
import { scrollToStep } from 'sales-modal/utils/enrollModal/ScrollUtils';
import { getSendTimesWereChanged } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import { BUSINESS_DAYS } from 'sales-modal/constants/EligibleFollowUpDays';
import { PlatformPropType } from 'sales-modal/constants/Platform';
import { EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import UIFlex from 'UIComponents/layout/UIFlex';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIBox from 'UIComponents/layout/UIBox';
import ContactSidebar from 'sales-modal/components/bulkEnroll/ContactSidebar';
import MissingMergeTags from 'sales-modal/components/enrollModal/MissingMergeTags';
import SendTimeError from 'sales-modal/components/enrollModal/SendTimeError';
import BulkEnrollmentFooter from './BulkEnrollmentFooter';
import SequenceStepEditor from 'sales-modal/components/enrollModal/SequenceStepEditor';
import EnrollmentEditorHeader from 'sales-modal/components/enrollModal/EnrollmentEditorHeader';
import RemoveContactConfirmModal from './RemoveContactConfirmModal';
var BULK_ENROLL_MODAL_CONTAINER_CLASSNAME = 'bulk-enroll-modal-content-container';
var BulkEnrollmentEditor = createReactClass({
  displayName: "BulkEnrollmentEditor",
  mixins: [PureRenderMixin],
  propTypes: {
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
    email: PropTypes.string,
    user: PropTypes.object,
    onConfirm: PropTypes.func,
    onReject: PropTypes.func.isRequired,
    stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap).isRequired,
    platform: PlatformPropType.isRequired,
    decks: PropTypes.instanceOf(ImmutableMap),
    enrollmentSetMergeTags: PropTypes.func.isRequired,
    contact: PropTypes.instanceOf(ContactRecord),
    selectedContact: PropTypes.string,
    isWithinSalesModal: PropTypes.bool.isRequired,
    connectedAccount: PropTypes.instanceOf(ConnectedAccount).isRequired,
    removeContacts: PropTypes.func.isRequired,
    enrollmentFetchSendTimeEligibility: PropTypes.func.isRequired,
    enrollSingleContact: PropTypes.func.isRequired,
    unenrolledContacts: PropTypes.instanceOf(ImmutableMap).isRequired,
    enrollMultipleContacts: PropTypes.func.isRequired,
    fetchSendLimits: PropTypes.func.isRequired,
    properties: PropTypes.instanceOf(ImmutableMap),
    enrollType: EnrollTypePropType.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      showRemoveConfirmModal: false
    };
  },
  componentDidMount: function componentDidMount() {
    UsageTracker.track('pageView', {
      app: this.props.platform
    });
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    var _this$props = this.props,
        sequenceEnrollment = _this$props.sequenceEnrollment,
        selectedContact = _this$props.selectedContact,
        enrollmentFetchSendTimeEligibility = _this$props.enrollmentFetchSendTimeEligibility,
        fetchSendLimits = _this$props.fetchSendLimits;
    var currentStartingStep = sequenceEnrollment.get('startingStepOrder') || 0;
    var previousStartingStep = prevProps.sequenceEnrollment.get('startingStepOrder') || 0;

    if (currentStartingStep !== previousStartingStep) {
      this.scrollTo(currentStartingStep);
    }

    if (selectedContact !== prevProps.selectedContact) {
      if (currentStartingStep === 0) {
        this.steps.scrollTop = 0;
      } else {
        this.scrollTo(currentStartingStep);
      }
    }

    if (selectedContact === prevProps.selectedContact && getSendTimesWereChanged(sequenceEnrollment, prevProps.sequenceEnrollment)) {
      enrollmentFetchSendTimeEligibility();
      fetchSendLimits(sequenceEnrollment);
    }
  },
  getContactName: function getContactName() {
    var contact = this.props.contact;
    return formatName({
      firstName: getProperty(contact, 'firstname'),
      lastName: getProperty(contact, 'lastname'),
      email: getProperty(contact, 'email')
    });
  },
  hasSelectedPrimarySequence: function hasSelectedPrimarySequence() {
    return this.props.selectedContact === PRIMARY_SEQUENCE_ID;
  },
  scrollTo: function scrollTo(stepIndex) {
    var _this = this;

    setTimeout(function () {
      return scrollToStep(stepIndex, _this.steps);
    });
  },
  handleRemoveContact: function handleRemoveContact() {
    var _this$props2 = this.props,
        removeContacts = _this$props2.removeContacts,
        selectedContact = _this$props2.selectedContact,
        enrollmentFetchSendTimeEligibility = _this$props2.enrollmentFetchSendTimeEligibility;
    this.setState({
      showRemoveConfirmModal: false
    });
    removeContacts(List([selectedContact]));
    enrollmentFetchSendTimeEligibility();
    UsageTracker.track('sequencesUsage', {
      action: 'Removed a contact',
      subscreen: 'enroll'
    });
  },
  renderRemoveConfirmModal: function renderRemoveConfirmModal() {
    var _this2 = this;

    return /*#__PURE__*/_jsx(RemoveContactConfirmModal, {
      contactName: this.getContactName(),
      sequenceName: this.props.sequenceEnrollment.get('name'),
      onConfirm: this.handleRemoveContact,
      onReject: function onReject() {
        return _this2.setState({
          showRemoveConfirmModal: false
        });
      }
    });
  },
  renderStepEditors: function renderStepEditors() {
    var _this3 = this;

    var _this$props3 = this.props,
        sequenceEnrollment = _this$props3.sequenceEnrollment,
        contact = _this$props3.contact,
        user = _this$props3.user,
        email = _this$props3.email,
        decks = _this$props3.decks,
        stepsWithSendTimeErrors = _this$props3.stepsWithSendTimeErrors,
        enrollType = _this$props3.enrollType;
    var firstSendType = sequenceEnrollment.firstSendType,
        sequenceSettings = sequenceEnrollment.sequenceSettings,
        startingStepOrder = sequenceEnrollment.startingStepOrder,
        initialTouchDelay = sequenceEnrollment.initialTouchDelay,
        timezone = sequenceEnrollment.timezone;
    var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);
    var visibleSteps = getVisibleSteps(sequenceEnrollment);
    var lastStepIndex = visibleSteps.last().get('stepOrder');
    var firstEmailStepOrder = sequenceEnrollment.get('steps').findIndex(function (step) {
      var isStepEditable = step.get('stepOrder') >= sequenceEnrollment.startingStepOrder;
      return stepHasEmailTemplateId(step) && isStepEditable;
    });
    return visibleSteps.map(function (step) {
      var stepOrder = step.get('stepOrder');
      var isFirstEditableStep = firstEditableStepIndex === stepOrder;
      var isLastStep = stepOrder === lastStepIndex;
      var isSubjectThreaded = sequenceSettings.get('useThreadedFollowUps') && firstEmailStepOrder !== -1 && stepOrder > firstEmailStepOrder;
      var sendOnWeekdays = sequenceSettings.get('eligibleFollowUpDays') === BUSINESS_DAYS;
      return /*#__PURE__*/_jsx(SequenceStepEditor, {
        stepsContainerNodeClassname: BULK_ENROLL_MODAL_CONTAINER_CLASSNAME,
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
        stepsWithSendTimeErrors: _this3.hasSelectedPrimarySequence() ? stepsWithSendTimeErrors : ImmutableMap(),
        isLastStep: isLastStep,
        completedStep: null // No editing or re-enrollment in bulk enroll.
        ,
        timezone: timezone,
        enrollType: enrollType
      }, "editor." + stepOrder);
    });
  },
  renderRemoveButton: function renderRemoveButton() {
    var _this4 = this;

    var unenrolledContacts = this.props.unenrolledContacts;
    return /*#__PURE__*/_jsx(UITooltip, {
      disabled: unenrolledContacts.size > 1,
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.body.lastContact"
      }),
      children: /*#__PURE__*/_jsx(UIButton, {
        use: "link",
        onClick: function onClick() {
          return _this4.setState({
            showRemoveConfirmModal: true
          });
        },
        disabled: unenrolledContacts.size === 1,
        "data-selenium-test": "sequence-bulk-enroll-remove-button",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkEnroll.body.removeContact"
        })
      })
    });
  },
  renderSelectedEnrollmentButtons: function renderSelectedEnrollmentButtons() {
    return /*#__PURE__*/_jsxs(UIFlex, {
      className: "bulk-enroll-modal-selected-enrollment-buttons",
      children: [/*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "bulkEnroll.body.personalizeLink_jsx",
        options: {
          linkProps: {
            external: true,
            href: contactProfile(this.props.contact.get('vid'))
          },
          contactName: this.getContactName()
        },
        elements: {
          Link: UILink
        }
      }), this.renderRemoveButton()]
    });
  },
  renderEditor: function renderEditor() {
    var _this$props4 = this.props,
        stepsWithSendTimeErrors = _this$props4.stepsWithSendTimeErrors,
        sequenceEnrollment = _this$props4.sequenceEnrollment,
        contact = _this$props4.contact,
        user = _this$props4.user,
        enrollmentSetMergeTags = _this$props4.enrollmentSetMergeTags,
        properties = _this$props4.properties;

    if (this.hasSelectedPrimarySequence()) {
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx("div", {
          className: "bulk-enroll-edit-warning",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "bulkEnroll.primarySequence.editWarning"
          })
        }), /*#__PURE__*/_jsx(SendTimeError, {
          onStepLinkClick: this.scrollTo,
          stepsWithSendTimeErrors: stepsWithSendTimeErrors
        }), this.renderStepEditors()]
      });
    }

    return /*#__PURE__*/_jsxs(Fragment, {
      children: [this.renderSelectedEnrollmentButtons(), /*#__PURE__*/_jsx(MissingMergeTags, {
        sequenceEnrollment: sequenceEnrollment,
        contact: contact,
        user: user,
        enrollmentSetMergeTags: enrollmentSetMergeTags,
        properties: properties
      }), this.renderStepEditors()]
    });
  },
  renderEditorHeader: function renderEditorHeader() {
    var _this$props5 = this.props,
        sequenceEnrollment = _this$props5.sequenceEnrollment,
        contact = _this$props5.contact,
        isWithinSalesModal = _this$props5.isWithinSalesModal,
        connectedAccount = _this$props5.connectedAccount;
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(EnrollmentEditorHeader, {
        className: "bulk-enroll-subtitle",
        sequenceEnrollment: sequenceEnrollment,
        connectedAccount: connectedAccount,
        contact: contact,
        isWithinSalesModal: isWithinSalesModal,
        timezone: sequenceEnrollment.timezone
      }), /*#__PURE__*/_jsx("div", {
        className: "bulk-enroll-fixed-subtitle-height"
      })]
    });
  },
  renderBody: function renderBody() {
    var _this5 = this;

    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "stretch",
      className: "modal-body width-100",
      direction: "row",
      children: [/*#__PURE__*/_jsx(UIBox, {
        basis: 400,
        grow: 0,
        shrink: 0,
        children: /*#__PURE__*/_jsx(ContactSidebar, {
          selectedContact: this.props.selectedContact
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: BULK_ENROLL_MODAL_CONTAINER_CLASSNAME,
        ref: function ref(el) {
          return _this5.steps = el;
        },
        children: [this.hasSelectedPrimarySequence() && this.renderEditorHeader(), /*#__PURE__*/_jsx(UIFlex, {
          className: "p-x-5 p-top-4",
          align: "center",
          direction: "column",
          children: this.renderEditor()
        })]
      })]
    });
  },
  renderFooter: function renderFooter() {
    var _this$props6 = this.props,
        onConfirm = _this$props6.onConfirm,
        onReject = _this$props6.onReject,
        enrollSingleContact = _this$props6.enrollSingleContact,
        selectedContact = _this$props6.selectedContact,
        unenrolledContacts = _this$props6.unenrolledContacts,
        enrollMultipleContacts = _this$props6.enrollMultipleContacts,
        sequenceEnrollment = _this$props6.sequenceEnrollment,
        stepsWithSendTimeErrors = _this$props6.stepsWithSendTimeErrors;
    return /*#__PURE__*/_jsx(BulkEnrollmentFooter, {
      onConfirm: onConfirm,
      onReject: onReject,
      enrollSingleContact: enrollSingleContact,
      selectedContact: selectedContact,
      unenrolledContacts: unenrolledContacts,
      enrollMultipleContacts: enrollMultipleContacts,
      sequenceEnrollment: sequenceEnrollment,
      stepsWithSendTimeErrors: stepsWithSendTimeErrors
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "stretch",
      className: "sequence-enrollment-editor sequence-enroll-modal sequence-enroll-full-page",
      "data-selenium-test": "sequence-enrollment-editor",
      direction: "column",
      children: [this.renderBody(), this.renderFooter(), this.state.showRemoveConfirmModal && this.renderRemoveConfirmModal()]
    });
  }
});
export default connect(function (state) {
  return {
    stepsWithSendTimeErrors: getStepsWithSendTimeErrorsSelector(state),
    selectedContact: getSelectedContactSelector(state),
    unenrolledContacts: getUnenrolledContactsSelector(state),
    enrollType: state.enrollType,
    properties: state.properties
  };
}, {
  enrollmentSetMergeTags: EnrollmentEditorActions.enrollmentSetMergeTags,
  removeContacts: EnrollmentStateActions.removeContacts,
  enrollmentFetchSendTimeEligibility: EnrollmentEditorActions.enrollmentFetchSendTimeEligibility,
  fetchSendLimits: EnrollmentEditorActions.fetchSendLimits
})(BulkEnrollmentEditor);