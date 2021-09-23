'use es6';

import { Map as ImmutableMap } from 'immutable';
import { GLOBAL_NULL } from '../../constants/defaultNullValues';
import { get } from '../../retrieve/inboundDb/pipelines';
import { makeOption } from '../Option';
export var generatePipelineStageLabel = function generatePipelineStageLabel(pipelineStageInfo, key) {
  var fallbackLabel = key === GLOBAL_NULL ? null : key;
  return pipelineStageInfo.get('pipelineLabel') ? pipelineStageInfo.get('label', fallbackLabel) + " (" + pipelineStageInfo.get('pipelineLabel') + ")" : pipelineStageInfo.get('label', fallbackLabel);
};

var stagesToMap = function stagesToMap(stages) {
  var initialMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
  var pipelineLabel = arguments.length > 2 ? arguments[2] : undefined;
  return stages.reduce(function (memo, _ref) {
    var stageId = _ref.stageId,
        label = _ref.label;
    return memo.set(stageId, makeOption(stageId, generatePipelineStageLabel(ImmutableMap({
      label: label,
      pipelineLabel: pipelineLabel
    }))));
  }, initialMap);
};

export default (function (type) {
  var initialStages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return function () {
    return get(type).then(function (pipelines) {
      return pipelines.reduce(function (options, _ref2) {
        var stages = _ref2.stages,
            label = _ref2.label;
        return stagesToMap(stages, options, label);
      }, stagesToMap(initialStages, ImmutableMap()));
    });
  };
});