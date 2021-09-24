'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';
import useMounted from 'react-utils/hooks/useMounted';
import usePrevious from 'react-utils/hooks/usePrevious';
import { JUPITER_LAYER } from 'HubStyleTokens/sizes';
import { ModalTransitionContext } from '../context/ModalTransitionContext';
import { isClickWithinContainer } from '../core/EventHandlers';
import SyntheticEvent from '../core/SyntheticEvent';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import deprecated from '../utils/propTypes/deprecated';
import domElementPropType from '../utils/propTypes/domElement';
import refObject from '../utils/propTypes/refObject';
import { getDefaultNode } from '../utils/RootNode';
import ChildrenWrapper from '../utils/ChildrenWrapper';
import UIPopoverFloaty from './internal/UIPopoverFloaty';
import { PLACEMENTS } from './PlacementConstants';
import UIPopoverArrow from './internal/UIPopoverArrow';
import UIPopoverContent from './internal/UIPopoverContent';
import { autoPlacementPropType, pinToConstraintPropType } from './utils/propTypes';
import { USE_CLASSES } from './utils/Use';

var getArrowSize = function getArrowSize(arrowSize, use) {
  if (arrowSize != null) return arrowSize;
  if (use === 'tooltip' || use === 'tooltip-danger') return 'small';
  return 'medium';
};

var UIPopover = memoWithDisplayName('UIPopover', function (props) {
  var _bodyElement = props._bodyElement,
      _distanceAdjustment = props._distanceAdjustment,
      _insetAdjustment = props._insetAdjustment,
      animateOnMount = props.animateOnMount,
      animateOnToggle = props.animateOnToggle,
      arrowSize = props.arrowSize,
      autoPlacement = props.autoPlacement,
      children = props.children,
      closeOnOutsideClick = props.closeOnOutsideClick,
      closeOnTargetLeave = props.closeOnTargetLeave,
      onChangePlacement = props.onChangePlacement,
      onCloseComplete = props.onCloseComplete,
      onFocusLeave = props.onFocusLeave,
      onOpenChange = props.onOpenChange,
      open = props.open,
      openOnTargetEnter = props.openOnTargetEnter,
      pinToConstraint = props.pinToConstraint,
      pinToOutOfBoundsTarget = props.pinToOutOfBoundsTarget,
      placement = props.placement,
      popoverRef = props.popoverRef,
      shouldCloseOnClick = props.shouldCloseOnClick,
      target = props.target,
      use = props.use,
      zIndex = props.zIndex,
      rest = _objectWithoutProperties(props, ["_bodyElement", "_distanceAdjustment", "_insetAdjustment", "animateOnMount", "animateOnToggle", "arrowSize", "autoPlacement", "children", "closeOnOutsideClick", "closeOnTargetLeave", "onChangePlacement", "onCloseComplete", "onFocusLeave", "onOpenChange", "open", "openOnTargetEnter", "pinToConstraint", "pinToOutOfBoundsTarget", "placement", "popoverRef", "shouldCloseOnClick", "target", "use", "zIndex"]);
  /** A ref to the wrapper around `children` */


  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      childrenWrapperRef = _useState2[0],
      setChildrenWrapperRef = _useState2[1];
  /** The DOM element the floaty is attached to (`target` if given, `children` otherwise) */


  var targetElement = target || findDOMNode(childrenWrapperRef);

  var _useContext = useContext(ModalTransitionContext),
      inModalTransition = _useContext.transitioning; // If `closeComplete` is `false`, we're in a close transition


  var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      closeComplete = _useState4[0],
      setCloseComplete = _useState4[1];
  /** `contentOpen` triggers open/close transitions */


  var contentOpen = open && !inModalTransition && !!targetElement;
  /** `tetherOpen` determines whether the popover is in the DOM */

  var tetherOpen = contentOpen || !closeComplete; // If a close transition is starting, update the closeComplete state.

  var prevContentOpen = usePrevious(contentOpen);

  if (prevContentOpen && !contentOpen && closeComplete) {
    setCloseComplete(false);
  }
  /** Ref to the `UIPopoverContent` instance */


  var contentRef = useRef();
  /** The DOM node that the popup content will render in (defaults to `document.body`) */

  var rootNode = _bodyElement || getDefaultNode();

  var prevRootNode = usePrevious(rootNode);
  /** Ref to the `key` used for the popup, which changes when we need a full reset */

  var popupKeyRef = useRef(0); // Increment the key if the `rootNode` has changed

  if (prevRootNode && prevRootNode !== rootNode) {
    popupKeyRef.current += 1;
  } // Track whether we're mounted


  var mountedRef = useMounted();
  var isMounted = mountedRef.current; // Track the IntersectionObserver state for openOnTargetEnter

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      openOnEnterIntersection = _useState6[0],
      setOpenOnEnterIntersection = _useState6[1]; // Workaround for react-dnd bug: https://github.com/react-dnd/react-dnd/issues/1146


  var _useState7 = useState(0),
      _useState8 = _slicedToArray(_useState7, 2),
      __internalUpdateCounter = _useState8[0],
      setForceInternalUpdateCounter = _useState8[1];

  useEffect(function () {
    if (targetElement != null || childrenWrapperRef == null) return undefined;
    var timer = requestAnimationFrame(function () {
      var newTargetElement = findDOMNode(childrenWrapperRef);

      if (targetElement !== newTargetElement) {
        if (window.newrelic) {
          window.newrelic.addPageAction('tetherless-dnd-internal-rerender', {
            newTargetTagName: newTargetElement && newTargetElement.tagName || 'empty'
          });
        }

        setForceInternalUpdateCounter(function (i) {
          return i < 10 ? i + 1 : i;
        });
      }
    });
    return function () {
      cancelAnimationFrame(timer);
    };
  }, [target, childrenWrapperRef, targetElement]);
  var shouldAnimateRef = useRef(open ? animateOnMount : animateOnToggle);
  useEffect(function () {
    if (prevContentOpen != null) {
      shouldAnimateRef.current = animateOnToggle;
    }
  }, [prevContentOpen, animateOnToggle]); // On open, bind event listeners that can trigger close

  useEffect(function () {
    if (contentOpen && onOpenChange) {
      var handleWindowClick = function handleWindowClick(evt) {
        // If `shouldCloseOnClick` is provided and returns a non-null value, defer to it
        if (shouldCloseOnClick) {
          var shouldClose = shouldCloseOnClick(evt);

          if (shouldClose != null) {
            if (shouldClose) onOpenChange(SyntheticEvent(false));
            return;
          }
        } // Otherwise, use our standard algorithm for detecting "outside clicks"


        var clickTarget = evt.target;
        var contentEl = findDOMNode(contentRef.current); // Ignore the click if it's within our Tether target

        if (targetElement == null || targetElement.contains(clickTarget)) return; // Ignore the click if it's within our popover container

        if (contentEl && isClickWithinContainer(evt, contentEl)) return; // Otherwise, trigger close

        onOpenChange(SyntheticEvent(false));
      };

      var bindClickHandlerFrame;

      if (closeOnOutsideClick) {
        bindClickHandlerFrame = requestAnimationFrame(function () {
          // Wait a tick to prevent the same click that triggered open from triggering close
          addEventListener('click', handleWindowClick);
        });
      } // When closeOnTargetLeave is enabled, we use an IntersectionObserver to close the popover if
      // its target leaves the screen due to scrolling (#3856).


      var intersectionObserver;

      if (closeOnTargetLeave && targetElement) {
        var _window = window,
            IntersectionObserver = _window.IntersectionObserver;
        intersectionObserver = new IntersectionObserver(function (entries) {
          var isIntersecting = entries[0].isIntersecting;

          if (!isIntersecting) {
            onOpenChange(SyntheticEvent(false));
          }
        });
        intersectionObserver.observe(targetElement);
      }

      return function () {
        cancelAnimationFrame(bindClickHandlerFrame);
        removeEventListener('click', handleWindowClick);

        if (intersectionObserver) {
          intersectionObserver.disconnect();
        }
      };
    }

    return undefined;
  },
  /* eslint-disable react-hooks/exhaustive-deps */
  [closeOnOutsideClick, closeOnTargetLeave, contentOpen, shouldCloseOnClick, targetElement]
  /* eslint-enable react-hooks/exhaustive-deps */
  );
  useEffect(function () {
    if (openOnTargetEnter && onOpenChange && targetElement) {
      // When openOnTargetEnter is enabled, we use an IntersectionObserver to open the popover if
      // its target is scrolled into view.
      var _window2 = window,
          IntersectionObserver = _window2.IntersectionObserver;
      var intersectionObserver = new IntersectionObserver(function (entries) {
        var isIntersecting = entries[0].isIntersecting;

        if (isIntersecting && !openOnEnterIntersection && !contentOpen) {
          onOpenChange(SyntheticEvent(true));
        }

        setOpenOnEnterIntersection(isIntersecting);
      });
      intersectionObserver.observe(targetElement);
      return function () {
        if (intersectionObserver) {
          intersectionObserver.disconnect();
        }
      };
    }

    return undefined;
  }, [contentOpen, onOpenChange, openOnEnterIntersection, openOnTargetEnter, targetElement]);

  var handlePlacementChange = function handlePlacementChange(evt) {
    if (onChangePlacement) onChangePlacement({
      newPlacement: evt.target.value
    });
  };

  var handleCloseComplete = function handleCloseComplete() {
    if (onCloseComplete) onCloseComplete();
    if (isMounted) setCloseComplete(true);
  };

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [children && /*#__PURE__*/_jsx(ChildrenWrapper, {
      ref: setChildrenWrapperRef,
      children: children
    }), tetherOpen && function () {
      var computedArrowSize = getArrowSize(arrowSize, use);
      var computedArrowParams = UIPopoverArrow.ARROW_SIZES[computedArrowSize];
      return /*#__PURE__*/_jsx(UIPopoverFloaty, {
        arrowWidth: computedArrowParams.width,
        autoPlacement: autoPlacement,
        distance: computedArrowParams.distance + _distanceAdjustment,
        inset: _insetAdjustment,
        onFocusLeave: onFocusLeave,
        onPlacementChange: handlePlacementChange,
        pinToConstraint: pinToConstraint,
        pinToOutOfBoundsTarget: pinToOutOfBoundsTarget,
        placement: placement,
        ref: popoverRef,
        rootNode: rootNode,
        targetElement: targetElement,
        zIndex: zIndex,
        content: /*#__PURE__*/_jsx(UIPopoverContent, Object.assign({}, rest, {
          animate: shouldAnimateRef.current != null ? shouldAnimateRef.current : computedArrowSize !== 'none',
          arrowSize: computedArrowSize,
          "data-component-name": "UIPopover",
          onCloseComplete: handleCloseComplete,
          open: contentOpen,
          ref: contentRef,
          use: use,
          onOpenChange: onOpenChange
        }))
      }, popupKeyRef.current);
    }()]
  });
});
UIPopover.propTypes = {
  _distanceAdjustment: PropTypes.number,
  _insetAdjustment: PropTypes.number,
  _bodyElement: domElementPropType,
  addTargetClasses: deprecated(PropTypes.bool, {
    message: 'UIPopover: setting `addTargetClasses` is no longer necessary and the prop has been removed.',
    key: 'addTargetClasses'
  }),
  animateOnMount: PropTypes.bool.isRequired,
  animateOnToggle: PropTypes.bool,
  arrowColor: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.shape({
    header: PropTypes.node,
    body: PropTypes.node,
    footer: PropTypes.node
  })]),
  Content: PropTypes.elementType,
  arrowSize: PropTypes.oneOf(Object.keys(UIPopoverArrow.ARROW_SIZES)),
  autoPlacement: autoPlacementPropType,
  children: PropTypes.element,
  closeOnOutsideClick: PropTypes.bool.isRequired,
  closeOnTargetLeave: PropTypes.bool.isRequired,
  onChangePlacement: PropTypes.func,
  onCloseComplete: PropTypes.func,
  onCloseStart: PropTypes.func,
  onFocusLeave: PropTypes.func,
  onOpenChange: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onOpenStart: PropTypes.func,
  open: PropTypes.bool.isRequired,
  openOnTargetEnter: PropTypes.bool.isRequired,
  pinToConstraint: pinToConstraintPropType,
  pinToOutOfBoundsTarget: PropTypes.bool,
  popoverRef: refObject,
  placement: PropTypes.oneOf(PLACEMENTS).isRequired,
  shouldCloseOnClick: PropTypes.func,
  showCloseButton: PropTypes.bool,
  target: domElementPropType,
  use: PropTypes.oneOf(Object.keys(USE_CLASSES)).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  zIndex: PropTypes.number.isRequired
};
UIPopover.defaultProps = {
  _distanceAdjustment: 0,
  _insetAdjustment: 0,
  animateOnMount: false,
  autoPlacement: true,
  closeOnOutsideClick: true,
  closeOnTargetLeave: false,
  open: false,
  openOnTargetEnter: false,
  pinToConstraint: ['top', 'bottom'],
  pinToOutOfBoundsTarget: false,
  placement: 'top',
  use: 'default',
  zIndex: parseInt(JUPITER_LAYER, 10)
};
var UIControlledPopover = UIPopover;
export default UIControlledPopover;