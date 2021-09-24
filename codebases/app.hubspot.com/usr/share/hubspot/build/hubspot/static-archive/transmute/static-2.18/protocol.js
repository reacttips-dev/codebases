'use es6';

import _makeSymbol from './internal/_makeSymbol';
import _setArity from './internal/_setArity';
import uniqueId from './uniqueId';

var DISPATCH_TYPE = _makeSymbol('protocolType');

function getValueKey(id, value) {
  switch (value) {
    case null:
    case undefined:
      return "" + value;

    default:
      return value.constructor && value.constructor[id] || value[id];
  }
}

function makeKey(id, Type) {
  switch (Type) {
    case null:
      return 'null';

    case undefined:
      return 'undefined';

    default:
      return Type[id] || uniqueId();
  }
}

function makeKeyInherited(id, Type) {
  switch (Type) {
    case null:
      return 'null';

    case undefined:
      return 'undefined';

    default:
      return Type.prototype.hasOwnProperty(id) ? Type.prototype[id] : uniqueId();
  }
}

function setKey(subject, id, key) {
  Object.defineProperty(subject, id, {
    configurable: false,
    enumerable: false,
    value: key,
    writable: true
  });
  return subject;
}

export default function protocol(_ref) {
  var args = _ref.args,
      name = _ref.name,
      fallback = _ref.fallback;
  var dispatchValueIndex = args.indexOf(DISPATCH_TYPE);

  var id = _makeSymbol("__p_" + name);

  var implementations = {};

  var dispatch = _setArity(args.length, function () {
    for (var _len = arguments.length, argValues = new Array(_len), _key = 0; _key < _len; _key++) {
      argValues[_key] = arguments[_key];
    }

    var value = argValues[dispatchValueIndex];
    var key = getValueKey(id, value);
    var implementation = key && implementations[key] || fallback;

    if (!implementation) {
      throw new Error(name + ": not implemented for type `" + value + "`");
    }

    return implementation.apply(void 0, argValues);
  });

  dispatch.implement = function (Type, implementation) {
    var key = makeKey(id, Type);

    if (Type !== undefined && Type !== null && !Type[id]) {
      setKey(Type, id, key);
    }

    implementations[key] = implementation;
    return implementation;
  };

  dispatch.implementInherited = function (Type, implementation) {
    var key = makeKeyInherited(id, Type);

    if (Type !== undefined && Type !== null && !Type.prototype.hasOwnProperty(id)) {
      setKey(Type.prototype, id, key);
    }

    implementations[key] = implementation;
    return implementation;
  };

  return dispatch;
}
protocol.TYPE = DISPATCH_TYPE;