'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { EDITABLE_CONTROLS_TRANSITION_TIMING } from 'HubStyleTokens/times';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Controllable from '../decorators/Controllable';
import AccordionTransition from '../transitions/AccordionTransition';
import { toPx } from '../utils/Styles';
var EDITABLE_CONTROLS_TRANSITION_TIMEOUT = parseInt(EDITABLE_CONTROLS_TRANSITION_TIMING, 10);
var DRAWER_PADDING_Y = 8;
var SlideoutTransitionWrapper = styled(AccordionTransition.defaultProps.Wrapper).withConfig({
  displayName: "UISlideoutDrawer__SlideoutTransitionWrapper",
  componentId: "sc-1dws1ep-0"
})(["height:auto;transition:", ";transform:", ";"], function (_ref) {
  var duration = _ref.duration,
      measuredHeight = _ref.measuredHeight,
      transitionActive = _ref.transitionActive,
      opening = _ref.opening;
  if (!transitionActive || measuredHeight == null) return 'none'; // On slide-down, fade in after a delay. On slide-up, fade out fast right away.

  var opacityDuration = opening ? duration * 0.7 : duration * 0.3;
  var opacityDelay = opening ? duration - opacityDuration : 0;
  return "opacity " + opacityDuration + "ms ease-out " + opacityDelay + "ms, transform " + duration + "ms";
}, function (_ref2) {
  var open = _ref2.open,
      measuredHeight = _ref2.measuredHeight,
      transitioning = _ref2.transitioning;
  return transitioning && (open ? "translateY(0)" : "translateY(" + toPx(-1 * (measuredHeight - DRAWER_PADDING_Y)) + ")");
});
var DrawerContent = styled.div.withConfig({
  displayName: "UISlideoutDrawer__DrawerContent",
  componentId: "sc-1dws1ep-1"
})(["padding-top:12px;padding-bottom:12px;"]);

var UISlideoutDrawer = function UISlideoutDrawer(props) {
  var children = props.children,
      className = props.className,
      Content = props.Content,
      __onOpenChange = props.onOpenChange,
      rest = _objectWithoutProperties(props, ["children", "className", "Content", "onOpenChange"]);

  return /*#__PURE__*/_jsx(AccordionTransition, Object.assign({}, rest, {
    className: classNames('uiEditableControlsStage', className),
    duration: EDITABLE_CONTROLS_TRANSITION_TIMEOUT,
    Wrapper: SlideoutTransitionWrapper,
    children: /*#__PURE__*/_jsx(Content, {
      className: "private-slideout-drawer__content",
      children: children
    })
  }));
};

UISlideoutDrawer.propTypes = {
  Content: PropTypes.elementType.isRequired,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.node
};
UISlideoutDrawer.defaultProps = {
  Content: DrawerContent,
  open: false
};
UISlideoutDrawer.displayName = 'UISlideoutDrawer';
export default Controllable(UISlideoutDrawer, ['open']);