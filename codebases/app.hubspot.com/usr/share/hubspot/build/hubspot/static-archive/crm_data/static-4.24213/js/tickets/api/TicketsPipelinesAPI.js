'use es6';

import { get, put, post, del } from 'crm_data/api/ImmutableAPI';
import { Map as ImmutableMap } from 'immutable';
var BASE_URL = "pipelines/v2/pipelines/TICKET";

var uri = function uri() {
  var pipelineId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return BASE_URL + "/" + pipelineId;
};

var getPipelineStageOptions = function getPipelineStageOptions(pipeline) {
  return pipeline.get('stages').map(function (stage) {
    return stage.merge({
      value: stage.get('stageId'),
      text: stage.get('label')
    });
  });
};

var parsePipelines = function parsePipelines(pipelines) {
  var pipelinesMap = pipelines.reduce(function (acc, pipeline) {
    var pipelineId = pipeline.get('pipelineId');
    pipeline = pipeline.merge({
      stageOptions: getPipelineStageOptions(pipeline),
      value: pipelineId
    });
    return acc.set(pipelineId, pipeline);
  }, ImmutableMap());
  return pipelinesMap.sortBy(function (pipeline) {
    return pipeline.get('displayOrder');
  });
};

export function fetch() {
  return get(uri(), {
    includePermissions: true
  }).then(parsePipelines);
}
export function fetchByUUID(pipelineId) {
  return get(uri(pipelineId));
}
export function create(pipeline) {
  return post(uri(), pipeline);
}
export function update(pipeline) {
  return put(uri(pipeline.pipelineId), pipeline);
}
export function remove(pipelineId) {
  return del(uri(pipelineId));
}
export function reorderPipelines(pipelineIds) {
  return put(BASE_URL + "/order", pipelineIds);
}