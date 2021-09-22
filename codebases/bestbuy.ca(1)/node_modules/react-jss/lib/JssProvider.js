'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _jss = require('./jss');

var _ns = require('./ns');

var ns = _interopRequireWildcard(_ns);

var _contextTypes = require('./contextTypes');

var _contextTypes2 = _interopRequireDefault(_contextTypes);

var _propTypes2 = require('./propTypes');

var _propTypes3 = _interopRequireDefault(_propTypes2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JssProvider = function (_Component) {
  _inherits(JssProvider, _Component);

  function JssProvider() {
    _classCallCheck(this, JssProvider);

    return _possibleConstructorReturn(this, (JssProvider.__proto__ || Object.getPrototypeOf(JssProvider)).apply(this, arguments));
  }

  _createClass(JssProvider, [{
    key: 'getChildContext',


    // JssProvider can be nested. We allow to overwrite any context prop at any level.
    // 1. Check if there is a value passed over props.
    // 2. If value was passed, we set it on the child context.
    // 3. If value was not passed, we proxy parent context (default context behaviour).
    value: function getChildContext() {
      var _props = this.props,
          registry = _props.registry,
          classNamePrefix = _props.classNamePrefix,
          localJss = _props.jss,
          generateClassName = _props.generateClassName,
          disableStylesGeneration = _props.disableStylesGeneration;

      var sheetOptions = this.context[ns.sheetOptions] || {};
      var context = _defineProperty({}, ns.sheetOptions, sheetOptions);

      if (registry) {
        context[ns.sheetsRegistry] = registry;
        // This way we identify a new request on the server, because user will create
        // a new Registry instance for each.
        if (registry !== this.registry) {
          // We reset managers because we have to regenerate all sheets for the new request.
          this.managers = {};
          this.registry = registry;
        }
      }

      // Make sure we don't loose managers when JssProvider is used inside of a stateful
      // component which decides to rerender.
      context[ns.managers] = this.managers;

      if (generateClassName) {
        sheetOptions.generateClassName = generateClassName;
      } else if (!sheetOptions.generateClassName) {
        if (!this.generateClassName) {
          var createGenerateClassName = _jss.createGenerateClassNameDefault;
          if (localJss && localJss.options.createGenerateClassName) {
            createGenerateClassName = localJss.options.createGenerateClassName;
          }
          // Make sure we don't loose the generator when JssProvider is used inside of a stateful
          // component which decides to rerender.
          this.generateClassName = createGenerateClassName();
        }

        sheetOptions.generateClassName = this.generateClassName;
      }

      if (classNamePrefix) sheetOptions.classNamePrefix = classNamePrefix;
      if (localJss) context[ns.jss] = localJss;
      if (disableStylesGeneration !== undefined) {
        sheetOptions.disableStylesGeneration = disableStylesGeneration;
      }

      return context;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react.Children.only(this.props.children);
    }
  }]);

  return JssProvider;
}(_react.Component);

JssProvider.propTypes = _extends({}, _propTypes3['default'], {
  generateClassName: _propTypes.func,
  classNamePrefix: _propTypes.string,
  disableStylesGeneration: _propTypes.bool,
  children: _propTypes.node.isRequired
});
JssProvider.childContextTypes = _contextTypes2['default'];
JssProvider.contextTypes = _contextTypes2['default'];
exports['default'] = JssProvider;