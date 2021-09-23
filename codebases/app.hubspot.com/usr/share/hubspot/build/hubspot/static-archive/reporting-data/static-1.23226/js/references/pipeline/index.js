'use es6';

import { get } from '../../retrieve/inboundDb/pipelines';
import { makeOption } from '../Option';
export var generatePipelineLabel = function generatePipelineLabel(pipelineObject) {
  return pipelineObject.get('label');
};
export default (function (type) {
  return function () {
    return get(type).then(function (pipelines) {
      return pipelines.map(function (_ref) {
        var pipelineId = _ref.pipelineId,
            label = _ref.label;
        return makeOption(pipelineId, label);
      });
    });
  };
});