'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
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
import UIInputStaticLabel from 'UIComponents/input/UIInputStaticLabel';
import UITextInput from 'UIComponents/input/UITextInput';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UIFieldset from 'UIComponents/form/UIFieldset';
import colr from './vendor/colr';
var modesMap = ['RGB', 'HSB', 'HSL'];
var ParamContainer = styled(UIFieldset).withConfig({
  displayName: "Params__ParamContainer",
  componentId: "wezhhb-0"
})(["margin-left:8px;width:115px;"]);
var ParamInputLabel = styled(function (props) {
  return /*#__PURE__*/_jsx(UIInputStaticLabel, Object.assign({
    "data-test-id": "colorpicker-param-input-label",
    labelWrapperClassName: "input-label-wrapper"
  }, props));
}).withConfig({
  displayName: "Params__ParamInputLabel",
  componentId: "wezhhb-1"
})(["display:block;&:not(:last-child){margin-bottom:8px;}& .input-label-wrapper{padding-left:10px;width:22px;}"]);

var Params = /*#__PURE__*/function (_Component) {
  _inherits(Params, _Component);

  function Params(props) {
    var _this;

    _classCallCheck(this, Params);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Params).call(this, props));

    _this.onHexHandler = function (evt) {
      var inputValue = evt.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 6);

      _this.setState({
        inputValue: inputValue
      });

      if (inputValue.length < 6) return;

      try {
        var color = colr.fromHex(inputValue);

        _this.props.onChange({
          hex: color.toHex()
        });
      } catch (e) {
        /* eslint no-empty:0 */
      }
    };

    _this.onAlphaHandler = function (evt) {
      var alpha = parseInt(evt.target.value, 10);

      if (isNaN(alpha)) {
        alpha = 0;
      }

      alpha = Math.max(0, alpha);
      alpha = Math.min(alpha, 100);

      _this.props.onChange({
        alpha: alpha
      });
    };

    _this.onColorChannelChange = function (index, evt) {
      var value = _this.getChannelInRange(evt.target.value, index);

      var colorChannel = _this.getColorChannel();

      colorChannel[index] = value;

      var _this$getColorByChann = _this.getColorByChannel(colorChannel),
          hex = _this$getColorByChann.hex,
          hue = _this$getColorByChann.hue;

      _this.props.onChange({
        hex: hex,
        hue: hue
      });
    };

    _this.getChannelInRange = function (value, index) {
      var channelMap = {
        RGB: [[0, 255], [0, 255], [0, 255]],
        HSB: [[0, 360], [0, 100], [0, 100]],
        HSL: [[0, 360], [0, 100], [0, 100]]
      };
      var mode = _this.props.mode;
      var range = channelMap[mode][index];
      var result = parseInt(value, 10);

      if (isNaN(result)) {
        result = 0;
      }

      result = Math.max(range[0], result);
      result = Math.min(result, range[1]);
      return result;
    };

    _this.getColorByChannel = function (colorChannel) {
      var mode = _this.props.mode;
      var hex;
      var hue;

      switch (mode) {
        case 'RGB':
          hex = colr.fromRgbArray(colorChannel).toHex();
          break;

        case 'HSB':
          hex = colr.fromHsvArray(colorChannel).toHex();
          hue = colorChannel[0];
          break;

        case 'HSL':
          hex = colr.fromHslArray(colorChannel).toHex();
          hue = colorChannel[0];
          break;

        default:
          hex = colr.fromRgbArray(colorChannel).toHex();
      }

      return {
        hex: hex,
        hue: hue
      };
    };

    _this.getColorChannel = function () {
      var _this$props = _this.props,
          hex = _this$props.hex,
          hue = _this$props.hue,
          mode = _this$props.mode;
      var color = colr.fromHex(hex);
      var result;

      switch (mode) {
        case 'RGB':
          result = color.toRgbArray();
          break;

        case 'HSB':
          result = [hue].concat(_toConsumableArray(color.toHsvArray().slice(1)));
          break;

        case 'HSL':
          result = [hue].concat(_toConsumableArray(color.toHslArray().slice(1)));
          break;

        default:
          result = color.toRgbArray();
      }

      return result;
    };

    _this.state = {
      inputValue: props.hex.replace('#', '')
    };
    return _this;
  }

  _createClass(Params, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.hex !== nextProps.hex) {
        this.setState({
          inputValue: nextProps.hex.replace('#', '')
        });
      }
    }
  }, {
    key: "renderRgbaInput",
    value: function renderRgbaInput(colorChannelIndex) {
      var colorChannel = this.getColorChannel();
      var keyName = this.props.mode[colorChannelIndex];
      return /*#__PURE__*/_jsx(ParamInputLabel, {
        text: keyName,
        className: "private-react-colorpicker--param-input",
        children: /*#__PURE__*/_jsx(UINumberInput, {
          maxLength: "A",
          value: colorChannel[colorChannelIndex],
          onChange: this.onColorChannelChange.bind(null, colorChannelIndex)
        })
      }, keyName);
    }
  }, {
    key: "renderAlphaInput",
    value: function renderAlphaInput() {
      return /*#__PURE__*/_jsx(ParamInputLabel, {
        text: "A",
        className: "private-react-colorpicker--param-input",
        children: /*#__PURE__*/_jsx(UINumberInput, {
          value: this.props.alpha,
          onChange: this.onAlphaHandler
        })
      }, "A");
    }
  }, {
    key: "renderRgba",
    value: function renderRgba() {
      var _this$props2 = this.props,
          hexOnly = _this$props2.hexOnly,
          includeAlpha = _this$props2.includeAlpha;
      var inputs = [];

      if (!hexOnly) {
        inputs = inputs.concat([this.renderRgbaInput(0), this.renderRgbaInput(1), this.renderRgbaInput(2)]);
      }

      if (includeAlpha) inputs.push(this.renderAlphaInput());
      return inputs;
    }
  }, {
    key: "render",
    value: function render() {
      var fieldsetSize = this.props.fieldsetSize;
      return /*#__PURE__*/_jsxs(ParamContainer, {
        "data-test-id": "colorpicker-input-params",
        className: "private-react-colorpicker--params",
        _size: fieldsetSize,
        children: [this.renderRgba(), /*#__PURE__*/_jsx(ParamInputLabel, {
          text: "#",
          className: "private-react-colorpicker--param-input",
          children: /*#__PURE__*/_jsx(UITextInput, {
            maxLength: "7",
            onChange: this.onHexHandler,
            value: this.state.inputValue
          })
        })]
      });
    }
  }]);

  return Params;
}(Component);

export { Params as default };
Params.propTypes = {
  onChange: PropTypes.func,
  alpha: PropTypes.number,
  fieldsetSize: UIFieldset.propTypes._size,
  hex: PropTypes.string.isRequired,
  hue: PropTypes.number.isRequired,
  hexOnly: PropTypes.bool,
  includeAlpha: PropTypes.bool,
  mode: PropTypes.oneOf(modesMap)
};
Params.defaultProps = {
  mode: modesMap[0]
};