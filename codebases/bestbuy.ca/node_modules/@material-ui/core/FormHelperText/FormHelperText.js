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

var _withStyles = _interopRequireDefault(require("../styles/withStyles"));

var styles = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      color: theme.palette.text.secondary,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(12),
      textAlign: 'left',
      marginTop: 8,
      lineHeight: '1em',
      minHeight: '1em',
      margin: 0,
      '&$error': {
        color: theme.palette.error.main
      },
      '&$disabled': {
        color: theme.palette.text.disabled
      }
    },

    /* Styles applied to the root element if `error={true}`. */
    error: {},

    /* Styles applied to the root element if `disabled={true}`. */
    disabled: {},

    /* Styles applied to the root element if `margin="dense"`. */
    marginDense: {
      marginTop: 4
    },

    /* Styles applied to the root element if `focused={true}`. */
    focused: {},

    /* Styles applied to the root element if `filled={true}`. */
    filled: {},

    /* Styles applied to the root element if `required={true}`. */
    required: {}
  };
};

exports.styles = styles;

function FormHelperText(props, context) {
  var _classNames;

  var classes = props.classes,
      classNameProp = props.className,
      Component = props.component,
      disabledProp = props.disabled,
      errorProp = props.error,
      filledProp = props.filled,
      focusedProp = props.focused,
      marginProp = props.margin,
      requiredProp = props.required,
      other = (0, _objectWithoutProperties2.default)(props, ["classes", "className", "component", "disabled", "error", "filled", "focused", "margin", "required"]);
  var muiFormControl = context.muiFormControl;
  var disabled = disabledProp;
  var error = errorProp;
  var filled = filledProp;
  var focused = focusedProp;
  var margin = marginProp;
  var required = requiredProp;

  if (muiFormControl) {
    if (typeof disabled === 'undefined') {
      disabled = muiFormControl.disabled;
    }

    if (typeof error === 'undefined') {
      error = muiFormControl.error;
    }

    if (typeof margin === 'undefined') {
      margin = muiFormControl.margin;
    }

    if (typeof required === 'undefined') {
      required = muiFormControl.required;
    }

    if (typeof focused === 'undefined') {
      focused = muiFormControl.focused;
    }

    if (typeof filled === 'undefined') {
      filled = muiFormControl.filled;
    }
  }

  var className = (0, _classnames.default)(classes.root, (_classNames = {}, (0, _defineProperty2.default)(_classNames, classes.disabled, disabled), (0, _defineProperty2.default)(_classNames, classes.error, error), (0, _defineProperty2.default)(_classNames, classes.filled, filled), (0, _defineProperty2.default)(_classNames, classes.focused, focused), (0, _defineProperty2.default)(_classNames, classes.marginDense, margin === 'dense'), (0, _defineProperty2.default)(_classNames, classes.required, required), _classNames), classNameProp);
  return _react.default.createElement(Component, (0, _extends2.default)({
    className: className
  }, other));
}

FormHelperText.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * The content of the component.
   */
  children: _propTypes.default.node,

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
   * If `true`, the helper text should be displayed in a disabled state.
   */
  disabled: _propTypes.default.bool,

  /**
   * If `true`, helper text should be displayed in an error state.
   */
  error: _propTypes.default.bool,

  /**
   * If `true`, the helper text should use filled classes key.
   */
  filled: _propTypes.default.bool,

  /**
   * If `true`, the helper text should use focused classes key.
   */
  focused: _propTypes.default.bool,

  /**
   * If `dense`, will adjust vertical spacing. This is normally obtained via context from
   * FormControl.
   */
  margin: _propTypes.default.oneOf(['dense']),

  /**
   * If `true`, the helper text should use required classes key.
   */
  required: _propTypes.default.bool
} : {};
FormHelperText.defaultProps = {
  component: 'p'
};
FormHelperText.contextTypes = {
  muiFormControl: _propTypes.default.object
};

var _default = (0, _withStyles.default)(styles, {
  name: 'MuiFormHelperText'
})(FormHelperText);

exports.default = _default;