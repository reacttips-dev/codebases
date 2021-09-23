'use es6';

import { Map as ImmutableMap } from 'immutable';
import { InboundDbModule } from '../../module';
import { COMPANIES, CONTACTS, LINE_ITEMS } from '../../constants/dataTypes';
import { hydrate as _hydrate } from '../../retrieve/inboundDb/dynamicHydrate';
import { adapt } from '../../references/adapt';
import productReferences from '../../references/products';
import currencyReferences from '../../references/currency';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';

var getInboundSpec = function getInboundSpec() {
  return new Spec({
    dataType: LINE_ITEMS,
    properties: {
      idProperty: 'objectId',
      responsePaths: {
        objectId: ['objectId']
      }
    },
    search: {
      url: 'contacts/search/v1/search/lineitems',
      objectsField: 'results'
    },
    hydrate: {
      fn: function fn() {
        return 'TODO_LINE_ITEM';
      }
    }
  });
};

export default InboundDbModule({
  dataType: LINE_ITEMS,
  references: ImmutableMap({
    hs_product_id: adapt(productReferences),
    hs_line_item_currency_code: adapt(currencyReferences)
  }),
  referenceProperties: ImmutableMap({
    'associations.company': COMPANIES,
    'associations.contact': CONTACTS,
    objectId: LINE_ITEMS
  }),
  hydrate: function hydrate(ids, config) {
    return _hydrate(LINE_ITEMS, ids, config);
  },
  getInboundSpec: getInboundSpec
});