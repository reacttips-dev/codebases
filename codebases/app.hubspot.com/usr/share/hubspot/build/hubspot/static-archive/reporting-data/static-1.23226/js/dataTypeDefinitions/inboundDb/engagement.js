'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';
import { CONTACTS, COMPANIES, ENGAGEMENT, DEALS, TICKETS } from '../../constants/dataTypes';
import { InboundDbModule } from '../../module';
import { hydrate as _hydrate } from '../../retrieve/inboundDb/dynamicHydrate';
import { adapt } from '../../references/adapt';
import { combine } from '../../references/combine';
import remoteReferences from '../../references/remote';
import teamReferences from '../../references/team';
import ownerReferences from '../../references/owner';
import campaignsReferences from '../../references/campaign';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';
import { getCommonExtractors, getCallExtractors, getConversationSessionExtractors, getFeedbackSubmissionExtractors, getNoteExtractors, getEmailExtractors, getMeetingExtractors, getTaskExtractors } from '../../retrieve/inboundDb/common/engagement-extractors';
var responsePaths = {
  'associations.contact': ['associations', 'contactIds'],
  'associations.company': ['associations', 'companyIds'],
  'associations.deal': ['associations', 'dealIds'],
  'associations.ticket': ['associations', 'ticketIds'],
  'engagement.id': ['engagement', 'id'],
  'engagement.timestamp': ['engagement', 'timestamp'],
  'engagement.createdAt': ['engagement', 'createdAt'],
  'engagement.ownerId': ['engagement', 'ownerId'],
  'engagement.createdBy': ['engagement', 'createdBy'],
  'engagement.lastUpdated': ['engagement', 'lastUpdated'],
  'engagement.modifiedBy': ['engagement', 'modifiedBy'],
  'engagement.type': ['engagement', 'type'],
  'engagement.teamId': ['engagement', 'teamId'],
  'engagement.source': ['engagement', 'source'],
  'engagement.activityType': ['engagement', 'activityType'],
  // BET-specific properties (PROD 53 ONLY)
  'engagement.productName': ['engagement', 'productName'],
  'engagement.followUpAction': ['engagement', 'followUpAction']
};
var extractors = Object.assign({}, getCommonExtractors(), {}, getCallExtractors(), {}, getConversationSessionExtractors(), {}, getFeedbackSubmissionExtractors(), {}, getNoteExtractors(), {}, getEmailExtractors(), {}, getMeetingExtractors(), {}, getTaskExtractors());
var idProperty = 'engagement.id';

var getInboundSpec = function getInboundSpec() {
  return new Spec({
    dataType: ENGAGEMENT,
    search: {
      url: 'contacts/search/v1/search/engagements',
      objectsField: 'engagements'
    },
    properties: {
      idProperty: idProperty,
      responsePaths: responsePaths,
      extractors: extractors
    },
    hydrate: {
      inputs: ImmutableSet([idProperty, 'title']),
      fn: function fn(obj) {
        return !obj ? I18n.text('reporting-data.references.activity.unknown', {
          id: obj[idProperty]
        }) : obj.title || I18n.text('reporting-data.references.activity.untitled', {
          id: obj[idProperty]
        });
      }
    }
  });
};

export default InboundDbModule({
  dataType: ENGAGEMENT,
  references: ImmutableMap({
    'engagement.createdBy': adapt(remoteReferences),
    'engagement.modifiedBy': adapt(remoteReferences),
    'engagement.teamId': adapt(teamReferences),
    'engagement.ownerId': combine(adapt(remoteReferences), adapt(ownerReferences)),
    'publishingTask.campaignGuid': adapt(campaignsReferences)
  }),
  referenceProperties: ImmutableMap({
    'associations.company': COMPANIES,
    'associations.contact': CONTACTS,
    'associations.deal': DEALS,
    'associations.tickets': TICKETS,
    'engagement.id': ENGAGEMENT
  }),
  hydrate: function hydrate(ids, config) {
    return _hydrate(ENGAGEMENT, ids, config);
  },
  getInboundSpec: getInboundSpec
});