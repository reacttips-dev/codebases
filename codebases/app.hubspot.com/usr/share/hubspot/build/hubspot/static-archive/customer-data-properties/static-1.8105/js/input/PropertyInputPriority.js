'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import omit from 'transmute/omit';
import { Seq, Map as ImmutableMap } from 'immutable';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { makeOptionsFromProperty, makeOptionsFromPropertyWithoutBlankOptions } from 'customer-data-property-utils/PropertyValueDisplay';
import UIStatusDot from 'UIComponents/tag/UIStatusDot';
import classNames from 'classnames';
import UISelect from 'UIComponents/input/UISelect';
var PRIORITY_TO_STATUS_TAG_TYPE_MAP = ImmutableMap({
  low: 'active',
  medium: 'warning',
  high: 'danger'
});
var propTypes = {
  defaultValue: PropTypes.node,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  isRequired: PropTypes.bool,
  placeholder: PropTypes.node,
  value: PropTypes.node,
  disableOptionsStatusDot: PropTypes.bool,
  disableValueStatusDot: PropTypes.bool
};

var PropertyInputPriority = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputPriority, _Component);

  function PropertyInputPriority(props) {
    var _this;

    _classCallCheck(this, PropertyInputPriority);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputPriority).call(this, props));
    _this.getOptions = _this.getOptions.bind(_assertThisInitialized(_this));
    _this.renderOptionWithStatusTag = _this.renderOptionWithStatusTag.bind(_assertThisInitialized(_this));
    _this.renderValueWithStatusTag = _this.renderValueWithStatusTag.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PropertyInputPriority, [{
    key: "focus",
    value: function focus() {
      return this.refs.input.focus();
    }
  }, {
    key: "getPlaceholder",
    value: function getPlaceholder() {
      var _this$props = this.props,
          property = _this$props.property,
          placeholder = _this$props.placeholder;
      if (placeholder !== undefined) return placeholder;
      return property.placeholder || I18n.text('customerDataProperties.PropertyInput.selectPlaceholder');
    }
  }, {
    key: "getValue",
    value: function getValue(value, defaultValue) {
      return String(value || defaultValue || '');
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var _this$props2 = this.props,
          property = _this$props2.property,
          _this$props2$isRequir = _this$props2.isRequired,
          isRequired = _this$props2$isRequir === void 0 ? false : _this$props2$isRequir;
      return isRequired ? makeOptionsFromPropertyWithoutBlankOptions(property) : makeOptionsFromProperty(property);
    }
  }, {
    key: "renderOptionWithStatusTag",
    value: function renderOptionWithStatusTag(_ref) {
      var children = _ref.children,
          className = _ref.className,
          option = _ref.option,
          onClick = _ref.onClick,
          onMouseEnter = _ref.onMouseEnter;

      if (!option.value) {
        return /*#__PURE__*/_jsx("li", {
          className: className,
          "data-option-value": option.value,
          children: children
        });
      }

      var disableOptionsStatusDot = this.props.disableOptionsStatusDot;
      var statusDotUse = !disableOptionsStatusDot && PRIORITY_TO_STATUS_TAG_TYPE_MAP.get(option.value.toLowerCase());
      return /*#__PURE__*/_jsxs("li", {
        style: {
          padding: '8px 20px'
        },
        className: classNames(className, 'pointer'),
        onClick: onClick,
        onMouseEnter: onMouseEnter,
        title: option.text,
        "data-option-value": option.value,
        children: [statusDotUse && /*#__PURE__*/_jsx(UIStatusDot, {
          use: statusDotUse
        }), option.text]
      });
    }
  }, {
    key: "renderValueWithStatusTag",
    value: function renderValueWithStatusTag(_ref2) {
      var value = _ref2.value,
          text = _ref2.text;

      if (!value) {
        return null;
      }

      var disableValueStatusDot = this.props.disableValueStatusDot;
      var statusDotUse = !disableValueStatusDot && PRIORITY_TO_STATUS_TAG_TYPE_MAP.get(value.toLowerCase());
      return /*#__PURE__*/_jsxs("div", {
        title: text,
        children: [statusDotUse && /*#__PURE__*/_jsx(UIStatusDot, {
          use: statusDotUse
        }), text]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var transferableProps = omit(['aria-required', 'baseUrl', 'data-field', 'error', 'id', 'isInline', 'objectType', 'onCancel', 'onFocus', 'onInvalidProperty', 'onPipelineChange', 'onKeyUp', 'onSecondaryChange', 'property', 'propertyIndex', 'readOnlySourceData', 'required', 'secondaryChanges', 'showError', 'subjectId', 'onTracking', 'isRequired'], Seq(this.props)).toJS();
      return /*#__PURE__*/_jsx(UISelect, Object.assign({}, transferableProps, {
        options: this.getOptions(),
        placeholder: this.getPlaceholder(),
        ref: "input",
        value: this.getValue(this.props.value, this.props.defaultValue),
        itemComponent: this.renderOptionWithStatusTag,
        valueRenderer: this.renderValueWithStatusTag
      }));
    }
  }]);

  return PropertyInputPriority;
}(Component);

export { PropertyInputPriority as default };
PropertyInputPriority.propTypes = propTypes;