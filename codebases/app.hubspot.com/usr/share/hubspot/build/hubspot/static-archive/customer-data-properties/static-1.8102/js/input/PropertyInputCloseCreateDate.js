'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import CRMPropertyDateInput from 'customer-data-properties/date/CRMPropertyDateInput';
import { MomentTypes } from 'customer-data-properties/date/MomentTypes';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import omit from 'transmute/omit';
import { Seq } from 'immutable';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import I18n from 'I18n';
var propTypes = {
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

var PropertyInputCloseCreateDate = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputCloseCreateDate, _Component);

  function PropertyInputCloseCreateDate() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PropertyInputCloseCreateDate);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PropertyInputCloseCreateDate)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleChange = function (evt) {
      var onChange = _this.props.onChange;

      if (typeof onChange !== 'function') {
        return undefined;
      }

      var fixedValue = evt.target.value;

      if (evt.target.value) {
        var startOfDay = I18n.moment.userTz().startOf('day').valueOf();
        var currentTime = I18n.moment.userTz().valueOf();
        var timeOffset = currentTime - startOfDay;
        fixedValue = String(I18n.moment.userTz(evt.target.value).add(timeOffset).valueOf());
      }

      var fixedEvent = SyntheticEvent(fixedValue);
      return onChange(fixedEvent);
    };

    return _this;
  }

  _createClass(PropertyInputCloseCreateDate, [{
    key: "focus",
    value: function focus() {
      this.refs.input.focus();
    }
  }, {
    key: "render",
    value: function render() {
      var property = this.props.property;
      var transferableProps = omit(['baseUrl', 'isInLine', 'MomentType', 'objectType', 'onCancel', 'onInvalidProperty', 'onPipelineChange', 'property', 'propertyIndex', 'readOnlySourceData', 'resolver', 'showError', 'subjectId', 'unstyled', 'secondaryChanges', 'onSecondaryChange', 'onTracking', 'isRequired'], Seq(this.props)).toJS();
      return /*#__PURE__*/_jsx(CRMPropertyDateInput, Object.assign({}, transferableProps, {
        momentType: MomentTypes.USER,
        onChange: this.handleChange,
        ref: "input",
        type: property.type
      }));
    }
  }]);

  return PropertyInputCloseCreateDate;
}(Component);

export { PropertyInputCloseCreateDate as default };
PropertyInputCloseCreateDate.propTypes = propTypes;