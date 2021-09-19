import { useCallback, useEffect, useState } from 'react';

import { supportsPassiveEventListener } from 'helpers/EventHelpers';

interface Opts {
  onLeft?: () => any;
  onRight?: () => any;
  onUp?: () => any;
  onDown?: () => any;
  threshold?: number;
}

type Coordinate = null | number;

/**
 * React hook which makes an element swipeable. Takes named parameters. All are optional.
 *   onLeft: callback to execute when the user swiped left
 *   onRight: callback to execute when the user swiped right
 *   onUp: callback to execute when the user swiped up
 *   onDown: callback to execute when the user swiped down
 *   threshold: pixels the swipe must move beyond to fire a callback
 *
 * Returns a callback ref which must be associated to the swipeable
 * element via the ref attribute.
 *
 * @param {object} opts swipe parameters
 */
const useSwipe = (opts: Opts = {}) => {
  const [element, setElement] = useState<null | HTMLElement>(null);

  const elementRefSetter = useCallback(node => node && setElement(node), [setElement]);

  useEffect(() => {
    if (!element) {
      // nothing to attach listeners to
      return;
    }

    const { onLeft, onRight, onUp, onDown, threshold = 50 } = opts;

    const origLeft = element.style.left;
    const origTop = element.style.top;
    const origParentOverflow = element.parentElement?.style.overflow;

    const listenerOpts = supportsPassiveEventListener() ? { passive: true } : false;

    const restore = () => {
      element.style.transition = '';
      element.style.left = origLeft;
      element.style.top = origTop;
      if (origParentOverflow && element.parentElement) {
        element.parentElement.style.overflow = origParentOverflow;
      }
    };

    const restoreBeyondThreshold = () => {
      // hide the current item and restore positioning
      restore();
      element.style.opacity = '0';

      setTimeout(() => {
        if (element) {
          // fade in the new item
          element.style.transition = 'opacity 0.5s ease-in-out';
          element.style.opacity = '1';
        }
      }, 50);
    };

    let xStart: Coordinate = null;
    let yStart: Coordinate = null;

    const handleTouchStart = (e: TouchEvent) => {
      xStart = e.touches[0].clientX;
      yStart = e.touches[0].clientY;

      // suppress scroll bars while dragging
      if (element.parentElement) {
        element.parentElement.style.overflow = 'hidden';
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (xStart === null || yStart === null) {
        return;
      }

      const xDelta = xStart - e.touches[0].clientX;
      const yDelta = yStart - e.touches[0].clientY;

      if (xDelta < 0 && onRight || xDelta > 0 && onLeft) {
        element.style.left = `${-xDelta}px`;
      }

      if (yDelta < 0 && onDown || yDelta > 0 && onUp) {
        element.style.top = `${-yDelta}px`;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const xPosition = xStart ?? 0;
      const yPosition = yStart ?? 0;
      const xDelta = xPosition - e.changedTouches[0].clientX;
      const yDelta = yPosition - e.changedTouches[0].clientY;
      let anyFired = false;

      const checkAndFire = (delta: number, lessThanCb?: () => any, greaterThanCb?: () => any) => {
        if (Math.abs(delta) > threshold) {
          if (delta < 0 && lessThanCb) {
            lessThanCb();
            anyFired = true;
          } else if (delta > 0 && greaterThanCb) {
            greaterThanCb();
            anyFired = true;
          }
        }
      };

      checkAndFire(xDelta, onRight, onLeft);
      checkAndFire(yDelta, onDown, onUp);

      anyFired ? restoreBeyondThreshold() : restore();
    };

    element.addEventListener('touchstart', handleTouchStart, listenerOpts);
    element.addEventListener('touchmove', handleTouchMove, listenerOpts);
    element.addEventListener('touchend', handleTouchEnd, listenerOpts);
    element.addEventListener('touchcancel', restore, listenerOpts);
    return () => {
      // For these, TS doesn't recognize the { passive: boolean } interface in EventOptions, so we have to cast to any, unfortunately
      element.removeEventListener('touchstart', handleTouchStart, listenerOpts as any);
      element.removeEventListener('touchmove', handleTouchMove, listenerOpts as any);
      element.removeEventListener('touchend', handleTouchEnd, listenerOpts as any);
      element.removeEventListener('touchcancel', restore, listenerOpts as any);
    };
  });

  return elementRefSetter;
};

export default useSwipe;
