"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react", "prop-types"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"), require("prop-types"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.React, global.propTypes);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _react, _propTypes) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _react2 = _interopRequireDefault(_react);

  var _propTypes2 = _interopRequireDefault(_propTypes);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var TextTruncate = function (_Component) {
    _inherits(TextTruncate, _Component);

    function TextTruncate() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, TextTruncate);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TextTruncate)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "onResize", function () {
        if (_this.rafId) {
          window.cancelAnimationFrame(_this.rafId);
        }

        _this.rafId = window.requestAnimationFrame(_this.update.bind(_assertThisInitialized(_this)));
      });

      _defineProperty(_assertThisInitialized(_this), "onToggled", function (truncated) {
        typeof _this.props.onToggled === 'function' && setTimeout(function () {
          return _this.props.onToggled(truncated);
        }, 0);
      });

      _defineProperty(_assertThisInitialized(_this), "onTruncated", function () {
        typeof _this.props.onTruncated === 'function' && setTimeout(function () {
          return _this.props.onTruncated();
        }, 0);
      });

      _defineProperty(_assertThisInitialized(_this), "onCalculated", function () {
        typeof _this.props.onCalculated === 'function' && setTimeout(function () {
          return _this.props.onCalculated();
        }, 0);
      });

      _defineProperty(_assertThisInitialized(_this), "update", function () {
        var style = window.getComputedStyle(_this.scope);
        var font = [style['font-weight'], style['font-style'], style['font-size'], style['font-family'], style['letter-spacing']].join(' ');
        _this.canvas.font = font;

        _this.forceUpdate();
      });

      return _this;
    }

    _createClass(TextTruncate, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var canvas = document.createElement('canvas');
        var docFragment = document.createDocumentFragment();
        var style = window.getComputedStyle(this.scope);
        var font = [style['font-weight'], style['font-style'], style['font-size'], style['font-family']].join(' ');
        docFragment.appendChild(canvas);
        this.canvas = canvas.getContext('2d');
        this.canvas.font = font;
        this.forceUpdate();
        window.addEventListener('resize', this.onResize);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);

        if (this.rafId) {
          window.cancelAnimationFrame(this.rafId);
        }
      }
    }, {
      key: "measureWidth",
      value: function measureWidth(text) {
        return Math.ceil(this.canvas.measureText(text).width);
      }
    }, {
      key: "getRenderText",
      value: function getRenderText() {
        var _this$props = this.props,
            containerClassName = _this$props.containerClassName,
            element = _this$props.element,
            line = _this$props.line,
            onCalculated = _this$props.onCalculated,
            onTruncated = _this$props.onTruncated,
            onToggled = _this$props.onToggled,
            text = _this$props.text,
            textElement = _this$props.textElement,
            textTruncateChild = _this$props.textTruncateChild,
            truncateText = _this$props.truncateText,
            maxCalculateTimes = _this$props.maxCalculateTimes,
            props = _objectWithoutProperties(_this$props, ["containerClassName", "element", "line", "onCalculated", "onTruncated", "onToggled", "text", "textElement", "textTruncateChild", "truncateText", "maxCalculateTimes"]);

        var scopeWidth = this.scope.getBoundingClientRect().width; // return if display:none

        if (scopeWidth === 0) {
          return null;
        } // return if all of text can be displayed


        if (scopeWidth >= this.measureWidth(text)) {
          this.onToggled(false);
          return (0, _react.createElement)(textElement, props, text);
        }

        var childText = '';

        if (textTruncateChild && typeof textTruncateChild.type === 'string') {
          var type = textTruncateChild.type;

          if (type.indexOf('span') >= 0 || type.indexOf('a') >= 0) {
            childText = textTruncateChild.props.children;
          }
        }

        var currentPos = 1;
        var maxTextLength = text.length;
        var truncatedText = '';
        var splitPos = 0;
        var startPos = 0;
        var displayLine = line;
        var width = 0;
        var lastIsEng = false;
        var isPrevLineWithoutSpace = false;
        var lastPos = 0;
        var lastSpaceIndex = -1;
        var ext = '';
        var loopCnt = 0;

        while (displayLine-- > 0) {
          ext = displayLine ? '' : truncateText + (childText ? ' ' + childText : '');

          while (currentPos <= maxTextLength) {
            truncatedText = text.substr(startPos, currentPos);
            width = this.measureWidth(truncatedText + ext);

            if (width < scopeWidth) {
              splitPos = text.indexOf(' ', currentPos + 1);

              if (splitPos === -1) {
                currentPos += 1;
                lastIsEng = false;
              } else {
                lastIsEng = true;
                currentPos = splitPos;
              }
            } else {
              do {
                if (loopCnt++ >= maxCalculateTimes) {
                  break;
                }

                truncatedText = text.substr(startPos, currentPos);

                if (!displayLine) {
                  currentPos--;
                }

                if (truncatedText[truncatedText.length - 1] === ' ') {
                  truncatedText = text.substr(startPos, currentPos - 1);
                }

                if (lastIsEng) {
                  lastSpaceIndex = truncatedText.lastIndexOf(' ');

                  if (lastSpaceIndex > -1) {
                    currentPos = lastSpaceIndex;

                    if (displayLine) {
                      currentPos++;
                    }

                    truncatedText = text.substr(startPos, currentPos);
                  } else {
                    currentPos--;
                    truncatedText = text.substr(startPos, currentPos);
                  }
                } else {
                  currentPos--;
                  truncatedText = text.substr(startPos, currentPos);
                }

                width = this.measureWidth(truncatedText + ext);
              } while (width >= scopeWidth && truncatedText.length > 0);

              startPos += currentPos;
              break;
            }
          }

          if (currentPos >= maxTextLength) {
            startPos = maxTextLength;
            break;
          }

          if (lastIsEng && !isPrevLineWithoutSpace && text.substr(lastPos, currentPos).indexOf(' ') === -1) {
            isPrevLineWithoutSpace = text.substr(lastPos, currentPos).indexOf(' ') === -1;
            displayLine--;
          }

          lastPos = currentPos + 1;
        }

        if (startPos === maxTextLength) {
          this.onToggled(false);
          return (0, _react.createElement)(textElement, props, text);
        }

        this.onTruncated();
        this.onToggled(true);
        return _react2["default"].createElement("span", props, (0, _react.createElement)(textElement, props, text.substr(0, startPos) + truncateText + ' '), textTruncateChild);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props2 = this.props,
            element = _this$props2.element,
            text = _this$props2.text,
            _this$props2$style = _this$props2.style,
            style = _this$props2$style === void 0 ? {} : _this$props2$style,
            containerClassName = _this$props2.containerClassName,
            line = _this$props2.line,
            onCalculated = _this$props2.onCalculated,
            onTruncated = _this$props2.onTruncated,
            onToggled = _this$props2.onToggled,
            textElement = _this$props2.textElement,
            textTruncateChild = _this$props2.textTruncateChild,
            truncateText = _this$props2.truncateText,
            maxCalculateTimes = _this$props2.maxCalculateTimes,
            props = _objectWithoutProperties(_this$props2, ["element", "text", "style", "containerClassName", "line", "onCalculated", "onTruncated", "onToggled", "textElement", "textTruncateChild", "truncateText", "maxCalculateTimes"]);

        var fontWeight = style.fontWeight,
            fontStyle = style.fontStyle,
            fontSize = style.fontSize,
            fontFamily = style.fontFamily;
        var renderText = this.scope && line ? this.getRenderText() : (0, _react.createElement)(textElement, props, text);
        ;
        var rootProps = {
          ref: function ref(el) {
            _this2.scope = el;
          },
          className: containerClassName,
          style: {
            overflow: 'hidden',
            fontWeight: fontWeight,
            fontStyle: fontStyle,
            fontSize: fontSize,
            fontFamily: fontFamily
          }
        };
        this.scope && this.onCalculated();
        return (0, _react.createElement)(element, rootProps, renderText);
      }
    }]);

    return TextTruncate;
  }(_react.Component);

  _defineProperty(TextTruncate, "propTypes", {
    containerClassName: _propTypes2["default"].string,
    element: _propTypes2["default"].string,
    line: _propTypes2["default"].oneOfType([_propTypes2["default"].number, _propTypes2["default"].bool]),
    onCalculated: _propTypes2["default"].func,
    onTruncated: _propTypes2["default"].func,
    onToggled: _propTypes2["default"].func,
    text: _propTypes2["default"].string,
    textElement: _propTypes2["default"].node,
    textTruncateChild: _propTypes2["default"].node,
    truncateText: _propTypes2["default"].string,
    maxCalculateTimes: _propTypes2["default"].number
  });

  _defineProperty(TextTruncate, "defaultProps", {
    element: 'div',
    line: 1,
    text: '',
    textElement: 'span',
    truncateText: '…',
    maxCalculateTimes: 10
  });

  exports.default = TextTruncate;
  ;
  module.exports = exports.default;
});
