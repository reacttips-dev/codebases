'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import partial from 'react-utils/partial';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import { OptionGroupType } from '../types/OptionTypes';
import refObject from '../utils/propTypes/refObject';
import UITypeaheadResults from './results/UITypeaheadResults';
import UITypeaheadResultsGroup from './results/UITypeaheadResultsGroup';
import UITypeaheadResultsItem from './results/UITypeaheadResultsItem';
import UITypeaheadSearch from './search/UITypeaheadSearch';
import { getEmptyGroup, getNoMatchesOption, getSearchRegExp } from './UITypeaheadUtils';

var getFilteredOptions = function getFilteredOptions(options, searchRegex) {
  if (!searchRegex) {
    return options;
  }

  return options.filter(function (_ref) {
    var dropdownText = _ref.dropdownText,
        text = _ref.text,
        value = _ref.value;
    return searchRegex.test(text) || searchRegex.test("" + value) || typeof dropdownText === 'string' && searchRegex.test(dropdownText);
  });
};

var getFirstValidOption = function getFirstValidOption(group, searchRegex) {
  var options = getFilteredOptions(group.options, searchRegex);

  if (!options) {
    return null;
  }

  for (var i = 0; i < options.length; i++) {
    if (!options[i].disabled) {
      return options[i];
    }
  }

  return null;
};

var getInitialHighlighted = function getInitialHighlighted(props) {
  var options = props.options,
      value = props.value;
  var groupLength = options.length;

  if (value) {
    for (var i = 0; i < groupLength; i++) {
      var group = props.options[i];

      for (var j = 0; j < group.options.length; j++) {
        var option = group.options[j];

        if (option.value === value) {
          return option;
        }
      } // end for each option

    } // end for each group

  }

  for (var _i = 0; _i < groupLength; _i++) {
    var highlighted = getFirstValidOption(options[_i]);

    if (highlighted) {
      return highlighted;
    }
  }

  return null;
};

var UIGroupedTypeahead = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIGroupedTypeahead, _PureComponent);

  function UIGroupedTypeahead(props) {
    var _this;

    _classCallCheck(this, UIGroupedTypeahead);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIGroupedTypeahead).call(this, props));

    _this.handleChange = function (option, evt) {
      if (option.disabled) {
        return;
      }

      _this.handleHighlight(option);

      var onChange = _this.props.onChange;
      onChange(SyntheticEvent(option.value, evt));
    };

    _this.handleHighlight = function (option, resetScroll) {
      if (_this.state.highlighted === option) {
        return;
      }

      if (resetScroll) {
        var highlightedNode = findDOMNode(_this._highlightedRef);

        if (highlightedNode != null) {
          highlightedNode.parentElement.parentElement.scrollTop = 0;
        }
      }

      _this.setState({
        highlighted: option
      });
    };

    _this.handleKeyDown = function (evt) {
      var index = _this.getHighlightedIndexes();

      switch (evt.key) {
        case 'ArrowLeft':
          evt.preventDefault();

          _this.keyLeft(index);

          break;

        case 'ArrowRight':
          evt.preventDefault();

          _this.keyRight(index);

          break;

        case 'ArrowUp':
          evt.preventDefault();

          _this.keyUp(index);

          break;

        case 'ArrowDown':
          evt.preventDefault();

          _this.keyDown(index);

          break;

        case 'Enter':
          evt.preventDefault();

          _this.keyEnter();

          break;

        default:
          break;
      }
    };

    _this.state = {
      highlighted: getInitialHighlighted(props),
      searchRegex: props.autoFilter ? getSearchRegExp(props.search) : undefined
    };
    return _this;
  }

  _createClass(UIGroupedTypeahead, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(_ref2) {
      var autoFilter = _ref2.autoFilter,
          search = _ref2.search;

      if (autoFilter && search !== this.props.search) {
        this.setState({
          searchRegex: getSearchRegExp(search)
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var highlightedNode = findDOMNode(this._highlightedRef);

      if (highlightedNode == null) {
        return;
      }

      var parent = highlightedNode.parentElement.parentElement;
      var offsetTop = highlightedNode.offsetTop;
      var scrollTop = parent.scrollTop;

      if (scrollTop > offsetTop) {
        parent.scrollTop = 0;
        return;
      }

      var nodeBottom = highlightedNode.offsetHeight + offsetTop;
      var parentBottom = scrollTop + parent.offsetHeight;

      if (parentBottom < nodeBottom) {
        parent.scrollTop = scrollTop + nodeBottom - parentBottom;
      }
    }
  }, {
    key: "getEmptyGroupOption",
    value: function getEmptyGroupOption(group) {
      if (group.emptyMessage) {
        return Object.assign({}, getEmptyGroup(), {
          text: group.emptyMessage
        });
      }

      return getEmptyGroup();
    }
  }, {
    key: "getHighlightedIndexes",
    value: function getHighlightedIndexes() {
      var options = this.props.options;
      var highlighted = this.state.highlighted;

      for (var i = 0; i < options.length; i++) {
        var group = options[i];

        for (var j = 0; j < group.options.length; j++) {
          var groupOption = group.options[j];

          if (highlighted === groupOption) {
            return {
              groupIdx: i,
              optionIdx: j
            };
          }
        } // end for each option

      } // end for each group


      return {};
    }
  }, {
    key: "getSearchCount",
    value: function getSearchCount() {
      var count = this.props.options.reduce(function (cnt, group) {
        return Math.max(cnt, group.options.length);
      }, 0);
      return count;
    }
  }, {
    key: "isHighlighted",
    value: function isHighlighted(option) {
      var highlighted = this.state.highlighted;

      if (highlighted) {
        return option === highlighted;
      }

      var value = option.value;

      if (Object.prototype.hasOwnProperty.call(this.props, 'value')) {
        return this.props.value === value;
      }

      return this.state.value === value;
    }
  }, {
    key: "keyDown",
    value: function keyDown(_ref3) {
      var groupIdx = _ref3.groupIdx,
          optionIdx = _ref3.optionIdx;
      var group = this.props.options[groupIdx];
      var optionLength = group.options.length;
      var optIdx = optionIdx + 1;

      while (optIdx < optionLength) {
        var option = group.options[optIdx];

        if (option.disabled) {
          optIdx++;
        } else {
          this.handleHighlight(option, false);
          break;
        }
      }
    }
  }, {
    key: "keyEnter",
    value: function keyEnter() {
      this.handleChange(this.state.highlighted);
    }
  }, {
    key: "keyLeft",
    value: function keyLeft(_ref4) {
      var groupIdx = _ref4.groupIdx;
      var grpIdx = groupIdx - 1;

      while (grpIdx >= 0) {
        var group = this.props.options[grpIdx];
        var option = getFirstValidOption(group, this.state.searchRegex);

        if (option) {
          this.handleHighlight(option, true);
          break;
        }

        grpIdx--;
      }
    }
  }, {
    key: "keyRight",
    value: function keyRight(_ref5) {
      var groupIdx = _ref5.groupIdx;
      var groupLength = this.props.options.length;
      var grpIdx = groupIdx + 1;

      while (grpIdx < groupLength) {
        var group = this.props.options[grpIdx];
        var option = getFirstValidOption(group, this.state.searchRegex);

        if (option) {
          this.handleHighlight(option, true);
          break;
        }

        grpIdx++;
      }
    }
  }, {
    key: "keyUp",
    value: function keyUp(_ref6) {
      var groupIdx = _ref6.groupIdx,
          optionIdx = _ref6.optionIdx;
      var group = this.props.options[groupIdx];
      var optIdx = optionIdx - 1;

      while (optIdx >= 0) {
        var option = group.options[optIdx];

        if (option.disabled) {
          optIdx--;
        } else {
          this.handleHighlight(option, false);
          break;
        }
      }
    }
  }, {
    key: "renderResultGroups",
    value: function renderResultGroups() {
      var _this2 = this;

      var groups = [];
      this.props.options.forEach(function (group, i) {
        var results = null;

        if (group.options.length === 0) {
          results = _this2.renderResultsEmpty(_this2.getEmptyGroupOption(group), !!group.emptyMessage);
        } else {
          var options = getFilteredOptions(group.options, _this2.state.searchRegex);

          if (options.length === 0) {
            results = _this2.renderResultsEmpty(getNoMatchesOption());
          } else {
            results = options.map(function (option) {
              return _this2.renderResultsItem(option);
            });
          }
        }

        groups.push( /*#__PURE__*/_jsx(UITypeaheadResultsGroup, {
          group: group,
          children: results
        }, group.value || i));
      });
      return groups;
    }
  }, {
    key: "renderResultsItem",
    value: function renderResultsItem(option) {
      var _this3 = this;

      var isHighlighted = this.isHighlighted(option);
      var searchRegex = this.state.searchRegex;
      return /*#__PURE__*/_jsx(UITypeaheadResultsItem, {
        highlighted: isHighlighted,
        onClick: partial(this.handleChange, option),
        onMouseEnter: partial(this.handleHighlight, option, false),
        option: option,
        ref: isHighlighted ? function (ref) {
          _this3._highlightedRef = ref;
        } : undefined,
        search: searchRegex
      }, option.value);
    }
  }, {
    key: "renderResultsEmpty",
    value: function renderResultsEmpty(option, isMessage) {
      return /*#__PURE__*/_jsx(UITypeaheadResultsItem, {
        disabled: true,
        message: isMessage,
        option: option
      }, option.value);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          inputRef = _this$props.inputRef,
          minimumSearchCount = _this$props.minimumSearchCount,
          onSearchChange = _this$props.onSearchChange,
          placeholder = _this$props.placeholder,
          search = _this$props.search;
      var computedClassName = "private-dropdown private-typeahead layout-grouped" + (this.getSearchCount() < minimumSearchCount ? " hide-search" : "");

      var renderedSearch = /*#__PURE__*/_jsx(UITypeaheadSearch, {
        inputRef: inputRef,
        onChange: onSearchChange,
        onKeyDown: this.handleKeyDown,
        placeholder: placeholder,
        value: search
      });

      return /*#__PURE__*/_jsxs("div", {
        className: computedClassName,
        children: [renderedSearch, /*#__PURE__*/_jsx(UITypeaheadResults, {
          children: this.renderResultGroups()
        })]
      });
    }
  }]);

  return UIGroupedTypeahead;
}(PureComponent);

UIGroupedTypeahead.propTypes = {
  autoFilter: PropTypes.bool,
  inputRef: refObject,
  minimumSearchCount: PropTypes.number,
  onChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  options: PropTypes.arrayOf(OptionGroupType.isRequired).isRequired,
  placeholder: PropTypes.string,
  search: PropTypes.string,
  value: PropTypes.string
};
UIGroupedTypeahead.defaultProps = {
  autoFilter: true,
  minimumSearchCount: 0,
  search: ''
};
UIGroupedTypeahead.displayName = 'UIGroupedTypeahead';
export default ShareInput(Controllable(UIGroupedTypeahead, ['search', 'value']));