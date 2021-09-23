import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap, List } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { TASK } from '../constants/ObjectTypes';
import { ENGAGEMENT_TYPE, TITLE, NOTES } from './TaskPropertyNames';
import PropertyValueRecord from '../property/PropertyValueRecord';
var TaskRecord = makeObjectRecord({
  idKey: ['objectId'],
  objectType: TASK,
  recordName: 'TaskRecord',
  defaults: {
    deleted: false,
    objectId: null,
    associations: ImmutableMap({
      contactIds: List(),
      companyIds: List(),
      dealIds: List(),
      ticketIds: List()
    }),
    properties: ImmutableMap(_defineProperty({}, ENGAGEMENT_TYPE, PropertyValueRecord({
      name: ENGAGEMENT_TYPE,
      value: TASK
    })))
  }
}, {
  primary: [TITLE],
  secondary: [NOTES]
});
export default TaskRecord;