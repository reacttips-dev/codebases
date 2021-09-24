'use es6';

import { AssociationCategoryTypesToIds } from 'customer-data-objects/associations/AssociationCategoryTypes';
import get from 'transmute/get';
export var AssociationColumnRegex = /^associations\.[0-9]+-[0-9]+$/; // We currently have to rely on this somewhat brittle mapping in order to match
// CrmSearch. Ideally this id could be generated on the BE and we could just use
// that but until that is possible we're stuck with this.
// PR that added this to CrmSearch: https://git.hubteam.com/HubSpot/CrmSearch/pull/835
// The format we're creating here looks like this: "associations.0-12"
//
// TODO: There's some work being done to investigate creating a standard id for
// associations here: https://git.hubteam.com/HubSpot/CRM-Issues/issues/5375
// we'll want to replace this with that ID when it's finished

export var makeAssociationId = function makeAssociationId(associationDefinition) {
  return AssociationCategoryTypesToIds[associationDefinition.associationCategory] + "-" + associationDefinition.associationTypeId;
};
/**
 * Parses the association id out of a view column. An association view column
 * has the format "associations.0-1" where the 0-1 is the association id.
 *
 * @param {*} columnName - The name of a view column
 */

export var parseAssociationIdFromColumnName = function parseAssociationIdFromColumnName(columnName) {
  if (!AssociationColumnRegex.test(columnName)) {
    return undefined;
  }

  return columnName.split('.')[1];
};
export var isAssociationColumn = function isAssociationColumn(column) {
  return AssociationColumnRegex.test(get('name', column));
};