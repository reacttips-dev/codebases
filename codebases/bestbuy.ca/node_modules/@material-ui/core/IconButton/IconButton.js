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

var _colorManipulator = require("../styles/colorManipulator");

var _ButtonBase = _interopRequireDefault(require("../ButtonBase"));

var _helpers = require("../utils/helpers");

// @inheritedComponent ButtonBase
var styles = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      textAlign: 'center',
      flex: '0 0 auto',
      fontSize: theme.typography.pxToRem(24),
      width: 48,
      height: 48,
      padding: 0,
      borderRadius: '50%',
      color: theme.palette.action.active,
      transition: theme.transitions.create('background-color', {
        duration: theme.transitions.duration.shortest
      }),
      '&:hover': {
        backgroundColor: (0, _colorManipulator.fade)(theme.palette.action.active, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        },
        '&$disabled': {
          backgroundColor: 'transparent'
        }
      },
      '&$disabled': {
        color: theme.palette.action.disabled
      }
    },

    /* Styles applied to the root element if `color="inherit"`. */
    colorInherit: {
      color: 'inherit'
    },

    /* Styles applied to the root element if `color="primary"`. */
    colorPrimary: {
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: (0, _colorManipulator.fade)(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      }
    },

    /* Styles applied to the root element if `color="secondary"`. */
    colorSecondary: {
      color: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: (0, _colorManipulator.fade)(theme.palette.secondary.main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      }
    },

    /* Styles applied to the root element if `disabled={true}`. */
    disabled: {},

    /* Styles applied to the children container element. */
    label: {
      width: '100%',
      display: 'flex',
      alignItems: 'inherit',
      justifyContent: 'inherit'
    }
  };
};
/**
 * Refer to the [Icons](/style/icons) section of the documentation
 * regarding the available icon options.
 */


exports.styles = styles;

function IconButton(props) {
  var _classNames;

  var children = props.children,
      classes = props.classes,
      className = props.className,
      color = props.color,
      disabled = props.disabled,
      other = (0, _objectWithoutProperties2.default)(props, ["children", "classes", "className", "color", "disabled"]);
  return _react.default.createElement(_ButtonBase.default, (0, _extends2.default)({
    className: (0, _classnames.default)(classes.root, (_classNames = {}, (0, _defineProperty2.default)(_classNames, classes["color".concat((0, _helpers.capitalize)(color))], color !== 'default'), (0, _defineProperty2.default)(_classNames, classes.disabled, disabled), _classNames), className),
    centerRipple: true,
    focusRipple: true,
    disabled: disabled
  }, other), _react.default.createElement("span", {
    className: classes.label
  }, children));
}

IconButton.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * The icon element.
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
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color: _propTypes.default.oneOf(['default', 'inherit', 'primary', 'secondary']),

  /**
   * If `true`, the button will be disabled.
   */
  disabled: _propTypes.default.bool,

  /**
   * If `true`, the ripple will be disabled.
   */
  disableRipple: _propTypes.default.bool
} : {};
IconButton.defaultProps = {
  color: 'default',
  disabled: false
};

var _default = (0, _withStyles.default)(styles, {
  name: 'MuiIconButton'
})(IconButton);

exports.default = _default;