'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { createElement, Component } from 'react';
import getComponentName from 'react-utils/getComponentName';
import * as localSettings from 'sales-modal/lib/localSettings';
import { REAGAN_LIGHT_DEBUG } from 'sales-modal/constants/LocalStorageKeys';
var SAMPLE_RATE = 0.25;
export default (function (_ref) {
  var successSelectors = _ref.successSelectors,
      errorSelectors = _ref.errorSelectors,
      performanceSelectors = _ref.performanceSelectors,
      selectorName = _ref.selectorName,
      _ref$rateLimit = _ref.rateLimit,
      rateLimit = _ref$rateLimit === void 0 ? false : _ref$rateLimit;
  return function (WrappedComponent) {
    var Checker = /*#__PURE__*/function (_Component) {
      _inherits(Checker, _Component);

      function Checker() {
        var _this;

        _classCallCheck(this, Checker);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Checker).call(this));
        _this.openTime = window.performance.now();
        _this.state = {
          reaganTimedOut: false
        };
        _this.shouldSendPageAction = true;

        if (rateLimit) {
          _this.shouldSendPageAction = Math.random() <= SAMPLE_RATE;
        }

        _this.startCheck();

        return _this;
      }

      _createClass(Checker, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          clearInterval(this.checkInterval);
          clearInterval(this.watchdogTimeout);
          clearInterval(this.performanceInterval);
        }
      }, {
        key: "addPageAction",
        value: function addPageAction() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          if (window.newrelic && this.shouldSendPageAction) {
            var optionsWithSelectorName = Object.assign({}, options, {
              selectorName: selectorName
            });
            window.newrelic.addPageAction('salesModalReagan', optionsWithSelectorName);

            if (localSettings.get(REAGAN_LIGHT_DEBUG)) {
              console.log('salesModalReagan', optionsWithSelectorName);
            }
          }
        }
      }, {
        key: "findSelectorsOnScreen",
        value: function findSelectorsOnScreen(selectors) {
          if (!selectors) {
            return false;
          }

          return selectors.filter(function (selector) {
            return document.querySelectorAll(selector).length > 0;
          });
        }
      }, {
        key: "startCheck",
        value: function startCheck() {
          var _this2 = this;

          var successSelectorsArray = successSelectors && successSelectors.split(', ');
          var errorSelectorsArray = errorSelectors && errorSelectors.split(', ');
          var performanceSelectorsArray = performanceSelectors && performanceSelectors.split(', ');
          this.addPageAction({
            status: 'open'
          });
          this.checkInterval = setInterval(function () {
            var successSelectorsOnScreen = _this2.findSelectorsOnScreen(successSelectorsArray);

            var errorSelectorsOnScreen = _this2.findSelectorsOnScreen(errorSelectorsArray);

            if (errorSelectorsOnScreen.length > 0) {
              clearInterval(_this2.checkInterval);
              clearInterval(_this2.watchdogTimeout);

              _this2.addPageAction({
                status: 'failure',
                failureType: 'errorSelector',
                errorSelectorsFound: errorSelectorsOnScreen.join(', '),
                loadTime: window.performance.now() - _this2.openTime
              });
            }

            if (successSelectorsOnScreen.length > 0) {
              clearInterval(_this2.checkInterval);
              clearInterval(_this2.watchdogTimeout);

              _this2.addPageAction({
                status: 'success',
                loadTime: window.performance.now() - _this2.openTime
              });
            }
          }, 25);
          this.watchdogTimeout = setTimeout(function () {
            clearInterval(_this2.checkInterval);

            _this2.addPageAction({
              status: 'timeout'
            });

            _this2.setState({
              reaganTimedOut: true
            });
          }, 60 * 1000);

          if (performanceSelectorsArray) {
            this.performanceInterval = setInterval(function () {
              var performanceSelectorOnScreen = _this2.findSelectorsOnScreen(performanceSelectorsArray);

              if (performanceSelectorOnScreen.length > 0) {
                clearInterval(_this2.performanceInterval);

                _this2.addPageAction({
                  status: 'enrollModalPerformanceCheck',
                  loadTime: window.performance.now() - _this2.openTime
                });
              }
            }, 25);
          }
        }
      }, {
        key: "render",
        value: function render() {
          return /*#__PURE__*/createElement(WrappedComponent, Object.assign({}, this.props, {
            reaganTimedOut: this.state.reaganTimedOut
          }));
        }
      }]);

      return Checker;
    }(Component);

    Checker.WrappedComponent = WrappedComponent;
    Checker.displayName = "ReaganLite(" + getComponentName(WrappedComponent) + ")";
    return Checker;
  };
});