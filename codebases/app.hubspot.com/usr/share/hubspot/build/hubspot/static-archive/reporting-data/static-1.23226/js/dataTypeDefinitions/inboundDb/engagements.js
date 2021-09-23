'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';
import { CONTACTS, COMPANIES, ENGAGEMENTS } from '../../constants/dataTypes';
import { InboundDbModule } from '../../module';
import { hydrate as _hydrate } from '../../retrieve/inboundDb/dynamicHydrate';
import { adapt } from '../../references/adapt';
import { combine } from '../../references/combine';
import remoteReferences from '../../references/remote';
import teamReferences from '../../references/team';
import ownerReferences from '../../references/owner';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';
var idProperty = 'hs_unique_id';

var getInboundSpec = function getInboundSpec() {
  return Spec({
    dataType: ENGAGEMENTS,
    search: {},
    properties: {
      idProperty: idProperty
    },
    hydrate: {
      inputs: ImmutableSet([idProperty, 'title']),
      fn: function fn(obj) {
        return !obj ? I18n.text('reporting-data.references.activity.unknown', {
          id: obj[idProperty]
        }) : obj.title;
      }
    }
  });
};

export default InboundDbModule({
  dataType: ENGAGEMENTS,
  references: ImmutableMap({
    hubspot_owner_id: combine(adapt(remoteReferences), adapt(ownerReferences)),
    hubspot_team_id: adapt(teamReferences),
    hs_created_by: adapt(remoteReferences),
    hs_modified_by: adapt(remoteReferences)
  }),
  referenceProperties: ImmutableMap({
    'associations.company': COMPANIES,
    'associations.contact': CONTACTS,
    hs_unique_id: ENGAGEMENTS
  }),
  hydrate: function hydrate(ids, config) {
    return _hydrate(ENGAGEMENTS, ids, config);
  },
  getInboundSpec: getInboundSpec
});