'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as FieldTranslator from '../FieldTranslator';
import { DATE, DATE_TIME } from 'customer-data-objects/property/PropertyTypes';
import { deref, unwatch, watch } from 'atom';
import { isResolved } from 'reference-resolvers/utils';
import After from 'customer-data-filters/filterQueryFormat/operator/After';
import Before from 'customer-data-filters/filterQueryFormat/operator/Before';
import FilterOperatorPropertyInputOption from './FilterOperatorPropertyInputOption';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UISelect from 'UIComponents/input/UISelect';

var FilterOperatorPropertyInput = /*#__PURE__*/function (_Component) {
  _inherits(FilterOperatorPropertyInput, _Component);

  function FilterOperatorPropertyInput() {
    var _this;

    _classCallCheck(this, FilterOperatorPropertyInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorPropertyInput).call(this));

    _this.handleChange = function (_ref) {
      var nextValue = _ref.target.value;
      var _this$props = _this.props,
          fieldName = _this$props.fieldName,
          onChange = _this$props.onChange,
          value = _this$props.value;
      onChange(SyntheticEvent(value.set(fieldName, nextValue)));
    };

    _this.handleOptionsChange = function (referenceRecords) {
      var filterFamily = _this.props.filterFamily;

      if (isResolved(referenceRecords)) {
        var options = referenceRecords.filter(function (record) {
          return !record.referencedObject.get('hidden');
        }).map(function (record) {
          var propertyDescription = record.getIn(['referencedObject', 'description']);
          var propertyName = record.id;
          var helpText = FieldTranslator.getTranslatedFieldDescription({
            fieldDescription: propertyDescription,
            fieldName: propertyName,
            filterFamily: filterFamily
          });
          var label = FieldTranslator.getTranslatedFieldLabel({
            fieldLabel: record.label,
            fieldName: propertyName
          });
          return {
            value: propertyName,
            text: label,
            help: helpText,
            type: record.getIn(['referencedObject', 'type'])
          };
        }).toArray();

        _this.setState({
          loading: false,
          options: options
        });
      }
    };

    _this.state = {
      loading: true,
      options: []
    };
    _this.referenceAtom = null;
    return _this;
  }

  _createClass(FilterOperatorPropertyInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var resolver = this.props.resolver;

      if (resolver && resolver.all) {
        this.referenceAtom = resolver.all();
        watch(this.referenceAtom, this.handleOptionsChange);
        this.handleOptionsChange(deref(this.referenceAtom));
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceAtom) {
        unwatch(this.referenceAtom, this.handleOptionsChange);
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      this.input.focus();
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var value = this.props.value;
      var options = this.state.options;

      if (After.isAfter(value) || Before.isBefore(value)) {
        options = options.filter(function (option) {
          return option.type === DATE_TIME || option.type === DATE;
        });
      }

      var selectedFilterFieldOption = options.find(function (o) {
        return o.value === value.field.name;
      });

      if (selectedFilterFieldOption) {
        selectedFilterFieldOption.disabled = true;
      }

      return options;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          className = _this$props2.className,
          fieldName = _this$props2.fieldName,
          placeholder = _this$props2.placeholder,
          value = _this$props2.value;
      var loading = this.state.loading;
      var error = loading ? false : undefined;
      return /*#__PURE__*/_jsx(UISelect, {
        className: className,
        error: error,
        itemComponent: FilterOperatorPropertyInputOption,
        onChange: this.handleChange,
        options: this.getOptions(),
        placeholder: placeholder,
        ref: function ref(component) {
          return _this2.input = component;
        },
        value: value.get(fieldName)
      });
    }
  }]);

  return FilterOperatorPropertyInput;
}(Component);

FilterOperatorPropertyInput.defaultProps = {
  fieldName: 'value'
};
FilterOperatorPropertyInput.propTypes = {
  className: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  filterFamily: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  resolver: ReferenceResolverType,
  value: FilterOperatorType.isRequired
};
export default FilterOperatorPropertyInput;