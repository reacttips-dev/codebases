'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import ErrorMessage from './ErrorMessage';
import PropTypes from 'prop-types';
import Raven from 'Raven';
import { Component } from 'react';
import { NavMarker } from 'react-rhumb';
var DEFAULT_ERROR_NAME = 'RHUMB_GLOBAL_ERROR'; // global error message recognized by rhumb https://product.hubteam.com/docs/frontend/docs/react-rhumb.html

var ErrorBoundary = /*#__PURE__*/function (_Component) {
  _inherits(ErrorBoundary, _Component);

  _createClass(ErrorBoundary, null, [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError() {
      return {
        hasError: true
      };
    }
  }]);

  function ErrorBoundary(props) {
    var _this;

    _classCallCheck(this, ErrorBoundary);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ErrorBoundary).call(this, props));
    _this.state = {
      hasError: false
    };
    return _this;
  }

  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      Raven.captureException(error, {
        extra: Object.assign({}, info),
        tags: {
          errorBoundary: true,
          wholeAppCrash: this.props.root || false
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return /*#__PURE__*/_jsx(NavMarker, {
          name: this.props.errorName || DEFAULT_ERROR_NAME,
          children: /*#__PURE__*/_jsx(ErrorMessage, {})
        });
      }

      return this.props.children;
    }
  }]);

  return ErrorBoundary;
}(Component);

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  root: PropTypes.bool,
  errorName: PropTypes.string
};
export { ErrorBoundary as default };