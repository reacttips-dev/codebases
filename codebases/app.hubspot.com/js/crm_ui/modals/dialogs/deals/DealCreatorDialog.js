'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _ProvideReferenceReso;

import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { connect } from 'general-store';
import { Map as ImmutableMap, List } from 'immutable';
import memoize from 'transmute/memoize';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import ObjectCreatorDialog from '../objectModifiers/ObjectCreatorDialog';
import { COMPANY, CONTACT, DEAL, ENGAGEMENT, PRODUCT } from 'customer-data-objects/constants/ObjectTypes';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import * as SimpleDate from 'UIComponents/core/SimpleDate';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UISelect from 'UIComponents/input/UISelect';
import UIMicroDateInput from 'UIComponents/dates/UIMicroDateInput';
import AssociationSelectSearch from '../../../components/select/AssociationSelectSearch';
import HR from 'UIComponents/elements/HR';
import { getId, toString } from 'customer-data-objects/model/ImmutableModel';
import { isLoading } from 'crm_data/flux/LoadingStatus';
import { EMPTY, LOADING } from 'crm_data/constants/LoadingStatus';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import ComponentWithPartials from 'UIComponents/mixins/ComponentWithPartials';
import Popoverable from '../../../components/popovers/Popoverable';
import PopoverInterface from '../../../components/popovers/PopoverInterface';
import ObjectCreatorPropertiesDependency from '../../../flux/dependencies/ObjectCreatorPropertiesDependency';
import RequiredPropsDependency from '../../../dependencies/RequiredPropsDependency';
import canCreate from '../../../utils/canCreate';
import { isValidRequiredProperties } from 'customer-data-properties/validation/PropertyValidations';
import LineItemsInputFormComponent from '../../../deals/LineItemsInputFormComponent';
import { fetch } from '../../../BET/validation/BETValidationAPI';
import CompaniesStore from 'crm_data/companies/CompaniesStore';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import DealPipelineStore from 'crm_data/deals/DealPipelineStore';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { MULTI_CURRENCY_CURRENCY_CODE, MULTI_CURRENCY_INFORMATION } from 'reference-resolvers/constants/ReferenceObjectTypes';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import MultiCurrencyCurrencyCodeResolver from 'reference-resolvers/resolvers/MultiCurrencyCurrencyCodeResolver';
import MultiCurrencyInformationResolver from 'reference-resolvers/resolvers/MultiCurrencyInformationResolver';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import { isLoading as isResolverLoading } from 'reference-resolvers/utils';
import { DEAL_AMOUNT_PREFERENCES } from 'products-ui-components/constants/DealAmountOptions';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';
import { saveUserSetting } from 'crm_data/settings/UserSettingsActions';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import { getAssociationName, getObjectsByType } from '../../../creator/ObjectCreatorUtils';
import DealAmountPreferenceDependency from 'products-ui-components/dependencies/DealAmountPreferenceDependency';
import { pipelinePermissionsDep } from 'crm_data/pipelinePermissions/pipelinePermissionsDep';
import { HIDDEN } from 'crm_data/pipelinePermissions/pipelinePermissionsConstants';
import { DEAL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import get from 'transmute/get';
var INITIAL_DEAL_PROPERTIES = ['dealname', 'pipeline', 'dealstage'];
var ASSOCIATION_SYNC_OPTIONS_MAP = {
  LAST_THIRTY_DAYS: {
    type: 'LAST_THIRTY_DAYS',
    startDate: SimpleDate.startOfPrior(29, 'day')
  },
  LAST_SIXTY_DAYS: {
    type: 'LAST_SIXTY_DAYS',
    startDate: SimpleDate.startOfPrior(60, 'day')
  },
  LAST_NINETY_DAYS: {
    type: 'LAST_NINETY_DAYS',
    startDate: SimpleDate.startOfPrior(90, 'day')
  },
  ALL: {
    type: 'ALL',
    startDate: SimpleDate.beginningOfTime()
  },
  CUSTOM_DATE: {
    type: 'CUSTOM_DATE',
    startDate: SimpleDate.now()
  }
};
var getGeneratedDealName = memoize(function (association) {
  // Allow for custom default deal names
  var associationName = toString(association);
  return I18n.text('crm_components.GenericModal.dealTitleStub', {
    subject: I18n.SafeString(associationName)
  });
});
export var DealCreatorDialog = createReactClass({
  displayName: 'DealCreatorDialog',
  mixins: [ComponentWithPartials],
  propTypes: Object.assign({}, PromptablePropInterface, {}, PopoverInterface, {
    additionalRequiredProperties: ImmutablePropTypes.list,
    associationObjectId: PropTypes.string,
    associationObjectType: ObjectTypesType,
    dealProperties: PropTypes.instanceOf(ImmutableMap).isRequired,
    embedded: PropTypes.bool,
    propertyDefaults: ImmutablePropTypes.map.isRequired,
    setDealProperties: PropTypes.func.isRequired,
    clearDealProperties: PropTypes.func.isRequired,
    shouldShowDealLineItemsCard: PropTypes.bool.isRequired,
    hasBetCustomDealForm: PropTypes.bool.isRequired
  }),
  getDefaultProps: function getDefaultProps() {
    return {
      shouldRenderConfirmAndAddButton: true
    };
  },
  getInitialState: function getInitialState() {
    var associatedContactIds = List();

    if (this.props.associationObjectType === CONTACT) {
      associatedContactIds = associatedContactIds.push(this.props.associationObjectId);
    } else if (this.props.propertyDefaults.get('associatedcontactid')) {
      associatedContactIds = associatedContactIds.push("" + this.props.propertyDefaults.get('associatedcontactid'));
    }

    var associatedContactSyncRange = this.getAssociatedSyncValueOnToggle(!associatedContactIds.isEmpty() && this.props.hasElectedIntoSyncContact);
    var associatedCompanyIds = List();

    if (this.props.associationObjectType === COMPANY) {
      associatedCompanyIds = associatedCompanyIds.push(this.props.associationObjectId);
    } else if (this.props.propertyDefaults.get('associatedcompanyid')) {
      associatedCompanyIds = associatedCompanyIds.push("" + this.props.propertyDefaults.get('associatedcompanyid'));
    }

    var associatedCompanySyncRange = this.getAssociatedSyncValueOnToggle(!associatedCompanyIds.isEmpty() && this.props.hasElectedIntoSyncCompany);
    return {
      isDialogOpen: false,
      lineItemsToAdd: List(),
      isDealAmountDisabled: false,
      associatedContactIds: associatedContactIds,
      associatedContactSyncRange: associatedContactSyncRange,
      associatedCompanyIds: associatedCompanyIds,
      associatedCompanySyncRange: associatedCompanySyncRange,
      validationErrors: ImmutableMap(),
      validationPending: ImmutableMap()
    };
  },
  getMulticurrencies: function getMulticurrencies() {
    var multicurrencies = this.props.multicurrencies;

    if (isResolverLoading(multicurrencies)) {
      return List();
    }

    return multicurrencies.toList();
  },
  setLineItemsToAdd: function setLineItemsToAdd(newLineItems, total, isDealAmountDisabled, disableConfirm) {
    var dealAmountPreference = this.props.dealAmountPreference;
    var validationPending = this.state.validationPending;
    var hasLineItems = newLineItems.size > 0;
    this.setState({
      lineItemsToAdd: newLineItems,
      isDealAmountDisabled: isDealAmountDisabled,
      validationPending: disableConfirm && hasLineItems ? validationPending.set('amount', true) : validationPending.delete('amount')
    });

    if (isDealAmountDisabled) {
      if (dealAmountPreference === DEAL_AMOUNT_PREFERENCES['disabled']) {
        return;
      }

      var updatedDealPropertiesBeta = this.getDealProperties().merge({
        amount: total
      });
      this.props.setDealProperties(updatedDealPropertiesBeta);
    }
  },
  getDealProperties: function getDealProperties() {
    var _this$props = this.props,
        associatedCompany = _this$props.associatedCompany,
        associatedContact = _this$props.associatedContact,
        dealProperties = _this$props.dealProperties,
        defaultCurrency = _this$props.defaultCurrency;
    var propertyDefaults = this.props.propertyDefaults;

    if (associatedCompany) {
      propertyDefaults = propertyDefaults.merge({
        dealname: getGeneratedDealName(associatedCompany)
      });
    } else if (associatedContact) {
      propertyDefaults = propertyDefaults.merge({
        dealname: getGeneratedDealName(associatedContact)
      });
    }

    if (!isResolverLoading(defaultCurrency) && defaultCurrency && defaultCurrency.referencedObject.get('hasMulticurrencyActive')) {
      propertyDefaults = propertyDefaults.merge({
        deal_currency_code: defaultCurrency.label
      });
    }

    return propertyDefaults.merge(dealProperties);
  },
  // for more convenient access to long state keys
  getAssociationsByObjectType: function getAssociationsByObjectType(objectType) {
    var _this$state = this.state,
        associatedCompanyIds = _this$state.associatedCompanyIds,
        associatedCompanySyncRange = _this$state.associatedCompanySyncRange,
        associatedContactIds = _this$state.associatedContactIds,
        associatedContactSyncRange = _this$state.associatedContactSyncRange;

    if (objectType === CONTACT) {
      return {
        ids: associatedContactIds,
        sync: associatedContactSyncRange
      };
    } else if (objectType === COMPANY) {
      return {
        ids: associatedCompanyIds,
        sync: associatedCompanySyncRange
      };
    }

    return {};
  },
  getSaveUserSettingElectedToSyncByType: function getSaveUserSettingElectedToSyncByType(objectType, hasElectedIntoSync) {
    saveUserSetting(UserSettingsKeys["HAS_CHECKED_ASSOCIATION_DEAL_BOX_" + objectType], !hasElectedIntoSync);
  },
  setAssociationIdsByObjectType: function setAssociationIdsByObjectType(objectType, ids) {
    var _this = this;

    this.setState(function (prevState) {
      if (objectType === CONTACT) {
        var hasAssociations = Boolean(ids.length);
        var hadAssociations = !prevState.associatedContactIds.isEmpty();
        var associatedContactIds = List(ids);

        if (hadAssociations !== hasAssociations) {
          return {
            associatedContactIds: associatedContactIds,
            associatedContactSyncRange: _this.getAssociatedSyncValueOnToggle(hasAssociations && _this.props.hasElectedIntoSyncContact)
          };
        }

        return {
          associatedContactIds: associatedContactIds
        };
      } else if (objectType === COMPANY) {
        var _hasAssociations = Boolean(ids);

        return {
          associatedCompanyIds: List.of(ids),
          associatedCompanySyncRange: _this.getAssociatedSyncValueOnToggle(_hasAssociations && _this.props.hasElectedIntoSyncCompany)
        };
      }

      return prevState;
    });
  },
  setAssociationSyncByObjectType: function setAssociationSyncByObjectType(objectType, sync) {
    this.setState(function (prevState) {
      if (objectType === CONTACT) {
        return {
          associatedContactSyncRange: sync
        };
      } else if (objectType === COMPANY) {
        return {
          associatedCompanySyncRange: sync
        };
      }

      return prevState;
    });
  },
  getAssociatedCompanyId: function getAssociatedCompanyId() {
    var dealProperties = this.getDealProperties();
    var associatedCompany = this.props.associatedCompany;

    if (dealProperties.has('associatedcompanyid') && dealProperties.get('associatedcompanyid')) {
      return "" + dealProperties.get('associatedcompanyid');
    }

    if (!associatedCompany) {
      return undefined;
    }

    return "" + getId(associatedCompany);
  },
  getAssociatedContactId: function getAssociatedContactId() {
    var dealProperties = this.getDealProperties();
    var associatedContact = this.props.associatedContact;

    if (dealProperties.has('associatedcontactid') && dealProperties.get('associatedcontactid')) {
      var id = "" + dealProperties.get('associatedcontactid');
      return id;
    }

    if (!associatedContact) {
      return undefined;
    }

    return "" + getId(associatedContact);
  },
  setIsDialogOpen: function setIsDialogOpen() {
    return this.setState({
      isDialogOpen: true
    });
  },
  handleAssociationChange: function handleAssociationChange(type, value, dealName) {
    var updatedDealProperties = this.getDealProperties().set("associated" + type + "id", value);

    if (dealName) {
      updatedDealProperties = updatedDealProperties.set('dealname', dealName);
    }

    return this.props.setDealProperties(updatedDealProperties);
  },
  getSyncTimestamp: function getSyncTimestamp(syncRange) {
    if (!syncRange || syncRange.type === 'ALL') return null;
    return SimpleDate.toMoment(syncRange.startDate).valueOf();
  },
  getRequestedAssociatedObjectsOfType: function getRequestedAssociatedObjectsOfType(objectType) {
    var _this$getAssociations = this.getAssociationsByObjectType(objectType),
        ids = _this$getAssociations.ids,
        sync = _this$getAssociations.sync;

    var associateAllSinceTimestamp = this.getSyncTimestamp(sync);
    var objectTypeToBulkAssociate = sync ? ENGAGEMENT : null;
    return ids.map(function (objectId) {
      return {
        associateAllSinceTimestamp: associateAllSinceTimestamp,
        objectId: objectId,
        objectType: objectType,
        objectTypeToBulkAssociate: objectTypeToBulkAssociate
      };
    });
  },
  handleConfirm: function handleConfirm(_ref) {
    var addNew = _ref.addNew;
    var properties = this.props.properties;
    var lineItemsToAdd = this.state.lineItemsToAdd;
    var propertyValues = this.getDealProperties();

    if (!propertyValues.get('dealname')) {
      Alerts.addError('createDealModal.invalidSave');
      return;
    }

    var requestedAssociatedObjects = [].concat(_toConsumableArray(this.getRequestedAssociatedObjectsOfType(CONTACT)), _toConsumableArray(this.getRequestedAssociatedObjectsOfType(COMPANY)));
    this.props.onConfirm({
      addNew: addNew,
      lineItemsToAdd: lineItemsToAdd,
      propertyValues: propertyValues,
      properties: properties,
      requestedAssociatedObjects: requestedAssociatedObjects
    });
    if (addNew) this.props.clearDealProperties();
  },
  handlePipelineChange: function handlePipelineChange(pipelineId) {
    var pipeline = this.props.pipelines.get(pipelineId);

    if (!pipeline) {
      return undefined;
    }

    var dealstage = pipeline.getIn(['stageOptions', 0, 'value']);
    var updatedDealProperties = this.getDealProperties().merge({
      dealstage: dealstage,
      pipeline: pipelineId
    });
    this.setState({
      validationPending: ImmutableMap(),
      validationErrors: ImmutableMap()
    });
    return this.props.setDealProperties(updatedDealProperties);
  },
  handleBlur: function handleBlur(_ref2) {
    var _this2 = this;

    var propertyName = _ref2.propertyName,
        propertyValue = _ref2.propertyValue;

    if (propertyName === 'dealname') {
      return;
    }

    this.setState({
      validationPending: this.state.validationPending.set(propertyName, true)
    });
    fetch([{
      propertyName: propertyName,
      propertyValue: propertyValue
    }]).then(function (result) {
      var _this2$state = _this2.state,
          validationErrors = _this2$state.validationErrors,
          validationPending = _this2$state.validationPending;
      var errors = result.has(propertyName) && propertyValue ? validationErrors.set(propertyName, result.getIn([propertyName, 'message'])) : validationErrors.delete(propertyName);

      _this2.setState({
        validationErrors: errors,
        validationPending: validationPending.delete(propertyName)
      });
    }, function (error) {
      var _this2$state2 = _this2.state,
          validationErrors = _this2$state2.validationErrors,
          validationPending = _this2$state2.validationPending;
      var errorMessage = error && error.responseJSON && error.responseJSON.message ? error.responseJSON.message : 'error';

      _this2.setState({
        validationErrors: validationErrors.set(propertyName, errorMessage),
        validationPending: validationPending.delete(propertyName)
      });
    });
  },
  isValidRequiredProps: function isValidRequiredProps() {
    if (this.props.properties === LOADING) {
      return false;
    }

    return isValidRequiredProperties(this.props.requiredProps, this.getDealProperties(), this.props.properties);
  },
  shouldDisableConfirmButton: function shouldDisableConfirmButton() {
    return !this.isValidRequiredProps() || !canCreate(DEAL) || this.state.validationErrors.size > 0 || this.state.validationPending.size > 0;
  },
  handleChange: function handleChange(_ref3) {
    var name = _ref3.property.name,
        value = _ref3.value;

    if (name === 'pipeline') {
      this.handlePipelineChange(value);
      return undefined;
    }

    var updatedDealProperties = this.getDealProperties().set(name, value);
    return this.props.setDealProperties(updatedDealProperties);
  },
  getDisabledTooltip: function getDisabledTooltip() {
    if (!this.isValidRequiredProps()) {
      return "" + I18n.text('createDealModal.disabledTooltip.missingRequired');
    }

    return undefined;
  },
  getAssociatedSyncValueOnToggle: function getAssociatedSyncValueOnToggle(checked) {
    return checked ? {
      type: 'LAST_THIRTY_DAYS',
      startDate: SimpleDate.startOfPrior(29, 'day')
    } : undefined;
  },
  renderConfirmAndAddButton: function renderConfirmAndAddButton(isConfirmDisabled) {
    if (!this.props.shouldRenderConfirmAndAddButton) {
      return null;
    }

    var handleClick = this.partial(this.handleConfirm, {
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
        "data-selenium-test": "create-add-another-deal-button",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "objectCreator.createContactModal.addButtonLabel.createAndNewUnique"
        })
      })
    });
  },
  renderAssociatorCheckbox: function renderAssociatorCheckbox(objectType) {
    var _this3 = this;

    var _this$props2 = this.props,
        contacts = _this$props2.contacts,
        companies = _this$props2.companies;

    var _this$getAssociations2 = this.getAssociationsByObjectType(objectType),
        ids = _this$getAssociations2.ids,
        sync = _this$getAssociations2.sync;

    var objects = getObjectsByType(objectType, contacts, companies);
    var associationName = getAssociationName(ids, objectType, objects);

    if (!associationName) {
      return null;
    }

    var isSync = !!sync;
    var i18nCheckedKey = isSync ? 'checked' : 'unchecked';
    return /*#__PURE__*/_jsx(UIFormControl, {
      children: /*#__PURE__*/_jsxs(UICheckbox, {
        checked: isSync,
        onChange: function onChange() {
          _this3.getSaveUserSettingElectedToSyncByType(objectType, isSync);

          _this3.setAssociationSyncByObjectType(objectType, _this3.getAssociatedSyncValueOnToggle(!isSync));
        },
        size: 'small',
        "data-selenium-test": "association-checkbox-" + objectType,
        children: [/*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "createModal.associatedProperties.useTimeline.deal." + objectType.toLowerCase() + "." + i18nCheckedKey,
          options: {
            name: associationName,
            count: ids.size
          }
        }), ' ', isSync && this.renderAssociationActivityDatePicker(sync, function (newSyncRange) {
          _this3.setAssociationSyncByObjectType(objectType, newSyncRange);
        }), !isSync && /*#__PURE__*/_jsx(UIHelpIcon, {
          title: I18n.text('createModal.associatedProperties.useTimeline.tooltip')
        })]
      })
    });
  },
  renderAssociationActivityDatePicker: function renderAssociationActivityDatePicker(associationSync, handleChangeSyncDate) {
    if (!associationSync) return null;
    var currentValue = associationSync.type; // association__date-picker -> https://git.hubteam.com/HubSpot/CRM/pull/12919#discussion_r565071

    return /*#__PURE__*/_jsxs("span", {
      onClick: function onClick(e) {
        return e.preventDefault();
      },
      className: "association__date-picker",
      children: [/*#__PURE__*/_jsx(UISelect, {
        options: [{
          text: I18n.text('createModal.associatedProperties.useTimeline.lastThirtyDays'),
          value: 'LAST_THIRTY_DAYS'
        }, {
          text: I18n.text('createModal.associatedProperties.useTimeline.lastSixtyDays'),
          value: 'LAST_SIXTY_DAYS'
        }, {
          text: I18n.text('createModal.associatedProperties.useTimeline.lastNinetyDays'),
          value: 'LAST_NINETY_DAYS'
        }, {
          text: I18n.text('createModal.associatedProperties.useTimeline.allTime'),
          value: 'ALL'
        }, {
          text: I18n.text('createModal.associatedProperties.useTimeline.customDate'),
          value: 'CUSTOM_DATE'
        }],
        placeholder: I18n.text('createModal.associatedProperties.useTimeline.lastSixtyDays' // should be thirty
        ),
        onChange: function onChange(_ref4) {
          var value = _ref4.target.value;
          handleChangeSyncDate(ASSOCIATION_SYNC_OPTIONS_MAP[value]);
        },
        buttonUse: "link",
        value: currentValue
      }), associationSync.type === 'CUSTOM_DATE' && /*#__PURE__*/_jsx(UIMicroDateInput, {
        className: "m-left-2",
        maxValue: SimpleDate.now(),
        value: associationSync.startDate,
        onChange: function onChange(_ref5) {
          var value = _ref5.target.value;
          handleChangeSyncDate({
            type: 'CUSTOM_DATE',
            startDate: value,
            endDate: SimpleDate.now()
          });
        }
      })]
    });
  },
  renderAssociator: function renderAssociator(objectType) {
    var _this$getAssociations3 = this.getAssociationsByObjectType(objectType),
        ids = _this$getAssociations3.ids;

    var value = !ids || ids.isEmpty() ? undefined : objectType === CONTACT ? ids.toArray() : ids.first();
    return /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "crm_components.GenericModal.categoryType." + objectType.toLowerCase()
      }),
      children: /*#__PURE__*/_jsx(AssociationSelectSearch, {
        autofocus: false,
        multi: objectType === CONTACT,
        objectType: objectType,
        onChange: this.partial(this.setAssociationIdsByObjectType, objectType),
        value: value,
        className: "association-select-value",
        seleniumSelector: "association-select-" + objectType
      })
    });
  },
  renderAssociationFieldsWithTimelineSync: function renderAssociationFieldsWithTimelineSync() {
    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(HR, {}), /*#__PURE__*/_jsx("h5", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "createModal.associatedProperties.title.deal"
        })
      }), this.renderAssociator(COMPANY), this.renderAssociatorCheckbox(COMPANY), this.renderAssociator(CONTACT), this.renderAssociatorCheckbox(CONTACT), this.renderLineItemsInputForm()]
    });
  },
  renderCompanyAssociator: function renderCompanyAssociator() {
    // Delay the render if we need to fetch a company object from the store
    if (this.props.associatedCompany === LOADING) {
      return undefined;
    }

    var value = this.getAssociatedCompanyId();
    return /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "crm_components.GenericModal.categoryType.company"
      }),
      children: /*#__PURE__*/_jsx(AssociationSelectSearch, {
        autofocus: false,
        objectType: COMPANY,
        onChange: this.partial(this.handleAssociationChange, 'company'),
        value: value,
        className: "association-select-value"
      })
    });
  },
  renderContactAssociator: function renderContactAssociator() {
    if (this.props.associatedContact === LOADING) {
      return undefined;
    }

    var value = this.getAssociatedContactId();
    return /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "crm_components.GenericModal.categoryType.contact"
      }),
      children: /*#__PURE__*/_jsx(AssociationSelectSearch, {
        autofocus: false,
        objectType: CONTACT,
        onChange: this.partial(this.handleAssociationChange, 'contact'),
        value: value,
        className: "association-select-value"
      })
    });
  },
  renderLineItemsInputForm: function renderLineItemsInputForm() {
    var _this$props3 = this.props,
        shouldShowDealLineItemsCard = _this$props3.shouldShowDealLineItemsCard,
        productProperties = _this$props3.productProperties,
        defaultCurrency = _this$props3.defaultCurrency;

    if (!shouldShowDealLineItemsCard || isLoading(productProperties)) {
      return null;
    }

    var _this$props4 = this.props,
        dealProperties = _this$props4.dealProperties,
        dealAmountPreference = _this$props4.dealAmountPreference;
    var defaultCurrencyCode = defaultCurrency.label;
    var effectiveCurrencyCode = dealProperties.get('deal_currency_code') || defaultCurrencyCode;
    var multicurrencies = this.getMulticurrencies();
    var hasMulticurrencyActive = isResolverLoading(defaultCurrency) ? false : defaultCurrency.referencedObject.get('hasMulticurrencyActive');
    return /*#__PURE__*/_jsx(LineItemsInputFormComponent, {
      setLineItemsToAdd: this.setLineItemsToAdd,
      defaultCurrencyCode: defaultCurrencyCode,
      effectiveCurrencyCode: effectiveCurrencyCode,
      hasMulticurrencyActive: hasMulticurrencyActive,
      multicurrencies: multicurrencies,
      productProperties: productProperties,
      dealAmountPreference: dealAmountPreference
    });
  },
  render: function render() {
    var _this$props5 = this.props,
        embedded = _this$props5.embedded,
        objectType = _this$props5.objectType,
        setPopoverTargetAsRef = _this$props5.setPopoverTargetAsRef,
        dealAmountPreference = _this$props5.dealAmountPreference,
        hasBetCustomDealForm = _this$props5.hasBetCustomDealForm,
        allDealProperties = _this$props5.allDealProperties;
    var _this$state2 = this.state,
        isDealAmountDisabled = _this$state2.isDealAmountDisabled,
        validationErrors = _this$state2.validationErrors;
    var confirmDisabled = this.shouldDisableConfirmButton();
    var dealProperties = this.getDealProperties();
    var handleBlur = hasBetCustomDealForm ? this.handleBlur : undefined;
    return /*#__PURE__*/_jsx(ErrorBoundary, {
      boundaryName: "DealCreatorDialog",
      children: /*#__PURE__*/_jsx(ObjectCreatorDialog, {
        associationObjectId: this.props.associationObjectId,
        associationObjectType: this.props.associationObjectType,
        additionalRequiredProperties: this.props.additionalRequiredProperties,
        confirmDisabled: confirmDisabled,
        confirmDisabledTooltip: this.getDisabledTooltip(),
        embedded: embedded,
        extraFields: this.renderAssociationFieldsWithTimelineSync(),
        onChange: this.handleChange,
        onBlur: handleBlur,
        initialProperties: INITIAL_DEAL_PROPERTIES,
        isDealAmountDisabled: isDealAmountDisabled,
        dealAmountPreference: dealAmountPreference,
        moreButtons: this.renderConfirmAndAddButton(confirmDisabled),
        objectType: objectType,
        onConfirm: this.handleConfirm,
        onOpenComplete: this.setIsDialogOpen,
        onReject: this.props.onReject,
        properties: this.props.properties,
        propertyValues: dealProperties,
        allDealProperties: allDealProperties,
        setPopoverTargetAsRef: setPopoverTargetAsRef,
        shouldRenderContentOnly: this.props.shouldRenderContentOnly,
        showAllProperties: true,
        subject: dealProperties,
        title: I18n.text('createDealModal.modalHeader'),
        validationErrors: validationErrors
      })
    });
  }
});
var provideResolvers = ProvideReferenceResolvers((_ProvideReferenceReso = {}, _defineProperty(_ProvideReferenceReso, MULTI_CURRENCY_CURRENCY_CODE, MultiCurrencyCurrencyCodeResolver), _defineProperty(_ProvideReferenceReso, MULTI_CURRENCY_INFORMATION, MultiCurrencyInformationResolver), _ProvideReferenceReso));
var getResolvers = ResolveReferences(function (resolvers) {
  return {
    defaultCurrency: resolvers[MULTI_CURRENCY_INFORMATION].byId('default'),
    multicurrencies: resolvers[MULTI_CURRENCY_INFORMATION].all()
  };
});
export var getFirstVisiblePipeline = function getFirstVisiblePipeline(pipelines, permissions) {
  return pipelines.find(function (pipeline) {
    var pipelineId = get('pipelineId', pipeline);
    return get(pipelineId, permissions) !== HIDDEN;
  });
};
var getPropertyDefaults = memoize(function (propertyDefaults, pipelineCollection, pipelinePermissions) {
  var defaultPipeline;
  var defaultPipelineId = propertyDefaults.get('pipeline');
  var dealstage = propertyDefaults.get('dealstage');
  var closedate = propertyDefaults.get('closedate');
  var createdate = propertyDefaults.get('createdate');

  if (pipelineCollection) {
    defaultPipeline = defaultPipelineId ? pipelineCollection.get(defaultPipelineId) : getFirstVisiblePipeline(pipelineCollection, pipelinePermissions);
  }

  if (defaultPipeline) {
    propertyDefaults = propertyDefaults.set('pipeline', defaultPipeline.get('value'));

    if (!dealstage) {
      propertyDefaults = propertyDefaults.set('dealstage', defaultPipeline.getIn(['stageOptions', 0, 'value']));
    }
  }

  if (!closedate) {
    var startOfDay = I18n.moment.userTz().startOf('day').valueOf();
    var currentTime = I18n.moment.userTz().valueOf();
    var timeOffset = currentTime - startOfDay;
    var endOfMonthCurrentTime = I18n.moment.userTz().endOf('month').startOf('day').add(timeOffset).valueOf();
    propertyDefaults = propertyDefaults.set('closedate', endOfMonthCurrentTime);
  }

  if (!createdate) {
    propertyDefaults = propertyDefaults.set('createdate', I18n.moment.userTz().valueOf());
  }

  return propertyDefaults;
});
export default connect({
  dealAmountPreference: DealAmountPreferenceDependency,
  requiredProps: RequiredPropsDependency,
  properties: ObjectCreatorPropertiesDependency,
  productProperties: {
    stores: [PropertiesStore],
    deref: function deref() {
      return PropertiesStore.get(PRODUCT);
    }
  },
  companies: CompaniesStore,
  contacts: ContactsStore,
  associatedCompany: {
    stores: [CompaniesStore],
    deref: function deref(props) {
      var associatedcompanyid;
      var associationObjectType = props.associationObjectType,
          associationObjectId = props.associationObjectId,
          propertyDefaults = props.propertyDefaults;

      if (associationObjectType === COMPANY) {
        associatedcompanyid = associationObjectId;
      } else if (propertyDefaults.get('associatedcompanyid')) {
        associatedcompanyid = propertyDefaults.get('associatedcompanyid');
      }

      if (!associatedcompanyid) {
        return EMPTY;
      }

      return CompaniesStore.get(associatedcompanyid);
    }
  },
  associatedContact: {
    stores: [ContactsStore],
    deref: function deref(props) {
      var associationObjectType = props.associationObjectType,
          associationObjectId = props.associationObjectId;

      if (associationObjectType === CONTACT) {
        return ContactsStore.get(associationObjectId);
      }

      return EMPTY;
    }
  },
  pipelines: DealPipelineStore,
  hasElectedIntoSyncCompany: {
    stores: [UserSettingsStore],
    deref: function deref() {
      return UserSettingsStore.get(UserSettingsKeys.HAS_CHECKED_ASSOCIATION_DEAL_BOX_COMPANY);
    }
  },
  hasElectedIntoSyncContact: {
    stores: [UserSettingsStore],
    deref: function deref() {
      return UserSettingsStore.get(UserSettingsKeys.HAS_CHECKED_ASSOCIATION_DEAL_BOX_CONTACT);
    }
  },
  propertyDefaults: {
    stores: [DealPipelineStore].concat(_toConsumableArray(pipelinePermissionsDep.stores)),
    deref: function deref(_ref6) {
      var propertyDefaults = _ref6.propertyDefaults;
      var pipelineCollection = DealPipelineStore.get();
      var pipelinePermissions = pipelinePermissionsDep.deref({
        objectTypeId: DEAL_TYPE_ID
      });
      return getPropertyDefaults(propertyDefaults, pipelineCollection, pipelinePermissions);
    }
  },
  allDealProperties: {
    stores: [PropertiesStore],
    deref: function deref() {
      return PropertiesStore.get(DEAL);
    }
  }
})(Popoverable(provideResolvers(getResolvers(DealCreatorDialog)), DealCreatorDialog.propTypes));