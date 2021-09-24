'use es6';

import { css } from 'styled-components';
import { MODAL_BACKGROUND_TRANSITION_TIMING } from 'HubStyleTokens/times';
export var getOverlayTransition = function getOverlayTransition(dialogTransitionTime) {
  return css([".private-modal-dialog--overlay{transition-property:", ";transition-delay:", "ms;transition-duration:", ";background-color:", ";}"], function (_ref) {
    var transitioning = _ref.transitioning;
    return transitioning ? 'background-color' : 'none';
  }, function (_ref2) {
    var open = _ref2.open;
    return open ? 0 : dialogTransitionTime;
  }, MODAL_BACKGROUND_TRANSITION_TIMING, function (_ref3) {
    var open = _ref3.open;
    return "rgba(45, 62, 80, " + (open ? '0.79' : '0') + ")";
  });
};