'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _Portal = require('react-overlays/lib/Portal');

var _Portal2 = _interopRequireDefault(_Portal);

var _componentOrElement = require('prop-types-extra/lib/componentOrElement');

var _componentOrElement2 = _interopRequireDefault(_componentOrElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BODY_CLASS = 'rbt-body-container';
var DROPUP_SPACING = -4;

// When appending the overlay to `document.body`, clicking on it will register
// as an "outside" click and immediately close the overlay. This classname tells
// `react-onclickoutside` to ignore the click.
var IGNORE_CLICK_OUTSIDE = 'ignore-react-onclickoutside';

function isBody(container) {
  return container === document.body;
}

/**
 * Custom `Overlay` component, since the version in `react-overlays` doesn't
 * work for our needs. Specifically, the `Position` component doesn't provide
 * the customized placement we need.
 */

var Overlay = function (_React$Component) {
  _inherits(Overlay, _React$Component);

  function Overlay() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Overlay);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call.apply(_ref, [this].concat(args))), _this), _this.displayName = 'Overlay', _this.state = {
      left: 0,
      right: 0,
      top: 0
    }, _this._update = function () {
      var _container$classList;

      var _this$props = _this.props,
          className = _this$props.className,
          container = _this$props.container,
          show = _this$props.show;

      // Positioning is only used when body is the container.

      if (!(show && isBody(container) && _this._mounted)) {
        return;
      }

      // Set a classname on the body for scoping purposes.
      container.classList.add(BODY_CLASS);
      !!className && (_container$classList = container.classList).add.apply(_container$classList, _toConsumableArray(className.split(' ')));

      _this._updatePosition();
    }, _this._updatePosition = function () {
      var _this$props2 = _this.props,
          align = _this$props2.align,
          dropup = _this$props2.dropup,
          target = _this$props2.target;


      var menuNode = (0, _reactDom.findDOMNode)(_this._menu);
      var targetNode = (0, _reactDom.findDOMNode)(target);

      if (menuNode && targetNode) {
        var _window = window,
            innerWidth = _window.innerWidth,
            pageYOffset = _window.pageYOffset;

        var _targetNode$getBoundi = targetNode.getBoundingClientRect(),
            bottom = _targetNode$getBoundi.bottom,
            left = _targetNode$getBoundi.left,
            top = _targetNode$getBoundi.top,
            width = _targetNode$getBoundi.width;

        var newState = {
          left: align === 'right' ? 'auto' : left,
          right: align === 'left' ? 'auto' : innerWidth - left - width,
          top: dropup ? pageYOffset - menuNode.offsetHeight + top + DROPUP_SPACING : pageYOffset + bottom
        };

        // Don't update unless the target element position has changed.
        if (!(0, _isEqual2.default)(_this.state, newState)) {
          _this.setState(newState);
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Overlay, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._mounted = true;
      this._update();

      this._updateThrottled = requestAnimationFrame.bind(null, this._update);

      window.addEventListener('resize', this._updateThrottled);
      window.addEventListener('scroll', this._updateThrottled, true);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var onMenuHide = nextProps.onMenuHide,
          onMenuShow = nextProps.onMenuShow,
          show = nextProps.show;


      if (this.props.show && !show) {
        onMenuHide();
      }

      if (!this.props.show && show) {
        onMenuShow();
      }

      // Remove scoping classes if menu isn't being appended to document body.
      var _props = this.props,
          className = _props.className,
          container = _props.container;

      if (isBody(container) && !isBody(nextProps.container)) {
        var _container$classList2;

        container.classList.remove(BODY_CLASS);
        !!className && (_container$classList2 = container.classList).remove.apply(_container$classList2, _toConsumableArray(className.split(' ')));
      }

      this._updateThrottled();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._mounted = false;
      window.removeEventListener('resize', this._updateThrottled);
      window.removeEventListener('scroll', this._updateThrottled);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          children = _props2.children,
          container = _props2.container,
          show = _props2.show;


      if (!(show && _react.Children.count(children))) {
        return null;
      }

      var child = _react.Children.only(children);

      // When not attaching the overlay to `document.body` treat the child as a
      // simple inline element.
      if (!isBody(container)) {
        return child;
      }

      child = (0, _react.cloneElement)(child, _extends({}, child.props, {
        className: (0, _classnames2.default)(child.props.className, IGNORE_CLICK_OUTSIDE),
        ref: function ref(menu) {
          return _this2._menu = menu;
        },
        style: this.state
      }));

      return _react2.default.createElement(
        _Portal2.default,
        { container: container, ref: function ref(portal) {
            return _this2._portal = portal;
          } },
        child
      );
    }
  }]);

  return Overlay;
}(_react2.default.Component);

Overlay.propTypes = {
  children: _propTypes2.default.element,
  container: _componentOrElement2.default.isRequired,
  onMenuHide: _propTypes2.default.func.isRequired,
  onMenuShow: _propTypes2.default.func.isRequired,
  show: _propTypes2.default.bool,
  target: _componentOrElement2.default.isRequired
};

Overlay.defaultProps = {
  show: false
};

exports.default = Overlay;