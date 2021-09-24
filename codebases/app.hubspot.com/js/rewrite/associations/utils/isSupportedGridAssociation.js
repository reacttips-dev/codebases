'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _CONTACT_TYPE_ID, _COMPANY_TYPE_ID, _DEAL_TYPE_ID, _TICKET_TYPE_ID, _SupportedHubSpotDefi;

import { HUBSPOT_DEFINED } from 'customer-data-objects/associations/AssociationCategoryTypes';
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import getIn from 'transmute/getIn';
var SupportedHubSpotDefinedObjectAssociations = (_SupportedHubSpotDefi = {}, _defineProperty(_SupportedHubSpotDefi, CONTACT_TYPE_ID, (_CONTACT_TYPE_ID = {}, _defineProperty(_CONTACT_TYPE_ID, COMPANY_TYPE_ID, true), _defineProperty(_CONTACT_TYPE_ID, DEAL_TYPE_ID, true), _defineProperty(_CONTACT_TYPE_ID, TICKET_TYPE_ID, true), _CONTACT_TYPE_ID)), _defineProperty(_SupportedHubSpotDefi, COMPANY_TYPE_ID, (_COMPANY_TYPE_ID = {}, _defineProperty(_COMPANY_TYPE_ID, CONTACT_TYPE_ID, true), _defineProperty(_COMPANY_TYPE_ID, COMPANY_TYPE_ID, true), _defineProperty(_COMPANY_TYPE_ID, DEAL_TYPE_ID, true), _defineProperty(_COMPANY_TYPE_ID, TICKET_TYPE_ID, true), _COMPANY_TYPE_ID)), _defineProperty(_SupportedHubSpotDefi, DEAL_TYPE_ID, (_DEAL_TYPE_ID = {}, _defineProperty(_DEAL_TYPE_ID, CONTACT_TYPE_ID, true), _defineProperty(_DEAL_TYPE_ID, COMPANY_TYPE_ID, true), _defineProperty(_DEAL_TYPE_ID, TICKET_TYPE_ID, true), _DEAL_TYPE_ID)), _defineProperty(_SupportedHubSpotDefi, TICKET_TYPE_ID, (_TICKET_TYPE_ID = {}, _defineProperty(_TICKET_TYPE_ID, CONTACT_TYPE_ID, true), _defineProperty(_TICKET_TYPE_ID, COMPANY_TYPE_ID, true), _defineProperty(_TICKET_TYPE_ID, DEAL_TYPE_ID, true), _TICKET_TYPE_ID)), _SupportedHubSpotDefi);
export var isSupportedGridAssociation = function isSupportedGridAssociation(associationDefinition) {
  var isHubSpotDefinedAssociation = associationDefinition.associationCategory === HUBSPOT_DEFINED;
  var isSupportedHubSpotDefinedObjectAssociation = getIn([associationDefinition.fromObjectTypeId, associationDefinition.toObjectTypeId], SupportedHubSpotDefinedObjectAssociations);

  if (isHubSpotDefinedAssociation && isSupportedHubSpotDefinedObjectAssociation) {
    return true;
  }

  return false;
};