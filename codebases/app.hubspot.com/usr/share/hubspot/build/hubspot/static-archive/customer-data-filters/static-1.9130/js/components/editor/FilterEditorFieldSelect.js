'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { AutoSizer, InfiniteLoader, List as VirtualizedList } from 'react-virtualized';
import { BASE_FONT_SIZE } from 'HubStyleTokens/sizes';
import { BUTTON_DISABLED_TEXT } from 'HubStyleTokens/colors';
import { ENTER } from 'UIComponents/constants/KeyCodes';
import { Map as ImmutableMap } from 'immutable';
import { WEB_FONT_REGULAR, WEB_FONT_REGULAR_WEIGHT } from 'HubStyleTokens/misc';
import { makeFuzzyRegExp } from 'customer-data-objects/search/FieldSearch';
import { mapOf, setOf } from 'react-immutable-proptypes';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import FilterFieldGroupType from 'customer-data-filters/components/propTypes/FilterFieldGroupType';
import FilterFieldType from 'customer-data-filters/components/propTypes/FilterFieldType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ListPlaceholderSvg from 'customer-data-ui-utilities/images/ListPlaceholderSvg';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ShimmerWrapper from 'customer-data-ui-utilities/images/ShimmerWrapper';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIList from 'UIComponents/list/UIList';
import UISearchInput from 'UIComponents/input/UISearchInput';
import UISelect from 'UIComponents/input/UISelect';
import UITruncateString from 'UIComponents/text/UITruncateString';
import UITypeahead from 'UIComponents/typeahead/UITypeahead';
import always from 'transmute/always';
import has from 'transmute/has';
import isString from 'transmute/isString';
import memoize from 'transmute/memoize';
import memoizeLast from 'transmute/memoizeLast';
import partial from 'transmute/partial';
var GROUP_NAME_HEIGHT = 40;
var styles = {
  /**
   * For this component, all styles for this that can live in JS should live in
   * JS to keep runtime text measurements consistent.
   */
  result: {
    display: 'block',
    fontFamily: [WEB_FONT_REGULAR, 'Helvetica', 'Arial', 'sans-serif'].join(', '),
    fontSize: BASE_FONT_SIZE,
    fontWeight: WEB_FONT_REGULAR_WEIGHT,
    lineHeight: '1.25em',
    padding: "8px 4px",
    margin: '0px',
    whiteSpace: 'normal',
    width: '100%',
    wordBreak: 'normal'
  },
  ruler: {
    clip: 'rect(0, 0, 0, 0)',
    position: 'fixed',
    visibility: 'hidden',
    zIndex: '-100000'
  }
};

function getSortedFieldGroups(getLabelString, fieldGroups) {
  return fieldGroups.valueSeq().sortBy(function (_ref) {
    var displayOrder = _ref.displayOrder;
    return displayOrder;
  }).map(function (group) {
    return group.update('properties', function (properties) {
      return properties.sortBy(getLabelString);
    });
  }).toList();
}

function getSortedFields(getLabelString, fields) {
  return fields.valueSeq().sortBy(getLabelString).sortBy(function (_ref2) {
    var displayOrder = _ref2.displayOrder;
    return displayOrder;
  }).toList();
}

function measureText(width, str) {
  var ruler = document.createElement('pre');
  ruler.appendChild(document.createTextNode(str));
  Object.assign(ruler.style, styles.result, {
    maxWidth: width + "px"
  }, styles.ruler);
  document.body.appendChild(ruler);
  var height = ruler.getBoundingClientRect().height;
  document.body.removeChild(ruler);
  return height;
}

export var searchLookup = function searchLookup(getLabelString, fields, search) {
  var searchQueryWithNoDiacritics = isString(search) ? UISelect.stripDiacritics(search) : search;
  var pattern = makeFuzzyRegExp(searchQueryWithNoDiacritics);
  var result = [];
  var fieldsLength = fields.size;

  for (var index = 0; index < fieldsLength; index++) {
    var field = fields.get(index);
    var labelString = getLabelString(field);
    var labelStringWithNoDiacritics = isString(labelString) ? UISelect.stripDiacritics(labelString) : labelString;

    if (pattern.test(labelStringWithNoDiacritics)) {
      result.push(field);
    }
  }

  return result;
};

var _isHeadingEntry = function _isHeadingEntry(entry) {
  return has('heading', entry);
};

var _isSubheadingEntry = function _isSubheadingEntry(entry) {
  return has('properties', entry);
};

var _isSelectableEntry = function _isSelectableEntry(entry) {
  return entry && !_isHeadingEntry(entry) && !_isSubheadingEntry(entry);
};

function lookupGroups(getLabelString, fieldGroups, search) {
  var result = [];
  var groupsLength = fieldGroups.size;
  var lastGroupWasMostUsedProps = false;

  for (var i = 0; i < groupsLength; i++) {
    var group = fieldGroups.get(i);
    var groupLength = void 0;

    if (group.properties.size === 0) {
      continue;
    }

    if (lastGroupWasMostUsedProps) {
      result.push(ImmutableMap({
        heading: 'allProperties'
      }));
      lastGroupWasMostUsedProps = false;
    }

    if (group.name === 'most_used_properties') {
      groupLength = result.push(ImmutableMap({
        heading: 'mostUsedProperties'
      }));
      lastGroupWasMostUsedProps = true;
    } else {
      groupLength = result.push(group);
    }

    var properties = group.properties;
    result.push.apply(result, _toConsumableArray(searchLookup(getLabelString, properties, search)));

    if (result.length === groupLength) {
      result.pop();
    }
  }

  var isResultEmpty = !result.some(_isSelectableEntry);
  return isResultEmpty ? [] : result;
}

var FilterEditorFieldSelect = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterEditorFieldSelect, _PureComponent);

  function FilterEditorFieldSelect() {
    var _this;

    _classCallCheck(this, FilterEditorFieldSelect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorFieldSelect).call(this));

    _this.handleFieldChange = function (field) {
      var _this$props = _this.props,
          getOperators = _this$props.getOperators,
          onChange = _this$props.onChange;
      var Operator = getOperators(field).first();
      var value = Operator.of(field);
      onChange(SyntheticEvent(value));
    };

    _this.handleLoadMoreRows = function (_ref3) {
      var startIndex = _ref3.startIndex;
      var _this$props2 = _this.props,
          filterFamily = _this$props2.filterFamily,
          loadMoreFields = _this$props2.loadMoreFields,
          searchValue = _this$props2.searchValue;
      loadMoreFields(filterFamily, startIndex, searchValue);
    };

    _this.handleScroll = function () {
      var scrollTop = _this.state.scrollTop;

      if (scrollTop !== undefined) {
        _this.setState({
          scrollTop: undefined
        });
      }
    };

    _this.handleSearchChange = function (evt) {
      var _this$props3 = _this.props,
          filterFamily = _this$props3.filterFamily,
          loadMoreFields = _this$props3.loadMoreFields,
          onSearchChange = _this$props3.onSearchChange;
      loadMoreFields(filterFamily, 0, evt.target.value);

      _this.setState({
        scrollTop: 0
      });

      onSearchChange(evt);
    };

    _this.handleSearchKeyDown = function (evt) {
      var keyCode = evt.keyCode;
      var _this$state$matches = _this.state.matches,
          matches = _this$state$matches === void 0 ? [] : _this$state$matches;
      var firstEntry = matches.find(_isSelectableEntry);

      if (keyCode === ENTER && firstEntry) {
        evt.stopPropagation();

        _this.handleFieldChange(firstEntry);
      }
    };

    _this.state = {
      matches: []
    };
    _this.getRowHeight = _this.getRowHeight.bind(_assertThisInitialized(_this));
    _this.getSortedFieldGroups = memoizeLast(getSortedFieldGroups);
    _this.getSortedFields = memoizeLast(getSortedFields);
    _this.measureText = memoize(measureText); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    _this.renderList = _this.renderList.bind(_assertThisInitialized(_this));
    _this.renderListPlaceholder = _this.renderListPlaceholder.bind(_assertThisInitialized(_this));
    _this.renderRow = _this.renderRow.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FilterEditorFieldSelect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props4 = this.props,
          filterFamily = _this$props4.filterFamily,
          loadMoreFields = _this$props4.loadMoreFields,
          searchValue = _this$props4.searchValue;
      loadMoreFields(filterFamily, 0, searchValue);
      this.updateMatches(this.props);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var didChange = function didChange(propName) {
        return nextProps[propName] !== undefined && nextProps[propName] !== _this2.props[propName];
      };

      if (didChange('searchValue') || didChange('fieldGroups') || didChange('fields')) {
        this.updateMatches(nextProps);
      }
    }
  }, {
    key: "getRowHeight",
    value: function getRowHeight(dimensions, row) {
      var entry = this.state.matches[row.index];

      if (entry.properties) {
        return GROUP_NAME_HEIGHT;
      }

      return this.measureText(dimensions.width, this.props.getLabelString(entry));
    }
  }, {
    key: "updateMatches",
    value: function updateMatches(props) {
      var fieldGroups = props.fieldGroups,
          fields = props.fields,
          getLabelString = props.getLabelString,
          isXoEnabled = props.isXoEnabled,
          searchValue = props.searchValue;
      var matches;

      if ((!fieldGroups || fieldGroups.size === 0) && isXoEnabled) {
        var sortedFields = this.getSortedFields(getLabelString, fields || ImmutableMap());
        matches = searchLookup(getLabelString, sortedFields, searchValue);
      } else {
        var sortedGroups = this.getSortedFieldGroups(getLabelString, fieldGroups || ImmutableMap());
        matches = lookupGroups(getLabelString, sortedGroups, searchValue);
      }

      this.setState({
        matches: matches
      });
    }
  }, {
    key: "renderListPlaceholder",
    value: function renderListPlaceholder(dimensions) {
      var paddingTop = 12;
      return /*#__PURE__*/_jsx("div", {
        style: {
          height: dimensions.height,
          paddingTop: paddingTop + "px",
          width: dimensions.width
        },
        children: /*#__PURE__*/_jsx(UIList, {
          children: /*#__PURE__*/_jsx(ShimmerWrapper, {
            children: /*#__PURE__*/_jsx(ListPlaceholderSvg, {
              height: dimensions.height - paddingTop,
              rowHeight: 14,
              rowMinWidth: 120,
              rowPaddingX: 16,
              width: dimensions.width
            })
          })
        })
      });
    }
  }, {
    key: "renderList",
    value: function renderList(dimensions) {
      var _this3 = this;

      var _this$state = this.state,
          _this$state$matches2 = _this$state.matches,
          matches = _this$state$matches2 === void 0 ? [] : _this$state$matches2,
          scrollTop = _this$state.scrollTop;

      var isRowLoaded = function isRowLoaded(_ref4) {
        var index = _ref4.index;
        return index < matches.length;
      };

      var rowCount = matches.length + 1;
      return /*#__PURE__*/_jsx(InfiniteLoader, {
        isRowLoaded: isRowLoaded,
        loadMoreRows: this.handleLoadMoreRows,
        rowCount: rowCount,
        children: function children(_ref5) {
          var onRowsRendered = _ref5.onRowsRendered,
              registerChild = _ref5.registerChild;
          return /*#__PURE__*/_jsx(VirtualizedList, {
            height: dimensions.height,
            noRowsRenderer: _this3.renderNoRows,
            onRowsRendered: onRowsRendered,
            onScroll: _this3.handleScroll,
            ref: registerChild,
            rowCount: matches.length,
            rowHeight: _this3.partial(_this3.getRowHeight, dimensions),
            rowRenderer: _this3.renderRow,
            scrollTop: scrollTop,
            width: dimensions.width
          });
        }
      });
    }
  }, {
    key: "renderNoRows",
    value: function renderNoRows() {
      return /*#__PURE__*/_jsx("span", {
        className: "p-top-3",
        style: Object.assign({}, styles.result, {
          color: BUTTON_DISABLED_TEXT
        }),
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: UITypeahead.noMatchesI18nKey
        })
      });
    }
  }, {
    key: "renderRow",
    value: function renderRow(row) {
      var _this$props5 = this.props,
          isXoEnabled = _this$props5.isXoEnabled,
          fieldGroups = _this$props5.fieldGroups;
      var entry = this.state.matches[row.index] || ImmutableMap();

      if (entry.get('heading')) {
        return this.renderHeadingRow(row, entry);
      }

      if (entry.properties && (!isXoEnabled || fieldGroups && fieldGroups.size > 0)) {
        return this.renderSubheadingRow(row, entry);
      }

      return this.renderPropertyRow(row, entry);
    }
  }, {
    key: "renderHeadingRow",
    value: function renderHeadingRow(row, entry) {
      var message = "filterSidebar." + entry.get('heading');
      return /*#__PURE__*/_jsx("h5", {
        className: "m-all-0 p-x-1 p-y-3",
        style: row.style,
        children: /*#__PURE__*/_jsx(UITruncateString, {
          placement: "right",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: message
          })
        })
      }, row.key);
    }
  }, {
    key: "renderSubheadingRow",
    value: function renderSubheadingRow(row, entry) {
      return /*#__PURE__*/_jsx("div", {
        className: "is--heading-7 m-all-0 p-x-1 p-y-3",
        style: row.style,
        children: /*#__PURE__*/_jsx(UITruncateString, {
          placement: "right",
          children: propertyLabelTranslator(entry.get('displayName'))
        })
      }, row.key);
    }
  }, {
    key: "renderPropertyRow",
    value: function renderPropertyRow(row, entry) {
      var _this$props6 = this.props,
          activeFieldNames = _this$props6.activeFieldNames,
          getLabelString = _this$props6.getLabelString,
          FieldSelectItemComponent = _this$props6.FieldSelectItemComponent;
      var isActiveFieldName = activeFieldNames.contains(entry.name);
      return /*#__PURE__*/_jsx("div", {
        style: row.style,
        children: /*#__PURE__*/_jsx(FieldSelectItemComponent, {
          className: "result",
          "data-selenium-info": "" + entry.name,
          "data-selenium-test": "filter-result-item",
          disabled: isActiveFieldName,
          field: entry,
          onClick: this.partial(this.handleFieldChange, entry),
          style: styles.result,
          children: getLabelString(entry)
        })
      }, row.key);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props7 = this.props,
          fieldGroups = _this$props7.fieldGroups,
          fields = _this$props7.fields,
          isXoEnabled = _this$props7.isXoEnabled,
          placeholder = _this$props7.placeholder,
          searchValue = _this$props7.searchValue,
          searchable = _this$props7.searchable;
      var baseRowHeight = 30;
      var arbitraryMinHeight = baseRowHeight / 2 + GROUP_NAME_HEIGHT + "px";
      return /*#__PURE__*/_jsxs("div", {
        className: "flex-grow-1 flex-column",
        children: [!isXoEnabled && /*#__PURE__*/_jsx("div", {
          className: "is--heading-7 m-all-0 p-bottom-3",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.addFilter"
          })
        }), searchable && /*#__PURE__*/_jsx(UISearchInput, {
          autoFocus: true,
          className: "m-bottom-2",
          "data-selenium-test": "filter-search-input",
          icon: isXoEnabled,
          onChange: this.handleSearchChange,
          onKeyDown: this.handleSearchKeyDown,
          placeholder: isXoEnabled ? undefined : placeholder,
          value: searchValue
        }), /*#__PURE__*/_jsx("div", {
          className: "flex-grow-1",
          style: {
            minHeight: arbitraryMinHeight
          },
          children: /*#__PURE__*/_jsx(AutoSizer, {
            children: function children(dimensions) {
              return dimensions.height > 0 && fields === undefined && fieldGroups === undefined ? _this4.renderListPlaceholder(dimensions) : _this4.renderList(dimensions);
            }
          })
        })]
      });
    }
  }]);

  return FilterEditorFieldSelect;
}(PureComponent);
/**
 * Dear future us,
 *
 * In the dev environment, the propTypes for this component can be a big
 * bottle neck if the portal has a lot of properties (e.g. in 53). The
 * good news is those don't run on production.
 *
 * If you're running into some slowness, try commenting out the type for
 * `fieldGroups` before getting too deep into the perf tools.
 *
 * Sincerely,
 * Past Colby
 */


export { FilterEditorFieldSelect as default };
FilterEditorFieldSelect.propTypes = {
  FieldSelectItemComponent: PropTypes.func,
  activeFieldNames: setOf(PropTypes.string.isRequired).isRequired,
  fieldGroups: mapOf(FilterFieldGroupType.isRequired),
  fields: mapOf(FilterFieldType),
  filterFamily: PropTypes.string.isRequired,
  getLabelString: PropTypes.func.isRequired,
  getOperators: PropTypes.func.isRequired,
  isXoEnabled: PropTypes.bool,
  loadMoreFields: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchValue: PropTypes.string.isRequired,
  searchable: PropTypes.bool.isRequired
};
FilterEditorFieldSelect.defaultProps = {
  filterFamily: '',
  loadMoreFields: always(false),
  searchable: true
};