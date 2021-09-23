'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as Inputs from './PropertyInputs';
import PropertyInputPhone from './PropertyInputPhone';
import Small from 'UIComponents/elements/Small';
import UIEditableControls from 'UIComponents/editable/UIEditableControls';
import UIForm from 'UIComponents/form/UIForm';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import ValidatedNumber from './phone/records/ValidatedNumber';
import UIBreakString from 'UIComponents/text/UIBreakString';
import debounce from 'transmute/debounce';
import getIn from 'transmute/getIn';
import memoize from 'transmute/memoize';
import partial from 'transmute/partial';
import { EERIE } from 'HubStyleTokens/colors';
import { Map as ImmutableMap } from 'immutable';
import { validatePhoneNumberApi } from './phone/clients/validatePhoneNumberClient';
import { callingAPIMethodWithQueue } from './phone/utils/hsCallingUtils';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { AnyCrmObjectPropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import UIPopoverCloseButton from 'UIComponents/tooltip/UIPopoverCloseButton';
var getPropertyName = getIn(['name']);

function validateToPhoneNumber(propertyName, phoneNumberString) {
  var numAttempts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return validatePhoneNumberApi(propertyName, phoneNumberString).then(function (res) {
    return ValidatedNumber.fromJS(res);
  }).catch(function (error) {
    if (!numAttempts) {
      return validateToPhoneNumber(propertyName, phoneNumberString, numAttempts + 1);
    }

    throw error;
  });
}

var PropertyInputPhoneWrapper = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputPhoneWrapper, _PureComponent);

  function PropertyInputPhoneWrapper(props, context) {
    var _this;

    _classCallCheck(this, PropertyInputPhoneWrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputPhoneWrapper).call(this, props, context));

    _this.confirmPhoneNumber = function (phoneNumberString) {
      var property = _this.props.property;
      var propertyName = getPropertyName(property);
      var validPhoneNumberString = phoneNumberString || '';
      return validateToPhoneNumber(propertyName, validPhoneNumberString).then(_this.handleValidationSuccess).catch(_this.handleValidationError).done();
    };

    _this.confirmPhoneNumberDebounced = debounce(500, _this.confirmPhoneNumber);

    _this.handleValidationSuccess = function (validatedNumber) {
      _this.setState({
        updatedToPhoneNumber: validatedNumber,
        validationFailed: false,
        isPhoneNumberValidated: true,
        isValidatingNumber: false
      });
    };

    _this.handleValidationError = function () {
      _this.setState({
        validationFailed: true,
        isValidatingNumber: false
      });
    };

    _this.handlePhoneNumberUpdateFromIframe = function (data) {
      var _this$props = _this.props,
          property = _this$props.property,
          subjectId = _this$props.subjectId,
          objectType = _this$props.objectType;
      var propertyName = getPropertyName(property);
      var objectTypeId = ObjectTypesToIds[objectType] || objectType;
      var shouldUpdateInput = data.property === propertyName && Number(data.objectId) === Number(subjectId) && data.objectTypeId === objectTypeId;

      if (shouldUpdateInput) {
        validateToPhoneNumber(propertyName, data.rawValue).then(_this.handleValidationSuccess).catch(_this.handleValidationError).done();
      }
    };

    _this.handleValueChange = function (phoneNumber, extension) {
      var value;

      if (extension && extension.length) {
        value = phoneNumber + " ext " + extension;
      } else {
        value = phoneNumber;
      }

      _this.setState({
        isValidatingNumber: true
      });

      _this.confirmPhoneNumberDebounced(value);
    };

    _this.handleDelete = function () {
      var _this$props2 = _this.props,
          subject = _this$props2.subject,
          actions = _this$props2.actions,
          subjectId = _this$props2.subjectId,
          objectType = _this$props2.objectType,
          property = _this$props2.property;
      var propertyName = getPropertyName(property);
      actions.updatePropertiesAction(subject, ImmutableMap(_defineProperty({}, propertyName, '')));

      _this.setState({
        open: false,
        updatedToPhoneNumber: '',
        validationFailed: false,
        isPhoneNumberValidated: false
      });

      if (window.hsCalling && window.hsCalling.updateCalleeNumber) {
        var objectTypeId = ObjectTypesToIds[objectType] || objectType;
        window.hsCalling.updateCalleeNumber({
          objectId: Number(subjectId),
          objectTypeId: objectTypeId,
          rawValue: '',
          property: propertyName
        });
      }
    };

    _this.focus = function () {
      var open = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var _this$props3 = _this.props,
          value = _this$props3.value,
          property = _this$props3.property,
          readOnly = _this$props3.readOnly,
          disabled = _this$props3.disabled;

      if (readOnly || disabled) {
        return;
      }

      var phoneNumberString = value;
      var propertyName = getPropertyName(property);

      if (!_this.state.isPhoneNumberValidated && value) {
        validateToPhoneNumber(propertyName, phoneNumberString).then(_this.handleValidationSuccess).catch(_this.handleValidationError).done();
      }

      _this.setState({
        open: open
      });
    };

    _this.onSave = function () {
      var updatedToPhoneNumber = _this.state.updatedToPhoneNumber;
      var _this$props4 = _this.props,
          subject = _this$props4.subject,
          actions = _this$props4.actions,
          property = _this$props4.property;
      var propertyName = getPropertyName(property);
      var updatedNumber = updatedToPhoneNumber.toNumberString;
      actions.updatePropertiesAction(subject, ImmutableMap(_defineProperty({}, propertyName, updatedNumber)));

      if (window.hsCalling && window.hsCalling.updateCalleeNumber) {
        // We need to wait for the value to change from props because
        // there isnt a promised based mechanism to wait on.
        _this.setState({
          sendMessageToIframe: true
        });
      }

      _this.setState({
        open: false
      });
    };

    _this.onCancel = function () {
      _this.setState({
        open: false,
        updatedToPhoneNumber: null,
        isPhoneNumberValidated: false,
        validationFailed: false
      });
    };

    _this.partial = memoize(partial);
    _this.state = {
      isPhoneNumberValidated: false,
      open: false,
      validationFailed: false,
      updatedToPhoneNumber: null,
      isValidatingNumber: false
    };
    return _this;
  }

  _createClass(PropertyInputPhoneWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Listens for changes from calling iframe
      callingAPIMethodWithQueue('addEventListener', {
        event: 'UPDATE_CALLEE_PHONE_NUMBER',
        callback: this.handlePhoneNumberUpdateFromIframe
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props5 = this.props,
          value = _this$props5.value,
          objectType = _this$props5.objectType,
          subjectId = _this$props5.subjectId,
          property = _this$props5.property;

      if (prevProps.value !== value && this.state.sendMessageToIframe) {
        this.setState({
          sendMessageToIframe: false
        });
        var objectTypeId = ObjectTypesToIds[objectType] || objectType;
        window.hsCalling.updateCalleeNumber({
          objectId: Number(subjectId),
          objectTypeId: objectTypeId,
          rawValue: value,
          property: getPropertyName(property)
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      callingAPIMethodWithQueue('addEventListener', {
        event: 'UPDATE_CALLEE_PHONE_NUMBER',
        callback: this.handlePhoneNumberUpdateFromIframe
      });
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
      var value = this.props.value;
      var updatedToPhoneNumber = this.state.updatedToPhoneNumber;

      if (!updatedToPhoneNumber) {
        return false;
      }

      var hasInputValueChanged = value !== updatedToPhoneNumber.toNumberString;

      if (!hasInputValueChanged) {
        return false;
      }

      if (!updatedToPhoneNumber.isValid) {
        return false;
      }

      return true;
    }
  }, {
    key: "renderErrorMessage",
    value: function renderErrorMessage() {
      var _this$state = this.state,
          updatedToPhoneNumber = _this$state.updatedToPhoneNumber,
          validationFailed = _this$state.validationFailed,
          isValidatingNumber = _this$state.isValidatingNumber;

      if (!isValidatingNumber && updatedToPhoneNumber && !updatedToPhoneNumber.isValid) {
        return /*#__PURE__*/_jsx(UIBreakString, {
          className: "m-top-1 display-block add-property-error-message",
          children: /*#__PURE__*/_jsx(Small, {
            use: "error",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataProperties.PropertyInputPhone.phoneNumberErrors.numberInvalid"
            })
          })
        });
      }

      if (validationFailed) {
        return /*#__PURE__*/_jsx(UIBreakString, {
          className: "m-top-1 display-block add-property-error-message",
          children: /*#__PURE__*/_jsx(Small, {
            use: "error",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataProperties.PropertyInputPhone.phoneNumberErrors.validationFailed"
            })
          })
        });
      }

      return null;
    }
  }, {
    key: "renderPopoverBody",
    value: function renderPopoverBody() {
      var _this$props6 = this.props,
          disabled = _this$props6.disabled,
          value = _this$props6.value;
      var _this$state2 = this.state,
          updatedToPhoneNumber = _this$state2.updatedToPhoneNumber,
          isValidatingNumber = _this$state2.isValidatingNumber;
      var phoneNumber = '';
      var extension = '';

      if (updatedToPhoneNumber) {
        phoneNumber = updatedToPhoneNumber.get('isValid') === false ? updatedToPhoneNumber.get('rawNumber') : updatedToPhoneNumber.get('formattedNumber');
        extension = updatedToPhoneNumber.get('extension') || '';
      } else if (value) {
        phoneNumber = value.split('ext')[0];
        extension = value.split('ext')[1] || '';
      }

      var saveDisabled = !this.isValid() || isValidatingNumber;
      return /*#__PURE__*/_jsxs(UIForm, {
        className: "m-top-0",
        children: [/*#__PURE__*/_jsxs(UIGrid, {
          children: [/*#__PURE__*/_jsx(UIGridItem, {
            size: {
              xs: 10
            },
            className: "p-left-4",
            children: /*#__PURE__*/_jsx(UIFormLabel, {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "customerDataProperties.PropertyInputPhone.label"
              })
            })
          }), /*#__PURE__*/_jsx(UIGridItem, {
            size: {
              xs: 2
            },
            className: "justify-end",
            children: /*#__PURE__*/_jsx(UIPopoverCloseButton, {
              color: EERIE,
              onClick: this.onCancel
            })
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "overflow-y-auto overflow-x-hidden p-x-4 p-bottom-4",
          children: /*#__PURE__*/_jsx(UIGrid, {
            children: /*#__PURE__*/_jsx(UIGridItem, {
              size: {
                xs: 12
              },
              className: "p-left-0 p-right-0",
              children: /*#__PURE__*/_jsx(UIEditableControls, {
                className: "m-bottom-1",
                onCancel: this.onCancel,
                onSave: this.onSave,
                saveDisabled: saveDisabled,
                use: "flush",
                "data-selenium-test": "property-sidebar-phone-number-save-controls",
                children: /*#__PURE__*/_jsx("div", {
                  className: "display-inline-flex p-bottom-2",
                  children: /*#__PURE__*/_jsx(PropertyInputPhone, {
                    disabled: disabled,
                    onChange: this.handleValueChange,
                    phoneNumber: phoneNumber,
                    extension: extension,
                    errorMessage: this.renderErrorMessage(),
                    showDelete: Boolean(this.props.value),
                    onDelete: this.handleDelete
                  })
                })
              })
            })
          })
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var value = this.props.value;
      var _this$state3 = this.state,
          open = _this$state3.open,
          updatedToPhoneNumber = _this$state3.updatedToPhoneNumber;
      var valueToRender = updatedToPhoneNumber ? updatedToPhoneNumber.toNumberString : value;

      if (!valueToRender) {
        valueToRender = '';
      }

      return /*#__PURE__*/_jsx(UIGridItem, {
        size: {
          xs: 12
        },
        className: "p-x-0",
        children: /*#__PURE__*/_jsx(UIPopover, {
          open: open,
          closeOnOutsideClick: true,
          content: {
            body: this.renderPopoverBody()
          },
          className: "p-bottom-4",
          placement: "right",
          autoPlacement: "horiz",
          children: /*#__PURE__*/_jsx("div", {
            onClick: this.partial(this.focus, !open),
            children: /*#__PURE__*/_jsx(Inputs.PropertyInputExpandableText, Object.assign({}, this.props, {
              value: valueToRender,
              readOnly: true
            }))
          })
        })
      });
    }
  }]);

  return PropertyInputPhoneWrapper;
}(PureComponent);

PropertyInputPhoneWrapper.propTypes = {
  value: PropTypes.string,
  subjectId: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired,
  subject: PropTypes.oneOfType([AnyCrmObjectPropType, PropTypes.instanceOf(ImmutableMap)]),
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  actions: PropTypes.object.isRequired
};
export default PropertyInputPhoneWrapper;