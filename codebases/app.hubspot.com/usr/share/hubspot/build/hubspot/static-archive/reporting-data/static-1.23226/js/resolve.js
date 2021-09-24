'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { List, Map as ImmutableMap, fromJS } from 'immutable';
import { NewRelicInteraction } from './monitoring/newrelic';
import store from './redux/store';
import connectActions from './redux/connectActions';
import { getConfigId, getDataPromise } from './redux/resolve/get';
import { addConfig as addConfigAction, setConfigured as setConfiguredAction, setPromise as setPromiseAction, setStatus as setStatusAction, setData as setDataAction, debug as debugAction } from './redux/resolve/actions';
import * as StatusTypes from './redux/StatusTypes';
import { Promise } from './lib/promise';
import rethrow from './lib/rethrow';
import { connectedConfigure, configure as runConfigure } from './configure';
import { connectedRetrieve } from './retrieve';
import { connectedProcess } from './process';
import { connectedHydrate } from './hydrate';
import { isComparisonConfig, splitConfig } from './compare';
import invariant from './lib/invariant';
import { densify } from './dataset/dense-compare';
import { ENGAGEMENTS, CROSS_OBJECT } from './constants/dataTypes';
import { SEARCH } from './constants/configTypes';
import { fromDataset } from './v2/dataset/convert';
import getProperties from './properties';
import getCrossObjectProperties from './retrieve/inboundDb/aggregate/cross-object/properties';
import { validateReportForReportingBackendApi, shouldValidateReportForReportingBackendApi } from './v2/reportingApi/validation';
import { NoDimensionsOrMetricsException } from './exceptions';
import { VISUALIZATION_STATUS } from './v2/reportingApi/validation';
import { resolveV2CustomSeries } from './customSeries/resolveV2CustomSeries';

var getSummaryV2Dataset = function getSummaryV2Dataset(config, dataset, properties) {
  return runConfigure(config).then(function (configured) {
    var dimensionCount = configured.get('dimensions').count();

    if (dimensionCount === 0 || config.get('configType') === SEARCH) {
      return undefined;
    }

    var summaryConfig = configured.update('dimensions', function (dimensions) {
      return dimensions.pop();
    }).update('metrics', function (metrics) {
      return metrics.shift();
    });
    var summaryDataset = dimensionCount === 1 ? dataset.delete('dimension') : dataset.updateIn(['dimension', 'buckets'], function (buckets) {
      return buckets.map(function (bucket) {
        return bucket.delete('dimension');
      });
    });
    return ImmutableMap({
      config: summaryConfig.delete('v2'),
      data: fromDataset(summaryConfig, summaryDataset, properties, {
        isSummary: true
      })
    });
  });
};

var upgradeToV2 = function upgradeToV2(config, dataset, properties, comparePropertyLabel) {
  var propertiesPromise = config.get('dataType') === CROSS_OBJECT ? getCrossObjectProperties(config) : Promise.resolve(properties);
  return runConfigure(config).then(function (configuredReport) {
    return propertiesPromise.then(function (mergedProperties) {
      return ImmutableMap({
        config: configuredReport.delete('v2'),
        data: fromDataset(configuredReport, dataset, mergedProperties, {
          comparePropertyLabel: comparePropertyLabel
        })
      });
    });
  });
};

var resolve = function resolve(config) {
  var runtimeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  invariant(config.get('dataType') !== ENGAGEMENTS || config.get('crossObject') != null, 'dataType ENGAGEMENTS can only be used with cross-object reports, use ENGAGEMENT instead');

  var _connectActions = connectActions(store, [setConfiguredAction, setStatusAction, setDataAction, debugAction]),
      _connectActions2 = _slicedToArray(_connectActions, 4),
      setConfigured = _connectActions2[0],
      setStatus = _connectActions2[1],
      setData = _connectActions2[2],
      debug = _connectActions2[3];

  var dataPhase = 'configure';

  var debugFn = function debugFn(key, value) {
    dataPhase = key;
    debug({
      config: config,
      key: key,
      value: value
    });
  };

  var newrelic = runtimeOptions.newrelic;
  var configure = connectedConfigure(store)(config, runtimeOptions);
  var retrieve = connectedRetrieve(store)(config, runtimeOptions);
  var process = connectedProcess(store)(config, runtimeOptions);
  var hydrate = connectedHydrate(store)(config, runtimeOptions);

  var handleError = function handleError(error) {
    setStatus({
      config: config,
      status: StatusTypes.ERRORED,
      error: error
    });

    if (newrelic) {
      newrelic.logError(error, dataPhase);
    }

    debugFn('exceptions', List.of(error));
  };

  var withDataAge = function withDataAge(data) {
    return Object.assign({}, data, {
      dataset: data.dataset.set('dataAge', Date.now())
    });
  };

  try {
    if (config.get('dataType') !== CROSS_OBJECT && (config.get('dimensions') || List()).isEmpty() && (config.get('metrics') || List()).isEmpty()) {
      throw new NoDimensionsOrMetricsException();
    }

    return configure(config).then(function (configured) {
      dataPhase = 'retrieve';
      setConfigured({
        config: config,
        configured: configured
      });
      return retrieve(configured);
    }).then(withDataAge).then(function (retrieved) {
      debugFn('process', retrieved.dataset);
      return retrieved;
    }).then(process).then(function (processed) {
      debugFn('hydrate', processed.dataset);
      return processed;
    }).then(hydrate).then(function (dataset) {
      return List.of(dataset);
    }).then(function (data) {
      setData({
        config: config,
        data: data
      });
      setStatus({
        config: config,
        status: StatusTypes.SUCCEEDED
      });

      if (newrelic) {
        newrelic.logSuccess();
      }

      debugFn('resolved', data.get(0));
      return data;
    }).catch(function (error) {
      handleError(error);
      return rethrow(error);
    });
  } catch (e) {
    handleError(e);
    throw e;
  }
};

var connectedResolve = function connectedResolve(config) {
  var runtimeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _connectActions3 = connectActions(store, [addConfigAction, setPromiseAction]),
      _connectActions4 = _slicedToArray(_connectActions3, 2),
      addConfig = _connectActions4[0],
      setPromise = _connectActions4[1];

  var state = store.getState();

  if (getConfigId(state, config) == null) {
    addConfig({
      config: config
    });
    setPromise({
      config: config,
      promise: resolve(config, runtimeOptions)
    });
  }

  return getDataPromise(store.getState(), config);
};

var run = function run(config) {
  var runtimeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _runtimeOptions$v2Dat = runtimeOptions.v2Datasets,
      v2Datasets = _runtimeOptions$v2Dat === void 0 ? false : _runtimeOptions$v2Dat;
  var dataType = config.get('dataType');
  var propertiesPromise = getProperties(dataType);

  var _connectActions5 = connectActions(store, [setStatusAction, setDataAction, debugAction]),
      _connectActions6 = _slicedToArray(_connectActions5, 3),
      setStatus = _connectActions6[0],
      setData = _connectActions6[1],
      debug = _connectActions6[2];

  try {
    if (runtimeOptions.newrelic === undefined) {
      var nr = new NewRelicInteraction();
      var report = runtimeOptions.report;
      var reportWithUpdatedConfig = config && report ? report.set('config', config) : report;

      if (reportWithUpdatedConfig) {
        nr.addReportAttributes(reportWithUpdatedConfig);
      } else {
        nr.addReportConfigAttributes(config);
      }

      runtimeOptions.newrelic = nr;
    }

    if (isComparisonConfig(config)) {
      // Ensure we do not use cached v2 data, as connectedResolve expects v1 data which it upgrades to v2
      var _splitConfig = splitConfig(config.delete('v2')),
          baseConfig = _splitConfig.config,
          compareConfig = _splitConfig.compareConfig,
          compareLabel = _splitConfig.compareLabel;

      var basePromise = connectedResolve(baseConfig, runtimeOptions);
      var comparePromise = connectedResolve(compareConfig, Object.assign({}, runtimeOptions, {
        newrelic: null
      })).then(function (dataSet) {
        return dataSet.setIn([0, 'dimension', 'propertyLabel'], compareLabel);
      });
      return Promise.all([basePromise, comparePromise, propertiesPromise]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3),
            base = _ref2[0],
            compare = _ref2[1],
            properties = _ref2[2];

        return {
          data: densify(config, base, compare),
          properties: properties
        };
      }).then(function (_ref3) {
        var data = _ref3.data,
            properties = _ref3.properties;
        return v2Datasets ? Promise.all([upgradeToV2(baseConfig, data.first(), properties), upgradeToV2(compareConfig, data.get(1), properties, data.getIn([0, 'dimension', 'propertyLabel'])), resolveV2CustomSeries(runtimeOptions.report, data.first())]).then(function (_ref4) {
          var _ref5 = _slicedToArray(_ref4, 3),
              primary = _ref5[0],
              compare = _ref5[1],
              customSeriesDatasets = _ref5[2];

          return ImmutableMap({
            primary: primary,
            compare: compare
          }).merge(customSeriesDatasets);
        }) : data;
      }).then(function (data) {
        setStatus({
          config: config,
          status: StatusTypes.SUCCEEDED
        });
        setData({
          config: config,
          data: data
        });
        return data;
      });
    }

    return Promise.all([resolve(config, runtimeOptions), propertiesPromise]).then(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          data = _ref7[0],
          properties = _ref7[1];

      return v2Datasets ? Promise.all([upgradeToV2(config, data.first(), properties), getSummaryV2Dataset(config, data.first(), properties), resolveV2CustomSeries(runtimeOptions.report, data.first())]).then(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 3),
            primary = _ref9[0],
            summary = _ref9[1],
            customSeriesDatasets = _ref9[2];

        return ImmutableMap({
          primary: primary,
          summary: summary
        }).merge(customSeriesDatasets);
      }) : Promise.resolve(data);
    });
  } catch (e) {
    debug({
      config: config,
      key: 'exceptions',
      value: function value(exceptions) {
        return exceptions.push(e);
      }
    });
    throw e;
  }
};

var connectedRun = function connectedRun(config) {
  var runtimeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  config = runtimeOptions.v2Datasets ? config.set('v2', true) : config;

  if (runtimeOptions.report) {
    var customSeries = fromJS(runtimeOptions.report.getIn(['displayParams', 'customSeries'])) || List();

    if (!customSeries.isEmpty()) {
      config = config.set('customSeries', customSeries);
    }
  }

  var _connectActions7 = connectActions(store, [addConfigAction, setPromiseAction, setDataAction]),
      _connectActions8 = _slicedToArray(_connectActions7, 3),
      addConfig = _connectActions8[0],
      setPromise = _connectActions8[1],
      setData = _connectActions8[2];

  var state = store.getState();

  if (getConfigId(state, config) == null) {
    addConfig({
      config: config
    });
    setPromise({
      config: config,
      promise: run(config, runtimeOptions).then(function (data) {
        shouldValidateReportForReportingBackendApi(ImmutableMap({
          config: config
        })).then(function (shouldValidate) {
          if (shouldValidate && runtimeOptions.v2Datasets) {
            validateReportForReportingBackendApi(ImmutableMap({
              config: config
            }), data, VISUALIZATION_STATUS.REPORT_VISUALIZATION);
          } else if (shouldValidate && !runtimeOptions.v2Datasets) {
            run(config, Object.assign({}, runtimeOptions, {
              v2Datasets: true
            })).then(function (upgradedDataset) {
              return validateReportForReportingBackendApi(ImmutableMap({
                config: config
              }), upgradedDataset, VISUALIZATION_STATUS.REPORT_UI);
            });
          }
        });
        setData({
          config: config,
          data: data
        });
        return data;
      })
    });
  }

  return getDataPromise(store.getState(), config);
};

export default connectedRun;