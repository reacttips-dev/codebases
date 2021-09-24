'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
var ReviewModal = createReactClass({
  displayName: "ReviewModal",
  propTypes: {
    numContacts: PropTypes.number.isRequired,
    sequenceName: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    handleBulkEnrollContacts: PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      isEnrolling: false
    };
  },
  handleConfirm: function handleConfirm() {
    this.setState({
      isEnrolling: true
    });
    this.props.handleBulkEnrollContacts().then(this.props.onConfirm, this.props.onReject);
  },
  renderConfirmLoadingButton: function renderConfirmLoadingButton(props) {
    return /*#__PURE__*/_jsx(UILoadingButton, Object.assign({}, props, {
      loading: this.state.isEnrolling
    }));
  },
  render: function render() {
    var _this$props = this.props,
        numContacts = _this$props.numContacts,
        sequenceName = _this$props.sequenceName,
        onReject = _this$props.onReject;
    return /*#__PURE__*/_jsx(UIConfirmModal, {
      "data-selenium-test": "sequence-bulk-enroll-confirm-modal",
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.reviewModal.title",
        options: {
          sequenceName: sequenceName,
          count: numContacts
        }
      }),
      confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.reviewModal.confirm",
        options: {
          count: numContacts
        }
      }),
      description: "",
      ConfirmButton: this.renderConfirmLoadingButton,
      onConfirm: this.handleConfirm,
      rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.reviewModal.cancel"
      }),
      onReject: onReject
    });
  }
});
export default ReviewModal;