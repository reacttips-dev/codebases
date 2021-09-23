'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import Board from './Board';
import Preview from './Preview';
import Ribbon from './Ribbon';
import AlphaRibbon from './AlphaRibbon';
import Params from './Params';
import FavoritesAccordion from './FavoritesAccordion';
var PanelContainer = styled.div.withConfig({
  displayName: "Panel__PanelContainer",
  componentId: "s9los4-0"
})(["display:flex;position:relative;padding:8px;"]);
var PanelInner = styled.div.withConfig({
  displayName: "Panel__PanelInner",
  componentId: "s9los4-1"
})(["width:146px;display:flex;flex-direction:column;"]);
var RibbonContainer = styled.div.withConfig({
  displayName: "Panel__RibbonContainer",
  componentId: "s9los4-2"
})(["display:flex;flex-shrink:0;"]);
var RibbonInner = styled.div.withConfig({
  displayName: "Panel__RibbonInner",
  componentId: "s9los4-3"
})(["flex-grow:1;"]);

var Panel = /*#__PURE__*/function (_Component) {
  _inherits(Panel, _Component);

  function Panel() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Panel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Panel)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onSystemColorPickerOpen = function (evt) {
      // only works with browsers that support color input
      if (evt.target.type === 'color') {
        _this.systemColorPickerOpen = true;
      }
    };

    _this.onFocus = function () {
      if (_this._blurTimer) {
        clearTimeout(_this._blurTimer);
        _this._blurTimer = null;
      } else {
        _this.props.onFocus();
      }
    };

    _this.onBlur = function () {
      if (_this._blurTimer) {
        clearTimeout(_this._blurTimer);
      }

      _this._blurTimer = setTimeout(function () {
        // if is system color picker open, then stop run blur
        if (_this.systemColorPickerOpen) {
          _this.systemColorPickerOpen = false;
          return;
        }

        _this.props.onBlur();
      }, 100);
    };

    return _this;
  }

  _createClass(Panel, [{
    key: "renderAlpha",
    value: function renderAlpha(_ref) {
      var alpha = _ref.alpha,
          alphaClassName = _ref.alphaClassName,
          hex = _ref.hex,
          includeAlpha = _ref.includeAlpha,
          onChange = _ref.onChange;
      if (!includeAlpha) return null;
      return /*#__PURE__*/_jsx(AlphaRibbon, {
        alpha: alpha,
        className: alphaClassName,
        hex: hex,
        onChange: onChange
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          alpha = _this$props.alpha,
          alphaClassName = _this$props.alphaClassName,
          boardClassName = _this$props.boardClassName,
          colorsClassName = _this$props.colorsClassName,
          ribbonClassName = _this$props.ribbonClassName,
          favorites = _this$props.favorites,
          fieldsetSize = _this$props.fieldsetSize,
          hex = _this$props.hex,
          hexOnly = _this$props.hexOnly,
          hue = _this$props.hue,
          includeAlpha = _this$props.includeAlpha,
          mode = _this$props.mode,
          onChange = _this$props.onChange,
          __onFocus = _this$props.onFocus,
          __onBlur = _this$props.onBlur,
          rest = _objectWithoutProperties(_this$props, ["alpha", "alphaClassName", "boardClassName", "colorsClassName", "ribbonClassName", "favorites", "fieldsetSize", "hex", "hexOnly", "hue", "includeAlpha", "mode", "onChange", "onFocus", "onBlur"]);

      return /*#__PURE__*/_jsxs(PanelContainer, Object.assign({}, rest, {
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        tabIndex: "0",
        children: [/*#__PURE__*/_jsxs(PanelInner, {
          "data-test-id": "panel-inner",
          className: colorsClassName,
          children: [/*#__PURE__*/_jsx(Board, {
            className: boardClassName,
            hex: hex,
            hue: hue,
            onChange: onChange
          }), /*#__PURE__*/_jsxs(RibbonContainer, {
            "data-test-id": "ribbon-container",
            className: "m-top-2",
            children: [/*#__PURE__*/_jsxs(RibbonInner, {
              className: "m-right-2",
              children: [/*#__PURE__*/_jsx(Ribbon, {
                hue: hue,
                onChange: onChange,
                className: ribbonClassName,
                includeAlpha: includeAlpha
              }), this.renderAlpha({
                alpha: alpha,
                alphaClassName: alphaClassName,
                hex: hex,
                includeAlpha: includeAlpha,
                onChange: onChange
              })]
            }), /*#__PURE__*/_jsx(Preview, {
              alpha: alpha,
              hex: hex,
              onChange: onChange,
              onInputClick: this.onSystemColorPickerOpen
            })]
          }), /*#__PURE__*/_jsx(FavoritesAccordion, {
            onSelectColor: onChange,
            favorites: favorites
          })]
        }), /*#__PURE__*/_jsx(Params, {
          hexOnly: hexOnly,
          includeAlpha: includeAlpha,
          alpha: alpha,
          fieldsetSize: fieldsetSize,
          hex: hex,
          hue: hue,
          onChange: onChange,
          mode: mode
        })]
      }));
    }
  }]);

  return Panel;
}(Component);

export { Panel as default };
Panel.propTypes = {
  alpha: PropTypes.number,
  alphaClassName: PropTypes.string,
  boardClassName: PropTypes.string,
  className: PropTypes.string,
  colorsClassName: PropTypes.string,
  favorites: PropTypes.array,
  fieldsetSize: Params.propTypes.fieldsetSize,
  hex: PropTypes.string,
  hexOnly: PropTypes.bool,
  hue: PropTypes.number,
  includeAlpha: PropTypes.bool,
  mode: PropTypes.oneOf(['RGB', 'HSL', 'HSB']),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  ribbonClassName: PropTypes.string
};