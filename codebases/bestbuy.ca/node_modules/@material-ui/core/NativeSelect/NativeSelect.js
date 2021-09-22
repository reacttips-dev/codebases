"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.styles = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _NativeSelectInput = _interopRequireDefault(require("./NativeSelectInput"));

var _withStyles = _interopRequireDefault(require("../styles/withStyles"));

var _ArrowDropDown = _interopRequireDefault(require("../internal/svg-icons/ArrowDropDown"));

var _Input = _interopRequireDefault(require("../Input"));

// @inheritedComponent Input
var styles = function styles(theme) {
  return {
    /* Styles applied to the `Input` component `root` class. */
    root: {
      position: 'relative',
      width: '100%'
    },

    /* Styles applied to the `Input` component `select` class. */
    select: {
      '-moz-appearance': 'none',
      // Reset
      '-webkit-appearance': 'none',
      // Reset
      // When interacting quickly, the text can end up selected.
      // Native select can't be selected either.
      userSelect: 'none',
      paddingRight: 32,
      width: 'calc(100% - 32px)',
      minWidth: 16,
      // So it doesn't collapse.
      cursor: 'pointer',
      '&:focus': {
        // Show that it's not an text input
        background: theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
        borderRadius: 0 // Reset Chrome style

      },
      // Remove Firefox focus border
      '&:-moz-focusring': {
        color: 'transparent',
        textShadow: '0 0 0 #000'
      },
      // Remove IE11 arrow
      '&::-ms-expand': {
        display: 'none'
      },
      '&$disabled': {
        cursor: 'default'
      }
    },

    /* Styles applied to the `Input` component `selectMenu` class. */
    selectMenu: {
      width: 'auto',
      // Fix Safari textOverflow
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      minHeight: '1.1875em' // Reset (19px), match the native input line-height

    },

    /* Styles applied to the `Input` component `disabled` class. */
    disabled: {},

    /* Styles applied to the `Input` component `icon` class. */
    icon: {
      // We use a position absolute over a flexbox in order to forward the pointer events
      // to the input.
      position: 'absolute',
      right: 0,
      top: 'calc(50% - 12px)',
      // Center vertically
      color: theme.palette.action.active,
      'pointer-events': 'none' // Don't block pointer events on the select under the icon.

    }
  };
};
/**
 * An alternative to `<Select native />` with a much smaller dependency graph.
 */


exports.styles = styles;

function NativeSelect(props) {
  var children = props.children,
      classes = props.classes,
      IconComponent = props.IconComponent,
      input = props.input,
      inputProps = props.inputProps,
      other = (0, _objectWithoutProperties2.default)(props, ["children", "classes", "IconComponent", "input", "inputProps"]);
  return _react.default.cloneElement(input, (0, _extends2.default)({
    // Most of the logic is implemented in `NativeSelectInput`.
    // The `Select` component is a simple API wrapper to expose something better to play with.
    inputComponent: _NativeSelectInput.default,
    inputProps: (0, _extends2.default)({
      children: children,
      classes: classes,
      IconComponent: IconComponent,
      type: undefined
    }, inputProps, input ? input.props.inputProps : {})
  }, other));
}

NativeSelect.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * The option elements to populate the select with.
   * Can be some `<option>` elements.
   */
  children: _propTypes.default.node,

  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css-api) below for more details.
   */
  classes: _propTypes.default.object.isRequired,

  /**
   * The icon that displays the arrow.
   */
  IconComponent: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func, _propTypes.default.object]),

  /**
   * An `Input` element; does not have to be a material-ui specific `Input`.
   */
  input: _propTypes.default.element,

  /**
   * Attributes applied to the `select` element.
   */
  inputProps: _propTypes.default.object,

  /**
   * Callback function fired when a menu item is selected.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value`.
   */
  onChange: _propTypes.default.func,

  /**
   * The input value.
   */
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool])
} : {};
NativeSelect.defaultProps = {
  IconComponent: _ArrowDropDown.default,
  input: _react.default.createElement(_Input.default, null)
};
NativeSelect.muiName = 'NativeSelect';

var _default = (0, _withStyles.default)(styles, {
  name: 'MuiNativeSelect'
})(NativeSelect);

exports.default = _default;