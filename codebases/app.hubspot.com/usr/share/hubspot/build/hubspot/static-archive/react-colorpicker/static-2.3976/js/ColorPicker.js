'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import { OLAF } from 'HubStyleTokens/colors';
import colr from './vendor/colr';
import Panel from './Panel';

var computeHue = function computeHue(hex) {
  var hsv = colr.fromHex(hex).toHsvObject();
  if (hsv.s === 0) return null;
  return hsv.h;
};

var computeColorWithHue = function computeColorWithHue(hex, hue) {
  var hsv = colr.fromHex(hex).toHsvObject();

  if (hsv.s === 0) {
    return hex; // Hue has no effect on a color with no saturation.
  }

  return colr.fromHsvObject(Object.assign({}, hsv, {
    h: hue
  })).toHex();
};

var ColorPicker = /*#__PURE__*/function (_Component) {
  _inherits(ColorPicker, _Component);

  function ColorPicker(props) {
    var _this;

    _classCallCheck(this, ColorPicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ColorPicker).call(this, props));
    _this.state = {
      hue: colr.fromHex(props.color).toHsvObject().h
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ColorPicker, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(_ref) {
      var hex = _ref.color;
      var computedHue = computeHue(hex);
      if (computedHue != null) this.setState({
        hue: computedHue
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(_ref2) {
      var alpha = _ref2.alpha,
          _ref2$hex = _ref2.hex,
          hex = _ref2$hex === void 0 ? this.props.color : _ref2$hex,
          hue = _ref2.hue;
      var color = hex;

      if (hue != null) {
        var currentHue = computeHue(hex);

        if (currentHue == null) {
          this.setState({
            hue: hue
          });
        } else {
          color = computeColorWithHue(hex, hue);
        }
      }

      var changes = {};
      if (color != null) changes.color = color;
      if (alpha != null) changes.alpha = alpha;
      this.props.onChange(changes);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          alpha = _this$props.alpha,
          alphaClassName = _this$props.alphaClassName,
          boardClassName = _this$props.boardClassName,
          className = _this$props.className,
          hex = _this$props.color,
          colorsClassName = _this$props.colorsClassName,
          favorites = _this$props.favorites,
          fieldsetSize = _this$props.fieldsetSize,
          hexOnly = _this$props.hexOnly,
          includeAlpha = _this$props.includeAlpha,
          onBlur = _this$props.onBlur,
          onFocus = _this$props.onFocus,
          ribbonClassName = _this$props.ribbonClassName;
      var hue = this.state.hue;
      return /*#__PURE__*/_jsx(Panel, {
        "data-test-id": "colorpicker-advanced",
        alphaClassName: alphaClassName,
        boardClassName: boardClassName,
        colorsClassName: colorsClassName,
        className: classNames('private-react-colorpicker-popover--advanced', className),
        includeAlpha: includeAlpha,
        hexOnly: hexOnly,
        favorites: favorites,
        fieldsetSize: fieldsetSize,
        alpha: alpha,
        hex: hex,
        hue: hue,
        onChange: this.handleChange,
        onBlur: onBlur,
        onFocus: onFocus,
        mode: this.props.mode,
        ribbonClassName: ribbonClassName
      });
    }
  }]);

  return ColorPicker;
}(Component);

export { ColorPicker as default };
ColorPicker.propTypes = {
  alpha: PropTypes.number,
  alphaClassName: PropTypes.string,
  boardClassName: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string.isRequired,
  colorsClassName: PropTypes.string,
  favorites: PropTypes.array,
  fieldsetSize: Panel.propTypes.fieldsetSize,
  hexOnly: PropTypes.bool,
  includeAlpha: PropTypes.bool,
  mode: PropTypes.oneOf(['RGB', 'HSL', 'HSB']),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  ribbonClassName: PropTypes.string
};
ColorPicker.defaultProps = {
  color: OLAF,
  includeAlpha: false,
  hexOnly: true,
  favorites: [],
  alpha: 100,
  onChange: function onChange() {
    return null;
  },
  onBlur: function onBlur() {
    return null;
  },
  onFocus: function onFocus() {
    return null;
  },
  style: {}
};