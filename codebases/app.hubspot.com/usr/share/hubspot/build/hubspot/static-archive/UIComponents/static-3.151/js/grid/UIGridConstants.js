'use es6';

import range from '../utils/underscore/range';
export var MAX_OFFSET = 12;
export var MAX_SIZE = 12;
export var MIN_OFFSET = 0;
export var MIN_SIZE = 1;
export var OFFSET_RANGE = range(MIN_OFFSET, MAX_OFFSET + 1);
export var SIZE_RANGE = range(MIN_SIZE, MAX_SIZE + 1);
export var SCREEN_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

function createSizeClasses(screenSize) {
  var classes = {};

  for (var i = MIN_OFFSET; i <= MAX_SIZE; i++) {
    if (i === 0) {
      classes[i] = '';
    } else {
      classes[i] = "col-" + screenSize + "-" + i;
    }
  }

  return classes;
}

function createAllSizeClasses() {
  var append = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var holdScreenClasses = {};
  SCREEN_SIZES.forEach(function (screenSize) {
    holdScreenClasses[screenSize] = createSizeClasses("" + screenSize + append);
  });
  return holdScreenClasses;
}

export var SIZE_CLASSES = createAllSizeClasses();
export var OFFSET_CLASSES = createAllSizeClasses('-offset');