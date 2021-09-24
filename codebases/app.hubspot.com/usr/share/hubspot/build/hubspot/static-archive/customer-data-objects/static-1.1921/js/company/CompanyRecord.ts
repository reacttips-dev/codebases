import { List, Map as ImmutableMap } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { COMPANY } from '../constants/ObjectTypes';
import ObjectIds from '../constants/ObjectIds';
export default makeObjectRecord({
  idKey: ObjectIds[COMPANY],
  objectType: COMPANY,
  recordName: 'CompanyRecord',
  defaults: {
    companyId: null,
    isDeleted: false,
    portalId: null,
    properties: ImmutableMap(),
    additionalDomains: List()
  }
}, {
  primary: ['name'],
  secondary: ['domain']
});