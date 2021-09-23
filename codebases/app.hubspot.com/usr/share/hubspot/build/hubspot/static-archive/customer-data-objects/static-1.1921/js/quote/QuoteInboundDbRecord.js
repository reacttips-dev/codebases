'use es6';

import { Map as ImmutableMap } from 'immutable';
import makeObjectRecord from 'customer-data-objects/record/makeObjectRecord';
export default makeObjectRecord({
  idKey: ['objectId'],
  objectType: 'QUOTE',
  recordName: 'QuoteInboundDbRecord',
  defaults: {
    associatedObjects: ImmutableMap(),
    objectId: null,
    portalId: null,
    stagedUpdates: ImmutableMap(),
    properties: ImmutableMap()
  }
}, {
  primary: ['hs_title']
});