// # HOC for a UISelect that load options asynchronously
//
// @param {object} storeDependency - returns options for UISelect
//
// To show an appropriate loading state (in getResultsText)
// return undefined in your store dependency deref when you have no results
// #
'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import I18n from 'I18n';
import { connect } from 'general-store';
import ImmutableRenderMixin from 'react-immutable-render-mixin';
import UISelect from 'UIComponents/input/UISelect';
import { ValueType } from 'UIComponents/types/OptionTypes';
export default function (storeDependency) {
  var dependencies = {
    matches: storeDependency
  };
  var AsyncSearchableSelect = createReactClass({
    displayName: 'AsyncSearchableSelect',
    mixins: [ImmutableRenderMixin],
    propTypes: {
      onChange: PropTypes.func.isRequired,
      onBlur: PropTypes.func,
      minimumSearchCount: PropTypes.number,
      placeholder: PropTypes.string,
      autofocus: PropTypes.bool,
      allowCreate: PropTypes.bool,
      allowCreateTextFunc: PropTypes.func,
      matches: PropTypes.any,
      value: ValueType,
      className: PropTypes.string,
      itemComponent: PropTypes.func,
      valueRenderer: PropTypes.func,
      menuWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
      multi: PropTypes.bool,
      align: PropTypes.string,
      searchText: PropTypes.string.isRequired,
      setSearchText: PropTypes.func.isRequired,
      seleniumSelector: PropTypes.string
    },
    getDefaultProps: function getDefaultProps() {
      return {
        minimumSearchCount: 0,
        autofocus: true,
        multi: false,
        allowCreate: false,
        allowCreateTextFunc: function allowCreateTextFunc(searchText) {
          return searchText;
        }
      };
    },
    onChange: function onChange(_ref) {
      var value = _ref.target.value;
      this.props.onChange(value);
    },
    onBlur: function onBlur() {
      this.props.setSearchText('');

      if (typeof this.props.onBlur === 'function') {
        this.props.onBlur();
      }
    },
    onInputChange: function onInputChange(value) {
      this.props.setSearchText(value);
    },
    getResultsText: function getResultsText() {
      var _this$props = this.props,
          matches = _this$props.matches,
          searchText = _this$props.searchText;

      if ((matches && matches.length) === 0 && searchText) {
        return I18n.text('genericSelectPlaceholder.noResults');
      } else if (!matches && searchText) {
        return I18n.text('genericSelectPlaceholder.searching');
      } else if (!matches && !searchText) {
        return I18n.text('genericSelectPlaceholder.start');
      }

      return '';
    },
    getMatches: function getMatches() {
      var _this$props2 = this.props,
          allowCreate = _this$props2.allowCreate,
          allowCreateTextFunc = _this$props2.allowCreateTextFunc,
          searchText = _this$props2.searchText,
          _this$props2$matches = _this$props2.matches,
          matches = _this$props2$matches === void 0 ? [] : _this$props2$matches;

      if (!allowCreate) {
        return matches;
      }

      if ((matches && matches.length) === 0 && searchText) {
        return [{
          text: allowCreateTextFunc(searchText),
          value: searchText
        }];
      }

      return matches;
    },
    render: function render() {
      var _this$props3 = this.props,
          align = _this$props3.align,
          autofocus = _this$props3.autofocus,
          className = _this$props3.className,
          itemComponent = _this$props3.itemComponent,
          menuWidth = _this$props3.menuWidth,
          minimumSearchCount = _this$props3.minimumSearchCount,
          multi = _this$props3.multi,
          placeholder = _this$props3.placeholder,
          value = _this$props3.value,
          valueRenderer = _this$props3.valueRenderer,
          seleniumSelector = _this$props3.seleniumSelector;
      return /*#__PURE__*/_jsx(UISelect, {
        itemComponent: itemComponent,
        valueRenderer: valueRenderer,
        menuWidth: menuWidth,
        multi: multi,
        align: align,
        className: className,
        onInputChange: this.onInputChange,
        autofocus: autofocus,
        onChange: this.onChange,
        minimumSearchCount: minimumSearchCount,
        options: this.getMatches(),
        placeholder: placeholder,
        onBlur: this.onBlur,
        noResultsText: this.getResultsText(),
        value: value,
        filterOptions: false,
        "data-selenium-test": seleniumSelector
      });
    }
  });
  return connect(dependencies)(AsyncSearchableSelect);
}