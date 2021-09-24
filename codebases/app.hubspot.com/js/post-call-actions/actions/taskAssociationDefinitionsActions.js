'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { FETCH_TASK_ASSOCIATION_DEFINITIONS } from './taskAssociationDefinitionsActionTypes';
import { fetchAllAssociationDefinitions } from '../clients/followUpTaskClient';
import { fromJS } from 'immutable';
export var getTaskAssociationDefinitions = createAsyncAction({
  actionTypes: FETCH_TASK_ASSOCIATION_DEFINITIONS,
  requestFn: fetchAllAssociationDefinitions,
  toRecordFn: function toRecordFn(data) {
    return fromJS(data);
  }
});