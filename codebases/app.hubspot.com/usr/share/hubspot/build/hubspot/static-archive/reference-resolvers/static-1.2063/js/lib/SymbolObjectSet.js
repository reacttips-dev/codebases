'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
var objectIdSymbol = Symbol('objectId');

var addSymbolId = function addSymbolId(object) {
  if (object[objectIdSymbol] == null) {
    object[objectIdSymbol] = Symbol('id');
  }
};

var getSymbolId = function getSymbolId(object) {
  return object[objectIdSymbol];
};

var SymbolObjectSet = /*#__PURE__*/function () {
  function SymbolObjectSet() {
    _classCallCheck(this, SymbolObjectSet);

    this.set = {};
  }

  _createClass(SymbolObjectSet, [{
    key: "add",
    value: function add(object) {
      addSymbolId(object);
      this.set[getSymbolId(object)] = object;
    }
  }, {
    key: "remove",
    value: function remove(object) {
      var symbol = getSymbolId(object);

      if (symbol != null) {
        delete this.set[symbol];
      }
    }
  }, {
    key: "has",
    value: function has(object) {
      var symbol = getSymbolId(object);
      return symbol != null && this.set[symbol] != null;
    }
  }, {
    key: "forEach",
    value: function forEach(operation) {
      var symbols = Object.getOwnPropertySymbols != null ? Object.getOwnPropertySymbols(this.set) : Object.keys(this.set);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = symbols[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var symbol = _step.value;
          var value = this.set[symbol];

          if (getSymbolId(value) === symbol) {
            operation(value);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return SymbolObjectSet;
}();

export default SymbolObjectSet;