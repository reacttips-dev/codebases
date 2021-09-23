'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import { deref, watch, unwatch } from 'atom';
import omit from 'transmute/omit';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { isValidEmail } from 'customer-data-properties/validation/PropertyValidations';
import UITextInput from 'UIComponents/input/UITextInput';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import emptyFunction from 'react-utils/emptyFunction';
import { Seq } from 'immutable';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import { isResolved } from 'reference-resolvers/utils';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropertyInputEmailValidation from 'customer-data-properties/input/PropertyInputEmailValidation';
import debounce from 'transmute/debounce';
var propTypes = Object.assign({}, UITextInput.propTypes, {
  autoFocus: PropTypes.bool,
  onInvalidProperty: PropTypes.func.isRequired,
  propertyIndex: PropTypes.number,
  showError: PropTypes.bool,
  value: PropTypes.string,
  subject: PropTypes.instanceOf(ContactRecord),
  subjectId: PropTypes.string,
  resolver: ReferenceResolverType,
  className: PropTypes.string,
  size: PropTypes.object,
  suppressAlerts: PropTypes.bool
});
var defaultProps = Object.assign({}, UITextInput.defaultProps, {
  size: {
    xs: 12
  },
  className: 'p-x-0',
  wrapperClassName: 'p-left-0',
  onInvalidProperty: emptyFunction
});

var initialState = function initialState(initialValue) {
  return {
    contactReference: null,
    emailDraft: '',
    initialValue: initialValue ? initialValue.trim() : ''
  };
};

var PropertyInputEmail = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputEmail, _Component);

  function PropertyInputEmail(props) {
    var _this;

    _classCallCheck(this, PropertyInputEmail);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputEmail).call(this, props));

    _this.handleContactReferenceChange = function (contactReference) {
      _this.setState({
        contactReference: contactReference
      });
    };

    _this.state = initialState(props.value);
    _this.referenceAtom = null;
    _this.inputRef = /*#__PURE__*/createRef();
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.debounceHandleValidationChange = debounce(500, _this.handleValidationChange.bind(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(PropertyInputEmail, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.autoFocus) {
        this.focus();
      }
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(_ref) {
      var resolver = _ref.resolver,
          subjectId = _ref.subjectId,
          onInvalidProperty = _ref.onInvalidProperty,
          value = _ref.value,
          hasBlurred = _ref.hasBlurred;
      var propertyValue = value ? value.trim() : null;

      if (!value === this.props.value || !isValidEmail(propertyValue) || !value || !subjectId || !resolver) {
        return null;
      }

      this.unwatchReferenceAtom();
      this.referenceAtom = resolver.byId(propertyValue);
      watch(this.referenceAtom, this.handleContactReferenceChange);
      this.handleContactReferenceChange(deref(this.referenceAtom));
      var _this$state = this.state,
          contactReference = _this$state.contactReference,
          initialValue = _this$state.initialValue;

      if (isResolved(contactReference) && hasBlurred) {
        if (contactReference.referencedObject && "" + contactReference.referencedObject.get('vid') !== subjectId) {
          onInvalidProperty('duplicateValue', true);
          this.showAlert(value);
        } else {
          onInvalidProperty('duplicateValue', false);
        }
      }

      var subject = this.props.subject;

      if (subject) {
        var primaryEmail = getProperty(subject, 'email');
        var secondaryEmails = this.getSecondaryEmails();
        var hasDuplicateEmail = initialValue !== propertyValue && (propertyValue === primaryEmail || secondaryEmails.includes(propertyValue));
        onInvalidProperty('contactHasDuplicateEmail', hasDuplicateEmail);
      }

      return null;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unwatchReferenceAtom();
    }
  }, {
    key: "unwatchReferenceAtom",
    value: function unwatchReferenceAtom() {
      if (this.referenceAtom) {
        unwatch(this.referenceAtom, this.handleContactReferenceChange);
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      (this.props.inputRef || this.inputRef).current.focus();
      (this.props.inputRef || this.inputRef).current.select();
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var value = this.props.value;
      return value ? value.trim() : '';
    }
  }, {
    key: "getSecondaryEmails",
    value: function getSecondaryEmails() {
      var subject = this.props.subject;
      var additionalEmailsString = getProperty(subject, 'hs_additional_emails');

      if (subject && additionalEmailsString) {
        return additionalEmailsString.split(';').map(function (secondaryEmail) {
          return secondaryEmail.trim();
        });
      }

      return [];
    }
  }, {
    key: "hasNewValue",
    value: function hasNewValue() {
      var initialValue = this.state.initialValue;
      return initialValue !== this.getValue();
    }
  }, {
    key: "shouldShowError",
    value: function shouldShowError() {
      var _this$props = this.props,
          showError = _this$props.showError,
          hasBlurred = _this$props.hasBlurred,
          disabled = _this$props.disabled,
          readOnly = _this$props.readOnly;
      return showError && hasBlurred && !disabled && !readOnly;
    }
  }, {
    key: "showAlert",
    value: function showAlert(value) {
      if (this.props.suppressAlerts) {
        return null;
      }

      var baseUrl = this.props.baseUrl;
      var id = "nonunique-email-" + value;
      var message = 'profileSidebarModule.contactAlreadyExists';
      var options = {
        profileUrl: "" + baseUrl + value,
        email: value
      };
      return Alerts.addError(message, options, {
        id: id
      });
    }
  }, {
    key: "isUniqueEmail",
    value: function isUniqueEmail(record) {
      var subjectId = this.props.subjectId;

      if (record.referencedObject && "" + record.referencedObject.get('vid') !== subjectId) {
        return false;
      }

      return true;
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      this.props.onChange(event);
      this.debounceHandleValidationChange(event.target.value);
    }
  }, {
    key: "handleValidationChange",
    value: function handleValidationChange(value) {
      this.setState({
        emailDraft: value
      });

      if (!isValidEmail(value)) {
        this.props.onInvalidProperty('invalidEmail', true);
      } else {
        this.props.onInvalidProperty('invalidEmail', false);
      }
    }
  }, {
    key: "hasNonUniqueError",
    value: function hasNonUniqueError() {
      var contactReference = this.state.contactReference;

      if (!isResolved(contactReference) || this.isUniqueEmail(contactReference)) {
        return false;
      }

      return true;
    }
  }, {
    key: "hasValidationError",
    value: function hasValidationError() {
      var propertyValue = this.getValue();
      return propertyValue && !!propertyValue.length && !isValidEmail(propertyValue);
    }
  }, {
    key: "hasContactDuplicateEmailError",
    value: function hasContactDuplicateEmailError() {
      var subject = this.props.subject;
      var primaryEmail = getProperty(subject, 'email');
      var secondaryEmails = this.getSecondaryEmails();
      return this.hasNewValue() && (this.getValue() === primaryEmail || secondaryEmails.includes(this.getValue()));
    }
  }, {
    key: "renderValidationError",
    value: function renderValidationError() {
      if (!this.shouldShowError() || !this.hasValidationError()) {
        return null;
      }

      return /*#__PURE__*/_jsx("div", {
        className: "is--text--error p-top-2",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataProperties.PropertyInput.errorMessageInvalidEmail"
        })
      });
    }
  }, {
    key: "renderNonUniqueError",
    value: function renderNonUniqueError() {
      var _this$props2 = this.props,
          value = _this$props2.value,
          baseUrl = _this$props2.baseUrl,
          subjectId = _this$props2.subjectId,
          resolver = _this$props2.resolver;
      var propertyValue = this.getValue();

      if (this.hasValidationError() || !this.shouldShowError() || !value || !subjectId || !resolver || !this.hasNonUniqueError()) {
        return null;
      }

      return /*#__PURE__*/_jsx("div", {
        className: "is--text--error p-top-2",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataProperties.PropertyInput.errorMessageNonUniqueEmail",
          options: {
            email: propertyValue,
            profileUrl: "" + baseUrl + propertyValue
          }
        })
      });
    }
  }, {
    key: "renderContactHasDuplicateEmailError",
    value: function renderContactHasDuplicateEmailError() {
      var _this$props3 = this.props,
          subject = _this$props3.subject,
          subjectId = _this$props3.subjectId,
          value = _this$props3.value;

      if (this.hasValidationError() || !this.hasContactDuplicateEmailError() || !this.shouldShowError() || !subject || !subjectId || !value) {
        return null;
      }

      return /*#__PURE__*/_jsx("div", {
        className: "is--text--error p-top-2",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataProperties.PropertyInput.errorMessageContactHasEmail"
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          autoFocus = _this$props4.autoFocus,
          size = _this$props4.size,
          gdprError = _this$props4.gdprError,
          onInvalidProperty = _this$props4.onInvalidProperty;
      var transferableProps = omit(['actions', 'baseUrl', 'hasBlurred', 'handleBlur', 'handleFocus', 'isInline', 'objectType', 'onCancel', 'onInvalidProperty', 'property', 'propertyIndex', 'readOnlySourceData', 'resolver', 'showError', 'showPlaceholder', 'subjectId', 'secondaryChanges', 'onSecondaryChange', 'wrapperClassName', 'suppressAlerts', 'onTracking', 'isRequired', 'gdprError'], Seq(this.props)).toJS();
      return /*#__PURE__*/_jsxs(UIGridItem, {
        size: size,
        className: "p-x-0",
        children: [/*#__PURE__*/_jsx(UITextInput, Object.assign({}, transferableProps, {
          autoFocus: autoFocus,
          name: "textInput",
          value: this.getValue(),
          inputRef: this.props.inputRef || this.inputRef,
          onBlur: this.props.handleBlur,
          onChange: this.handleChange,
          onFocus: this.props.handleFocus,
          error: this.shouldShowError() && (this.props.gdprError || this.hasNonUniqueError() || this.hasValidationError() || this.hasContactDuplicateEmailError())
        })), this.renderValidationError(), this.renderNonUniqueError(), this.renderContactHasDuplicateEmailError(), onInvalidProperty !== emptyFunction && this.shouldShowError() ? /*#__PURE__*/_jsx(PropertyInputEmailValidation, {
          emailDraft: this.state.emailDraft,
          gdprError: gdprError,
          onInvalidProperty: onInvalidProperty
        }) : null]
      });
    }
  }]);

  return PropertyInputEmail;
}(Component);

export { PropertyInputEmail as default };
PropertyInputEmail.propTypes = propTypes;
PropertyInputEmail.defaultProps = defaultProps;