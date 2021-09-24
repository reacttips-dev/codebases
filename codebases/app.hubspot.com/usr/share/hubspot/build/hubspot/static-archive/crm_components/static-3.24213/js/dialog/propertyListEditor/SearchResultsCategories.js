'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import filter from 'transmute/filter';
import reduce from 'transmute/reduce';
import get from 'transmute/get';
import indexBy from 'transmute/indexBy';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import DnDSearchResultsItem from 'crm_components/dialog/propertyListEditor/DnDSearchResultsItem';
import ComponentWithPartials from 'UIComponents/mixins/ComponentWithPartials';
import { COLUMN_SETTINGS, FAVORITE_PROPERTIES, CREATOR_PROPERTIES, DEAL_STAGE_PROPERTIES, TICKET_STAGE_PROPERTIES } from 'customer-data-objects/property/PropertyListTypes';
import DefaultObjectProperties from 'customer-data-objects/constants/DefaultObjectProperties';
import { AutoSizer, List as VirtualizedList } from 'react-virtualized';
var MIN_LIST_HEIGHT = 276;
var SearchResultsCategories = createReactClass({
  displayName: 'SearchResultsCategories',
  mixins: [ComponentWithPartials],
  propTypes: {
    search: PropTypes.string,
    onAddOption: PropTypes.func.isRequired,
    onRemoveOption: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    optionGroups: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    use: PropTypes.oneOf([COLUMN_SETTINGS, FAVORITE_PROPERTIES, CREATOR_PROPERTIES, DEAL_STAGE_PROPERTIES, TICKET_STAGE_PROPERTIES]).isRequired
  },
  isDisabled: function isDisabled(_ref, selected) {
    var value = _ref.value;
    var _this$props = this.props,
        use = _this$props.use,
        type = _this$props.type;
    var previewProperties = selected.get(value);
    return use === CREATOR_PROPERTIES && DefaultObjectProperties.getIn([type, value, 'disabled', 'removal']) || previewProperties && (previewProperties.disabled || previewProperties.readOnly);
  },
  getFilteredProperties: function getFilteredProperties() {
    var search = this.props.search;

    var match = function match(_ref2) {
      var text = _ref2.text;
      return text != null ? text.toLowerCase().indexOf(search.toLowerCase()) !== -1 : true;
    };

    return reduce([], function (allResults, currentCategory) {
      if (currentCategory.options.length === 0) {
        return allResults;
      }

      var filteredProperties = filter(match, currentCategory.options);

      if (filteredProperties.length !== 0) {
        allResults.push.apply(allResults, [currentCategory].concat(_toConsumableArray(filteredProperties)));
      }

      return allResults;
    }, this.props.optionGroups);
  },
  getSelectedPropertiesMap: function getSelectedPropertiesMap() {
    return indexBy(get('value'), this.props.selectedOptions);
  },
  renderCategory: function renderCategory(row, category) {
    return /*#__PURE__*/_jsx("div", {
      style: row.style,
      children: /*#__PURE__*/_jsx("div", {
        className: "m-bottom-2 m-top-4 is--heading-7",
        children: category.text || category.value
      })
    }, category.value);
  },
  renderCategoryProperty: function renderCategoryProperty(row, option) {
    var _this$props2 = this.props,
        onAddOption = _this$props2.onAddOption,
        onRemoveOption = _this$props2.onRemoveOption,
        onReset = _this$props2.onReset,
        onSave = _this$props2.onSave;
    var selected = this.getSelectedPropertiesMap();
    var disabled = this.isDisabled(option, selected);
    return /*#__PURE__*/_jsx("div", {
      style: row.style,
      children: /*#__PURE__*/_jsx(DnDSearchResultsItem, {
        className: "m-left-4",
        disabled: disabled,
        index: -1,
        onDrop: onSave,
        onMove: onReset,
        onReset: onReset,
        onSelect: onAddOption,
        onUnselect: onRemoveOption,
        property: option,
        selected: selected.get(option.value),
        tabIndex: 0,
        truncate: true
      })
    }, option.groupName + ":" + option.value);
  },
  renderNoResults: function renderNoResults() {
    return /*#__PURE__*/_jsx("div", {
      className: "on-no-results",
      children: /*#__PURE__*/_jsx("p", {
        className: "no-results",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "crm_components.GenericModal.noProperty"
        })
      })
    });
  },
  renderRow: function renderRow(rows, row) {
    var entry = rows[row.index];

    if (entry.options) {
      return this.renderCategory(row, entry);
    }

    return this.renderCategoryProperty(row, entry);
  },
  renderList: function renderList(filteredProperties) {
    var _this = this;

    return function (dimensions) {
      // In Unit Tests `height` and `width` are 0 which causes this to render nothing.
      var height = dimensions.height === 0 ? MIN_LIST_HEIGHT : dimensions.height;
      var width = dimensions.width === 0 ? 400 : dimensions.width;
      return /*#__PURE__*/_jsx(VirtualizedList, {
        height: height,
        rowCount: filteredProperties.length,
        rowHeight: 40,
        rowRenderer: function rowRenderer(row) {
          return _this.renderRow(filteredProperties, row);
        },
        width: width
      }, _this.props.search);
    };
  },
  render: function render() {
    var filteredProperties = this.getFilteredProperties();

    if (filteredProperties.length === 0) {
      return this.renderNoResults();
    }

    return /*#__PURE__*/_jsx("div", {
      className: "flex-grow-1",
      style: {
        minHeight: MIN_LIST_HEIGHT + "px"
      },
      children: /*#__PURE__*/_jsx(AutoSizer, {
        children: this.renderList(filteredProperties)
      })
    });
  }
});
export default SearchResultsCategories;