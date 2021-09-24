'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import omit from 'transmute/omit';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import translate from 'transmute/translate';
import classNames from 'classnames';
import { Seq } from 'immutable';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UISelect from 'UIComponents/input/UISelect';
import PropTypes from 'prop-types';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { parseMultiEnumValue } from 'customer-data-property-utils/parseMultiEnumValue';
var defaultProps = {
  value: ''
};
var propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.node,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  showPlaceholder: PropTypes.bool,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  value: PropTypes.string
};

var PropertyInputEnumMulti = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputEnumMulti, _Component);

  function PropertyInputEnumMulti() {
    var _this;

    _classCallCheck(this, PropertyInputEnumMulti);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputEnumMulti).call(this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleChange = function (evt) {
      var onChange = _this.props.onChange;
      onChange(SyntheticEvent(evt.target.value.join(';')));
    };

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(PropertyInputEnumMulti, [{
    key: "focus",
    value: function focus() {
      this.refs.input.focus();
    }
  }, {
    key: "getOptions",
    value: function getOptions(property) {
      var hubspotDefined = property.get('hubspotDefined');
      var options = property.get('options');
      return options.map(translate({
        text: function text(option) {
          if (hubspotDefined && option.get('readOnly')) {
            return propertyLabelTranslator(option.get('label'));
          }

          return option.get('label');
        },
        value: true
      }));
    }
  }, {
    key: "getOptionsWithSelected",
    value: function getOptionsWithSelected(selectedValues) {
      var property = this.props.property;
      var optionsSeq = this.getOptions(property);
      var selectOptions = optionsSeq.toJS();

      if (selectedValues.length) {
        var propertyValidOptions = property.get('options').map(function (option) {
          return option.value;
        });
        var invalidValueSelectOptions = selectedValues.filter(function (val) {
          return !propertyValidOptions.includes(val);
        }).map(function (val) {
          return {
            text: val,
            value: val,
            tagUse: 'candy-apple'
          };
        });
        return selectOptions.concat(invalidValueSelectOptions);
      }

      return selectOptions;
    }
  }, {
    key: "render",
    value: function render() {
      var value = this.props.value;
      var valueProp = parseMultiEnumValue(value);
      var transferableProps = omit(['error', 'isInline', 'objectType', 'onCancel', 'onInvalidProperty', 'property', 'propertyIndex', 'readOnlySourceData', 'showError', 'subjectId', 'secondaryChanges', 'onSecondaryChange', 'onTracking', 'isRequired', 'onPipelineChange'], Seq(this.props)).toJS();
      return /*#__PURE__*/_jsx(UISelect, Object.assign({}, transferableProps, {
        onChange: this.handleChange,
        className: classNames('PropertyInputEnumMulti', this.props.className),
        multi: true,
        anchorType: "button",
        options: this.getOptionsWithSelected(valueProp),
        placeholder: this.props.property.placeholder || '',
        ref: "input",
        value: valueProp
      }));
    }
  }]);

  return PropertyInputEnumMulti;
}(Component);

export { PropertyInputEnumMulti as default };
PropertyInputEnumMulti.propTypes = propTypes;
PropertyInputEnumMulti.defaultProps = defaultProps;