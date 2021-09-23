'use es6';

import { Map as ImmutableMap } from 'immutable';
import { InboundDbModule } from '../../module';
import { PRODUCTS, COMPANIES, CONTACTS } from '../../constants/dataTypes';
import { hydrate as _hydrate } from '../../retrieve/inboundDb/dynamicHydrate';
import { adapt } from '../../references/adapt';
import ownerReferences from '../../references/owner';
import teamReferences from '../../references/team';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';

var getInboundSpec = function getInboundSpec() {
  return new Spec({
    dataType: PRODUCTS,
    properties: {
      idProperty: 'objectId',
      responsePaths: {
        objectId: ['objectId']
      }
    },
    search: {
      url: 'contacts/search/v1/search/products',
      objectsField: 'results'
    },
    hydrate: {
      fn: function fn() {
        return 'TODO_PRODUCT';
      }
    }
  });
};

export default InboundDbModule({
  dataType: PRODUCTS,
  references: ImmutableMap({
    hubspot_owner_id: adapt(ownerReferences),
    hubspot_team_id: adapt(teamReferences)
  }),
  referenceProperties: ImmutableMap({
    'associations.company': COMPANIES,
    'associations.contact': CONTACTS,
    objectId: PRODUCTS
  }),
  hydrate: function hydrate(ids, config) {
    return _hydrate(PRODUCTS, ids, config);
  },
  getInboundSpec: getInboundSpec
});