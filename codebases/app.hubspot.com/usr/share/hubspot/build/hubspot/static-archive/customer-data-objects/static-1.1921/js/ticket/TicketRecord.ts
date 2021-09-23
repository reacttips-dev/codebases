import { Map as ImmutableMap } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { TICKET } from '../constants/ObjectTypes';
import ObjectIds from '../constants/ObjectIds';
export default makeObjectRecord({
  idKey: ObjectIds[TICKET],
  objectType: TICKET,
  recordName: 'TicketRecord',
  defaults: {
    associations: ImmutableMap(),
    isDeleted: false,
    objectId: null,
    portalId: null,
    properties: ImmutableMap()
  }
}, {
  primary: ['subject'],
  secondary: ['content']
});