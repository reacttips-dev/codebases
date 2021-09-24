'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, Map as ImmutableMap } from 'immutable';
import { post } from 'crm_data/inboundDB/sharedAPI';
import { engagementFromInboundDbObject } from 'crm_data/engagements/inboundDbProperties/engagementInboundDbObjectHelpers';
import { API_V2 } from './EngagementsAPI';
export var makeChunks = function makeChunks(engagements) {
  var countPerChunk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
  return engagements.reduce(function (acc, item, index) {
    var chunkIndex = Math.floor(index / countPerChunk);

    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }

    acc[chunkIndex].push(item);
    return acc;
  }, []);
};

var transformEngagement = function transformEngagement(engagement) {
  var createdEngagement = engagementFromInboundDbObject(fromJS(engagement));
  return [createdEngagement.getIn(['engagement', 'id']), createdEngagement];
};

export var transformEngagements = function transformEngagements(resp) {
  var allEngagements = resp.reduce(function (acc, item) {
    acc = [].concat(_toConsumableArray(acc), _toConsumableArray(item));
    return acc;
  }, []);
  return ImmutableMap(allEngagements.map(transformEngagement));
};
export function batchCreateEngagements(engagements) {
  var batchPromises = makeChunks(engagements).map(function (chunk) {
    return post(API_V2 + "/batch", chunk);
  });
  return Promise.all(batchPromises).then(transformEngagements);
}