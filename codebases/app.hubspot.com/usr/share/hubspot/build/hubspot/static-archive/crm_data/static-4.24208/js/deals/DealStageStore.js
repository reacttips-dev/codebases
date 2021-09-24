'use es6';

import { Map as ImmutableMap } from 'immutable';
import { defineFactory } from 'general-store';
import dispatcher from 'dispatcher/dispatcher';
import { DEAL_PIPELINES_FETCH_SUCCEEDED, PIPELINE_UPDATED, PIPELINE_DELETED } from 'crm_data/actions/ActionTypes';
import DealPipelineStore from 'crm_data/deals/DealPipelineStore';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';

var parseStage = function parseStage(stage, pipeline) {
  return stage.merge({
    pipelineDisplayOrder: pipeline.get('displayOrder'),
    pipelineId: pipeline.get('pipelineId'),
    pipelineLabel: propertyLabelTranslator(pipeline.get('label')),
    // unfortunately there is no way to distinguish hubspot-defined and custom pipelines, so translate all
    text: propertyLabelTranslator(stage.get('label')),
    // unfortunately there is no way to distinguish hubspot-defined and custom stages, so translate all
    value: stage.get('stageId')
  });
};

var DealStageStore = defineFactory().defineName('DealsStageStore').defineGetInitialState(function () {
  return ImmutableMap();
}).defineGet(function (state, dealStageId) {
  if (state.size === 0) {
    DealPipelineStore.get();
  }

  if (dealStageId) {
    return state.get(dealStageId);
  }

  return state;
}).defineResponseTo(DEAL_PIPELINES_FETCH_SUCCEEDED, function (state, pipelines) {
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
export default DealStageStore;