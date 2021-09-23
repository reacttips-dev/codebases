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
import colr from './vendor/colr';

function rgbaColor(r, g, b, a) {
  return "rgba(" + [r, g, b, a / 100].join(',') + ")";
}

var Slider = styled.div.withConfig({
  displayName: "AlphaRibbon__Slider",
  componentId: "mzig2k-0"
})(["position:relative;height:14px;width:100%;border-radius:2px;margin-top:4px;background-image:url('data:image/png;base64,R0lGODdhCgAKAPAAAOXl5f///ywAAAAACgAKAEACEIQdqXt9GxyETrI279OIgwIAOw==');background-repeat:repeat;user-select:none;"]);
var SliderBackground = styled.div.withConfig({
  displayName: "AlphaRibbon__SliderBackground",
  componentId: "mzig2k-1"
})(["position:absolute;width:100%;height:100%;border-radius:2px;box-shadow:0 0 2px #808080 inset;"]);
var SliderIndicator = styled.span.withConfig({
  displayName: "AlphaRibbon__SliderIndicator",
  componentId: "mzig2k-2"
})(["position:absolute;top:2px;bottom:2px;width:6px;border:1px solid #888888;padding:1px 0;margin-left:-3px;background-color:#eeeeee;border-radius:3px;"]);
var SliderHandler = styled.div.withConfig({
  displayName: "AlphaRibbon__SliderHandler",
  componentId: "mzig2k-3"
})(["position:absolute;width:104%;height:100%;left:-2%;border-radius:2px;cursor:pointer;"]);

var AlphaRibbon = /*#__PURE__*/function (_Component) {
  _inherits(AlphaRibbon, _Component);

  function AlphaRibbon() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, AlphaRibbon);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AlphaRibbon)).call.apply(_getPrototypeOf2, [this].concat(args)));

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

    _this.getBackground = function () {
      var _colr$fromHex$toRgbOb = colr.fromHex(_this.props.hex).toRgbObject(),
          r = _colr$fromHex$toRgbOb.r,
          g = _colr$fromHex$toRgbOb.g,
          b = _colr$fromHex$toRgbOb.b;

      var startColor = rgbaColor(r, g, b, 0);
      var endColor = rgbaColor(r, g, b, 100);
      return "linear-gradient(to right, " + startColor + ", " + endColor + ")";
    };

    _this.pointMoveTo = function (coords) {
      var rect = _this.measureBounds();

      var width = rect.width;
      var left = coords.x - rect.left;
      left = Math.max(0, left);
      left = Math.min(left, width);
      var alpha = Math.floor(left / width * 100);

      _this.props.onChange({
        alpha: alpha
      });
    };

    return _this;
  }

  _createClass(AlphaRibbon, [{
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
          alpha = _this$props.alpha,
          className = _this$props.className;
      return /*#__PURE__*/_jsxs(Slider, {
        ref: function ref(el) {
          return _this2.slider = el;
        },
        "data-test-id": "alpha-ribbon-slider",
        className: className,
        children: [/*#__PURE__*/_jsx(SliderBackground, {
          "data-test-id": "alpha-ribbon-background",
          style: {
            background: this.getBackground()
          }
        }), /*#__PURE__*/_jsx(SliderIndicator, {
          "data-test-id": "alpha-ribbon-slider-indicator",
          style: {
            left: alpha + "%"
          }
        }), /*#__PURE__*/_jsx(SliderHandler, {
          "data-test-id": "alpha-ribbon-handler",
          onMouseDown: this.onMouseDown
        })]
      });
    }
  }]);

  return AlphaRibbon;
}(Component);

export { AlphaRibbon as default };
AlphaRibbon.propTypes = {
  alpha: PropTypes.number,
  className: PropTypes.string,
  hex: PropTypes.string,
  onChange: PropTypes.func
};