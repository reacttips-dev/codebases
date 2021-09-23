'use es6';

import { COMPANY, CONTACT, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import FilterDefinitionHierarchicalTeams from './FilterDefinitionHierarchicalTeams';
import FilterDefinitionOwners from './FilterDefinitionOwners';
import makeAssociationField from './makeAssociationField';
export default {
  'associations.contact': makeAssociationField(CONTACT, TICKET),
  'associations.company': makeAssociationField(COMPANY, TICKET),
  hubspot_owner_id: FilterDefinitionOwners,
  hubspot_team_id: FilterDefinitionHierarchicalTeams
};