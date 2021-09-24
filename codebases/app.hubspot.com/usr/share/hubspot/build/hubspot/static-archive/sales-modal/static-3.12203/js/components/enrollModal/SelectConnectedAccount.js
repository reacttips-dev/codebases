'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { List } from 'immutable';
import { connect } from 'react-redux';
import memoize from 'transmute/memoize';
import { SELECTED_SENDER_ADDRESS_ALIAS } from 'sales-modal/constants/LocalStorageKeys';
import * as localSettings from 'sales-modal/lib/localSettings';
import { getSelectedSenderFromAddress } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { selectEnabledSenderRecords } from 'sales-modal/redux/selectors/ConnectedAccountSelectors';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import * as ConnectedAccountsActions from 'sales-modal/redux/actions/ConnectedAccountsActions';
import UISelect from 'UIComponents/input/UISelect';
var getValues = memoize(function (enabledSenderRecords) {
  return enabledSenderRecords.map(function (_ref) {
    var fromAddress = _ref.fromAddress;
    return {
      text: fromAddress,
      value: fromAddress
    };
  }).toArray();
});
var SelectConnectedAccount = createReactClass({
  displayName: "SelectConnectedAccount",
  propTypes: {
    selectConnectedAccount: PropTypes.bool.isRequired,
    fromAddress: PropTypes.string.isRequired,
    enabledSenderRecords: PropTypes.instanceOf(List).isRequired,
    selectSenderRecord: PropTypes.func.isRequired
  },
  handleChange: function handleChange(e) {
    var _this$props = this.props,
        enabledSenderRecords = _this$props.enabledSenderRecords,
        selectSenderRecord = _this$props.selectSenderRecord;
    var selectedAddress = e.target.value;
    var selectedSenderRecord = enabledSenderRecords.find(function (_ref2) {
      var fromAddress = _ref2.fromAddress;
      return fromAddress === selectedAddress;
    });
    selectSenderRecord(selectedSenderRecord);
    localSettings.set(SELECTED_SENDER_ADDRESS_ALIAS, selectedSenderRecord.fromAddress);
    UsageTracker.track('sequencesUsage', {
      action: 'Selected different email',
      subscreen: 'enroll'
    });
  },
  render: function render() {
    if (!this.props.selectConnectedAccount) {
      return /*#__PURE__*/_jsx("span", {
        id: "email",
        className: "is--text--help m-right-4",
        children: this.props.fromAddress
      });
    }

    return /*#__PURE__*/_jsx(UISelect, {
      "data-test-id": "connected-from-address-select",
      value: this.props.fromAddress,
      buttonUse: "transparent",
      menuWidth: "auto",
      className: "p-all-0",
      onChange: this.handleChange,
      options: getValues(this.props.enabledSenderRecords),
      placement: "top"
    });
  }
});
export default connect(function (state) {
  return {
    fromAddress: getSelectedSenderFromAddress(state),
    selectConnectedAccount: state.salesModalInterface.selectConnectedAccount,
    connectedAccounts: state.connectedAccounts.data,
    enabledSenderRecords: selectEnabledSenderRecords(state)
  };
}, ConnectedAccountsActions)(SelectConnectedAccount);