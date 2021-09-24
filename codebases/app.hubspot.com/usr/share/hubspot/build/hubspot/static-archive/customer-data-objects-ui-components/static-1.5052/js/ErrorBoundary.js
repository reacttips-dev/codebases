'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import Raven from 'Raven';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import I18n from 'I18n';
import UILink from 'UIComponents/link/UILink';
import PropTypes from 'prop-types';
import once from 'transmute/once';
var addRefreshAlert;

function _addRefreshAlert(id) {
  FloatingAlertStore.addAlert({
    id: id,
    type: 'danger',
    use: 'inline',
    titleText: I18n.text('componentErrorAlert.title'),
    message: /*#__PURE__*/_jsx(FormattedJSXMessage, {
      message: "componentErrorAlert.message_jsx",
      options: {
        href: window.location.href
      },
      elements: {
        Link: UILink
      }
    }),
    // if they close the alert, reset the timer in case something else breaks
    onClose: function onClose() {
      addRefreshAlert = once(_addRefreshAlert);
    }
  });
} // if a bunch of things break at the same time, during a critsit or something,
// we don't want to show the alert a million times. show it once, and reset if
// they clear it (see onClose above)


addRefreshAlert = once(_addRefreshAlert);
/**
 * Usage:
 *   <ErrorBoundary boundaryName="MyComponent_MyError" ErrorComponent={MyError} errorProps={{ foo: 'bar' }}>
 *     <MyComponent />
 *   </ErrorBoundary>
 */

var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inherits(ErrorBoundary, _React$Component);

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

    _this.attemptToRemount = function () {
      var _this$props = _this.props,
          boundaryName = _this$props.boundaryName,
          showRefreshAlert = _this$props.showRefreshAlert;

      if (showRefreshAlert && boundaryName) {
        addRefreshAlert = once(_addRefreshAlert);
        FloatingAlertStore.removeAlert(boundaryName);
      }

      _this.setState({
        hasError: false
      });
    };

    _this.state = {
      hasError: false
    };
    return _this;
  }

  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error) {
      var info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _this$props2 = this.props,
          shouldAutoReset = _this$props2.shouldAutoReset,
          onComponentDidCatch = _this$props2.onComponentDidCatch;

      if (!shouldAutoReset(error)) {
        this.reportErrors(error, info);
      } else {
        this.setState({
          hasError: false
        });
      }

      onComponentDidCatch(error);
    } // Passed to the ErrorComponent to allow for a manual reset of the component.

  }, {
    key: "reportErrors",
    value: function reportErrors(error) {
      var info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var boundaryName = this.props.boundaryName || '';

      if (window.newrelic && typeof window.newrelic.noticeError === 'function') {
        window.newrelic.noticeError(error, {
          errorBoundaryName: boundaryName
        });
      }

      Raven.captureException(error, {
        extra: Object.assign({}, info, {
          version: React.version
        }),
        tags: {
          errorBoundaryName: boundaryName
        }
      });

      if (this.props.showRefreshAlert) {
        addRefreshAlert(boundaryName);
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.hasError) {
        return this.props.children;
      }

      var ErrorComponent = this.props.ErrorComponent;

      if (this.state.hasError && ErrorComponent) {
        return /*#__PURE__*/_jsx(ErrorComponent, Object.assign({}, this.props.errorProps, {
          attemptToRemount: this.attemptToRemount
        }));
      }

      return null;
    }
  }]);

  return ErrorBoundary;
}(React.Component);

ErrorBoundary.propTypes = {
  // boundaryName: "<Component>_<Error Component>" (e.g. "FloatingForm_SidebarPropertyError")
  boundaryName: PropTypes.string,
  ErrorComponent: PropTypes.func,
  errorProps: PropTypes.object,
  children: PropTypes.node,
  onComponentDidCatch: PropTypes.func,

  /**
   * shouldAutoReset: (optional) attempts to refresh the component and returns a boolean value
   * When false is returned we show and log the error.
   */
  shouldAutoReset: PropTypes.func,
  showRefreshAlert: PropTypes.bool
};
ErrorBoundary.defaultProps = {
  showRefreshAlert: true,
  shouldAutoReset: function shouldAutoReset() {
    return false;
  },
  onComponentDidCatch: function onComponentDidCatch() {}
};
export default ErrorBoundary;