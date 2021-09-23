'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import I18n from 'I18n';
import invariant from 'react-utils/invariant';
import isEmpty from 'transmute/isEmpty';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import ReferenceInputEnum from 'customer-data-reference-ui-components/ReferenceInputEnum';
/*
 * The Engagements QueueMembershipId property supports an array format with multiple values.
 * We do not support multiple values at this point, so this is just a safety check to properly
 * transform arrays when encountered.
 *
 * @param {String|Array} values Ideally this value should be a string with a single queueId
 *    inside. It's also acceptable if its an array with a single element. Arrays with lengths
 *    greater than 1 are not supported.
 * @returns {String} '' if null or undefined. Otherwise returns a String of the queue ID.
 */

export function toCRMObjectMultiValue(values) {
  if (!values) {
    return values;
  }

  if (!Array.isArray(values)) {
    return String(values);
  }

  invariant(Array.isArray(values) && values.length <= 1, 'Task with multiple Queues are not supported');
  return String(values[0]);
}

var PropertyInputTaskQueues = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputTaskQueues, _Component);

  function PropertyInputTaskQueues() {
    _classCallCheck(this, PropertyInputTaskQueues);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputTaskQueues).apply(this, arguments));
  }

  _createClass(PropertyInputTaskQueues, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          value = _this$props.value,
          className = _this$props.className,
          rest = _objectWithoutProperties(_this$props, ["value", "className"]);

      return /*#__PURE__*/_jsx(ReferenceInputEnum, Object.assign({}, rest, {
        searchable: false,
        className: classNames(className, isEmpty(value) && "noValue"),
        clearable: true,
        menuWidth: "auto",
        multi: false,
        ref: "input",
        value: toCRMObjectMultiValue(value),
        placeholder: I18n.text('customerDataProperties.PropertyOptionPresets.queueMembership.NONE')
      }));
    }
  }]);

  return PropertyInputTaskQueues;
}(Component);

PropertyInputTaskQueues.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  resolver: ReferenceResolverType.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf([PropTypes.string])]),
  dropdownFooter: PropTypes.node
};
export { PropertyInputTaskQueues as default };