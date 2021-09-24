import { safe } from './safe';
var NAME = '__REPORTING__';
/* global global */

var globalObj;

try {
  globalObj = window;
} catch (e) {
  // @ts-expect-error this occurs due the use inside our data regression cli/testing tool that runs via node.
  // When this custom process is deprecated this should no longer be required.
  globalObj = global.window;
}

var noop = function noop() {};

export var initialize = function initialize() {
  if (!(globalObj[NAME] && typeof globalObj[NAME] === 'object')) {
    globalObj[NAME] = {};
  }
};
export var get = safe(function (key) {
  return globalObj[NAME][key];
}, noop);
export var set = safe(function (key, value) {
  globalObj[NAME][key] = value;
  return get(key);
}, noop);
export var update = safe(function (key, updater) {
  var current = get(key);
  var graced = safe(updater, function () {
    return current;
  });
  set(key, graced(current));
  return get(key);
}, noop);
initialize();