import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useRef, useState } from 'react';
import { getAttachedElement, getScrollParent } from '../utils/elementUtils';
import { getPulserPaths } from '../utils/pulserUtils';
export var usePulserContainer = function usePulserContainer(target) {
  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      pulserContainer = _useState2[0],
      setPulserContainer = _useState2[1];

  var popoverId = target && target.getAttribute('data-popover-id');
  useEffect(function () {
    if (!target || !popoverId) {
      return undefined;
    } // Insert pulser dom before tour popover for making popover be above pulser overlay


    var popoverElement = document.getElementById(popoverId);
    var pulserElement = document.createElement('div');
    pulserElement.id = "pulser-for-" + popoverId;

    if (popoverElement && popoverElement.parentNode) {
      popoverElement.parentNode.insertBefore(pulserElement, popoverElement);
    }

    setPulserContainer(pulserElement);
    return function () {
      if (pulserElement && pulserElement.parentNode) {
        pulserElement.parentNode.removeChild(pulserElement);
      }
    };
  }, [target, popoverId]);
  return pulserContainer;
};
export var usePulserSVGPaths = function usePulserSVGPaths(attachTo, pulserPathProps) {
  var pulserRef = useRef({
    rafId: undefined
  });
  var pathsRef = useRef({
    start: {},
    end: {}
  });

  var _useState3 = useState({
    start: {},
    end: {}
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      pulserPaths = _useState4[0],
      setPulserPaths = _useState4[1];

  useEffect(function () {
    if (!attachTo) {
      return undefined;
    }

    var target = getAttachedElement(attachTo);

    if (!target) {
      return undefined;
    }

    var ref = pulserRef.current;
    var scrollParent = getScrollParent(target); // Setup recursive function to call requestAnimationFrame to update the modal opening position

    var updatePulserPaths = function updatePulserPaths() {
      var newPaths = getPulserPaths(target, scrollParent, pulserPathProps);

      if (pathsRef.current.start.overlay !== newPaths.start.overlay || pathsRef.current.end.overlay !== newPaths.end.overlay) {
        pathsRef.current = newPaths;
        setPulserPaths(newPaths);
      }

      ref.timerId = setTimeout(function () {
        ref.rafId = requestAnimationFrame(updatePulserPaths);
      }, 100);
    };

    updatePulserPaths();
    return function () {
      if (ref.timerId) {
        clearTimeout(ref.timerId);
      }

      if (ref.rafId) {
        cancelAnimationFrame(ref.rafId);
      }
    };
  }, [attachTo, pulserPathProps]);
  return pulserPaths;
};