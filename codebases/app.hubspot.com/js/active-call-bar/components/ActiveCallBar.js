'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { GYPSUM } from 'HubStyleTokens/colors';
import MuteButtonContainer from '../../mute/containers/MuteButtonContainer';
import RecordButtonContainer from '../../record/containers/RecordButtonContainer';
import KeypadDropdownContainer from '../../keypad/containers/KeypadDropdownContainer';
import ConnectedCallBarContainer from '../../audio-devices/containers/ConnectedCallBarContainer';
var Bar = styled.div.withConfig({
  displayName: "ActiveCallBar__Bar",
  componentId: "sc-1k33uy5-0"
})(["border-width:0 !important;background-color:", " !important;display:flex;justify-content:space-between;align-items:flex-end;"], GYPSUM);
var CallBarWrapper = styled.div.withConfig({
  displayName: "ActiveCallBar__CallBarWrapper",
  componentId: "sc-1k33uy5-1"
})(["display:flex;align-self:stretch;"]);
var DisabledWrapper = styled.div.withConfig({
  displayName: "ActiveCallBar__DisabledWrapper",
  componentId: "sc-1k33uy5-2"
})(["position:relative;&::after{content:'';", "}"], function (_ref) {
  var disabled = _ref.disabled;
  if (!disabled) return '';
  return "\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      background: " + GYPSUM + ";\n      opacity: 0.8;\n    ";
});

function ActionCallBar(_ref2) {
  var disabled = _ref2.disabled;
  return /*#__PURE__*/_jsx(DisabledWrapper, {
    disabled: disabled,
    className: "width-100",
    children: /*#__PURE__*/_jsxs(Bar, {
      className: "p-all-3 width-100",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "display-flex",
        children: [/*#__PURE__*/_jsx(RecordButtonContainer, {}), /*#__PURE__*/_jsx(MuteButtonContainer, {}), /*#__PURE__*/_jsx(KeypadDropdownContainer, {})]
      }), /*#__PURE__*/_jsx(CallBarWrapper, {
        children: /*#__PURE__*/_jsx(ConnectedCallBarContainer, {})
      })]
    })
  });
}

ActionCallBar.propTypes = {
  disabled: PropTypes.bool.isRequired
};
export default ActionCallBar;