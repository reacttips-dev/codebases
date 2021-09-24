'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { cloneElement, Component, Children } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { DISTANCE_MEASUREMENT_EXTRA_SMALL, MERCURY_LAYER, VENUS_LAYER } from 'HubStyleTokens/sizes';
import getComponentName from 'react-utils/getComponentName';
import devLogger from 'react-utils/devLogger';
import UIFieldset from './UIFieldset';
import UIFormControl from './UIFormControl';
import Small from '../elements/Small';
import { hidden } from '../utils/propTypes/decorators';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import { uniqueId } from '../utils/underscore';
import { FONT_FAMILIES } from '../utils/Styles';
import deprecated from '../utils/propTypes/deprecated';
import { warnIfFragment } from '../utils/devWarnings';

var descriptionWarningMessage = function descriptionWarningMessage() {
  return {
    message: "UIInputGroup: the `description` prop has been deprecated. Please use the `help` prop instead.",
    key: "UIInputGroup: description prop"
  };
};

var getLengthValue = function getLengthValue(length) {
  var computedLength;

  if (typeof length === 'boolean') {
    computedLength = length ? DISTANCE_MEASUREMENT_EXTRA_SMALL : false;
  }

  if (typeof length === 'string') {
    computedLength = length;
  }

  if (typeof length === 'number') {
    computedLength = parseInt(length, 10) + "px";
  }

  return computedLength;
};

var formGroupStartStyles = css([".private-form__control{border-bottom-right-radius:0;border-top-right-radius:0;}"]);
var formGroupEndStyles = css([".private-form__control{border-top-left-radius:0;border-bottom-left-radius:0;}"]);
var formGroupMemberMediaBodyStyles = css(["flex:1 1 0%;min-width:0;"]);
var InputGroupImpl = styled.div.withConfig({
  displayName: "UIInputGroup__InputGroupImpl",
  componentId: "v8qy8r-0"
})(["display:", ";> *{.private-form__control{&.private-form__control--error{position:relative;z-index:", ";}&:focus{position:relative;z-index:", ";}}", ";", ";}>:not(:first-child){", ";", ";}>:not(:last-child){", ";", ";}.private-form__set + .private-form__set{margin-top:0;margin-left:", ";}"], function (_ref) {
  var inline = _ref.inline;
  return inline ? 'inline-flex' : 'flex';
}, MERCURY_LAYER, VENUS_LAYER, function (props) {
  return props.use === 'itemBoth' && css([":not(:first-child):not(:last-child){", ";}"], formGroupMemberMediaBodyStyles);
}, function (props) {
  return props.use === 'flex' && formGroupMemberMediaBodyStyles;
}, function (props) {
  return !getLengthValue(props.gap) && formGroupEndStyles;
}, function (props) {
  return props.use === 'itemLeft' && formGroupMemberMediaBodyStyles;
}, function (props) {
  return !getLengthValue(props.gap) && formGroupStartStyles;
}, function (props) {
  return props.use === 'itemRight' && formGroupMemberMediaBodyStyles;
}, function (props) {
  return !getLengthValue(props.gap) ? "-1px" : props.gap;
});
var InputGroupLegend = styled(UIFieldset.defaultProps.Legend).withConfig({
  displayName: "UIInputGroup__InputGroupLegend",
  componentId: "v8qy8r-1"
})(["", ";"], FONT_FAMILIES.medium);

var UIInputGroup = /*#__PURE__*/function (_Component) {
  _inherits(UIInputGroup, _Component);

  function UIInputGroup(props) {
    var _this;

    _classCallCheck(this, UIInputGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIInputGroup).call(this, props));
    _this._legendId = "input-group-" + uniqueId();
    return _this;
  }

  _createClass(UIInputGroup, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          ariaLabelledBy = _this$props['aria-labelledby'],
          children = _this$props.children,
          className = _this$props.className,
          description = _this$props.description,
          disabled = _this$props.disabled,
          error = _this$props.error,
          Fieldset = _this$props.Fieldset,
          gap = _this$props.gap,
          help = _this$props.help,
          inline = _this$props.inline,
          legend = _this$props.label,
          required = _this$props.required,
          tabIndex = _this$props.tabIndex,
          tooltip = _this$props.tooltip,
          tooltipPlacement = _this$props.tooltipPlacement,
          use = _this$props.use,
          validationMessage = _this$props.validationMessage,
          rest = _objectWithoutProperties(_this$props, ["aria-labelledby", "children", "className", "description", "disabled", "error", "Fieldset", "gap", "help", "inline", "label", "required", "tabIndex", "tooltip", "tooltipPlacement", "use", "validationMessage"]);

      var computedClassName = classNames("private-form__set private-input-group", className); // Render child UIFormControl's `validationMessage` prop

      var formControlWithError = Children.toArray(children).find(function (child) {
        return child && child.props && child.props.error && child.props.validationMessage;
      });
      var computedError = error || formControlWithError && formControlWithError.props.error;
      var computedValidationMessage = validationMessage || formControlWithError && formControlWithError.props.validationMessage;
      return /*#__PURE__*/_jsxs(Fieldset, Object.assign({}, rest, {
        className: computedClassName,
        disabled: disabled,
        help: help,
        Legend: InputGroupLegend,
        legend: legend,
        legendId: this._legendId,
        tabIndex: tabIndex,
        tooltip: tooltip,
        tooltipPlacement: tooltipPlacement,
        _required: required,
        children: [/*#__PURE__*/_jsx(InputGroupImpl, {
          gap: getLengthValue(gap),
          inline: inline,
          use: use,
          children: Children.map(children, function (child) {
            if (child == null) {
              return null;
            }

            warnIfFragment(child, UIInputGroup.displayName);
            var ariaLabel = child.props['aria-label'];
            var labelledBy = ariaLabelledBy || child.props['aria-labelledby'];

            if (process.env.NODE_ENV !== 'production' && getComponentName(child) === UIFormControl.displayName && !ariaLabel && !labelledBy) {
              devLogger.warn({
                message: 'UIInputGroup: You must add an `aria-label` to each `UIFormControl` to describe the specific field in this input group. Alternatively, set `UIFormControl[aria-labelledby]` to the ID of an existing label element.',
                key: 'UIInputGroup: aria-label',
                url: 'https://tools.hubteamqa.com/ui-library/show/UIComponents/form/UIInputGroup#uiinputgroup/basic'
              });
            }

            return /*#__PURE__*/cloneElement(child, {
              'aria-labelledby': ariaLabel ? '' : classNames(legend ? _this2._legendId : labelledBy, child.props['aria-labelledby']),
              required: child.props.required || required,
              // These props are rendered by the inputgroup instead of the formcontrol
              description: null,
              help: null,
              tooltip: null,
              validationMessage: null
            });
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "private-inputgroup__meta private-form__meta",
          children: /*#__PURE__*/_jsx("div", {
            className: "private-form__messages",
            "aria-hidden": "true",
            children: computedError && computedValidationMessage && /*#__PURE__*/_jsx(Small, {
              className: "private-form__validation",
              tabIndex: -1,
              use: "error",
              children: computedValidationMessage
            })
          })
        }), description && /*#__PURE__*/_jsx(Small, {
          className: "private-form__description",
          tabIndex: -1,
          use: "help",
          children: description
        })]
      }));
    }
  }]);

  return UIInputGroup;
}(Component);

export { UIInputGroup as default };
UIInputGroup.propTypes = {
  'aria-labelledby': PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  description: deprecated(PropTypes.node, descriptionWarningMessage),
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  Fieldset: getComponentPropType(UIFieldset).isRequired,
  help: UIFormControl.propTypes.help,
  gap: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  inline: hidden(PropTypes.bool),
  label: PropTypes.node,
  required: PropTypes.bool,
  tooltip: UIFormControl.propTypes.tooltip,
  tooltipPlacement: UIFormControl.propTypes.tooltipPlacement,
  use: PropTypes.oneOf(['flex', 'itemLeft', 'itemRight', 'itemBoth', 'none']),
  validationMessage: PropTypes.node
};
UIInputGroup.defaultProps = {
  error: false,
  Fieldset: UIFieldset,
  gap: false,
  inline: false,
  tabIndex: 0,
  tooltipPlacement: 'top',
  use: 'flex'
};
UIInputGroup.displayName = 'UIInputGroup';