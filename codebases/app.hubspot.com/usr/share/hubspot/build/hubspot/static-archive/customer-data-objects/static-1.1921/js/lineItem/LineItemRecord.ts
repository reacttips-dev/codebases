import { Map as ImmutableMap } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { LINE_ITEM } from '../constants/ObjectTypes';
import ObjectIds from '../constants/ObjectIds';
export default makeObjectRecord({
  idKey: ObjectIds[LINE_ITEM],
  objectType: LINE_ITEM,
  recordName: 'LineItemRecord',
  defaults: {
    properties: ImmutableMap(),
    objectId: null,
    isNew: false
  }
}, {
  primary: ['name']
});