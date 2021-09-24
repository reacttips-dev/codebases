'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { createRef } from 'react';
import I18n from 'I18n';
import guessCountryFromDialCode from 'I18n/utils/guessCountryFromDialCode';
import formatPhoneNumber from 'I18n/utils/formatPhoneNumber';
import classNames from 'classnames';
import UITextInput from 'UIComponents/input/UITextInput';
import UISelect from 'UIComponents/input/UISelect';
import UIIcon from 'UIComponents/icon/UIIcon';
import CountryFlag from '../internal/components/CountryFlag';
import getPhoneOptions from '../internal/utils/getPhoneOptions';
import SupportedPhoneNumbers from '../constants/SupportedPhoneNumbers';
import * as TelephoneData from 'I18n/constants/TelephoneData';
var allCountries = TelephoneData.allCountries;
var iso2Lookup = TelephoneData.iso2Lookup;
var INVALID_OPTION = {
  dialCode: '',
  priority: 10001,
  iso2: null
};
export default createReactClass({
  displayName: "PhoneNumberInput",
  propTypes: {
    countrySelectProps: PropTypes.object,
    extensionInputProps: PropTypes.object,
    extensionValue: PropTypes.string,
    onChange: PropTypes.func,
    phoneInputProps: PropTypes.object,
    supportedCountrySet: PropTypes.oneOf(Object.keys(SupportedPhoneNumbers)),
    validCountries: PropTypes.array,
    value: PropTypes.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      countrySelectProps: {},
      extensionInputProps: {},
      phoneInputProps: {}
    };
  },
  getInitialState: function getInitialState() {
    return this._mapPropsToState(this.props);
  },
  UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.value === null || nextProps.value === undefined) {
      this.setState(this._mapPropsToState(nextProps));
    } else {
      var nextValueDigits = nextProps.value.replace(/\D/g, '');
      var currentValueDigits = this.state.formattedNumber.replace(/\D/g, '');

      if (nextProps.value && nextValueDigits !== currentValueDigits) {
        this.setState(this._mapPropsToState(nextProps));
      }
    }
  },
  _cursorToEnd: function _cursorToEnd() {
    var input = this.numberInputRef.current;

    if (input) {
      input.focus();
    }
  },
  formatSimpleNumber: function formatSimpleNumber(number) {
    var hasSelectedValidCountry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var digitsOnly = number.replace(/\D/g, '');

    if (!hasSelectedValidCountry) {
      return digitsOnly;
    }

    return "+" + digitsOnly;
  },
  handlePhoneNumberInput: function handlePhoneNumberInput(event) {
    var _this$state = this.state,
        formattedNumber = _this$state.formattedNumber,
        selectedCountry = _this$state.selectedCountry;
    var extension = this.props.extensionValue;
    var eventTarget = event.target;

    if (eventTarget.value === formattedNumber) {
      return;
    }

    var inputNumber = eventTarget.value.replace(/\D/g, '');

    if (inputNumber.indexOf(selectedCountry.dialCode) !== 0) {
      inputNumber = selectedCountry.dialCode;
    }

    if (this.props.onChange) {
      this.props.onChange({
        phoneNumber: this.formatSimpleNumber(inputNumber, selectedCountry.dialCode),
        extension: extension,
        country: selectedCountry.iso2
      });
    }

    var selectionStart = eventTarget.selectionStart;
    var formattedInputNumber = formatPhoneNumber(inputNumber, selectedCountry.format);
    this.setState({
      formattedNumber: formattedInputNumber
    }, function () {
      var newSelectionStart = selectionStart;

      if (inputNumber === selectedCountry.dialCode || selectionStart === formattedNumber.length + 1) {
        newSelectionStart = formattedInputNumber.length + 1;
      }

      eventTarget.selectionStart = newSelectionStart;
      eventTarget.selectionEnd = newSelectionStart;
    });
  },
  handleExtensionInput: function handleExtensionInput(e) {
    var _this$state2 = this.state,
        selectedCountry = _this$state2.selectedCountry,
        formattedNumber = _this$state2.formattedNumber;
    this.props.onChange({
      phoneNumber: this.formatSimpleNumber(formattedNumber, selectedCountry.dialCode),
      extension: e.target.value.replace(/\D/g, ''),
      country: selectedCountry.iso2
    });
  },
  handleFlagItemClick: function handleFlagItemClick(e) {
    var _this = this;

    var extension = this.props.extensionValue;
    var _this$state3 = this.state,
        selectedCountry = _this$state3.selectedCountry,
        formattedNumber = _this$state3.formattedNumber;
    var nextSelectedCountry = allCountries[iso2Lookup[e.target.value]];

    if (selectedCountry.iso2 !== nextSelectedCountry.iso2) {
      var newNumber = selectedCountry.dialCode ? formattedNumber.replace(/\D/g, '').replace(selectedCountry.dialCode, nextSelectedCountry.dialCode) : "" + nextSelectedCountry.dialCode + formattedNumber;
      var newFormattedNumber = formatPhoneNumber(newNumber, nextSelectedCountry.format);
      this.setState({
        selectedCountry: nextSelectedCountry,
        formattedNumber: newFormattedNumber
      }, function () {
        _this._cursorToEnd();

        if (_this.props.onChange) {
          _this.props.onChange({
            phoneNumber: _this.formatSimpleNumber(newNumber, selectedCountry.dialCode || nextSelectedCountry.dialCode),
            extension: extension,
            country: nextSelectedCountry.iso2
          });
        }
      });
    }
  },
  _mapPropsToState: function _mapPropsToState(props) {
    var inputNumber;

    if (props.value) {
      inputNumber = props.value;
    } else {
      inputNumber = '';
    }

    var selectedCountryGuess = INVALID_OPTION;
    var formattedNumber = inputNumber;

    if (inputNumber === '' || inputNumber.indexOf('+') === 0) {
      selectedCountryGuess = guessCountryFromDialCode(inputNumber.replace(/\D/g, ''));
      var numberToFormat = inputNumber ? inputNumber.replace(/\D/g, '') : selectedCountryGuess.dialCode;
      formattedNumber = formatPhoneNumber(numberToFormat, selectedCountryGuess.format);
    }

    return {
      selectedCountry: selectedCountryGuess,
      formattedNumber: formattedNumber
    };
  },
  getCountryDropDownList: function getCountryDropDownList(hasSelectedValidCountry, validCountries, supportedCountrySet) {
    var countryDropDownList = getPhoneOptions(allCountries);

    var checkSupportedCountries = function checkSupportedCountries(country) {
      return SupportedPhoneNumbers[supportedCountrySet].indexOf(country.value) >= 0;
    };

    var checkValidCountries = function checkValidCountries(country) {
      return validCountries.indexOf(country.value) >= 0;
    };

    if (supportedCountrySet && validCountries) {
      countryDropDownList = countryDropDownList.filter(function (country) {
        return checkSupportedCountries(country) && checkValidCountries(country);
      });
    } else if (supportedCountrySet) {
      countryDropDownList = countryDropDownList.filter(checkSupportedCountries);
    } else if (validCountries) {
      countryDropDownList = countryDropDownList.filter(checkValidCountries);
    }

    if (!hasSelectedValidCountry) {
      return [{
        value: INVALID_OPTION.iso2,
        text: I18n.text('i18nAddon.countryInfo.invalidCountryOption')
      }].concat(_toConsumableArray(countryDropDownList));
    }

    return countryDropDownList;
  },
  buildValueRenderer: function buildValueRenderer(countryIso) {
    return function () {
      if (!countryIso) {
        return /*#__PURE__*/_jsx(UIIcon, {
          name: "warning"
        });
      }

      return /*#__PURE__*/_jsx(CountryFlag, {
        countryCode: countryIso
      });
    };
  },
  renderExtension: function renderExtension(extensionValue, extensionInputProps) {
    if (typeof extensionValue !== 'string') {
      return null;
    }

    return /*#__PURE__*/_jsx(UITextInput, Object.assign({}, extensionInputProps, {
      className: classNames('extension-input', extensionInputProps.className),
      placeholder: I18n.text('i18nAddon.phoneNumberInput.extensionPlaceholder'),
      onChange: this.handleExtensionInput,
      value: extensionValue
    }));
  },
  render: function render() {
    var _this$state4 = this.state,
        selectedCountry = _this$state4.selectedCountry,
        formattedNumber = _this$state4.formattedNumber;

    var _this$props = this.props,
        className = _this$props.className,
        countrySelectProps = _this$props.countrySelectProps,
        extensionInputProps = _this$props.extensionInputProps,
        extensionValue = _this$props.extensionValue,
        phoneInputProps = _this$props.phoneInputProps,
        __onChange = _this$props.onChange,
        validCountries = _this$props.validCountries,
        supportedCountrySet = _this$props.supportedCountrySet,
        passThroughProps = _objectWithoutProperties(_this$props, ["className", "countrySelectProps", "extensionInputProps", "extensionValue", "phoneInputProps", "onChange", "validCountries", "supportedCountrySet"]);

    this.numberInputRef = this.numberInputRef || /*#__PURE__*/createRef();
    return /*#__PURE__*/_jsxs("div", Object.assign({}, passThroughProps, {
      className: classNames('phone-number-input', className),
      children: [/*#__PURE__*/_jsx(UISelect, Object.assign({}, countrySelectProps, {
        className: classNames('country-select', countrySelectProps.className),
        dropdownClassName: classNames('country-dropdown', countrySelectProps.dropdownClassName),
        onChange: this.handleFlagItemClick,
        options: this.getCountryDropDownList(selectedCountry.dialCode, validCountries, supportedCountrySet),
        value: selectedCountry.iso2,
        valueRenderer: this.buildValueRenderer(selectedCountry.iso2)
      })), /*#__PURE__*/_jsx(UITextInput, Object.assign({}, phoneInputProps, {
        className: classNames('phone-text-input', phoneInputProps.className),
        inputRef: this.numberInputRef,
        onChange: this.handlePhoneNumberInput,
        value: formattedNumber,
        type: "tel"
      })), this.renderExtension(extensionValue, extensionInputProps)]
    }));
  }
});