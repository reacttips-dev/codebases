'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { OrderedMap } from 'immutable';
import ReferenceRecord from '../schema/ReferenceRecord';
import partial from 'transmute/partial';
import formatPipelinesWithPermissions from './formatPipelinesWithPermissions';
import setIn from 'transmute/setIn';

var getDisplayOrder = function getDisplayOrder(obj) {
  if (typeof obj.displayOrder === 'number') {
    return obj.displayOrder;
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
    }),
    // If a pipeline is marked as disabled, it's from pipeline permissions
    // and we need to disable all its stages as well.
    disabled: pipelineRef.disabled
  });
};

var getPipelineRefStages = function getPipelineRefStages(pipelineCount, pipelineRef) {
  var sortedStages = pipelineRef.getIn(['referencedObject', 'stages']).sortBy(getDisplayOrder);
  return OrderedMap(sortedStages.map(function (stage) {
    return [formatStageId(stage), formatStageReference(pipelineCount, pipelineRef, stage)];
  }));
};

var formatPipelineStagesWithPermissions = function formatPipelineStagesWithPermissions(response) {
  var pipelineRefs = formatPipelinesWithPermissions(response);
  var pipelineCount = pipelineRefs.size; // We need to override the displayOrder, otherwise disabled stages get sorted incorrectly.
  // We're using entrySeq here to get access to the index of the stage. .map does not give it to us.

  return pipelineRefs.toSeq().map(partial(getPipelineRefStages, pipelineCount)).flatten(1).mapEntries(function (_ref, index) {
    var _ref2 = _slicedToArray(_ref, 2),
        stageId = _ref2[0],
        stageRef = _ref2[1];

    return [stageId, setIn(['referencedObject', 'displayOrder'], index, stageRef)];
  }).toOrderedMap();
};

export default formatPipelineStagesWithPermissions;