'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import createReactClass from 'create-react-class';
import ShareInput from '../../decorators/ShareInput';
import { callIfPossible } from '../../core/Functions';
import SyntheticEvent from '../../core/SyntheticEvent';
import refObject from '../../utils/propTypes/refObject';
import { getComponentPropType } from '../../utils/propTypes/componentProp';
import { OptionOrGroupType, OptionType, ValueType } from '../../types/OptionTypes';
import { PLACEMENTS } from '../../tooltip/PlacementConstants';
import UIAbstractDropdownWithSearchbox from '../../dropdown/abstract/UIAbstractDropdownWithSearchbox';
import UITypeaheadSearch from '../../typeahead/search/UITypeaheadSearch';
import UITag from '../../tag/UITag';
import { getButtonProps, getValueOption } from '../utils/SelectOptionUtils';
import { getAriaAndDataProps } from '../../utils/Props';
var DISPLAY_NONE_STYLE = {
  display: 'none'
};
var buttonContentPropTypes = {
  buttonText: PropTypes.node.isRequired
};

var noop = function noop() {};

var getEventProps = function getEventProps(props) {
  var eventPropKeyRegex = /^on[A-Z]/;
  return Object.keys(props).filter(function (key) {
    return key !== 'onClose' && key !== 'onInputChange' && key !== 'onInputKeyDown' && key !== 'onOpen' && key !== 'onInputValueChange';
  }).reduce(function (acc, key) {
    if (!key) return acc;

    if (key.match(eventPropKeyRegex)) {
      acc[key] = props[key];
    }

    return acc;
  }, {});
};

var UISelectWithButtonAnchor = createReactClass({
  displayName: 'UISelectWithButtonAnchor',
  propTypes: {
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    autoload: PropTypes.bool,
    ButtonContent: getComponentPropType({
      propTypes: buttonContentPropTypes
    }),
    buttonSize: UIAbstractDropdownWithSearchbox.propTypes.buttonSize,
    buttonStyle: PropTypes.object,
    buttonUse: UIAbstractDropdownWithSearchbox.propTypes.buttonUse,
    cache: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    caretRenderer: UIAbstractDropdownWithSearchbox.propTypes.caretRenderer,
    closeOnOutsideClick: UIAbstractDropdownWithSearchbox.propTypes.closeOnOutsideClick,
    closeOnTargetLeave: UIAbstractDropdownWithSearchbox.propTypes.closeOnTargetLeave,
    disabled: PropTypes.bool,
    dropdownClassName: PropTypes.string,
    dropdownContentRef: PropTypes.func,
    dropdownFooter: PropTypes.node,
    error: PropTypes.bool,
    initiallyOpen: PropTypes.bool.isRequired,
    inputRef: refObject.isRequired,
    menuWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
    minimumSearchCount: PropTypes.number,
    multi: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    loadOptions: PropTypes.func,
    onChange: PropTypes.func,
    onInputValueChange: PropTypes.func,
    onOpenChange: PropTypes.func,
    options: PropTypes.arrayOf(OptionOrGroupType),
    placeholder: PropTypes.node,
    placement: PropTypes.oneOf(PLACEMENTS),
    readOnly: PropTypes.bool,
    resetOption: OptionType.isRequired,
    resetValue: ValueType,
    resultsClassName: PropTypes.string,
    searchable: PropTypes.bool,
    searchClassName: PropTypes.string,
    SearchInput: PropTypes.elementType,
    searchPlaceholder: PropTypes.string,
    selectComponent: PropTypes.func.isRequired,
    selectRef: PropTypes.func,
    value: PropTypes.any,
    valueRenderer: PropTypes.func,
    _forcePlaceholder: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return Object.assign({}, UIAbstractDropdownWithSearchbox.defaultProps, {
      searchable: true
    });
  },
  getInitialState: function getInitialState() {
    return {
      inputCache: {},
      inputValue: '',
      searchCount: 0
    };
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        autoload = _this$props.autoload,
        cache = _this$props.cache,
        isOpen = _this$props.isOpen,
        loadOptions = _this$props.loadOptions,
        selectComponent = _this$props.selectComponent; // Mount a separate Select.Async instance to perform autoload, if needed. This is a weird hack,
    // but a necessary one since the normal Select isn't mounted until the user opens the dropdown.

    if (autoload && loadOptions && !isOpen) {
      this._autoloadSelectEl = document.createElement('div');
      var SelectComponent = selectComponent;
      ReactDOM.render( /*#__PURE__*/_jsx(SelectComponent, {
        autoload: autoload,
        cache: typeof cache === 'undefined' ? this.state.inputCache : cache,
        loadOptions: loadOptions
      }), this._autoloadSelectEl);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this._autoloadSelectEl) {
      ReactDOM.unmountComponentAtNode(this._autoloadSelectEl);
      this._autoloadSelectEl = null;
    }
  },
  focus: function focus() {
    var _this$props2 = this.props,
        onOpenChange = _this$props2.onOpenChange,
        isOpen = _this$props2.isOpen;
    if (!isOpen) onOpenChange(SyntheticEvent(true));
  },
  selectRefCallback: function selectRefCallback(ref) {
    var selectRef = this.props.selectRef; // When react-select mounts, ask it how many (flattened) options it has

    this._selectRef = ref;
    var internalSelect = this.getInternalSelect();

    if (internalSelect) {
      this.setState({
        searchCount: internalSelect._flatOptions.length
      });
    }

    if (selectRef) {
      selectRef(ref);
    }
  },
  getInternalSelect: function getInternalSelect() {
    // Return our react-select component instance, or null
    if (!this._selectRef) {
      return null;
    }

    if (!this._selectRef.select) {
      return this._selectRef;
    } // _selectRef must be an <Async> or <Creatable> wrapper


    return this._selectRef.select;
  },
  getInternalAsyncSelect: function getInternalAsyncSelect() {
    // Return our react-select Async instance, or null
    if (!this._selectRef || !this._selectRef.select) {
      return null;
    }

    return this._selectRef;
  },
  handleInputKeyDown: function handleInputKeyDown(evt) {
    var _this = this;

    var internalSelect = this.getInternalSelect();

    if (internalSelect) {
      internalSelect.handleKeyDown(evt);
      setTimeout(function () {
        _this.forceUpdate(); // Ensure that the input renders with updated ARIA attrs on up/down

      });
    }
  },
  handleInputChange: function handleInputChange(evt) {
    var onInputValueChange = this.props.onInputValueChange;
    callIfPossible(onInputValueChange, evt);
    var internalSelect = this.getInternalSelect();

    if (internalSelect) {
      internalSelect.handleInputChange(evt);
    } // This setState() forces an update, ensuring that Tether is repositioned properly.


    this.setState({
      inputValue: evt.target.value
    });
  },
  handleInputFocus: function handleInputFocus() {
    // React Select thinks it's closed when its input receives a blur event.
    // We don't want that, because it ignores keydown events when closed.
    var internalSelect = this.getInternalSelect();

    if (internalSelect) {
      internalSelect.setState({
        isOpen: true
      });
    }
  },
  handleFocusLeave: function handleFocusLeave() {// Temporarily disabled. This causes close-and-reopen when clicking the anchor.
    // const { onOpenChange } = this.props;
    // onOpenChange(SyntheticEvent(false));
  },
  handleRemoveValueClick: function handleRemoveValueClick(optionValue, evt) {
    var _this2 = this;

    var _this$props3 = this.props,
        onChange = _this$props3.onChange,
        value = _this$props3.value;
    var internalSelect = this.getInternalSelect();

    if (internalSelect) {
      var internalSelectValueArray = internalSelect.getValueArray(internalSelect.props.value);
      internalSelect.setValue(internalSelectValueArray.filter(function (option) {
        return option.value !== optionValue;
      }));
    } else {
      // Select is unmounted (e.g. because the dropdown is closed), so we handle the change
      // ourselves. Note that the "value" prop on UISelectWithButtonAnchor is an array of options.
      var allOptions = (value || []).map(function (v) {
        return typeof v === 'object' ? v : _this2.getOptionForSingleValue(v);
      });
      var newOptions = allOptions.filter(function (v) {
        return v.value !== optionValue;
      });
      onChange(newOptions);
    }

    evt.stopPropagation(); // Prevent dropdown toggle
  },
  hasSearchbox: function hasSearchbox(_ref) {
    var loadOptions = _ref.loadOptions,
        minimumSearchCount = _ref.minimumSearchCount,
        searchable = _ref.searchable;

    // No search, no searchbox.
    if (!searchable) {
      return false;
    } // If we're in async mode, always show the searchbox. Otherwise, show it only if the number of
    // (flattened) options meets minimumSearchCount, or if a search has been entered.


    return !!loadOptions || this.state.searchCount >= minimumSearchCount || Boolean(this.state.inputValue);
  },
  getOptionForSingleValue: function getOptionForSingleValue(singleValue) {
    var options = this.props.options; // If the given "value" is actually an option, return it as-is.

    if (typeof singleValue === 'object' && singleValue.value) {
      return singleValue;
    } // If the given value maps to an option, return that.


    var option = getValueOption(options, singleValue);

    if (option) {
      return option;
    } // Otherwise, return a new option with the given value.


    return {
      text: singleValue,
      value: singleValue
    };
  },
  getButtonContent: function getButtonContent(_ref2) {
    var disabled = _ref2.disabled,
        readOnly = _ref2.readOnly,
        loadOptions = _ref2.loadOptions,
        multi = _ref2.multi,
        options = _ref2.options,
        placeholder = _ref2.placeholder,
        resetOption = _ref2.resetOption,
        resetValue = _ref2.resetValue,
        value = _ref2.value,
        valueRenderer = _ref2.valueRenderer,
        _forcePlaceholder = _ref2._forcePlaceholder;

    if (_forcePlaceholder) {
      return {
        valueIsValid: true,
        buttonText: placeholder
      };
    }

    if (multi) {
      var renderedMultiValues = this.renderMultiValues({
        disabled: disabled,
        readOnly: readOnly,
        placeholder: placeholder,
        value: value,
        valueRenderer: valueRenderer
      });
      return {
        valueIsValid: true,
        buttonText: /*#__PURE__*/_jsx("span", {
          className: 'private-form__selectplus--multi-values' + (Array.isArray(renderedMultiValues) ? " has-value-tags" : ""),
          children: renderedMultiValues
        })
      };
    }

    return getButtonProps({
      async: !!loadOptions,
      options: options,
      placeholder: placeholder,
      resetOption: resetOption,
      resetValue: resetValue,
      value: value,
      valueRenderer: valueRenderer
    });
  },
  renderMultiValues: function renderMultiValues(_ref3) {
    var _this3 = this;

    var disabled = _ref3.disabled,
        readOnly = _ref3.readOnly,
        placeholder = _ref3.placeholder,
        value = _ref3.value,
        valueRenderer = _ref3.valueRenderer;

    if (!Array.isArray(value) || value.length === 0) {
      return placeholder;
    }

    return value.map(function (v) {
      var option = _this3.getOptionForSingleValue(v);

      var handleCloseClick = _this3.handleRemoveValueClick.bind(_this3, option.value);

      return /*#__PURE__*/_jsx(UITag, {
        _bordered: true,
        closeable: !disabled && !readOnly && option.clearableValue !== false,
        onCloseClick: handleCloseClick,
        use: option.tagUse || 'default',
        children: valueRenderer(option)
      }, option.value);
    });
  },
  renderSearch: function renderSearch(_ref4, _ref5) {
    var autoComplete = _ref4.autoComplete,
        initiallyOpen = _ref4.initiallyOpen,
        inputRef = _ref4.inputRef,
        onPaste = _ref4.onPaste,
        searchClassName = _ref4.searchClassName,
        SearchInput = _ref4.SearchInput,
        searchPlaceholder = _ref4.searchPlaceholder;
    var hasSearchbox = _ref5.hasSearchbox;
    var ariaActiveDescendant;
    var ariaOwns;
    var internalSelect = this.getInternalSelect();

    if (internalSelect) {
      var valueArray = internalSelect.getValueArray(internalSelect.props.value);
      ariaActiveDescendant = internalSelect._instancePrefix + "-option-" + internalSelect.getFocusableOptionIndex(valueArray[0]);
      ariaOwns = internalSelect._instancePrefix + "--list";
    }

    return /*#__PURE__*/_jsx(UITypeaheadSearch, {
      "aria-activedescendant": ariaActiveDescendant,
      "aria-owns": ariaOwns,
      autoComplete: autoComplete,
      autoFocus: !initiallyOpen,
      className: classNames(searchClassName, !hasSearchbox && 'sr-only'),
      Input: SearchInput,
      inputRef: inputRef,
      onKeyDown: this.handleInputKeyDown,
      onChange: this.handleInputChange,
      onFocus: this.handleInputFocus,
      onPaste: onPaste,
      placeholder: searchPlaceholder,
      role: "combobox"
    });
  },
  render: function render() {
    var _this$props4 = this.props,
        autoComplete = _this$props4.autoComplete,
        autoFocus = _this$props4.autoFocus,
        ButtonContent = _this$props4.ButtonContent,
        buttonSize = _this$props4.buttonSize,
        buttonStyle = _this$props4.buttonStyle,
        buttonUse = _this$props4.buttonUse,
        cache = _this$props4.cache,
        caretRenderer = _this$props4.caretRenderer,
        className = _this$props4.className,
        closeOnOutsideClick = _this$props4.closeOnOutsideClick,
        closeOnTargetLeave = _this$props4.closeOnTargetLeave,
        disabled = _this$props4.disabled,
        dropdownClassName = _this$props4.dropdownClassName,
        dropdownContentRef = _this$props4.dropdownContentRef,
        dropdownFooter = _this$props4.dropdownFooter,
        error = _this$props4.error,
        id = _this$props4.id,
        initiallyOpen = _this$props4.initiallyOpen,
        inputRef = _this$props4.inputRef,
        isOpen = _this$props4.isOpen,
        loadOptions = _this$props4.loadOptions,
        menuWidth = _this$props4.menuWidth,
        minimumSearchCount = _this$props4.minimumSearchCount,
        multi = _this$props4.multi,
        onChange = _this$props4.onChange,
        onPaste = _this$props4.onPaste,
        options = _this$props4.options,
        placeholder = _this$props4.placeholder,
        placement = _this$props4.placement,
        readOnly = _this$props4.readOnly,
        resetValue = _this$props4.resetValue,
        searchClassName = _this$props4.searchClassName,
        searchPlaceholder = _this$props4.searchPlaceholder,
        resetOption = _this$props4.resetOption,
        resultsClassName = _this$props4.resultsClassName,
        searchable = _this$props4.searchable,
        SearchInput = _this$props4.SearchInput,
        selectComponent = _this$props4.selectComponent,
        __selectRef = _this$props4.selectRef,
        value = _this$props4.value,
        valueRenderer = _this$props4.valueRenderer,
        _forcePlaceholder = _this$props4._forcePlaceholder,
        rest = _objectWithoutProperties(_this$props4, ["autoComplete", "autoFocus", "ButtonContent", "buttonSize", "buttonStyle", "buttonUse", "cache", "caretRenderer", "className", "closeOnOutsideClick", "closeOnTargetLeave", "disabled", "dropdownClassName", "dropdownContentRef", "dropdownFooter", "error", "id", "initiallyOpen", "inputRef", "isOpen", "loadOptions", "menuWidth", "minimumSearchCount", "multi", "onChange", "onPaste", "options", "placeholder", "placement", "readOnly", "resetValue", "searchClassName", "searchPlaceholder", "resetOption", "resultsClassName", "searchable", "SearchInput", "selectComponent", "selectRef", "value", "valueRenderer", "_forcePlaceholder"]);

    var _this$getButtonConten = this.getButtonContent({
      disabled: disabled,
      readOnly: readOnly,
      loadOptions: loadOptions,
      multi: multi,
      options: options,
      placeholder: placeholder,
      resetOption: resetOption,
      resetValue: resetValue,
      value: value,
      valueRenderer: valueRenderer,
      _forcePlaceholder: _forcePlaceholder
    }),
        buttonText = _this$getButtonConten.buttonText,
        valueIsValid = _this$getButtonConten.valueIsValid;

    var hasSearchbox = this.hasSearchbox({
      loadOptions: loadOptions,
      minimumSearchCount: minimumSearchCount,
      searchable: searchable
    });
    var SelectComponent = selectComponent;
    return /*#__PURE__*/_jsxs(UIAbstractDropdownWithSearchbox, Object.assign({}, getAriaAndDataProps(rest), {}, getEventProps(rest), {
      _useNativeButton: false,
      "aria-invalid": error != null ? error : !valueIsValid,
      autoFocus: autoFocus,
      buttonText: ButtonContent == null ? buttonText : /*#__PURE__*/_jsx(ButtonContent, {
        buttonText: buttonText
      }),
      buttonSize: buttonSize,
      buttonUse: buttonUse,
      caretRenderer: caretRenderer,
      className: className,
      closeOnOutsideClick: closeOnOutsideClick,
      closeOnTargetLeave: closeOnTargetLeave,
      disabled: disabled,
      dropdownClassName: dropdownClassName,
      dropdownContentRef: dropdownContentRef,
      hasSearchbox: hasSearchbox,
      id: id,
      menuWidth: menuWidth,
      multiline: multi,
      onFocusLeave: this.handleFocusLeave,
      onOpenComplete: this.handleOpenComplete,
      open: isOpen,
      placement: placement,
      readOnly: readOnly,
      style: buttonStyle,
      children: [this.renderSearch({
        autoComplete: autoComplete,
        initiallyOpen: initiallyOpen,
        inputRef: inputRef,
        onPaste: onPaste,
        searchClassName: searchClassName,
        SearchInput: SearchInput,
        searchPlaceholder: searchPlaceholder
      }, {
        hasSearchbox: hasSearchbox
      }), /*#__PURE__*/_jsx("span", {
        className: classNames('private-typeahead-results', resultsClassName),
        "data-dropdown-results": true,
        "data-async-options": !!loadOptions,
        children: /*#__PURE__*/_jsx(SelectComponent, Object.assign({}, rest, {
          autosize: false,
          cache: typeof cache === 'undefined' ? this.state.inputCache : cache,
          disabled: disabled,
          isOpen: true,
          loadOptions: loadOptions,
          multi: multi,
          onChange: onChange,
          options: options,
          readOnly: readOnly,
          ref: this.selectRefCallback,
          resetValue: resetValue,
          scrollMenuIntoView: false,
          style: DISPLAY_NONE_STYLE,
          tabIndex: "-1",
          value: value,
          valueRenderer: noop
        }))
      }), dropdownFooter]
    }));
  }
});
export default ShareInput(UISelectWithButtonAnchor);