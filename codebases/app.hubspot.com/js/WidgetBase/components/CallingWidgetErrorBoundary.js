'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EmbeddedContextPropType from 'ui-addon-iframeable/embed/EmbeddedContextPropType';
import { RELOAD_EMBED_MSG } from 'calling-internal-common/iframe-events/InternalIframeEventTypes';
import { logCallingError, logPageAction } from 'calling-error-reporting/report/error';
import { VIEWED_WIDGET_ERROR } from '../../constants/pageActionKeys';
import CallingWidgetErrorMessage from './CallingWidgetErrorMessage';

var CallingWidgetErrorBoundary = /*#__PURE__*/function (_PureComponent) {
  _inherits(CallingWidgetErrorBoundary, _PureComponent);

  function CallingWidgetErrorBoundary() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CallingWidgetErrorBoundary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CallingWidgetErrorBoundary)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      hasError: false
    };

    _this.handleReset = function () {
      _this.props.embeddedContext.sendMessage(RELOAD_EMBED_MSG);
    };

    return _this;
  }

  _createClass(CallingWidgetErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      logCallingError({
        errorMessage: 'Error caught in CallingWidgetWrapper',
        extraData: {
          error: error,
          errorInfo: errorInfo
        },
        tags: {
          plainErrorMessage: error.message
        }
      });
      logPageAction({
        key: VIEWED_WIDGET_ERROR
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return /*#__PURE__*/_jsx(CallingWidgetErrorMessage, {
          onReset: this.handleReset
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

  return CallingWidgetErrorBoundary;
}(PureComponent);

CallingWidgetErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  embeddedContext: EmbeddedContextPropType
};
export { CallingWidgetErrorBoundary as default };