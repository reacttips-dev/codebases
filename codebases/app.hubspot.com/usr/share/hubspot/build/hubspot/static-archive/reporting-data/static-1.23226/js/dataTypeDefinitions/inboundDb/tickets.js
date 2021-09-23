'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { InboundDbModule } from '../../module';
import { TICKETS, COMPANIES, CONTACTS } from '../../constants/dataTypes';
import { hydrate as _hydrate } from '../../retrieve/inboundDb/dynamicHydrate';
import { adapt } from '../../references/adapt';
import ownerReferences from '../../references/owner';
import teamReferences from '../../references/team';
import pipelineReferences from '../../references/pipeline';
import pipelineStageReferences from '../../references/pipelineStage';
import extractTicketCategory from '../../retrieve/inboundDb/common/ticket-category';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';

var getInboundSpec = function getInboundSpec() {
  return new Spec({
    dataType: TICKETS,
    properties: {
      idProperty: 'hs_ticket_id',
      responsePaths: {
        hs_ticket_id: ['hs_ticket_id']
      },
      extractors: {
        hs_ticket_category: extractTicketCategory,
        hs_ticket_id: function hs_ticket_id(props) {
          return props.getIn(['properties', 'hs_ticket_id', 'value']);
        },
        subject: function subject(props) {
          return props.getIn(['properties', 'subject', 'value']);
        }
      }
    },
    search: {
      url: 'contacts/search/v1/search/services/tickets',
      objectsField: 'results'
    },
    hydrate: {
      inputs: ImmutableSet(['hs_ticket_id', 'subject']),
      fn: function fn(props) {
        return props.subject + " (" + props['hs_ticket_id'] + ")";
      }
    }
  });
};

export default InboundDbModule({
  dataType: TICKETS,
  references: ImmutableMap({
    hubspot_owner_id: adapt(ownerReferences),
    hubspot_team_id: adapt(teamReferences),
    hs_pipeline: adapt(pipelineReferences(TICKETS)),
    hs_pipeline_stage: adapt(pipelineStageReferences(TICKETS))
  }),
  referenceProperties: ImmutableMap({
    'associations.company': COMPANIES,
    'associations.contact': CONTACTS,
    hs_ticket_id: TICKETS
  }),
  hydrate: function hydrate(ids, config) {
    return _hydrate(TICKETS, ids, config);
  },
  getInboundSpec: getInboundSpec
});