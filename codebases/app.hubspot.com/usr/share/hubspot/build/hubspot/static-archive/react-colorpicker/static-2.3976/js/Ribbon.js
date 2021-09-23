'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
var Slider = styled.div.withConfig({
  displayName: "Ribbon__Slider",
  componentId: "h26pcy-0"
})(["position:relative;height:", ";border-radius:2px;box-shadow:0 0 2px #808080 inset;background-image:linear-gradient( to right,#ff0000 0%,#ff9900 10%,#cdff00 20%,#35ff00 30%,#00ff66 40%,#00fffd 50%,#0066ff 60%,#3200ff 70%,#cd00ff 80%,#ff0099 90%,#ff0000 100% );"], function (_ref) {
  var includeAlpha = _ref.includeAlpha;
  return includeAlpha ? "14px" : "30px";
});
var SliderIndicator = styled.span.withConfig({
  displayName: "Ribbon__SliderIndicator",
  componentId: "h26pcy-1"
})(["position:absolute;top:2px;bottom:2px;width:6px;border:1px solid #888888;padding:1px 0;margin-left:-3px;background-color:#eeeeee;border-radius:3px;"]);
var SliderHandler = styled.div.withConfig({
  displayName: "Ribbon__SliderHandler",
  componentId: "h26pcy-2"
})(["position:absolute;width:104%;height:100%;left:-2%;cursor:pointer;"]);

var Ribbon = /*#__PURE__*/function (_Component) {
  _inherits(Ribbon, _Component);

  function Ribbon() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Ribbon);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Ribbon)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onMouseDown = function (evt) {
      evt.preventDefault();
      var x = evt.clientX;
      var y = evt.clientY;

      _this.pointMoveTo({
        x: x,
        y: y
      });

      window.addEventListener('mousemove', _this.onDrag);
      window.addEventListener('mouseup', _this.onDragEnd);
    };

    _this.onDrag = function (evt) {
      var x = evt.clientX;
      var y = evt.clientY;

      _this.pointMoveTo({
        x: x,
        y: y
      });
    };

    _this.onDragEnd = function (evt) {
      var x = evt.clientX;
      var y = evt.clientY;

      _this.pointMoveTo({
        x: x,
        y: y
      });

      _this.removeMouseListeners();
    };

    _this.pointMoveTo = function (coords) {
      var rect = _this.measureBounds();

      var width = rect.width;
      var left = coords.x - rect.left;
      left = Math.max(0, left);
      left = Math.min(left, width);
      var huePercent = left / width;
      var hue = Math.floor(huePercent * 360);

      _this.props.onChange({
        hue: hue
      });
    };

    return _this;
  }

  _createClass(Ribbon, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeMouseListeners();
    }
  }, {
    key: "removeMouseListeners",
    value: function removeMouseListeners() {
      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.onDragEnd);
    }
  }, {
    key: "measureBounds",
    value: function measureBounds() {
      return this.slider && this.slider.getBoundingClientRect();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          className = _this$props.className,
          hue = _this$props.hue,
          includeAlpha = _this$props.includeAlpha;
      var percent = hue / 360 * 100;
      return /*#__PURE__*/_jsxs(Slider, {
        ref: function ref(el) {
          return _this2.slider = el;
        },
        "data-test-id": "ribbon-slider",
        className: className,
        includeAlpha: includeAlpha,
        percent: percent,
        children: [/*#__PURE__*/_jsx(SliderIndicator, {
          "data-test-id": "ribbon-slider-indicator",
          style: {
            left: percent + "%"
          }
        }), /*#__PURE__*/_jsx(SliderHandler, {
          "data-test-id": "ribbon-handler",
          onMouseDown: this.onMouseDown
        })]
      });
    }
  }]);

  return Ribbon;
}(Component);

export { Ribbon as default };
Ribbon.propTypes = {
  className: PropTypes.string,
  hue: PropTypes.number,
  onChange: PropTypes.func,
  includeAlpha: PropTypes.bool
};