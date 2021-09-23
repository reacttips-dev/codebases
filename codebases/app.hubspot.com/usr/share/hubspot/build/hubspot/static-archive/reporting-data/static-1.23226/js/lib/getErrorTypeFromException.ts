import * as ErrorTypes from '../constants/errorTypes';
import { TooMuchDataException, InvalidPropertiesException, DeprecatedPropertyException, UnsupportedException, TooManyMetricsException, TooManyDealStagesException, UnsupportedDateRangeException, MissingRequiredDataException, TooLargeDatasetException, InvalidPipelineException, NoDimensionsOrMetricsException, DataReprocessingException, HighchartsErrorException, TooManyBreakdownsException, MissingIntegrationException, MissingSeriesException, PipelineCadenceMismatchException, AccessDeniedException, TimeoutException, InvalidTwoDimensionMetricException } from '../exceptions';
export default (function (error) {
  var _ref = error || {},
      status = _ref.status,
      statusText = _ref.statusText,
      errorCode = _ref.errorCode,
      _ref$responseJSON = _ref.responseJSON;

  _ref$responseJSON = _ref$responseJSON === void 0 ? {} : _ref$responseJSON;
  var type = _ref$responseJSON.type,
      errorType = _ref$responseJSON.errorType;

  if (status === 403 || error instanceof AccessDeniedException) {
    // @ts-expect-error I think we need to revisit if this is intentional
    return ErrorTypes[errorType] || ErrorTypes.ACCESS_DENIED;
  }

  if (status === 413 || statusText === ErrorTypes.REQUEST_ENTITY_TOO_LARGE || type === ErrorTypes.RESULT_POINT_LIMIT_EXCEEDED || error instanceof TooMuchDataException) {
    return ErrorTypes.TOO_MANY_POINTS_REQUESTED;
  }

  if (error instanceof TooManyBreakdownsException) {
    return ErrorTypes.TOO_MANY_BREAKDOWNS;
  }

  if (errorCode === ErrorTypes.TIMEOUT || error instanceof TimeoutException) {
    return ErrorTypes.TIMEOUT;
  }

  if (error instanceof InvalidPropertiesException) {
    return ErrorTypes.INVALID_PROPERTIES;
  }

  if (error instanceof DeprecatedPropertyException) {
    return ErrorTypes.DEPRECATED_PROPERTY;
  }

  if (error instanceof UnsupportedException) {
    return ErrorTypes.UNSUPPORTED;
  }

  if (error instanceof TooManyMetricsException) {
    return ErrorTypes.TOO_MANY_METRICS_REQUESTED;
  }

  if (error instanceof TooManyDealStagesException) {
    return ErrorTypes.TOO_MANY_DEAL_STAGES_REQUESTED;
  }

  if (error instanceof UnsupportedDateRangeException) {
    return ErrorTypes.UNSUPPORTED_DATE_RANGE_REQUESTED;
  }

  if (error instanceof MissingRequiredDataException) {
    return ErrorTypes.MISSING_REQUIRED_DATA;
  }

  if (error instanceof InvalidPipelineException) {
    return ErrorTypes.INVALID_PIPELINE;
  }

  if (status === 422 || error instanceof TooLargeDatasetException) {
    if (error instanceof PipelineCadenceMismatchException || error.responseText && error.responseText.includes('Forecasting cadences must be uniform')) {
      return ErrorTypes.PIPELINE_CADENCE_MISMATCH;
    }

    return ErrorTypes.REQUEST_DATASET_TOO_LARGE;
  }

  if (error instanceof NoDimensionsOrMetricsException) {
    return ErrorTypes.MISSING_DIMENSIONS_AND_METRICS;
  }

  if (error instanceof DataReprocessingException) {
    return ErrorTypes.DATA_REPROCESSING;
  }

  if (error instanceof HighchartsErrorException) {
    return ErrorTypes.HIGHCHARTS_ERROR;
  }

  if (error instanceof MissingIntegrationException) {
    return ErrorTypes.MISSING_INTEGRATION_ERROR;
  }

  if (error instanceof MissingSeriesException) {
    return ErrorTypes.MISSING_SERIES_ERROR;
  }

  if (error instanceof InvalidTwoDimensionMetricException) {
    return ErrorTypes.INVALID_TWO_DIMENSION_METRIC;
  }

  return ErrorTypes.UNKNOWN;
});