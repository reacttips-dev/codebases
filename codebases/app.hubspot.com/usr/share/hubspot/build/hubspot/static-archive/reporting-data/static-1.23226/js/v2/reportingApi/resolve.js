'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { isComparisonConfig, splitConfig } from '../../compare';
import { configureWithStages as configureDuration } from '../../configure/dealstage/duration';
import { AGGREGATION, FUNNEL, PIPELINE, SEARCH } from '../../constants/configTypes';
import { UNKNOWN, VALIDATION_ERROR } from '../../constants/errorTypes';
import { resolveV2CustomSeries } from '../../customSeries/resolveV2CustomSeries';
import { RaasResolveException } from '../../exceptions';
import { createExceptionFromErrorType } from '../../lib/createExceptionFromErrorType';
import { RUNTIME_OPTIONS } from '../../main';
import { NewRelicInteraction } from '../../monitoring/newrelic';
import * as http from '../../request/http';
import * as preconditions from '../../retrieve/inboundDb/aggregate/preconditions';
import { enhanceColumnDataset } from '../dataset/enhanceColumns';
import { buildDataset } from './buildDataset';
import { getDatasetBuildOptionsFromConfig } from './datasetBuildOptions';
import { applyCompareFixes, applyEndpointFixes, applyReportFixes } from './fixes';
import { densifyComparison } from './postprocess/densifyComparison';
import { createFunnelSummary } from './postprocess/funnelSummary';

var formatConfig = function formatConfig(report, response) {
  var config = report.get('config');
  var header = response.get('header');
  return configureDuration(config, header, true);
};

export var getPaginatedResponse = function getPaginatedResponse(report, response) {
  var dimensions = report.getIn(['config', 'dimensions']) || List();
  var configType = report.getIn(['config', 'configType']);
  var limit = report.getIn(['config', 'limit']);
  var offset = report.getIn(['config', 'offset']) || 0;

  if (!limit) {
    return response;
  }

  if (configType === SEARCH) {
    return response.update('data', [], function (data) {
      return data.take(limit);
    });
  }

  var data = response.get('data', List());

  if (dimensions.size <= 1) {
    var _total = data.length;
    return response.set('data', data.skip(offset).take(limit)).set('pagination', fromJS({
      total: _total,
      offset: Math.min(_total, limit + offset)
    }));
  }

  var pivotDimension = dimensions.first();

  var _data$reduce = data.reduce(function (_ref, datum) {
    var _ref2 = _slicedToArray(_ref, 2),
        uniques = _ref2[0],
        limited = _ref2[1];

    var dim = datum.get(pivotDimension);
    var updatedUniques = uniques.includes(dim) ? uniques : [].concat(_toConsumableArray(uniques), [dim]);
    var dimPos = updatedUniques.indexOf(dim);
    var updatedDims = dimPos >= offset && dimPos < limit + offset ? [].concat(_toConsumableArray(limited), [datum]) : limited;
    return [updatedUniques, updatedDims];
  }, [[], []]),
      _data$reduce2 = _slicedToArray(_data$reduce, 2),
      uniqueDimensions = _data$reduce2[0],
      limitedData = _data$reduce2[1];

  var total = uniqueDimensions.length;
  return response.set('data', List(limitedData)).set('pagination', fromJS({
    total: total,
    offset: Math.min(total, limit + offset)
  }));
};

var makeReportingApiRequest = function makeReportingApiRequest(datasetKey, report, useLocalReportingApis, isTotalsRequest) {
  var fixedReportData = applyReportFixes(report);
  report = fixedReportData.report;
  var fixedEndpointData = applyEndpointFixes(report);
  return http.post('reporting/v1/dataset', {
    data: Object.assign({
      config: fixedEndpointData.report.get('config')
    }, fixedEndpointData.externalizedData)
  }, {
    useLocalReportingApis: useLocalReportingApis
  }).then(function (response) {
    return fromJS(_defineProperty({}, datasetKey, ImmutableMap({
      config: formatConfig(report, response),
      data: enhanceColumnDataset(fromJS(buildDataset(isTotalsRequest ? response : getPaginatedResponse(report, response), getDatasetBuildOptionsFromConfig(report.get('config')))), report.get('config'))
    })));
  }).catch(function (error) {
    throw new RaasResolveException(datasetKey, error);
  });
};

export var generateError = function generateError(rawError) {
  var response = rawError.responseJSON;

  if (response && response.category && response.category === VALIDATION_ERROR) {
    return createExceptionFromErrorType(response.subCategory, response.context);
  }

  return createExceptionFromErrorType(UNKNOWN);
};
export var reportingApiResolve = function reportingApiResolve(report) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : RUNTIME_OPTIONS,
      useLocalReportingApis = _ref3.useLocalReportingApis,
      validationResolve = _ref3.validationResolve;

  var useNewRelic = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var newrelic = useNewRelic && new NewRelicInteraction();

  if (newrelic) {
    newrelic.addReportConfigAttributes(report.get('config').set('v2', true));
    newrelic.addAttribute('raasBackendResolve', true);

    if (validationResolve) {
      newrelic.addAttribute('raasBackendValidation', true);
    }
  }

  var isCompare = isComparisonConfig(report.get('config'));
  var compareType = isCompare && report.getIn(['config', 'compare']);
  var isFunnelOrPipeline = [FUNNEL, PIPELINE].includes(report.getIn(['config', 'configType']));
  var needTotalsReport = ((report.getIn(['config', 'dimensions']) || List()).count() !== 0 || report.getIn(['config', 'configType']) !== SEARCH) && report.getIn(['displayParams', 'showTotals']);
  var apiRequests = List();

  if (isCompare) {
    var fixedCompareReport = applyCompareFixes(report);
    report = fixedCompareReport.report;

    var _splitConfig = splitConfig(report.get('config')),
        baseConfig = _splitConfig.config,
        compareConfig = _splitConfig.compareConfig;

    report = report.set('config', baseConfig);
    var compareReport = report.set('config', compareConfig);
    apiRequests = apiRequests.push(makeReportingApiRequest('compare', compareReport, useLocalReportingApis));
  }

  if (needTotalsReport && !isFunnelOrPipeline) {
    var poppedDimension = report.getIn(['config', 'dimensions']).last();
    var summaryReport = report.updateIn(['config', 'dimensions'], function (val) {
      return val.pop();
    }).setIn(['config', 'configType'], AGGREGATION).updateIn(['config', 'sort'], function (sorts) {
      return sorts.filter(function (sort) {
        var propertyWithoutSuffix = sort.get('property').split('.')[0];
        return propertyWithoutSuffix !== poppedDimension;
      });
    });
    apiRequests = apiRequests.push(makeReportingApiRequest('summary', summaryReport, useLocalReportingApis, true));
  }

  apiRequests = apiRequests.push(makeReportingApiRequest('primary', report, useLocalReportingApis));
  return preconditions.generate(report.get('config')).then(function () {
    return Promise.all(apiRequests.toJS()).then(function (datasets) {
      var primaryDataset = fromJS(datasets).last().getIn(['primary', 'data']);
      return Promise.all([].concat(_toConsumableArray(datasets), [resolveV2CustomSeries(report, primaryDataset, true)]));
    }).then(function (datasets) {
      if (isCompare) {
        datasets = densifyComparison(report.get('config'), datasets);
        datasets = datasets.map(function (dataset) {
          if (dataset.has('primary')) {
            return dataset.setIn(['primary', 'config', 'compare'], compareType);
          }

          return dataset;
        });
      }

      if (needTotalsReport && isFunnelOrPipeline) {
        datasets = createFunnelSummary(datasets);
      }

      var dataObject = fromJS(datasets).reduce(function (a, b) {
        return a.merge(b);
      });

      if (newrelic) {
        newrelic.logSuccess();
      }

      return dataObject;
    }).catch(function (error) {
      if (newrelic) {
        newrelic.logError(error.errorBody || error, 'NewReportingAPIRequestFailed');
      }

      if (validationResolve) {
        throw error;
      }

      generateError(error.errorBody ? error.errorBody : error);
    });
  });
};