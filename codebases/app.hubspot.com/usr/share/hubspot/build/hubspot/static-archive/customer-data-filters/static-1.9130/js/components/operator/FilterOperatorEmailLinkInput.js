'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import { __ANY_LINK } from 'customer-data-filters/converters/listSegClassic/ListSegConstants';
import { deref, unwatch, watch } from 'atom';
import { isResolved } from 'reference-resolvers/utils';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import ReferenceResolverSearchType from 'reference-resolvers/schema/ReferenceResolverSearchType';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UISelect from 'UIComponents/input/UISelect';
import memoize from 'transmute/memoize';

var _parseListSegAssetId = memoize(function (operator) {
  return ("" + operator.field.name).replace(operator.field.type + "-", '');
});

var FilterOperatorEmailLinkInput = /*#__PURE__*/function (_Component) {
  _inherits(FilterOperatorEmailLinkInput, _Component);

  function FilterOperatorEmailLinkInput() {
    var _this;

    _classCallCheck(this, FilterOperatorEmailLinkInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorEmailLinkInput).call(this));

    _this.handleChange = function (_ref) {
      var nextValue = _ref.target.value;
      var _this$props = _this.props,
          fieldName = _this$props.fieldName,
          onChange = _this$props.onChange,
          value = _this$props.value;
      onChange(SyntheticEvent(value.set(fieldName, nextValue)));
    };

    _this.handleOptionsChange = function (options) {
      if (isResolved(options)) {
        _this.setState({
          loading: false,
          results: options.get('results').toList()
        });
      }
    };

    _this.state = {
      loading: true,
      results: List()
    };
    _this.referenceAtom = null;
    return _this;
  }

  _createClass(FilterOperatorEmailLinkInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
          fieldName = _this$props2.fieldName,
          onChange = _this$props2.onChange,
          resolver = _this$props2.resolver,
          value = _this$props2.value;
      var field = value.get(fieldName);

      if (!field || field === __ANY_LINK) {
        onChange(SyntheticEvent(value.set(fieldName, __ANY_LINK)));
      }

      if (resolver && resolver.search) {
        this.referenceAtom = resolver.search({
          count: 0,
          // Not used
          offset: 0,
          // Not used
          hasMore: false,
          // Not used
          query: _parseListSegAssetId(value)
        });
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
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          className = _this$props3.className,
          fieldName = _this$props3.fieldName,
          value = _this$props3.value;
      var _this$state = this.state,
          loading = _this$state.loading,
          results = _this$state.results;
      var anyLinkOption = {
        text: I18n.text('customerDataFilters.FilterEditor.specialOptionValues.anyLink'),
        value: __ANY_LINK
      };
      var error = loading ? false : undefined;
      return /*#__PURE__*/_jsx(UISelect, {
        className: className,
        defaultValue: __ANY_LINK,
        error: error,
        onChange: this.handleChange,
        options: [anyLinkOption].concat(_toConsumableArray(ReferenceRecord.toOptionsArray(results))),
        ref: function ref(component) {
          return _this2.input = component;
        },
        value: value.get(fieldName)
      });
    }
  }]);

  return FilterOperatorEmailLinkInput;
}(Component);

FilterOperatorEmailLinkInput.defaultProps = {
  fieldName: 'value'
};
FilterOperatorEmailLinkInput.propTypes = {
  className: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  resolver: ReferenceResolverSearchType.isRequired,
  value: FilterOperatorType.isRequired
};
export default FilterOperatorEmailLinkInput;