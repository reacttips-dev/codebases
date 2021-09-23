import { List, Map as ImmutableMap } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { DEAL } from '../constants/ObjectTypes';
import ObjectIds from '../constants/ObjectIds';
export default makeObjectRecord({
  idKey: ObjectIds[DEAL],
  objectType: DEAL,
  recordName: 'DealRecord',
  defaults: {
    associations: ImmutableMap(),
    dealId: null,
    imports: List(),
    isDeleted: false,
    portalId: null,
    properties: ImmutableMap()
  }
}, {
  primary: ['dealname']
});