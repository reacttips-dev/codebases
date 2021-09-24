'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _COMPANY_TYPE_ID, _DEAL_TYPE_ID, _TICKET_TYPE_ID, _FLEXIBLE_ASSOCIATION, _COMPANY_TYPE_ID2, _DEAL_TYPE_ID2, _TICKET_TYPE_ID2, _STANDARD_ASSOCIATION;

import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import getIn from 'transmute/getIn';
import { DEAL_TO_PRIMARY_COMPANY_ASSOCIATION_ID, GENERAL_COMPANY_TO_CONTACT_ASSOCIATION_ID, GENERAL_COMPANY_TO_DEAL_ASSOCIATION_ID, GENERAL_COMPANY_TO_TICKET_ASSOCIATION_ID, GENERAL_CONTACT_TO_COMPANY_ASSOCIATION_ID, GENERAL_DEAL_TO_COMPANY_ASSOCIATION_ID, GENERAL_DEAL_TO_CONTACT_ASSOCIATION_ID, GENERAL_TICKET_TO_COMPANY_ASSOCIATION_ID, GENERAL_TICKET_TO_CONTACT_ASSOCIATION_ID, PRIMARY_COMPANY_TO_CONTACT_ASSOCIATION_ID, PRIMARY_COMPANY_TO_DEAL_ASSOCIATION_ID, PRIMARY_COMPANY_TO_TICKET_ASSOCIATION_ID, TICKET_TO_PRIMARY_COMPANY_ASSOCIATION_ID } from '../constants/AssociationTypeIds';
import { ASSOCIATED_WITH, RELATES_TO_COMPANY, RELATES_TO_CONTACT } from '../constants/LegacyAssociationColumnNames';
import { AssociationColumnRegex } from './associationIdUtils'; // When flexible associations is ungated we want to do different replacements
// because the association ids change

var FLEXIBLE_ASSOCIATION_COLUMN_REPLACEMENTS = (_FLEXIBLE_ASSOCIATION = {}, _defineProperty(_FLEXIBLE_ASSOCIATION, COMPANY_TYPE_ID, (_COMPANY_TYPE_ID = {}, _defineProperty(_COMPANY_TYPE_ID, "associations." + PRIMARY_COMPANY_TO_CONTACT_ASSOCIATION_ID, ["associations." + GENERAL_COMPANY_TO_CONTACT_ASSOCIATION_ID]), _defineProperty(_COMPANY_TYPE_ID, "associations." + PRIMARY_COMPANY_TO_DEAL_ASSOCIATION_ID, ["associations." + GENERAL_COMPANY_TO_DEAL_ASSOCIATION_ID]), _defineProperty(_COMPANY_TYPE_ID, "associations." + PRIMARY_COMPANY_TO_TICKET_ASSOCIATION_ID, ["associations." + GENERAL_COMPANY_TO_TICKET_ASSOCIATION_ID]), _COMPANY_TYPE_ID)), _defineProperty(_FLEXIBLE_ASSOCIATION, DEAL_TYPE_ID, (_DEAL_TYPE_ID = {}, _defineProperty(_DEAL_TYPE_ID, ASSOCIATED_WITH, ["associations." + GENERAL_DEAL_TO_CONTACT_ASSOCIATION_ID, "associations." + GENERAL_DEAL_TO_COMPANY_ASSOCIATION_ID]), _defineProperty(_DEAL_TYPE_ID, "associations." + DEAL_TO_PRIMARY_COMPANY_ASSOCIATION_ID, ["associations." + GENERAL_DEAL_TO_COMPANY_ASSOCIATION_ID]), _DEAL_TYPE_ID)), _defineProperty(_FLEXIBLE_ASSOCIATION, TICKET_TYPE_ID, (_TICKET_TYPE_ID = {}, _defineProperty(_TICKET_TYPE_ID, RELATES_TO_CONTACT, ["associations." + GENERAL_TICKET_TO_CONTACT_ASSOCIATION_ID]), _defineProperty(_TICKET_TYPE_ID, RELATES_TO_COMPANY, ["associations." + GENERAL_TICKET_TO_COMPANY_ASSOCIATION_ID]), _defineProperty(_TICKET_TYPE_ID, "associations." + TICKET_TO_PRIMARY_COMPANY_ASSOCIATION_ID, ["associations." + GENERAL_TICKET_TO_COMPANY_ASSOCIATION_ID]), _TICKET_TYPE_ID)), _FLEXIBLE_ASSOCIATION);
var STANDARD_ASSOCIATION_COLUMN_REPLACEMENTS = (_STANDARD_ASSOCIATION = {}, _defineProperty(_STANDARD_ASSOCIATION, CONTACT_TYPE_ID, _defineProperty({}, "associations." + GENERAL_CONTACT_TO_COMPANY_ASSOCIATION_ID, [])), _defineProperty(_STANDARD_ASSOCIATION, COMPANY_TYPE_ID, (_COMPANY_TYPE_ID2 = {}, _defineProperty(_COMPANY_TYPE_ID2, "associations." + GENERAL_COMPANY_TO_CONTACT_ASSOCIATION_ID, ["associations." + PRIMARY_COMPANY_TO_CONTACT_ASSOCIATION_ID]), _defineProperty(_COMPANY_TYPE_ID2, "associations." + GENERAL_COMPANY_TO_DEAL_ASSOCIATION_ID, ["associations." + PRIMARY_COMPANY_TO_DEAL_ASSOCIATION_ID]), _defineProperty(_COMPANY_TYPE_ID2, "associations." + GENERAL_COMPANY_TO_TICKET_ASSOCIATION_ID, ["associations." + PRIMARY_COMPANY_TO_TICKET_ASSOCIATION_ID]), _COMPANY_TYPE_ID2)), _defineProperty(_STANDARD_ASSOCIATION, DEAL_TYPE_ID, (_DEAL_TYPE_ID2 = {}, _defineProperty(_DEAL_TYPE_ID2, ASSOCIATED_WITH, ["associations." + GENERAL_DEAL_TO_CONTACT_ASSOCIATION_ID, "associations." + DEAL_TO_PRIMARY_COMPANY_ASSOCIATION_ID]), _defineProperty(_DEAL_TYPE_ID2, "associations." + GENERAL_DEAL_TO_COMPANY_ASSOCIATION_ID, ["associations." + DEAL_TO_PRIMARY_COMPANY_ASSOCIATION_ID]), _DEAL_TYPE_ID2)), _defineProperty(_STANDARD_ASSOCIATION, TICKET_TYPE_ID, (_TICKET_TYPE_ID2 = {}, _defineProperty(_TICKET_TYPE_ID2, RELATES_TO_CONTACT, ["associations." + GENERAL_TICKET_TO_CONTACT_ASSOCIATION_ID]), _defineProperty(_TICKET_TYPE_ID2, RELATES_TO_COMPANY, ["associations." + TICKET_TO_PRIMARY_COMPANY_ASSOCIATION_ID]), _defineProperty(_TICKET_TYPE_ID2, "associations." + GENERAL_TICKET_TO_COMPANY_ASSOCIATION_ID, ["associations." + TICKET_TO_PRIMARY_COMPANY_ASSOCIATION_ID]), _TICKET_TYPE_ID2)), _STANDARD_ASSOCIATION); // TODO: When IKEA is totally rolled out we can simplify this to create the columns
// The old code requires us to do this by column name
//
// Some context on why this has to exist - While we're rolling new associations
// and flexible associations certain associations can cause the page to crash
// and have to be removed. They fall into 4 camps which I'll list below.
// Eventually we'll be able to completely remove this function but it's needed
// until we can move everyone onto the new association columns to avoid letting
// columns that won't render correctly through.
//
// 1. Legacy Association Columns - These are things like the relatesTo column
// for deals and the relatesToContact/Company columns for tickets. These will not
// work for flexible associations (and they don't really work now) so we want to
// replace them with the new association columns
//
// This will likely require a backfill to be removed, we'll also have to replace
// the required columns for each object type to use association columns instead
// of the legacy column
//
// 2. Standard association columns that are changed by flexible associations -
// These are columns that currently represent all the association data for an
// object but with the release of flexible associations they will no longer do
// so. Think of things like the primary company to contact association, right
// now it shows all the associations but with flexible associations it will have
// to be replaced with the general association to do that.
//
// This will require a backfill to be removed. Once flexible associations is out
// to all we'll have to remove all the columns that aren't applicable anymore.
//
// 3. Flexible association columns that do not exist without the gate - These
// associations have to removed as columns when a user is gated to the flexible
// associations beta. Associations in this group can cause page crashes when the
// gate is not on so we must remove them in those cases.
//
// We can remove this check when the new association definitions are backfilled
// into all portals
//
// 4. Association columns when the user is not ungated to the new association
// columns - This group will only happen when we have to re-gate users during our
// rollout. We have to clean up any association columns that are left over to
// avoid running into issues with them while we render.
//
// We can remove this check when this is ungated to all

export var replaceInvalidAssociationColumnByName = function replaceInvalidAssociationColumnByName(columnName, objectTypeId, isNewAssociationsUngated, isFlexibleAssociationsUngated) {
  // Remove any association columns if the user isn't ungated to the new experience
  if (!isNewAssociationsUngated) {
    if (AssociationColumnRegex.test(columnName)) {
      return [];
    }

    return [columnName];
  }

  var replacementLookupTable = isFlexibleAssociationsUngated ? FLEXIBLE_ASSOCIATION_COLUMN_REPLACEMENTS : STANDARD_ASSOCIATION_COLUMN_REPLACEMENTS;
  return getIn([objectTypeId, columnName], replacementLookupTable) || [columnName];
};