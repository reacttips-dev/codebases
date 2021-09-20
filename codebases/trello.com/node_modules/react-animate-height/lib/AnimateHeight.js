'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ANIMATION_STATE_CLASSES = {
  animating: 'rah-animating',
  animatingUp: 'rah-animating--up',
  animatingDown: 'rah-animating--down',
  animatingToHeightZero: 'rah-animating--to-height-zero',
  animatingToHeightAuto: 'rah-animating--to-height-auto',
  animatingToHeightSpecific: 'rah-animating--to-height-specific',
  static: 'rah-static',
  staticHeightZero: 'rah-static--height-zero',
  staticHeightAuto: 'rah-static--height-auto',
  staticHeightSpecific: 'rah-static--height-specific'
};

var PROPS_TO_OMIT = ['animateOpacity', 'animationStateClasses', 'applyInlineTransitions', 'children', 'contentClassName', 'delay', 'duration', 'easing', 'height', 'onAnimationEnd', 'onAnimationStart'];

function omit(obj) {
  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  if (!keys.length) {
    return obj;
  }

  var res = {};
  var objectKeys = Object.keys(obj);

  for (var i = 0; i < objectKeys.length; i++) {
    var key = objectKeys[i];

    if (keys.indexOf(key) === -1) {
      res[key] = obj[key];
    }
  }

  return res;
}

// Start animation helper using nested requestAnimationFrames
function startAnimationHelper(callback) {
  var requestAnimationFrameIDs = [];

  requestAnimationFrameIDs[0] = requestAnimationFrame(function () {
    requestAnimationFrameIDs[1] = requestAnimationFrame(function () {
      callback();
    });
  });

  return requestAnimationFrameIDs;
}

function cancelAnimationFrames(requestAnimationFrameIDs) {
  requestAnimationFrameIDs.forEach(function (id) {
    return cancelAnimationFrame(id);
  });
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isPercentage(height) {
  // Percentage height
  return typeof height === 'string' && height.search('%') === height.length - 1 && isNumber(height.substr(0, height.length - 1));
}

function runCallback(callback, params) {
  if (callback && typeof callback === 'function') {
    callback(params);
  }
}

var AnimateHeight = function (_React$Component) {
  _inherits(AnimateHeight, _React$Component);

  function AnimateHeight(props) {
    _classCallCheck(this, AnimateHeight);

    var _this = _possibleConstructorReturn(this, (AnimateHeight.__proto__ || Object.getPrototypeOf(AnimateHeight)).call(this, props));

    _this.animationFrameIDs = [];

    var height = 'auto';
    var overflow = 'visible';

    if (isNumber(props.height)) {
      // If value is string "0" make sure we convert it to number 0
      height = props.height < 0 || props.height === '0' ? 0 : props.height;
      overflow = 'hidden';
    } else if (isPercentage(props.height)) {
      // If value is string "0%" make sure we convert it to number 0
      height = props.height === '0%' ? 0 : props.height;
      overflow = 'hidden';
    }

    _this.animationStateClasses = _extends({}, ANIMATION_STATE_CLASSES, props.animationStateClasses);

    var animationStateClasses = _this.getStaticStateClasses(height);

    _this.state = {
      animationStateClasses: animationStateClasses,
      height: height,
      overflow: overflow,
      shouldUseTransitions: false
    };
    return _this;
  }

  _createClass(AnimateHeight, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var height = this.state.height;

      // Hide content if height is 0 (to prevent tabbing into it)
      // Check for contentElement is added cause this would fail in tests (react-test-renderer)
      // Read more here: https://github.com/Stanko/react-animate-height/issues/17

      if (this.contentElement && this.contentElement.style) {
        this.hideContent(height);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      var _props = this.props,
          delay = _props.delay,
          duration = _props.duration,
          height = _props.height,
          onAnimationEnd = _props.onAnimationEnd,
          onAnimationStart = _props.onAnimationStart;

      // Check if 'height' prop has changed

      if (this.contentElement && height !== prevProps.height) {
        var _cx;

        // Remove display: none from the content div
        // if it was hidden to prevent tabbing into it
        this.showContent(prevState.height);

        // Cache content height
        this.contentElement.style.overflow = 'hidden';
        var contentHeight = this.contentElement.offsetHeight;
        this.contentElement.style.overflow = '';

        // set total animation time
        var totalDuration = duration + delay;

        var newHeight = null;
        var timeoutState = {
          height: null, // it will be always set to either 'auto' or specific number
          overflow: 'hidden'
        };
        var isCurrentHeightAuto = prevState.height === 'auto';

        if (isNumber(height)) {
          // If value is string "0" make sure we convert it to number 0
          newHeight = height < 0 || height === '0' ? 0 : height;
          timeoutState.height = newHeight;
        } else if (isPercentage(height)) {
          // If value is string "0%" make sure we convert it to number 0
          newHeight = height === '0%' ? 0 : height;
          timeoutState.height = newHeight;
        } else {
          // If not, animate to content height
          // and then reset to auto
          newHeight = contentHeight; // TODO solve contentHeight = 0
          timeoutState.height = 'auto';
          timeoutState.overflow = null;
        }

        if (isCurrentHeightAuto) {
          // This is the height to be animated to
          timeoutState.height = newHeight;

          // If previous height was 'auto'
          // set starting height explicitly to be able to use transition
          newHeight = contentHeight;
        }

        // Animation classes
        var animationStateClasses = (0, _classnames2.default)((_cx = {}, _defineProperty(_cx, this.animationStateClasses.animating, true), _defineProperty(_cx, this.animationStateClasses.animatingUp, prevProps.height === 'auto' || height < prevProps.height), _defineProperty(_cx, this.animationStateClasses.animatingDown, height === 'auto' || height > prevProps.height), _defineProperty(_cx, this.animationStateClasses.animatingToHeightZero, timeoutState.height === 0), _defineProperty(_cx, this.animationStateClasses.animatingToHeightAuto, timeoutState.height === 'auto'), _defineProperty(_cx, this.animationStateClasses.animatingToHeightSpecific, timeoutState.height > 0), _cx));

        // Animation classes to be put after animation is complete
        var timeoutAnimationStateClasses = this.getStaticStateClasses(timeoutState.height);

        // Set starting height and animating classes
        // We are safe to call set state as it will not trigger infinite loop
        // because of the "height !== prevProps.height" check
        this.setState({ // eslint-disable-line react/no-did-update-set-state
          animationStateClasses: animationStateClasses,
          height: newHeight,
          overflow: 'hidden',
          // When animating from 'auto' we first need to set fixed height
          // that change should be animated
          shouldUseTransitions: !isCurrentHeightAuto
        });

        // Clear timeouts
        clearTimeout(this.timeoutID);
        clearTimeout(this.animationClassesTimeoutID);

        if (isCurrentHeightAuto) {
          // When animating from 'auto' we use a short timeout to start animation
          // after setting fixed height above
          timeoutState.shouldUseTransitions = true;

          cancelAnimationFrames(this.animationFrameIDs);
          this.animationFrameIDs = startAnimationHelper(function () {
            _this2.setState(timeoutState);

            // ANIMATION STARTS, run a callback if it exists
            runCallback(onAnimationStart, { newHeight: timeoutState.height });
          });

          // Set static classes and remove transitions when animation ends
          this.animationClassesTimeoutID = setTimeout(function () {
            _this2.setState({
              animationStateClasses: timeoutAnimationStateClasses,
              shouldUseTransitions: false
            });

            // ANIMATION ENDS
            // Hide content if height is 0 (to prevent tabbing into it)
            _this2.hideContent(timeoutState.height);
            // Run a callback if it exists
            runCallback(onAnimationEnd, { newHeight: timeoutState.height });
          }, totalDuration);
        } else {
          // ANIMATION STARTS, run a callback if it exists
          runCallback(onAnimationStart, { newHeight: newHeight });

          // Set end height, classes and remove transitions when animation is complete
          this.timeoutID = setTimeout(function () {
            timeoutState.animationStateClasses = timeoutAnimationStateClasses;
            timeoutState.shouldUseTransitions = false;

            _this2.setState(timeoutState);

            // ANIMATION ENDS
            // If height is auto, don't hide the content
            // (case when element is empty, therefore height is 0)
            if (height !== 'auto') {
              // Hide content if height is 0 (to prevent tabbing into it)
              _this2.hideContent(newHeight); // TODO solve newHeight = 0
            }
            // Run a callback if it exists
            runCallback(onAnimationEnd, { newHeight: newHeight });
          }, totalDuration);
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      cancelAnimationFrames(this.animationFrameIDs);

      clearTimeout(this.timeoutID);
      clearTimeout(this.animationClassesTimeoutID);

      this.timeoutID = null;
      this.animationClassesTimeoutID = null;
      this.animationStateClasses = null;
    }
  }, {
    key: 'showContent',
    value: function showContent(height) {
      if (height === 0) {
        this.contentElement.style.display = '';
      }
    }
  }, {
    key: 'hideContent',
    value: function hideContent(newHeight) {
      if (newHeight === 0) {
        this.contentElement.style.display = 'none';
      }
    }
  }, {
    key: 'getStaticStateClasses',
    value: function getStaticStateClasses(height) {
      var _cx2;

      return (0, _classnames2.default)((_cx2 = {}, _defineProperty(_cx2, this.animationStateClasses.static, true), _defineProperty(_cx2, this.animationStateClasses.staticHeightZero, height === 0), _defineProperty(_cx2, this.animationStateClasses.staticHeightSpecific, height > 0), _defineProperty(_cx2, this.animationStateClasses.staticHeightAuto, height === 'auto'), _cx2));
    }
  }, {
    key: 'render',
    value: function render() {
      var _cx3,
          _this3 = this;

      var _props2 = this.props,
          animateOpacity = _props2.animateOpacity,
          applyInlineTransitions = _props2.applyInlineTransitions,
          children = _props2.children,
          className = _props2.className,
          contentClassName = _props2.contentClassName,
          delay = _props2.delay,
          duration = _props2.duration,
          easing = _props2.easing,
          id = _props2.id,
          style = _props2.style;
      var _state = this.state,
          height = _state.height,
          overflow = _state.overflow,
          animationStateClasses = _state.animationStateClasses,
          shouldUseTransitions = _state.shouldUseTransitions;


      var componentStyle = _extends({}, style, {
        height: height,
        overflow: overflow || style.overflow
      });

      if (shouldUseTransitions && applyInlineTransitions) {
        componentStyle.transition = 'height ' + duration + 'ms ' + easing + ' ' + delay + 'ms';

        // Include transition passed through styles
        if (style.transition) {
          componentStyle.transition = style.transition + ', ' + componentStyle.transition;
        }

        // Add webkit vendor prefix still used by opera, blackberry...
        componentStyle.WebkitTransition = componentStyle.transition;
      }

      var contentStyle = {};

      if (animateOpacity) {
        contentStyle.transition = 'opacity ' + duration + 'ms ' + easing + ' ' + delay + 'ms';
        // Add webkit vendor prefix still used by opera, blackberry...
        contentStyle.WebkitTransition = contentStyle.transition;

        if (height === 0) {
          contentStyle.opacity = 0;
        }
      }

      var componentClasses = (0, _classnames2.default)((_cx3 = {}, _defineProperty(_cx3, animationStateClasses, true), _defineProperty(_cx3, className, className), _cx3));

      // Check if user passed aria-hidden prop
      var hasAriaHiddenProp = typeof this.props['aria-hidden'] !== 'undefined';
      var ariaHidden = hasAriaHiddenProp ? this.props['aria-hidden'] : height === 0;

      return _react2.default.createElement(
        'div',
        _extends({}, omit.apply(undefined, [this.props].concat(PROPS_TO_OMIT)), {
          'aria-hidden': ariaHidden,
          className: componentClasses,
          id: id,
          style: componentStyle
        }),
        _react2.default.createElement(
          'div',
          {
            className: contentClassName,
            style: contentStyle,
            ref: function ref(el) {
              return _this3.contentElement = el;
            }
          },
          children
        )
      );
    }
  }]);

  return AnimateHeight;
}(_react2.default.Component);

var heightPropType = function heightPropType(props, propName, componentName) {
  var value = props[propName];

  if (typeof value === 'number' && value >= 0 || isPercentage(value) || value === 'auto') {
    return null;
  }

  return new TypeError('value "' + value + '" of type "' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + '" is invalid type for ' + propName + ' in ' + componentName + '. ' + 'It needs to be a positive number, string "auto" or percentage string (e.g. "15%").');
};

AnimateHeight.propTypes = {
  'aria-hidden': _propTypes2.default.bool,
  animateOpacity: _propTypes2.default.bool,
  animationStateClasses: _propTypes2.default.object,
  applyInlineTransitions: _propTypes2.default.bool,
  children: _propTypes2.default.any.isRequired,
  className: _propTypes2.default.string,
  contentClassName: _propTypes2.default.string,
  delay: _propTypes2.default.number,
  duration: _propTypes2.default.number,
  easing: _propTypes2.default.string,
  height: heightPropType,
  id: _propTypes2.default.string,
  onAnimationEnd: _propTypes2.default.func,
  onAnimationStart: _propTypes2.default.func,
  style: _propTypes2.default.object
};

AnimateHeight.defaultProps = {
  animateOpacity: false,
  animationStateClasses: ANIMATION_STATE_CLASSES,
  applyInlineTransitions: true,
  duration: 250,
  delay: 0,
  easing: 'ease',
  style: {}
};

exports.default = AnimateHeight;