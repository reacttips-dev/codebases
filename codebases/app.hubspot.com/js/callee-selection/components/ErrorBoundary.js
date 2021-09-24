'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import { logCallingError } from 'calling-error-reporting/report/error';
import CalleeSelectErrorComponent from './CalleeSelectErrorComponent';

var ErrorBoundary = /*#__PURE__*/function (_PureComponent) {
  _inherits(ErrorBoundary, _PureComponent);

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
    value: function componentDidCatch(error, errorInfo) {
      logCallingError({
        errorMessage: 'Error in CalleeSelection',
        extraData: {
          error: error,
          errorInfo: errorInfo
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return /*#__PURE__*/_jsx(CalleeSelectErrorComponent, {
          logError: false
        });
      }

      return this.props.children;
    }
  }]);

  return ErrorBoundary;
}(PureComponent);

export { ErrorBoundary as default };