'use es6';

import { COMPANY } from 'customer-data-objects/constants/ObjectTypes';
import FilterDefinitionHierarchicalTeams from './FilterDefinitionHierarchicalTeams';
import FilterDefinitionOwners from './FilterDefinitionOwners';
import makeAssociationField from './makeAssociationField';
export default {
  hs_parent_company_id: makeAssociationField(COMPANY, COMPANY),
  hubspot_owner_id: FilterDefinitionOwners,
  hubspot_team_id: FilterDefinitionHierarchicalTeams
};