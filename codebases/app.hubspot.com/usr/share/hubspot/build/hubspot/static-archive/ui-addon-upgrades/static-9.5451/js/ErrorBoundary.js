'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Component } from 'react';
import PropTypes from 'prop-types';
import logError from './_core/common/reliability/logError';

var ErrorBoundary = /*#__PURE__*/function (_Component) {
  _inherits(ErrorBoundary, _Component);

  _createClass(ErrorBoundary, null, [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError() {
      return {
        error: true
      };
    }
  }]);

  function ErrorBoundary(props) {
    var _this;

    _classCallCheck(this, ErrorBoundary);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ErrorBoundary).call(this, props));
    _this.state = {
      error: false
    };
    return _this;
  }

  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      var boundaryName = this.props.boundaryName;
      error.info = JSON.stringify(info);
      logError(boundaryName, error);
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      var error = this.state.error;

      if (error) {
        return null;
      }

      return children;
    }
  }]);

  return ErrorBoundary;
}(Component);

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  boundaryName: PropTypes.string.isRequired
};
export default ErrorBoundary;