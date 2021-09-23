'use es6';

import formatPipelines from 'reference-resolvers/formatters/formatPipelines';
import { OrderedMap } from 'immutable';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import partial from 'transmute/partial';

var getDisplayOrder = function getDisplayOrder(stage) {
  if (typeof stage.get('displayOrder') === 'number') {
    return stage.get('displayOrder');
  } else {
    return -1;
  }
};

var formatStageId = function formatStageId(stage) {
  return String(stage.get('stageId'));
};

var formatStageReference = function formatStageReference(pipelineCount, pipelineRef, stage) {
  return new ReferenceRecord({
    id: formatStageId(stage),
    label: pipelineCount > 1 ? stage.get('label') + " (" + pipelineRef.label + ")" : stage.get('label'),
    referencedObject: stage.merge({
      pipeline: pipelineRef.referencedObject
    })
  });
};

var getPipelineRefStages = function getPipelineRefStages(pipelineCount, pipelineRef) {
  var sortedStages = pipelineRef.getIn(['referencedObject', 'stages']).sortBy(getDisplayOrder);
  return OrderedMap(sortedStages.map(function (stage) {
    return [formatStageId(stage), formatStageReference(pipelineCount, pipelineRef, stage)];
  }));
};

var formatPipelineStages = function formatPipelineStages(response) {
  var pipelineRefs = formatPipelines(response);
  var pipelineCount = pipelineRefs.size;
  return pipelineRefs.valueSeq().map(partial(getPipelineRefStages, pipelineCount)).reduce(function (a, b) {
    return a.merge(b);
  }, OrderedMap());
};

export default formatPipelineStages;