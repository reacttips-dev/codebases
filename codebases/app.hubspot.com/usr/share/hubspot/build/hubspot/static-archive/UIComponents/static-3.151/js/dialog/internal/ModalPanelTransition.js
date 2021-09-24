'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import { MODAL_BACKGROUND_TRANSITION_TIMING, SLIDEIN_MODAL_TRANSITION_TIMING } from 'HubStyleTokens/times';
import TwoWayTransition from '../../transitions/TwoWayTransition';
import { ModalTransitionContextProvider } from '../../context/ModalTransitionContext';
import { getOverlayTransition } from './overlayTransitionMixin';
import UIDialog from '../UIDialog';
var totalTransitionTime = parseInt(SLIDEIN_MODAL_TRANSITION_TIMING, 10);
var overlayTransitionTime = parseInt(MODAL_BACKGROUND_TRANSITION_TIMING, 10);
var dialogTransitionTime = totalTransitionTime - overlayTransitionTime;
var overlayTransition = getOverlayTransition(dialogTransitionTime);
var ModalPanelTransitionWrapper = styled(TwoWayTransition.PlainWrapper).withConfig({
  displayName: "ModalPanelTransition__ModalPanelTransitionWrapper",
  componentId: "sc-1eth3l0-0"
})(["", "{transition-property:", ";transition-delay:", "ms;transition-duration:", "ms;transform:", ";}", ";"], UIDialog.Selector, function (_ref) {
  var transitionActive = _ref.transitionActive;
  return transitionActive ? 'transform' : 'none';
}, overlayTransitionTime, dialogTransitionTime, function (_ref2) {
  var open = _ref2.open,
      transitioning = _ref2.transitioning;
  return transitioning && "translateX(" + (open ? '0' : '100') + "%)";
}, overlayTransition);

var ModalPanelTransition = function ModalPanelTransition(props) {
  return /*#__PURE__*/_jsx(TwoWayTransition, Object.assign({}, props, {
    ContextProvider: ModalTransitionContextProvider,
    duration: totalTransitionTime,
    transitionOnMount: true,
    Wrapper: ModalPanelTransitionWrapper
  }));
};

ModalPanelTransition.displayName = 'ModalPanelTransition';
export default ModalPanelTransition;