'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _OBJECT_TYPE_TO_PROPE;

import AssociateObjectSidebar from './AssociateObjectSidebar';
import CompanyCreatorProperties from 'crm_schema/creator/CompanyCreatorProperties';
import { connect } from 'general-store';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import ContactCreatorProperties from 'crm_schema/creator/ContactCreatorProperties';
import CurrentOwnerIdStore from 'crm_data/owners/CurrentOwnerIdStore';
import DealCreatorProperties from 'crm_schema/creator/DealCreatorProperties';
import PropTypes from 'prop-types';
import { Record, List } from 'immutable';
import TicketCreatorProperties from 'crm_schema/creator/TicketCreatorProperties';
import { transformPostedParamsToObjectCreatorParams, validObjectCreatorParams } from '../creator/ObjectCreator';
import { getAssociationsFromStore, getAssociatedObjectIdFromStore } from '../engagementAssociations/dependencies/AssociationStoreDependencyHelper';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import CompaniesStore from 'crm_data/companies/CompaniesStore';
import DealsStore from 'crm_data/deals/DealsStore';
import TicketsStore from 'crm_data/tickets/TicketsStore';
import AssociationsStore from 'crm_data/associations/AssociationsStore';
import { LOADING, EMPTY, isLoading } from 'crm_data/flux/LoadingStatus';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import { NONE_PROVIDED } from './dependencies/primaryAssociationConstants';
var OBJECT_TYPE_TO_PROPERTIES = (_OBJECT_TYPE_TO_PROPE = {}, _defineProperty(_OBJECT_TYPE_TO_PROPE, CONTACT, ContactCreatorProperties), _defineProperty(_OBJECT_TYPE_TO_PROPE, COMPANY, CompanyCreatorProperties), _defineProperty(_OBJECT_TYPE_TO_PROPE, DEAL, DealCreatorProperties), _defineProperty(_OBJECT_TYPE_TO_PROPE, TICKET, TicketCreatorProperties), _OBJECT_TYPE_TO_PROPE);
export var dependencies = {
  currentOwnerId: {
    stores: [CurrentOwnerIdStore],
    deref: function deref() {
      var ownerId = CurrentOwnerIdStore.get(); // if owner ID is -1 we want to default to null so we don't send
      // an invalid owner ID on create

      return ownerId !== -1 ? ownerId : null;
    }
  },
  contactAssociatedCompanyId: {
    stores: [AssociationsStore, CompaniesStore],
    deref: function deref(_ref) {
      var subjectId = _ref.subjectId,
          objectType = _ref.objectType;

      if (objectType !== CONTACT) {
        return EMPTY;
      }

      if (!subjectId) {
        return LOADING;
      }

      var associations = getAssociationsFromStore(CONTACT, subjectId, COMPANY);

      if (isLoading(associations)) {
        return LOADING;
      }

      return associations && associations.length ? associations[0].id : EMPTY;
    }
  },
  primaryAssociatedObjectId: {
    stores: [AssociationsStore, ContactsStore, CompaniesStore, DealsStore, TicketsStore],
    deref: function deref(_ref2) {
      var subjectId = _ref2.subjectId,
          objectType = _ref2.objectType,
          associationObjectType = _ref2.associationObjectType;

      if (![CONTACT, COMPANY, DEAL, TICKET].includes(objectType)) {
        return NONE_PROVIDED;
      }

      if (!subjectId) {
        return LOADING;
      }

      var association = getAssociatedObjectIdFromStore(objectType, subjectId, associationObjectType);

      if (isLoading(association)) {
        return LOADING;
      }

      var ids = association.toArray();
      return ids.length ? ids[0] : NONE_PROVIDED;
    }
  }
};
export var getCreatorDefaultProperties = function getCreatorDefaultProperties(_ref3) {
  var associationObjectType = _ref3.associationObjectType,
      contactAssociatedCompanyId = _ref3.contactAssociatedCompanyId;

  if ([DEAL, TICKET].includes(associationObjectType) && contactAssociatedCompanyId) {
    return {
      associatedcompanyid: contactAssociatedCompanyId
    };
  }

  return {};
};
export var getObjectCreatorParams = function getObjectCreatorParams(_ref4) {
  var sourceApp = _ref4.sourceApp,
      objectType = _ref4.objectType,
      associationObjectType = _ref4.associationObjectType,
      subjectId = _ref4.subjectId,
      contactAssociatedCompanyId = _ref4.contactAssociatedCompanyId,
      currentOwnerId = _ref4.currentOwnerId,
      additionalProperties = _ref4.additionalProperties,
      additionalRequiredProperties = _ref4.additionalRequiredProperties,
      ignoreDefaultCreatorProperties = _ref4.ignoreDefaultCreatorProperties;

  if (!sourceApp || !objectType || !associationObjectType || !subjectId || isLoading(contactAssociatedCompanyId)) {
    return null;
  }

  var creatorParams = {
    sourceApp: sourceApp,
    objectType: associationObjectType,
    association: Record({
      objectType: objectType,
      objectId: subjectId
    }, 'ObjectCreatorAssociation')(),
    properties: OBJECT_TYPE_TO_PROPERTIES[associationObjectType](Object.assign({
      hubspot_owner_id: currentOwnerId
    }, getCreatorDefaultProperties({
      associationObjectType: associationObjectType,
      contactAssociatedCompanyId: contactAssociatedCompanyId
    }))),
    additionalProperties: additionalProperties && List(additionalProperties),
    additionalRequiredProperties: additionalRequiredProperties && List(additionalRequiredProperties),
    ignoreDefaultCreatorProperties: ignoreDefaultCreatorProperties
  };

  if (!validObjectCreatorParams(creatorParams)) {
    return null;
  }

  return transformPostedParamsToObjectCreatorParams(creatorParams);
};

var AssociateObjectSidebarContainer = function AssociateObjectSidebarContainer(_ref5) {
  var currentOwnerId = _ref5.currentOwnerId,
      contactAssociatedCompanyId = _ref5.contactAssociatedCompanyId,
      additionalProperties = _ref5.additionalProperties,
      additionalRequiredProperties = _ref5.additionalRequiredProperties,
      ignoreDefaultCreatorProperties = _ref5.ignoreDefaultCreatorProperties,
      onObjectCreated = _ref5.onObjectCreated,
      onConfirmError = _ref5.onConfirmError,
      onAssociationsUpdated = _ref5.onAssociationsUpdated,
      onReject = _ref5.onReject,
      primaryAssociatedObjectId = _ref5.primaryAssociatedObjectId,
      associationObjectType = _ref5.associationObjectType,
      objectType = _ref5.objectType,
      sourceApp = _ref5.sourceApp,
      subjectId = _ref5.subjectId,
      bodyText = _ref5.bodyText,
      isEmbedded = _ref5.isEmbedded;
  return /*#__PURE__*/_jsx(AssociateObjectSidebar, {
    onObjectCreated: onObjectCreated,
    onConfirmError: onConfirmError,
    onAssociationsUpdated: onAssociationsUpdated,
    associationObjectType: associationObjectType,
    objectCreatorParams: getObjectCreatorParams({
      sourceApp: sourceApp,
      objectType: objectType,
      associationObjectType: associationObjectType,
      subjectId: subjectId,
      contactAssociatedCompanyId: contactAssociatedCompanyId,
      currentOwnerId: currentOwnerId,
      additionalProperties: additionalProperties,
      additionalRequiredProperties: additionalRequiredProperties,
      ignoreDefaultCreatorProperties: ignoreDefaultCreatorProperties
    }),
    objectType: objectType,
    onReject: onReject,
    primaryAssociatedObjectId: primaryAssociatedObjectId,
    sourceApp: sourceApp,
    subjectId: subjectId,
    bodyText: bodyText,
    isEmbedded: isEmbedded
  });
};

export default connect(dependencies)(AssociateObjectSidebarContainer);
export { AssociateObjectSidebarContainer as WrappedComponent };
AssociateObjectSidebarContainer.propTypes = {
  currentOwnerId: PropTypes.number,
  contactAssociatedCompanyId: PropTypes.number,
  additionalProperties: PropTypes.arrayOf(PropTypes.string),
  additionalRequiredProperties: PropTypes.arrayOf(PropTypes.string),
  ignoreDefaultCreatorProperties: PropTypes.bool,
  onObjectCreated: PropTypes.func.isRequired,
  onConfirmError: PropTypes.func.isRequired,
  onAssociationsUpdated: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  primaryAssociatedObjectId: PropTypes.number,
  associationObjectType: ObjectTypesType,
  objectType: ObjectTypesType,
  sourceApp: PropTypes.string,
  subjectId: PropTypes.string,
  bodyText: PropTypes.string,
  isEmbedded: PropTypes.bool
};