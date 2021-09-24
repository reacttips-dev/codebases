import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import * as ErrorTypes from './constants/errorTypes';
export var Exception = function Exception(message) {
  _classCallCheck(this, Exception);

  this.name = this.constructor.name;
  this.message = message; // @ts-expect-error Usage of a non standard browser behavior specific to v8

  if (typeof Error.captureStackTrace === 'function') {
    // @ts-expect-error Usage of a non standard browser behavior specific to v8
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error(message).stack;
  }
};
Exception.prototype = Object.create(Error.prototype);
Exception.prototype.constructor = Exception;
export var DeprecatedPropertyException = /*#__PURE__*/function (_Exception) {
  _inherits(DeprecatedPropertyException, _Exception);

  function DeprecatedPropertyException(property) {
    var _this;

    _classCallCheck(this, DeprecatedPropertyException);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DeprecatedPropertyException).call(this, "Deprecated property " + property + " used"));
    _this.status = 400;
    _this.statusText = 'DEPRECATED_PROPERTY';
    _this.meta = {
      property: property
    };
    return _this;
  }

  return DeprecatedPropertyException;
}(Exception);
export var InvalidPropertiesException = /*#__PURE__*/function (_Exception2) {
  _inherits(InvalidPropertiesException, _Exception2);

  function InvalidPropertiesException() {
    var _this2;

    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, InvalidPropertiesException);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(InvalidPropertiesException).call(this, "Invalid property " + properties + " used"));
    _this2.status = 400;
    _this2.statusText = 'INVALID_PROPERTIES';
    _this2.meta = {
      properties: properties
    };
    return _this2;
  }

  return InvalidPropertiesException;
}(Exception);
export var MissingPropertiesException = /*#__PURE__*/function (_Exception3) {
  _inherits(MissingPropertiesException, _Exception3);

  function MissingPropertiesException(dataType) {
    _classCallCheck(this, MissingPropertiesException);

    return _possibleConstructorReturn(this, _getPrototypeOf(MissingPropertiesException).call(this, "missing properties for " + dataType));
  }

  return MissingPropertiesException;
}(Exception);
export var InvalidPipelineException = /*#__PURE__*/function (_Exception4) {
  _inherits(InvalidPipelineException, _Exception4);

  function InvalidPipelineException(pipeline) {
    var _this3;

    _classCallCheck(this, InvalidPipelineException);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(InvalidPipelineException).call(this, "invalid pipeline: \"" + pipeline + "\""));
    _this3.meta = {
      pipeline: pipeline
    };
    return _this3;
  }

  return InvalidPipelineException;
}(Exception);
export var TooMuchDataException = /*#__PURE__*/function (_Exception5) {
  _inherits(TooMuchDataException, _Exception5);

  function TooMuchDataException() {
    var _this4;

    _classCallCheck(this, TooMuchDataException);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(TooMuchDataException).call(this, 'too much data to process'));
    _this4.status = 413;
    _this4.statusText = 'REQUEST_ENTITY_TOO_LARGE';
    return _this4;
  }

  return TooMuchDataException;
}(Exception);
export var TooManyBreakdownsException = /*#__PURE__*/function (_Exception6) {
  _inherits(TooManyBreakdownsException, _Exception6);

  function TooManyBreakdownsException() {
    _classCallCheck(this, TooManyBreakdownsException);

    return _possibleConstructorReturn(this, _getPrototypeOf(TooManyBreakdownsException).call(this, 'too many breakdowns to process'));
  }

  return TooManyBreakdownsException;
}(Exception);
export var UnsupportedException = /*#__PURE__*/function (_Exception7) {
  _inherits(UnsupportedException, _Exception7);

  function UnsupportedException(_ref) {
    var _this5;

    var type = _ref.type,
        entity = _ref.entity;

    _classCallCheck(this, UnsupportedException);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(UnsupportedException).call(this, "unsupported " + type + " used"));
    _this5.meta = {
      type: type,
      entity: entity
    };
    return _this5;
  }

  return UnsupportedException;
}(Exception);
export var TooManyMetricsException = /*#__PURE__*/function (_Exception8) {
  _inherits(TooManyMetricsException, _Exception8);

  function TooManyMetricsException() {
    _classCallCheck(this, TooManyMetricsException);

    return _possibleConstructorReturn(this, _getPrototypeOf(TooManyMetricsException).call(this, 'too many metrics to request'));
  }

  return TooManyMetricsException;
}(Exception);
export var TooManyDealStagesException = /*#__PURE__*/function (_Exception9) {
  _inherits(TooManyDealStagesException, _Exception9);

  function TooManyDealStagesException() {
    _classCallCheck(this, TooManyDealStagesException);

    return _possibleConstructorReturn(this, _getPrototypeOf(TooManyDealStagesException).call(this, 'too many deal stages to request'));
  }

  return TooManyDealStagesException;
}(Exception);
export var UnsupportedDateRangeException = /*#__PURE__*/function (_Exception10) {
  _inherits(UnsupportedDateRangeException, _Exception10);

  function UnsupportedDateRangeException() {
    _classCallCheck(this, UnsupportedDateRangeException);

    return _possibleConstructorReturn(this, _getPrototypeOf(UnsupportedDateRangeException).call(this, 'report does not support the requested date range'));
  }

  return UnsupportedDateRangeException;
}(Exception);
export var MissingRequiredDataException = /*#__PURE__*/function (_Exception11) {
  _inherits(MissingRequiredDataException, _Exception11);

  function MissingRequiredDataException() {
    var _this6;

    _classCallCheck(this, MissingRequiredDataException);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(MissingRequiredDataException).call(this, 'missing data needed to finish report resolution'));
    _this6.status = 404;
    _this6.statusText = 'MISSING_REQUIRED_DATA';
    return _this6;
  }

  return MissingRequiredDataException;
}(Exception);
export var TooLargeDatasetException = /*#__PURE__*/function (_Exception12) {
  _inherits(TooLargeDatasetException, _Exception12);

  function TooLargeDatasetException() {
    var _this7;

    _classCallCheck(this, TooLargeDatasetException);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(TooLargeDatasetException).call(this, 'too large dataset to process'));
    _this7.status = 422;
    _this7.statusText = 'REQUEST_DATASET_TOO_LARGE';
    return _this7;
  }

  return TooLargeDatasetException;
}(Exception);
export var PipelineCadenceMismatchException = /*#__PURE__*/function (_Exception13) {
  _inherits(PipelineCadenceMismatchException, _Exception13);

  function PipelineCadenceMismatchException() {
    var _this8;

    _classCallCheck(this, PipelineCadenceMismatchException);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(PipelineCadenceMismatchException).call(this, 'Forecasting cadences must be uniform across all pipelines'));
    _this8.status = 422;
    _this8.statusText = 'PIPELINE_CADENCE_MISMATCH';
    return _this8;
  }

  return PipelineCadenceMismatchException;
}(Exception);
export var NoDimensionsOrMetricsException = /*#__PURE__*/function (_Exception14) {
  _inherits(NoDimensionsOrMetricsException, _Exception14);

  function NoDimensionsOrMetricsException() {
    var _this9;

    _classCallCheck(this, NoDimensionsOrMetricsException);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(NoDimensionsOrMetricsException).call(this, 'report contains no dimensions or metrics'));
    _this9.statusText = ErrorTypes.MISSING_DIMENSIONS_AND_METRICS;
    return _this9;
  }

  return NoDimensionsOrMetricsException;
}(Exception);
export var DataReprocessingException = /*#__PURE__*/function (_Exception15) {
  _inherits(DataReprocessingException, _Exception15);

  function DataReprocessingException() {
    var _this10;

    _classCallCheck(this, DataReprocessingException);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(DataReprocessingException).call(this, 'report is not avaliable becuase its data is reprocessing'));
    _this10.statusText = ErrorTypes.DATA_REPROCESSING;
    return _this10;
  }

  return DataReprocessingException;
}(Exception);
export var HighchartsErrorException = /*#__PURE__*/function (_Exception16) {
  _inherits(HighchartsErrorException, _Exception16);

  function HighchartsErrorException(error) {
    var _this11;

    _classCallCheck(this, HighchartsErrorException);

    _this11 = _possibleConstructorReturn(this, _getPrototypeOf(HighchartsErrorException).call(this, error.message));
    _this11.statusText = ErrorTypes.HIGHCHARTS_ERROR;
    return _this11;
  }

  return HighchartsErrorException;
}(Exception);
export var MissingIntegrationException = /*#__PURE__*/function (_Exception17) {
  _inherits(MissingIntegrationException, _Exception17);

  function MissingIntegrationException() {
    var _this12;

    _classCallCheck(this, MissingIntegrationException);

    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(MissingIntegrationException).call(this, 'the report requires a site filter'));
    _this12.statusText = ErrorTypes.MISSING_INTEGRATION_ERROR;
    return _this12;
  }

  return MissingIntegrationException;
}(Exception);
export var MissingSeriesException = /*#__PURE__*/function (_Exception18) {
  _inherits(MissingSeriesException, _Exception18);

  function MissingSeriesException() {
    var _this13;

    _classCallCheck(this, MissingSeriesException);

    _this13 = _possibleConstructorReturn(this, _getPrototypeOf(MissingSeriesException).call(this, 'the report requires at least one series filter'));
    _this13.statusText = ErrorTypes.MISSING_SERIES_ERROR;
    return _this13;
  }

  return MissingSeriesException;
}(Exception);
export var AccessDeniedException = /*#__PURE__*/function (_Exception19) {
  _inherits(AccessDeniedException, _Exception19);

  function AccessDeniedException() {
    var _this14;

    _classCallCheck(this, AccessDeniedException);

    _this14 = _possibleConstructorReturn(this, _getPrototypeOf(AccessDeniedException).call(this, 'access denied'));
    _this14.statusText = ErrorTypes.ACCESS_DENIED;
    _this14.status = 403;
    return _this14;
  }

  return AccessDeniedException;
}(Exception);
export var TimeoutException = /*#__PURE__*/function (_Exception20) {
  _inherits(TimeoutException, _Exception20);

  function TimeoutException() {
    var _this15;

    _classCallCheck(this, TimeoutException);

    _this15 = _possibleConstructorReturn(this, _getPrototypeOf(TimeoutException).call(this, 'timeout'));
    _this15.statusText = ErrorTypes.TIMEOUT;
    return _this15;
  }

  return TimeoutException;
}(Exception);
export var InvalidTwoDimensionMetricException = /*#__PURE__*/function (_Exception21) {
  _inherits(InvalidTwoDimensionMetricException, _Exception21);

  function InvalidTwoDimensionMetricException(_ref2) {
    var _this16;

    var propertyName = _ref2.propertyName;

    _classCallCheck(this, InvalidTwoDimensionMetricException);

    _this16 = _possibleConstructorReturn(this, _getPrototypeOf(InvalidTwoDimensionMetricException).call(this, 'dealstage.*_duration cannot be used in two dimension reports'));
    _this16.statusText = ErrorTypes.INVALID_TWO_DIMENSION_METRIC;
    _this16.meta = {
      propertyName: propertyName
    };
    return _this16;
  }

  return InvalidTwoDimensionMetricException;
}(Exception);
export var RaasResolveException = /*#__PURE__*/function (_Exception22) {
  _inherits(RaasResolveException, _Exception22);

  function RaasResolveException(datasetKey, errorBody) {
    var _this17;

    _classCallCheck(this, RaasResolveException);

    _this17 = _possibleConstructorReturn(this, _getPrototypeOf(RaasResolveException).call(this, 'report failed a raas resolve network call'));
    _this17.datasetKey = datasetKey;
    _this17.errorBody = errorBody;
    return _this17;
  }

  return RaasResolveException;
}(Exception);