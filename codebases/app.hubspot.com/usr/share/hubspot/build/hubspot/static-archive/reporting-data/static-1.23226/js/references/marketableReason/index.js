'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { getFilterByProperty } from '../../config/filters/functions';
import { EQ } from '../../constants/operators';
import extractUniqueValues from '../../dataset/extract-unique-values';
import chunk from '../../lib/async/chunk';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { makeOption, Option } from '../Option';
var REASON_PROPERTY = 'hs_marketable_reason_id';
var REASON_TYPE_PROPERTY = 'hs_marketable_reason_type';
var REASON_ID_NAME = 'reasonSourceObjectId';

var getReasons = function getReasons(config, data) {
  var reasonTypeFilter = getFilterByProperty(config, REASON_TYPE_PROPERTY) || ImmutableMap();
  var reasonTypes = reasonTypeFilter.get('operator') === EQ && reasonTypeFilter.get('value') ? List([reasonTypeFilter.get('value')]) : reasonTypeFilter.get('values') || List();

  if (reasonTypes.size !== 1) {
    return null;
  }

  return extractUniqueValues(REASON_PROPERTY, data).map(function (reasonId) {
    var _ImmutableMap;

    return ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, REASON_ID_NAME, reasonId), _defineProperty(_ImmutableMap, "reasonType", reasonTypes.first()), _ImmutableMap));
  });
};

var getReasonIdsByVid = function getReasonIdsByVid(data) {
  return data.getIn(['dimension', 'buckets']).reduce(function (acc, bucket) {
    return acc.set(bucket.get('key'), bucket.getIn(['metrics', REASON_PROPERTY], ImmutableMap()).first());
  }, ImmutableMap()).filter(function (val) {
    return !!val;
  });
};

export var adapt = function adapt(get) {
  return function (config, _, data) {
    var reasons = getReasons(config, data);
    var reasonsByVid = getReasonIdsByVid(data);
    var ids = reasons ? reasons.toJS() : reasonsByVid.keySeq().map(Number).toJS();
    return get(ids).then(function (options) {
      return reasons ? options : options.mapKeys(function (vid) {
        return reasonsByVid.get(vid);
      }).map(function (val, key) {
        return val.set('value', key);
      });
    }).then(function (value) {
      return ImmutableMap({
        key: REASON_PROPERTY,
        value: value
      });
    });
  };
};

var batchRequestByVid = function batchRequestByVid(ids) {
  return chunk(function () {
    return http.post('marketable-contacts/v1/marketable-labels/vids', {
      data: ids
    }).then(toJS);
  }, function (responses) {
    return responses.reduce(function (acc, response) {
      return Object.assign({}, acc, {}, response);
    }, {});
  }, ids);
};

var batchRequestByReason = function batchRequestByReason(ids) {
  return chunk(function () {
    return http.post('marketable-contacts/v1/marketable-labels/reasons', {
      data: ids
    }).then(toJS);
  }, function (responses) {
    return responses.reduce(function (acc, response) {
      return [].concat(_toConsumableArray(acc), _toConsumableArray(response));
    }, []);
  }, ids);
};

export var generateMarketableReasonIdLabel = function generateMarketableReasonIdLabel(marketableReasonInfo) {
  return marketableReasonInfo.get('label');
};
export var getMarketableContactReferences = function getMarketableContactReferences(ids) {
  if (ids.length === 0) {
    return Promise.resolve(ImmutableMap());
  }

  var shouldFetchByVid = typeof ids[0] === 'number';

  if (shouldFetchByVid) {
    return batchRequestByVid(ids).then(function (response) {
      return ids.reduce(function (options, vid) {
        var reference = response[Number(vid)];
        return options.set(String(vid), reference ? new Option(Object.assign({}, reference, {
          value: vid
        })) : makeOption(String(vid)));
      }, ImmutableMap());
    });
  }

  return batchRequestByReason(ids).then(fromJS).then(function (response) {
    return ids.reduce(function (options, id) {
      var reference = response.find(function (result) {
        return result.get(REASON_ID_NAME) === id[REASON_ID_NAME];
      }, ImmutableMap()).get('reportingLabel', ImmutableMap());
      var key = id[REASON_ID_NAME];
      return options.set(key, new Option(reference.set('value', key).toJS()));
    }, ImmutableMap());
  });
};