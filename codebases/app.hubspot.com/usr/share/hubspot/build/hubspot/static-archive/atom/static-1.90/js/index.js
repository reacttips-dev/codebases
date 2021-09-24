"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deref = deref;
exports.makeAtom = makeAtom;
exports.isAtom = isAtom;
exports.isValidValue = isValidValue;
exports.swap = swap;
exports.reset = reset;
exports.unwatch = unwatch;
exports.unwatchUnreferenced = unwatchUnreferenced;
exports.watchUnreferenced = exports.watch = exports.atom = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _UniqueId = require("./internal/UniqueId");

function makeSymbol(key) {
  return typeof Symbol === 'function' ? Symbol(key) : "@@" + key;
}

var VALIDATOR = makeSymbol('validator');
var VALUE = makeSymbol('value');
var WATCHER_ID = makeSymbol('watcherId');
var WATCHERS = makeSymbol('watchers');
var UNREFERENCED_WATCHERS = makeSymbol('unreferenced-watchers');
var nextId = (0, _UniqueId.makeUniqueId)('watcher');

function getWatcherId(callback) {
  if (!callback[WATCHER_ID]) {
    callback[WATCHER_ID] = nextId();
  }

  return callback[WATCHER_ID];
}

function addWatcher(watchers, callback) {
  var id = getWatcherId(callback);
  return Object.assign({}, watchers, (0, _defineProperty2.default)({}, id, callback));
}

function removeWatcher(watchers, callback) {
  if (watchers === null) {
    return null;
  }

  var id = getWatcherId(callback);

  if (!watchers[id]) {
    return watchers;
  }

  var nextWatchers = Object.assign({}, watchers);
  delete nextWatchers[id];

  if (Object.keys(nextWatchers).length === 0) {
    return null;
  }

  return nextWatchers;
}

function runWatchers(watchers) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (watchers === null) {
    return;
  }

  Object.keys(watchers).forEach(function (key) {
    var watcher = watchers[key];
    watcher.apply(void 0, args);
  });
}

function defaultValidator() {
  return true;
}

var Atom = /*#__PURE__*/function () {
  function Atom() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    var validator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultValidator;
    (0, _classCallCheck2.default)(this, Atom);
    this[VALIDATOR] = validator;
    this[VALUE] = value;
    this[WATCHERS] = null;
    this[UNREFERENCED_WATCHERS] = null;
  }

  (0, _createClass2.default)(Atom, [{
    key: "toString",
    value: function toString() {
      return "Atom<" + this[VALUE] + ">";
    }
  }]);
  return Atom;
}();
/**
 * Retrieves the value stored inside the atomInstance.
 * "deref" is short for "dereference".
 *
 * @example
 * import {atom, deref} from 'atom';
 * const count = atom(0);
 * deref(atom) === 0;
 *
 * @param  {Atom<T>} atomInstance
 * @return {T}
 */


function deref(atomInstance) {
  return atomInstance[VALUE];
}
/**
 * Creates a new Atom.
 * Takes an initial value and an optional validator function.
 *
 * Alias: `atom`
 *
 * @example
 * import {makeAtom} from 'atom';
 * const count = makeAtom(0);
 *
 * @param  {T} initialValue
 * @param  {?Function} validator
 * @return {Atom<T>}
 */


function makeAtom(initialValue, validator) {
  if (validator && typeof validator !== 'function') {
    throw new Error("expected `validator` to be a function or undefined but got `" + validator + "`");
  }

  return new Atom(initialValue, validator);
}
/**
 * Alias of `makeAtom`.
 *
 * Creates a new Atom.
 * Takes an initial value and an optional validator function.
 *
 * @example
 * import {atom} from 'atom';
 * const count = atom(0);
 *
 * @param  {T} initialValue
 * @param  {?Function} validator
 * @return {Atom<T>}
 */


var atom = makeAtom;
/**
 * Takes a value and returns true if that value is an Atom.
 *
 * @example
 * import {isAtom} from 'atom';
 * isAtom(atom(0)) === true;
 * isAtom(0) === false;
 *
 * @param  {any}  thing
 * @return {Boolean}
 */

exports.atom = atom;

function isAtom(thing) {
  return thing instanceof Atom;
}
/**
 * Takes an Atom and some value and returns true if the value passes Atom's
 * validator.
 *
 * @example
 * import {atom, isValidValue} from 'atom';
 * const count = atom(0, v => typeof v === 'number');
 * isValidValue(count, 1) === true;
 * isValidValue(count, 'random') === false;
 *
 * @param  {Atom<T>} atomInstance
 * @param  {any} value
 * @return {Boolean}
 */


function isValidValue(atomInstance, value) {
  return atomInstance[VALIDATOR](value, deref(atomInstance));
}
/**
 * @private
 * Used internally to set the value of an Atom.
 *
 * @param  {Atom<T>} atomInstance
 * @param  {T} nextValue
 * @return {Atom<T>}
 */


function transition(atomInstance, nextValue) {
  if (!isValidValue(atomInstance, nextValue)) {
    throw new Error("invariant atomInstance value `" + nextValue + "`");
  }

  var previousValue = atomInstance[VALUE];
  atomInstance[VALUE] = nextValue;
  runWatchers(atomInstance[WATCHERS], nextValue, previousValue, atomInstance);
  return atomInstance;
}
/**
 * Takes an atomInstance and a transition function which is applied to the
 * current value of the Atom to produce a new one.
 *
 * @example
 * import {atom, swap} from 'atom';
 * const count = atom(0);
 * swap(count, n => n + 1);
 * //> Atom<1>
 *
 * @param  {Atom<T>} atomInstance
 * @param  {Function} swapper
 * @return {Atom<T>}
 */


function swap(atomInstance, swapper) {
  return transition(atomInstance, swapper(deref(atomInstance)));
}
/**
 * Overwrites the value of an Atom.
 * In most cases, prefer `swap`.
 *
 * @example
 * import {atom, reset} from 'atom';
 * const count = atom(0);
 * reset(count, 1);
 * //> Atom<1>
 *
 * @param  {Atom<T>} atomInstance
 * @param  {T} nextValue
 * @return {Atom<T>}
 */


function reset(atomInstance, nextValue) {
  return transition(atomInstance, nextValue);
}

function baseWatch(key, atomInstance, callback) {
  atomInstance[key] = addWatcher(atomInstance[key], callback);
  return atomInstance;
}
/**
 * Registers a callback to run each time the Atom's value changes.
 * A given callback will run once, even if it's passed to watch multiple times.
 *
 * @example
 * import {atom, swap, watch} from 'atom';
 * const count = atom(0);
 * watch(
 *   count,
 *   (count, prevCount) => console.info('count changed from', count, 'to', prevCount)
 * );
 * swap(count, count => count + 1);
 * // count is 1
 *
 * @param  {Atom<T>} atomInstance
 * @param  {Function} callback
 * @return {Atom<T>}
 */


var watch = baseWatch.bind(null, WATCHERS);
/**
 * Register a callback to run if the atom's watcher count reaches 0.
 * This can be useful when creating atoms dynamically
 *
 * @param  {Atom<T>}  atomInstance
 * @param  {Function} callback
 * @return {Atom<T>}
 */

exports.watch = watch;
var watchUnreferenced = baseWatch.bind(null, UNREFERENCED_WATCHERS);
/**
 * Unregisters a watch callback.
 *
 * @param  {Atom<T>} atomInstance
 * @param  {Function} callback
 * @return {Atom<T>}
 */

exports.watchUnreferenced = watchUnreferenced;

function unwatch(atomInstance, callback) {
  var prevWatchers = atomInstance[WATCHERS];
  var nextWatchers = removeWatcher(prevWatchers, callback);
  atomInstance[WATCHERS] = nextWatchers;

  if (nextWatchers === null && prevWatchers !== null) {
    runWatchers(atomInstance[UNREFERENCED_WATCHERS], atomInstance);
  }

  return atomInstance;
}
/**
 * Unregisters an "unreferenced" callback.
 *
 * @param  {[type]}   atomInstance [description]
 * @param  {Function} callback     [description]
 * @return {[type]}                [description]
 */


function unwatchUnreferenced(atomInstance, callback) {
  atomInstance[UNREFERENCED_WATCHERS] = removeWatcher(atomInstance[UNREFERENCED_WATCHERS], callback);
  return atomInstance;
}