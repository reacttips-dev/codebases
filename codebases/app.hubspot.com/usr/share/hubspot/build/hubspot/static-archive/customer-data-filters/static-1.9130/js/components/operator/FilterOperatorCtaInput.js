'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { __ANY_CTA } from 'customer-data-filters/converters/listSegClassic/ListSegConstants';
import { deref, unwatch, watch } from 'atom';
import { isResolved } from 'reference-resolvers/utils';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UISelect from 'UIComponents/input/UISelect';
import getIn from 'transmute/getIn';
import memoize from 'transmute/memoize';
var ctaToOptions = memoize(function (ctaList) {
  return ctaList.map(function (cta) {
    return {
      value: cta.get('guid'),
      text: cta.get('isDefault') ? I18n.text('customerDataFilters.FilterEditor.specialOptionValues.defaultCta.input') : I18n.text('customerDataFilters.FilterEditor.specialOptionValues.variationCta.input', {
        variantLabel: cta.get('variantLabel')
      })
    };
  }).toArray();
});

var FilterOperatorCtaInput = /*#__PURE__*/function (_Component) {
  _inherits(FilterOperatorCtaInput, _Component);

  function FilterOperatorCtaInput() {
    var _this;

    _classCallCheck(this, FilterOperatorCtaInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorCtaInput).call(this));

    _this.handleChange = function (_ref) {
      var nextValue = _ref.target.value;
      var _this$props = _this.props,
          fieldName = _this$props.fieldName,
          onChange = _this$props.onChange,
          value = _this$props.value;
      onChange(SyntheticEvent(value.set(fieldName, nextValue)));
    };

    _this.handleOptionsChange = function (cta) {
      if (isResolved(cta)) {
        var ctaInfo = cta.referencedObject.get('ctaInfo');
        var options = ctaInfo && ctaInfo.size > 0 ? ctaToOptions(ctaInfo) : [];

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
    _this.referenceCtaAtom = null;
    return _this;
  }

  _createClass(FilterOperatorCtaInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
          fieldName = _this$props2.fieldName,
          onChange = _this$props2.onChange,
          resolver = _this$props2.resolver,
          value = _this$props2.value;
      var field = getIn(['field', 'name'], value) || '';

      if (resolver && resolver.byId && field) {
        this.referenceCtaAtom = resolver.byId(field);
        watch(this.referenceCtaAtom, this.handleOptionsChange);
        this.handleOptionsChange(deref(this.referenceCtaAtom));
      }

      onChange(SyntheticEvent(value.set(fieldName, value.get(fieldName) || __ANY_CTA)));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceCtaAtom) {
        unwatch(this.referenceCtaAtom, this.handleOptionsChange);
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
      return [{
        text: I18n.text('customerDataFilters.FilterEditor.specialOptionValues.anyCta.input'),
        value: __ANY_CTA
      }].concat(_toConsumableArray(this.state.options));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          className = _this$props3.className,
          fieldName = _this$props3.fieldName,
          value = _this$props3.value;
      var loading = this.state.loading;
      var error = loading ? false : undefined;
      return /*#__PURE__*/_jsx(UISelect, {
        className: className,
        defaultValue: __ANY_CTA,
        error: error,
        onChange: this.handleChange,
        options: this.getOptions(),
        ref: function ref(component) {
          return _this2.input = component;
        },
        value: value.get(fieldName)
      });
    }
  }]);

  return FilterOperatorCtaInput;
}(Component);

FilterOperatorCtaInput.defaultProps = {
  fieldName: 'value'
};
FilterOperatorCtaInput.propTypes = {
  className: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  resolver: ReferenceResolverType,
  value: FilterOperatorType.isRequired
};
export default FilterOperatorCtaInput;