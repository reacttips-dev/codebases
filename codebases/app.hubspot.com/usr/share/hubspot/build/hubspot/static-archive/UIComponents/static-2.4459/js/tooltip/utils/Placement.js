'use es6';

import { OPPOSITE_DIRECTIONS, PLACEMENTS_HORIZ, PLACEMENTS_VERT } from '../PlacementConstants';
export function getSide(placement) {
  return placement.split(' ')[0];
}
export function isHoriz(direction) {
  return PLACEMENTS_HORIZ.includes(direction);
}
export function isVert(direction) {
  return PLACEMENTS_VERT.includes(direction);
}
export function getEdge(placement) {
  var specifiedEdge = placement.split(' ')[1];

  if (specifiedEdge) {
    return specifiedEdge;
  }

  return isHoriz(getSide(placement)) ? 'middle' : 'center';
}
export function getHorizPart(placement) {
  return isHoriz(getSide(placement)) ? getSide(placement) : getEdge(placement);
}
export function getVertPart(placement) {
  return isVert(getSide(placement)) ? getSide(placement) : getEdge(placement);
}
export function getCentered(direction) {
  return isHoriz(direction) ? 'middle' : 'center';
}
export function getAttachment(placement) {
  // Convert to 'vert horiz' format and flip both the side and the edge
  var side = OPPOSITE_DIRECTIONS[getSide(placement)];
  var edge = OPPOSITE_DIRECTIONS[getEdge(placement)];
  return isHoriz(side) ? edge + " " + side : side + " " + edge;
}
export function getTargetAttachment(placement, center) {
  // Convert to 'vert horiz' format and either center the edge (if center=true)
  // or flip the edge (if center=false). For example, if placement is
  // "bottom right" and we aren't centering the target attachment point,
  // then we want to attach to the *left* edge of the target.
  var side = getSide(placement);
  var edge = center ? getCentered(getEdge(placement)) : OPPOSITE_DIRECTIONS[getEdge(placement)];
  return isHoriz(side) ? edge + " " + side : side + " " + edge;
}
/**
 * Compute the new placement for a popover after a Tether update event (indicating a constraint
 * collision) with `newTargetAttachment`.
 *
 * @param {string} oldPlacement
 * @param {Object} newTargetAttachment
 * @param {('horiz'|'vert'|true)} axis "Flip" along this axis only (`true` for both)
 * @return {?string}
 */

export function computeNewPlacement(oldPlacement, newTargetAttachment, axis) {
  var newPlacementVert = axis === 'horiz' ? getVertPart(oldPlacement) : newTargetAttachment.top;
  var newPlacementHoriz = axis === 'vert' ? getHorizPart(oldPlacement) : newTargetAttachment.left;

  if (!newPlacementVert || !newPlacementHoriz) {
    // This indicates pinning, which we don't need to respond to
    return null;
  }

  if (newPlacementVert === 'center' || newPlacementVert === 'middle') {
    return newPlacementHoriz;
  }

  if (newPlacementHoriz === 'center' || newPlacementHoriz === 'middle') {
    return newPlacementVert; // #1942
  }

  var onVertSide = getVertPart(oldPlacement) === getSide(oldPlacement);
  return onVertSide ? newPlacementVert + " " + newPlacementHoriz : newPlacementHoriz + " " + newPlacementVert;
}
export function getOffset(placement, distance, inset) {
  var vert = 0;
  var horiz = 0;

  switch (getSide(placement)) {
    case 'top':
      vert = distance;
      break;

    case 'right':
      horiz = -distance;
      break;

    case 'bottom':
      vert = -distance;
      break;

    case 'left':
      horiz = distance;
      break;

    default:
      break;
  }

  switch (getEdge(placement)) {
    case 'top':
      vert = -inset;
      break;

    case 'right':
      horiz = inset;
      break;

    case 'bottom':
      vert = inset;
      break;

    case 'left':
      horiz = -inset;
      break;

    default:
      break;
  }

  return vert + "px " + horiz + "px";
}
export function getTargetOffset(placement, inset) {
  var vert = 0;
  var horiz = 0;

  switch (getEdge(placement)) {
    case 'top':
      vert = inset;
      break;

    case 'right':
      horiz = -inset;
      break;

    case 'bottom':
      vert = -inset;
      break;

    case 'left':
      horiz = inset;
      break;

    default:
      break;
  }

  return vert + "px " + horiz + "px";
}
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