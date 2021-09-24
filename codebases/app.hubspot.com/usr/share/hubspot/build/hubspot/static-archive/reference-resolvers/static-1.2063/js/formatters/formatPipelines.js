'use es6';

import { OrderedMap, List, fromJS } from 'immutable';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import sortBy from 'transmute/sortBy';

var formatPipelineId = function formatPipelineId(pipeline) {
  return String(pipeline.pipelineId);
};

var formatPipelineReference = function formatPipelineReference(pipeline) {
  return new ReferenceRecord({
    id: formatPipelineId(pipeline),
    label: pipeline.label,
    referencedObject: fromJS(pipeline)
  });
};

var getDisplayOrder = function getDisplayOrder(pipeline) {
  if (typeof pipeline.displayOrder === 'number') {
    return pipeline.displayOrder;
  } else {
    return -1;
  }
};

var sortByDisplayOrder = sortBy(getDisplayOrder);

var formatPipelines = function formatPipelines(response) {
  var sortedPipelines = sortByDisplayOrder(List(response));
  return OrderedMap(sortedPipelines.map(function (pipeline) {
    return [formatPipelineId(pipeline), formatPipelineReference(pipeline)];
  }));
};

export default formatPipelines;