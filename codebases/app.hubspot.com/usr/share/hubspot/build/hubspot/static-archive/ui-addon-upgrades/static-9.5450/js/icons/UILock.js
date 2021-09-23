'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIIcon from 'UIComponents/icon/UIIcon';

var UILock = /*#__PURE__*/function (_Component) {
  _inherits(UILock, _Component);

  function UILock() {
    _classCallCheck(this, UILock);

    return _possibleConstructorReturn(this, _getPrototypeOf(UILock).apply(this, arguments));
  }

  _createClass(UILock, [{
    key: "componentDidMount",
    // UILock should replace instances of the lock icon when used to indicate that there is a feature limit
    // After mounting it checks its context for a function set by the LockedFeature component, and calls it if it exists
    // The parent then knows that it has a lock in its descendants
    value: function componentDidMount() {
      var sendLockVerification = this.context.sendLockVerification;

      if (sendLockVerification) {
        sendLockVerification();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var propsToPass = Object.assign({}, this.props, {
        name: 'locked'
      });
      return /*#__PURE__*/_jsx(UIIcon, Object.assign({}, propsToPass));
    }
  }]);

  return UILock;
}(Component);

UILock.propTypes = {
  color: PropTypes.string
};
UILock.contextTypes = {
  sendLockVerification: PropTypes.func
};
export default UILock;