'use es6';

import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes'; // TODO: DO ALL THE TYPES

export var referencedObjectTypes = Object.assign({
  deal_currency_code: ReferenceObjectTypes.MULTI_CURRENCY_INFORMATION,
  deal_stage: ReferenceObjectTypes.DEAL_PIPELINE_STAGE,
  dealstage: ReferenceObjectTypes.DEAL_PIPELINE_STAGE,
  hs_pipeline: ReferenceObjectTypes.TICKET_PIPELINE,
  hs_pipeline_stage: ReferenceObjectTypes.TICKET_STAGE,
  hubspot_owner_id: ReferenceObjectTypes.OWNER,
  hubspot_team_id: ReferenceObjectTypes.TEAM,
  pipeline: ReferenceObjectTypes.DEAL_PIPELINE
}, ReferenceObjectTypes);