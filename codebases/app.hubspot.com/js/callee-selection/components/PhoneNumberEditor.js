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
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import SkeletonBox from 'conversations-skeleton-state/components/SkeletonBox';
import debounce from 'transmute/debounce';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import Small from 'UIComponents/elements/Small';
import UIBreakString from 'UIComponents/text/UIBreakString';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconButton from 'UIComponents/button/UIIconButton';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { getValue, getPropertyName, getRawNumber, getMetadata, getPhoneNumber, getExtension } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import UILink from 'UIComponents/link/UILink';
import styled from 'styled-components';
import PropertyInputPhone from './PropertyInputPhone';
import UIPricingPageRedirectButton from 'ui-addon-upgrades/button/UIPricingPageRedirectButton';
import { getInvalidPhoneNumberMessage } from 'calling-settings-ui-library/number-registration/utils/InvalidPhoneNumberMessage';
import { validateToPhoneNumber } from '../../callee-number-validation/actions/numberValidationActions';
var NumberRegionDropdownSkeleton = styled(SkeletonBox).withConfig({
  displayName: "PhoneNumberEditor__NumberRegionDropdownSkeleton",
  componentId: "qjmpe8-0"
})(["margin-right:2px;"]);

var CallingUpgradeButton = function CallingUpgradeButton(_ref) {
  var message = _ref.message,
      options = _ref.options,
      use = _ref.use,
      size = _ref.size;
  var upgradeData = {
    app: 'calling',
    screen: 'contact-record',
    upgradeProduct: 'sales-starter',
    uniqueId: 'geographic-calling-limit'
  };
  return /*#__PURE__*/_jsx(UIPricingPageRedirectButton, {
    upgradeData: upgradeData,
    size: size,
    use: use,
    children: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: message,
      options: options
    })
  });
};

var PhoneNumberEditor = /*#__PURE__*/function (_PureComponent) {
  _inherits(PhoneNumberEditor, _PureComponent);

  function PhoneNumberEditor(props) {
    var _this;

    _classCallCheck(this, PhoneNumberEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PhoneNumberEditor).call(this));

    _this.getCurrentValidation = function () {
      var _this$props = _this.props,
          callableNumber = _this$props.callableNumber,
          setIsValidatingNumber = _this$props.setIsValidatingNumber;
      var numberToUpdate = _this.state.numberToUpdate;
      var numberToValidate = numberToUpdate || callableNumber && getValue(callableNumber);

      if (numberToValidate) {
        setIsValidatingNumber(true);

        _this.confirmPhoneNumber(numberToValidate);
      }
    };

    _this.updateConfirmedPhoneNumber = function (_ref2) {
      var updatedToPhoneNumber = _ref2.updatedToPhoneNumber;
      var numberToUpdate = _this.state.numberToUpdate;
      var noNumbersToUpdate = !numberToUpdate || !updatedToPhoneNumber;

      if (noNumbersToUpdate || numberToUpdate === getRawNumber(updatedToPhoneNumber)) {
        _this.setState({
          numberToUpdate: updatedToPhoneNumber ? null : numberToUpdate,
          updatedToPhoneNumber: updatedToPhoneNumber,
          isValidatingInitialNumber: false
        }, function () {
          var isValid = _this.isValid();

          _this.props.onNumberChange({
            validatedNumber: updatedToPhoneNumber,
            isValid: isValid
          });

          if (noNumbersToUpdate) {
            _this.props.setIsValidatingNumber(false);
          }
        });
      }
    };

    _this.confirmPhoneNumber = function (phoneNumberString) {
      var callableNumber = _this.props.callableNumber;
      var propertyName = getPropertyName(callableNumber);
      var validPhoneNumberString = phoneNumberString || '';
      return validateToPhoneNumber(propertyName, validPhoneNumberString).then(function (updatedToPhoneNumber) {
        _this.updateConfirmedPhoneNumber({
          updatedToPhoneNumber: updatedToPhoneNumber
        });
      }).catch(function () {
        _this.updateConfirmedPhoneNumber({
          updatedToPhoneNumber: null
        });
      });
    };

    _this.confirmPhoneNumberDebounced = debounce(500, _this.confirmPhoneNumber);

    _this.handleValueChange = function (phoneNumber, extension) {
      var value;

      _this.props.setIsValidatingNumber(true);

      if (extension && extension.length) {
        value = phoneNumber + " ext " + extension;
      } else {
        value = phoneNumber;
      }

      _this.setState({
        numberToUpdate: value
      }, function () {
        _this.confirmPhoneNumberDebounced(value);
      });
    };

    _this.handleEditorClick = function (evt) {
      return evt.stopPropagation();
    };

    var isValidatingInitialNumber = props.callableNumber && getValue(props.callableNumber);
    _this.state = {
      numberToUpdate: null,
      updatedToPhoneNumber: null,
      isValidatingInitialNumber: isValidatingInitialNumber
    };
    return _this;
  }

  _createClass(PhoneNumberEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getCurrentValidation();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      var callableNumber = this.props.callableNumber;

      if (prevProps.callableNumber !== callableNumber) {
        if (callableNumber && getValue(callableNumber)) {
          this.setState({
            isValidatingInitialNumber: true,
            numberToUpdate: null
          }, function () {
            _this2.getCurrentValidation();
          });
        } else {
          this.setState({
            updatedToPhoneNumber: null,
            numberToUpdate: null
          });
        }
      }
    }
  }, {
    key: "getPhoneValue",
    value: function getPhoneValue() {
      var toPhoneNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.updatedToPhoneNumber;

      if (!toPhoneNumber) {
        return null;
      }

      var extension = toPhoneNumber.get('extension');
      var phoneNumber = toPhoneNumber.get('formattedNumber');

      if (toPhoneNumber.get('isValid') === false) {
        return toPhoneNumber.get('rawNumber');
      }

      if (extension && extension.length) {
        return phoneNumber + " ext " + extension;
      }

      return phoneNumber;
    }
  }, {
    key: "isValid",
    value: function isValid() {
      var _this$props2 = this.props,
          isSalesEnterpriseTrial = _this$props2.isSalesEnterpriseTrial,
          isFreeUser = _this$props2.isFreeUser,
          callableNumber = _this$props2.callableNumber,
          isEditing = _this$props2.isEditing;
      var propertyName = getPropertyName(callableNumber);
      var updatedToPhoneNumber = this.state.updatedToPhoneNumber;

      if (!updatedToPhoneNumber || !propertyName) {
        return false;
      }

      var isInputValueUnchanged = isEditing && this.getPhoneValue() === getValue(callableNumber);

      if (isInputValueUnchanged) {
        return false;
      }

      var isInvalid = !!getInvalidPhoneNumberMessage({
        validatedToNumber: updatedToPhoneNumber,
        ignoreGeoValidation: true,
        isRegisteringNumber: true,
        isInSalesEnterpriseTrial: isSalesEnterpriseTrial,
        isPaidHub: isFreeUser
      });

      if (isInvalid) {
        return false;
      }

      return true;
    }
  }, {
    key: "getInvalidNumberErrorMessage",
    value: function getInvalidNumberErrorMessage() {
      var _this$props3 = this.props,
          isSalesEnterpriseTrial = _this$props3.isSalesEnterpriseTrial,
          isFreeUser = _this$props3.isFreeUser,
          isValidatingNumber = _this$props3.isValidatingNumber;
      var phoneValueFromState = this.getPhoneValue();

      if (isValidatingNumber) {
        return null;
      }

      if (!phoneValueFromState) {
        return /*#__PURE__*/_jsx(UIBreakString, {
          className: "m-top-1 display-block property-error-message",
          children: /*#__PURE__*/_jsx(Small, {
            use: "error",
            children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
              message: "callee-selection.phoneNumberErrors.couldNotValidate_jsx",
              options: {
                onClick: this.getCurrentValidation
              },
              elements: {
                UILink: UILink
              }
            })
          })
        });
      }

      var updatedToPhoneNumber = this.state.updatedToPhoneNumber;
      var messageType = getInvalidPhoneNumberMessage({
        validatedToNumber: updatedToPhoneNumber,
        ignoreGeoValidation: true,
        isRegisteringNumber: true,
        isInSalesEnterpriseTrial: isSalesEnterpriseTrial,
        isPaidHub: isFreeUser
      });

      if (messageType) {
        var options = {
          learnMoreLink: this.renderLearnMoreLink(),
          salesProLink: this.renderUpgradeLink()
        };
        var message = "callee-selection.phoneNumberErrors." + messageType + ".addProperty";
        return /*#__PURE__*/_jsx(UIBreakString, {
          className: "m-top-1 display-block add-property-error-message",
          children: /*#__PURE__*/_jsx(Small, {
            use: "error",
            children: /*#__PURE__*/_jsx(FormattedReactMessage, {
              message: message,
              options: options
            })
          })
        });
      }

      return null;
    }
  }, {
    key: "renderUpgradeLink",
    value: function renderUpgradeLink() {
      return /*#__PURE__*/_jsx(CallingUpgradeButton, {
        message: "callee-selection.salesProCTA",
        use: "link"
      });
    }
  }, {
    key: "renderLearnMoreLink",
    value: function renderLearnMoreLink() {
      var url = 'https://knowledge.hubspot.com/articles/kcs_article/calling/what-countries-are-supported-by-calling';
      return /*#__PURE__*/_jsx(KnowledgeBaseButton, {
        url: url
      });
    }
  }, {
    key: "renderSkeletonState",
    value: function renderSkeletonState() {
      return /*#__PURE__*/_jsxs("div", {
        className: "display-flex",
        children: [/*#__PURE__*/_jsx(NumberRegionDropdownSkeleton, {
          height: 40,
          width: 60
        }), /*#__PURE__*/_jsx(SkeletonBox, {
          height: 40,
          width: 189,
          className: "m-right-2"
        }), /*#__PURE__*/_jsx(SkeletonBox, {
          height: 40,
          width: 100
        })]
      });
    }
  }, {
    key: "renderDeleteButton",
    value: function renderDeleteButton() {
      var _this$props4 = this.props,
          isEditing = _this$props4.isEditing,
          onDeleteNumber = _this$props4.onDeleteNumber,
          isAsyncUpdatesStarted = _this$props4.isAsyncUpdatesStarted;

      if (!isEditing) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIIconButton, {
        "data-selenium-test": "phone-number-delete-button",
        tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callee-selection.phoneNumbers.delete"
        }),
        disabled: isAsyncUpdatesStarted,
        placement: "left",
        use: "transparent",
        onClick: onDeleteNumber,
        children: /*#__PURE__*/_jsx(UIIcon, {
          name: "delete"
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          updatedToPhoneNumber = _this$state.updatedToPhoneNumber,
          isValidatingInitialNumber = _this$state.isValidatingInitialNumber;
      var _this$props5 = this.props,
          disabled = _this$props5.disabled,
          callableNumber = _this$props5.callableNumber,
          isAsyncUpdatesStarted = _this$props5.isAsyncUpdatesStarted,
          isEditing = _this$props5.isEditing;
      var propertyName = getPropertyName(callableNumber);
      var phoneNumber = '';
      var extension = '';
      if (isValidatingInitialNumber) return this.renderSkeletonState();

      if (updatedToPhoneNumber) {
        var isValid = updatedToPhoneNumber.get('isValid');
        phoneNumber = !isValid ? updatedToPhoneNumber.get('rawNumber') : updatedToPhoneNumber.get('formattedNumber');
        var numberExtension = updatedToPhoneNumber.get('extension') || '';
        extension = isValid ? numberExtension : '';
      } else if (isEditing) {
        var phoneNumberMetaData = getMetadata(callableNumber);
        phoneNumber = getPhoneNumber(phoneNumberMetaData);
        extension = getExtension(phoneNumberMetaData);
      }

      return /*#__PURE__*/_jsx("div", {
        onClick: this.handleEditorClick,
        className: "flex-row width-100",
        children: /*#__PURE__*/_jsxs("div", {
          className: "align-start",
          children: [/*#__PURE__*/_jsx(PropertyInputPhone, {
            propertyName: propertyName,
            disabled: disabled || isAsyncUpdatesStarted,
            onChange: this.handleValueChange,
            phoneNumber: phoneNumber,
            extension: extension,
            errorMessage: this.getInvalidNumberErrorMessage()
          }), this.renderDeleteButton()]
        })
      });
    }
  }]);

  return PhoneNumberEditor;
}(PureComponent);

PhoneNumberEditor.propTypes = {
  disabled: PropTypes.bool,
  onNumberChange: PropTypes.func.isRequired,
  onDeleteNumber: PropTypes.func.isRequired,
  callableNumber: RecordPropType('PhoneNumberProperty').isRequired,
  isSalesEnterpriseTrial: PropTypes.bool,
  isFreeUser: PropTypes.bool,
  isEditing: PropTypes.bool,
  isAsyncUpdatesStarted: PropTypes.bool.isRequired,
  setIsValidatingNumber: PropTypes.func.isRequired,
  isValidatingNumber: PropTypes.bool.isRequired
};
export default PhoneNumberEditor;