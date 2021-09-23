'use es6';

import { OrderedMap, List, fromJS } from 'immutable';
import ReferenceRecord from '../schema/ReferenceRecord';
import setIn from 'transmute/setIn';
import getIn from 'transmute/getIn';
export var getDisplayOrder = function getDisplayOrder(obj) {
  if (typeof obj.displayOrder === 'number') {
    return obj.displayOrder;
  } else {
    return -1;
  }
};
export var getIsHiddenByPipelinePermissions = function getIsHiddenByPipelinePermissions(pipeline) {
  return getIn(['permission', 'accessLevel'], pipeline) === 'HIDDEN';
};

var formatPipelineId = function formatPipelineId(pipeline) {
  return String(pipeline.pipelineId);
};

var formatPipelineReference = function formatPipelineReference(pipeline) {
  return new ReferenceRecord({
    id: formatPipelineId(pipeline),
    label: pipeline.label,
    referencedObject: fromJS(pipeline),
    disabled: getIsHiddenByPipelinePermissions(pipeline)
  });
};

var sortPipelines = function sortPipelines(pipelines) {
  return pipelines.sort(function (pipelineA, pipelineB) {
    var isAHidden = getIsHiddenByPipelinePermissions(pipelineA);
    var isBHidden = getIsHiddenByPipelinePermissions(pipelineB);

    if (isAHidden && !isBHidden) {
      return 1;
    } else if (!isAHidden && isBHidden) {
      return -1;
    }

    return getDisplayOrder(pipelineA) - getDisplayOrder(pipelineB);
  });
};

var formatPipelinesWithPermissions = function formatPipelinesWithPermissions(response) {
  var sortedPipelines = sortPipelines(List(response)); // We need to override the displayOrder of all the pipelines, otherwise disabled
  // pipelines get sorted by that in the reference input component.

  return OrderedMap(sortedPipelines.map(function (pipeline, index) {
    return [formatPipelineId(pipeline), setIn(['referencedObject', 'displayOrder'], index, formatPipelineReference(pipeline))];
  }));
};

export default formatPipelinesWithPermissions;