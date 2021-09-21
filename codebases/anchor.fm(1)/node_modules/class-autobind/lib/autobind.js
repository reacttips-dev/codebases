'use strict';

exports.__esModule = true;
exports.default = autobind;


// The following React methods should not be automatically bound.
var REACT_EXCLUDE_METHODS = {
  getChildContext: true,
  render: true,
  componentWillMount: true,
  componentDidMount: true,
  componentWillReceiveProps: true,
  shouldComponentUpdate: true,
  componentWillUpdate: true,
  componentDidUpdate: true,
  componentWillUnmount: true
};

function isExcluded(methodName) {
  return REACT_EXCLUDE_METHODS[methodName] === true;
}

function isFunction(item) {
  return typeof item === 'function';
}

function autobind(instance, proto) {
  if (proto == null) {
    proto = Object.getPrototypeOf(instance);
  }
  var propertyNames = Object.getOwnPropertyNames(proto);
  for (var _iterator = propertyNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var name = _ref;

    var value = proto[name];
    if (isFunction(value) && !isExcluded(name)) {
      instance[name] = proto[name].bind(instance);
    }
  }
}