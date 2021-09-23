'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Children, Fragment, cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';
import { isFragment } from 'react-is';
import devLogger from 'react-utils/devLogger';
import useMounted from 'react-utils/hooks/useMounted';
import useUniqueId from 'react-utils/hooks/useUniqueId';
import { memoizedSequence } from '../core/Functions';
import SyntheticEvent from '../core/SyntheticEvent';
import useControllable from '../hooks/useControllable';
import { isPageInKeyboardMode } from '../listeners/focusStylesListener';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import domElementPropType from '../utils/propTypes/domElement';
import { getDefaultNode } from '../utils/RootNode';
import { PLACEMENTS } from './PlacementConstants';
import UIControlledPopover from './UIControlledPopover';
import UITooltipContent from './UITooltipContent';
import UITooltipHeader from './UITooltipHeader';
import { isCursorOver, shouldTooltipClose } from './utils/Hover';
import ChildrenWrapper from '../utils/ChildrenWrapper';
var USE_CLASSES = {
  default: 'tooltip-default private-tooltip--default',
  danger: 'tooltip-danger private-tooltip--danger',
  longform: 'private-tooltip--longform'
};
/** An array containing every tooltip's handleOpenChange, to allow tooltips to close each other. */

var allTooltipOpeners = [];
/** An empty array to reuse when declaring hooks with no dependencies */

var NO_DEPENDENCIES = [];

var getPopoverUse = function getPopoverUse(use) {
  if (use === 'default') return 'tooltip';
  if (use === 'danger') return 'tooltip-danger';
  return use;
};

var renderTitle = function renderTitle(title, innerClassName, headingText, use) {
  return /*#__PURE__*/_jsxs(UITooltipContent, {
    className: classNames(innerClassName, 'tooltip-inner', use === 'longform' && 'has--vertical-spacing'),
    children: [headingText && /*#__PURE__*/_jsx(UITooltipHeader, {
      children: headingText
    }), title]
  });
};

var UITooltip = memoWithDisplayName('UITooltip', function (props) {
  var _bodyElement = props._bodyElement,
      children = props.children,
      className = props.className,
      Content = props.Content,
      defaultOpen = props.defaultOpen,
      delay = props.delay,
      delayOnHold = props.delayOnHold,
      disabled = props.disabled,
      headingText = props.headingText,
      innerClassName = props.innerClassName,
      maxWidth = props.maxWidth,
      onOpenChange = props.onOpenChange,
      open = props.open,
      style = props.style,
      target = props.target,
      title = props.title,
      use = props.use,
      rest = _objectWithoutProperties(props, ["_bodyElement", "children", "className", "Content", "defaultOpen", "delay", "delayOnHold", "disabled", "headingText", "innerClassName", "maxWidth", "onOpenChange", "open", "style", "target", "title", "use"]); // The element that the Tether is attached to


  var _useState = useState(target),
      _useState2 = _slicedToArray(_useState, 2),
      targetElement = _useState2[0],
      setTargetElement = _useState2[1];

  var _ref = _bodyElement || getDefaultNode(),
      ownerDocument = _ref.ownerDocument;

  var _useControllable = useControllable(open, defaultOpen, onOpenChange),
      _useControllable2 = _slicedToArray(_useControllable, 2),
      controllableOpen = _useControllable2[0],
      handleOpenChange = _useControllable2[1];

  var computedDisabled = disabled || Content == null && !title;
  var computedOpen = controllableOpen && !computedDisabled && !!targetElement;
  var hasOpenedRef = useRef(computedOpen);
  hasOpenedRef.current = hasOpenedRef.current || computedOpen;
  var hasOpened = hasOpenedRef.current;
  var tooltipId = useUniqueId('tooltip-');

  var triggerOpen = function triggerOpen() {
    handleOpenChange(SyntheticEvent(true));
  };
  /** A timeout that will trigger open after `delay` has elapsed */


  var delayTimeoutRef = useRef(null);
  /** A timeout that will trigger open after `delayOnHold` has elapsed */

  var delayOnHoldTimeoutRef = useRef(null);
  /** Cancel any pending timeouts */

  var clearHoverTimeouts = function clearHoverTimeouts() {
    clearTimeout(delayTimeoutRef.current);
    delayTimeoutRef.current = null;
    clearTimeout(delayOnHoldTimeoutRef.current);
    delayOnHoldTimeoutRef.current = null;
  };
  /** Ref to the target element (i.e. the child) */


  var childrenWrapperRef = useRef(null);
  /** Is the keyboard focus within the target or popover element? */

  var hasFocusRef = useRef(false);
  /** Is the mouse within (or near) the target or popover element? */

  var hasMouseRef = useRef(false);
  /** Have we been mounted yet? */

  var mountedRef = useMounted(); // Tasks to perform on mount/unmount

  useEffect(function () {
    allTooltipOpeners.push(handleOpenChange);
    return function () {
      allTooltipOpeners.splice(allTooltipOpeners.indexOf(handleOpenChange), 1);
      clearHoverTimeouts();
    };
  }, NO_DEPENDENCIES); // eslint-disable-line react-hooks/exhaustive-deps
  // Tasks to perform on open/close

  useEffect(function () {
    clearHoverTimeouts();

    if (computedOpen) {
      // Tell all other tooltips on the page to close
      allTooltipOpeners.forEach(function (tooltip) {
        if (tooltip === handleOpenChange) return;
        tooltip(SyntheticEvent(false));
      }); // Bind window-level events that can trigger close

      var maybeTriggerClose = function maybeTriggerClose() {
        if (computedOpen && !hasFocusRef.current && !hasMouseRef.current) {
          handleOpenChange(SyntheticEvent(false));
        }
      };

      var handleWindowMouseLeave = function handleWindowMouseLeave() {
        hasMouseRef.current = false;
        maybeTriggerClose();
        clearHoverTimeouts();
      };

      var handleBodyMouseMove = function handleBodyMouseMove(evt) {
        var targetEl = targetElement;
        var tooltipEl = ownerDocument.getElementById(tooltipId);
        if (!targetEl) return;
        var hadMousebefore = hasMouseRef.current;
        var targetArea = targetEl.getBoundingClientRect();
        hasMouseRef.current = tooltipEl ? !shouldTooltipClose(targetArea, tooltipEl.getBoundingClientRect(), evt) : isCursorOver(targetArea, evt);
        if (hadMousebefore) maybeTriggerClose();
      };

      var handleBodyFocus = function handleBodyFocus() {
        var targetEl = targetElement;
        var tooltipEl = ownerDocument.getElementById(tooltipId);
        if (!targetEl) return;
        var activeElement = ownerDocument.activeElement;
        hasFocusRef.current = isPageInKeyboardMode() && (targetEl.contains(activeElement) || tooltipEl && tooltipEl.contains(activeElement));
        maybeTriggerClose();
      };

      addEventListener('mouseleave', handleWindowMouseLeave);
      ownerDocument.addEventListener('mousemove', handleBodyMouseMove);
      ownerDocument.addEventListener('focus', handleBodyFocus, true);
      return function () {
        removeEventListener('mouseleave', handleWindowMouseLeave);
        ownerDocument.removeEventListener('mousemove', handleBodyMouseMove);
        ownerDocument.removeEventListener('focus', handleBodyFocus, true);
      };
    }

    return undefined;
  }, [computedOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Open on focus if the page is in "keyboard mode" (so, not on click) */

  var handleTargetFocus = useCallback(function () {
    if (isPageInKeyboardMode()) triggerOpen();
  }, [NO_DEPENDENCIES]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Open after a delay when the target element is hovered */

  var handleTargetMouseMove = useCallback(function () {
    clearTimeout(delayOnHoldTimeoutRef.current);
    delayOnHoldTimeoutRef.current = null;
    hasMouseRef.current = true; // Open after `delay` as long as the mouse doesn't leave the target

    if (!delayTimeoutRef.current) {
      delayTimeoutRef.current = setTimeout(triggerOpen, delay);
    } // Open after `delayOnHold` (sooner) if the mouse holds still


    delayOnHoldTimeoutRef.current = setTimeout(triggerOpen, delayOnHold);
  }, [delay, delayOnHold]); // eslint-disable-line react-hooks/exhaustive-deps

  var child = Children.only(children);

  if (process.env.NODE_ENV !== 'production') {
    if (isFragment(child)) {
      devLogger.warn({
        message: "UITooltip: child element cannot be a React.Fragment, and must support passing event handlers through to a DOM element.",
        key: 'UITooltip: fragment not supported'
      });
    }
  }

  var clonedChild;

  if (!computedDisabled) {
    var childDescribedBy = child.props['aria-describedby'];
    var childOnFocus = child.props.onFocus;
    var childOnMouseMove = child.props.onMouseMove;
    clonedChild = /*#__PURE__*/cloneElement(child, {
      'aria-describedby': computedOpen ? ((childDescribedBy || '') + " " + tooltipId).trim() : childDescribedBy,
      onFocus: computedOpen ? childOnFocus : memoizedSequence(handleTargetFocus, childOnFocus),
      onMouseMove: computedOpen ? childOnMouseMove : memoizedSequence(handleTargetMouseMove, childOnMouseMove),
      onMouseLeave: memoizedSequence(clearHoverTimeouts, child.props.onMouseLeave),
      tabIndex: 0 // #4949

    });
  }

  useEffect(function () {
    if (controllableOpen) {
      setTargetElement(target || findDOMNode(childrenWrapperRef.current));
    }
  });
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(ChildrenWrapper, {
      ref: childrenWrapperRef,
      children: clonedChild || child
    }), hasOpened && /*#__PURE__*/_jsx(UIControlledPopover, Object.assign({}, rest, {
      _bodyElement: _bodyElement,
      animateOnMount: mountedRef.current,
      arrowSize: use === 'longform' ? 'medium' : 'small',
      className: classNames("tooltip private-tooltip", className, USE_CLASSES[use]),
      closeOnTargetLeave: true,
      content: Content == null ? renderTitle(title, innerClassName, headingText, use) : null,
      Content: Content,
      id: tooltipId,
      open: computedOpen,
      onOpenChange: handleOpenChange // #8863
      ,
      style: Object.assign({}, style, {
        maxWidth: maxWidth
      }),
      target: targetElement,
      use: getPopoverUse(use)
    }))]
  });
});
UITooltip.propTypes = {
  _bodyElement: domElementPropType,
  autoPlacement: UIControlledPopover.propTypes.autoPlacement,
  children: PropTypes.node,
  Content: UIControlledPopover.propTypes.Content,
  defaultOpen: PropTypes.bool,
  delay: PropTypes.number.isRequired,
  delayOnHold: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  headingText: PropTypes.node,
  innerClassName: PropTypes.string,
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClose: PropTypes.func,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool,
  placement: PropTypes.oneOf(PLACEMENTS),
  target: UIControlledPopover.propTypes.target,
  title: PropTypes.node,
  use: PropTypes.oneOf(Object.keys(USE_CLASSES))
};
UITooltip.defaultProps = {
  defaultOpen: false,
  delay: 300,
  delayOnHold: 100,
  disabled: false,
  use: 'default'
};
export default UITooltip;