'use es6';

var _primaryTracker;

export var getPrimaryTracker = function getPrimaryTracker() {
  if (!_primaryTracker) {
    throw new Error('usage-tracker-container error. "getPrimaryTracker" was be called before "setPrimaryTracker".');
  }

  return _primaryTracker;
};
export var setPrimaryTracker = function setPrimaryTracker(tracker) {
  if (_primaryTracker) {
    throw new Error('usage-tracker-container error. Primary tracker has already been set. You can only set one primary tracker per runtime.');
  }

  _primaryTracker = tracker;
};