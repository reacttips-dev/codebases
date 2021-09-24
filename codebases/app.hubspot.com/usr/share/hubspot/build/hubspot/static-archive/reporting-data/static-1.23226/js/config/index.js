'use es6';

import toJS from '../lib/toJS';
import * as checked from '../lib/checked';
import { SEARCH, AGGREGATION, TIME_SERIES, PIPELINE, FUNNEL } from '../constants/configTypes';
import * as CompareTypes from '../constants/compareTypes';
import * as DataTypes from '../constants/dataTypes';
import * as FrequencyTypes from '../constants/frequency';
import { Attribution } from './attribution';
import { Filters } from './filters';
import { Metrics } from './metrics';
import { Pipeline } from './pipeline';
import { Sorts } from './sort';
import { CrossObject } from './cross-object';
import { EventFunnel } from './event-funnel';
var Compare = checked.symbol(CompareTypes, 'Compare');
var DataType = checked.symbol(DataTypes, 'DataType');
var Frequency = checked.symbol(FrequencyTypes, 'Frequency');
var Dimensions = checked.list(checked.string()).defaultValue([]);
var Processors = checked.list(checked.string()).defaultValue([]);
var CommonDefaults = {
  v2: checked.boolean().defaultValue(false),
  compare: Compare.optional(),
  dataType: DataType.optional(),
  dimensions: Dimensions,
  filters: Filters,
  limit: checked.any(),
  metrics: Metrics,
  offset: checked.any(),
  processors: Processors,
  sort: Sorts,
  objectName: checked.any(),
  customized: checked.boolean().defaultValue(false),
  // Needed for Custom objects
  objectTypeId: checked.string().optional(),
  // NOTE: this is ONLY used to allow for account for reporting-data's caching mechanisms around config
  customSeries: checked.any()
};
var AggregationRecord = checked.record(Object.assign({}, CommonDefaults, {
  configType: checked.string().always(AGGREGATION),
  crossObject: CrossObject.optional(),
  // TODO: remove once synced with backend
  attributionModel: Attribution.optional()
}), 'Aggregation');
var TimeSeriesRecord = checked.record(Object.assign({}, CommonDefaults, {
  configType: checked.string().always(TIME_SERIES),
  crossObject: CrossObject.optional(),
  frequency: Frequency.optional()
}), 'TimeSeries');
var SearchRecord = checked.record({
  v2: checked.boolean().defaultValue(false),
  configType: checked.string().always(SEARCH),
  crossObject: CrossObject.optional(),
  dataType: DataType.optional(),
  dimensions: Dimensions,
  filters: Filters,
  limit: checked.any(),
  metrics: Metrics,
  offset: checked.any(),
  processors: Processors,
  sort: Sorts,
  customized: checked.boolean().defaultValue(false),
  objectTypeId: checked.string().optional(),
  // TODO: to be removed https://trello.com/c/C7D5Acua
  properties: checked.list().fromJS().defaultValue([])
}, 'Search');
var PipelineRecord = checked.record(Object.assign({}, CommonDefaults, {
  eventFunnel: EventFunnel.optional(),
  configType: checked.string().always(PIPELINE),
  pipeline: Pipeline
}), 'Pipeline');
var FunnelRecord = checked.record(Object.assign({}, CommonDefaults, {
  eventFunnel: EventFunnel.optional(),
  configType: checked.string().always(FUNNEL),
  pipeline: Pipeline
}), 'Funnel');
export var Config = function Config() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  obj = toJS(obj); // a lot of tests fail here because of partial config usage.
  //invariant(obj.configType, `Missing required configType field for ${obj}`);

  if (!obj.configType) {
    obj.configType = AGGREGATION;
  }

  var _obj = obj,
      configType = _obj.configType;

  switch (configType) {
    case AGGREGATION:
      return AggregationRecord(obj);

    case TIME_SERIES:
      return TimeSeriesRecord(obj);

    case SEARCH:
      return SearchRecord(obj);

    case PIPELINE:
      return PipelineRecord(obj);

    case FUNNEL:
      return FunnelRecord(obj);

    default:
      throw new Error("No matching config implementation for " + configType);
  }
};