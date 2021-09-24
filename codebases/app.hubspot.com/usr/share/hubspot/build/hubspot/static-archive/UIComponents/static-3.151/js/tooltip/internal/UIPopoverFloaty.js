'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useUniqueId from 'react-utils/hooks/useUniqueId';
import shallowEqual from 'react-utils/shallowEqual';
import { OpenPopupContext } from '../../context/internal/OpenPopupContext';
import SyntheticEvent from '../../core/SyntheticEvent';
import { makePubSubChannel, usePubSubChannel, usePublish, useSubscribe } from '../../hooks/pubSub';
import useFactory from '../../hooks/useFactory';
import { elementIsOnScreen, getIframeAwareSurroundingWindows, handleTabWithOrdering } from '../../utils/Dom';
import UIAbstractFloaty from '../UIAbstractFloaty';
import { makeFloatyLayerElement } from '../utils/Layer';
import { computePopupPosition, findBestPosition, getAttachment, getRectWithoutWhitespace } from '../utils/Placement';
/** Channel for announcing position events to other popups that may need to respond. */

var interPopupChannel = makePubSubChannel();
/**
 * `UIPopoverFloaty` builds on `UIAbstractFloaty`, adding `UIPopover`-specific features:
 * - Calculates position based on the `placement` prop
 * - Overrides `placement` to avoid viewport boundaries if `autoPlacement` is enabled
 * - Tells the popover arrow where to render itself to point at the target
 * - Tells any nested popovers when they need to reposition themselves
 * - Inserts its content into the document tab order
 */

var UIPopoverFloaty = /*#__PURE__*/forwardRef(function (props, ref) {
  var arrowWidth = props.arrowWidth,
      autoPlacement = props.autoPlacement,
      content = props.content,
      distance = props.distance,
      inset = props.inset,
      onFocusLeave = props.onFocusLeave,
      onPlacementChange = props.onPlacementChange,
      pinToConstraint = props.pinToConstraint,
      pinToOutOfBoundsTarget = props.pinToOutOfBoundsTarget,
      placement = props.placement,
      rootNode = props.rootNode,
      targetElement = props.targetElement,
      zIndex = props.zIndex;
  /** ref to the UIAbstractFloaty */

  var floatyRef = ref || useRef();
  /** The ID used for the layer element */

  var uniqueId = useUniqueId("uiopenpopup-"); // The `positionConfig` incorporates all internal state from auto-placement and pinning

  var _useState = useState({
    placement: placement
  }),
      _useState2 = _slicedToArray(_useState, 2),
      positionConfig = _useState2[0],
      setPositionConfig = _useState2[1];
  /** Ref to the current value of `positionConfig` */


  var positionConfigRef = useRef();
  positionConfigRef.current = positionConfig;
  /** Ref to the previous value of the `placement` prop */

  var prevPlacementRef = useRef(placement); // Reset `positionConfig` if we receive a new `placement` prop value

  if (prevPlacementRef.current !== placement) {
    prevPlacementRef.current = placement;
    setPositionConfig({
      placement: placement
    });
  }
  /** Establish a channel to tell descendants when we've repositioned */


  var contextChannel = usePubSubChannel();
  var publishToContext = usePublish(contextChannel);
  /** Also be ready to tell other popups when we've repositioned */

  var publishToPeers = usePublish(interPopupChannel);
  /** The DOM element where the content will be rendered */

  var layerElement = useFactory(function () {
    return makeFloatyLayerElement(rootNode, uniqueId, zIndex);
  });
  /** Ref that tracks whether the focus is inside of the popup content */

  var hasFocusRef = useRef(false);
  var _positionConfigRef$cu = positionConfigRef.current,
      currentPlacement = _positionConfigRef$cu.placement,
      pinned = _positionConfigRef$cu.pinned,
      topPinning = _positionConfigRef$cu.topPinning,
      leftPinning = _positionConfigRef$cu.leftPinning;
  var pinning = pinned && {
    top: topPinning,
    left: leftPinning
  };
  var popoverDimensions;
  var targetRect;
  var computedPosition;
  /** Recompute the position of the popup */

  var computePosition = function computePosition(_ref) {
    var contentDimensions = _ref.contentDimensions;
    popoverDimensions = contentDimensions;
    targetRect = getRectWithoutWhitespace(targetElement);
    var offsetParent = layerElement.offsetParent;
    computedPosition = computePopupPosition(currentPlacement, popoverDimensions, targetRect, arrowWidth, distance, inset, offsetParent, pinning);
    return computedPosition.rect;
  };
  /** After the DOM update that results from computePosition(), perform follow-up tasks */


  var onPositionChange = function onPositionChange() {
    layerElement.className = layerElement.className.replace(/private-popover-attached-\w+/g, '');

    var _getAttachment$split = getAttachment(currentPlacement).split(' '),
        _getAttachment$split2 = _slicedToArray(_getAttachment$split, 2),
        attachmentY = _getAttachment$split2[0],
        attachmentX = _getAttachment$split2[1];

    layerElement.classList.add("private-popover-attached-" + attachmentY);
    layerElement.classList.add("private-popover-attached-" + attachmentX); // Update subscribers with the new position

    publishToContext(Object.assign({}, computedPosition, {
      pinning: pinning,
      placement: currentPlacement
    })); // Update peers so that they know our layer element has moved

    publishToPeers(layerElement);

    if (autoPlacement) {
      var isPinnable = pinToOutOfBoundsTarget || elementIsOnScreen(targetElement);
      var newPositionConfig = findBestPosition(currentPlacement, autoPlacement, isPinnable && pinToConstraint, popoverDimensions, targetRect, arrowWidth, distance, inset);

      if (!shallowEqual(positionConfigRef.current, newPositionConfig)) {
        setPositionConfig(newPositionConfig);
      }

      if (newPositionConfig.placement !== currentPlacement) {
        onPlacementChange(SyntheticEvent(newPositionConfig.placement));
      }
    }
  };
  /** Reposition if our target is in another popover that's moved */


  useSubscribe(interPopupChannel, function (repositionedLayerElement) {
    if (!(floatyRef && floatyRef.current)) return;

    if (repositionedLayerElement.contains(targetElement)) {
      floatyRef.current.reposition();
    }
  }); // Event handlers (bound on mount and whenever `targetElement` changes)

  useLayoutEffect(function () {
    /** Listen for "Tab" key presses, to allow the user to tab in and out of the popup */
    var handleWindowKeyDown = function handleWindowKeyDown(evt) {
      handleTabWithOrdering(evt, targetElement, layerElement);
    };
    /** Fire `onFocusLeave()` if the keyboard focus has left the popup content */


    var handleWindowFocus = function handleWindowFocus() {
      var newHasFocus = layerElement.contains(document.activeElement);
      if (hasFocusRef.current && !newHasFocus) onFocusLeave();
      hasFocusRef.current = newHasFocus;
    };

    var surroundingWindows = getIframeAwareSurroundingWindows(targetElement);
    surroundingWindows.forEach(function (surroundingWindow) {
      surroundingWindow.addEventListener('keydown', handleWindowKeyDown);
      if (onFocusLeave) surroundingWindow.addEventListener('focus', handleWindowFocus, true);
    });
    return function () {
      surroundingWindows.forEach(function (surroundingWindow) {
        surroundingWindow.removeEventListener('keydown', handleWindowKeyDown);
        if (onFocusLeave) surroundingWindow.removeEventListener('focus', handleWindowFocus, true);
      });
    };
  }, [targetElement]); // eslint-disable-line react-hooks/exhaustive-deps

  var contextValue = useMemo(function () {
    return {
      positionChannel: contextChannel
    };
  }, [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(function () {
    return function () {
      if (layerElement && layerElement.parentElement) {
        layerElement.parentElement.removeChild(layerElement);
      }
    };
  }, [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return /*#__PURE__*/_jsx(OpenPopupContext.Provider, {
    value: contextValue,
    children: /*#__PURE__*/_jsx(UIAbstractFloaty, {
      computePosition: computePosition,
      content: content,
      _hideContentWhenMissingTarget: false,
      layer: layerElement,
      onPositionChange: onPositionChange,
      target: targetElement,
      ref: floatyRef,
      zIndex: zIndex
    })
  });
});
UIPopoverFloaty.displayName = 'UIPopoverFloaty';
export default UIPopoverFloaty;