import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import I18n from 'I18n';
import { fromJS, Map as ImmutableMap } from 'immutable';
import { UNKNOWN } from '../constants/errorTypes';
import { CONFIG_VALIDATION_ERROR, REPORT_DATA_ERROR } from '../constants/reportingApiErrorTypes';
import * as Exceptions from '../exceptions';
var DEALSTAGES_PROPERTY = 'dealstages.*_duration';
var errorTypeToException = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, CONFIG_VALIDATION_ERROR.INVALID_PROPERTY, function (context) {
  var properties = context.get('propertyName');
  throw new Exceptions.InvalidPropertiesException(properties.toJS());
}), _defineProperty(_ImmutableMap, CONFIG_VALIDATION_ERROR.DEPRECATED_PROPERTY, function (context) {
  var property = context.getIn(['propertyName', 0]);
  throw new Exceptions.DeprecatedPropertyException(property);
}), _defineProperty(_ImmutableMap, CONFIG_VALIDATION_ERROR.TOO_MANY_METRICS_REQUESTED, function () {
  throw new Exceptions.TooManyMetricsException();
}), _defineProperty(_ImmutableMap, CONFIG_VALIDATION_ERROR.MISSING_DIMENSIONS_AND_METRICS, function () {
  throw new Exceptions.NoDimensionsOrMetricsException();
}), _defineProperty(_ImmutableMap, CONFIG_VALIDATION_ERROR.TOO_MANY_DEAL_STAGES_REQUESTED, function () {
  throw new Exceptions.TooManyDealStagesException();
}), _defineProperty(_ImmutableMap, CONFIG_VALIDATION_ERROR.INVALID_TWO_DIMENSION_METRIC, function (context) {
  var property = context.getIn(['propertyName', 0]);

  if (property === DEALSTAGES_PROPERTY) {
    throw new Exceptions.InvalidTwoDimensionMetricException({
      propertyName: I18n.text('reporting-data.properties.deals.timeInAllStages')
    });
  }

  throw new Exceptions.Exception();
}), _defineProperty(_ImmutableMap, REPORT_DATA_ERROR.ATTRIBUTION_BACKFILL_IN_PROGRESS, function () {
  throw new Exceptions.DataReprocessingException();
}), _defineProperty(_ImmutableMap, REPORT_DATA_ERROR.TOO_MANY_FILLING_PERMUTATIONS, function () {
  throw new Exceptions.TooMuchDataException();
}), _defineProperty(_ImmutableMap, REPORT_DATA_ERROR.TOO_MUCH_DATA_TO_PROCESS, function () {
  throw new Exceptions.TooMuchDataException();
}), _defineProperty(_ImmutableMap, UNKNOWN, function () {
  throw new Exceptions.Exception();
}), _ImmutableMap));
export var createExceptionFromErrorType = function createExceptionFromErrorType(errorType, context) {
  return errorTypeToException.has(errorType) ? errorTypeToException.get(errorType)(fromJS(context)) : errorTypeToException.get(UNKNOWN)();
};