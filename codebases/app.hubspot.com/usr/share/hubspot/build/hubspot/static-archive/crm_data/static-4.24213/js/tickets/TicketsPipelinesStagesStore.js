'use es6';

import { Map as ImmutableMap } from 'immutable';
import { defineFactory } from 'general-store';
import dispatcher from 'dispatcher/dispatcher';
import { TICKET_PIPELINES_FETCH_SUCCEEDED, PIPELINE_UPDATED, PIPELINE_DELETED } from 'crm_data/actions/ActionTypes';
import TicketsPipelinesStore from 'crm_data/tickets/TicketsPipelinesStore';

var parseStage = function parseStage(stage, pipeline) {
  return stage.merge({
    pipelineDisplayOrder: pipeline.get('displayOrder'),
    pipelineId: pipeline.get('pipelineId'),
    pipelineLabel: pipeline.get('label'),
    text: stage.get('label'),
    value: stage.get('stageId')
  });
};

var TicketsPiplinesStagesStore = defineFactory().defineName('TicketsPiplinesStagesStore').defineGetInitialState(function () {
  return ImmutableMap();
}).defineGet(function (state, ticketPipelineStageId) {
  if (state.size === 0) {
    TicketsPipelinesStore.get();
  }

  if (ticketPipelineStageId) {
    return state.get(ticketPipelineStageId);
  }

  return state;
}).defineResponseTo(TICKET_PIPELINES_FETCH_SUCCEEDED, function (state, pipelines) {
  pipelines.forEach(function (pipeline) {
    return pipeline.get('stages').forEach(function (stage) {
      state = state.set(stage.get('stageId'), parseStage(stage, pipeline));
    });
  });
  return state;
}).defineResponseTo(PIPELINE_UPDATED, function (state, pipeline) {
  var value = pipeline.value;

  if (!value) {
    return state;
  }

  var stages = value.get('stages').sortBy(function (stage) {
    return stage.get('displayOrder');
  });
  stages.forEach(function (stage) {
    state = state.set(stage.get('stageId'), parseStage(stage, value));
  });
  return state;
}).defineResponseTo(PIPELINE_DELETED, function (state, pipelineId) {
  return state.filter(function (stage) {
    return stage.get('pipelineId') !== pipelineId;
  });
}).register(dispatcher);
export default TicketsPiplinesStagesStore;