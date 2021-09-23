'use es6';

import { OrderedMap } from 'immutable';
import dispatcher from 'dispatcher/dispatcher';
import { TICKET_PIPELINES } from 'crm_data/actions/ActionNamespaces';
import { defineLazyValueStore } from 'crm_data/store/LazyValueStore';
import { fetch } from 'crm_data/tickets/api/TicketsPipelinesAPI';
import { TICKET_PIPELINES_CREATE_SUCCEEDED, TICKET_PIPELINES_UPDATE_SUCCEEDED, TICKET_PIPELINES_DELETE_SUCCEEDED, TICKET_PIPELINES_REORDER_SUCCEEDED } from 'crm_data/actions/ActionTypes';
export default defineLazyValueStore({
  fetch: fetch,
  namespace: TICKET_PIPELINES
}).defineResponseTo(TICKET_PIPELINES_CREATE_SUCCEEDED, function (state, newPipeline) {
  return state.setIn(['value', newPipeline.get('pipelineId')], newPipeline);
}).defineResponseTo(TICKET_PIPELINES_UPDATE_SUCCEEDED, function (state, updated) {
  return state.setIn(['value', updated.get('pipelineId')], updated);
}).defineResponseTo(TICKET_PIPELINES_DELETE_SUCCEEDED, function (state, pipelineId) {
  return state.deleteIn(['value', pipelineId]);
}).defineResponseTo(TICKET_PIPELINES_REORDER_SUCCEEDED, function (state, pipelines) {
  var updatedPipelines = pipelines.reduce(function (map, pipeline) {
    return map.set(pipeline.get('pipelineId'), pipeline);
  }, OrderedMap());
  return state.set('value', updatedPipelines);
}).defineName('TicketsPipelinesStore').register(dispatcher);