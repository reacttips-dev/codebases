'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import useMounted from 'react-utils/hooks/useMounted';
import styled from 'styled-components';
import { getComponentPropType, isRenderable } from '../utils/propTypes/componentProp';
var activeContextValue = {
  transitioning: true
};
var inactiveContextValue = {
  transitioning: false
};

var getContextValue = function getContextValue(transitioning) {
  return transitioning ? activeContextValue : inactiveContextValue;
};

export default function TwoWayTransition(props) {
  var children = props.children,
      ContextProvider = props.ContextProvider,
      duration = props.duration,
      onCloseComplete = props.onCloseComplete,
      onCloseStart = props.onCloseStart,
      onOpenComplete = props.onOpenComplete,
      onOpenStart = props.onOpenStart,
      transitionOnMount = props.transitionOnMount,
      transitionOnUpdate = props.transitionOnUpdate,
      Wrapper = props.Wrapper,
      rest = _objectWithoutProperties(props, ["children", "ContextProvider", "duration", "onCloseComplete", "onCloseStart", "onOpenComplete", "onOpenStart", "transitionOnMount", "transitionOnUpdate", "Wrapper"]);
  /** An update that changes `children` between null and non-null triggers open/close */


  var nextOpen = isRenderable(children);

  var _useState = useState(transitionOnMount ? !nextOpen : nextOpen),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      transitioning = _useState4[0],
      setTransitioning = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      transitionActive = _useState6[0],
      setTransitionActive = _useState6[1];
  /** A ref to a copy of `children` that's frozen during the close transition */


  var cachedChildrenRef = useRef(children);
  if (nextOpen) cachedChildrenRef.current = children;
  var timeoutHandleRef = useRef(null);
  var rAFHandleRef = useRef(null);
  var mountedRef = useMounted();

  var clearTimeouts = function clearTimeouts() {
    clearTimeout(timeoutHandleRef.current);
    cancelAnimationFrame(rAFHandleRef.current);
  };

  var startTransition = function startTransition() {
    clearTimeouts();

    if (nextOpen) {
      if (onOpenStart) onOpenStart();
    } else {
      if (onCloseStart) onCloseStart();
    }

    var stopTransition = function stopTransition() {
      if (nextOpen) {
        if (onOpenComplete) onOpenComplete();
      } else {
        if (onCloseComplete) onCloseComplete();
      }

      if (!mountedRef.current) return;
      if (!nextOpen) cachedChildrenRef.current = null;
      setTransitioning(false);
      setTransitionActive(false);
    }; // If duration={0}, skip the CSS transition entirely (#6542)


    if (duration === 0) {
      setOpen(nextOpen);
      stopTransition();
      return;
    }

    setTransitioning(true);
    rAFHandleRef.current = requestAnimationFrame(function () {
      rAFHandleRef.current = requestAnimationFrame(function () {
        setOpen(nextOpen);
        setTransitionActive(true);
        timeoutHandleRef.current = setTimeout(stopTransition, duration);
      });
    });
  }; // Mount/unmount logic


  useEffect(function () {
    if (transitionOnMount && !transitionOnUpdate) {
      startTransition();
    } else if (open && !transitionOnMount) {
      // Some logic requires "open" events to trigger, even when the transition is skipped.
      if (onOpenStart) onOpenStart();
      if (onOpenComplete) onOpenComplete();
    }

    return function () {
      clearTimeouts();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Open/close logic

  useEffect(function () {
    if (transitionOnUpdate && open !== nextOpen) {
      startTransition();
    }
  }, [open, nextOpen, transitionOnUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

  var renderedWrapper = /*#__PURE__*/_jsx(Wrapper, Object.assign({}, rest, {
    duration: duration,
    open: open,
    opening: transitionActive && open,
    closing: transitionActive && !open,
    transitioning: transitioning,
    transitionActive: transitionActive,
    children: cachedChildrenRef.current
  }));

  return ContextProvider ? /*#__PURE__*/_jsx(ContextProvider, {
    value: getContextValue(transitioning),
    children: renderedWrapper
  }) : renderedWrapper;
}

if (process.env.NODE_ENV !== 'production') {
  TwoWayTransition.propTypes = {
    children: PropTypes.node,
    ContextProvider: PropTypes.elementType,
    duration: PropTypes.number.isRequired,
    onCloseComplete: PropTypes.func,
    onCloseStart: PropTypes.func,
    onOpenComplete: PropTypes.func,
    onOpenStart: PropTypes.func,
    transitionOnMount: PropTypes.bool.isRequired,
    transitionOnUpdate: PropTypes.bool.isRequired,
    Wrapper: getComponentPropType({
      propTypes: {
        duration: PropTypes.number,
        open: PropTypes.bool.isRequired,
        transitioning: PropTypes.bool.isRequired,
        transitionActive: PropTypes.bool.isRequired,
        closing: PropTypes.bool.isRequired,
        opening: PropTypes.bool.isRequired
      }
    }).isRequired
  };
}

TwoWayTransition.defaultProps = {
  transitionOnMount: false,
  transitionOnUpdate: true
};
TwoWayTransition.displayName = 'TwoWayTransition';
var PlainWrapper = styled.div.attrs({
  'data-transition-wrapper': true
}).withConfig({
  displayName: "TwoWayTransition__PlainWrapper",
  componentId: "xwn0i9-0"
})([""]);
PlainWrapper.displayName = 'TwoWayTransition.PlainWrapper';
TwoWayTransition.PlainWrapper = PlainWrapper;