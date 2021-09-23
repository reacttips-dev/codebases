'use es6';

export var VIEW_LOCATION_OBJECT_BOARD = 'OBJECT_BOARD';
export var VIEW_LOCATIONS = [VIEW_LOCATION_OBJECT_BOARD];
export var isValidViewLocation = function isValidViewLocation(location) {
  return VIEW_LOCATIONS.includes(location);
};