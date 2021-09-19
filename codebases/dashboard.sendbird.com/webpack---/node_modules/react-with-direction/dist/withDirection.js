'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withDirectionPropTypes = exports.DIRECTIONS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports['default'] = withDirection;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _getComponentName = require('airbnb-prop-types/build/helpers/getComponentName');

var _getComponentName2 = _interopRequireDefault(_getComponentName);

var _constants = require('./constants');

var _brcast = require('./proptypes/brcast');

var _brcast2 = _interopRequireDefault(_brcast);

var _direction = require('./proptypes/direction');

var _direction2 = _interopRequireDefault(_direction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* eslint-disable react/forbid-foreign-prop-types */
// This higher-order component consumes a string from React context that is
// provided by the DirectionProvider component.
// We can use this to conditionally switch layout/direction for right-to-left layouts.

var contextTypes = _defineProperty({}, _constants.CHANNEL, _brcast2['default']);

exports.DIRECTIONS = _constants.DIRECTIONS;

// set a default direction so that a component wrapped with this HOC can be
// used even without a DirectionProvider ancestor in its react tree.

var defaultDirection = _constants.DIRECTIONS.LTR;

// export for convenience, in order for components to spread these onto their propTypes
var withDirectionPropTypes = exports.withDirectionPropTypes = {
  direction: _direction2['default'].isRequired
};

function withDirection(WrappedComponent) {
  var WithDirection = function (_React$Component) {
    _inherits(WithDirection, _React$Component);

    function WithDirection(props, context) {
      _classCallCheck(this, WithDirection);

      var _this = _possibleConstructorReturn(this, (WithDirection.__proto__ || Object.getPrototypeOf(WithDirection)).call(this, props, context));

      _this.state = {
        direction: context[_constants.CHANNEL] ? context[_constants.CHANNEL].getState() : defaultDirection
      };
      return _this;
    }

    _createClass(WithDirection, [{
      key: 'componentDidMount',
      value: function () {
        function componentDidMount() {
          var _this2 = this;

          if (this.context[_constants.CHANNEL]) {
            // subscribe to future direction changes
            this.channelUnsubscribe = this.context[_constants.CHANNEL].subscribe(function (direction) {
              _this2.setState({ direction: direction });
            });
          }
        }

        return componentDidMount;
      }()
    }, {
      key: 'componentWillUnmount',
      value: function () {
        function componentWillUnmount() {
          if (this.channelUnsubscribe) {
            this.channelUnsubscribe();
          }
        }

        return componentWillUnmount;
      }()
    }, {
      key: 'render',
      value: function () {
        function render() {
          var direction = this.state.direction;


          return _react2['default'].createElement(WrappedComponent, _extends({}, this.props, {
            direction: direction
          }));
        }

        return render;
      }()
    }]);

    return WithDirection;
  }(_react2['default'].Component);

  var wrappedComponentName = (0, _getComponentName2['default'])(WrappedComponent) || 'Component';

  WithDirection.WrappedComponent = WrappedComponent;
  WithDirection.contextTypes = contextTypes;
  WithDirection.displayName = 'withDirection(' + String(wrappedComponentName) + ')';
  if (WrappedComponent.propTypes) {
    WithDirection.propTypes = (0, _deepmerge2['default'])({}, WrappedComponent.propTypes);
    delete WithDirection.propTypes.direction;
  }
  if (WrappedComponent.defaultProps) {
    WithDirection.defaultProps = (0, _deepmerge2['default'])({}, WrappedComponent.defaultProps);
  }

  return (0, _hoistNonReactStatics2['default'])(WithDirection, WrappedComponent);
}