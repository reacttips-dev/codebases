'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import devLogger from 'react-utils/devLogger';
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import Controllable from '../decorators/Controllable';
import SythenticEvent from '../core/SyntheticEvent';
import UICheckbox from '../input/UICheckbox';
import UIRadioInput from '../input/UIRadioInput';
import { uniqueId } from '../utils/underscore';
import { stopPropagationHandler } from '../utils/DomEvents';
import ActiveProvider from '../providers/ActiveProvider';
import HoverProvider from '../providers/HoverProvider';
import { hidden } from '../utils/propTypes/decorators';

var UISelectableBox = /*#__PURE__*/function (_Component) {
  _inherits(UISelectableBox, _Component);

  function UISelectableBox(props) {
    var _this;

    _classCallCheck(this, UISelectableBox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UISelectableBox).call(this, props));

    _this.handleClick = function (evt) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          onSelectedChange = _this$props.onSelectedChange,
          selected = _this$props.selected,
          type = _this$props.type,
          disabled = _this$props.disabled,
          readOnly = _this$props.readOnly;

      if (disabled || readOnly) {
        evt.preventDefault();
        evt.stopPropagation();
        return;
      }

      if (type !== 'radio') {
        onSelectedChange(SythenticEvent(!selected));
      }

      if (onClick) onClick(evt);
    };

    _this.handleKeyPress = function (evt) {
      if (evt.target.type === 'checkbox') return;
      var key = evt.key; // treat enter or space key like a click event

      if (key === 'Enter' || key === ' ') {
        evt.preventDefault();

        _this.handleClick();
      }
    };

    _this._id = uniqueId('bsb-');
    return _this;
  }

  _createClass(UISelectableBox, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          __active = _this$props2.active,
          block = _this$props2.block,
          _children = _this$props2.children,
          className = _this$props2.className,
          disabled = _this$props2.disabled,
          flush = _this$props2.flush,
          height = _this$props2.height,
          __hovered = _this$props2.hovered,
          innerClassName = _this$props2.innerClassName,
          name = _this$props2.name,
          __onClick = _this$props2.onClick,
          __onSelectedChange = _this$props2.onSelectedChange,
          padded = _this$props2.padded,
          readOnly = _this$props2.readOnly,
          selected = _this$props2.selected,
          selectionMarkLocation = _this$props2.selectionMarkLocation,
          tabIndex = _this$props2.tabIndex,
          type = _this$props2.type,
          width = _this$props2.width,
          rest = _objectWithoutProperties(_this$props2, ["active", "block", "children", "className", "disabled", "flush", "height", "hovered", "innerClassName", "name", "onClick", "onSelectedChange", "padded", "readOnly", "selected", "selectionMarkLocation", "tabIndex", "type", "width"]);

      return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, this.props, {
        children: function children(hoverProviderProps) {
          return /*#__PURE__*/_jsx(ActiveProvider, Object.assign({}, _this2.props, {
            children: function children(activeProviderProps) {
              var active = activeProviderProps.active,
                  activeProviderRestProps = _objectWithoutProperties(activeProviderProps, ["active"]);

              var hovered = hoverProviderProps.hovered,
                  hoverProviderRestProps = _objectWithoutProperties(hoverProviderProps, ["hovered"]);

              var computedClassName = classNames("uiButton private-button private-selectable-box", className, disabled ? 'disabled private-button--disabled' : hovered && !readOnly && 'private-selectable-box--hovered', active && 'private-button--active', selected && 'private-selectable-box--selected', block && 'private-button--block', padded && 'private-selectable-box--padded', flush && 'private-selectable-box--flush', readOnly && 'private-selectable-box--readonly');
              var renderedSelectionMark = null;

              if (type !== 'default') {
                var selectionMarkClassname = classNames('private-selectable-box__selection-mark', {
                  'left': 'private-selectable-box__selection-mark--left',
                  'top-right': 'private-selectable-box__selection-mark--top-right'
                }[selectionMarkLocation]);

                if (type === 'checkbox') {
                  renderedSelectionMark = /*#__PURE__*/_jsx("div", {
                    className: selectionMarkClassname,
                    children: /*#__PURE__*/_jsx(UICheckbox, {
                      "aria-labelledby": _this2._id,
                      checked: selected,
                      disabled: disabled,
                      innerPadding: "none",
                      name: name,
                      onChange: _this2.handleClick,
                      onClick: stopPropagationHandler,
                      readOnly: readOnly
                    })
                  });
                }

                if (type === 'radio') {
                  if (process.env.NODE_ENV !== 'production' && !name) {
                    devLogger.warn({
                      message: 'UISelectableBox: If type is set to radio you must provide a name',
                      key: 'UISelectableBox: no name value'
                    });
                  }

                  renderedSelectionMark = /*#__PURE__*/_jsx("div", {
                    className: selectionMarkClassname,
                    children: /*#__PURE__*/_jsx(UIRadioInput, {
                      "aria-labelledby": _this2._id,
                      checked: selected,
                      disabled: disabled,
                      name: name,
                      onChange: _this2.handleClick,
                      onClick: stopPropagationHandler,
                      readOnly: readOnly
                    })
                  });
                }
              }

              var tabbableByDefault = !disabled && type === 'default';
              var defaultTabIndex = tabbableByDefault ? 0 : null;
              return (
                /*#__PURE__*/
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                _jsxs("div", Object.assign({}, rest, {}, activeProviderRestProps, {}, hoverProviderRestProps, {
                  "aria-checked": selected,
                  "aria-disabled": disabled,
                  className: computedClassName,
                  onClick: _this2.handleClick,
                  onKeyPress: _this2.handleKeyPress,
                  role: type === 'radio' ? 'radio' : 'checkbox',
                  tabIndex: typeof tabIndex === 'number' ? tabIndex : defaultTabIndex,
                  children: [renderedSelectionMark, /*#__PURE__*/_jsx("div", {
                    className: classNames('private-selectable-box__inner', innerClassName),
                    id: _this2._id,
                    style: {
                      height: height,
                      width: width
                    },
                    children: _children
                  })]
                }))
              );
            }
          }));
        }
      }));
    }
  }]);

  return UISelectableBox;
}(Component);

UISelectableBox.propTypes = {
  active: hidden(PropTypes.bool),
  'aria-checked': PropTypes.bool,
  block: PropTypes.bool,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool.isRequired,
  flush: PropTypes.bool,
  height: PropTypes.number,
  hovered: hidden(PropTypes.bool),
  innerClassName: PropTypes.string,
  name: PropTypes.string,

  /**
   * A `Controllable` function that is called when the `selected` value changes
   * in non-`radio` `type`s. To control `radio`s, use `onClick` instead.
   */
  onSelectedChange: PropTypes.func,
  padded: PropTypes.bool,
  readOnly: PropTypes.bool,
  selected: PropTypes.bool,
  selectionMarkLocation: PropTypes.oneOf(['left', 'top-right']),
  type: PropTypes.oneOf(['default', 'checkbox', 'radio']).isRequired,
  width: PropTypes.number
};
UISelectableBox.defaultProps = {
  disabled: false,
  padded: true,
  readOnly: false,
  selected: false,
  type: 'default'
};
UISelectableBox.displayName = 'UISelectableBox';
export default Controllable(UISelectableBox, ['selected']);