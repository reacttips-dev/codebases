'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import I18n from 'I18n';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { LOADING, isEmpty } from 'crm_data/flux/LoadingStatus';
import ObjectCreatorDialog from '../../../modals/dialogs/objectModifiers/ObjectCreatorDialog';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import MatchingContact from './MatchingContact';
import Popoverable from '../../../components/popovers/Popoverable';
import { Map as ImmutableMap, List } from 'immutable';
import { isValidEmail as _isValidEmail, isValidRequiredProperties } from 'customer-data-properties/validation/PropertyValidations';
import canCreate from '../../../utils/canCreate';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import { ALERT_FONT_SIZE } from 'HubStyleTokens/sizes';
import { EMAIL_VALIDATION_CONSTANTS } from 'crm_data/properties/PropertyValidationAPI';
var INITIAL_REQUIRED_CONTACT_PROPERTIES = ['email', 'firstname', 'lastname'];
var INITIAL_CONTACT_PROPERTIES = ['email'];
var GDPR_BLOCKLISTED_EMAIL_ARTICLE_URL = 'https://knowledge.hubspot.com/contacts/how-do-i-perform-a-gdpr-compliant-delete-in-hubspot';
var GDPR_BLOCKLISTED_MESSAGE = EMAIL_VALIDATION_CONSTANTS.GDPR_BLOCKLISTED_MESSAGE,
    CONTACT_ALREADY_EXISTS = EMAIL_VALIDATION_CONSTANTS.CONTACT_ALREADY_EXISTS,
    INVALID_EMAIL = EMAIL_VALIDATION_CONSTANTS.INVALID_EMAIL;
var EmailValidationError = styled.div.withConfig({
  displayName: "ContactCreatorDialog__EmailValidationError",
  componentId: "sc-1rynxc1-0"
})(["font-size:", ";"], ALERT_FONT_SIZE);

var ContactCreatorDialog = /*#__PURE__*/function (_PureComponent) {
  _inherits(ContactCreatorDialog, _PureComponent);

  function ContactCreatorDialog() {
    var _this;

    _classCallCheck(this, ContactCreatorDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContactCreatorDialog).call(this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(ContactCreatorDialog, [{
    key: "getDisabledTooltip",
    value: function getDisabledTooltip() {
      if (this.getMatchingContactEmail()) {
        return null;
      }

      if (!this.isValidRequiredProps()) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "objectCreator.createContactModal.disabledTooltip.missingRequired"
        });
      }

      return null;
    }
  }, {
    key: "getMatchingContactEmail",
    value: function getMatchingContactEmail() {
      var emailValidationError = this.props.emailValidationError;

      if (emailValidationError && emailValidationError.get('error') === CONTACT_ALREADY_EXISTS) {
        return emailValidationError.get('value');
      }

      return null;
    }
  }, {
    key: "getValidationErrors",
    value: function getValidationErrors() {
      var emailValidationError = this.props.emailValidationError;

      if (!emailValidationError || emailValidationError.get('error') !== INVALID_EMAIL) {
        return ImmutableMap();
      }

      return ImmutableMap({
        email: this.renderEmailValidationError()
      });
    }
  }, {
    key: "getHiddenFieldsLabel",
    value: function getHiddenFieldsLabel() {
      if (this.getMatchingContactEmail()) {
        return null;
      }

      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "objectCreator.createContactModal.hiddenFieldsLabel"
      });
    }
  }, {
    key: "isValidRequiredProps",
    value: function isValidRequiredProps() {
      return this.props.properties === LOADING ? false : isValidRequiredProperties(this.props.requiredProps, this.props.propertyValues, this.props.properties);
    }
  }, {
    key: "isValidEmail",
    value: function isValidEmail() {
      var propertyEmailValue = this.props.propertyValues.get('email');
      var email = propertyEmailValue && propertyEmailValue.trim();
      var isEmptyEmail = !email || !email.trim();
      return _isValidEmail(email) || isEmptyEmail;
    }
  }, {
    key: "hasContactInformation",
    value: function hasContactInformation() {
      var _this$props = this.props,
          propertyValues = _this$props.propertyValues,
          emailValidationError = _this$props.emailValidationError;
      return INITIAL_REQUIRED_CONTACT_PROPERTIES.some(function (property) {
        var value = propertyValues.get(property);

        if (property === 'email') {
          return _isValidEmail(value) && // isValidEmail only uses regex to check email validity but does so instantly where the emailValidationError prop checks the API to see if an email is valid
          // i.e. test@hubspot.con would pass the regex but fail the API validation
          !emailValidationError;
        }

        return !!value;
      });
    }
  }, {
    key: "isConfirmDisabled",
    value: function isConfirmDisabled() {
      if (!canCreate(CONTACT) || !isEmpty(this.props.emailValidationError) || !this.hasContactInformation() || !this.isValidEmail() || !this.isValidRequiredProps()) {
        return true;
      }

      return false;
    }
  }, {
    key: "renderEmailValidationError",
    value: function renderEmailValidationError() {
      if (this.props.emailValidationError.get('message') === GDPR_BLOCKLISTED_MESSAGE) {
        var knowledgeBaseLink = /*#__PURE__*/_jsx(KnowledgeBaseButton, {
          url: GDPR_BLOCKLISTED_EMAIL_ARTICLE_URL
        });

        return /*#__PURE__*/_jsx(EmailValidationError, {
          children: /*#__PURE__*/_jsx(FormattedReactMessage, {
            message: "objectCreator.createContactModal.validationErrors.emailGDPRDeleted",
            options: {
              knowledgeBaseLink: knowledgeBaseLink
            },
            "data-selenium-test": "contact-email-blacklisted-error"
          })
        });
      }

      return /*#__PURE__*/_jsx(EmailValidationError, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "objectCreator.createContactModal.validationErrors.invalidEmail",
          "data-selenium-test": "contact-email-invalid-error"
        })
      });
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      return I18n.text('objectCreator.createContactModal.modalHeader');
    }
  }, {
    key: "renderConfirmAndAddButton",
    value: function renderConfirmAndAddButton(isConfirmDisabled) {
      if (!this.props.shouldRenderConfirmAndAddButton) {
        return null;
      }

      var handleClick = this.partial(this.props.onConfirm, {
        addNew: true
      });
      var disabledTooltip = this.getDisabledTooltip();
      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !isConfirmDisabled || !disabledTooltip,
        title: disabledTooltip,
        children: /*#__PURE__*/_jsx(UILoadingButton, {
          onClick: handleClick,
          className: "pull-right",
          use: "secondary",
          disabled: isConfirmDisabled,
          duration: 1000,
          "data-selenium-test": "create-add-another-contact-button",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "objectCreator.createContactModal.addButtonLabel.createAndNewUnique"
          })
        })
      });
    }
  }, {
    key: "renderLoadingAnimation",
    value: function renderLoadingAnimation() {
      if (!this.props.showLoadingAnimation) {
        return null;
      }

      return /*#__PURE__*/_jsx(UILoadingSpinner, {
        className: "m-y-4",
        grow: true
      });
    }
  }, {
    key: "renderSuggestions",
    value: function renderSuggestions() {
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [this.renderLoadingAnimation(), /*#__PURE__*/_jsx(MatchingContact, {
          matchingContactEmail: this.getMatchingContactEmail(),
          onReject: this.props.onReject,
          showLoadingAnimation: this.props.showLoadingAnimation
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var isConfirmDisabled = this.isConfirmDisabled();
      return /*#__PURE__*/_jsx(ObjectCreatorDialog, {
        confirmDisabled: isConfirmDisabled,
        confirmDisabledTooltip: this.getDisabledTooltip(),
        confirmLabel: I18n.text('objectCreator.createContactModal.addButtonLabel.createUnique'),
        embedded: this.props.embedded,
        extraFields: this.props.extraFields,
        onChange: this.props.handleChange,
        hiddenFieldsLabel: this.getHiddenFieldsLabel(),
        ignoreDefaultCreatorProperties: this.props.ignoreDefaultCreatorProperties,
        initialProperties: INITIAL_CONTACT_PROPERTIES,
        moreButtons: this.renderConfirmAndAddButton(isConfirmDisabled),
        objectType: CONTACT,
        onConfirm: this.props.onConfirm,
        onOpenComplete: this.setIsDialogOpen,
        onReject: this.props.onReject,
        properties: this.props.properties,
        propertyValues: this.props.propertyValues,
        additionalRequiredProperties: this.props.additionalRequiredProperties,
        setPopoverTargetAsRef: this.props.setPopoverTargetAsRef,
        shouldRenderContentOnly: this.props.shouldRenderContentOnly,
        showAllProperties: !this.props.showLoadingAnimation && this.hasContactInformation(),
        suggestions: this.renderSuggestions(),
        title: this.renderTitle(),
        validationErrors: this.getValidationErrors()
      });
    }
  }]);

  return ContactCreatorDialog;
}(PureComponent);

ContactCreatorDialog.defaultProps = {
  shouldRenderConfirmAndAddButton: true
};
ContactCreatorDialog.propTypes = {
  additionalRequiredProperties: PropTypes.instanceOf(List),
  emailValidationError: ImmutablePropTypes.mapContains({
    error: PropTypes.string,
    isValid: PropTypes.bool,
    message: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string
  }),
  embedded: PropTypes.bool,
  extraFields: PropTypes.node,
  handleChange: PropTypes.func.isRequired,
  ignoreDefaultCreatorProperties: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  properties: PropTypes.instanceOf(ImmutableMap),
  propertyValues: PropTypes.instanceOf(ImmutableMap).isRequired,
  requiredProps: PropTypes.instanceOf(List),
  setPopoverTargetAsRef: PropTypes.func.isRequired,
  showLoadingAnimation: PropTypes.bool.isRequired,
  shouldRenderContentOnly: PropTypes.bool,
  shouldRenderConfirmAndAddButton: PropTypes.bool
};
export default Popoverable(ContactCreatorDialog, ContactCreatorDialog.propTypes);