'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import { get as getPipelines } from '../../pipelines';
import { DEALS } from '../../../../constants/dataTypes';
import { getDealCreateStage } from '../../../../properties/data-type/deals';
import { InvalidPipelineException } from '../../../../exceptions';
export default (function (pipelineId) {
  return getPipelines(DEALS).then(function (pipelines) {
    var pipeline = pipelines.find(function (_ref) {
      var id = _ref.pipelineId;
      return id === pipelineId;
    });

    if (!pipeline) {
      throw new InvalidPipelineException(pipelineId);
    }

    return fromJS(pipeline).get('stages').map(function (stageInfo) {
      return ImmutableMap({
        label: stageInfo.get('label'),
        value: stageInfo.get('stageId')
      });
    }).unshift(ImmutableMap(getDealCreateStage()));
  });
});