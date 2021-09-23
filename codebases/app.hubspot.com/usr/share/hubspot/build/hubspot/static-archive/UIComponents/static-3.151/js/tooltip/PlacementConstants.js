'use es6';

export var PLACEMENTS_HORIZ = ['left', 'right'];
export var PLACEMENTS_VERT = ['top', 'bottom'];
export var PLACEMENTS_SIDES = PLACEMENTS_HORIZ.concat(PLACEMENTS_VERT);
export var PLACEMENTS = PLACEMENTS_SIDES.concat(['left top', 'left bottom', 'right top', 'right bottom', 'top left', 'top right', 'bottom left', 'bottom right']);
export var OPPOSITE_DIRECTIONS = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  middle: 'middle',
  center: 'center'
};
/**
 * The min distance from the edge of the popover to its arrow, ensuring that it doesn't overlap with
 * the popover's rounded corners.
 */

export var ARROW_INSET_LOWER_BOUND = 8;