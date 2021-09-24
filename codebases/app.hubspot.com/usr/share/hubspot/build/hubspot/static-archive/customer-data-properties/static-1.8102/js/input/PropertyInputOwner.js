'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import isEmpty from 'transmute/isEmpty';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReferenceInputEnum from 'customer-data-reference-ui-components/ReferenceInputEnum';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import I18n from 'I18n';
import { isOnlyActiveSalesforceOwner, isActiveHubSpotOwner } from 'customer-data-objects/owners/isActiveOwner';
export var ownerOptionFormatter = function ownerOptionFormatter(option) {
  var selectOption = {
    text: option.get('label'),
    value: option.get('id'),
    help: option.get('description')
  };
  var owner = option.referencedObject;

  if (isOnlyActiveSalesforceOwner(owner)) {
    selectOption.text = option.get('label') + " " + I18n.text('customerDataProperties.PropertyInputOwner.SalesforceOwner');
  } else if (!isActiveHubSpotOwner(owner)) {
    selectOption.text = option.get('label') + " " + I18n.text('customerDataProperties.PropertyInputOwner.deactivatedOwner');
  }

  return selectOption;
};
var propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  resolver: ReferenceResolverType,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

var PropertyInputOwner = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputOwner, _Component);

  function PropertyInputOwner() {
    _classCallCheck(this, PropertyInputOwner);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputOwner).apply(this, arguments));
  }

  _createClass(PropertyInputOwner, [{
    key: "focus",
    value: function focus() {
      return this.refs.input.focus();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          rest = _objectWithoutProperties(_this$props, ["className"]);

      var value = this.props.value ? this.props.value.toString() : undefined;
      return /*#__PURE__*/_jsx(ReferenceInputEnum, Object.assign({}, rest, {
        className: classNames(className, isEmpty(value) && "noValue"),
        clearable: true,
        multi: false,
        optionFormatter: ownerOptionFormatter,
        placeholder: I18n.text('customerDataProperties.PropertyInputOwner.placeholder'),
        ref: "input",
        value: value
      }));
    }
  }]);

  return PropertyInputOwner;
}(Component);

export { PropertyInputOwner as default };
PropertyInputOwner.propTypes = propTypes;