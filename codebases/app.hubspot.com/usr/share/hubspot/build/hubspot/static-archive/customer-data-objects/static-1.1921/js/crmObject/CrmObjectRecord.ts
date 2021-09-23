import { Map as ImmutableMap } from 'immutable';
import makeObjectRecord from 'customer-data-objects/record/makeObjectRecord';
import { CRM_OBJECT } from '../constants/CrmObjectType';
export default makeObjectRecord({
  idKey: ['objectId'],
  objectType: CRM_OBJECT,
  recordName: 'CrmObjectRecord',
  defaults: {
    associatedObjects: ImmutableMap(),
    objectId: undefined,
    objectTypeId: undefined,
    portalId: undefined,
    properties: ImmutableMap()
  }
});