'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import { connect } from 'react-redux';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as EnrollmentStateActions from 'sales-modal/redux/actions/EnrollmentStateActions';
import * as ConnectedAccountsActions from 'sales-modal/redux/actions/ConnectedAccountsActions';
import * as SequenceActions from 'sales-modal/redux/actions/SequenceActions';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIButton from 'UIComponents/button/UIButton';
var EnrollmentInitializationError = createReactClass({
  displayName: "EnrollmentInitializationError",
  propTypes: {
    enrollmentStateError: PropTypes.bool.isRequired,
    initEnrollmentState: PropTypes.func.isRequired,
    connectedAccountsError: PropTypes.bool.isRequired,
    sequenceError: PropTypes.bool.isRequired,
    initConnectedAccounts: PropTypes.func.isRequired,
    fetchSequence: PropTypes.func.isRequired
  },
  retryRequests: function retryRequests() {
    var _this$props = this.props,
        enrollmentStateError = _this$props.enrollmentStateError,
        initEnrollmentState = _this$props.initEnrollmentState,
        connectedAccountsError = _this$props.connectedAccountsError,
        sequenceError = _this$props.sequenceError,
        initConnectedAccounts = _this$props.initConnectedAccounts,
        fetchSequence = _this$props.fetchSequence;

    if (enrollmentStateError && initEnrollmentState) {
      initEnrollmentState();
    }

    if (connectedAccountsError && initConnectedAccounts) {
      initConnectedAccounts();
    }

    if (sequenceError && fetchSequence) {
      fetchSequence();
    }
  },
  render: function render() {
    var _this$props2 = this.props,
        connectedAccountsError = _this$props2.connectedAccountsError,
        enrollmentStateError = _this$props2.enrollmentStateError,
        sequenceError = _this$props2.sequenceError;
    return /*#__PURE__*/_jsx(UIFlex, {
      align: "center",
      justify: "center",
      className: classNames('enrollment-initialization-error', enrollmentStateError && 'enrollment-error-enrollment-state', connectedAccountsError && 'enrollment-error-connected-accounts', sequenceError && 'enrollment-error-sequence-fetch'),
      children: /*#__PURE__*/_jsx(UIErrorMessage, {
        type: "badRequest",
        children: /*#__PURE__*/_jsx(UIButton, {
          onClick: this.retryRequests,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "enrollModal.generalError.tryAgain"
          })
        })
      })
    });
  }
});
export default connect(null, {
  initConnectedAccounts: ConnectedAccountsActions.initConnectedAccounts,
  fetchSequence: SequenceActions.fetchSequence,
  initEnrollmentState: EnrollmentStateActions.initEnrollmentState
})(EnrollmentInitializationError);