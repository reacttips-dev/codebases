'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { connect } from 'general-store';
import { Map as ImmutableMap, List } from 'immutable';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import { getIsActionCompleted } from 'user-context/onboarding';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { getPropertyMap, getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import { isValidEmail } from 'customer-data-properties/validation/PropertyValidations';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import ContactCreatorDialog from './ContactCreatorDialog';
import debounce from 'transmute/debounce';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import { validateEmail } from 'crm_data/properties/PropertyValidationAPI';
import { LOADING, EMPTY, isLoading } from 'crm_data/flux/LoadingStatus';
import ObjectCreatorPropertiesDependency from '../../../flux/dependencies/ObjectCreatorPropertiesDependency';
import RequiredPropsDependency from '../../../dependencies/RequiredPropsDependency';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import { isScoped } from '../../../../setup-object-embed/containers/ScopeOperators';
import ScopesContainer from '../../../../setup-object-embed/containers/ScopesContainer';
import ContactCreatorDialogMarketableCheckbox from './ContactCreatorDialogMarketableCheckbox';
import { CrmLogger } from 'customer-data-tracking/loggers';
import withGateOverride from 'crm_data/gates/withGateOverride'; // status before loading so we know we tried to start validating but loading did not start or failed because the debounce delayed or cancelled the request

var UNINITIALIZED = 'UNINITIALIZED';

var ContactCreatorContainer = /*#__PURE__*/function (_PureComponent) {
  _inherits(ContactCreatorContainer, _PureComponent);

  function ContactCreatorContainer(props) {
    var _this;

    _classCallCheck(this, ContactCreatorContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContactCreatorContainer).call(this, props));

    _this.handleValidateEmailChange = function (email) {
      _this.setValidationForEmail(email, LOADING);

      validateEmail(email).then(function (emailValidationError) {
        _this.setValidationForEmail(email, emailValidationError);
      }).catch(function () {
        _this.setValidationForEmail(email, EMPTY);
      });
    };

    _this.handleChange = function (_ref) {
      var name = _ref.property.name,
          value = _ref.value;
      var updateContactRecord = setProperty(_this.state.contactRecord, name, value);

      if (name === 'email') {
        var email = value.trim();

        if (isValidEmail(email) && (!_this.state.validationErrorsByEmail.has(email) || _this.state.validationErrorsByEmail.get(email) === UNINITIALIZED)) {
          _this.setValidationForEmail(email, UNINITIALIZED);

          _this.debounceValidateEmailChange(email);
        }
      }

      _this.setState({
        contactRecord: updateContactRecord
      });
    };

    _this.handleConfirm = function (_ref2) {
      var addNew = _ref2.addNew;
      var contactProperties = getPropertyMap(_this.state.contactRecord);
      var emailValue = contactProperties.get('email'); // remove email prop so we dont send an empty string as an email to the server

      if (!emailValue) {
        contactProperties = contactProperties.delete('email');
      }

      _this.props.onConfirm({
        properties: _this.props.properties,
        propertyValues: contactProperties,
        addNew: addNew,
        isFirstContact: _this.isFirstContact,
        isMarketable: _this.state.isMarketable
      });

      if (addNew) {
        _this.updateContactWithPropertyDefaults(ContactRecord());

        _this.setState({
          isMarketable: false
        });
      }
    };

    _this.handleReject = function () {
      var _this$props;

      _this.setState({
        contactRecord: ContactRecord()
      });

      (_this$props = _this.props).onReject.apply(_this$props, arguments);
    };

    _this.handleMarketableChange = function (_ref3) {
      var checked = _ref3.target.checked;

      _this.setState({
        isMarketable: checked
      });

      CrmLogger.log('marketableContactsCheckboxInteraction', {
        action: 'checkbox-marketing-contact',
        isEnabled: checked
      });
    };

    _this.state = {
      validationErrorsByEmail: ImmutableMap(),
      isMarketable: false,
      contactRecord: ContactRecord()
    };
    _this.debounceValidateEmailChange = debounce(150, _this.handleValidateEmailChange);
    _this.getEmailValidationError = _this.getEmailValidationError.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ContactCreatorContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.updateContactWithPropertyDefaults(this.state.contactRecord);
      getIsActionCompleted('create-first-contact').then(function (completed) {
        _this2.isFirstContact = !completed;
      }).done();
    }
  }, {
    key: "getPropertyDefaults",
    value: function getPropertyDefaults() {
      return ImmutableMap(this.props.propertyDefaults || {}).set('lifecyclestage', this.props.defaultLifecycleStage);
    }
  }, {
    key: "updateContactWithPropertyDefaults",
    value: function updateContactWithPropertyDefaults(contactRecord) {
      var updatedContactRecord = this.getPropertyDefaults().reduce(function (acc, value, name) {
        return setProperty(acc, name, value);
      }, contactRecord);
      this.setState({
        contactRecord: updatedContactRecord
      });
    }
  }, {
    key: "getEmailValidationError",
    value: function getEmailValidationError() {
      var validationErrorsByEmail = this.state.validationErrorsByEmail;
      var currentEmail = getProperty(this.state.contactRecord, 'email');
      currentEmail = currentEmail ? currentEmail.trim() : currentEmail;

      if (validationErrorsByEmail.has(currentEmail)) {
        var emailValidationError = validationErrorsByEmail.get(currentEmail);
        return emailValidationError === UNINITIALIZED ? LOADING : emailValidationError;
      }

      return EMPTY;
    }
  }, {
    key: "setValidationForEmail",
    value: function setValidationForEmail(email, validationResults) {
      this.setState(function (state) {
        return {
          validationErrorsByEmail: state.validationErrorsByEmail.set(email, validationResults)
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var emailValidationError = this.getEmailValidationError();

      var extraFields = this.props.showEditMarketableContacts && /*#__PURE__*/_jsx(ContactCreatorDialogMarketableCheckbox, {
        checked: this.state.isMarketable,
        onChange: this.handleMarketableChange,
        disabled: !this.props.enableEditMarketableContacts
      });

      return /*#__PURE__*/_jsx(ErrorBoundary, {
        boundaryName: "ContactCreatorContainer",
        children: /*#__PURE__*/_jsx(ContactCreatorDialog, {
          embedded: this.props.embedded,
          emailValidationError: emailValidationError,
          extraFields: extraFields,
          handleChange: this.handleChange,
          ignoreDefaultCreatorProperties: this.props.ignoreDefaultCreatorProperties,
          onConfirm: this.handleConfirm,
          onReject: this.handleReject,
          properties: this.props.properties,
          propertyValues: getPropertyMap(this.state.contactRecord),
          additionalRequiredProperties: this.props.additionalRequiredProperties,
          requiredProps: this.props.requiredProps,
          showLoadingAnimation: isLoading(emailValidationError),
          shouldRenderContentOnly: this.props.shouldRenderContentOnly,
          shouldRenderConfirmAndAddButton: this.props.shouldRenderConfirmAndAddButton
        })
      });
    }
  }]);

  return ContactCreatorContainer;
}(PureComponent);

ContactCreatorContainer.propTypes = Object.assign({
  additionalRequiredProperties: PropTypes.instanceOf(List),
  embedded: PropTypes.bool,
  ignoreDefaultCreatorProperties: PropTypes.bool,
  properties: PropTypes.instanceOf(ImmutableMap),
  propertyDefaults: PropTypes.instanceOf(ImmutableMap).isRequired,
  requiredProps: PropTypes.instanceOf(List),
  showEditMarketableContacts: PropTypes.bool.isRequired,
  enableEditMarketableContacts: PropTypes.bool.isRequired
}, PromptablePropInterface);
export default connect({
  properties: ObjectCreatorPropertiesDependency,
  requiredProps: RequiredPropsDependency,
  showEditMarketableContacts: {
    stores: [IsUngatedStore],
    deref: function deref() {
      return isScoped(ScopesContainer.get(), 'marketable-contacts-access');
    }
  },
  enableEditMarketableContacts: {
    stores: [],
    deref: function deref() {
      return isScoped(ScopesContainer.get(), 'marketable-contacts-write');
    }
  },
  defaultLifecycleStage: {
    stores: [IsUngatedStore],
    deref: function deref() {
      var isUngatedForLCSCustomization = withGateOverride('LifecycleStageCustomization:Primary', IsUngatedStore.get('LifecycleStageCustomization:Primary'));
      return isUngatedForLCSCustomization ? null : 'subscriber';
    }
  }
})(ContactCreatorContainer);
export { ContactCreatorContainer as WrappedComponent };