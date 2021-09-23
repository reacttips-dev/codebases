'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { PANEL_NAVIGATOR_TRANSITION_TIMING } from 'HubStyleTokens/times';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useMounted from 'react-utils/hooks/useMounted';
import styled, { css } from 'styled-components';
import { percentToVW, toPx } from '../../utils/Styles';

var SlideCrossTransition = function SlideCrossTransition(_ref) {
  var children = _ref.children,
      duration = _ref.duration,
      reverse = _ref.reverse,
      Wrapper = _ref.Wrapper,
      rest = _objectWithoutProperties(_ref, ["children", "duration", "reverse", "Wrapper"]);

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      outgoingChild = _useState2[0],
      setOutgoingChild = _useState2[1];

  var _useState3 = useState(children),
      _useState4 = _slicedToArray(_useState3, 2),
      prevChild = _useState4[0],
      setPrevChild = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      transitioning = _useState6[0],
      setTransitioning = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      transitionActive = _useState8[0],
      setTransitionActive = _useState8[1];

  var mountedRef = useMounted();

  if (prevChild.key !== children.key) {
    setTransitioning(true);
    setOutgoingChild(prevChild);
    setPrevChild(children);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!mountedRef.current) return;
        setTransitionActive(true);
        setTimeout(function () {
          if (!mountedRef.current) return;
          setOutgoingChild(null);
          setTransitioning(false);
          setTransitionActive(false);
        }, duration);
      });
    });
  }

  return /*#__PURE__*/_jsxs(Wrapper, Object.assign({}, rest, {
    "data-transition-complete": !transitioning,
    distance: outgoingChild ? percentToVW(toPx(outgoingChild.props.width)) : null,
    duration: duration,
    reverse: reverse,
    style: {
      width: percentToVW(children.props.width)
    },
    transitioning: transitioning,
    transitionActive: transitionActive,
    children: [outgoingChild, children]
  }));
}; // For the first frame where the incoming content is rendered, we want that content to be on-screen
// to prevent glitches if it contains any controls with autofocus (#8454). The trick here is to hide
// the incoming content under the old content. It's on-screen as far as the browser is concerned!


var onscreenRenderMixin = css(["& >:last-child{position:absolute !important;right:0 !important;z-index:-1;}"]);
var PanelNavigatorTransitionWrapper = styled.div.withConfig({
  displayName: "PanelNavigatorTransition__PanelNavigatorTransitionWrapper",
  componentId: "sc-9asblt-0"
})(["position:relative;display:flex;flex-direction:", ";height:100%;transform:translateX( ", " );transition-property:", ";transition-duration:", "ms;transition-timing-function:cubic-bezier(0.16,0.84,0.44,1);", ";"], function (_ref2) {
  var reverse = _ref2.reverse;
  return reverse ? 'row-reverse' : 'row';
}, function (_ref3) {
  var distance = _ref3.distance,
      reverse = _ref3.reverse,
      transitioning = _ref3.transitioning,
      transitionActive = _ref3.transitionActive;

  if (transitioning) {
    if (reverse) {
      return transitionActive ? "" + distance : '0';
    }

    return transitionActive ? "-" + distance : '0';
  }

  return '0';
}, function (_ref4) {
  var transitionActive = _ref4.transitionActive;
  return transitionActive ? 'transform, width' : 'width';
}, function (_ref5) {
  var duration = _ref5.duration;
  return duration;
}, function (_ref6) {
  var transitioning = _ref6.transitioning,
      transitionActive = _ref6.transitionActive;
  return transitioning && !transitionActive && onscreenRenderMixin;
});
export default function PanelNavigatorTransition(props) {
  return /*#__PURE__*/_jsx(SlideCrossTransition, Object.assign({}, props));
}
PanelNavigatorTransition.propTypes = {
  align: PropTypes.oneOf(['left', 'right']).isRequired,
  duration: PropTypes.number.isRequired,
  Wrapper: PropTypes.elementType.isRequired
};
PanelNavigatorTransition.defaultProps = {
  align: 'right',
  duration: parseInt(PANEL_NAVIGATOR_TRANSITION_TIMING, 10),
  Wrapper: PanelNavigatorTransitionWrapper
};
PanelNavigatorTransition.displayName = 'PanelNavigatorTransition';