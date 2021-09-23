'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIAlert from 'UIComponents/alert/UIAlert';
import { logCallingError } from 'calling-error-reporting/report/error';

var FooterErrorBoundary = /*#__PURE__*/function (_PureComponent) {
  _inherits(FooterErrorBoundary, _PureComponent);

  function FooterErrorBoundary() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FooterErrorBoundary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FooterErrorBoundary)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      hasError: false
    };
    return _this;
  }

  _createClass(FooterErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      logCallingError({
        errorMessage: 'Error in CallWidgetFooter',
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
        return /*#__PURE__*/_jsx(UIAlert, {
          titleText: I18n.text('calling-communicator-ui.callingWidgetFooter.errorBoundary.title'),
          type: "danger",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "calling-communicator-ui.callingWidgetFooter.errorBoundary.body"
          })
        });
      }

      return this.props.children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError() {
      return {
        hasError: true
      };
    }
  }]);

  return FooterErrorBoundary;
}(PureComponent);

export { FooterErrorBoundary as default };