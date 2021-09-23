'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import H7 from 'UIComponents/elements/headings/H7';
import UIButton from 'UIComponents/button/UIButton';
import UIEditableControls from 'UIComponents/editable/UIEditableControls';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import { isValidEmail } from 'customer-data-properties/validation/PropertyValidations';
import PropertyInputEmailWrapper from 'customer-data-properties/input/PropertyInputEmailWrapper';
var propTypes = {
  draftEmails: ImmutablePropTypes.map.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  promoteToPrimary: PropTypes.func.isRequired,
  propertyInputEmailDefaultProps: PropTypes.object.isRequired,
  resolver: ReferenceResolverType.isRequired,
  subject: PropTypes.instanceOf(ContactRecord).isRequired,
  value: PropTypes.string.isRequired,
  'data-selenium-test': PropTypes.string
};

var PropertyInputMultipleEmailInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputMultipleEmailInput, _PureComponent);

  function PropertyInputMultipleEmailInput(props) {
    var _this;

    _classCallCheck(this, PropertyInputMultipleEmailInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputMultipleEmailInput).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleOpenChange = function (_ref) {
      var value = _ref.target.value;

      _this.setState({
        isInputFocused: value
      });
    };

    _this.handleInvalidProperty = function (key, value) {
      _this.setState(_defineProperty({}, key, value));
    };

    _this.isSaveDisabled = function (emailInfo) {
      var value = emailInfo.value,
          contactHasDuplicateEmail = emailInfo.contactHasDuplicateEmail,
          draftValue = emailInfo.draftValue,
          duplicateValue = emailInfo.duplicateValue,
          gdprError = emailInfo.gdprError;
      return value === draftValue || !draftValue || !draftValue.length || !isValidEmail(draftValue) || contactHasDuplicateEmail || duplicateValue || gdprError;
    };

    _this.renderPrimaryButton = function () {
      var _this$props = _this.props,
          value = _this$props.value,
          promoteToPrimary = _this$props.promoteToPrimary;

      if (_this.getIsPrimaryEmail()) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIButton, {
        className: "m-left-0",
        use: "transparent",
        size: "small",
        onClick: _this.partial(promoteToPrimary, value),
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataProperties.PropertyInput.makePrimary"
        })
      });
    };

    _this.renderDeleteButton = function () {
      var _this$props2 = _this.props,
          value = _this$props2.value,
          onDelete = _this$props2.onDelete,
          draftEmails = _this$props2.draftEmails; // primary should be deletable when it is the only email

      var isOnlyEmail = draftEmails.size === 1;
      return /*#__PURE__*/_jsx(UIButton, {
        use: "transparent",
        size: "small",
        onClick: _this.partial(onDelete, value),
        disabled: _this.getIsPrimaryEmail() && !isOnlyEmail,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataProperties.PropertyInput.delete"
        })
      });
    };

    _this.renderDeleteButtonWrapper = function () {
      var draftEmails = _this.props.draftEmails;
      var isOnlyEmail = draftEmails.size === 1;

      if (_this.getIsPrimaryEmail() && !isOnlyEmail) {
        return /*#__PURE__*/_jsx(UITooltip, {
          placement: "top",
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataProperties.PropertyInputMultipleEmail.primaryEmailDelete"
          }),
          children: _this.renderDeleteButton()
        });
      }

      return _this.renderDeleteButton();
    };

    _this.partial = memoize(partial);
    _this.state = {
      isInputFocused: false,
      initialValue: props.value,
      contactHasDuplicateEmail: false,
      duplicateValue: false,
      gdprError: false
    };
    return _this;
  }

  _createClass(PropertyInputMultipleEmailInput, [{
    key: "getDraftValue",
    value: function getDraftValue(email) {
      var draftEmails = this.props.draftEmails;

      if (draftEmails.has(email)) {
        return draftEmails.getIn([email, 'value']);
      }

      return email;
    }
  }, {
    key: "getIsPrimaryEmail",
    value: function getIsPrimaryEmail() {
      var _this$props3 = this.props,
          draftEmails = _this$props3.draftEmails,
          value = _this$props3.value;
      return draftEmails.get(value).get('isPrimary');
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props4 = this.props,
          draftEmails = _this$props4.draftEmails,
          onCancel = _this$props4.onCancel,
          onSave = _this$props4.onSave,
          propertyInputEmailDefaultProps = _this$props4.propertyInputEmailDefaultProps,
          resolver = _this$props4.resolver,
          subject = _this$props4.subject,
          value = _this$props4.value;
      var _this$state = this.state,
          contactHasDuplicateEmail = _this$state.contactHasDuplicateEmail,
          duplicateValue = _this$state.duplicateValue,
          gdprError = _this$state.gdprError;
      var draftValue = this.getDraftValue(value);
      var isNewEmail = draftEmails.get(value).get('isNewEmail');
      var isSaveDisabled = this.isSaveDisabled({
        value: value,
        contactHasDuplicateEmail: contactHasDuplicateEmail,
        draftValue: draftValue,
        duplicateValue: duplicateValue,
        gdprError: gdprError
      });
      var isEditable = !(propertyInputEmailDefaultProps.readOnly || propertyInputEmailDefaultProps.disabled);

      var control = /*#__PURE__*/_jsx(UIFormControl, {
        children: /*#__PURE__*/_jsx(PropertyInputEmailWrapper, Object.assign({
          autoFocus: isNewEmail,
          className: "p-x-2 m-bottom-2",
          gdprError: gdprError,
          onChange: function onChange(event) {
            _this2.props.onChange(_this2.props.value, event.target.value.trim());
          },
          onInvalidProperty: this.handleInvalidProperty,
          resolver: resolver,
          subject: subject,
          suppressAlerts: true,
          value: draftValue
        }, propertyInputEmailDefaultProps, {
          "data-selenium-test": this.props['data-selenium-test']
        }))
      });

      return /*#__PURE__*/_jsxs(UIGrid, {
        children: [this.getIsPrimaryEmail() && /*#__PURE__*/_jsx(UIGridItem, {
          size: {
            xs: 12
          },
          className: "m-top-4",
          children: /*#__PURE__*/_jsx(H7, {
            className: "m-bottom-0",
            "data-selenium-test": "email-input-primary-heading",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataProperties.PropertyInputMultipleEmail.primaryHeading"
            })
          })
        }), /*#__PURE__*/_jsx(UIGridItem, {
          size: {
            xs: 7
          },
          className: "p-right-2",
          children: isEditable ? /*#__PURE__*/_jsx(UIEditableControls, {
            className: "m-bottom-1",
            onCancel: this.partial(onCancel, value),
            onOpenChange: this.handleOpenChange,
            onSave: this.partial(onSave, value),
            saveDisabled: isSaveDisabled,
            use: "flush",
            children: control
          }) : /*#__PURE__*/_jsx("div", {
            className: "m-top-3 m-bottom-1",
            children: control
          })
        }), !isNewEmail && isEditable && /*#__PURE__*/_jsxs("div", {
          className: "align-start m-top-4 m-bottom-1 p-left-0 p-right-2",
          children: [this.renderDeleteButtonWrapper(), this.renderPrimaryButton()]
        })]
      });
    }
  }]);

  return PropertyInputMultipleEmailInput;
}(PureComponent);

export { PropertyInputMultipleEmailInput as default };
PropertyInputMultipleEmailInput.propTypes = propTypes;