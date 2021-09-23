'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { buildRequestErrorMetaObject } from 'conversations-error-reporting/error-actions/builders/buildRequestErrorMetaObject';
import Responder from 'conversations-internal-schema/responders/records/Responder';
import { fetchAgentResponder as requestFn } from '../clients/fetchAgentResponder';
import { FETCH_AGENT_RESPONDER } from '../constants/asyncActionTypes';
export var fetchAgentResponder = createAsyncAction({
  actionTypes: FETCH_AGENT_RESPONDER,
  requestFn: requestFn,
  toRecordFn: Responder,
  failureMetaActionCreator: buildRequestErrorMetaObject
});