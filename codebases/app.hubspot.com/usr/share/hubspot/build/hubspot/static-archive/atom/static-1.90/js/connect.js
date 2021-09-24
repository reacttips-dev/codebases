"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connect;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _jsxRuntime = require("react/jsx-runtime");

var _atom = require("atom");

var _react = require("react");

var _UniqueId = require("./internal/UniqueId");

var nextId = (0, _UniqueId.makeUniqueId)('atomConnect');

function makeConnectedComponent(atomMap, BaseComponent) {
  var fields = Object.keys(atomMap);
  var resets = fields.reduce(function (acc, field) {
    acc[field + "Reset"] = _atom.reset.bind(null, atomMap[field]);
    return acc;
  }, {});
  var swaps = fields.reduce(function (acc, field) {
    acc[field + "Swap"] = _atom.swap.bind(null, atomMap[field]);
    return acc;
  }, {});
  var displayName = "ConnectedAtoms(" + fields.join(',') + ")(" + BaseComponent.displayName + ")";

  var ConnectedAtoms = /*#__PURE__*/function (_Component) {
    (0, _inherits2.default)(ConnectedAtoms, _Component);

    function ConnectedAtoms() {
      var _this;

      (0, _classCallCheck2.default)(this, ConnectedAtoms);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ConnectedAtoms).call(this));
      _this.id = nextId();
      _this.handlers = null;
      return _this;
    }

    (0, _createClass2.default)(ConnectedAtoms, [{
      key: "UNSAFE_componentWillMount",
      value: function UNSAFE_componentWillMount() {
        var _this2 = this;

        this.handlers = fields.reduce(function (acc, field) {
          var atom = atomMap[field];

          var handler = _this2.handleUpdate.bind(_this2, atom, field);

          (0, _atom.watch)(atom, handler);
          acc[field] = handler;
          return acc;
        }, {});
        this.setState(fields.reduce(function (initialState, field) {
          initialState[field] = (0, _atom.deref)(atomMap[field]);
          return initialState;
        }, {}));
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var _this3 = this;

        if (!this.handlers) {
          return;
        }

        fields.forEach(function (field) {
          (0, _atom.unwatch)(atomMap[field], _this3.handlers[field]);
        });
        this.handlers = null;
      }
    }, {
      key: "handleUpdate",
      value: function handleUpdate(atom, field) {
        this.setState((0, _defineProperty2.default)({}, field, (0, _atom.deref)(atom)));
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(BaseComponent, Object.assign({}, this.props, {}, this.state, {}, resets, {}, swaps));
      }
    }]);
    return ConnectedAtoms;
  }(_react.Component);

  ConnectedAtoms.displayName = displayName;
  ConnectedAtoms.WrappedComponent = BaseComponent;
  return ConnectedAtoms;
}

function enforceHasDependencies(keys) {
  if (keys.length > 0) {
    return keys;
  }

  throw new Error('expected `atomMap` to contain at least one atom but found none');
}

function enforceIsAtom(field, value) {
  if ((0, _atom.isAtom)(value)) {
    return value;
  }

  throw new Error("expected `atomMap[\"" + field + "\"]` to be an `Atom` but got `" + value + "`");
}

function connect(atomMap) {
  var keys = enforceHasDependencies(Object.keys(atomMap));
  keys.forEach(function (field) {
    return enforceIsAtom(field, atomMap[field]);
  });
  return makeConnectedComponent.bind(null, atomMap);
}

module.exports = exports.default;