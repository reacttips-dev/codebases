'use es6';

var LEFT_MOUSE_BUTTON = 0;
export var isLeftClick = function isLeftClick(mouseEvent) {
  var button = mouseEvent.button,
      altKey = mouseEvent.altKey,
      ctrlKey = mouseEvent.ctrlKey,
      shiftKey = mouseEvent.shiftKey,
      metaKey = mouseEvent.metaKey;
  return button === LEFT_MOUSE_BUTTON && !(altKey || ctrlKey || shiftKey || metaKey);
};
export var stopPropagationHandler = function stopPropagationHandler(evt) {
  if (evt) evt.stopPropagation();
};
export var preventDefaultHandler = function preventDefaultHandler(evt) {
  if (evt) evt.preventDefault();
};
/**
 * @param {InputEvent} evt
 * @returns {boolean} `true` if any modifier (alt, ctrl, meta, or shift) is pressed
 */

export var isModifierPressed = function isModifierPressed(evt) {
  return evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey;
};