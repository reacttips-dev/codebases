'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { List, Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { Provider } from 'react-redux';
import createStore from 'sales-modal/redux/createStore';
import { INIT } from 'sales-modal/redux/actionTypes';
import SequenceBulkEnrollModal from 'sales-modal/modals/SequenceBulkEnrollModal';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import { SEQUENCES } from 'sales-modal/constants/SalesModalTabs';
import { PlatformPropType } from 'sales-modal/constants/Platform';

var SequenceBulkEnrollModalRoot = /*#__PURE__*/function (_Component) {
  _inherits(SequenceBulkEnrollModalRoot, _Component);

  function SequenceBulkEnrollModalRoot(props) {
    var _this;

    _classCallCheck(this, SequenceBulkEnrollModalRoot);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SequenceBulkEnrollModalRoot).call(this, props));
    var closeModal = props.closeModal,
        contacts = props.contacts,
        enrollSequence = props.enrollSequence,
        platform = props.platform,
        portal = props.portal,
        selectConnectedAccount = props.selectConnectedAccount,
        sender = props.sender,
        useCachedConnectedAccount = props.useCachedConnectedAccount,
        user = props.user;
    _this.store = createStore();

    _this.store.dispatch({
      type: INIT,
      payload: {
        closeModal: closeModal,
        enrollSequence: enrollSequence,
        enrollType: EnrollTypes.BULK_ENROLL,
        platform: platform,
        portal: portal,
        contacts: contacts,
        selectConnectedAccount: selectConnectedAccount,
        sender: sender,
        tab: SEQUENCES,
        useCachedConnectedAccount: useCachedConnectedAccount,
        user: user
      }
    });

    return _this;
  }

  _createClass(SequenceBulkEnrollModalRoot, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          sequenceId = _this$props.sequenceId,
          closeModal = _this$props.closeModal,
          enrollAllInSequence = _this$props.enrollAllInSequence,
          confirmBulkEnroll = _this$props.confirmBulkEnroll;
      return /*#__PURE__*/_jsx(Provider, {
        store: this.store,
        children: /*#__PURE__*/_jsx(SequenceBulkEnrollModal, {
          sequenceId: sequenceId,
          closeModal: closeModal,
          onConfirm: confirmBulkEnroll,
          enrollMultipleContacts: enrollAllInSequence,
          enrollType: EnrollTypes.BULK_ENROLL
        })
      });
    }
  }]);

  return SequenceBulkEnrollModalRoot;
}(Component);

SequenceBulkEnrollModalRoot.defaultProps = {
  selectConnectedAccount: false,
  useCachedConnectedAccount: true
};
SequenceBulkEnrollModalRoot.propTypes = {
  closeModal: PropTypes.func.isRequired,
  confirmBulkEnroll: PropTypes.func.isRequired,
  contacts: PropTypes.instanceOf(List).isRequired,
  enrollAllInSequence: PropTypes.func.isRequired,
  enrollSequence: PropTypes.func.isRequired,
  platform: PlatformPropType.isRequired,
  portal: PropTypes.instanceOf(ImmutableMap).isRequired,
  selectConnectedAccount: PropTypes.bool,
  sender: PropTypes.shape({
    inboxAddress: PropTypes.string,
    fromAddress: PropTypes.string
  }),
  sequenceId: PropTypes.number,
  useCachedConnectedAccount: PropTypes.bool,
  user: PropTypes.instanceOf(ImmutableMap).isRequired
};
export default SequenceBulkEnrollModalRoot;