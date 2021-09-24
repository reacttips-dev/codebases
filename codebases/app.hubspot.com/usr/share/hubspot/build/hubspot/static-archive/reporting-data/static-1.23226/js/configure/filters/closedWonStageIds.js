'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List, Set as ImmutableSet } from 'immutable';
import { DEALS } from '../../constants/dataTypes';
import { CLOSEDWON_STAGES } from '../../constants/magicTypes';
import { get as getPipelines } from '../../retrieve/inboundDb/pipelines';
export default (function (config) {
  var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  return getPipelines(DEALS).then(function (pipelines) {
    var closedWonStages = List(pipelines).flatMap(function (pipeline) {
      return pipeline.stages.filter(function (stage) {
        return parseFloat(stage.metadata.probability) === 1;
      }).map(function (stage) {
        return stage.stageId;
      });
    });
    return paths.reduce(function (memo, path) {
      var valuesPath = path.slice(0, -1);
      var index = path[path.length - 1];
      return memo.updateIn(['filters'].concat(_toConsumableArray(valuesPath)), function (values) {
        return values.get(index) === CLOSEDWON_STAGES ? values.splice.apply(values, [index, 1].concat(_toConsumableArray(closedWonStages))) : values;
      });
    }, config);
  });
});