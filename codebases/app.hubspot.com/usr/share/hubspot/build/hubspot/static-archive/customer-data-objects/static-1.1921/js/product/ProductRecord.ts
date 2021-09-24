import { Map as ImmutableMap } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { PRODUCT } from '../constants/ObjectTypes';
import ObjectIds from '../constants/ObjectIds';
export default makeObjectRecord({
  idKey: ObjectIds[PRODUCT],
  objectType: PRODUCT,
  recordName: 'ProductRecord',
  defaults: {
    properties: ImmutableMap(),
    objectId: null
  }
}, {
  primary: ['name']
});