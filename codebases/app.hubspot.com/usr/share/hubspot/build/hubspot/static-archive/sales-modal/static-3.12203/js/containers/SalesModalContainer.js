'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import Checker from 'sales-modal/lib/Checker';
import * as ModalActions from 'sales-modal/redux/actions/ModalActions';
import * as ContentActions from 'sales-modal/redux/actions/ContentActions';
import * as EnrollHealthStatusActions from 'sales-modal/redux/actions/EnrollHealthStatusActions';
import { shouldDisableEnrollments } from 'sales-modal/redux/selectors/EnrollHealthStatusSelectors';
import { hasSequencesAccess as hasSequencesAccessSelector, canUseEnrollments as canUseEnrollmentsSelector, hasHigherTemplatesLimit as hasHigherTemplatesLimitSelector, hasHigherDocumentsLimit as hasHigherDocumentsLimitSelector } from 'sales-modal/redux/selectors/permissionSelectors';
import FireAlarm from '../FireAlarm';
import getFireAlarmAppName from '../utils/getFireAlarmAppName';
import * as SalesModalTabs from 'sales-modal/constants/SalesModalTabs';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
import SequenceEnrollmentContainer from 'sales-modal/containers/SequenceEnrollmentContainer';
import UsageLimitBanner from 'sales-modal/components/salesModal/UsageLimitBanner';
import SalesModalContent from 'sales-modal/components/salesModal/SalesModalContent';
import SalesModalFooter from 'sales-modal/components/salesModal/SalesModalFooter';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import SalesModalAlertsStore from 'sales-modal/utils/SalesModalAlertsStore'; // Static height when hosted within UIModalDialog

var SALES_MODAL_FIXED_HEIGHT = 632;
var SalesModal = createReactClass({
  displayName: "SalesModal",
  propTypes: {
    currentTab: PropTypes.oneOf(Object.values(SalesModalTabs || {})).isRequired,
    contentPayload: PropTypes.instanceOf(ImmutableMap).isRequired,
    docSkipForm: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    portal: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired,
    selectSequence: PropTypes.func,
    fetchContact: PropTypes.func.isRequired,
    fetchCount: PropTypes.func.isRequired,
    resetModal: PropTypes.func.isRequired,
    selectItem: PropTypes.func.isRequired,
    toggleSkipForm: PropTypes.func.isRequired,
    recipient: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    enrollSequence: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    fixedHeight: PropTypes.bool,
    disableEnrollments: PropTypes.bool.isRequired,
    hasSequencesAccess: PropTypes.bool.isRequired,
    canUseEnrollments: PropTypes.bool.isRequired,
    hasHigherTemplatesLimit: PropTypes.bool,
    hasHigherDocumentsLimit: PropTypes.bool,
    fetchEnrollHealthStatus: PropTypes.func.isRequired,
    contacts: PropTypes.instanceOf(ImmutableMap)
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        currentTab = _this$props.currentTab,
        fetchContact = _this$props.fetchContact,
        fetchCount = _this$props.fetchCount,
        recipient = _this$props.recipient,
        fetchEnrollHealthStatus = _this$props.fetchEnrollHealthStatus,
        hasSequencesAccess = _this$props.hasSequencesAccess;

    if (hasSequencesAccess) {
      fetchEnrollHealthStatus();
    }

    fetchContact(recipient);
    fetchCount(currentTab);
    this.initializeTabListener();
    this.removeSkeleton();
  },
  initializeTabListener: function initializeTabListener() {
    window.addEventListener('message', this.switchTabListener);
  },
  switchTabListener: function switchTabListener(event) {
    if (event && event.data && event.data.sender === 'SIDEKICK_CLIENT' && event.data.type === 'SIDEKICK_EMAIL_MODAL:META_BROADCAST') {
      this.props.resetModal({
        currentTab: event.data.content.currentTab
      });
    }
  },
  removeSkeleton: function removeSkeleton() {
    var skeleton = document.querySelector('.app-skeleton');

    if (skeleton && skeleton.parentNode) {
      skeleton.parentNode.removeChild(skeleton);
    }
  },
  showUsageLimitBanner: function showUsageLimitBanner() {
    var _this$props2 = this.props,
        currentTab = _this$props2.currentTab,
        content = _this$props2.content,
        hasHigherTemplatesLimit = _this$props2.hasHigherTemplatesLimit,
        hasHigherDocumentsLimit = _this$props2.hasHigherDocumentsLimit;
    var isTemplates = currentTab === SalesModalTabs.TEMPLATES;
    var isDocuments = currentTab === SalesModalTabs.DOCUMENTS;
    var hasContent = content.count > 0;
    var showBannerForTemplates = hasContent && isTemplates && !hasHigherTemplatesLimit;
    var showBannerForDocuments = hasContent && isDocuments && !hasHigherDocumentsLimit;
    return showBannerForTemplates || showBannerForDocuments;
  },
  renderUsageLimitBanner: function renderUsageLimitBanner(showBanner) {
    var _this$props3 = this.props,
        currentTab = _this$props3.currentTab,
        content = _this$props3.content;

    if (showBanner) {
      return /*#__PURE__*/_jsx("div", {
        className: "m-bottom-7",
        children: /*#__PURE__*/_jsx(UsageLimitBanner, {
          currentTab: currentTab,
          sizeOfContent: content.count
        })
      });
    }

    return null;
  },
  renderFooter: function renderFooter() {
    var _this$props4 = this.props,
        currentTab = _this$props4.currentTab,
        contentPayload = _this$props4.contentPayload,
        docSkipForm = _this$props4.docSkipForm,
        toggleSkipForm = _this$props4.toggleSkipForm;

    if (currentTab !== SalesModalTabs.DOCUMENTS) {
      return null;
    }

    return /*#__PURE__*/_jsx(SalesModalFooter, {
      currentTab: currentTab,
      contentPayload: contentPayload,
      docSkipForm: docSkipForm,
      onChangeDocSkipForm: toggleSkipForm
    });
  },
  renderContent: function renderContent() {
    var _this$props5 = this.props,
        currentTab = _this$props5.currentTab,
        user = _this$props5.user,
        selectSequence = _this$props5.selectSequence,
        selectItem = _this$props5.selectItem,
        fixedHeight = _this$props5.fixedHeight,
        disableEnrollments = _this$props5.disableEnrollments,
        hasSequencesAccess = _this$props5.hasSequencesAccess,
        canUseEnrollments = _this$props5.canUseEnrollments,
        closeModal = _this$props5.closeModal;
    var showBanner = this.showUsageLimitBanner();
    var heightStyle = fixedHeight ? {
      height: SALES_MODAL_FIXED_HEIGHT
    } : null;
    return /*#__PURE__*/_jsxs("div", {
      className: "sales-modal",
      style: heightStyle,
      children: [/*#__PURE__*/_jsx(FireAlarm, {
        appName: getFireAlarmAppName(currentTab)
      }, "fire-alarm-in-sales-modal-content"), this.renderUsageLimitBanner(showBanner), /*#__PURE__*/_jsx(SalesModalContent, {
        currentTab: currentTab,
        showBanner: showBanner,
        doInsertItem: selectSequence || selectItem,
        teams: user.get('teams'),
        disableEnrollments: disableEnrollments,
        hasSequencesAccess: hasSequencesAccess,
        canUseEnrollments: canUseEnrollments,
        onReject: closeModal
      }), this.renderFooter()]
    });
  },
  renderSequenceEnrollModal: function renderSequenceEnrollModal() {
    var _this$props6 = this.props,
        user = _this$props6.user,
        portal = _this$props6.portal,
        contentPayload = _this$props6.contentPayload,
        currentTab = _this$props6.currentTab,
        resetModal = _this$props6.resetModal,
        closeModal = _this$props6.closeModal,
        enrollSequence = _this$props6.enrollSequence,
        fixedHeight = _this$props6.fixedHeight,
        contacts = _this$props6.contacts;
    var sequenceId = contentPayload.get('contentId');
    var email = contentPayload.get('email');
    var heightStyle = fixedHeight ? {
      height: SALES_MODAL_FIXED_HEIGHT
    } : null;
    return /*#__PURE__*/_jsxs("div", {
      className: "sales-modal sales-modal-enroll",
      style: heightStyle,
      children: [/*#__PURE__*/_jsx(FireAlarm, {
        appName: getFireAlarmAppName(currentTab)
      }, "fire-alarm-in-sequence-enroll-modal"), /*#__PURE__*/_jsx(UIFloatingAlertList, {
        alertStore: SalesModalAlertsStore,
        use: "contextual"
      }), /*#__PURE__*/_jsx(SequenceEnrollmentContainer, {
        sequenceId: sequenceId,
        email: email,
        contacts: contacts,
        user: user,
        portal: portal,
        contact: contentPayload,
        onConfirm: enrollSequence,
        onReject: closeModal,
        goBackToSequences: function goBackToSequences() {
          resetModal({
            currentTab: SalesModalTabs.SEQUENCES
          });
        },
        isWithinSalesModal: true
      })]
    });
  },
  render: function render() {
    var contentPayload = this.props.contentPayload;
    var contentType = contentPayload.get('contentType');

    if (contentType === SearchContentTypes.SEQUENCE) {
      return this.renderSequenceEnrollModal();
    }

    return this.renderContent();
  }
});

var select = function select(state) {
  var ui = state.ui,
      content = state.content,
      contentPayload = state.contentPayload,
      searchable = state.searchable,
      salesModalInterface = state.salesModalInterface;
  var user = salesModalInterface.user,
      portal = salesModalInterface.portal,
      platform = salesModalInterface.platform,
      recipient = salesModalInterface.recipient,
      enrollSequence = salesModalInterface.enrollSequence,
      closeModal = salesModalInterface.closeModal;
  return {
    currentTab: ui.get('currentTab'),
    isLoading: ui.get('isLoading'),
    docSkipForm: ui.get('docSkipForm'),
    content: content,
    user: user,
    portal: portal,
    contentPayload: contentPayload,
    searchable: searchable,
    platform: platform,
    recipient: recipient,
    enrollSequence: enrollSequence,
    closeModal: closeModal,
    hasSequencesAccess: hasSequencesAccessSelector(state),
    canUseEnrollments: canUseEnrollmentsSelector(state),
    hasHigherTemplatesLimit: hasHigherTemplatesLimitSelector(state),
    hasHigherDocumentsLimit: hasHigherDocumentsLimitSelector(state),
    disableEnrollments: shouldDisableEnrollments(state)
  };
};

var ConnectedSalesModal = Checker({
  selectorName: 'sales-modal-index',
  successSelectors: '.sales-modal',
  rateLimit: true
})(SalesModal);
export default connect(select, Object.assign({}, ModalActions, {}, ContentActions, {}, EnrollHealthStatusActions))(ConnectedSalesModal);