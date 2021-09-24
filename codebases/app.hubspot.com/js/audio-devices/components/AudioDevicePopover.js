'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import H5 from 'UIComponents/elements/headings/H5';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UISelect from 'UIComponents/input/UISelect';
import { GREAT_WHITE, EERIE } from 'HubStyleTokens/colors';
import VolumeBar from './VolumeBar';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import CallClientContext from 'calling-client-interface/context/CallClientContext';
var CustomDropdown = styled.span.withConfig({
  displayName: "AudioDevicePopover__CustomDropdown",
  componentId: "sc-1enrur8-0"
})(["cursor:pointer;"]);
var SectionWithTopBorder = styled.div.withConfig({
  displayName: "AudioDevicePopover__SectionWithTopBorder",
  componentId: "sc-1enrur8-1"
})(["border-top:1px solid ", ";"], GREAT_WHITE);
var propTypes = {
  availableInputDevices: PropTypes.object.isRequired,
  availableOutputDevices: PropTypes.object.isRequired,
  selectedInputDevice: PropTypes.string,
  selectedOutputDevice: PropTypes.string,
  isOutputDeviceSupported: PropTypes.bool.isRequired,
  isInputDeviceSupported: PropTypes.bool.isRequired,
  appIdentifier: PropTypes.string.isRequired
};

var AudioDevicePopover = /*#__PURE__*/function (_Component) {
  _inherits(AudioDevicePopover, _Component);

  function AudioDevicePopover(props) {
    var _this;

    _classCallCheck(this, AudioDevicePopover);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AudioDevicePopover).call(this, props));

    _this.handlePopoverToggle = function () {
      if (!_this.state.isPopoverOpen) {
        CommunicatorLogger.log('communicatorInteraction', {
          action: 'Open Audio Popover',
          activity: 'call',
          channel: 'outbound call',
          source: _this.props.appIdentifier
        });
      }

      _this.setState({
        isPopoverOpen: !_this.state.isPopoverOpen
      });
    };

    _this.handleInputDeviceChange = function (_ref) {
      var value = _ref.target.value;
      CommunicatorLogger.log('communicatorInteraction', {
        action: 'Change Microphone Source',
        activity: 'call',
        channel: 'outbound call',
        source: _this.props.appIdentifier
      });

      _this.context.setInputDevice(value);
    };

    _this.handleOutputDeviceChange = function (_ref2) {
      var value = _ref2.target.value;
      CommunicatorLogger.log('communicatorInteraction', {
        action: 'Change Speaker Source',
        activity: 'call',
        channel: 'outbound call',
        source: _this.props.appIdentifier
      });

      _this.context.setOutputDevice(value);
    };

    _this.state = {
      isPopoverOpen: false
    };
    return _this;
  }

  _createClass(AudioDevicePopover, [{
    key: "renderDeviceMenu",
    value: function renderDeviceMenu() {
      var inputDeviceOptions = [];
      var outputDeviceOptions = [];
      this.props.availableInputDevices.forEach(function (device) {
        inputDeviceOptions.push({
          text: device.label,
          value: device.deviceId
        });
      });
      this.props.availableOutputDevices.forEach(function (device) {
        outputDeviceOptions.push({
          text: device.label,
          value: device.deviceId
        });
      });
      return /*#__PURE__*/_jsxs("div", {
        className: "display-flex flex-column p-all-5",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "m-bottom-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "display-inline-flex justify-between width-100",
            children: [/*#__PURE__*/_jsx(H5, {
              className: "m-bottom-3",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "calling-communicator-ui.audioDevices.microphone"
              })
            }), /*#__PURE__*/_jsx(VolumeBar, {
              deviceType: 'inputVolume'
            })]
          }), /*#__PURE__*/_jsx(UITooltip, {
            title: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "calling-communicator-ui.activeCallBar.tooltips.inputDeviceNotSupported"
            }),
            placement: "bottom",
            disabled: this.props.isInputDeviceSupported,
            children: /*#__PURE__*/_jsx(UISelect, {
              disabled: !this.props.isInputDeviceSupported,
              className: "width-100 audio-device-smaller-text",
              searchable: false,
              onChange: this.handleInputDeviceChange,
              options: inputDeviceOptions,
              value: this.props.selectedInputDevice
            })
          })]
        }), /*#__PURE__*/_jsxs(SectionWithTopBorder, {
          className: "p-top-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "display-inline-flex justify-between width-100",
            children: [/*#__PURE__*/_jsx(H5, {
              className: "m-bottom-3",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "calling-communicator-ui.audioDevices.speakers"
              })
            }), /*#__PURE__*/_jsx(VolumeBar, {
              deviceType: 'outputVolume'
            })]
          }), /*#__PURE__*/_jsx(UITooltip, {
            title: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "calling-communicator-ui.activeCallBar.tooltips.outputDeviceNotSupported"
            }),
            placement: "bottom",
            disabled: this.props.isOutputDeviceSupported,
            children: /*#__PURE__*/_jsx(UISelect, {
              disabled: !this.props.isOutputDeviceSupported,
              className: "width-100 audio-device-smaller-text",
              searchable: false,
              onChange: this.handleOutputDeviceChange,
              options: outputDeviceOptions,
              value: this.props.selectedOutputDevice
            })
          })]
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UIPopover, {
        autoPlacement: (true, 'vert'),
        className: "p-all-0",
        closeOnOutsideClick: true,
        closeOnTargetLeave: true,
        content: this.renderDeviceMenu(),
        open: this.state.isPopoverOpen,
        onOpenChange: this.handlePopoverToggle,
        placement: "bottom left",
        width: 350,
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex-column align-center",
          children: [/*#__PURE__*/_jsxs(CustomDropdown, {
            onClick: this.handlePopoverToggle,
            "data-selenium-test": "calling-widget-audio-device-button",
            children: [/*#__PURE__*/_jsx(UIIcon, {
              name: "audioInputOutput",
              size: 24,
              style: {
                verticalAlign: 'bottom'
              }
            }), /*#__PURE__*/_jsx(UIIcon, {
              name: "downCarat",
              size: 10,
              className: "p-left-1",
              color: EERIE
            })]
          }), /*#__PURE__*/_jsx("small", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "calling-communicator-ui.activeCallBar.audioDevices"
            })
          })]
        })
      });
    }
  }]);

  return AudioDevicePopover;
}(Component);

AudioDevicePopover.propTypes = propTypes;
AudioDevicePopover.contextType = CallClientContext;
export default AudioDevicePopover;