'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { reportError } from 'conversations-error-reporting/error-reporting/reportError';
import { buildError } from 'conversations-error-reporting/error-reporting/builders/buildError';

var ErrorBoundary = /*#__PURE__*/function (_Component) {
  _inherits(ErrorBoundary, _Component);

  function ErrorBoundary() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ErrorBoundary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ErrorBoundary)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      hasError: false
    };
    return _this;
  }

  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      var message = ['Component caught', this.props.errorLoggingTitle, error.message].join(': ');
      var componentError = buildError(message, {
        name: 'ComponentError',
        componentStack: info.componentStack
      });
      reportError({
        error: componentError,
        fingerprint: ['{{ default }}', 'ComponentError'],
        tags: {
          componentDidCatch: true
        }
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.setState({
        hasError: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          renderError = _this$props.renderError;
      var hasError = this.state.hasError;
      if (hasError && !renderError) return null;

      if (hasError && renderError) {
        return renderError({
          reset: this.reset
        });
      }

      return children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError() {
      return {
        hasError: true
      };
    }
  }]);

  return ErrorBoundary;
}(Component);

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  errorLoggingTitle: PropTypes.string.isRequired,
  renderError: PropTypes.func
};
export { ErrorBoundary as default };
ErrorBoundary.displayName = 'ErrorBoundary';