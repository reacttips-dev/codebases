'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import { removeNotification } from '../actions/NotificationActions';

var NotificationList = /*#__PURE__*/function (_Component) {
  _inherits(NotificationList, _Component);

  function NotificationList() {
    _classCallCheck(this, NotificationList);

    return _possibleConstructorReturn(this, _getPrototypeOf(NotificationList).apply(this, arguments));
  }

  _createClass(NotificationList, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          notifications = _this$props.notifications,
          onRemoveNotification = _this$props.onRemoveNotification;
      var floatingAlerts = Object.keys(notifications).map(function (notificationId) {
        var clonedNotification = Object.assign({}, notifications[notificationId]); // These properties are only used internally by ReduxMessenger,
        // and should not be passed onto the UIFloatingAlert component

        delete clonedNotification.sticky;
        delete clonedNotification.timeout;
        return clonedNotification;
      });
      return /*#__PURE__*/_jsx(UIFloatingAlertList, {
        alerts: floatingAlerts,
        className: className,
        onAlertClose: function onAlertClose(evt, _ref) {
          var id = _ref.id;
          return onRemoveNotification(id);
        }
      });
    }
  }]);

  return NotificationList;
}(Component);

NotificationList.propTypes = {
  className: PropTypes.string,
  notifications: PropTypes.object.isRequired,
  onRemoveNotification: PropTypes.func.isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    notifications: state.notifications
  };
};

var actionCreators = {
  onRemoveNotification: removeNotification
};
export default connect(mapStateToProps, actionCreators)(NotificationList);