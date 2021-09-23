'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { fromJS, Map as ImmutableMap } from 'immutable';
import * as http from '../../request/http';
import { applyEndpointFixes, applyReportFixes } from './fixes';
import { reportingApiResolve } from './resolve';
import { applyBackendValidationTransformations, applyFrontendValidationTransformations } from './validationTransformations';
export var VISUALIZATION_STATUS = {
  REPORT_UI: 'REPORT_UI',
  REPORT_VISUALIZATION: 'REPORT_VISUALIZATION'
};

var updateConfigForValidation = function updateConfigForValidation(config) {
  return applyEndpointFixes(applyReportFixes(ImmutableMap({
    config: config
  })).report).report.get('config');
};

var getValidationConfig = function getValidationConfig() {
  return http.get('reporting-validation/v1/validation/config');
};

var sendValidationData = function sendValidationData(payload) {
  return http.post('reporting-validation/v1/validation', {
    data: payload
  });
};

var sendValidationError = function sendValidationError(config, frontendDataset, error) {
  return http.post('reporting-validation/v1/validation', {
    data: {
      config: updateConfigForValidation(config).toJS(),
      originalDataSet: frontendDataset.toJS(),
      error: {
        message: error.responseJSON ? error.responseJSON.message : error.message,
        statusCode: error.status
      }
    }
  });
};

export var buildRaasValidationPayloads = function buildRaasValidationPayloads(config, frontendUpgradedDataMap, backendDataset, visualizationStatus) {
  // https://git.hubteam.com/HubSpot/Reporting-as-a-Service/issues/379
  return frontendUpgradedDataMap.filter(function (_, datasetKey) {
    return datasetKey !== 'summary';
  }).map(function (datasetWrapper, datasetKey) {
    return {
      config: updateConfigForValidation(fromJS(datasetWrapper.get('config', config))).toJS(),
      originalDataSet: datasetWrapper.get('data', ImmutableMap()).update(function (dataset) {
        return applyFrontendValidationTransformations(config, dataset);
      }).toJS(),
      comparingDataSet: backendDataset.getIn([datasetKey, 'data'], ImmutableMap()).update(function (dataset) {
        return applyBackendValidationTransformations(config, dataset, datasetWrapper.get('data', ImmutableMap()));
      }).toJS(),
      visualizationStatus: visualizationStatus
    };
  });
};
export var shouldValidateReportForReportingBackendApi = function shouldValidateReportForReportingBackendApi(report) {
  return getValidationConfig().then(function (validationConfig) {
    var dataType = report.getIn(['config', 'dataType']);
    var validationDataTypeMap = validationConfig.getIn(['validationDataTypes']).toMap().mapEntries(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          v = _ref2[1];

      return [v.get('dataType'), v];
    });
    return Math.random() <= validationDataTypeMap.getIn([dataType, 'sampleRate'], 0);
  });
};
/**
 * All usages of this should involved calling shouldValidateReportForReportingBackendApi prior
 * */

export var validateReportForReportingBackendApi = function validateReportForReportingBackendApi(report, frontendUpgradedDataMap, visualizationStatus) {
  return reportingApiResolve(report, {
    validationResolve: true
  }).then(function (backendDataset) {
    return buildRaasValidationPayloads(report.get('config'), frontendUpgradedDataMap, backendDataset, visualizationStatus).forEach(function (payload) {
      sendValidationData(payload).catch(function (error) {
        sendValidationError(payload.config, payload.originalDataSet, error);
      });
    });
  }).catch(function (error) {
    if (error.errorBody) {
      var datasetKey = error.datasetKey;
      sendValidationError(updateConfigForValidation(frontendUpgradedDataMap.getIn([datasetKey, 'config'], report.get('config'))), frontendUpgradedDataMap.getIn([datasetKey, 'data']), error.errorBody);
    }

    throw error.errorBody || error;
  });
};