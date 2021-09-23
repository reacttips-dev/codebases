/* eslint-disable @typescript-eslint/no-use-before-define */

/*
  This code is taken from 
  https://github.com/GoogleChrome/web-vitals/blob/3f3338d994f182172d5b97b22a0fcce0c2846908/src/lib/polyfills/firstInputPolyfill.ts
*/
var firstInputEvent;
var firstInputDelay;
var firstInputTimeStamp;
var callbacks;
var listenerOpts = {
  passive: true,
  capture: true
};
var startTimeStamp = new Date();
export var firstInputPolyfill = function firstInputPolyfill(onFirstInput) {
  callbacks.push(onFirstInput);
  reportFirstInputDelayIfRecordedAndValid();
};
export var resetFirstInputPolyfill = function resetFirstInputPolyfill() {
  callbacks = [];
  firstInputDelay = -1;
  firstInputEvent = null;
  eachEventType(window.addEventListener);
};

var recordFirstInputDelay = function recordFirstInputDelay(delay, event) {
  if (!firstInputEvent) {
    firstInputEvent = event;
    firstInputDelay = delay;
    firstInputTimeStamp = new Date();
    eachEventType(window.removeEventListener);
    reportFirstInputDelayIfRecordedAndValid();
  }
};

var reportFirstInputDelayIfRecordedAndValid = function reportFirstInputDelayIfRecordedAndValid() {
  if (firstInputDelay >= 0 && // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (subtracting two dates always returns a number)
  firstInputDelay < firstInputTimeStamp - startTimeStamp) {
    var _entry = {
      entryType: 'first-input',
      name: firstInputEvent.type,
      target: firstInputEvent.target,
      cancelable: firstInputEvent.cancelable,
      startTime: firstInputEvent.timeStamp,
      processingStart: firstInputEvent.timeStamp + firstInputDelay
    };
    callbacks.forEach(function (callback) {
      callback(_entry);
    });
    callbacks = [];
  }
};

var onInput = function onInput(event) {
  if (event.cancelable) {
    var isEpochTime = event.timeStamp > 1e12;
    var now = isEpochTime ? new Date() : performance.now();
    var delay = now - event.timeStamp;

    if (event.type === 'pointerdown') {
      onPointerDown(delay, event);
    } else {
      recordFirstInputDelay(delay, event);
    }
  }
}; // Handles pointer down events, which are a special case, since we need to exclude scrolling and zooming.


var onPointerDown = function onPointerDown(delay, event) {
  var onPointerUp = function onPointerUp() {
    recordFirstInputDelay(delay, event);
    removePointerEventListeners();
  };

  var onPointerCancel = function onPointerCancel() {
    removePointerEventListeners();
  };

  var removePointerEventListeners = function removePointerEventListeners() {
    window.removeEventListener('pointerup', onPointerUp, listenerOpts);
    window.removeEventListener('pointercancel', onPointerCancel, listenerOpts);
  };

  window.addEventListener('pointerup', onPointerUp, listenerOpts);
  window.addEventListener('pointercancel', onPointerCancel, listenerOpts);
};

var eachEventType = function eachEventType(callback) {
  var eventTypes = ['mousedown', 'keydown', 'touchstart', 'pointerdown'];
  eventTypes.forEach(function (type) {
    return callback(type, onInput, listenerOpts);
  });
};