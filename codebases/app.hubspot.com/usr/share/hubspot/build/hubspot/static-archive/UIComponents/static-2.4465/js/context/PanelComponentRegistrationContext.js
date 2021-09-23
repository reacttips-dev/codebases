'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createContext, Component } from 'react';
import { callIfPossible } from '../core/Functions';
export var types = {
  registerPanelHeader: PropTypes.func,
  unregisterPanelHeader: PropTypes.func,
  registerPanelBody: PropTypes.func,
  unregisterPanelBody: PropTypes.func
};

var _createContext = /*#__PURE__*/createContext({}),
    Consumer = _createContext.Consumer,
    Provider = _createContext.Provider;

export { Consumer, Provider };

var Registration = /*#__PURE__*/function (_Component) {
  _inherits(Registration, _Component);

  function Registration() {
    _classCallCheck(this, Registration);

    return _possibleConstructorReturn(this, _getPrototypeOf(Registration).apply(this, arguments));
  }

  _createClass(Registration, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      callIfPossible(this.props.register);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      callIfPossible(this.props.unregister);
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return Registration;
}(Component);

export function RegistersPanelHeader() {
  return /*#__PURE__*/_jsx(Consumer, {
    children: function children(_ref) {
      var registerPanelHeader = _ref.registerPanelHeader,
          unregisterPanelHeader = _ref.unregisterPanelHeader;
      return /*#__PURE__*/_jsx(Registration, {
        register: registerPanelHeader,
        unregister: unregisterPanelHeader
      });
    }
  });
}
export function RegistersPanelBody() {
  return /*#__PURE__*/_jsx(Consumer, {
    children: function children(_ref2) {
      var registerPanelBody = _ref2.registerPanelBody,
          unregisterPanelBody = _ref2.unregisterPanelBody;
      return /*#__PURE__*/_jsx(Registration, {
        register: registerPanelBody,
        unregister: unregisterPanelBody
      });
    }
  });
}