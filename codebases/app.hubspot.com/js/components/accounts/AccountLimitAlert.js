'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import UIAlert from 'UIComponents/alert/UIAlert';
import { ACCOUNT_THRESHOLD_LIMIT_APPROACH } from '../../lib/constants';
import SocialContext from '../app/SocialContext';

var AccountLimitAlert = /*#__PURE__*/function (_Component) {
  _inherits(AccountLimitAlert, _Component);

  function AccountLimitAlert() {
    var _this;

    _classCallCheck(this, AccountLimitAlert);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AccountLimitAlert).call(this));
    _this.state = {
      showAccountLimitAlert: true
    };
    return _this;
  }

  _createClass(AccountLimitAlert, [{
    key: "areConnectedChannelsOverLimit",
    value: function areConnectedChannelsOverLimit() {
      return this.props.connectedChannels >= this.props.connectedChannelsLimit;
    }
  }, {
    key: "areConnectedChannelsNearLimit",
    value: function areConnectedChannelsNearLimit() {
      return this.props.connectedChannels >= Math.ceil(this.props.connectedChannelsLimit * ACCOUNT_THRESHOLD_LIMIT_APPROACH);
    }
  }, {
    key: "getLimitAlertHeading",
    value: function getLimitAlertHeading() {
      if (this.areConnectedChannelsOverLimit()) {
        return I18n.text('sui.accounts.accountLimitAlerts.overLimit.heading');
      } else if (this.areConnectedChannelsNearLimit()) {
        return I18n.text('sui.accounts.accountLimitAlerts.nearLimit.heading');
      }

      return null;
    }
  }, {
    key: "getLimitAlertMessage",
    value: function getLimitAlertMessage() {
      var data = {
        accountsConnected: this.props.connectedChannels,
        accountsLimit: this.props.connectedChannelsLimit
      };

      if (this.areConnectedChannelsOverLimit()) {
        return I18n.text('sui.accounts.accountLimitAlerts.overLimit.message', data);
      } else if (this.areConnectedChannelsNearLimit()) {
        return I18n.text('sui.accounts.accountLimitAlerts.nearLimit.message', data);
      }

      return null;
    }
  }, {
    key: "showAccountLimitAlert",
    value: function showAccountLimitAlert() {
      return this.state.showAccountLimitAlert && this.props.isTrial && (this.areConnectedChannelsOverLimit() || this.areConnectedChannelsNearLimit());
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      if (!this.showAccountLimitAlert()) {
        return null;
      }

      this.context.trackInteraction('account limit alert', {
        connected: this.props.connectedChannels,
        limit: this.props.connectedChannelsLimit
      }, {
        onlyOnce: true
      });
      return /*#__PURE__*/_jsx(UIAlert, {
        className: "m-bottom-5",
        titleText: this.getLimitAlertHeading(),
        type: "" + (this.areConnectedChannelsOverLimit() ? 'danger' : 'warning'),
        closeable: true,
        onClose: function onClose() {
          return _this2.setState({
            showAccountLimitAlert: false
          });
        },
        children: this.getLimitAlertMessage()
      });
    }
  }]);

  return AccountLimitAlert;
}(Component);

AccountLimitAlert.propTypes = {
  connectedChannels: PropTypes.number.isRequired,
  connectedChannelsLimit: PropTypes.number.isRequired,
  isTrial: PropTypes.bool.isRequired
};
AccountLimitAlert.contextType = SocialContext;
AccountLimitAlert.defaultProps = {
  connectedChannels: 0
};
export { AccountLimitAlert as default };