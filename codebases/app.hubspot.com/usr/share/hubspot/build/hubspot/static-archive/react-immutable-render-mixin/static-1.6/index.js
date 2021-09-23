'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var immutable = _interopDefault(require('immutable'));
var react = _interopDefault(require('react'));

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var shallowEqualImmutable_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = shallowEqualImmutable;



var _immutable2 = _interopRequireDefault(immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var is = _immutable2.default.is.bind(_immutable2.default);

function shallowEqualImmutable(objA, objB) {
  if (objA === objB || is(objA, objB)) {
    return true;
  }

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}
});

unwrapExports(shallowEqualImmutable_1);

var shouldComponentUpdate_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldComponentUpdate;



var _shallowEqualImmutable2 = _interopRequireDefault(shallowEqualImmutable_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function shouldComponentUpdate(nextProps, nextState) {
  return !(0, _shallowEqualImmutable2.default)(this.props, nextProps) || !(0, _shallowEqualImmutable2.default)(this.state, nextState);
}
});

unwrapExports(shouldComponentUpdate_1);

var immutableRenderMixin = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});



var _shouldComponentUpdate2 = _interopRequireDefault(shouldComponentUpdate_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  shouldComponentUpdate: _shouldComponentUpdate2.default
};
});

unwrapExports(immutableRenderMixin);

var immutableRenderDecorator_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = immutableRenderDecorator;



var _react2 = _interopRequireDefault(react);



var _shouldComponentUpdate2 = _interopRequireDefault(shouldComponentUpdate_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Makes the given component "pure".
 *
 * @param object Target Component.
 */
function immutableRenderDecorator(Target) {
  var Wrapper = function (_Component) {
    _inherits(Wrapper, _Component);

    function Wrapper() {
      _classCallCheck(this, Wrapper);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Wrapper).apply(this, arguments));
    }

    _createClass(Wrapper, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Target, this.props, this.props.children);
      }
    }]);

    return Wrapper;
  }(react.Component);

  Wrapper.prototype.shouldComponentUpdate = _shouldComponentUpdate2.default;

  return Wrapper;
}
});

unwrapExports(immutableRenderDecorator_1);

var lib = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shallowEqualImmutable = exports.shouldComponentUpdate = exports.immutableRenderDecorator = exports.default = undefined;



var _shouldComponentUpdate2 = _interopRequireDefault(shouldComponentUpdate_1);



var _shallowEqualImmutable2 = _interopRequireDefault(shallowEqualImmutable_1);



var _immutableRenderMixin2 = _interopRequireDefault(immutableRenderMixin);



var _immutableRenderDecorator2 = _interopRequireDefault(immutableRenderDecorator_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _immutableRenderMixin2.default;
exports.immutableRenderDecorator = _immutableRenderDecorator2.default;
exports.shouldComponentUpdate = _shouldComponentUpdate2.default;
exports.shallowEqualImmutable = _shallowEqualImmutable2.default;
});

var index = unwrapExports(lib);
var lib_1 = lib.shallowEqualImmutable;
var lib_2 = lib.shouldComponentUpdate;
var lib_3 = lib.immutableRenderDecorator;

exports.default = index;
exports.immutableRenderDecorator = lib_3;
exports.shallowEqualImmutable = lib_1;
exports.shouldComponentUpdate = lib_2;
