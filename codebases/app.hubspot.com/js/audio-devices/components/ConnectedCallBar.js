'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { memo } from 'react';
import styled from 'styled-components';
import { GYPSUM, BATTLESHIP } from 'HubStyleTokens/colors';
import NetworkQualityContainer from 'calling-communicator-ui/network-quality/containers/NetworkQualityContainer';
import AudioDevicePopoverContainer from 'calling-communicator-ui/audio-devices/containers/AudioDevicePopoverContainer';
import { CALL_FROM_PHONE, CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
var Bar = styled.div.withConfig({
  displayName: "ConnectedCallBar__Bar",
  componentId: "sc-13kxsw0-0"
})(["border-width:0 !important;background-color:", " !important;display:flex;align-items:flex-end;"], GYPSUM);
var VerticalBar = styled.span.withConfig({
  displayName: "ConnectedCallBar__VerticalBar",
  componentId: "sc-13kxsw0-1"
})(["display:inline-block;font-weight:600;border-width:0 0 0 1px;border-style:solid;border-color:", ";height:25px;align-self:baseline;margin-top:5px;"], BATTLESHIP);

function ConnectedCallBar(_ref) {
  var selectedCallMethod = _ref.selectedCallMethod;

  if (selectedCallMethod === CALL_FROM_PHONE) {
    return null;
  }

  return /*#__PURE__*/_jsxs(Bar, {
    className: "p-left-5 width-100",
    children: [/*#__PURE__*/_jsx(VerticalBar, {
      className: "p-left-3 m-left-3"
    }), /*#__PURE__*/_jsx(AudioDevicePopoverContainer, {}), /*#__PURE__*/_jsx(VerticalBar, {
      className: "p-left-3 m-left-3"
    }), /*#__PURE__*/_jsx(NetworkQualityContainer, {}), /*#__PURE__*/_jsx(VerticalBar, {
      className: "m-left-3"
    })]
  });
}

ConnectedCallBar.propTypes = {
  selectedCallMethod: PropTypes.oneOf([CALL_FROM_PHONE, CALL_FROM_BROWSER]).isRequired
};
export default /*#__PURE__*/memo(ConnectedCallBar);