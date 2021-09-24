'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { Set as ImmutableSet } from 'immutable';
import emptyFunction from 'react-utils/emptyFunction';
import invariant from 'react-utils/invariant';

function makeSymbol(key) {
  return typeof Symbol === 'function' ? Symbol(key) : "@@" + key;
}

var VALIDATOR = makeSymbol('validator');
var VALUE = makeSymbol('value');
var WATCHERS = makeSymbol('watchers');
/**
 * You probably shouldn't use this in your app. Atoms are a lighter weight
 * solution to the same problems GeneralStore or Redux address. If you already
 * use flux you should continue to do so.
 *
 * Direct questions to @crabideau (@colby in #salesuicomponents on Slack)
 *
 * This is an adaption of Clojure's atom.
 * http://clojure.org/reference/atoms
 *
 * An Atom is an observable wrapper around some value.
 * It's a simple alternative to more complex state management structures like
 * GeneralStore or redux.
 */

var Atom = /*#__PURE__*/function () {
  function Atom() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    var validator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction.thatReturns(true);

    _classCallCheck(this, Atom);

    this[VALIDATOR] = validator;
    this[VALUE] = value;
    this[WATCHERS] = ImmutableSet();
  }

  _createClass(Atom, [{
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
 * @param  Atom<T>
 * @return T
 */


export function deref(atomInstance) {
  return atomInstance[VALUE];
}
/**
 * Creates a new Atom.
 * Takes an initial value and an optional validator function.
 *
 * @param  T
 * @param  ?(testValue: T, currentValue: T) => bool
 * @return Atom<T>
 */

function makeAtom(initialValue, validator) {
  invariant(!validator || typeof validator === 'function', 'expected `validator` to be a function or undefined but got `%s`', validator);
  return new Atom(initialValue, validator);
}

export { makeAtom as atom };
/**
 * Takes a value and returns true if that value is an Atom.
 *
 * @param  any
 * @return bool
 */

export function isAtom(thing) {
  return thing instanceof Atom;
}
/**
 * Takes an Atom and some value and returns true if the value may be set into
 * the Atom according to the Atom's validator.
 *
 * @param  Atom<T>
 * @param  T
 * @return bool
 */

export function isValidValue(atomInstance, value) {
  return atomInstance[VALIDATOR](value, deref(atomInstance));
}
/**
 * Used internally to set the value of an Atom.
 *
 * @param  Atom<T>
 * @param  T
 * @return Atom<T>
 */

function transition(atomInstance, nextValue) {
  invariant(isValidValue(atomInstance, nextValue), 'invalid atomInstance value `%s`', nextValue);
  var previousValue = atomInstance[VALUE];
  atomInstance[VALUE] = nextValue;
  atomInstance[WATCHERS].forEach(function (watcher) {
    return watcher(nextValue, previousValue, atomInstance);
  });
  return atomInstance;
}
/**
 * Overwrites the value of an Atom.
 * Generally it's better to use swap to avoid race conditions.
 *
 * @param  Atom<T>
 * @param  T
 * @return Atom<T>
 */


export function reset(atomInstance, nextValue) {
  return transition(atomInstance, nextValue);
}
/**
 * Takes an atomInstance and a transition function which  is applied to the current
 * value of the Atom to produce a new one.
 *
 * @param  Atom<T>
 * @param  (currentValue: T) => T
 * @return Atom<T>
 */

export function swap(atomInstance, swapper) {
  return transition(atomInstance, swapper(deref(atomInstance)));
}
/**
 * Registers a callback that will be run each time the Atom's value changes.
 * A given callback will only be run once, no matter how many times it's passed
 * to watch.
 *
 * @param  Atom<T>
 * @param  (value: T, previousValue: T, atomInstance: Atom<t>) => void
 * @return Atom<T>
 */

export function watch(atomInstance, callback) {
  atomInstance[WATCHERS] = atomInstance[WATCHERS].add(callback);
  return atomInstance;
}
/**
 * Unregisters a watch callback.
 *
 * @param  Atom<T>
 * @param  (value: T, previousValue: T, atomInstance: Atom<t>) => void
 * @return Atom<T>
 */

export function unwatch(atomInstance, callback) {
  atomInstance[WATCHERS] = atomInstance[WATCHERS].remove(callback);
  return atomInstance;
}