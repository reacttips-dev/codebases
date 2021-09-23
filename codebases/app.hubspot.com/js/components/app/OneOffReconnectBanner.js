'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import I18n from 'I18n';
import PortalIdParser from 'PortalIdParser';
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIAlert from 'UIComponents/alert/UIAlert';
import UILink from 'UIComponents/link/UILink';
import { connect } from 'react-redux';
import { getAppRoot } from '../../lib/constants';
import { getOneOffReconnectRequiredAccounts } from '../../redux/selectors/channels';
import { getUserRoleName } from '../../redux/selectors/user';

var mapStateToProps = function mapStateToProps(state) {
  return {
    accountsRequiringOneOffReconnect: getOneOffReconnectRequiredAccounts(state),
    userRoleName: getUserRoleName(state)
  };
};

var OneOffReconnectBanner = /*#__PURE__*/function (_Component) {
  _inherits(OneOffReconnectBanner, _Component);

  function OneOffReconnectBanner(props) {
    var _this;

    _classCallCheck(this, OneOffReconnectBanner);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OneOffReconnectBanner).call(this, props));

    _this.hideOneOffReconnectWarning = function () {
      _this.setState({
        showOneOffReconnectWarning: false
      });
    };

    _this.state = {
      showOneOffReconnectWarning: true
    };
    return _this;
  }

  _createClass(OneOffReconnectBanner, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          accountsRequiringOneOffReconnect = _this$props.accountsRequiringOneOffReconnect,
          userRoleName = _this$props.userRoleName;
      var showOneOffReconnectWarning = this.state.showOneOffReconnectWarning;
      var roleSwitch = userRoleName === 'draft only' ? 'bodyDraftsOnly_jsx' : 'body_jsx';

      if (accountsRequiringOneOffReconnect && showOneOffReconnectWarning) {
        var oneOrOther = accountsRequiringOneOffReconnect === 1 ? 'one' : 'other';
        return /*#__PURE__*/_jsx(UIAlert, {
          className: "m-bottom-5",
          closeable: true,
          onClose: this.hideOneOffReconnectWarning,
          titleText: I18n.text('sui.linkedInOneOffReconnect.title'),
          type: 'danger',
          children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: "sui.linkedInOneOffReconnect." + oneOrOther + "." + roleSwitch,
            elements: {
              UILink: UILink
            },
            options: {
              url: "/" + getAppRoot() + "/" + PortalIdParser.get() + "/settings/"
            }
          })
        });
      }

      return null;
    }
  }]);

  return OneOffReconnectBanner;
}(Component);

OneOffReconnectBanner.propTypes = {
  accountsRequiringOneOffReconnect: PropTypes.number,
  userRoleName: PropTypes.string
};
export default connect(mapStateToProps, {})(OneOffReconnectBanner);