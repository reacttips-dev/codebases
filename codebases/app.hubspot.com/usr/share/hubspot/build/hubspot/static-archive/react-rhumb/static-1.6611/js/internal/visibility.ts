export var visibilityState = function visibilityState() {
  return document.visibilityState;
};
export var isHidden = function isHidden() {
  return document.visibilityState === 'hidden';
};
export var onVisibilityChange = function onVisibilityChange(callback) {
  document.addEventListener('visibilitychange', function () {
    callback(document.visibilityState);
  });
};
export var onVisibilityHidden = function onVisibilityHidden(callback) {
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      callback();
    }
  });
};