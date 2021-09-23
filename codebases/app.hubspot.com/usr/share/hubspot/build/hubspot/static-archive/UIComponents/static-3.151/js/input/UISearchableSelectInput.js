'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { USE_CLASSES as BUTTON_USE_CLASSES } from '../button/ButtonConstants';
import { Consumer as FieldsetContextConsumer } from '../context/FieldsetContext';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
import UIAbstractDropdown from '../dropdown/abstract/UIAbstractDropdown';
import { PLACEMENTS } from '../tooltip/PlacementConstants';
import UIGroupedTypeahead from '../typeahead/UIGroupedTypeahead';
import UITypeahead from '../typeahead/UITypeahead';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import refObject from '../utils/propTypes/refObject';
import { INPUT_SIZE_OPTIONS } from './InputConstants';
import { getButtonProps } from './utils/SelectOptionUtils';
import Deprecated from '../decorators/Deprecated';
import ShareInput from '../decorators/ShareInput';
var UISearchableSelectInput = createReactClass({
  displayName: 'UISearchableSelectInput',
  propTypes: {
    autoFocus: PropTypes.bool,
    buttonUse: PropTypes.oneOf(Object.keys(BUTTON_USE_CLASSES)).isRequired,
    children: PropTypes.node,
    disabled: UIAbstractDropdown.propTypes.disabled,
    dropdownClassName: PropTypes.string,
    error: PropTypes.bool,
    inputRef: refObject.isRequired,
    itemComponent: PropTypes.elementType,
    layout: PropTypes.oneOf(['list', 'grouped']),
    menuWidth: UIAbstractDropdown.propTypes.menuWidth,
    minimumSearchCount: PropTypes.number,
    onChange: PropTypes.func,
    onOpenChange: PropTypes.func,
    onOpenComplete: PropTypes.func,
    onSearchChange: PropTypes.func,
    open: UIAbstractDropdown.propTypes.open,
    options: UITypeahead.propTypes.options,
    placeholder: PropTypes.node,
    placement: PropTypes.oneOf(PLACEMENTS),
    popoverRef: refObject,
    readOnly: PropTypes.bool,
    typeaheadPlaceholder: createLazyPropType(PropTypes.string).isRequired,
    value: UITypeahead.propTypes.value
  },
  getDefaultProps: function getDefaultProps() {
    return {
      buttonUse: 'form',
      itemComponent: 'li',
      layout: 'list',
      minimumSearchCount: 8,
      open: false,
      placement: 'bottom',
      typeaheadPlaceholder: function typeaheadPlaceholder() {
        return I18n.text('salesUI.UISearchableSelectInput.placeholder');
      },
      value: ''
    };
  },
  focus: function focus() {
    this.setIsOpen(true);
  },
  handleFocusLeave: function handleFocusLeave() {// Temporarily disabled. This causes close-and-reopen when clicking the anchor.
    // this.setIsOpen(false);
  },
  handleSelect: function handleSelect(evt) {
    var _this$props = this.props,
        onChange = _this$props.onChange,
        value = _this$props.value;

    if (evt.target.value !== value) {
      onChange(evt);
    }

    this.setIsOpen(false);
  },
  setIsOpen: function setIsOpen(nextOpen) {
    var onOpenChange = this.props.onOpenChange;
    onOpenChange(SyntheticEvent(nextOpen));
  },
  render: function render() {
    var _this = this;

    var _this$props2 = this.props,
        autoFocus = _this$props2.autoFocus,
        _children = _this$props2.children,
        className = _this$props2.className,
        dropdownClassName = _this$props2.dropdownClassName,
        error = _this$props2.error,
        inputRef = _this$props2.inputRef,
        itemComponent = _this$props2.itemComponent,
        layout = _this$props2.layout,
        minimumSearchCount = _this$props2.minimumSearchCount,
        onBlur = _this$props2.onBlur,
        onSearchChange = _this$props2.onSearchChange,
        options = _this$props2.options,
        placeholder = _this$props2.placeholder,
        typeaheadPlaceholder = _this$props2.typeaheadPlaceholder,
        value = _this$props2.value,
        rest = _objectWithoutProperties(_this$props2, ["autoFocus", "children", "className", "dropdownClassName", "error", "inputRef", "itemComponent", "layout", "minimumSearchCount", "onBlur", "onSearchChange", "options", "placeholder", "typeaheadPlaceholder", "value"]);

    this.hasBeenClosed = this.hasBeenClosed || this.props.open === false;
    var Typeahead = layout === 'grouped' ? UIGroupedTypeahead : UITypeahead;
    var computedValue = value == null ? '' : value;

    var _getButtonProps = getButtonProps({
      options: options,
      placeholder: placeholder,
      resetValue: '',
      value: computedValue
    }),
        buttonText = _getButtonProps.buttonText,
        valueIsValid = _getButtonProps.valueIsValid;

    var computedDropdownClassName = classNames('private-searchable-select-input__dropdown', dropdownClassName);
    return /*#__PURE__*/_jsx(FieldsetContextConsumer, {
      children: function children(_ref) {
        var fieldSize = _ref.size;
        return /*#__PURE__*/_jsxs(UIAbstractDropdown, Object.assign({}, rest, {
          "aria-invalid": !valueIsValid,
          autoFocus: autoFocus,
          buttonText: buttonText,
          className: classNames(className, INPUT_SIZE_OPTIONS[fieldSize], !valueIsValid && "invalid", error && 'private-form__control--error', computedValue === '' && "noValue"),
          dropdownClassName: computedDropdownClassName,
          onFocusLeave: _this.handleFocusLeave,
          pinToConstraint: ['top', 'bottom'],
          children: [_children, /*#__PURE__*/_jsx(Typeahead, {
            autoFocus: autoFocus || _this.hasBeenClosed,
            inputRef: inputRef,
            itemComponent: itemComponent,
            minimumSearchCount: minimumSearchCount,
            onBlur: onBlur,
            onChange: _this.handleSelect,
            onSearchChange: onSearchChange,
            options: options,
            placeholder: lazyEval(typeaheadPlaceholder),
            value: value
          })]
        }));
      }
    });
  }
});
export default Deprecated('Use `UISelect` instead.')(ShareInput(Controllable(UISearchableSelectInput, ['open', 'value'])));