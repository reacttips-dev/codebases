'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';
import { DEALS, COMPANIES, CONTACTS } from '../../constants/dataTypes';
import { InboundDbModule } from '../../module';
import { hydrate as _hydrate } from '../../retrieve/inboundDb/dynamicHydrate';
import { adapt } from '../../references/adapt';
import pipeline from '../../references/pipeline';
import ownerReferences from '../../references/owner';
import teamReferences from '../../references/team';
import userReferences from '../../references/user';
import pipelineStageReferences from '../../references/pipelineStage';
import currencyReferences from '../../references/currency';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';
var idProperty = 'dealId';

var getInboundSpec = function getInboundSpec() {
  return new Spec({
    dataType: DEALS,
    search: {
      url: "contacts/search/v1/search/deals",
      objectsField: 'deals'
    },
    properties: {
      idProperty: idProperty,
      responsePaths: {
        dealId: ['dealId']
      },
      references: {
        'associations.company': COMPANIES
      }
    },
    hydrate: {
      inputs: ImmutableSet([idProperty, 'dealname']),
      fn: function fn(obj) {
        return !obj ? I18n.text('reporting-data.references.deal.unknown', {
          id: obj[idProperty]
        }) : obj.dealname;
      }
    }
  });
};

export default InboundDbModule({
  dataType: DEALS,
  references: ImmutableMap({
    pipeline: adapt(pipeline(DEALS)),
    hubspot_owner_id: adapt(ownerReferences),
    hubspot_team_id: adapt(teamReferences),
    dealstage: function dealstage() {
      return adapt(pipelineStageReferences(DEALS, [{
        stageId: 'create',
        label: I18n.text('reporting-data.properties.deals.stage.create')
      }])).apply(void 0, arguments);
    },
    deal_currency_code: adapt(currencyReferences),
    currency: adapt(currencyReferences),
    hs_created_by_user_id: adapt(userReferences)
  }),
  referenceProperties: ImmutableMap({
    'associations.company': COMPANIES,
    'associations.contact': CONTACTS,
    dealId: DEALS
  }),
  hydrate: function hydrate(ids, config) {
    return _hydrate(DEALS, ids, config);
  },
  getInboundSpec: getInboundSpec
});