'use es6';

import I18n from 'I18n';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { CRM_OBJECT, DEALS } from '../../constants/dataTypes';
import { MAX_NUM_OF_METRICS } from '../../constants/limits';
import { HUBSPOT_OBJECT_COORDINATES_TO_DATA_TYPE } from '../../constants/objectCoordinates';
import * as Operators from '../../constants/operators';
import { InvalidTwoDimensionMetricException, TooManyDealStagesException } from '../../exceptions';
import { countUniqueMetrics } from '../../lib/countUniqueMetrics';
import { Promise } from '../../lib/promise';
import { slug } from '../../lib/slug';
import { get as getPipelines } from '../../retrieve/inboundDb/pipelines';
/**
 * Wildcard dealstage duration property
 *
 * @constant {string}
 * @private
 */

var PROPERTY = 'dealstages.*_duration';
/**
 * Whether to run configure step
 *
 * @param {ReportConfiguration} config Report configuration
 * @returns {boolean} Whether to run configure ste[]
 * @private
 */

var shouldConfigure = function shouldConfigure(config) {
  var dataType = config.get('dataType') === CRM_OBJECT ? HUBSPOT_OBJECT_COORDINATES_TO_DATA_TYPE.get(config.get('objectTypeId'), CRM_OBJECT) : config.get('dataType');
  return dataType === DEALS && config.has('metrics') && config.get('metrics').some(function (metric) {
    return metric.get('property') === PROPERTY;
  });
};
/**
 * Parse pipelines response to Map
 *
 * @param {PipelinesResponse} response Raw pipelines response
 * @returns {Map<string, Pipeline>} Mapped response with pipeline id keys
 * @private
 */


var parseResponse = function parseResponse(response) {
  return response.reduce(function (memo, pipeline) {
    return memo.set(pipeline.get('pipelineId'), pipeline);
  }, ImmutableMap());
};
/**
 * Pipeline stage collecting reducer
 *
 * @param {List} stages Accumulated stages
 * @param {Pipeline} pipeline Current pipeline
 * @returns {List<Stage>} Collected pipeline stages
 * @private
 */


var collectStages = function collectStages(stages, pipeline) {
  return stages.concat(pipeline.get('stages', List()));
};
/**
 * Create stage duration property
 *
 * @param {Stage} stage Pipeline stage
 * @returns {string} Stage duration property
 * @private
 */


var createDurationProperty = function createDurationProperty(stage) {
  return "dealstages." + slug(stage.get('stageId')) + "_duration";
};
/**
 * Filtered pipeline stages
 *
 * @param {ReportConfiguration} config Report configuration
 * @param {Map<string, Pipeline>} pipeline Mapped pipelines
 * @returns {List<Stage>} pipeline Mapped pipelines
 * @private
 */


var getPipelineStages = function getPipelineStages(config, pipelines) {
  return (config.getIn(['filters', 'custom']) || List()).map(function (filter) {
    return filter.toJS();
  }).filter(function (_ref) {
    var property = _ref.property;
    return property === 'pipeline';
  }).reduce(function (_, _ref2) {
    var operator = _ref2.operator,
        value = _ref2.value,
        values = _ref2.values;

    switch (operator) {
      case Operators.EQ:
        return pipelines.getIn([value, 'stages'], List());

      case Operators.IN:
        return values.filter(function (pipelineId) {
          return pipelines.has(pipelineId);
        }).map(function (pipelineId) {
          return pipelines.get(pipelineId);
        }).reduce(collectStages, List());

      case Operators.NEQ:
        return pipelines.filter(function (pipeline, pipelineId) {
          return value !== pipelineId;
        }).reduce(collectStages, List());

      case Operators.NOT_IN:
        return pipelines.filter(function (pipeline, pipelineId) {
          return !values.includes(pipelineId);
        }).reduce(collectStages, List());

      default:
        return List();
    }
  }, pipelines.reduce(collectStages, List()));
};

var getFilteredStages = function getFilteredStages(config, pipelines) {
  var pipelineStages = getPipelineStages(config, pipelines);
  return (config.getIn(['filters', 'custom']) || List()).map(function (filter) {
    return filter.toJS();
  }).filter(function (_ref3) {
    var property = _ref3.property;
    return property === 'dealstage';
  }).reduce(function (memo, _ref4) {
    var operator = _ref4.operator,
        values = _ref4.values;

    if (operator === Operators.IN) {
      return memo.filter(function (stage) {
        return values.includes(stage.get('stageId'));
      });
    }

    if (operator === Operators.NOT_IN) {
      return memo.filter(function (stage) {
        return !values.includes(stage.get('stageId'));
      });
    }

    if (operator === Operators.NOT_HAS_PROPERTY) {
      return List();
    }

    return memo;
  }, pipelineStages);
};

export var configureWithStages = function configureWithStages(config, stages) {
  var stagesProvidedFromRaasApi = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!shouldConfigure(config)) {
    return config;
  }

  if (config.get('dimensions', List()).count() > 1) {
    throw new InvalidTwoDimensionMetricException({
      propertyName: I18n.text('reporting-data.properties.deals.timeInAllStages')
    });
  }

  if (stagesProvidedFromRaasApi) {
    stages = stages.filter(function (item) {
      return item.getIn(['columnGroup', 'sourceName']) === PROPERTY;
    }).sortBy(function (item) {
      return item.getIn(['columnGroup', 'order']);
    });
  }

  return config.update('metrics', function (metrics) {
    var configuredMetrics = metrics.reduce(function (memo, metric) {
      return metric.get('property') === PROPERTY ? memo.concat(stages.map(function (stage) {
        return metric.set('property', stagesProvidedFromRaasApi ? stage.get('field') : createDurationProperty(stage));
      })) : memo.push(metric);
    }, List());

    if (countUniqueMetrics(configuredMetrics) > MAX_NUM_OF_METRICS) {
      throw new TooManyDealStagesException();
    }

    return configuredMetrics;
  });
};
/**
 * Stage duration configure step
 *
 * @param {ReportConfiguration} config Report configuration
 * @returns {ReportConfiguration} Updated report configuration
 */

export var configure = function configure(config) {
  if (!shouldConfigure(config)) {
    return Promise.resolve(config);
  }

  return getPipelines(DEALS).then(fromJS).then(parseResponse).then(function (pipelines) {
    var stages = getFilteredStages(config, pipelines);
    return configureWithStages(config, stages);
  });
};