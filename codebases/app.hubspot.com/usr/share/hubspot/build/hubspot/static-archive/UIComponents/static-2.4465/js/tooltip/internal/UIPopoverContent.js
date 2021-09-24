'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { POPOVER_TRANSITION_TIMING } from 'HubStyleTokens/times';
import PropTypes from 'prop-types';
import { forwardRef, isValidElement, useState } from 'react';
import devLogger from 'react-utils/devLogger';
import styled, { css } from 'styled-components';
import * as PopoverContext from '../../context/PopoverContext';
import SyntheticEvent from '../../core/SyntheticEvent';
import TwoWayTransition from '../../transitions/TwoWayTransition';
import { PLACEMENTS } from '../PlacementConstants';
import UIPopoverArrow from './UIPopoverArrow';
import UIPopoverBody from '../UIPopoverBody';
import UIPopoverFooter from '../UIPopoverFooter';
import UIPopoverHeader from '../UIPopoverHeader';
import { USE_CLASSES } from '../utils/Use';

var isReactNode = function isReactNode(node) {
  return typeof node !== 'object' || /*#__PURE__*/isValidElement(node) || Array.isArray(node);
};

var transitionDuration = parseInt(POPOVER_TRANSITION_TIMING, 10);

var renderStructuredContent = function renderStructuredContent(content, onOpenChange, showCloseButton) {
  var header = content.header,
      body = content.body,
      footer = content.footer,
      step = content.step;
  return [header && /*#__PURE__*/_jsx(UIPopoverHeader, {
    showCloseButton: showCloseButton,
    onOpenChange: onOpenChange,
    children: header
  }, "header"), body && /*#__PURE__*/_jsx(UIPopoverBody, {
    children: body
  }, "body"), (footer || step) && /*#__PURE__*/_jsxs(UIPopoverFooter, {
    hasStructuredFooter: !!footer,
    hasStep: !!step,
    children: [step, footer]
  }, "footer")];
};

var transformOriginMixin = css(["", ";", ";"], ['top', 'bottom', 'left', 'right'].map(function (side) {
  return ".tether-element-attached-" + side + " & { transform-origin: " + side + " }";
}), ['top', 'bottom'].map(function (ySide) {
  return ['left', 'right'].map(function (xSide) {
    return ".tether-element-attached-" + ySide + ".tether-element-attached-" + xSide + " & { transform-origin: " + ySide + " " + xSide + " }";
  });
}));
var PopoverTransitionWrapper = styled(TwoWayTransition.PlainWrapper).withConfig({
  displayName: "UIPopoverContent__PopoverTransitionWrapper",
  componentId: "ljg0z9-0"
})(["transition-property:", ";transition-duration:", "ms;opacity:", ";transform:", ";", ";"], function (_ref) {
  var transitioning = _ref.transitioning;
  return transitioning ? 'opacity, transform' : 'none';
}, function (_ref2) {
  var duration = _ref2.duration;
  return duration;
}, function (_ref3) {
  var open = _ref3.open;
  return open ? '1' : '0';
}, function (_ref4) {
  var open = _ref4.open,
      transitioning = _ref4.transitioning;
  if (open && !transitioning) return 'none';
  /* IE bugfix: #5368 */

  return open ? 'scale(1)' : 'scale(.75)';
}, transformOriginMixin);
var UIPopoverContent = /*#__PURE__*/forwardRef(function (props, ref) {
  var animateOnMount = props.animateOnMount,
      animateOnToggle = props.animateOnToggle,
      arrowColor = props.arrowColor,
      arrowSize = props.arrowSize,
      className = props.className,
      content = props.content,
      Content = props.Content,
      renderContent = props.renderContent,
      onCloseComplete = props.onCloseComplete,
      _onCloseStart = props.onCloseStart,
      _onKeyDown = props.onKeyDown,
      _onOpenComplete = props.onOpenComplete,
      onOpenStart = props.onOpenStart,
      open = props.open,
      placement = props.placement,
      style = props.style,
      use = props.use,
      showCloseButton = props.showCloseButton,
      onOpenChange = props.onOpenChange,
      width = props.width,
      rest = _objectWithoutProperties(props, ["animateOnMount", "animateOnToggle", "arrowColor", "arrowSize", "className", "content", "Content", "renderContent", "onCloseComplete", "onCloseStart", "onKeyDown", "onOpenComplete", "onOpenStart", "open", "placement", "style", "use", "showCloseButton", "onOpenChange", "width"]);

  var _useState = useState(props.open && !props.animateOnMount),
      _useState2 = _slicedToArray(_useState, 2),
      openComplete = _useState2[0],
      setOpenComplete = _useState2[1];

  var computedArrowParams = UIPopoverArrow.ARROW_SIZES[arrowSize];
  var renderedContent = content;

  if (open) {
    if (Content) {
      renderedContent = /*#__PURE__*/_jsx(Content, {});
    } else if (renderContent) {
      renderedContent = renderContent();
    }
  }

  var computedOpen = open && !!renderedContent;

  if (process.env.NODE_ENV !== 'production') {
    if (showCloseButton && (isReactNode(renderedContent) || !renderedContent.header)) {
      devLogger.warn({
        message: "UIPopover: `showCloseButton={true}` requires you to provide the `content` prop as an object with a `header`.",
        key: "UIPopover: showCloseButton"
      });
    }
  }

  var renderedPopover = computedOpen && /*#__PURE__*/_jsx(PopoverContext.Provider, {
    value: {
      use: use
    },
    children: /*#__PURE__*/_jsxs("div", Object.assign({}, rest, {
      className: classNames(className, USE_CLASSES[use], 'private-popover uiPopover'),
      "data-open-complete": openComplete,
      onKeyDown: function onKeyDown(evt) {
        if (_onKeyDown) _onKeyDown(evt);
        if (evt.key === 'Escape') onOpenChange(SyntheticEvent(false));
      },
      style: width ? Object.assign({
        maxWidth: width,
        width: width
      }, style) : style,
      ref: ref,
      children: [/*#__PURE__*/_jsx(UIPopoverArrow, {
        color: arrowColor,
        inset: computedArrowParams.inset,
        placement: placement,
        width: computedArrowParams.width,
        popoverUse: use
      }, "arrow"), /*#__PURE__*/_jsx("div", {
        className: "private-popover__inner",
        children: isReactNode(renderedContent) ? renderedContent : renderStructuredContent(renderedContent, onOpenChange, showCloseButton)
      })]
    }))
  });

  return /*#__PURE__*/_jsx(TwoWayTransition, {
    onCloseComplete: onCloseComplete,
    onCloseStart: function onCloseStart() {
      setOpenComplete(false);
      if (_onCloseStart) _onCloseStart();
    },
    onOpenComplete: function onOpenComplete() {
      setOpenComplete(true);
      if (_onOpenComplete) _onOpenComplete();
    },
    onOpenStart: onOpenStart,
    transitionOnMount: animateOnMount,
    duration: animateOnToggle ? transitionDuration : 0,
    Wrapper: PopoverTransitionWrapper,
    children: renderedPopover
  });
});
UIPopoverContent.propTypes = {
  animateOnMount: PropTypes.bool.isRequired,
  animateOnToggle: PropTypes.bool,
  arrowColor: PropTypes.string,
  arrowSize: PropTypes.oneOf(Object.keys(UIPopoverArrow.ARROW_SIZES)).isRequired,
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.shape({
    header: PropTypes.node,
    body: PropTypes.node,
    footer: PropTypes.node
  })]),
  Content: PropTypes.elementType,
  renderContent: PropTypes.func,
  onCloseComplete: PropTypes.func,
  onCloseStart: PropTypes.func,
  onOpenChange: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onOpenStart: PropTypes.func,
  open: PropTypes.bool,
  placement: PropTypes.oneOf(PLACEMENTS).isRequired,
  showCloseButton: PropTypes.bool,
  use: PropTypes.oneOf(Object.keys(USE_CLASSES)),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
UIPopoverContent.defaultProps = {
  animateOnMount: false,
  open: false,
  placement: 'top',
  use: 'default'
};
UIPopoverContent.displayName = 'UIPopoverContent';
export default UIPopoverContent;