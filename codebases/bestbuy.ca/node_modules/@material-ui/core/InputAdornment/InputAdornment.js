"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.styles = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Typography = _interopRequireDefault(require("../Typography"));

var _withStyles = _interopRequireDefault(require("../styles/withStyles"));

var styles = {
  /* Styles applied to the root element. */
  root: {
    display: 'flex',
    maxHeight: '2em',
    alignItems: 'center'
  },

  /* Styles applied to the root element if `position="start"`. */
  positionStart: {
    marginRight: 8
  },

  /* Styles applied to the root element if `position="end"`. */
  positionEnd: {
    marginLeft: 8
  }
};
exports.styles = styles;

function InputAdornment(props) {
  var _classNames;

  var children = props.children,
      Component = props.component,
      classes = props.classes,
      className = props.className,
      disableTypography = props.disableTypography,
      position = props.position,
      other = (0, _objectWithoutProperties2.default)(props, ["children", "component", "classes", "className", "disableTypography", "position"]);
  return _react.default.createElement(Component, (0, _extends2.default)({
    className: (0, _classnames.default)(classes.root, (_classNames = {}, (0, _defineProperty2.default)(_classNames, classes.positionStart, position === 'start'), (0, _defineProperty2.default)(_classNames, classes.positionEnd, position === 'end'), _classNames), className)
  }, other), typeof children === 'string' && !disableTypography ? _react.default.createElement(_Typography.default, {
    color: "textSecondary"
  }, children) : children);
}

InputAdornment.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * The content of the component, normally an `IconButton` or string.
   */
  children: _propTypes.default.node.isRequired,

  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css-api) below for more details.
   */
  classes: _propTypes.default.object.isRequired,

  /**
   * @ignore
   */
  className: _propTypes.default.string,

  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func, _propTypes.default.object]),

  /**
   * If children is a string then disable wrapping in a Typography component.
   */
  disableTypography: _propTypes.default.bool,

  /**
   * The position this adornment should appear relative to the `Input`.
   */
  position: _propTypes.default.oneOf(['start', 'end'])
} : {};
InputAdornment.defaultProps = {
  component: 'div',
  disableTypography: false
};

var _default = (0, _withStyles.default)(styles, {
  name: 'MuiInputAdornment'
})(InputAdornment);

exports.default = _default;