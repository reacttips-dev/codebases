'use es6';

import { domReady } from './domReady';
var HIDE_FOCUS_STYLES_CLASS = 'hubspot-disable-focus-styles';
var SHOW_FOCUS_STYLES_CLASS = 'hubspot-enable-focus-styles';
var keyboardMode = false;
var managedContainerElements = [];
/**
 * Listen for mouse/keyboard events in the given container, then attach a class to the container
 * (and all other managed containers) in response to those events. This provides the ability for
 * CSS selectors to show/hide focus outlines based on whether the user is in "keyboard mode" or
 * "mouse mode".
 *
 * @param {HTMLElement} containerElement
 */

export var manageFocusOutlinesInContainer = function manageFocusOutlinesInContainer(containerElement) {
  if (!containerElement || managedContainerElements.includes(containerElement)) {
    return;
  }

  managedContainerElements.push(containerElement);

  var activateKeyboardMode = function activateKeyboardMode() {
    keyboardMode = true;
    managedContainerElements.forEach(function (el) {
      el.classList.add(SHOW_FOCUS_STYLES_CLASS);
    });
    managedContainerElements.forEach(function (el) {
      el.classList.remove(HIDE_FOCUS_STYLES_CLASS);
    });
  };

  var activateMouseMode = function activateMouseMode() {
    keyboardMode = false;
    managedContainerElements.forEach(function (el) {
      el.classList.add(HIDE_FOCUS_STYLES_CLASS);
    });
    managedContainerElements.forEach(function (el) {
      el.classList.remove(SHOW_FOCUS_STYLES_CLASS);
    });
  };

  containerElement.addEventListener('keydown', activateKeyboardMode);
  containerElement.addEventListener('mousemove', activateMouseMode);
  containerElement.addEventListener('mousedown', activateMouseMode);
  containerElement.addEventListener('mouseup', activateMouseMode);
};
/**
 * @return {boolean} Was the most recently detected input event a keyboard event?
 */

export var isPageInKeyboardMode = function isPageInKeyboardMode() {
  return keyboardMode;
}; // Start managing focus outlines in `document.body` as soon as it's ready

domReady(function () {
  manageFocusOutlinesInContainer(document.body);
});