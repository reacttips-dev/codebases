'use es6';

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
import { GYPSUM, CALYPSO } from 'HubStyleTokens/colors';
import UIIcon from 'UIComponents/icon/UIIcon';
import CallClientContext from 'calling-client-interface/context/CallClientContext';
var VolumeBar = styled.span.withConfig({
  displayName: "VolumeBar",
  componentId: "sc-46mndj-0"
})(["width:100px;margin-right:12px;> span.filled{background-color:", ";padding:0 4px;border-width:1px;border-style:solid;border-color:", ";border-radius:4px;margin:0 2px;}> span.unfilled{background-color:", ";padding:0 4px;border-width:1px;border-style:solid;border-color:", ";border-radius:4px;margin:0 2px;}> span.muted{background-color:", ";padding:0 4px;border-width:1px;border-style:solid;border-color:", ";border-radius:4px;margin:0 2px;}"], CALYPSO, CALYPSO, GYPSUM, CALYPSO, GYPSUM, GYPSUM);
var MutedIcon = styled(UIIcon).withConfig({
  displayName: "VolumeBar__MutedIcon",
  componentId: "sc-46mndj-1"
})(["padding-top:2px;margin-right:8px;"]);
var NUMBER_OF_BARS = 8;

var VolumeBarComponent = /*#__PURE__*/function (_Component) {
  _inherits(VolumeBarComponent, _Component);

  function VolumeBarComponent() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, VolumeBarComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(VolumeBarComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {};

    _this.handleVolumeChange = function (inputVolume, outputVolume) {
      _this.setState({
        inputVolume: inputVolume,
        outputVolume: outputVolume
      });
    };

    return _this;
  }

  _createClass(VolumeBarComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.addEventListener('volume', this.handleVolumeChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.context.removeEventListener('volume', this.handleVolumeChange);
    }
  }, {
    key: "renderMutedMic",
    value: function renderMutedMic() {
      var bars = [];

      for (var i = 0; i < NUMBER_OF_BARS; i++) {
        bars.push( /*#__PURE__*/_jsx("span", {
          className: "muted"
        }, i));
      }

      return /*#__PURE__*/_jsxs("span", {
        className: "display-flex",
        children: [/*#__PURE__*/_jsx(MutedIcon, {
          name: "stopRecord",
          size: 18
        }), /*#__PURE__*/_jsx(VolumeBar, {
          children: bars
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          isMuted = _this$props.isMuted,
          deviceType = _this$props.deviceType;
      var volume = this.state[deviceType];

      if (isMuted && deviceType === 'inputVolume') {
        return this.renderMutedMic();
      }

      var bars = [];
      var level = NUMBER_OF_BARS * volume;

      for (var i = 0; i < NUMBER_OF_BARS; i++) {
        var className = level > i ? 'filled' : 'unfilled';
        bars.push( /*#__PURE__*/_jsx("span", {
          className: className
        }, i));
      }

      return /*#__PURE__*/_jsx(VolumeBar, {
        "data-selenium-test": "calling-widget-volume-bars-" + deviceType,
        children: bars
      });
    }
  }]);

  return VolumeBarComponent;
}(Component);

var propTypes = {
  deviceType: PropTypes.string.isRequired,
  isMuted: PropTypes.bool
};
VolumeBarComponent.propTypes = propTypes;
VolumeBarComponent.contextType = CallClientContext;
export default VolumeBarComponent;