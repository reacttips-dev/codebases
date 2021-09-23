'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import getComponentName from 'react-utils/getComponentName';
import { attachWrappedComponent } from './utils';
import { fontsLoaded, fontsLoadedPromise } from '../utils/Fonts';
import { requestIdleCallback, cancelIdleCallback } from '../utils/Timers';
export default function (Component) {
  var MeasureInputDecorator = /*#__PURE__*/function (_React$Component) {
    _inherits(MeasureInputDecorator, _React$Component);

    function MeasureInputDecorator(props) {
      var _this;

      _classCallCheck(this, MeasureInputDecorator);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MeasureInputDecorator).call(this, props));

      _this.measureInput = function () {
        if (!_this._isMounted) return; // Handle edge case where fontsLoadedPromise fires after unmount

        var inputNode = _this.props.inputRef.current;
        var inputWidth = inputNode.offsetWidth;

        if (inputWidth !== _this.state.inputWidth) {
          _this.setState({
            inputWidth: inputWidth
          });
        }
      };

      _this.handleWindowResize = function () {
        cancelIdleCallback(_this._resizeTimer);
        _this._resizeTimer = requestIdleCallback(_this.measureInput);
      };

      _this.state = {
        inputWidth: null
      };
      return _this;
    }

    _createClass(MeasureInputDecorator, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this._isMounted = true;
        addEventListener('resize', this.handleWindowResize);
        this.measureInput();
        if (!fontsLoaded()) fontsLoadedPromise.then(this.measureInput);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState) {
        // ⚠️ This condition prevents infinite loops! ⚠️
        if (prevState.inputWidth === this.state.inputWidth) {
          this.measureInput(this);
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        removeEventListener('resize', this.handleWindowResize);
        cancelIdleCallback(this._resizeTimer);
        this._isMounted = false;
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/_jsx(Component, Object.assign({}, this.props, {
          inputWidth: this.state.inputWidth
        }));
      }
    }]);

    return MeasureInputDecorator;
  }(React.Component);

  var componentName = getComponentName(Component);
  MeasureInputDecorator.displayName = "MeasureInput(" + componentName + ")";
  MeasureInputDecorator.propTypes = Component.propTypes;
  MeasureInputDecorator.defaultProps = Component.defaultProps;
  attachWrappedComponent(MeasureInputDecorator, Component);
  return MeasureInputDecorator;
}