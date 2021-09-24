'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { CONTACTS, COMPANIES } from '../../constants/dataTypes';
import { InboundDbModule } from '../../module';
import { hydrate as _hydrate } from '../../retrieve/inboundDb/dynamicHydrate';
import { adapt } from '../../references/adapt';
import { combine } from '../../references/combine';
import listReferences from '../../references/list';
import formReferences from '../../references/form';
import ownerReferences from '../../references/owner';
import teamReferences from '../../references/team';
import campaignReferences from '../../references/campaign';
import emailReferences from '../../references/email';
import importReferences from '../../references/import';
import salesforceCampaignReferences from '../../references/salesforce-campaign';
import companyReferences from '../../references/company';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';
import { idProperty, hydrateFn, hydrateInputs } from '../../references/contact/hydrate';
import integrationsReferences from '../../references/integrations';
import { getMarketableContactReferences, adapt as adaptMarketableReason } from '../../references/marketableReason';

var getInboundSpec = function getInboundSpec() {
  return new Spec({
    dataType: CONTACTS,
    search: {
      url: 'contacts/search/v1/search/contacts',
      objectsField: 'contacts'
    },
    properties: {
      idProperty: idProperty,
      responsePaths: {
        vid: ['vid'],
        hs_marketable_reason_id: ['vid']
      }
    },
    hydrate: {
      inputs: ImmutableSet(hydrateInputs),
      fn: hydrateFn
    }
  });
};

export default InboundDbModule({
  dataType: CONTACTS,
  references: ImmutableMap({
    'listMemberships.listId': adapt(listReferences),
    'formSubmissions.formId': adapt(formReferences),
    hubspot_owner_id: adapt(ownerReferences),
    hubspot_team_id: adapt(teamReferences),
    hs_analytics_first_touch_converting_campaign: adapt(campaignReferences),
    hs_analytics_last_touch_converting_campaign: adapt(campaignReferences),
    hs_marketable_reason_id: adaptMarketableReason(getMarketableContactReferences),
    hs_analytics_source_data_2: combine(adapt(integrationsReferences), adapt(emailReferences), adapt(importReferences)),
    salesforcecampaignids: adapt(salesforceCampaignReferences),
    associatedcompanyid: adapt(companyReferences)
  }),
  referenceProperties: ImmutableMap({
    'associations.company': COMPANIES,
    'associations.contact': CONTACTS,
    vid: CONTACTS
  }),
  hydrate: function hydrate(ids, config) {
    return _hydrate(CONTACTS, ids, config);
  },
  getInboundSpec: getInboundSpec
});