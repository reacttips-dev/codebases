/* eslint-disable no-prototype-builtins */
'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import Controllable from '../decorators/Controllable';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import Select from 'react-select-plus';
import devLogger from 'react-utils/devLogger';
import { closest } from '../utils/Dom';
import { getAriaAndDataProps } from '../utils/Props';
import { callIfPossible, sequence } from '../core/Functions';
import SyntheticEvent from '../core/SyntheticEvent';
import { OptionOrGroupType, ValueType } from '../types/OptionTypes';
import { PLACEMENTS } from '../tooltip/PlacementConstants';
import UITypeaheadResultsItem from '../typeahead/results/UITypeaheadResultsItem';
import UILink from '../link/UILink';
import UIControlledPopover from '../tooltip/UIControlledPopover';
import UILoadingSpinner from '../loading/UILoadingSpinner';
import UISearchInput from '../input/UISearchInput';
import MultiSelectValue from './utils/MultiSelectValue';
import UISelectWithButtonAnchor from './internal/UISelectWithButtonAnchor';
import UISelectWithInputAnchor from './internal/UISelectWithInputAnchor';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import * as customRenderer from '../utils/propTypes/customRenderer';
import { hidden } from '../utils/propTypes/decorators';
import { MIN_MENU_WIDTH } from '../constants/Tether';
import UIButton from '../button/UIButton';
import UIClickable from '../button/UIClickable';
import refObject from '../utils/propTypes/refObject';
import memoizeOne from 'react-utils/memoizeOne';
import { Consumer as FieldsetContextConsumer } from '../context/FieldsetContext';
var Async = Select.Async,
    Creatable = Select.Creatable,
    stripDiacritics = Select.stripDiacritics;
var SELECT_SIZE_OPTIONS = {
  default: '',
  small: 'private-form__selectplus--small'
};
var hasPingedNewRelic = false;
var hasShownDevWarning = false;

var isVirtualized = function isVirtualized(menuRenderer) {
  return menuRenderer && menuRenderer.displayName === 'virtualizedMenuRenderer';
};

var LoadMoreComponent = function LoadMoreComponent(_ref) {
  var options = _ref.options,
      pagination = _ref.pagination;
  return /*#__PURE__*/_jsxs("span", {
    children: [/*#__PURE__*/_jsx("span", {
      className: "private-form__selectplus--load-more-count",
      children: pagination.length ? I18n.text('salesUI.UISelect.andMore', {
        count: pagination.length - options.length
      }) : ''
    }), /*#__PURE__*/_jsx(UILink, {
      children: I18n.text('salesUI.UISelect.loadMore')
    })]
  });
};

var multiDummyOption;

var getMultiDummyOption = function getMultiDummyOption() {
  multiDummyOption = multiDummyOption || {
    disabled: true,
    dropdownText: I18n.text('salesUI.UISelect.allOptionsSelected'),
    isSpecial: true,
    title: '',
    value: '__MULTI_DUMMY_OPTION__'
  };
  return multiDummyOption;
};

var loadMoreOptionValue = '__LOAD_MORE_OPTION__';

var getLoadMoreOption = function getLoadMoreOption(_ref2) {
  var input = _ref2.input,
      loadMoreComponent = _ref2.loadMoreComponent,
      options = _ref2.options,
      pagination = _ref2.pagination;
  return {
    dropdownClassName: 'private-form__selectplus--load-more',
    dropdownText: customRenderer.render(loadMoreComponent, {
      options: options,
      pagination: pagination
    }),
    input: input,
    isSpecial: true,
    title: '',
    value: loadMoreOptionValue
  };
};

var getIsLoadingOption = function getIsLoadingOption() {
  return {
    disabled: true,
    dropdownClassName: 'private-dropdown__loading',
    dropdownText: /*#__PURE__*/_jsx(UILoadingSpinner, {
      layout: "centered",
      size: "sm"
    }),
    isSpecial: true,
    title: '',
    value: '__IS_LOADING_OPTION__'
  };
};

var getInputProps = function getInputProps(autoComplete, disabled, id, searchable, computedAnchorType, handleAutosize, handlePaste, readOnly) {
  if (disabled || !searchable || computedAnchorType !== 'combined' || readOnly) return {};
  return {
    autoComplete: autoComplete,
    id: id,
    onAutosize: handleAutosize,
    onPaste: handlePaste
  };
};
/**
 * @param {Object} option The option to determine the checkbox state for
 * @param {*} value The `value` prop
 * @return {Object} { indeterminate, checked }
 */


var getCheckboxState = function getCheckboxState(option, value) {
  if (option.getCheckboxState) return option.getCheckboxState(option);
  var isOptionGroup = !!option.options;
  var isSelectAll = isOptionGroup && !!option.selectAll;
  var nestedOptionCount = 0;
  var selectedOptionCount = 0;

  if (isSelectAll) {
    var tabulate = function tabulate(o) {
      if (o.options) {
        o.options.forEach(tabulate);
      } else if (!o.disabled) {
        nestedOptionCount += 1;
        if (Array.isArray(value) && value.includes(o.value)) selectedOptionCount += 1;
      }
    };

    tabulate(option);
  }

  var indeterminate = isSelectAll && 0 < selectedOptionCount && selectedOptionCount < nestedOptionCount;
  var checked = isSelectAll ? nestedOptionCount === selectedOptionCount : !!(Array.isArray(value) && value.includes(option.value));
  return {
    indeterminate: indeterminate,
    checked: checked
  };
};

var makeNewOptionsCache = function makeNewOptionsCache(optionsCache, options) {
  var newOptionsCache = Object.assign({}, optionsCache);

  var addOptionToCache = function addOptionToCache(option) {
    newOptionsCache[option.value] = option;
  };

  var addOptionListToCache = function addOptionListToCache(optionList) {
    optionList.forEach(function (option) {
      if (Array.isArray(option.options)) {
        addOptionListToCache(option.options);
      } else {
        addOptionToCache(option);
      }
    });
  }; // Recursively add all options, including those within groups, to the cache.


  addOptionListToCache(options);
  return newOptionsCache;
};

function promptTextCreator(label) {
  return I18n.text('salesUI.UISelect.createOption', {
    label: I18n.SafeString(label)
  });
}
/**
 * "Cleans" an input value. Matches the filter react-select-plus applies to the input passed to `loadOptionsProxy`. (#5289)
 */


function filterInputValue(inputValue, _ref3) {
  var _ref3$ignoreAccents = _ref3.ignoreAccents,
      ignoreAccents = _ref3$ignoreAccents === void 0 ? true : _ref3$ignoreAccents,
      _ref3$ignoreCase = _ref3.ignoreCase,
      ignoreCase = _ref3$ignoreCase === void 0 ? true : _ref3$ignoreCase;
  // https://github.com/HubSpot/react-select-plus/blob/8ae7465fc9b6b9600a01e4e23de97f2d403fd139/src/Async.js#L155-L163
  var transformedInputValue = inputValue;

  if (ignoreAccents) {
    transformedInputValue = stripDiacritics(transformedInputValue);
  }

  if (ignoreCase) {
    transformedInputValue = transformedInputValue.toLowerCase();
  }

  return transformedInputValue;
}

var UISelectCore = /*#__PURE__*/function (_Component) {
  _inherits(UISelectCore, _Component);

  function UISelectCore() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UISelectCore);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UISelectCore)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      controlWidth: 0,
      inputValue: '',
      isLoading: false,
      optionsCache: {},
      paginationCache: {},
      resetOption: null
    };
    _this.popoverRef = /*#__PURE__*/createRef();

    _this.optionRendererProxy = function (option) {
      var _this$props = _this.props,
          optionRenderer = _this$props.optionRenderer,
          optionRendererIgnoresSpecialOptions = _this$props.optionRendererIgnoresSpecialOptions;

      if (optionRenderer == null || option.isSpecial && optionRendererIgnoresSpecialOptions) {
        return _this.defaultOptionRenderer(option);
      }

      return optionRenderer(option);
    };

    _this.defaultValueRenderer = function (option) {
      var _this$props2 = _this.props,
          itemComponent = _this$props2.itemComponent,
          valueComponent = _this$props2.valueComponent;
      return /*#__PURE__*/_jsx(UITypeaheadResultsItem, {
        "aria-invalid": option.invalid,
        itemComponent: valueComponent || itemComponent,
        option: Object.assign({}, option, {
          help: undefined
        }),
        _useButton: false,
        _useDropdownText: false
      }, option.value);
    };

    _this.filterOptionsProxy = function (options, input, excludeOptions) {
      var _this$props3 = _this.props,
          anchorType = _this$props3.anchorType,
          clearable = _this$props3.clearable,
          filterOptions = _this$props3.filterOptions,
          ignoreAccents = _this$props3.ignoreAccents,
          ignoreCase = _this$props3.ignoreCase,
          isLoadingProp = _this$props3.isLoading,
          loadMoreComponent = _this$props3.loadMoreComponent,
          multi = _this$props3.multi,
          resetValue = _this$props3.resetValue,
          value = _this$props3.value;
      var _this$state = _this.state,
          isLoading = _this$state.isLoading,
          paginationCache = _this$state.paginationCache,
          resetOption = _this$state.resetOption;
      var filterOptionsFunc;

      if (filterOptions === false) {
        filterOptionsFunc = function filterOptionsFunc(x) {
          return x;
        };
      } else if (typeof filterOptions === 'function') {
        filterOptionsFunc = filterOptions;
      } else {
        filterOptionsFunc = _this.getDefaultFilterOptionsFunc();
      }

      var showSelectedOptions = _this.areOptionsToggleable({
        anchorType: anchorType,
        multi: multi
      });

      for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        rest[_key2 - 3] = arguments[_key2];
      }

      var filteredOptions = filterOptionsFunc.apply(void 0, [options, input, showSelectedOptions ? [] : excludeOptions].concat(rest));

      if (input.length === 0) {
        // Add multi dummy option, if needed (#1256)
        if (multi && options.length > 0 && filteredOptions.length === 0) {
          filteredOptions = filteredOptions.concat(getMultiDummyOption());
        } // Add resetOption, if needed (#2300)


        if (clearable && !multi && value != null && value !== resetValue) {
          filteredOptions = [resetOption].concat(filteredOptions);
        }
      }

      if (isLoading || isLoadingProp) {
        // Add "Loading..." option, if needed
        filteredOptions = filteredOptions.concat(getIsLoadingOption());
      } else {
        var paginationCacheKey = filterInputValue(input, {
          ignoreAccents: ignoreAccents,
          ignoreCase: ignoreCase
        });
        var pagination = paginationCache[paginationCacheKey]; // Add "Load more" option, if needed (#2031)

        if (pagination && pagination.hasMore) {
          filteredOptions = filteredOptions.concat(getLoadMoreOption({
            input: input,
            isLoading: isLoading,
            loadMoreComponent: loadMoreComponent,
            options: options,
            pagination: pagination
          }));
        }
      }

      return filteredOptions;
    };

    _this.creatableOnInputChangeProxy = function (str) {
      var internalCreatableSelect = _this.getInternalCreatableSelect();

      var newInputValue = _this.handleInputChange(str);

      internalCreatableSelect.inputValue = newInputValue;
      return newInputValue;
    };

    _this.handleChange = function (option) {
      // react-select-plus gives us an option object or null, which we pass to
      // onSelectedOptionChange, but our onChange handler expects just the new value.
      var _this$props4 = _this.props,
          onChange = _this$props4.onChange,
          onSelectedOptionChange = _this$props4.onSelectedOptionChange,
          value = _this$props4.value;
      callIfPossible(onSelectedOptionChange, SyntheticEvent(option));
      var newVal = null;

      if (Array.isArray(option)) {
        newVal = option.reduce(function (acc, item) {
          if (item) {
            var itemValue = item.value;
            var i = acc.indexOf(itemValue);

            if (i > -1) {
              acc.splice(i, 1);
            } else {
              acc.push(itemValue);
            }
          }

          return acc;
        }, []);
      } else if (option) {
        newVal = option.value;
      }

      if (newVal !== value) {
        onChange(SyntheticEvent(newVal));
      }
    };

    _this.handleInputKeyDown = function (evt) {
      var _this$props5 = _this.props,
          anchorType = _this$props5.anchorType,
          multi = _this$props5.multi,
          onInputKeyDown = _this$props5.onInputKeyDown,
          value = _this$props5.value;
      var key = evt.key;
      callIfPossible(onInputKeyDown, evt);

      if (evt.defaultPrevented) {
        return;
      } // In multi-mode, we need to handle ENTER to allow the focused option to be toggled.


      if (key === 'Enter' && multi && _this.getAnchorType({
        anchorType: anchorType,
        multi: multi
      }) !== 'combined') {
        var internalSelect = _this.getInternalSelect();

        if (!internalSelect) {
          return;
        }

        var focusedOption = internalSelect._focusedOption;

        if (!focusedOption) {
          return;
        }

        if (focusedOption.value === loadMoreOptionValue) {
          _this.triggerLoadMore();

          return;
        }

        if (focusedOption.isSpecial || focusedOption.clearableValue === false) {
          return;
        }

        var valueToToggle = focusedOption.value;
        var willBeSelected = value.indexOf(valueToToggle) === -1;

        _this.toggleMultiValue(valueToToggle, willBeSelected);

        evt.preventDefault();
      }
    };

    _this.handleOptionToggle = function (option, evt) {
      var value = _this.props.value;

      if (option.options && option.selectAll) {
        var _getCheckboxState = getCheckboxState(option, value),
            checked = _getCheckboxState.checked,
            indeterminate = _getCheckboxState.indeterminate;

        _this.toggleGroup(option, !checked && !indeterminate);
      } else {
        var valueToToggle = option.value;

        _this.toggleMultiValue(valueToToggle, evt.target.checked);
      }
    };

    _this.handleClose = function (evt) {
      var _this$props6 = _this.props,
          onClose = _this$props6.onClose,
          onOpenChange = _this$props6.onOpenChange; // eslint-disable-line react/prop-types

      onOpenChange(SyntheticEvent(false));
      callIfPossible(onClose, evt);
    };

    _this.handleOpen = function (evt) {
      var _this$props7 = _this.props,
          onOpen = _this$props7.onOpen,
          onOpenChange = _this$props7.onOpenChange; // eslint-disable-line react/prop-types

      onOpenChange(SyntheticEvent(true));
      callIfPossible(onOpen, evt);
    };

    _this.triggerOpen = function () {
      var onOpenChange = _this.props.onOpenChange;
      onOpenChange(SyntheticEvent(true));
    };

    _this.handleInputChange = function (str) {
      var _this$props8 = _this.props,
          loadOptions = _this$props8.loadOptions,
          multi = _this$props8.multi,
          onInputChange = _this$props8.onInputChange;
      callIfPossible(onInputChange, str);

      _this.setState({
        inputValue: str
      }); // Handle typing multi values separated by splitRegex.


      if (multi) {
        var splitValues = _this.getSplitValuesFromString(str, false);

        if (splitValues.length > 0) {
          _this.addMultiValues(splitValues);

          return '';
        }
      } // If the user typed a request that will hit the cache, ignore any pending request.


      if (loadOptions != null) {
        var internalAsyncSelect = _this.getInternalAsyncSelect();

        if (internalAsyncSelect != null) {
          if (internalAsyncSelect._cache && internalAsyncSelect._cache.hasOwnProperty(str)) {
            internalAsyncSelect._callback = null;

            _this.setState({
              isLoading: false
            });
          }
        }
      }

      return str;
    };

    _this.handleInputValueChange = function (evt) {
      var onInputValueChange = _this.props.onInputValueChange;
      callIfPossible(onInputValueChange, evt);

      _this.resetPaginationCache();

      _this.setState({
        inputValue: evt.target.value
      });
    };

    _this.handlePaste = function (evt) {
      var _this$props9 = _this.props,
          multi = _this$props9.multi,
          onPaste = _this$props9.onPaste; // Allow developers to override default paste handling.

      callIfPossible(onPaste, evt);

      if (evt.defaultPrevented) {
        return;
      }

      if (!multi) return;
      var clipboardData = evt.clipboardData || window.clipboardData;
      var pastedText = clipboardData.getData('Text');

      var splitValues = _this.getSplitValuesFromString(pastedText, true);

      if (splitValues.length > 0) {
        evt.preventDefault();

        _this.addMultiValues(splitValues);
      }
    };

    _this.focus = function () {
      try {
        _this._anchorRef.focus();
      } catch (e) {
        /* ¯\_(ツ)_/¯ */
      }
    };

    _this.handleAutosize = function () {
      if (_this.popoverRef.current) _this.popoverRef.current.reposition();
    };

    _this.dropdownContentRefCallback = function (dropdownEl) {
      if (dropdownEl) {
        dropdownEl.addEventListener('mousedown', _this.handleMouseDownOnDropdown);
      }
    };

    _this.anchorRefCallback = function (anchorRef) {
      var _this$state2 = _this.state,
          controlWidth = _this$state2.controlWidth,
          target = _this$state2.target;
      _this._anchorRef = anchorRef;
      var newTarget = findDOMNode(_this._anchorRef);

      var newControlWidth = _this.computeControlWidth(newTarget);

      if (target !== newTarget || controlWidth !== newControlWidth) {
        _this.setState({
          controlWidth: newControlWidth,
          target: newTarget
        });
      }
    };

    _this.selectRefCallback = function () {
      // Hackily override Select's selectValue and handleMouseDownOnMenu to support "Load more"
      var internalSelect = _this.getInternalSelect();

      if (!internalSelect) return;
      internalSelect.selectValue = _this.selectValueProxy.bind(_assertThisInitialized(_this), internalSelect.selectValue);

      var internalCreatableSelect = _this.getInternalCreatableSelect();

      if (!internalCreatableSelect) return;
      internalCreatableSelect.onInputChange = _this.creatableOnInputChangeProxy;
    };

    _this.getInternalSelect = function () {
      // Return our react-select Select instance, or null
      if (!_this._anchorRef) {
        return null;
      }

      if (_this._anchorRef.getInternalSelect) {
        return _this._anchorRef.getInternalSelect();
      }

      return _this._anchorRef.select || _this._anchorRef;
    };

    _this.getInternalCreatableSelect = function () {
      // Return our react-select Creatable instance, or null
      if (!_this._anchorRef) {
        return null;
      }

      if (_this._anchorRef.constructor === Creatable) {
        return _this._anchorRef;
      }

      return null;
    };

    _this.getInternalAsyncSelect = function () {
      // Return our react-select Async instance, or null
      if (!_this._anchorRef) {
        return null;
      }

      if (_this._anchorRef.getInternalAsyncSelect) {
        return _this._anchorRef.getInternalAsyncSelect();
      }

      if (_this._anchorRef.constructor === Async) {
        return _this._anchorRef;
      }

      return null;
    };

    _this.handleMouseDownOnDropdown = function (evt) {
      // react-select-plus normally closes the dropdown and blurs the input on mousedown. We need to
      // prevent that behavior for certain elements.
      var target = evt.target;

      if (closest(target, '.private-dropdown__footer-container')) {
        evt.stopPropagation();
        evt.preventDefault();
        return;
      }

      if (closest(target, '.private-form__selectplus--load-more')) {
        _this.triggerLoadMore();

        evt.stopPropagation();
        evt.preventDefault();
        return;
      }

      if (closest(target, '.private-checkbox')) {
        evt.stopPropagation();
        evt.preventDefault();
        return;
      }
    };

    _this.loadOptionsProxy = function (input, loadOptionsCallback) {
      var _this$props10 = _this.props,
          open = _this$props10.open,
          loadOptions = _this$props10.loadOptions;

      if (input == null) {
        return;
      } // Show loading indicator until loadOptionsProxyCallback is called


      _this.setState({
        isLoading: true
      });

      _this._latestSearch = open ? input : null; // Special case: autoload search is designated as null
      // Keep a copy of all options returned by loadOptions

      var paginationCache = _this.state.paginationCache;

      var proxyCallback = _this.getLoadOptionsProxyCallback(open ? input : null, loadOptionsCallback);

      var result;

      try {
        result = loadOptions(input, proxyCallback, paginationCache[input || '']);
      } catch (error) {
        proxyCallback(error);
        setTimeout(function () {
          throw error;
        }, 0);
      }

      if (result && typeof result.then === 'function') {
        result.then(function (data) {
          proxyCallback(null, data || {});
        }, function (error) {
          proxyCallback(error);
          throw error;
        });
      }
    };

    _this.checkForFormattedMessages = function () {
      var options = document.querySelectorAll('.Select-option>.private-typeahead-result'); // eslint-disable-next-line no-alert, compat/compat

      var optionLinks = Array.from(options).filter(function (item) {
        return item.querySelectorAll('a[href].private-link>i18n-string').length;
      });
      if (optionLinks.length) return true;
      var optionsWithPopovers = document.querySelectorAll('.Select-option>.private-typeahead-result>[data-popover-id]'); // eslint-disable-next-line no-alert, compat/compat

      var popoverIds = Array.from(optionsWithPopovers).map(function (span) {
        return span.getAttribute('aria-describedby');
      });
      var popoverLinks = popoverIds.filter(function (popoverId) {
        return document.querySelectorAll("#" + popoverId + " a[href].private-link>i18n-string").length;
      });
      return !!popoverLinks.length;
    };

    _this.renderDropdown = function (props) {
      var _this$props11 = _this.props,
          closeOnTargetLeave = _this$props11.closeOnTargetLeave,
          onOpenChange = _this$props11.onOpenChange,
          open = _this$props11.open,
          placement = _this$props11.placement;
      return /*#__PURE__*/_jsx(UIControlledPopover, {
        arrowSize: "none",
        autoPlacement: "vert",
        closeOnTargetLeave: closeOnTargetLeave,
        content: _this.renderDropdownContent(props),
        onOpenChange: onOpenChange,
        open: open,
        placement: placement || 'bottom right',
        popoverRef: _this.popoverRef,
        target: _this.state.target
      });
    };

    return _this;
  }

  _createClass(UISelectCore, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this.cacheOptions(this.props);
      this.generateResetOption(this.props);
      this._isMounted = true; // not strictly true, but componentDidMount() fires too late!

      this._getInputProps = memoizeOne(getInputProps);
      this._initiallyOpen = this.props.open;
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      this.cacheOptions(nextProps);
      this.generateResetOption(nextProps);

      if (!this.props.open && nextProps.open) {
        this.resetPaginationCache();
      } else if (this.props.open && !nextProps.open) {
        this._initiallyOpen = false;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var controlEl = findDOMNode(this._anchorRef);

      if (!controlEl) {
        return;
      }

      var controlWidth = this.computeControlWidth(controlEl);

      if (controlWidth !== this.state.controlWidth) {
        this.setState({
          controlWidth: controlWidth
        });
      }

      if (!prevProps.open && this.props.open) {
        this.focus();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: "cacheOptions",
    value: function cacheOptions(_ref4) {
      var options = _ref4.options;
      // Cache options provided via props (required for certain async scenarios, and for paste handling)
      var optionsCache = this.state.optionsCache;

      if (options) {
        var newOptionsCache = makeNewOptionsCache(optionsCache, options);
        this.setState({
          optionsCache: newOptionsCache
        });
      }
    }
  }, {
    key: "resetPaginationCache",
    value: function resetPaginationCache() {
      // If async caching is disabled, paginationCache should not persist across searches
      var cache = this.props.cache;

      if (cache === null || cache === false) {
        this.setState({
          paginationCache: {}
        });
      }
    }
  }, {
    key: "generateResetOption",
    value: function generateResetOption(_ref5) {
      var placeholder = _ref5.placeholder,
          resetValue = _ref5.resetValue;
      var resetOption = this.state.resetOption;
      var newResetOption = {
        buttonText: lazyEval(placeholder),
        dropdownText: lazyEval(placeholder),
        value: resetValue
      };

      if (!(resetOption && resetOption.buttonText === newResetOption.buttonText && resetOption.value === newResetOption.value)) {
        this.setState({
          resetOption: newResetOption
        });
      }
    }
  }, {
    key: "areOptionsToggleable",
    value: function areOptionsToggleable(_ref6) {
      var anchorType = _ref6.anchorType,
          multi = _ref6.multi;
      // Return true if we show options as checkboxes in the dropdown (#1976)
      var computedAnchorType = this.getAnchorType({
        anchorType: anchorType,
        multi: multi
      });
      return multi && computedAnchorType !== 'combined';
    }
  }, {
    key: "defaultOptionRenderer",
    value: function defaultOptionRenderer(option) {
      var _this$props12 = this.props,
          anchorType = _this$props12.anchorType,
          itemComponent = _this$props12.itemComponent,
          multi = _this$props12.multi,
          optionComponent = _this$props12.optionComponent,
          value = _this$props12.value;
      var isOptionGroup = !!option.options;
      var isSelectAll = isOptionGroup && !!option.selectAll;
      var toggleable = this.areOptionsToggleable({
        anchorType: anchorType,
        multi: multi
      }) && option.className !== 'Select-create-option-placeholder' && !option.isSpecial && !(isOptionGroup && !isSelectAll);

      var _getCheckboxState2 = getCheckboxState(option, value),
          indeterminate = _getCheckboxState2.indeterminate,
          checked = _getCheckboxState2.checked;

      return /*#__PURE__*/_jsx(UITypeaheadResultsItem, {
        itemComponent: optionComponent || itemComponent,
        isIndeterminate: toggleable && indeterminate,
        isSelected: toggleable && checked,
        onToggle: this.handleOptionToggle.bind(this, option),
        option: option,
        style: option.dropdownStyle,
        toggleable: toggleable,
        _useButton: !toggleable
      });
    }
  }, {
    key: "getDefaultFilterOptionsFunc",
    // Extracted to a function so it can be stubbed out in tests
    value: function getDefaultFilterOptionsFunc() {
      return Select.defaultProps.filterOptions;
    }
  }, {
    key: "selectValueProxy",
    value: function selectValueProxy(selectValue, selectedOption) {
      // If this is a "Load more" option, trigger load.
      if (selectedOption.value === loadMoreOptionValue) {
        this.triggerLoadMore();
      } // Prevent "special" options from being selected.


      if (selectedOption.isSpecial) {
        return;
      }

      selectValue(selectedOption);
    }
  }, {
    key: "triggerLoadMore",
    value: function triggerLoadMore() {
      // Trick Select.Async into calling loadOptions again, then move focus up one option
      var internalSelect = this.getInternalSelect();
      var internalAsyncSelect = this.getInternalAsyncSelect();

      if (!internalSelect || !internalAsyncSelect || !internalAsyncSelect.loadOptions) {
        return;
      }

      var _this$props13 = this.props,
          ignoreAccents = _this$props13.ignoreAccents,
          ignoreCase = _this$props13.ignoreCase;
      var visibleOptions = internalSelect._visibleOptions;
      var loadMoreOption = visibleOptions[visibleOptions.length - 1];
      var transformedInputValue = filterInputValue(loadMoreOption.input, {
        ignoreAccents: ignoreAccents,
        ignoreCase: ignoreCase
      });

      if (internalAsyncSelect._cache) {
        delete internalAsyncSelect._cache[transformedInputValue];
      }

      internalAsyncSelect.loadOptions(transformedInputValue);
      var normalOptions = internalSelect.props.options;
      internalSelect.setState({
        focusedOption: normalOptions[normalOptions.length - 1]
      });
    }
  }, {
    key: "toggleGroup",
    value: function toggleGroup(groupToToggle, willBeSelected) {
      var value = this.props.value;
      var valueCopy = (value || []).slice(0);
      var newValue = valueCopy;

      if (willBeSelected) {
        var addOptionValue = function addOptionValue(o) {
          if (o.options) {
            o.options.filter(function (option) {
              return !option.disabled;
            }).forEach(addOptionValue);
          } else {
            if (newValue.indexOf(o.value) === -1) newValue.push(o.value);
          }
        };

        addOptionValue(groupToToggle);
      } else {
        var removeOptionValue = function removeOptionValue(o) {
          if (o.options) {
            o.options.filter(function (option) {
              return !option.disabled;
            }).forEach(removeOptionValue);
          } else {
            newValue = newValue.filter(function (v) {
              return v !== o.value;
            });
          }
        };

        removeOptionValue(groupToToggle);
      }

      this.setMultiValues(newValue);
    }
  }, {
    key: "toggleMultiValue",
    value: function toggleMultiValue(valueToToggle, willBeSelected) {
      var value = this.props.value;
      var valueCopy = (value || []).slice(0);
      var newValue = null;

      if (willBeSelected) {
        newValue = valueCopy.concat(valueToToggle);
      } else {
        newValue = valueCopy.filter(function (v) {
          return v !== valueToToggle;
        });
      }

      this.setMultiValues(newValue);
    }
  }, {
    key: "addMultiValues",
    value: function addMultiValues(addValues) {
      var value = this.props.value;
      var newValues = (value || []).slice(0);
      addValues.forEach(function (v) {
        if (newValues.indexOf(v) === -1 && v !== '') newValues.push(v);
      });
      this.setMultiValues(newValues);
    }
  }, {
    key: "setMultiValues",
    value: function setMultiValues(newValues) {
      var optionsCache = this.state.optionsCache; // Map values to options

      var newOptions = newValues.map(function (v) {
        return optionsCache[v] || {
          text: v,
          value: v
        };
      });
      this.handleChange(newOptions);
    }
  }, {
    key: "getSplitValuesFromString",
    value: function getSplitValuesFromString(str, includeLastValue) {
      var _this$props14 = this.props,
          allowCreate = _this$props14.allowCreate,
          splitRegex = _this$props14.splitRegex;
      var strParts = str.split(splitRegex).map(function (s) {
        return s.trim();
      });

      if (!includeLastValue) {
        strParts = strParts.slice(0, strParts.length - 1);
      }

      if (strParts.length === 0) return []; // Create a map of option labels to options

      var optionsCache = this.state.optionsCache;
      var reverseOptionsCache = {};
      Object.keys(optionsCache).forEach(function (key) {
        var option = optionsCache[key];
        reverseOptionsCache[option.text || key] = option.value;
      }); // For each piece, see if it maps to an option label. If so, add that option's value to
      // the result. Otherwise, if allowCreate is enabled, add a new option.

      var result = [];
      strParts.forEach(function (label) {
        if (reverseOptionsCache.hasOwnProperty(label)) {
          result.push(reverseOptionsCache[label]);
        } else if (allowCreate && result.indexOf(label) === -1) {
          result.push(label);
        }
      });
      return result;
    }
  }, {
    key: "getMenuWidth",
    value: function getMenuWidth() {
      var menuWidth = this.props.menuWidth;

      if (menuWidth === 'auto') {
        return '';
      }

      if (typeof menuWidth === 'number') {
        return menuWidth;
      }

      return Math.max(this.state.controlWidth, MIN_MENU_WIDTH);
    }
  }, {
    key: "computeControlWidth",
    value: function computeControlWidth(controlEl) {
      var open = this.props.open;

      if (!controlEl || !open) {
        return 0;
      }

      var exactWidth = controlEl.getBoundingClientRect().width;
      var roundedWidth = window.chrome ? Math.floor(exactWidth) : exactWidth;
      return roundedWidth - 2; // account for 1px border added by UIPopover
    }
  }, {
    key: "getLoadOptionsProxyCallback",
    value: function getLoadOptionsProxyCallback(input, loadOptionsCallback) {
      var _this2 = this;

      var proxyCallback = function proxyCallback(error, data) {
        if (!_this2._isMounted) return;
        var _this2$state = _this2.state,
            optionsCache = _this2$state.optionsCache,
            paginationCache = _this2$state.paginationCache;
        var newOptionsCache = optionsCache;
        var newPaginationCache = paginationCache; // Cache options so that we can render the selected value properly

        if (data && data.options) {
          newOptionsCache = makeNewOptionsCache(optionsCache, data.options);

          if (data.pagination) {
            newPaginationCache = Object.assign({}, paginationCache);
            newPaginationCache[input || ''] = data.pagination;
          }
        }

        var internalAsyncSelect = _this2.getInternalAsyncSelect();

        _this2.setState({
          isLoading: internalAsyncSelect && internalAsyncSelect._callback != null && _this2._latestSearch !== input,
          optionsCache: newOptionsCache,
          paginationCache: newPaginationCache
        });

        for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          rest[_key3 - 2] = arguments[_key3];
        }

        loadOptionsCallback.apply(void 0, [error, data].concat(rest));
      };

      return proxyCallback;
    }
  }, {
    key: "getValueAsObject",
    value: function getValueAsObject(value) {
      // In async mode, react-select needs the current value's object form to render it
      var optionsCache = this.state.optionsCache;

      if (!optionsCache) {
        return value;
      }

      if (Array.isArray(value)) {
        return value.map(function (v) {
          return optionsCache.hasOwnProperty(v) ? optionsCache[v] : v;
        });
      }

      return optionsCache.hasOwnProperty(value) ? optionsCache[value] : value;
    }
  }, {
    key: "isCollapsed",
    value: function isCollapsed(_ref7) {
      var multi = _ref7.multi,
          multiCollapseLimit = _ref7.multiCollapseLimit,
          open = _ref7.open,
          value = _ref7.value;
      return multiCollapseLimit != null && value != null && value.length > multiCollapseLimit && multi && !open;
    }
  }, {
    key: "getAnchorType",
    value: function getAnchorType(_ref8) {
      var anchorType = _ref8.anchorType,
          multi = _ref8.multi;

      if (anchorType === 'auto') {
        return multi ? 'combined' : 'button';
      }

      return anchorType;
    }
  }, {
    key: "getNoResultsText",
    value: function getNoResultsText(_ref9) {
      var noResultsText = _ref9.noResultsText;
      if (noResultsText != null) return lazyEval(noResultsText);
      var inputValue = this.state.inputValue;
      return inputValue ? I18n.text('salesUI.UISelect.noResults') : I18n.text('salesUI.UISelect.typeToSearch');
    }
  }, {
    key: "getMenuRenderer",
    value: function getMenuRenderer(_ref10) {
      var itemComponent = _ref10.itemComponent,
          menuRenderer = _ref10.menuRenderer,
          menuWidth = _ref10.menuWidth,
          optionRenderer = _ref10.optionRenderer,
          optionComponent = _ref10.optionComponent;

      if (isVirtualized(menuRenderer)) {
        if (optionRenderer || itemComponent !== UISelectCore.defaultProps.itemComponent) {
          devLogger.warn({
            message: 'UISelect: virtualize cannot be used with optionRenderer or itemComponent',
            key: 'UISelect: virtualizeCustomRenderer'
          });
          return undefined;
        }

        if (menuWidth === 'auto') {
          devLogger.warn({
            message: 'UISelect: virtualize canot be used with menuWidth="auto"',
            key: 'UISelect: virtualizeAutoWidth'
          });
          return undefined;
        }

        return menuRenderer(this.getMenuWidth());
      }

      if (this.checkForFormattedMessages() && !hasShownDevWarning) {
        devLogger.warn({
          message: 'UISelect: Combining UILink and FormattedMessage inside of `react-select-plus` leads to broken links in any disabled options. Use a FormattedJSXMessage or I18n.text instead of FormattedMessage inside any UILink used in UISelect.',
          key: 'UISelect: FormattedMessage'
        });
        hasShownDevWarning = true;

        if (window.newrelic && !hasPingedNewRelic) {
          window.newrelic.addPageAction('ui-select-formatted-message', {
            component: itemComponent || optionComponent
          });
          hasPingedNewRelic = true;
        }
      }

      return menuRenderer;
    }
  }, {
    key: "renderDropdownContent",
    value: function renderDropdownContent(props) {
      var _this$props15 = this.props,
          dropdownClassName = _this$props15.dropdownClassName,
          loadOptions = _this$props15.loadOptions,
          menuRenderer = _this$props15.menuRenderer,
          resultsClassName = _this$props15.resultsClassName;
      var className = classNames(dropdownClassName, 'private-dropdown__results', isVirtualized(menuRenderer) && 'private-dropdown--virtualized');
      return /*#__PURE__*/_jsx("span", {
        className: classNames('private-typeahead-results', resultsClassName),
        "data-dropdown-results": true,
        "data-async-options": !!loadOptions,
        children: /*#__PURE__*/_jsxs("div", {
          className: className,
          ref: this.dropdownContentRefCallback,
          style: {
            width: this.getMenuWidth()
          },
          children: [props.children, this.renderDropdownFooter()]
        })
      });
    }
  }, {
    key: "renderDropdownFooter",
    value: function renderDropdownFooter() {
      var dropdownFooter = this.props.dropdownFooter;

      if (!dropdownFooter) {
        return null;
      }

      return /*#__PURE__*/_jsx("div", {
        className: "private-dropdown__footer-container",
        children: dropdownFooter
      });
    }
  }, {
    key: "renderCollapsedAnchor",
    value: function renderCollapsedAnchor(combinedAnchorClassName, multiCollapseLimit, value, valueRenderer, rest) {
      var _this3 = this;

      var optionsCache = this.state.optionsCache;
      var renderedValues = value.slice(0, multiCollapseLimit).map(function (v) {
        var option = optionsCache[v] || {
          text: v,
          value: v
        };

        var valueNode = (valueRenderer || _this3.defaultValueRenderer)(option);

        return /*#__PURE__*/_jsx(MultiSelectValue, {
          closeable: false,
          disabled: option.disabled,
          value: option,
          children: valueNode
        }, v);
      });
      var hiddenValueCount = value.length - renderedValues.length;
      var andMoreNode = hiddenValueCount > 0 ? /*#__PURE__*/_jsx(UIButton, {
        "data-hidden-value-count": hiddenValueCount,
        use: "transparent",
        children: I18n.text('salesUI.UISelect.plusMore', {
          count: hiddenValueCount
        })
      }) : null; // We use the same classnames as react-select here, to get the same appearance.

      return /*#__PURE__*/_jsx(UIClickable, Object.assign({}, getAriaAndDataProps(rest), {
        className: classNames('Select Select--multi', combinedAnchorClassName),
        "data-collapsed": true,
        onClick: this.triggerOpen,
        onFocus: this.triggerOpen,
        children: /*#__PURE__*/_jsxs("div", {
          className: "Select-control",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "Select-multi-value-wrapper",
            children: [renderedValues, andMoreNode]
          }), /*#__PURE__*/_jsx("div", {
            className: "Select-arrow-zone",
            children: /*#__PURE__*/_jsx("div", {
              className: "Select-arrow"
            })
          })]
        })
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props16 = this.props,
          allowCreate = _this$props16.allowCreate,
          anchorType = _this$props16.anchorType,
          autoComplete = _this$props16.autoComplete,
          autoFocus = _this$props16.autoFocus,
          ButtonContent = _this$props16.ButtonContent,
          buttonSize = _this$props16.buttonSize,
          buttonUse = _this$props16.buttonUse,
          className = _this$props16.className,
          clearable = _this$props16.clearable,
          closeOnTargetLeave = _this$props16.closeOnTargetLeave,
          disabled = _this$props16.disabled,
          error = _this$props16.error,
          id = _this$props16.id,
          ignoreAccents = _this$props16.ignoreAccents,
          ignoreCase = _this$props16.ignoreCase,
          inputRef = _this$props16.inputRef,
          inputValue = _this$props16.inputValue,
          isLoading = _this$props16.isLoading,
          itemComponent = _this$props16.itemComponent,
          loadOptions = _this$props16.loadOptions,
          menuRenderer = _this$props16.menuRenderer,
          menuWidth = _this$props16.menuWidth,
          multi = _this$props16.multi,
          multiCollapseLimit = _this$props16.multiCollapseLimit,
          noResultsText = _this$props16.noResultsText,
          __onChange = _this$props16.onChange,
          __onInputValueChange = _this$props16.onInputValueChange,
          onOpenChange = _this$props16.onOpenChange,
          __onSelectedOptionChange = _this$props16.onSelectedOptionChange,
          open = _this$props16.open,
          optionComponent = _this$props16.optionComponent,
          optionRenderer = _this$props16.optionRenderer,
          options = _this$props16.options,
          placeholder = _this$props16.placeholder,
          readOnly = _this$props16.readOnly,
          resetValue = _this$props16.resetValue,
          searchable = _this$props16.searchable,
          searchClassName = _this$props16.searchClassName,
          searchPlaceholder = _this$props16.searchPlaceholder,
          searchPromptText = _this$props16.searchPromptText,
          __splitRegex = _this$props16.splitRegex,
          tabIndex = _this$props16.tabIndex,
          value = _this$props16.value,
          __valueComponent = _this$props16.valueComponent,
          valueRenderer = _this$props16.valueRenderer,
          rest = _objectWithoutProperties(_this$props16, ["allowCreate", "anchorType", "autoComplete", "autoFocus", "ButtonContent", "buttonSize", "buttonUse", "className", "clearable", "closeOnTargetLeave", "disabled", "error", "id", "ignoreAccents", "ignoreCase", "inputRef", "inputValue", "isLoading", "itemComponent", "loadOptions", "menuRenderer", "menuWidth", "multi", "multiCollapseLimit", "noResultsText", "onChange", "onInputValueChange", "onOpenChange", "onSelectedOptionChange", "open", "optionComponent", "optionRenderer", "options", "placeholder", "readOnly", "resetValue", "searchable", "searchClassName", "searchPlaceholder", "searchPromptText", "splitRegex", "tabIndex", "value", "valueComponent", "valueRenderer"]);

      var resetOption = this.state.resetOption;
      var combinedAnchorClassName = classNames(className, 'private-form__selectplus', multi && 'private-form__selectplus--multi', error && 'private-form__control--error', readOnly && 'is-readonly'); // Use an HOC around React Select, if applicable

      var SelectComponent = Select;

      if (loadOptions) {
        SelectComponent = Select.Async;
      } else if (allowCreate) {
        SelectComponent = Select.Creatable;
      } // Use the virtualizedMenuRenderer, if it's provided and compatible with the other props


      var computedMenuRenderer = this.getMenuRenderer({
        itemComponent: itemComponent,
        menuRenderer: menuRenderer,
        menuWidth: menuWidth,
        optionRenderer: optionRenderer,
        optionComponent: optionComponent
      }); // Determine what type of control the dropdown is attached to

      var computedAnchorType = this.getAnchorType({
        anchorType: anchorType,
        multi: multi
      }); // A null or undefined value should be considered equivalent to resetValue

      var computedValue = value == null ? resetValue : value;

      if (loadOptions && allowCreate) {
        devLogger.warn({
          message: 'UISelect: loadOptions and allowCreate are mutually exclusive.',
          key: 'UISelect: asyncCreatable'
        });
      }

      if (rest.autofocus) {
        devLogger.warn({
          message: "UISelect: The autofocus prop is deprecated in favor of autoFocus to match React's autoFocus prop",
          key: 'UISelect: autofocus'
        });
      }

      if (inputRef && computedAnchorType === 'combined') {
        devLogger.warn({
          message: 'UISelect: The inputRef prop is only supported with anchorType="input" or anchorType="button"',
          key: 'UISelect: inputRef'
        });
      } // We need to attach two ref callbacks to the combined anchor.


      this._refSequence = this._refSequence || sequence(this.anchorRefCallback, this.selectRefCallback); // Bootstrap a read-only state on the "external" Select component by disabling interactivity
      // Only needed for the "combined" anchorType - readOnly class prevents disabled styles from being applied

      var readOnlyProps = readOnly ? {
        disabled: true
      } : {};
      return /*#__PURE__*/_jsx(FieldsetContextConsumer, {
        children: function children(_ref11) {
          var fieldDisabled = _ref11.disabled,
              fieldSize = _ref11.size;
          var computedDisabled = disabled || fieldDisabled; // Props that are used regardless of anchor type

          var commonProps = Object.assign({}, rest, {
            backspaceRemoves: multi && computedAnchorType === 'combined',
            clearable: computedAnchorType === 'combined' ? clearable : false,
            disabled: computedDisabled,
            filterOptions: _this4.filterOptionsProxy,
            id: id,
            ignoreAccents: ignoreAccents,
            ignoreCase: ignoreCase,
            inputProps: _this4._getInputProps(autoComplete, computedDisabled, id, searchable, computedAnchorType, _this4.handleAutosize, _this4.handlePaste, readOnly),
            isLoading: isLoading != null ? isLoading : _this4.state.isLoading,
            isOpen: open && !readOnly && !!_this4.state.target,
            labelKey: 'text',
            loadOptions: loadOptions ? _this4.loadOptionsProxy : undefined,
            loadingPlaceholder: null,
            menuRenderer: computedMenuRenderer,
            multi: multi,
            noResultsText: _this4.getNoResultsText({
              noResultsText: noResultsText
            }),
            onChange: _this4.handleChange,
            onClose: _this4.handleClose,
            onInputChange: _this4.handleInputChange,
            onInputKeyDown: _this4.handleInputKeyDown,
            onOpen: _this4.handleOpen,
            onPaste: _this4.handlePaste,
            openAfterFocus: true,
            optionRenderer: _this4.optionRendererProxy,
            options: loadOptions ? undefined : options,
            placeholder: lazyEval(placeholder),
            readOnly: readOnly,
            ref: _this4.anchorRefCallback,
            renderInvalidValues: true,
            required: false,
            resetValue: resetValue,
            searchable: searchable,
            searchPromptText: lazyEval(searchPromptText),
            tabIndex: tabIndex,
            tabSelectsValue: false,
            value: loadOptions ? _this4.getValueAsObject(computedValue) : computedValue,
            valueComponent: multi ? MultiSelectValue : Select.defaultProps.valueComponent,
            valueRenderer: valueRenderer || _this4.defaultValueRenderer
          });
          var simpleAnchorClassName = classNames(className, SELECT_SIZE_OPTIONS[fieldSize], error && 'private-form__control--error');

          if (computedAnchorType === 'input') {
            return /*#__PURE__*/_jsx(UISelectWithInputAnchor, Object.assign({}, commonProps, {
              autoComplete: autoComplete,
              autoFocus: autoFocus,
              className: simpleAnchorClassName,
              dropdownComponent: _this4.renderDropdown,
              error: error,
              inputRef: inputRef,
              inputValue: inputValue,
              onInputValueChange: _this4.handleInputValueChange,
              onOpenChange: onOpenChange,
              selectComponent: SelectComponent,
              selectRef: _this4.selectRefCallback
            }));
          }

          if (_this4.isCollapsed({
            multi: multi,
            multiCollapseLimit: multiCollapseLimit,
            open: open,
            value: value
          })) {
            return _this4.renderCollapsedAnchor(combinedAnchorClassName, multiCollapseLimit, value, valueRenderer, rest);
          }

          if (computedAnchorType === 'button') {
            return /*#__PURE__*/_jsx(UISelectWithButtonAnchor, Object.assign({}, commonProps, {
              autoComplete: autoComplete,
              autoFocus: autoFocus,
              buttonSize: buttonSize,
              ButtonContent: ButtonContent,
              buttonUse: buttonUse,
              className: simpleAnchorClassName,
              closeOnTargetLeave: closeOnTargetLeave,
              dropdownContentRef: _this4.dropdownContentRefCallback,
              dropdownFooter: _this4.renderDropdownFooter(),
              error: error,
              initiallyOpen: _this4._initiallyOpen,
              inputRef: inputRef,
              menuWidth: menuWidth,
              onInputValueChange: _this4.handleInputValueChange,
              onOpenChange: onOpenChange,
              resetOption: resetOption,
              searchClassName: searchClassName,
              searchPlaceholder: lazyEval(searchPlaceholder),
              selectComponent: SelectComponent,
              selectRef: _this4.selectRefCallback
            }));
          }

          return /*#__PURE__*/_jsx(SelectComponent, Object.assign({
            autofocus: autoFocus
          }, commonProps, {
            className: combinedAnchorClassName,
            dropdownComponent: _this4.renderDropdown,
            ref: _this4._refSequence,
            tabIndex: typeof tabIndex === 'number' ? String(tabIndex) : tabIndex
          }, readOnlyProps));
        }
      });
    }
  }]);

  return UISelectCore;
}(Component);

UISelectCore.propTypes = {
  /**
   * Shows a prompt to create a new option when the user enters a query that
   * doesn’t match any existing option.
   */
  allowCreate: PropTypes.bool,

  /**
   * Determines the type of component to use as the base for the select. The
   * `"input"` base renders as a searchable text input, while the `"button"`
   * base renders as a button. `"combined"` is a mix of both text input and
   * button features with an input-like affordance. `"auto"` defaults to
   * `"combined"` for multi-selects and `"button"` for single selects. `"input"`
   * cannot be used with multi-selects, use `"combined"` instead.
   */
  anchorType: PropTypes.oneOf(['auto', 'button', 'combined', 'input']),

  /**
   * When the HTML `autoComplete` attribute is `"off"`, it prevents the
   * browser's own select from appearing over the component's dropdown. Works
   * with `anchorType="combined"` selects only.
   */
  autoComplete: PropTypes.string,

  /**
   * Auto-focuses on the select input on render.
   */
  autoFocus: PropTypes.bool,

  /**
   * Determines if a call to `loadOptions` should occur when the search string
   * is empty.
   */
  autoload: PropTypes.bool,

  /**
   * Provide a custom button component to render if `anchorType="button"`. The
   * component is passed a `buttonText` prop.
   */
  ButtonContent: UISelectWithButtonAnchor.propTypes.ButtonContent,

  /**
   * Sets the size of the button used for the anchor of the component,
   * corresponding to `UIButton` sizes. Only used when `anchorType="button"`.
   */
  buttonSize: UIButton.propTypes.size,

  /**
   * Sets the visual styles of the button used for the anchor of the component,
   * corresponding to `UIButton` uses. Only used when `anchorType="button"`.
   */
  buttonUse: UIButton.propTypes.use,

  /**
   * Sets the cache object used for options. Alternatively, set to `false` if
   * you’d like to disable caching.
   */
  cache: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /**
   * Provides an affordance to clear the current value of the select. When used
   * with `anchorType="combined"` an "X" is shown on the input, otherwise the
   * placeholder value is added as an option to clear the select.
   */
  clearable: PropTypes.bool.isRequired,

  /**
   * Automatically triggers a close event for the option menu if the select
   * anchor is scrolled out of view.
   */
  closeOnTargetLeave: PropTypes.bool,

  /**
   * Determines whether the option menu is open by default. The `open` prop takes
   * precedence over this if used in a controlled manner.
   */
  defaultOpen: PropTypes.bool,

  /**
   * The `value` to use for initial selection of an option.
   */
  defaultValue: ValueType,

  /**
   * When this character is included within a `defaultValue` or `value` string,
   * the value will split at the delimiter. For example,
   * `defaultValue="hey;there"` will render as two separate options, "hey" and
   * "there", in a multi-select.
   */
  delimiter: PropTypes.string.isRequired,

  /**
   * Determines if the select input is disabled.
   */
  disabled: PropTypes.bool,

  /**
   * A custom className to pass to the container of the dropdown option menu.
   */
  dropdownClassName: PropTypes.string,

  /**
   * Content that will be shown at the bottom of the select dropdown; most
   * commonly used for an “Add option” button that opens a popover with input
   * fields to gather more information for the option creation.
   */
  dropdownFooter: PropTypes.node,

  /**
   * When `true`, shows an error affordance around the select input.
   * `UIFormControl` should be used around the select to add inline error
   * messaging.
   */
  error: PropTypes.bool,

  /**
   * Provide custom functionality to replace the method used to filter options.
   */
  filterOptions: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

  /**
   * An id that is passed to the computed anchor element. Works with
   * `anchorType="button"` or `anchorType="combined"`.
   */
  id: PropTypes.string,

  /**
   * Ignores accented characters and replaces them with the base character.
   */
  ignoreAccents: hidden(PropTypes.bool),

  /**
   * When enabled, search strings are matched to options case-insensitively.
   */
  ignoreCase: hidden(PropTypes.bool),

  /**
   * Provide a custom input component to use as the anchor component. Only used
   * when `anchorType="input"`.
   */
  inputComponent: PropTypes.elementType,

  /**
   * Set a `ref` to the underlying input component.
   */
  inputRef: refObject,

  /**
   * Controls the value of the underlying input. Only used when
   * `anchorType="input"`.
   */
  inputValue: PropTypes.string,

  /**
   * Shows a loading spinner at the end of the options menu.
   */
  isLoading: PropTypes.bool,

  /**
   * The component used to render an option in both the dropdown list and the
   * selected value box. Receives the option object as a prop, along with
   * several other props that should get routed to the root element of the
   * `itemComponent`. The `optionComponent` prop overrides this prop's value
   * for rendering options in the dropdown list, and the `valueComponent` prop
   * overrides this prop's value for rendering options in the selected value box.
   */
  itemComponent: UITypeaheadResultsItem.propTypes.itemComponent,

  /**
   * Provide a custom component that prompts the user to load more options in a
   * paginated select.
   */
  loadMoreComponent: customRenderer.propType,

  /**
   * Provide a custom function that asynchronously loads options.
   */
  loadOptions: PropTypes.func,

  /**
   * Provide a custom function to render the options menu, typically used for
   * virtualized menu rendering. Ordinarily set to `UIComponents/input/utils/virtualizedMenuRenderer`, a react-virtualized function which
   * accepts a number of named parameters.
   */
  menuRenderer: PropTypes.func,

  /**
   * A style object to be applied to the options menu.
   */
  menuStyle: PropTypes.object,

  /**
   * Sets a custom width on the dropdown menu.
   */
  menuWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),

  /**
   * The minimum number of options required before the search input appears in
   * the dropdown.
   */
  minimumSearchCount: PropTypes.number,

  /**
   * Whether multiple options can be selected.
   */
  multi: PropTypes.bool.isRequired,

  /**
   * Defines the max amount of selected options that can appear in the closed
   * state. Only works for `multi={true}`.
   */
  multiCollapseLimit: PropTypes.number,

  /**
   * Text shown when there are no results for given search term within the
   * select.
   */
  noResultsText: createLazyPropType(PropTypes.node),

  /**
   * Provides a custom function that is called whenever the value of the select
   * changes.
   */
  onChange: PropTypes.func,

  /**
   * Triggered whenever a key is pressed when there’s focus on an open select
   * (including arrow keys, shift, etc).
   */
  onInputKeyDown: PropTypes.func,

  /**
   * Triggered whenever the search value has changed or an option has been
   * selected (even if it’s the same option).
   */
  onInputChange: PropTypes.func,

  /**
   * Triggered whenever the search value has changed.
   */
  onInputValueChange: PropTypes.func,

  /**
   * A function to call whenever the select’s menu open state changes.
   */
  onOpenChange: PropTypes.func,

  /**
   * A function to call whenever a value is pasted into the select. The pasted
   * value can be accessed from the clipboardData field on the event object.
   */
  onPaste: PropTypes.func,

  /**
   * Triggered whenever an option is selected. This event fires even if the
   * same option is selected, unlike `onChange`.
   */
  onSelectedOptionChange: PropTypes.func,

  /**
   * Controls the open state of the option menu.
   */
  open: PropTypes.bool,

  /**
   * The component used to render an option in the dropdown list. Receives the
   * option object as a prop, along with several other props that should get
   * routed to the root element of the `optionComponent`. Defaults to the value
   * of the `itemComponent` prop.
   */
  optionComponent: UITypeaheadResultsItem.propTypes.itemComponent,

  /**
   * The options from which the user may select from. In most cases, each
   * option object must have a `text` key, which controls the display text
   * and is used in search, and a `value` key.
   */
  options: PropTypes.arrayOf(OptionOrGroupType),

  /**
   * Provide a custom function that is responsible for rendering each option.
   * Receives an option object as its arguments.
   */
  optionRenderer: PropTypes.func,

  /**
   * When enabled, options that have a truthy `isSpecial` key are rendered
   * using the default option renderer instead of the passed optionRenderer
   * prop.
   */
  optionRendererIgnoresSpecialOptions: PropTypes.bool,

  /**
   * The placeholder text in the select. This also becomes the text that allows
   * a user to clear the current selected option when used with clearable
   * `anchorType="button"|"input"`.
   */
  placeholder: createLazyPropType(PropTypes.node).isRequired,

  /**
   * Controls the placement of the option menu popover.
   */
  placement: PropTypes.oneOf(PLACEMENTS),

  /**
   * A function that returns custom text for prompting the user to create a new
   * option. The new option’s `text` value is passed through as the function
   * argument. Only used with `allowCreate={true}`.
   */
  promptTextCreator: PropTypes.func,

  /**
   * Determines if the select input is read-only or editable.
   */
  readOnly: PropTypes.bool,

  /**
   * The value set when the user clears the select input. Only possible when
   * `clearable={true}`.
   */
  resetValue: ValueType,

  /**
   * A custom className to pass to the container of the list of displayed
   * options inside of the popover.
   */
  resultsClassName: PropTypes.string,
  search: PropTypes.string,

  /**
   * Whether or not the search input is visible. Note that in the current
   * behavior, the select still always filters when typing in the input.
   */
  searchable: PropTypes.bool.isRequired,

  /**
   * ClassName passed to the search input within the select.
   */
  searchClassName: PropTypes.string,

  /**
   * Placeholder text in the search input within the select.
   */
  searchPlaceholder: createLazyPropType(PropTypes.string).isRequired,

  /**
   * Text to display when options have not been fetched yet by `loadOptions`.
   */
  searchPromptText: createLazyPropType(PropTypes.string).isRequired,

  /**
   * A regex string to define the delimiter(s) between options for
   * multi-selects.
   */
  splitRegex: PropTypes.object,

  /**
   * Sets a custom value for `tabIndex` on the rendered anchor element.
   */
  tabIndex: PropTypes.number,

  /**
   * Controls the current value of the select. For `anchorType="input"`, use
   * `inputValue` instead.
   */
  value: ValueType,

  /**
   * The component used to render the options in the selected value box.
   * Receives the option object as a prop, along with several other props that
   * should get routed to the root element of the `valueComponent`. Defaults to
   * the value of the `itemComponent` prop.
   */
  valueComponent: UITypeaheadResultsItem.propTypes.itemComponent,

  /**
   * Provide a custom function that is responsible for rendering the current
   * value of the select, shown in the anchor input or button.
   */
  valueRenderer: PropTypes.func,

  /**
   * Forces the placeholder to be shown even if the select has a current value.
   * Presumably used with anchorType="button" and buttonUse to mimic dropdown
   * behavior.
   */
  _forcePlaceholder: PropTypes.bool
};
UISelectCore.defaultProps = {
  allowCreate: false,
  anchorType: 'auto',
  autoComplete: 'off',
  autoload: true,
  buttonSize: 'default',
  buttonUse: 'form',
  clearable: false,
  delimiter: ';',
  open: false,
  ignoreAccents: true,
  ignoreCase: true,
  inputComponent: UISearchInput,
  itemComponent: 'span',
  loadMoreComponent: LoadMoreComponent,
  minimumSearchCount: 8,
  multi: false,
  optionRendererIgnoresSpecialOptions: false,
  placeholder: function placeholder() {
    return I18n.text('salesUI.UISelect.placeholder');
  },
  promptTextCreator: promptTextCreator,
  resetValue: '',
  searchable: true,
  searchPlaceholder: function searchPlaceholder() {
    return I18n.text('salesUI.UISearchableSelectInput.placeholder');
  },
  searchPromptText: function searchPromptText() {
    return I18n.text('salesUI.UISelect.typeToSearch');
  },
  splitRegex: /;/,
  value: '',
  _forcePlaceholder: false
};
UISelectCore.displayName = 'UISelect';
var UISelect = Controllable(UISelectCore, ['open', 'value']);
UISelect.stripDiacritics = stripDiacritics;
export default UISelect;