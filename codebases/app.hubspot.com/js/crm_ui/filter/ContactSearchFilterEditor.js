'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _ObjectTypeToImportTy, _ObjectTypeToInboundD, _fromJS;

import * as ExternalOptionTypes from 'customer-data-objects/property/ExternalOptionTypes';
import * as FilterFamilyTranslator from 'customer-data-filters/components/FilterFamilyTranslator';
import { fromJS, List, Map as ImmutableMap, OrderedSet } from 'immutable';
import { fromContactSearch, toContactSearch } from 'customer-data-filters/converters/contactSearch/FilterContactSearch';
import { getAllClosedOption } from 'customer-data-objects/ticket/TicketStageIdOptions';
import { getAllClosedWonOption } from 'customer-data-objects/deal/DealStageIdOptions';
import { getContactSearchOperatorsForType } from 'customer-data-filters/converters/contactSearch/ContactSearchTypeToOperator';
import { getMeOption } from 'customer-data-objects/owners/OwnerIdOptions';
import { mapOf } from 'react-immutable-proptypes';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import FilterDefinitionCompanies from './definition/FilterDefinitionCompanies';
import FilterDefinitionContacts from './definition/FilterDefinitionContacts';
import FilterDefinitionDeals from './definition/FilterDefinitionDeals';
import FilterDefinitionMarketingEvents from './definition/FilterDefinitionMarketingEvents';
import FilterDefinitionCalls from './definition/FilterDefinitionCalls';
import FilterDefinitionTickets from './definition/FilterDefinitionTickets';
import I18n from 'I18n';
import InboundDbListMembershipProperty from 'customer-data-objects/property/special/InboundDbListMembershipProperty';
import ListMembershipsProperty from 'customer-data-objects/property/special/ListMembershipsProperty';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import PropTypes from 'prop-types';
import PropertyGroupType from 'customer-data-objects-ui-components/propTypes/PropertyGroupType';
import PropertyNameToReferenceType from 'customer-data-objects/property/PropertyNameToReferenceType';
import PropertyType from 'customer-data-objects-ui-components/propTypes/PropertyType';
import { PureComponent } from 'react';
import { AUTOMATION_PLATFORM_WORKFLOWS, BUSINESS_UNIT, CONTACT_LIST, DEAL_PIPELINE_STAGE, DEAL_PIPELINE, FORM, HIERARCHICAL_TEAM, INBOUND_DB_COMPANY_IMPORT, INBOUND_DB_COMPANY_LIST, INBOUND_DB_CONTACT_IMPORT, INBOUND_DB_CONTACT_LIST, INBOUND_DB_DEAL_IMPORT, INBOUND_DB_DEAL_LIST, INBOUND_DB_TICKET_LIST, MARKETING_EVENT_APP_NAME, MULTI_CURRENCY_CURRENCY_CODE, OWNER, PERSONA, SALESFORCE_CAMPAIGN, TICKET_PIPELINE, TICKET_STAGE, CALL_DISPOSITION, USER } from 'reference-resolvers/constants/ReferenceObjectTypes';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import XOFilterEditor from 'customer-data-filters/components/XOFilterEditor';
import getIn from 'transmute/getIn';
import once from 'transmute/once';
import { isScoped } from '../../containers/ScopeOperators';
import ScopesContainer from '../../containers/ScopesContainer';
var ObjectTypeToImportType = (_ObjectTypeToImportTy = {}, _defineProperty(_ObjectTypeToImportTy, COMPANY, INBOUND_DB_COMPANY_IMPORT), _defineProperty(_ObjectTypeToImportTy, CONTACT, INBOUND_DB_CONTACT_IMPORT), _defineProperty(_ObjectTypeToImportTy, DEAL, INBOUND_DB_DEAL_IMPORT), _ObjectTypeToImportTy);
var ObjectTypeToInboundDbListType = (_ObjectTypeToInboundD = {}, _defineProperty(_ObjectTypeToInboundD, COMPANY, INBOUND_DB_COMPANY_LIST), _defineProperty(_ObjectTypeToInboundD, CONTACT, INBOUND_DB_CONTACT_LIST), _defineProperty(_ObjectTypeToInboundD, DEAL, INBOUND_DB_DEAL_LIST), _defineProperty(_ObjectTypeToInboundD, TICKET, INBOUND_DB_TICKET_LIST), _ObjectTypeToInboundD);
var fieldDefinitions = fromJS((_fromJS = {}, _defineProperty(_fromJS, COMPANY, FilterDefinitionCompanies), _defineProperty(_fromJS, CONTACT, FilterDefinitionContacts), _defineProperty(_fromJS, DEAL, FilterDefinitionDeals), _defineProperty(_fromJS, TICKET, FilterDefinitionTickets), _defineProperty(_fromJS, '0-54', FilterDefinitionMarketingEvents), _defineProperty(_fromJS, '0-48', FilterDefinitionCalls), _fromJS));
export var ContactSearchFilterEditor = /*#__PURE__*/function (_PureComponent) {
  _inherits(ContactSearchFilterEditor, _PureComponent);

  function ContactSearchFilterEditor() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ContactSearchFilterEditor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ContactSearchFilterEditor)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.getFieldDefinitions = function () {
      return getIn([_this.props.filterFamily], fieldDefinitions);
    };

    _this.getFieldGroups = function () {
      return _this.props.fieldGroups;
    };

    _this.getField = function (keyPath) {
      var _this$props = _this.props,
          fields = _this$props.fields,
          filterFamily = _this$props.filterFamily,
          hasILSListsGate = _this$props.hasILSListsGate; // HACK: Once we support ILS lists on all portals this can be removed, it
      // only has to be a special case while ContactsListSeg lists still exist
      // so it won't conflict with the special property for contacts lists.
      // See: https://git.hubteam.com/HubSpot/CRM/pull/18532

      if (Array.isArray(keyPath) && keyPath[0] === InboundDbListMembershipProperty.name && !hasILSListsGate) {
        // HACK: We don't want to reference lists here until we can show them in
        // the UI, so lets just call it a view filter for now.
        return filterFamily === CONTACT ? InboundDbListMembershipProperty.set('label', I18n.text('filterSidebar.internalSyncList')) : InboundDbListMembershipProperty;
      } // When ILS is ungated we don't provide this property in the fields so we
      // need a hard coded case to resolve this in existing filters until the
      // views BE runs a migration to convert all views with filtering using this
      // property to the ILS variant


      if (Array.isArray(keyPath) && filterFamily === CONTACT && keyPath[0] === ListMembershipsProperty.name) {
        return ListMembershipsProperty;
      }

      return getIn(keyPath, fields);
    };

    _this.getFields = function () {
      return _this.props.fields;
    };

    _this.getFilterFamilyOptions = function () {
      return OrderedSet([_this.props.filterFamily]);
    };

    _this.getReferenceResolvers = function () {
      var _Object$assign;

      var _this$props2 = _this.props,
          filterFamily = _this$props2.filterFamily,
          resolvers = _this$props2.resolvers;
      var importReferenceType = ObjectTypeToImportType[filterFamily];
      var inboundDbListReferenceType = ObjectTypeToInboundDbListType[filterFamily];
      var importResolver = importReferenceType ? _defineProperty({}, ExternalOptionTypes.INBOUND_DB_IMPORT, resolvers[importReferenceType]) : {};
      var inboundDbListResolver = inboundDbListReferenceType ? _defineProperty({}, ExternalOptionTypes.INBOUND_DB_LIST, resolvers[inboundDbListReferenceType]) : {};
      return ImmutableMap(Object.assign({}, importResolver, {}, inboundDbListResolver, (_Object$assign = {
        AUTOMATION_PLATFORM_WORKFLOWS: resolvers[AUTOMATION_PLATFORM_WORKFLOWS],
        BUSINESS_UNIT: resolvers[BUSINESS_UNIT],
        DEAL_PIPELINE: resolvers[DEAL_PIPELINE],
        DEAL_STAGE: resolvers[DEAL_PIPELINE_STAGE],
        FORM: resolvers[FORM],
        LIST: resolvers[CONTACT_LIST]
      }, _defineProperty(_Object$assign, MARKETING_EVENT_APP_NAME, resolvers[MARKETING_EVENT_APP_NAME]), _defineProperty(_Object$assign, "MULTI_CURRENCY_CURRENCY_CODE", resolvers[MULTI_CURRENCY_CURRENCY_CODE]), _defineProperty(_Object$assign, "OWNER", resolvers[OWNER]), _defineProperty(_Object$assign, "PERSONA", resolvers[PERSONA]), _defineProperty(_Object$assign, "SALESFORCE_CAMPAIGN", resolvers[SALESFORCE_CAMPAIGN]), _defineProperty(_Object$assign, "TEAM", resolvers[HIERARCHICAL_TEAM]), _defineProperty(_Object$assign, "TICKET_PIPELINE", resolvers[TICKET_PIPELINE]), _defineProperty(_Object$assign, "TICKET_STAGE", resolvers[TICKET_STAGE]), _defineProperty(_Object$assign, "CALL_DISPOSITION", resolvers[CALL_DISPOSITION]), _defineProperty(_Object$assign, "USER", resolvers[USER]), _Object$assign)));
    };

    _this.getFilterFamilyObjectName = function (filterFamily) {
      var _this$props3 = _this.props,
          isCrmObject = _this$props3.isCrmObject,
          objectName = _this$props3.objectName;
      return isCrmObject ? objectName : FilterFamilyTranslator.LegacyFilterFamilyObjectNameTranslator(filterFamily);
    };

    _this.getReferenceType = function (filterFamily, propertyName) {
      return getIn([propertyName], PropertyNameToReferenceType[filterFamily]);
    };

    _this.getSpecialOptionsByReferenceType = once(function () {
      return {
        OWNER: function OWNER() {
          return List.of(getMeOption());
        },
        DEAL_STAGE: function DEAL_STAGE() {
          return List.of(getAllClosedWonOption());
        },
        TICKET_STAGE: function TICKET_STAGE() {
          return List.of(getAllClosedOption());
        }
      };
    });

    _this.handleDraftChange = function (newValue) {
      return _this.props.onDraftChange(toContactSearch(newValue));
    };

    _this.handleFilterChange = function (newValue) {
      return _this.props.onChange(toContactSearch(newValue));
    };

    return _this;
  }

  _createClass(ContactSearchFilterEditor, [{
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          __fields = _this$props4.fields,
          __fieldGroups = _this$props4.fieldGroups,
          filterFamily = _this$props4.filterFamily,
          isFiscalYearEnabled = _this$props4.isFiscalYearEnabled,
          hideFilters = _this$props4.hideFilters,
          value = _this$props4.value,
          rest = _objectWithoutProperties(_this$props4, ["fields", "fieldGroups", "filterFamily", "isFiscalYearEnabled", "hideFilters", "value"]);

      if (hideFilters) {
        return null;
      }

      var serializedValue = fromContactSearch(this.getField, value, filterFamily);
      return /*#__PURE__*/_jsx(XOFilterEditor, Object.assign({}, rest, {
        baseFilterFamily: filterFamily,
        filterFamily: filterFamily,
        isFiscalYearEnabled: isFiscalYearEnabled,
        getFieldDefinitions: this.getFieldDefinitions,
        getFieldGroups: this.getFieldGroups,
        getFields: this.getFields,
        getFilterFamilyObjectName: this.getFilterFamilyObjectName,
        getFilterFamilyOptions: this.getFilterFamilyOptions,
        getOperatorsForType: getContactSearchOperatorsForType,
        getReferenceResolvers: this.getReferenceResolvers,
        getReferenceType: this.getReferenceType,
        getSpecialFieldOptions: this.getSpecialOptionsByReferenceType,
        isRollingDateOffsetInputEnabled: // HACK HubSpot/CRM-Issues#1940
        isScoped(ScopesContainer.get(), 'bet-views-rollingoffset-filtering'),
        onChange: this.handleFilterChange,
        onDraftChange: this.handleDraftChange,
        value: serializedValue
      }));
    }
  }]);

  return ContactSearchFilterEditor;
}(PureComponent);
ContactSearchFilterEditor.propTypes = {
  hasILSListsGate: PropTypes.bool.isRequired,
  className: PropTypes.string,
  currencyCode: PropTypes.string.isRequired,
  fieldGroups: mapOf(PropertyGroupType.isRequired).isRequired,
  fields: mapOf(PropertyType.isRequired).isRequired,
  filterFamily: PropTypes.string.isRequired,
  isFiscalYearEnabled: PropTypes.bool,
  hideFilters: PropTypes.bool,
  isCrmObject: PropTypes.bool.isRequired,
  isXoEnabled: PropTypes.bool.isRequired,
  objectName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onDraftChange: PropTypes.func.isRequired,
  resolvers: PropTypes.objectOf(ReferenceResolverType),
  value: PropTypes.arrayOf(PropTypes.object).isRequired
};
ContactSearchFilterEditor.defaultProps = {
  isCrmObject: false,
  isFiscalYearEnabled: false
};
var getResolvers = ConnectReferenceResolvers(function (resolvers) {
  return {
    resolvers: resolvers
  };
});
export default getResolvers(ContactSearchFilterEditor);