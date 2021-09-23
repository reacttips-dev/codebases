'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { JUPITER_LAYER } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import { Fragment, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { createPortal, findDOMNode } from 'react-dom';
import useUniqueId from 'react-utils/hooks/useUniqueId';
import invariant from 'react-utils/invariant';
import useFactory from '../hooks/useFactory';
import { addToListAttr, getIframeAwareAncestorElements, getIframeAwareSurroundingWindows, getRelativeRect, removeFromListAttr } from '../utils/Dom';
import domElementPropType from '../utils/propTypes/domElement';
import { getCollisionRect } from '../utils/Rects';
import { getDefaultNode } from '../utils/RootNode';
import { debounceByTick } from '../utils/Timers';
import { makeFloatyLayerElement } from './utils/Layer';
import { getElementDimensions, getTransformForPosition, getViewportBounds, isCollisionFree } from './utils/Placement';
import ChildrenWrapper from '../utils/ChildrenWrapper';
var UIAbstractFloaty = /*#__PURE__*/forwardRef(function (props, ref) {
  var bodyElement = props.bodyElement,
      children = props.children,
      computePosition = props.computePosition,
      content = props.content,
      _hideContentWhenMissingTarget = props._hideContentWhenMissingTarget,
      layer = props.layer,
      layerClassName = props.layerClassName,
      onPositionChange = props.onPositionChange,
      target = props.target,
      zIndex = props.zIndex;
  /** Internally-created layer id */

  var uniqueId = useUniqueId("uiabstractfloaty-");
  /** The DOM element where the layer element will be mounted */

  var rootNode = bodyElement || getDefaultNode();
  /** The DOM element where the content will be rendered */

  var layerElement = useFactory(function () {
    return layer || makeFloatyLayerElement(rootNode, uniqueId, zIndex, layerClassName);
  });

  if (process.env.NODE_ENV !== 'production') {
    invariant(!(layerElement.id == null || layerElement.id === '' || layerElement.id === 'null' || layerElement.id === 'undefined'), 'Layer element must have an `id` attribute');
  }
  /** A ref to the wrapper around `children` */


  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      childrenWrapperRef = _useState2[0],
      setChildrenWrapperRef = _useState2[1];
  /** The DOM element the floaty is attached to (`target` if given, `children` otherwise) */


  var targetElement = target || findDOMNode(childrenWrapperRef); // Persist the latest targetElement in a ref

  var targetElementRef = useRef();
  targetElementRef.current = targetElement; // Persist the latest `computePosition` callback in a ref

  var computePositionRef = useRef();
  computePositionRef.current = computePosition; // Persist the latest `onPositionChange` callback in a ref

  var onPositionChangeRef = useRef();
  onPositionChangeRef.current = onPositionChange;
  /** Call `computePosition` and move the `layerElement` */

  var reposition = function reposition() {
    if (!targetElementRef.current) return;
    var targetBounds = getRelativeRect(targetElementRef.current, layerElement.offsetParent);
    var contentDimensions = getElementDimensions(layerElement);
    var position = computePositionRef.current({
      targetBounds: targetBounds,
      contentDimensions: contentDimensions
    });
    var positionTransform = getTransformForPosition(position);
    /* Check to make sure the popover is still in the viewport */

    var viewportCollisionRect = getCollisionRect(position, getViewportBounds());

    if (layerElement.style.transform !== positionTransform) {
      layerElement.style.transform = positionTransform;
      if (onPositionChangeRef.current) onPositionChangeRef.current();
    } else if (!isCollisionFree(viewportCollisionRect)) {
      /* Trigger onPositionChange if the transform doesn't change but is now out of bounds  (#8706) */
      if (onPositionChangeRef.current) onPositionChangeRef.current();
    }
  }; // Expose `reposition()` as a public method


  useImperativeHandle(ref, function () {
    return {
      reposition: reposition
    };
  });
  useEffect(function () {
    layerElement.style.zIndex = zIndex;
  }, [layerElement, zIndex]); // Recompute the layer element's position immediately after every render

  useLayoutEffect(reposition); // Bind event handlers that trigger reposition

  useEffect(function () {
    if (!targetElement) return undefined; // Debounce repositioning triggered by events to prevent scroll jank

    var debouncedReposition = debounceByTick(reposition); // Reposition whenever DOM mutations occur within the content layer

    var mutationObserver = new MutationObserver(function (mutationRecords) {
      // Ignore observed mutations that were caused by `reposition()` itself.
      if (mutationRecords.every(function (mutationRecord) {
        return mutationRecord.target === layerElement;
      })) {
        return;
      }

      debouncedReposition();
    });
    mutationObserver.observe(layerElement, {
      attributes: true,
      childList: true,
      subtree: true
    }); // Reposition whenever image `load` events occur in the target element

    targetElement.addEventListener('load', debouncedReposition, true); // Reposition on window-level scroll/resize

    var surroundingWindows = getIframeAwareSurroundingWindows(targetElement);
    surroundingWindows.forEach(function (surroundingWindow) {
      surroundingWindow.addEventListener('resize', debouncedReposition);
      surroundingWindow.addEventListener('scroll', debouncedReposition);
    }); // Reposition on scroll in any ancestor of the target

    var ancestorElements = getIframeAwareAncestorElements(targetElement);
    ancestorElements.forEach(function (ancestorElement) {
      ancestorElement.addEventListener('scroll', debouncedReposition);
    }); // Set `data-popover-id` on the target

    addToListAttr(targetElement, 'data-popover-id', layerElement.id);
    return function () {
      mutationObserver.disconnect();
      targetElement.removeEventListener('load', debouncedReposition, true);
      surroundingWindows.forEach(function (surroundingWindow) {
        surroundingWindow.removeEventListener('resize', debouncedReposition);
        surroundingWindow.removeEventListener('scroll', debouncedReposition);
      });
      ancestorElements.forEach(function (ancestorElement) {
        ancestorElement.removeEventListener('scroll', debouncedReposition);
      });
      removeFromListAttr(targetElement, 'data-popover-id', layerElement.id);
    };
  }, [targetElement]); // eslint-disable-line react-hooks/exhaustive-deps
  // Remove the layer element on unmount

  useEffect(function () {
    return function () {
      // Only remove the layerElement when it is internally-created
      if (layerElement && layerElement.parentElement && layerElement.id === uniqueId) {
        layerElement.parentElement.removeChild(layerElement);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [children && /*#__PURE__*/_jsx(ChildrenWrapper, {
      ref: setChildrenWrapperRef,
      children: children
    }), _hideContentWhenMissingTarget ? targetElement && content && /*#__PURE__*/createPortal(content, layerElement) : content && /*#__PURE__*/createPortal(content, layerElement)]
  });
});
UIAbstractFloaty.displayName = 'UIAbstractFloaty';
UIAbstractFloaty.propTypes = {
  bodyElement: domElementPropType,
  children: PropTypes.node,
  computePosition: PropTypes.func.isRequired,
  content: PropTypes.node,
  _hideContentWhenMissingTarget: PropTypes.bool.isRequired,
  layer: domElementPropType,

  /** className attached to the layer (root element) that renders the `content`. Ignored when using the `layer` prop. */
  layerClassName: PropTypes.string,

  /** An event handler that gets invoked when the layer is repositioned */
  onPositionChange: PropTypes.func,
  target: domElementPropType,
  zIndex: PropTypes.number.isRequired
};
UIAbstractFloaty.defaultProps = {
  _hideContentWhenMissingTarget: true,
  zIndex: parseInt(JUPITER_LAYER, 10)
};
export default UIAbstractFloaty;