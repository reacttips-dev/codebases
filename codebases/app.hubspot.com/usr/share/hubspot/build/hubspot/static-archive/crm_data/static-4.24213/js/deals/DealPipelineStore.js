'use es6';

import { OrderedMap } from 'immutable';
import dispatcher from 'dispatcher/dispatcher';
import { DEAL_PIPELINES } from '../actions/ActionNamespaces';
import { defineLazyValueStore } from '../store/LazyValueStore';
import { fetch } from './api/DealPipelineAPI';
import { PIPELINE_UPDATED, PIPELINE_DELETED, PIPELINES_UPDATED } from 'crm_data/actions/ActionTypes';
export default defineLazyValueStore({
  fetch: fetch,
  namespace: DEAL_PIPELINES
}).defineName('DealPipelineStore').defineResponseTo(PIPELINE_UPDATED, function (state, _ref) {
  var key = _ref.key,
      value = _ref.value;
  return state.setIn(['value', key], value);
}).defineResponseTo(PIPELINE_DELETED, function (state, pipelineId) {
  return state.deleteIn(['value', pipelineId]);
}).defineResponseTo(PIPELINES_UPDATED, function (state, pipelines) {
  var updatedPipelines = pipelines.reduce(function (map, pipeline) {
    return map.set(pipeline.get('pipelineId'), pipeline);
  }, OrderedMap());
  return state.set('value', updatedPipelines);
}).register(dispatcher);