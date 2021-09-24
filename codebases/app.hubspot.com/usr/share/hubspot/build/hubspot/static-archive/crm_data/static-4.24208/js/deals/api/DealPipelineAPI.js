'use es6';

import * as LocalSettings from 'crm_data/settings/LocalSettings';
import { Map as ImmutableMap } from 'immutable';
import { DEFAULT_PIPELINE_ID } from 'crm_data/settings/LocalSettingsKeys';
import { get, put, post, del, send } from 'crm_data/api/ImmutableAPI';
import { POST } from 'crm_data/constants/HTTPVerbs';
import { CONTACTS, CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
var BASE_URL = 'deals/v1';
var UPDATE_STAGE_URI = BASE_URL + "/propertyupdates/multi/dealstage";
var ORDER_API = BASE_URL + "/pipelines/order";

var uri = function uri() {
  var pipelineId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return BASE_URL + "/pipelines/" + pipelineId;
};

var getPipelineStageOptions = function getPipelineStageOptions(pipeline) {
  return pipeline.get('stages').map(function (stage) {
    return stage.merge({
      value: stage.get('stageId'),
      text: propertyLabelTranslator(stage.get('label')) // unfortunately there is no way to distinguish hubspot-defined and custom stages, so translate all

    });
  });
};

var parsePipelines = function parsePipelines(pipelines) {
  var pipelinesMap = pipelines.reduce(function (acc, pipeline) {
    pipeline = pipeline.merge({
      stageOptions: getPipelineStageOptions(pipeline),
      value: pipeline.get('pipelineId'),
      stages: pipeline.get('stages')
    });
    return acc.set(pipeline.get('pipelineId'), pipeline);
  }, ImmutableMap()); // Ensure the pipelineId in localSettings still exists

  var defaultPipelineId = LocalSettings.getFrom(localStorage, DEFAULT_PIPELINE_ID);

  if (defaultPipelineId && !pipelinesMap.has(defaultPipelineId)) {
    LocalSettings.deleteFrom(localStorage, DEFAULT_PIPELINE_ID);
  }

  return pipelinesMap.sortBy(function (pipeline) {
    return pipeline.get('displayOrder');
  });
};

export function fetch() {
  return get(uri()).then(parsePipelines);
}
export function updateDealStages(pipeline) {
  return put(uri(pipeline.pipelineId), pipeline);
}
export function createPipeline(pipeline) {
  return post(uri(), pipeline);
}
export function deletePipeline(pipelineId) {
  return del(uri(pipelineId));
}
export function bulkUpdateDealStages(deltas) {
  // Deltas should look like
  // [{"newValue":"newValue","oldValue":"oldValue"}]
  var options = {
    type: POST,
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI
    }
  };
  return send(options, UPDATE_STAGE_URI, deltas);
}
export function reorderPipelines(pipelines) {
  return put(ORDER_API, pipelines);
}