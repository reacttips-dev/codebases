'use es6';

import { getIframeAwareClientRect } from '../../utils/Dom';
import { clipRectByValues, getCollisionRect, makeRect } from '../../utils/Rects';
import { ARROW_INSET_LOWER_BOUND, OPPOSITE_DIRECTIONS, PLACEMENTS_HORIZ, PLACEMENTS_SIDES, PLACEMENTS_VERT } from '../PlacementConstants';
export function getSide(placement) {
  return placement.split(' ')[0];
}
export function isHoriz(direction) {
  return PLACEMENTS_HORIZ.includes(direction) || direction === 'middle';
}
export function isVert(direction) {
  return PLACEMENTS_VERT.includes(direction) || direction === 'center';
}
export function getEdge(placement) {
  var specifiedEdge = placement.split(' ')[1];

  if (specifiedEdge) {
    return specifiedEdge;
  }

  return isHoriz(getSide(placement)) ? 'middle' : 'center';
}
export function getAttachment(placement) {
  // Convert to 'vert horiz' format and flip both the side and the edge
  var side = OPPOSITE_DIRECTIONS[getSide(placement)];
  var edge = OPPOSITE_DIRECTIONS[getEdge(placement)];
  return isHoriz(side) ? edge + " " + side : side + " " + edge;
}
/**
 * @param {string} side
 * @param {string} edge
 * @return {string}
 */

var getPlacementName = function getPlacementName(side, edge) {
  var placement = side;
  if (edge !== 'middle' && edge !== 'center') placement += " " + edge;
  return placement;
};
/**
 * If the popover target is skinnier than the arrow that points at it, or wider than the popover
 * itself, the arrow might wind up outside of the popover! This function tells the popover how far
 * it has to move to ensure that its arrow remains inside of it.
 *
 * @param {number} arrowWidth
 * @param {number} targetSize The size of the target along the side the popover is attached to
 * @param {number} popoverSize The
 * @return {number}
 */


var getArrowAdjustment = function getArrowAdjustment(arrowWidth, targetSize, popoverSize) {
  if (arrowWidth === 0) return 0; // no arrow, no adjustment

  var skinnyTargetAdjustment = (arrowWidth - targetSize) / 2 + ARROW_INSET_LOWER_BOUND;
  if (skinnyTargetAdjustment > 0) return skinnyTargetAdjustment;
  var largeTargetAdjustment = popoverSize - (targetSize + arrowWidth) / 2 - ARROW_INSET_LOWER_BOUND;
  if (largeTargetAdjustment < 0) return largeTargetAdjustment;
  return 0;
};
/**
 * Where would the popover be if it had a given placement?
 *
 * @param {string} placement
 * @param {object} popoverSize
 * @param {object} targetRect
 * @param {number} arrowWidth
 * @param {number} distance
 * @param {number} inset
 * @param {HTMLElement} offsetParent
 * @param {?Object} pinning
 * @return {Object} An object of the form { rect, arrowInset }
 */


export var computePopupPosition = function computePopupPosition(placement, popoverSize, targetRect, arrowWidth, distance, inset, offsetParent) {
  var pinning = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
  var rect = {};
  var side = getSide(placement);
  var edge = getEdge(placement);
  var computedArrowWidth = pinning ? 0 : arrowWidth;
  var arrowAdjustment;

  if (isVert(side)) {
    rect.bottom = side === 'top' ? targetRect.top - distance : targetRect.bottom + distance + popoverSize.height;
    rect.top = rect.bottom - popoverSize.height;
    arrowAdjustment = getArrowAdjustment(computedArrowWidth, targetRect.width, popoverSize.width);

    if (edge === 'left') {
      rect.right = targetRect.right + arrowAdjustment + inset;
      rect.left = rect.right - popoverSize.width;
    } else if (edge === 'right') {
      rect.left = targetRect.left - arrowAdjustment - inset;
      rect.right = rect.left + popoverSize.width;
    } else if (edge === 'center') {
      var targetMiddle = targetRect.left + targetRect.width / 2;
      rect.left = targetMiddle - popoverSize.width / 2;
      rect.right = targetMiddle + popoverSize.width / 2;
    }
  } else {
    rect.right = side === 'left' ? targetRect.left - distance : targetRect.right + distance + popoverSize.width;
    rect.left = rect.right - popoverSize.width;
    arrowAdjustment = getArrowAdjustment(computedArrowWidth, targetRect.height, popoverSize.height);

    if (edge === 'top') {
      rect.bottom = targetRect.bottom + arrowAdjustment + inset;
      rect.top = rect.bottom - popoverSize.height;
    } else if (edge === 'bottom') {
      rect.top = targetRect.top - arrowAdjustment - inset;
      rect.bottom = rect.top + popoverSize.height;
    } else if (edge === 'middle') {
      var _targetMiddle = targetRect.top + targetRect.height / 2;

      rect.top = _targetMiddle - popoverSize.height / 2;
      rect.bottom = _targetMiddle + popoverSize.height / 2;
    }
  } // Compute where the arrow should be to point at the target's center.


  var arrowInset = computedArrowWidth === 0 ? 0 : Math.max(ARROW_INSET_LOWER_BOUND, isHoriz(getSide(placement)) ? (targetRect.height - arrowWidth) / 2 + (targetRect.top - rect.top) : (targetRect.width - arrowWidth) / 2 + (targetRect.left - rect.left)); // Convert from fixed coordinates to coordinates relative to the `offsetParent`, if one is given.

  if (offsetParent == null) {
    var _document$documentEle = document.documentElement,
        scrollLeft = _document$documentEle.scrollLeft,
        scrollTop = _document$documentEle.scrollTop;
    rect.top = rect.top + scrollTop;
    rect.bottom = rect.bottom + scrollTop;
    rect.left = rect.left + scrollLeft;
    rect.right = rect.right + scrollLeft;
  } else {
    var offsetParentRect = offsetParent.getBoundingClientRect();
    rect.top = rect.top - offsetParentRect.top;
    rect.bottom = rect.bottom - offsetParentRect.top;
    rect.left = rect.left - offsetParentRect.left;
    rect.right = rect.right - offsetParentRect.left;
  } // If `pinning` is given, shift as prescribed.


  if (typeof pinning === 'object') {
    rect.top += pinning.top;
    rect.left += pinning.left;
  }

  return {
    rect: rect,
    arrowInset: arrowInset
  };
};
var COMPUTED_TRANSPARENT = 'rgba(0, 0, 0, 0)';
/**
 * Returns the given element's bounding client rect, minus any transparent border or padding.
 *
 * @param {HTMLElement} element
 * @return {object}
 */

export var getRectWithoutWhitespace = function getRectWithoutWhitespace(element) {
  var elementRect = getIframeAwareClientRect(element);
  var elementStyles = getComputedStyle(element, null); // Patch for Firefox < 62: https://bugzilla.mozilla.org/show_bug.cgi?id=1467722

  if (!elementStyles) return elementRect;
  var hasVisibleBorder = elementStyles['border-color'] !== COMPUTED_TRANSPARENT && parseInt(elementStyles['border-width'], 10) > 0 && elementStyles['border-style'] !== 'none';

  if (elementStyles['background-color'] === COMPUTED_TRANSPARENT && elementStyles['background-image'] === 'none' && !hasVisibleBorder) {
    return clipRectByValues(elementRect, parseInt(elementStyles['padding-top'], 10), parseInt(elementStyles['padding-right'], 10), parseInt(elementStyles['padding-bottom'], 10), parseInt(elementStyles['padding-left'], 10));
  }

  return elementRect;
};
/**
 * @param {HTMLElement} element
 * @return {object} An object of the form `{ width, height }`
 */

export var getElementDimensions = function getElementDimensions(element) {
  // `getBoundingClientRect()` is inaccurate during popover transitions, due to `transform: scale()`.
  return {
    width: element.clientWidth,
    height: element.clientHeight
  };
};
/**
 * @return {object} A rect-like object corresponding to the visible area in the browser viewport
 */

export var getViewportBounds = function getViewportBounds() {
  var _document$documentEle2 = document.documentElement,
      scrollLeft = _document$documentEle2.scrollLeft,
      scrollTop = _document$documentEle2.scrollTop;
  return makeRect(scrollTop, innerWidth + scrollLeft, innerHeight + scrollTop, scrollLeft);
};
/**
 * @param {object} collisionRect A rect returned by `getCollisionRect()`
 * @return {boolean}
 */

export var isCollisionFree = function isCollisionFree(collisionRect) {
  return Object.values(collisionRect).every(function (v) {
    return v === 0;
  });
};
/**
 * @param {Array} eligibleSides `['top', 'right', 'bottom', left']` or any subset of that list
 * @param {string} side
 * @param {Object} rect
 * @return {number}
 */

var gatedRectValue = function gatedRectValue(eligibleSides, side, rect) {
  return eligibleSides.includes(side) ? rect[side] : 0;
};
/**
 * @param {number} value1
 * @param {number} value2
 * @return {number} Either `value1` or `value2`, whichever has the greatest absolute value
 */


var maxAbsValue = function maxAbsValue(value1, value2) {
  return Math.abs(value1) > Math.abs(value2) ? value1 : value2;
};
/**
 * Determine the best placement and pinning for a popover with the given constraints, based on the
 * available space in the viewport.
 *
 * @param {string} currentPlacement
 * @param {true|false|"vert"|"horiz"} autoPlacement
 * @param {true|Array} pinToConstraint
 * @param {object} popoverDimensions The dimensions of the popover element
 * @param {HTMLElement} targetRect The element the popover is pointing at
 * @param {number} arrowWidth
 * @param {number} distance
 * @param {number} inset
 * @return {object} An object of the form `{ bestPlacement: string, pinned: boolean }`
 */


export var findBestPosition = function findBestPosition(currentPlacement, autoPlacement, pinToConstraint, popoverDimensions, targetRect, arrowWidth, distance, inset) {
  var constraintRect = getViewportBounds(); // If the current placement has no collisions with the constraint, return it.

  var currentPlacementRect = computePopupPosition(currentPlacement, popoverDimensions, targetRect, arrowWidth, distance, inset).rect;
  var currentCollisionRect = getCollisionRect(currentPlacementRect, constraintRect);

  if (isCollisionFree(currentCollisionRect)) {
    return {
      placement: currentPlacement
    };
  } // Try all other possible placements allowed by the `autoPlacement` prop.


  var currentPlacementSide = getSide(currentPlacement);
  var currentPlacementEdge = getEdge(currentPlacement);
  var possibleSides;

  if (autoPlacement === true) {
    possibleSides = PLACEMENTS_SIDES;
  } else if (autoPlacement === 'dropdown' || autoPlacement === 'vert' && isVert(currentPlacementSide)) {
    possibleSides = ['top', 'bottom'];
  } else if (autoPlacement === 'horiz' && isHoriz(currentPlacementSide)) {
    possibleSides = ['left', 'right'];
  } else {
    possibleSides = [currentPlacementSide];
  }

  var possibleEdges;

  if (autoPlacement === true || autoPlacement === 'dropdown') {
    possibleEdges = PLACEMENTS_SIDES.concat(['center', 'middle']);
  } else if (autoPlacement === 'vert' && isVert(currentPlacementEdge)) {
    possibleEdges = ['top', 'bottom', 'middle'];
  } else if (autoPlacement === 'horiz' && isHoriz(currentPlacementEdge)) {
    possibleEdges = ['left', 'right', 'center'];
  } else {
    possibleEdges = [currentPlacementEdge];
  }

  var possiblePlacements = [];
  possibleSides.forEach(function (newPlacementSide) {
    possibleEdges.forEach(function (newPlacementEdge) {
      // Ignore invalid side+edge combinations, e.g. "top top" or "left right"
      if (isHoriz(newPlacementSide) && isHoriz(newPlacementEdge) || isVert(newPlacementSide) && isVert(newPlacementEdge)) {
        return;
      } // Don't allow centered placements ("top", "right", "bottom", "left") for arrowless popovers


      if (arrowWidth === 0 && /middle|center/.test(newPlacementEdge)) {
        return;
      }

      possiblePlacements.push(getPlacementName(newPlacementSide, newPlacementEdge));
    });
  }); // Order matters! Give preference to the placements that only change the edge or the side.

  possiblePlacements.sort(function (placement1, placement2) {
    var sameSide1 = getSide(placement1) === currentPlacementSide;
    var sameSide2 = getSide(placement2) === currentPlacementSide;
    if (sameSide1 && !sameSide2) return -1;
    if (sameSide2 && !sameSide1) return 1;
    var sameEdge1 = getEdge(placement1) === currentPlacementEdge;
    var sameEdge2 = getEdge(placement2) === currentPlacementEdge;
    if (sameEdge1 && !sameEdge2) return -1;
    if (sameEdge2 && !sameEdge1) return 1;
    return 0;
  });
  var collisionRectForPlacement = {};

  for (var i = 0; i < possiblePlacements.length; i++) {
    var newPlacement = possiblePlacements[i];

    if (newPlacement === currentPlacement) {
      collisionRectForPlacement[currentPlacement] = currentCollisionRect;
      continue;
    }

    var newPlacementRect = computePopupPosition(newPlacement, popoverDimensions, targetRect, arrowWidth, distance, inset).rect;
    var newCollisionRect = getCollisionRect(newPlacementRect, constraintRect);

    if (isCollisionFree(newCollisionRect)) {
      return {
        placement: newPlacement
      };
    }

    collisionRectForPlacement[newPlacement] = newCollisionRect;
  } // Otherwise, return the least-bad placement (the one that minimizes clipping), with pinning if allowed.


  var pinnableSides = Array.isArray(pinToConstraint) ? pinToConstraint : pinToConstraint && PLACEMENTS_SIDES || [];
  var leastBadPlacement = currentPlacement;
  var leastBadTopPinning = 0;
  var leastBadLeftPinning = 0;
  var leastBadTotalClipping = Infinity;
  possiblePlacements.forEach(function (placement) {
    var collisionRect = collisionRectForPlacement[placement];
    var totalClipping = Math.max(collisionRect.top, collisionRect.bottom) + Math.max(collisionRect.left, collisionRect.right);

    if (totalClipping < leastBadTotalClipping) {
      leastBadTotalClipping = totalClipping;
      leastBadPlacement = placement;
      leastBadTopPinning = maxAbsValue(gatedRectValue(pinnableSides, 'top', collisionRect), -gatedRectValue(pinnableSides, 'bottom', collisionRect));
      leastBadLeftPinning = maxAbsValue(gatedRectValue(pinnableSides, 'left', collisionRect), -gatedRectValue(pinnableSides, 'right', collisionRect));
    }
  });

  if (leastBadTopPinning || leastBadLeftPinning) {
    return {
      pinned: true,
      placement: leastBadPlacement,
      topPinning: leastBadTopPinning,
      leftPinning: leastBadLeftPinning
    };
  }

  return {
    placement: leastBadPlacement
  };
};
/**
 * Convert a `getBoundingClientRect`-style rect to a CSS transform string.
 *
 * @param {object} position An object of the form `{ top, left }`
 * @return {string}
 */

export var getTransformForPosition = function getTransformForPosition(rect) {
  // On high-DPI ("retina") displays, align popups with physical pixel boundaries to avoid blur.
  var roundPosition = typeof window.devicePixelRatio === 'number' && devicePixelRatio % 1 === 0 ? function (rawPosition) {
    return Math.round(rawPosition * devicePixelRatio) / devicePixelRatio;
  } : function (rawPosition) {
    return rawPosition;
  };
  var xPosition = roundPosition(rect.left);
  var yPosition = roundPosition(rect.top); // Making this a "3D" translation hints to the browser that it should enable GPU acceleration.

  return "translate3d(" + xPosition + "px, " + yPosition + "px, 0px)";
};