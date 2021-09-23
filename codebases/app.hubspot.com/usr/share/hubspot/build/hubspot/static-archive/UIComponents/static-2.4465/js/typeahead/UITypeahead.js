'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import { OptionOrGroupType, SingleValueType } from '../types/OptionTypes';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import partial from 'react-utils/partial';
import classNames from 'classnames';
import SyntheticEvent from '../core/SyntheticEvent';
import { getNoMatchesOption, getSearchRegExp } from './UITypeaheadUtils';
import UITypeaheadResults from './results/UITypeaheadResults';
import UITypeaheadResultsGroup from './results/UITypeaheadResultsGroup';
import UITypeaheadResultsItem from './results/UITypeaheadResultsItem';
import UITypeaheadSearch from './search/UITypeaheadSearch';
import { uniqueId } from '../utils/underscore';
import refObject from '../utils/propTypes/refObject';

function getFlattenedOptions(groupedOptions) {
  var groups = [];
  var options = [];
  groupedOptions.forEach(function (option) {
    if (Object.prototype.hasOwnProperty.call(option, 'options')) {
      var groupIdx = groups.push(option) - 1;
      option.options.forEach(function (groupOption) {
        options.push(Object.assign({}, groupOption, {
          groupIdx: groupIdx
        }));
      });
    } else {
      options.push(Object.assign({}, option, {
        groupIdx: -1
      }));
    }
  });
  return {
    options: options,
    groups: groups
  };
}

function getHighlightedIndex(component, filtered) {
  return filtered.options.indexOf(component.getHighlighted(filtered));
}

var KeyHandlers = {
  ArrowDown: function ArrowDown(component) {
    var filtered = component.getFilteredOptions();
    var options = filtered.options;
    var nextIndex = (getHighlightedIndex(component, filtered) + 1) % options.length;
    component.setState({
      highlighted: options[nextIndex],
      highlightedId: component.getResultItemId(options[nextIndex])
    });
  },
  Enter: function Enter(component, evt) {
    component.handleChange(component.getHighlighted(component.getFilteredOptions()), evt);
  },
  ArrowUp: function ArrowUp(component) {
    var filtered = component.getFilteredOptions();
    var options = filtered.options;
    var index = getHighlightedIndex(component, filtered);
    var nextIndex = index === 0 ? options.length - 1 : index - 1;
    component.setState({
      highlighted: options[nextIndex],
      highlightedId: component.getResultItemId(options[nextIndex])
    });
  }
};

var UITypeaheadCore = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITypeaheadCore, _PureComponent);

  function UITypeaheadCore(props) {
    var _this;

    _classCallCheck(this, UITypeaheadCore);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITypeaheadCore).call(this, props));

    _this.handleChange = function (option, evt) {
      if (option.disabled) {
        return;
      }

      _this.handleHighlight(option, evt);

      var onChange = _this.props.onChange;
      onChange(SyntheticEvent(option.value, evt));
    };

    _this.handleHighlight = function (option, evt) {
      var highlighted = _this.state.highlighted;

      if (highlighted === option) {
        return;
      }

      _this.setState({
        highlighted: option,
        highlightedId: evt.currentTarget.id
      });
    };

    _this.handleKeyDown = function (evt) {
      var handler = KeyHandlers[evt.key];

      if (handler) {
        evt.preventDefault();
        handler(_assertThisInitialized(_this), evt);
      }
    };

    var autoFilter = props.autoFilter,
        options = props.options,
        search = props.search;
    _this.state = {
      flattened: getFlattenedOptions(options),
      highlighted: null,
      highlightedId: null,
      searchRegex: autoFilter ? getSearchRegExp(search) : undefined
    };
    return _this;
  }

  _createClass(UITypeaheadCore, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(_ref) {
      var options = _ref.options,
          search = _ref.search;

      if (options !== this.props.options) {
        this.setState({
          flattened: getFlattenedOptions(options)
        });
      }

      if (this.props.autoFilter && search !== this.props.search) {
        this.setState({
          searchRegex: getSearchRegExp(search)
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var highlightedNode = findDOMNode(this._highlightedRef);

      if (!highlightedNode) {
        return;
      }

      var offsetHeight = highlightedNode.offsetHeight,
          offsetParent = highlightedNode.offsetParent,
          offsetTop = highlightedNode.offsetTop;
      var scrollTop = offsetParent.scrollTop;

      if (scrollTop > offsetTop) {
        offsetParent.scrollTop = offsetTop;
      }

      var nodeBottom = offsetHeight + offsetTop;
      var parentBottom = scrollTop + offsetParent.offsetHeight;

      if (parentBottom >= nodeBottom) {
        return;
      }

      offsetParent.scrollTop = scrollTop + nodeBottom - parentBottom;
    }
  }, {
    key: "getClassName",
    value: function getClassName() {
      return classNames("private-dropdown private-typeahead", this.props.className, this.getSearchCount() < this.props.minimumSearchCount && 'hide-search');
    }
  }, {
    key: "getFilteredOptions",
    value: function getFilteredOptions() {
      var _this$state = this.state,
          searchRegex = _this$state.searchRegex,
          flattened = _this$state.flattened;
      var results = searchRegex ? flattened.options.filter(function (_ref2) {
        var dropdownText = _ref2.dropdownText,
            text = _ref2.text,
            value = _ref2.value;
        return searchRegex.test(text) || searchRegex.test("" + value) || typeof dropdownText === 'string' && searchRegex.test(dropdownText);
      }) : flattened.options;
      return {
        groups: flattened.groups,
        options: results.length ? results : [getNoMatchesOption()]
      };
    }
  }, {
    key: "getHighlighted",
    value: function getHighlighted(filtered) {
      var value = this.props.value;
      var highlighted = this.state.highlighted;

      if (highlighted && filtered.options.indexOf(highlighted) > -1) {
        return highlighted;
      }

      return filtered.options.find(function (option) {
        return option.value === value;
      }) || filtered.options[0] || null;
    }
  }, {
    key: "getResultItemId",
    value: function getResultItemId(option) {
      return this._id + "_" + this.state.flattened.options.indexOf(option);
    }
  }, {
    key: "getSearchCount",
    value: function getSearchCount() {
      var flattened = this.state.flattened;

      if (!flattened || !flattened.options) {
        return -1;
      }

      return flattened.options.length + flattened.groups.length;
    }
  }, {
    key: "renderFilteredOptions",
    value: function renderFilteredOptions() {
      var _this2 = this;

      var filtered = this.getFilteredOptions();
      var groups = filtered.groups;
      var highlighted = this.getHighlighted(filtered);
      var groupIdx = -1;
      var groupedOptions = [];
      var options = [];
      filtered.options.forEach(function (option) {
        if (option.groupIdx !== groupIdx) {
          if (groupedOptions.length) {
            options.push(_this2.renderResultsGroup(groups[groupIdx], groupedOptions, highlighted));
          }

          groupIdx = option.groupIdx;
          groupedOptions = [];
        }

        if (option.groupIdx === -1) {
          options.push(_this2.renderResultsItem(option, highlighted));
        } else {
          groupedOptions.push(option);
        }
      });

      if (groupedOptions.length) {
        options.push(this.renderResultsGroup(groups[groupIdx], groupedOptions, highlighted));
      }

      return options;
    }
  }, {
    key: "renderResults",
    value: function renderResults(_ref3) {
      var id = _ref3.id,
          hideResults = _ref3.hideResults,
          resultsClassName = _ref3.resultsClassName;

      if (hideResults) {
        return null;
      }

      return /*#__PURE__*/_jsx(UITypeaheadResults, {
        id: id,
        className: resultsClassName,
        children: this.renderFilteredOptions()
      });
    }
  }, {
    key: "renderResultsGroup",
    value: function renderResultsGroup(group, options, highlighted) {
      var _this3 = this;

      return /*#__PURE__*/_jsx(UITypeaheadResultsGroup, {
        group: group,
        children: options.map(function (option) {
          return _this3.renderResultsItem(option, highlighted);
        })
      }, group.value || group.options[0].value);
    }
  }, {
    key: "renderResultsItem",
    value: function renderResultsItem(option, highlighted) {
      var _this4 = this;

      if (option === getNoMatchesOption()) {
        return this.renderResultsEmpty();
      }

      var isHighlighted = highlighted === option;
      return /*#__PURE__*/_jsx(UITypeaheadResultsItem, {
        highlighted: isHighlighted,
        itemComponent: this.props.itemComponent,
        onClick: partial(this.handleChange, option),
        onMouseEnter: partial(this.handleHighlight, option),
        option: option,
        ref: isHighlighted ? function (ref) {
          _this4._highlightedRef = ref;
        } : undefined,
        search: this.state.searchRegex,
        id: this.getResultItemId(option)
      }, option.value);
    }
  }, {
    key: "renderResultsEmpty",
    value: function renderResultsEmpty() {
      return /*#__PURE__*/_jsx(UITypeaheadResultsItem, {
        disabled: true,
        itemComponent: this.props.itemComponent,
        option: getNoMatchesOption()
      }, getNoMatchesOption().value);
    }
  }, {
    key: "renderSearch",
    value: function renderSearch(_ref4) {
      var ariaControls = _ref4.ariaControls,
          current = _ref4.current,
          onSearchChange = _ref4.onSearchChange,
          search = _ref4.search,
          searchClassName = _ref4.searchClassName,
          rest = _objectWithoutProperties(_ref4, ["ariaControls", "current", "onSearchChange", "search", "searchClassName"]);

      return /*#__PURE__*/_jsx(UITypeaheadSearch, Object.assign({}, rest, {
        "aria-activedescendant": current,
        "aria-controls": ariaControls,
        className: searchClassName,
        onChange: onSearchChange,
        onKeyDown: this.handleKeyDown,
        value: search
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          __autoFilter = _this$props.autoFilter,
          hideResults = _this$props.hideResults,
          __itemComponent = _this$props.itemComponent,
          __minimumSearchCount = _this$props.minimumSearchCount,
          onSearchChange = _this$props.onSearchChange,
          __options = _this$props.options,
          resultsClassName = _this$props.resultsClassName,
          search = _this$props.search,
          searchClassName = _this$props.searchClassName,
          style = _this$props.style,
          rest = _objectWithoutProperties(_this$props, ["autoFilter", "hideResults", "itemComponent", "minimumSearchCount", "onSearchChange", "options", "resultsClassName", "search", "searchClassName", "style"]);

      var highlightedId = this.state.highlightedId;
      this._id = this._id || uniqueId('typeahead-');
      var renderedSearch = this.renderSearch(Object.assign({
        ariaControls: this._id,
        current: highlightedId,
        onSearchChange: onSearchChange,
        search: search,
        searchClassName: searchClassName
      }, rest));
      var renderedResults = this.renderResults({
        id: this._id,
        hideResults: hideResults,
        resultsClassName: resultsClassName
      });
      return /*#__PURE__*/_jsxs("div", {
        "aria-expanded": true,
        "aria-haspopup": "listbox",
        "aria-controls": this._id,
        className: this.getClassName(),
        role: "combobox",
        style: style,
        children: [renderedSearch, renderedResults]
      });
    }
  }]);

  return UITypeaheadCore;
}(PureComponent);

UITypeaheadCore.propTypes = {
  autoFilter: PropTypes.bool,
  hideResults: PropTypes.bool,
  inputRef: refObject,
  itemComponent: PropTypes.elementType,
  minimumSearchCount: PropTypes.number,
  onChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  options: PropTypes.arrayOf(OptionOrGroupType.isRequired).isRequired,
  placeholder: PropTypes.string,
  resultsClassName: PropTypes.string,
  search: PropTypes.string,
  searchClassName: PropTypes.string,
  value: SingleValueType
};
UITypeaheadCore.defaultProps = {
  autoFilter: true,
  hideResults: false,
  itemComponent: 'li',
  minimumSearchCount: 0,
  search: ''
};
UITypeaheadCore.displayName = 'UITypeahead';
var UITypeahead = ShareInput(Controllable(UITypeaheadCore, ['search', 'value']));
UITypeahead.noMatchesI18nKey = 'salesUI.UITypeahead.noMatchesFound';
UITypeahead.noOptionsI18nKey = 'salesUI.UITypeahead.noOptions';
export default UITypeahead;