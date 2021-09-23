'use es6';

import { COMPANY, CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import FilterDefinitionHierarchicalTeams from './FilterDefinitionHierarchicalTeams';
import FilterDefinitionOwners from './FilterDefinitionOwners';
import makeAssociationField from './makeAssociationField';
export default {
  associatedcompanyid: makeAssociationField(COMPANY, CONTACT),
  hubspot_owner_id: FilterDefinitionOwners,
  hubspot_team_id: FilterDefinitionHierarchicalTeams
};