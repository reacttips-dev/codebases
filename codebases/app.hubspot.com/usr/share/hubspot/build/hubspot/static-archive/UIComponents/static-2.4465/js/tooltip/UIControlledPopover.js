'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useContext, useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';
import useMounted from 'react-utils/hooks/useMounted';
import usePrevious from 'react-utils/hooks/usePrevious';
import { ModalTransitionContext } from '../context/ModalTransitionContext';
import { isClickWithinContainer } from '../core/EventHandlers';
import SyntheticEvent from '../core/SyntheticEvent';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import domElementPropType from '../utils/propTypes/domElement';
import refObject from '../utils/propTypes/refObject';
import { PLACEMENTS } from './PlacementConstants';
import UIAbstractPopup from './UIAbstractPopup';
import UIPopoverArrow from './internal/UIPopoverArrow';
import UIPopoverContent from './internal/UIPopoverContent';
import { computeNewPlacement } from './utils/Placement';
import { autoPlacementPropType, pinToConstraintPropType } from './utils/propTypes';

var getArrowSize = function getArrowSize(arrowSize, use) {
  if (arrowSize != null) return arrowSize;
  if (use === 'tooltip' || use === 'tooltip-danger') return 'small';
  return 'medium';
};

var getAnimateOnToggle = function getAnimateOnToggle(animateOnToggle, computedArrowSize) {
  return animateOnToggle != null ? animateOnToggle : computedArrowSize !== 'none';
};

var UIPopover = memoWithDisplayName('UIPopover', function (props) {
  var _bodyElement = props._bodyElement,
      _distanceAdjustment = props._distanceAdjustment,
      _insetAdjustment = props._insetAdjustment,
      addTargetClasses = props.addTargetClasses,
      animateOnMount = props.animateOnMount,
      animateOnToggle = props.animateOnToggle,
      arrowSize = props.arrowSize,
      autoPlacement = props.autoPlacement,
      children = props.children,
      className = props.className,
      closeOnOutsideClick = props.closeOnOutsideClick,
      closeOnTargetLeave = props.closeOnTargetLeave,
      onChangePlacement = props.onChangePlacement,
      onCloseComplete = props.onCloseComplete,
      onFocusLeave = props.onFocusLeave,
      onOpenChange = props.onOpenChange,
      open = props.open,
      pinToConstraint = props.pinToConstraint,
      pinToOutOfBoundsTarget = props.pinToOutOfBoundsTarget,
      placement = props.placement,
      popoverRef = props.popoverRef,
      shouldCloseOnClick = props.shouldCloseOnClick,
      target = props.target,
      targetAttachment = props.targetAttachment,
      use = props.use,
      zIndex = props.zIndex,
      rest = _objectWithoutProperties(props, ["_bodyElement", "_distanceAdjustment", "_insetAdjustment", "addTargetClasses", "animateOnMount", "animateOnToggle", "arrowSize", "autoPlacement", "children", "className", "closeOnOutsideClick", "closeOnTargetLeave", "onChangePlacement", "onCloseComplete", "onFocusLeave", "onOpenChange", "open", "pinToConstraint", "pinToOutOfBoundsTarget", "placement", "popoverRef", "shouldCloseOnClick", "target", "targetAttachment", "use", "zIndex"]);

  var _useContext = useContext(ModalTransitionContext),
      inModalTransition = _useContext.transitioning;

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      closeComplete = _useState2[0],
      setCloseComplete = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      placementOverride = _useState4[0],
      setPlacementOverride = _useState4[1];
  /** `contentOpen` triggers open/close transitions */


  var contentOpen = open && !inModalTransition;
  /** `tetherOpen` determines whether the popover is in the DOM */

  var tetherOpen = contentOpen || !closeComplete; // If a close transition is starting, update the closeComplete state.

  var prevContentOpen = usePrevious(contentOpen);

  if (prevContentOpen && !contentOpen && closeComplete) {
    setCloseComplete(false);
  } // If the placement prop is reset, clear our internal override


  var prevPlacement = usePrevious(placement);

  if (prevPlacement !== placement && placementOverride) {
    setPlacementOverride(null);
  }

  var contentRef = useRef();
  var defaultPopoverRef = useRef();
  var computedPlacement = placementOverride || placement;
  var computedPopoverRef = popoverRef || defaultPopoverRef;
  var mountedRef = useMounted();
  var isMounted = mountedRef.current;
  useEffect(function () {
    if (contentOpen && onOpenChange) {
      var tetherTarget = target || computedPopoverRef.current.getTargetElement();

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

        if (tetherTarget && tetherTarget.contains(clickTarget)) return; // Ignore the click if it's within our popover container

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

      if (closeOnTargetLeave) {
        var _window = window,
            IntersectionObserver = _window.IntersectionObserver;

        if (IntersectionObserver) {
          intersectionObserver = new IntersectionObserver(function (entries) {
            var isIntersecting = entries[0].isIntersecting;

            if (!isIntersecting) {
              onOpenChange(SyntheticEvent(false));
            }
          });
          intersectionObserver.observe(tetherTarget);
        }
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
  [closeOnOutsideClick, closeOnTargetLeave, contentOpen, shouldCloseOnClick, target]
  /* eslint-enable react-hooks/exhaustive-deps */
  );

  var handleTetherUpdate = function handleTetherUpdate(evt) {
    // Adjust our placement state to reflect Tether's response to a constraint
    var newPlacement = computeNewPlacement(computedPlacement, evt.targetAttachment, autoPlacement);
    if (!newPlacement) return;

    if (placementOverride !== newPlacement) {
      setPlacementOverride(newPlacement);
      if (onChangePlacement) onChangePlacement({
        newPlacement: newPlacement
      });
    }
  };

  var handleCloseComplete = function handleCloseComplete() {
    if (onCloseComplete) onCloseComplete();
    if (isMounted) setCloseComplete(true);
  }; // Perf: Don't generate props for the tether if we're closed.


  var popupProps = null;

  if (tetherOpen) {
    var computedArrowSize = getArrowSize(arrowSize, use);
    var computedAnimateOnToggle = getAnimateOnToggle(animateOnToggle, computedArrowSize);
    var computedArrowParams = UIPopoverArrow.ARROW_SIZES[computedArrowSize];

    var renderedContent = /*#__PURE__*/_jsx(UIPopoverContent, Object.assign({}, rest, {
      animateOnMount: Boolean(animateOnMount && !isMounted || computedAnimateOnToggle && isMounted),
      animateOnToggle: computedAnimateOnToggle,
      arrowSize: computedArrowSize,
      className: className,
      "data-component-name": "UIPopover",
      onCloseComplete: handleCloseComplete,
      open: contentOpen,
      placement: computedPlacement,
      ref: contentRef,
      use: use,
      onOpenChange: onOpenChange
    }));

    popupProps = {
      addTargetClasses: addTargetClasses,
      autoPlacement: autoPlacement,
      bodyElement: _bodyElement,
      center: computedArrowSize !== 'none',
      content: renderedContent,
      distance: computedArrowParams.distance + _distanceAdjustment,
      inset: computedArrowParams.inset + _insetAdjustment,
      onFocusLeave: onFocusLeave,
      onTetherUpdate: handleTetherUpdate,
      open: tetherOpen,
      pinToConstraint: pinToConstraint,
      pinToOutOfBoundsTarget: pinToOutOfBoundsTarget,
      placement: computedPlacement,
      ref: computedPopoverRef,
      target: target,
      targetAttachment: targetAttachment,
      zIndex: zIndex
    };
  }

  return /*#__PURE__*/_jsx(UIAbstractPopup, Object.assign({}, popupProps, {
    children: children
  }));
});
UIPopover.propTypes = Object.assign({}, UIPopoverContent.propTypes, {
  addTargetClasses: PropTypes.bool,
  arrowSize: PropTypes.oneOf(Object.keys(UIPopoverArrow.ARROW_SIZES)),
  autoPlacement: autoPlacementPropType,
  children: PropTypes.element,
  closeOnOutsideClick: PropTypes.bool.isRequired,
  closeOnTargetLeave: PropTypes.bool.isRequired,
  onFocusLeave: PropTypes.func,
  onChangePlacement: PropTypes.func,
  onOpenChange: PropTypes.func,
  pinToConstraint: pinToConstraintPropType,
  pinToOutOfBoundsTarget: PropTypes.bool,
  popoverRef: refObject,
  placement: PropTypes.oneOf(PLACEMENTS).isRequired,
  shouldCloseOnClick: PropTypes.func,
  target: domElementPropType,
  targetAttachment: PropTypes.string.isRequired,
  zIndex: PropTypes.number.isRequired,
  _distanceAdjustment: PropTypes.number,
  _insetAdjustment: PropTypes.number,
  _bodyElement: domElementPropType
});
UIPopover.defaultProps = Object.assign({}, UIPopoverContent.defaultProps, {
  autoPlacement: true,
  closeOnOutsideClick: true,
  closeOnTargetLeave: false,
  _distanceAdjustment: 0,
  _insetAdjustment: 0,
  pinToConstraint: ['top', 'bottom'],
  pinToOutOfBoundsTarget: false,
  targetAttachment: 'auto',
  zIndex: UIAbstractPopup.defaultProps.zIndex
});
var UIControlledPopover = UIPopover;
export default UIControlledPopover;