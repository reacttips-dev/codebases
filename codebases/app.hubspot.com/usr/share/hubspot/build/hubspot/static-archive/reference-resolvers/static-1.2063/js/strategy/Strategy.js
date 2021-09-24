'use es6';

import { atom, reset, watchUnreferenced } from 'atom';
import identity from 'transmute/identity';
import invariant from 'react-utils/invariant';
import isFunction from 'transmute/isFunction';
import memoize from 'transmute/memoize';
import pipe from 'transmute/pipe';
export function bridgeAtom(createConnection) {
  var bridge = atom();
  var removeConnection = createConnection(function (nextValue) {
    return reset(bridge, nextValue);
  });
  watchUnreferenced(bridge, removeConnection);
  return bridge;
}
export function enforceRemoveFunction(remove) {
  invariant(isFunction(remove), 'expected `getSubscription(...)` to return a function but got `%s`', remove);
  return remove;
}
export var makeKeyedResolver = function makeKeyedResolver() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$idTransform = _ref.idTransform,
      idTransform = _ref$idTransform === void 0 ? identity : _ref$idTransform,
      _ref$valueTransform = _ref.valueTransform,
      valueTransform = _ref$valueTransform === void 0 ? identity : _ref$valueTransform;

  return function (getSubscription) {
    var getAtom = memoize(function (id) {
      return bridgeAtom(function (next) {
        var validNext = pipe(valueTransform, next);
        var remove = enforceRemoveFunction(getSubscription(id, validNext));
        return function () {
          remove();
          getAtom.cache.remove(id);
        };
      });
    });
    var result = pipe(idTransform, getAtom);
    result.cache = getAtom.cache;
    return result;
  };
};