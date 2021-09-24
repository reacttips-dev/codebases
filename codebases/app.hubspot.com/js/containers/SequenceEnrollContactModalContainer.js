'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { canUseBulkEnroll, canUseEnrollments } from 'SequencesUI/lib/permissions';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import { leaveEnroll } from 'SequencesUI/lib/links';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import EnrollContactModal from 'SequencesUI/components/enroll/EnrollContactModal';
import SequenceEnrollModal from 'SequencesUI/components/SequenceEnrollModal';
import shouldDisableEnrollments from 'SequencesUI/util/shouldDisableEnrollments';
import withSequencesStatus from './withSequencesStatus';
var SequenceEnrollContactModalContainer = createReactClass({
  displayName: "SequenceEnrollContactModalContainer",
  propTypes: {
    disableEnrollments: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    connectedAccounts: PropTypes.object,
    enroll: PropTypes.func.isRequired
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      close: false,
      showEnrollModal: false,
      selectedContacts: List()
    };
  },
  componentDidMount: function componentDidMount() {
    if (!canUseEnrollments()) {
      this.exitModal();
    }
  },
  handleReject: function handleReject() {
    this.setState({
      showEnrollModal: false
    });
    this.exitModal();
  },
  handleConfirm: function handleConfirm(_ref) {
    var enrollment = _ref.enrollment,
        updateEnrollmentProgress = _ref.updateEnrollmentProgress;
    var selectedContacts = this.state.selectedContacts;
    var useMultipleContactSelection = selectedContacts.size > 1;

    if (!useMultipleContactSelection) {
      enrollment = enrollment.set('userPlatform', 'SEQUENCES_UI');
      this.props.enroll({
        enrollment: enrollment,
        vid: selectedContacts.first().get('vid'),
        isReenroll: false
      }).then(function (completedEnrollment) {
        updateEnrollmentProgress('complete', completedEnrollment);
      });
    }

    this.setState({
      showEnrollModal: false
    });
    this.exitModal();
  },
  handleEnrollClick: function handleEnrollClick(contacts) {
    this.setState({
      showEnrollModal: true,
      selectedContacts: contacts,
      close: true
    });
  },
  exitModal: function exitModal() {
    var _this = this;

    this.setState({
      close: true
    }, function () {
      _this.context.router.push({
        pathname: leaveEnroll(_this.context.router.location.pathname),
        query: getQueryParams()
      });
    });
  },
  renderEnrollModal: function renderEnrollModal() {
    if (!this.state.showEnrollModal) {
      return null;
    }

    var selectedContacts = this.state.selectedContacts;
    var sequenceId = this.props.params.sequenceId;
    sequenceId = parseInt(sequenceId, 10);
    tracker.track('sequencesInteraction', {
      action: 'Opened sales modal',
      subscreen: 'sequence-summary'
    });
    return /*#__PURE__*/_jsx(SequenceEnrollModal, {
      sequenceId: sequenceId,
      useMultipleContactSelection: selectedContacts.size > 1,
      contacts: selectedContacts,
      enroll: this.props.enroll,
      connectedAccounts: this.props.connectedAccounts,
      onConfirm: this.handleConfirm,
      onReject: this.handleReject
    });
  },
  renderModal: function renderModal() {
    var disableEnrollments = this.props.disableEnrollments;

    if (!disableEnrollments && !this.state.close && canUseEnrollments()) {
      return /*#__PURE__*/_jsx(EnrollContactModal, {
        useMultipleContactSelection: canUseBulkEnroll(),
        onConfirm: this.handleEnrollClick,
        onReject: this.exitModal
      });
    }

    return null;
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [this.renderModal(), this.renderEnrollModal()]
    });
  }
});
export default withSequencesStatus(connect(function (_ref2) {
  var enrollHealthStatus = _ref2.enrollHealthStatus,
      connectedAccounts = _ref2.connectedAccounts;
  return {
    disableEnrollments: shouldDisableEnrollments(enrollHealthStatus),
    connectedAccounts: connectedAccounts
  };
}, Object.assign({}, SequenceActions))(SequenceEnrollContactModalContainer));