'use es6';

import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import get from 'transmute/get';
import { DEAL_TO_PRIMARY_COMPANY_ASSOCIATION_ID, PRIMARY_COMPANY_TO_CONTACT_ASSOCIATION_ID, PRIMARY_COMPANY_TO_DEAL_ASSOCIATION_ID, PRIMARY_COMPANY_TO_TICKET_ASSOCIATION_ID, GENERAL_CONTACT_TO_COMPANY_ASSOCIATION_ID, GENERAL_CONTACT_TO_DEAL_ASSOCIATION_ID, GENERAL_CONTACT_TO_TICKET_ASSOCIATION_ID, GENERAL_DEAL_TO_CONTACT_ASSOCIATION_ID, GENERAL_DEAL_TO_TICKET_ASSOCIATION_ID, GENERAL_TICKET_TO_CONTACT_ASSOCIATION_ID, GENERAL_TICKET_TO_DEAL_ASSOCIATION_ID, GENERAL_COMPANY_TO_CONTACT_ASSOCIATION_ID, GENERAL_COMPANY_TO_DEAL_ASSOCIATION_ID, GENERAL_COMPANY_TO_TICKET_ASSOCIATION_ID, GENERAL_DEAL_TO_COMPANY_ASSOCIATION_ID, GENERAL_TICKET_TO_COMPANY_ASSOCIATION_ID, TICKET_TO_PRIMARY_COMPANY_ASSOCIATION_ID, ASSOCIATED_COMPANY_ID_PROPERTY } from '../constants/AssociationTypeIds';
import { getAssociationColumnLabel } from './getAssociationColumnLabel';
import memoizeOne from 'react-utils/memoizeOne';
import I18n from 'I18n';

var makeAssociationOption = function makeAssociationOption(associationDefinitions, associationTypeId, isUngatedForFlexibleAssociations) {
  var associationDefinition = get(associationTypeId, associationDefinitions);
  return {
    text: getAssociationColumnLabel(associationDefinition, isUngatedForFlexibleAssociations),
    value: "associations." + associationTypeId
  };
};

var getFlexibleAssociationOptionsByObjectType = function getFlexibleAssociationOptionsByObjectType(objectTypeId, associationDefinitions) {
  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      return [// HACK: Primary company is a regular property for contacts so we have to
      // manually add it here. It's filtered out of the properties in the edit
      // columns modal so it will only appear once.
      {
        text: I18n.text('index.associations.specialProperties.primaryCompany'),
        value: ASSOCIATED_COMPANY_ID_PROPERTY
      }, makeAssociationOption(associationDefinitions, GENERAL_CONTACT_TO_COMPANY_ASSOCIATION_ID, true), makeAssociationOption(associationDefinitions, GENERAL_CONTACT_TO_DEAL_ASSOCIATION_ID, true), makeAssociationOption(associationDefinitions, GENERAL_CONTACT_TO_TICKET_ASSOCIATION_ID, true)];

    case COMPANY_TYPE_ID:
      return [makeAssociationOption(associationDefinitions, GENERAL_COMPANY_TO_CONTACT_ASSOCIATION_ID, true), makeAssociationOption(associationDefinitions, GENERAL_COMPANY_TO_DEAL_ASSOCIATION_ID, true), makeAssociationOption(associationDefinitions, GENERAL_COMPANY_TO_TICKET_ASSOCIATION_ID, true)];

    case DEAL_TYPE_ID:
      return [makeAssociationOption(associationDefinitions, GENERAL_DEAL_TO_CONTACT_ASSOCIATION_ID, true), makeAssociationOption(associationDefinitions, GENERAL_DEAL_TO_COMPANY_ASSOCIATION_ID, true), makeAssociationOption(associationDefinitions, GENERAL_DEAL_TO_TICKET_ASSOCIATION_ID, true)];

    case TICKET_TYPE_ID:
      return [makeAssociationOption(associationDefinitions, GENERAL_TICKET_TO_CONTACT_ASSOCIATION_ID, true), makeAssociationOption(associationDefinitions, GENERAL_TICKET_TO_COMPANY_ASSOCIATION_ID, true), makeAssociationOption(associationDefinitions, GENERAL_TICKET_TO_DEAL_ASSOCIATION_ID, true)];

    default:
      return [];
  }
}; // TODO: This is meant as a holdover to move our legacy associations to the new
// associations system. These will eventually be migrated to work like the rest
// of the associations but for now this lets us add support in the Edit Columns
// Modal without changing a whole bunch of stuff.


export var getAssociationOptionsByObjectType = memoizeOne(function (objectTypeId, associationDefinitions, isUngatedForFlexibleAssociations) {
  if (isUngatedForFlexibleAssociations) {
    return getFlexibleAssociationOptionsByObjectType(objectTypeId, associationDefinitions);
  }

  if (objectTypeId === CONTACT_TYPE_ID) {
    return [// HACK: Associated company is a regular property for contacts so we have to
    // manually add it here. It's filtered out of the properties in the edit
    // columns modal so it will only appear once.
    {
      text: I18n.text('index.associations.specialProperties.associatedCompany'),
      value: ASSOCIATED_COMPANY_ID_PROPERTY
    }, makeAssociationOption(associationDefinitions, GENERAL_CONTACT_TO_DEAL_ASSOCIATION_ID, false), makeAssociationOption(associationDefinitions, GENERAL_CONTACT_TO_TICKET_ASSOCIATION_ID, false)];
  } else if (objectTypeId === COMPANY_TYPE_ID) {
    return [makeAssociationOption(associationDefinitions, PRIMARY_COMPANY_TO_CONTACT_ASSOCIATION_ID, isUngatedForFlexibleAssociations), makeAssociationOption(associationDefinitions, PRIMARY_COMPANY_TO_DEAL_ASSOCIATION_ID, isUngatedForFlexibleAssociations), makeAssociationOption(associationDefinitions, PRIMARY_COMPANY_TO_TICKET_ASSOCIATION_ID, isUngatedForFlexibleAssociations)];
  } else if (objectTypeId === DEAL_TYPE_ID) {
    return [makeAssociationOption(associationDefinitions, GENERAL_DEAL_TO_CONTACT_ASSOCIATION_ID, isUngatedForFlexibleAssociations), makeAssociationOption(associationDefinitions, DEAL_TO_PRIMARY_COMPANY_ASSOCIATION_ID, isUngatedForFlexibleAssociations), makeAssociationOption(associationDefinitions, GENERAL_DEAL_TO_TICKET_ASSOCIATION_ID, isUngatedForFlexibleAssociations)];
  } else if (objectTypeId === TICKET_TYPE_ID) {
    return [makeAssociationOption(associationDefinitions, GENERAL_TICKET_TO_CONTACT_ASSOCIATION_ID, isUngatedForFlexibleAssociations), makeAssociationOption(associationDefinitions, TICKET_TO_PRIMARY_COMPANY_ASSOCIATION_ID, isUngatedForFlexibleAssociations), makeAssociationOption(associationDefinitions, GENERAL_TICKET_TO_DEAL_ASSOCIATION_ID, isUngatedForFlexibleAssociations)];
  }

  return [];
});