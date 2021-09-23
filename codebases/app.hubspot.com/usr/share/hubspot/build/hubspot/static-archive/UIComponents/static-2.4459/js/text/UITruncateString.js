'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';
import SyntheticEvent from '../core/SyntheticEvent';
import HiddenMeasure from '../layout/utils/HiddenMeasure';
import UITooltip from '../tooltip/UITooltip';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import { overflowsX } from '../utils/Overflows';
import { hidden } from '../utils/propTypes/decorators';
import { cancelSchedulerCallback, requestSchedulerCallback } from '../utils/Timers';
var MUTATION_OBSERVER_CONFIG = {
  childList: true,
  subtree: true,
  characterData: true
};
var UITruncateString = memoWithDisplayName('UITruncateString', function (props) {
  var children = props.children,
      className = props.className,
      fixedChildren = props.fixedChildren,
      innerClassName = props.innerClassName,
      matchContentWidth = props.matchContentWidth,
      maxWidth = props.maxWidth,
      onTruncatedChange = props.onTruncatedChange,
      placement = props.placement,
      reverse = props.reverse,
      tooltip = props.tooltip,
      useFlex = props.useFlex,
      open = props.open,
      onOpenChange = props.onOpenChange,
      defaultOpen = props.defaultOpen,
      rest = _objectWithoutProperties(props, ["children", "className", "fixedChildren", "innerClassName", "matchContentWidth", "maxWidth", "onTruncatedChange", "placement", "reverse", "tooltip", "useFlex", "open", "onOpenChange", "defaultOpen"]);

  var _useState = useState(undefined),
      _useState2 = _slicedToArray(_useState, 2),
      contentWidth = _useState2[0],
      setContentWidth = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      isTruncated = _useState4[0],
      setIsTruncated = _useState4[1];

  var wrapperRef = useRef(null);
  var measureRef = useRef(null);
  var tailRef = useRef(null); // Workaround for a truly bizarre Safari bug (#5825); still replicable as of Safari 13.0.5

  var keyRef = useRef(0);
  var hasMaxWidth = maxWidth != null;
  var hasMaxWidthRef = useRef(hasMaxWidth);

  if (hasMaxWidthRef.current !== hasMaxWidth) {
    keyRef.current += 1;
    hasMaxWidthRef.current = hasMaxWidth;
  }

  var key = keyRef.current;

  var updateTruncatedState = function updateTruncatedState() {
    var wrapperEl = wrapperRef.current;
    var tailEl = tailRef.current;

    if (matchContentWidth) {
      var measureEl = findDOMNode(measureRef.current);
      setContentWidth(measureEl.clientWidth + 1);
    }

    var newIsTruncated = reverse ? overflowsX(tailEl, wrapperEl) : overflowsX(wrapperEl);

    if (newIsTruncated !== isTruncated) {
      setIsTruncated(newIsTruncated);
      if (onTruncatedChange) onTruncatedChange(SyntheticEvent(newIsTruncated));
    }
  }; // Using a scheduler callback ensures that measurement is batched, preventing extra layout costs


  var delayTimeoutRef = useRef(null);

  var delayedUpdateTruncatedState = function delayedUpdateTruncatedState() {
    cancelSchedulerCallback(delayTimeoutRef.current);
    delayTimeoutRef.current = requestSchedulerCallback(updateTruncatedState);
  }; // Add mount/unmount behavior


  useEffect(function () {
    var resizeObserver = new ResizeObserver(delayedUpdateTruncatedState);
    resizeObserver.observe(wrapperRef.current);
    return function () {
      cancelSchedulerCallback(delayTimeoutRef.current);
      resizeObserver.disconnect();
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(function () {
    var mutationObserver;

    if (wrapperRef.current) {
      mutationObserver = new MutationObserver(function () {
        delayedUpdateTruncatedState();
      });
      mutationObserver.observe(wrapperRef.current, MUTATION_OBSERVER_CONFIG);
    }

    return function () {
      cancelSchedulerCallback(delayTimeoutRef.current);
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [matchContentWidth]); // eslint-disable-line react-hooks/exhaustive-deps
  // When maxWidth is set, we need to set maxWidth on both the outer container and the inner
  // wrapper. We also need to set width to "unset" (if we aren't using matchContentWidth) in
  // order to prevent the table column from collapsing to 0 due to the `width: 100%` rule.

  var computedMaxWidth = maxWidth && contentWidth ? Math.min(maxWidth, contentWidth) : maxWidth || contentWidth;
  var style = computedMaxWidth ? {
    maxWidth: computedMaxWidth,
    width: maxWidth ? 'unset' : undefined
  } : undefined;
  var tailClassName = 'private-truncated-string__reverse__tail' + (isTruncated ? " is-truncated" : "");
  var renderedContent = reverse ? /*#__PURE__*/_jsxs("span", {
    className: "private-truncated-string__reverse",
    children: [isTruncated && /*#__PURE__*/_jsx("span", {
      className: "private-truncated-string__reverse__ellipse",
      children: "\u2026"
    }), /*#__PURE__*/_jsx("span", {
      className: tailClassName,
      children: /*#__PURE__*/_jsx("span", {
        className: "private-truncated-string__reverse__content",
        ref: tailRef,
        children: children
      })
    })]
  }) : /*#__PURE__*/_jsx("span", {
    children: children
  });
  var computedTooltip = tooltip === true ? children : tooltip;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(UITooltip, {
      open: open,
      defaultOpen: defaultOpen,
      onOpenChange: onOpenChange,
      disabled: isTruncated === false,
      placement: placement,
      title: computedTooltip,
      children: /*#__PURE__*/_createElement("span", Object.assign({}, rest, {
        className: classNames('private-truncated-string', className, useFlex && 'private-truncated-string--is-flex', Boolean(isTruncated && computedTooltip) && 'private-truncated-string--has-tooltip'),
        "data-content": true,
        key: key,
        style: style
      }), /*#__PURE__*/_jsx("span", {
        className: classNames('private-truncated-string__inner', innerClassName),
        ref: wrapperRef,
        style: style,
        children: renderedContent
      }), fixedChildren)
    }), matchContentWidth && /*#__PURE__*/_jsx(HiddenMeasure, {
      ref: measureRef,
      children: children
    })]
  });
});
UITruncateString.propTypes = {
  children: PropTypes.node.isRequired,
  fixedChildren: PropTypes.node,
  innerClassName: PropTypes.string,
  matchContentWidth: PropTypes.bool.isRequired,
  maxWidth: PropTypes.number,
  onTruncatedChange: hidden(PropTypes.func),
  open: UITooltip.propTypes.open,
  defaultOpen: UITooltip.propTypes.defaultOpen,
  onOpenChange: UITooltip.propTypes.onOpenChange,
  placement: UITooltip.propTypes.placement,
  reverse: PropTypes.bool.isRequired,
  tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.node, PropTypes.string]).isRequired,
  useFlex: PropTypes.bool.isRequired
};
UITruncateString.defaultProps = {
  defaultOpen: UITooltip.defaultProps.defaultOpen,
  placement: UITooltip.defaultProps.placement,
  reverse: false,
  tooltip: true,
  matchContentWidth: false,
  useFlex: false
};
export default UITruncateString;