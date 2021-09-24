'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TwoWayTransition from '../../transitions/TwoWayTransition';
import { ModalTransitionContextProvider } from '../../context/ModalTransitionContext';
import { PANEL_TRANSITION_TIMING } from 'HubStyleTokens/times';
import { JUPITER_LAYER } from 'HubStyleTokens/sizes';
var PanelTransitionWrapper = styled(function (_ref) {
  var __align = _ref.align,
      open = _ref.open,
      transitioning = _ref.transitioning,
      rest = _objectWithoutProperties(_ref, ["align", "open", "transitioning"]);

  return /*#__PURE__*/_jsx(TwoWayTransition.PlainWrapper, Object.assign({
    "data-component-name": "UIPanel",
    "data-open-complete": open && !transitioning
  }, rest));
}).withConfig({
  displayName: "PanelTransition__PanelTransitionWrapper",
  componentId: "wtknsa-0"
})(["transition-property:", ";transition-duration:", "ms;transform:", ";position:fixed;top:0;bottom:0;z-index:", ";", ";"], function (_ref2) {
  var transitionActive = _ref2.transitionActive;
  return transitionActive ? 'transform' : 'none';
}, function (_ref3) {
  var duration = _ref3.duration;
  return duration;
}, function (_ref4) {
  var align = _ref4.align,
      open = _ref4.open;
  if (open) return 'translateX(0%)';
  return align === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
}, JUPITER_LAYER, function (_ref5) {
  var align = _ref5.align;
  return align === 'right' ? 'right: 0;' : 'left: 0;';
});
export default function PanelTransition(props) {
  return /*#__PURE__*/_jsx(TwoWayTransition, Object.assign({}, props, {
    ContextProvider: ModalTransitionContextProvider,
    transitionOnMount: true
  }));
}
PanelTransition.propTypes = {
  align: PropTypes.oneOf(['left', 'right']).isRequired,
  duration: PropTypes.number.isRequired,
  Wrapper: PropTypes.elementType.isRequired
};
PanelTransition.defaultProps = {
  align: 'right',
  duration: parseInt(PANEL_TRANSITION_TIMING, 10),
  Wrapper: PanelTransitionWrapper
};
PanelTransition.displayName = 'PanelTransition';