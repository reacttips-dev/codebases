'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Component } from 'react';
import PropTypes from 'prop-types';

var AsyncComponentErrorBoundary = /*#__PURE__*/function (_Component) {
  _inherits(AsyncComponentErrorBoundary, _Component);

  _createClass(AsyncComponentErrorBoundary, null, [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(error) {
      return {
        error: error
      };
    }
  }]);

  function AsyncComponentErrorBoundary(props) {
    var _this;

    _classCallCheck(this, AsyncComponentErrorBoundary);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsyncComponentErrorBoundary).call(this, props));

    _this.handleRetry = function () {
      _this.setState({
        error: false
      });
    };

    _this.explicitlySetError = function (error) {
      _this.setState({
        error: error
      });
    };

    _this.state = {
      error: null
    };
    return _this;
  }

  _createClass(AsyncComponentErrorBoundary, [{
    key: "render",
    value: function render() {
      if (this.state.error) {
        return this.props.renderError(this.handleRetry);
      }

      return this.props.children;
    }
  }]);

  return AsyncComponentErrorBoundary;
}(Component);

AsyncComponentErrorBoundary.displayName = 'AsyncComponentErrorBoundary';
AsyncComponentErrorBoundary.propTypes = {
  children: PropTypes.node,
  renderError: PropTypes.func.isRequired
};
export default AsyncComponentErrorBoundary;