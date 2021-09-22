"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ManagerContext = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _createReactContext = _interopRequireDefault(require("create-react-context"));

var ManagerContext = (0, _createReactContext.default)({
  setReferenceNode: undefined,
  referenceNode: undefined
});
exports.ManagerContext = ManagerContext;

var Manager =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(Manager, _React$Component);

  function Manager() {
    var _this;

    _this = _React$Component.call(this) || this;
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setReferenceNode", function (referenceNode) {
      if (!referenceNode || _this.state.context.referenceNode === referenceNode) {
        return;
      }

      _this.setState(function (_ref) {
        var context = _ref.context;
        return {
          context: (0, _extends2.default)({}, context, {
            referenceNode: referenceNode
          })
        };
      });
    });
    _this.state = {
      context: {
        setReferenceNode: _this.setReferenceNode,
        referenceNode: undefined
      }
    };
    return _this;
  }

  var _proto = Manager.prototype;

  _proto.render = function render() {
    return React.createElement(ManagerContext.Provider, {
      value: this.state.context
    }, this.props.children);
  };

  return Manager;
}(React.Component);

exports.default = Manager;