'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import { MODAL_BACKGROUND_TRANSITION_TIMING, DEFAULT_MODAL_TRANSITION_TIMING } from 'HubStyleTokens/times';
import TwoWayTransition from '../../transitions/TwoWayTransition';
import { ModalTransitionContextProvider } from '../../context/ModalTransitionContext';
import { getOverlayTransition } from './overlayTransitionMixin';
import UIDialog from '../UIDialog';
var totalTransitionTime = parseInt(DEFAULT_MODAL_TRANSITION_TIMING, 10);
var overlayTransitionTime = parseInt(MODAL_BACKGROUND_TRANSITION_TIMING, 10);
var dialogTransitionTime = totalTransitionTime - overlayTransitionTime;
var overlayTransition = getOverlayTransition(dialogTransitionTime);
var ModalTransitionWrapper = styled(TwoWayTransition.PlainWrapper).withConfig({
  displayName: "ModalTransition__ModalTransitionWrapper",
  componentId: "sc-3bs0b2-0"
})(["", "{transition-property:", ";transition-delay:", "ms;transition-duration:", "ms;opacity:", ";transform:", ";}", ";"], UIDialog.Selector, function (_ref) {
  var transitionActive = _ref.transitionActive;
  return transitionActive ? 'opacity, transform' : 'none';
}, overlayTransitionTime, dialogTransitionTime, function (_ref2) {
  var open = _ref2.open;
  return open ? '1' : '0';
}, function (_ref3) {
  var open = _ref3.open;
  return "scale(" + (open ? '1' : '0.9') + ")";
}, overlayTransition);

var ModalTransition = function ModalTransition(props) {
  return /*#__PURE__*/_jsx(TwoWayTransition, Object.assign({}, props, {
    ContextProvider: ModalTransitionContextProvider,
    duration: totalTransitionTime,
    transitionOnMount: true,
    Wrapper: ModalTransitionWrapper
  }));
};

ModalTransition.displayName = 'ModalTransition';
export default ModalTransition;