/**
 * Copyright 2016-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
    sprintf,
    objectValues
} from '@optimizely/js-sdk-utils';

import fns from '../../utils/fns';
import {
    ERROR_MESSAGES,
    LOG_LEVEL,
    LOG_MESSAGES,
    FEATURE_VARIABLE_TYPES,
} from '../../utils/enums';
import configValidator from '../../utils/config_validator';

var EXPERIMENT_RUNNING_STATUS = 'Running';
var RESERVED_ATTRIBUTE_PREFIX = '$opt_';
var MODULE_NAME = 'PROJECT_CONFIG';

function createMutationSafeDatafileCopy(datafile) {
    var datafileCopy = fns.assign({}, datafile);
    datafileCopy.audiences = (datafile.audiences || []).map(function(audience) {
        return fns.assign({}, audience);
    });
    datafileCopy.experiments = (datafile.experiments || []).map(function(experiment) {
        return fns.assign({}, experiment);
    });
    datafileCopy.featureFlags = (datafile.featureFlags || []).map(function(featureFlag) {
        return fns.assign({}, featureFlag);
    });
    datafileCopy.groups = (datafile.groups || []).map(function(group) {
        var groupCopy = fns.assign({}, group);
        groupCopy.experiments = (group.experiments || []).map(function(experiment) {
            return fns.assign({}, experiment);
        });
        return groupCopy;
    });
    datafileCopy.rollouts = (datafile.rollouts || []).map(function(rollout) {
        var rolloutCopy = fns.assign({}, rollout);
        rolloutCopy.experiments = (rollout.experiments || []).map(function(experiment) {
            return fns.assign({}, experiment);
        });
        return rolloutCopy;
    });
    return datafileCopy;
}

/**
 * Creates projectConfig object to be used for quick project property lookup
 * @param  {Object}   datafileObj   JSON datafile representing the project
 * @param  {string=}  datafileStr   JSON string representation of the datafile
 * @return {Object}   Object representing project configuration
 */
export var createProjectConfig = function(datafileObj, datafileStr = null) {
    var projectConfig = createMutationSafeDatafileCopy(datafileObj);

    projectConfig.__datafileStr = datafileStr === null ? JSON.stringify(datafileObj) : datafileStr;

    /*
     * Conditions of audiences in projectConfig.typedAudiences are not
     * expected to be string-encoded as they are here in projectConfig.audiences.
     */
    (projectConfig.audiences || []).forEach(function(audience) {
        audience.conditions = JSON.parse(audience.conditions);
    });
    projectConfig.audiencesById = fns.keyBy(projectConfig.audiences, 'id');
    fns.assign(projectConfig.audiencesById, fns.keyBy(projectConfig.typedAudiences, 'id'));

    projectConfig.attributeKeyMap = fns.keyBy(projectConfig.attributes, 'key');
    projectConfig.eventKeyMap = fns.keyBy(projectConfig.events, 'key');
    projectConfig.groupIdMap = fns.keyBy(projectConfig.groups, 'id');

    var experiments;
    Object.keys(projectConfig.groupIdMap || {}).forEach(function(Id) {
        experiments = projectConfig.groupIdMap[Id].experiments;
        (experiments || []).forEach(function(experiment) {
            projectConfig.experiments.push(fns.assign(experiment, {
                groupId: Id
            }));
        });
    });

    projectConfig.rolloutIdMap = fns.keyBy(projectConfig.rollouts || [], 'id');
    objectValues(projectConfig.rolloutIdMap || {}).forEach(function(rollout) {
        (rollout.experiments || []).forEach(function(experiment) {
            projectConfig.experiments.push(experiment);
            // Creates { <variationKey>: <variation> } map inside of the experiment
            experiment.variationKeyMap = fns.keyBy(experiment.variations, 'key');
        });
    });

    projectConfig.experimentKeyMap = fns.keyBy(projectConfig.experiments, 'key');
    projectConfig.experimentIdMap = fns.keyBy(projectConfig.experiments, 'id');

    projectConfig.variationIdMap = {};
    projectConfig.variationVariableUsageMap = {};
    (projectConfig.experiments || []).forEach(function(experiment) {
        // Creates { <variationKey>: <variation> } map inside of the experiment
        experiment.variationKeyMap = fns.keyBy(experiment.variations, 'key');

        // Creates { <variationId>: { key: <variationKey>, id: <variationId> } } mapping for quick lookup
        fns.assign(projectConfig.variationIdMap, fns.keyBy(experiment.variations, 'id'));
        objectValues(experiment.variationKeyMap || {}).forEach(function(variation) {
            if (variation.variables) {
                projectConfig.variationVariableUsageMap[variation.id] = fns.keyBy(variation.variables, 'id');
            }
        });
    });

    // Object containing experiment Ids that exist in any feature
    // for checking that experiment is a feature experiment or not.
    projectConfig.experimentFeatureMap = {};

    projectConfig.featureKeyMap = fns.keyBy(projectConfig.featureFlags || [], 'key');
    objectValues(projectConfig.featureKeyMap || {}).forEach(function(feature) {
        // Json type is represented in datafile as a subtype of string for the sake of backwards compatibility.
        // Converting it to a first-class json type while creating Project Config
        feature.variables.forEach(function(variable) {
            if (variable.type === FEATURE_VARIABLE_TYPES.STRING && variable.subType === FEATURE_VARIABLE_TYPES.JSON) {
                variable.type = FEATURE_VARIABLE_TYPES.JSON;
                delete variable.subType;
            }
        });

        feature.variableKeyMap = fns.keyBy(feature.variables, 'key');
        (feature.experimentIds || []).forEach(function(experimentId) {
            // Add this experiment in experiment-feature map.
            if (projectConfig.experimentFeatureMap[experimentId]) {
                projectConfig.experimentFeatureMap[experimentId].push(feature.id);
            } else {
                projectConfig.experimentFeatureMap[experimentId] = [feature.id];
            }

            var experimentInFeature = projectConfig.experimentIdMap[experimentId];
            // Experiments in feature can only belong to one mutex group.
            if (experimentInFeature.groupId && !feature.groupId) {
                feature.groupId = experimentInFeature.groupId;
            }
        });
    });

    return projectConfig;
};

/**
 * Get experiment ID for the provided experiment key
 * @param  {Object} projectConfig Object representing project configuration
 * @param  {string} experimentKey Experiment key for which ID is to be determined
 * @return {string} Experiment ID corresponding to the provided experiment key
 * @throws If experiment key is not in datafile
 */
export var getExperimentId = function(projectConfig, experimentKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (!experiment) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_KEY, MODULE_NAME, experimentKey));
    }
    return experiment.id;
};

/**
 * Get layer ID for the provided experiment key
 * @param  {Object} projectConfig Object representing project configuration
 * @param  {string} experimentId Experiment ID for which layer ID is to be determined
 * @return {string} Layer ID corresponding to the provided experiment key
 * @throws If experiment key is not in datafile
 */
export var getLayerId = function(projectConfig, experimentId) {
    var experiment = projectConfig.experimentIdMap[experimentId];
    if (!experiment) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_ID, MODULE_NAME, experimentId));
    }
    return experiment.layerId;
};

/**
 * Get attribute ID for the provided attribute key
 * @param  {Object}      projectConfig Object representing project configuration
 * @param  {string}      attributeKey  Attribute key for which ID is to be determined
 * @param  {Object}      logger
 * @return {string|null} Attribute ID corresponding to the provided attribute key. Attribute key if it is a reserved attribute.
 */
export var getAttributeId = function(projectConfig, attributeKey, logger) {
    var attribute = projectConfig.attributeKeyMap[attributeKey];
    var hasReservedPrefix = attributeKey.indexOf(RESERVED_ATTRIBUTE_PREFIX) === 0;
    if (attribute) {
        if (hasReservedPrefix) {
            logger.log(
                LOG_LEVEL.WARN,
                sprintf(
                    'Attribute %s unexpectedly has reserved prefix %s; using attribute ID instead of reserved attribute name.',
                    attributeKey,
                    RESERVED_ATTRIBUTE_PREFIX
                )
            );
        }
        return attribute.id;
    } else if (hasReservedPrefix) {
        return attributeKey;
    }

    logger.log(LOG_LEVEL.DEBUG, sprintf(ERROR_MESSAGES.UNRECOGNIZED_ATTRIBUTE, MODULE_NAME, attributeKey));
    return null;
};

/**
 * Get event ID for the provided
 * @param  {Object}      projectConfig Object representing project configuration
 * @param  {string}      eventKey      Event key for which ID is to be determined
 * @return {string|null} Event ID corresponding to the provided event key
 */
export var getEventId = function(projectConfig, eventKey) {
    var event = projectConfig.eventKeyMap[eventKey];
    if (event) {
        return event.id;
    }
    return null;
};

/**
 * Get experiment status for the provided experiment key
 * @param  {Object} projectConfig Object representing project configuration
 * @param  {string} experimentKey Experiment key for which status is to be determined
 * @return {string} Experiment status corresponding to the provided experiment key
 * @throws If experiment key is not in datafile
 */
export var getExperimentStatus = function(projectConfig, experimentKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (!experiment) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_KEY, MODULE_NAME, experimentKey));
    }
    return experiment.status;
};

/**
 * Returns whether experiment has a status of 'Running'
 * @param  {Object}  projectConfig Object representing project configuration
 * @param  {string}  experimentKey Experiment key for which status is to be compared with 'Running'
 * @return {Boolean}               true if experiment status is set to 'Running', false otherwise
 */
export var isActive = function(projectConfig, experimentKey) {
    return getExperimentStatus(projectConfig, experimentKey) === EXPERIMENT_RUNNING_STATUS;
};

/**
 * Determine for given experiment if event is running, which determines whether should be dispatched or not
 */
export var isRunning = function(projectConfig, experimentKey) {
    return getExperimentStatus(projectConfig, experimentKey) === EXPERIMENT_RUNNING_STATUS;
};

/**
 * Get audience conditions for the experiment
 * @param  {Object}         projectConfig Object representing project configuration
 * @param  {string}         experimentKey Experiment key for which audience conditions are to be determined
 * @return {Array}          Audience conditions for the experiment - can be an array of audience IDs, or a
 *                          nested array of conditions
 *                          Examples: ["5", "6"], ["and", ["or", "1", "2"], "3"]
 * @throws If experiment key is not in datafile
 */
export var getExperimentAudienceConditions = function(projectConfig, experimentKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (!experiment) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_KEY, MODULE_NAME, experimentKey));
    }

    return experiment.audienceConditions || experiment.audienceIds;
};

/**
 * Get variation key given experiment key and variation ID
 * @param  {Object} projectConfig Object representing project configuration
 * @param  {string} variationId   ID of the variation
 * @return {string|null} Variation key or null if the variation ID is not found
 */
export var getVariationKeyFromId = function(projectConfig, variationId) {
    if (projectConfig.variationIdMap.hasOwnProperty(variationId)) {
        return projectConfig.variationIdMap[variationId].key;
    }
    return null;
};

/**
 * Get the variation ID given the experiment key and variation key
 * @param  {Object} projectConfig Object representing project configuration
 * @param  {string} experimentKey Key of the experiment the variation belongs to
 * @param  {string} variationKey  The variation key
 * @return {string} the variation ID
 */
export var getVariationIdFromExperimentAndVariationKey = function(projectConfig, experimentKey, variationKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (experiment.variationKeyMap.hasOwnProperty(variationKey)) {
        return experiment.variationKeyMap[variationKey].id;
    }
    return null;
};

/**
 * Get experiment from provided experiment key
 * @param  {Object} projectConfig  Object representing project configuration
 * @param  {string} experimentKey  Event key for which experiment IDs are to be retrieved
 * @return {Object} experiment
 * @throws If experiment key is not in datafile
 */
export var getExperimentFromKey = function(projectConfig, experimentKey) {
    if (projectConfig.experimentKeyMap.hasOwnProperty(experimentKey)) {
        var experiment = projectConfig.experimentKeyMap[experimentKey];
        if (experiment) {
            return experiment;
        }
    }

    throw new Error(sprintf(ERROR_MESSAGES.EXPERIMENT_KEY_NOT_IN_DATAFILE, MODULE_NAME, experimentKey));
};

/**
 * Given an experiment key, returns the traffic allocation within that experiment
 * @param  {Object} projectConfig Object representing project configuration
 * @param  {string} experimentKey Key representing the experiment
 * @return {Array<Object>}        Traffic allocation for the experiment
 * @throws If experiment key is not in datafile
 */
export var getTrafficAllocation = function(projectConfig, experimentKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (!experiment) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_KEY, MODULE_NAME, experimentKey));
    }
    return experiment.trafficAllocation;
};

/**
 * Get experiment from provided experiment id. Log an error if no experiment
 * exists in the project config with the given ID.
 * @param  {Object} projectConfig  Object representing project configuration
 * @param  {string} experimentId  ID of desired experiment object
 * @return {Object} Experiment object
 */
export var getExperimentFromId = function(projectConfig, experimentId, logger) {
    if (projectConfig.experimentIdMap.hasOwnProperty(experimentId)) {
        var experiment = projectConfig.experimentIdMap[experimentId];
        if (experiment) {
            return experiment;
        }
    }

    logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_ID, MODULE_NAME, experimentId));
    return null;
};

/**
 * Get feature from provided feature key. Log an error if no feature exists in
 * the project config with the given key.
 * @param {Object} projectConfig
 * @param {string} featureKey
 * @param {Object} logger
 * @return {Object|null} Feature object, or null if no feature with the given
 * key exists
 */
export var getFeatureFromKey = function(projectConfig, featureKey, logger) {
    if (projectConfig.featureKeyMap.hasOwnProperty(featureKey)) {
        var feature = projectConfig.featureKeyMap[featureKey];
        if (feature) {
            return feature;
        }
    }

    logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.FEATURE_NOT_IN_DATAFILE, MODULE_NAME, featureKey));
    return null;
};

/**
 * Get the variable with the given key associated with the feature with the
 * given key. If the feature key or the variable key are invalid, log an error
 * message.
 * @param {Object} projectConfig
 * @param {string} featureKey
 * @param {string} variableKey
 * @param {Object} logger
 * @return {Object|null} Variable object, or null one or both of the given
 * feature and variable keys are invalid
 */
export var getVariableForFeature = function(projectConfig, featureKey, variableKey, logger) {
    var feature = projectConfig.featureKeyMap[featureKey];
    if (!feature) {
        logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.FEATURE_NOT_IN_DATAFILE, MODULE_NAME, featureKey));
        return null;
    }

    var variable = feature.variableKeyMap[variableKey];
    if (!variable) {
        logger.log(
            LOG_LEVEL.ERROR,
            sprintf(ERROR_MESSAGES.VARIABLE_KEY_NOT_IN_DATAFILE, MODULE_NAME, variableKey, featureKey)
        );
        return null;
    }

    return variable;
};

/**
 * Get the value of the given variable for the given variation. If the given
 * variable has no value for the given variation, return null. Log an error message if the variation is invalid. If the
 * variable or variation are invalid, return null.
 * @param {Object} projectConfig
 * @param {Object} variable
 * @param {Object} variation
 * @param {Object} logger
 * @return {string|null} The value of the given variable for the given
 * variation, or null if the given variable has no value
 * for the given variation or if the variation or variable are invalid
 */
export var getVariableValueForVariation = function(projectConfig, variable, variation, logger) {
    if (!variable || !variation) {
        return null;
    }

    if (!projectConfig.variationVariableUsageMap.hasOwnProperty(variation.id)) {
        logger.log(
            LOG_LEVEL.ERROR,
            sprintf(ERROR_MESSAGES.VARIATION_ID_NOT_IN_DATAFILE_NO_EXPERIMENT, MODULE_NAME, variation.id)
        );
        return null;
    }

    var variableUsages = projectConfig.variationVariableUsageMap[variation.id];
    var variableUsage = variableUsages[variable.id];

    return variableUsage ? variableUsage.value : null;
};

/**
 * Given a variable value in string form, try to cast it to the argument type.
 * If the type cast succeeds, return the type casted value, otherwise log an
 * error and return null.
 * @param {string} variableValue  Variable value in string form
 * @param {string} variableType   Type of the variable whose value was passed
 *                                in the first argument. Must be one of
 *                                FEATURE_VARIABLE_TYPES in
 *                                lib/utils/enums/index.js. The return value's
 *                                type is determined by this argument (boolean
 *                                for BOOLEAN, number for INTEGER or DOUBLE,
 *                                and string for STRING).
 * @param {Object} logger         Logger instance
 * @returns {*}                   Variable value of the appropriate type, or
 *                                null if the type cast failed
 */
export var getTypeCastValue = function(variableValue, variableType, logger) {
    var castValue;

    switch (variableType) {
        case FEATURE_VARIABLE_TYPES.BOOLEAN:
            if (variableValue !== 'true' && variableValue !== 'false') {
                logger.log(
                    LOG_LEVEL.ERROR,
                    sprintf(ERROR_MESSAGES.UNABLE_TO_CAST_VALUE, MODULE_NAME, variableValue, variableType)
                );
                castValue = null;
            } else {
                castValue = variableValue === 'true';
            }
            break;

        case FEATURE_VARIABLE_TYPES.INTEGER:
            castValue = parseInt(variableValue, 10);
            if (isNaN(castValue)) {
                logger.log(
                    LOG_LEVEL.ERROR,
                    sprintf(ERROR_MESSAGES.UNABLE_TO_CAST_VALUE, MODULE_NAME, variableValue, variableType)
                );
                castValue = null;
            }
            break;

        case FEATURE_VARIABLE_TYPES.DOUBLE:
            castValue = parseFloat(variableValue);
            if (isNaN(castValue)) {
                logger.log(
                    LOG_LEVEL.ERROR,
                    sprintf(ERROR_MESSAGES.UNABLE_TO_CAST_VALUE, MODULE_NAME, variableValue, variableType)
                );
                castValue = null;
            }
            break;

        case FEATURE_VARIABLE_TYPES.JSON:
            try {
                castValue = JSON.parse(variableValue);
            } catch (e) {
                logger.log(
                    LOG_LEVEL.ERROR,
                    sprintf(ERROR_MESSAGES.UNABLE_TO_CAST_VALUE, MODULE_NAME, variableValue, variableType)
                );
                castValue = null;
            }
            break;

        default:
            // type is STRING
            castValue = variableValue;
            break;
    }

    return castValue;
};

/**
 * Returns an object containing all audiences in the project config. Keys are audience IDs
 * and values are audience objects.
 * @param   {Object} projectConfig
 * @returns {Object}
 */
export var getAudiencesById = function(projectConfig) {
    return projectConfig.audiencesById;
};

/**
 * Returns true if an event with the given key exists in the datafile, and false otherwise
 * @param   {Object} projectConfig
 * @param   {string} eventKey
 * @returns {boolean}
 */
export var eventWithKeyExists = function(projectConfig, eventKey) {
    return projectConfig.eventKeyMap.hasOwnProperty(eventKey);
};

/**
 * Returns true if experiment belongs to any feature, false otherwise.
 * @param {Object} projectConfig
 * @param {string} experimentId
 * @returns {boolean} 
 */
export var isFeatureExperiment = function(projectConfig, experimentId) {
    return projectConfig.experimentFeatureMap.hasOwnProperty(experimentId);
};

/**
 * Returns the JSON string representation of the datafile
 * @param   {Object} projectConfig
 * @returns {string}
 */
export var toDatafile = function(projectConfig) {
    return projectConfig.__datafileStr;
}

/**
 * @typedef   {Object}      TryCreatingProjectConfigResult
 * @property  {Object|null} configObj
 * @property  {Error|null}  error
 */

/**
 * Try to create a project config object from the given datafile and
 * configuration properties.
 * Returns an object with configObj and error properties.
 * If successful, configObj is the project config object, and error is null.
 * Otherwise, configObj is null and error is an error with more information.
 * @param   {Object}         config
 * @param   {Object|string}  config.datafile
 * @param   {Object}         config.jsonSchemaValidator
 * @param   {Object}         config.logger
 * @returns {TryCreatingProjectConfigResult}
 */
export var tryCreatingProjectConfig = function(config) {

    var newDatafileObj;
    try {
        newDatafileObj = configValidator.validateDatafile(config.datafile);
    } catch (error) {
        return {
            configObj: null,
            error
        };
    }

    if (config.jsonSchemaValidator) {
        try {
            config.jsonSchemaValidator.validate(newDatafileObj);
            config.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.VALID_DATAFILE, MODULE_NAME));
        } catch (error) {
            return {
                configObj: null,
                error
            };
        }
    } else {
        config.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.SKIPPING_JSON_VALIDATION, MODULE_NAME));
    }

    var createProjectConfigArgs = [newDatafileObj];
    if (typeof config.datafile === 'string') {
        // Since config.datafile was validated above, we know that it is a valid JSON string
        createProjectConfigArgs.push(config.datafile);
    }

    var newConfigObj = createProjectConfig(...createProjectConfigArgs);

    return {
        configObj: newConfigObj,
        error: null,
    };
};

/**
 * Get the send flag decisions value
 * @param  {ProjectConfig}   projectConfig
 * @return {boolean}         A boolean value that indicates if we should send flag decisions
 */
export var getSendFlagDecisionsValue = function(projectConfig) {
    return !!projectConfig.sendFlagDecisions;
}

export default {
    createProjectConfig: createProjectConfig,
    getExperimentId: getExperimentId,
    getLayerId: getLayerId,
    getAttributeId: getAttributeId,
    getEventId: getEventId,
    getExperimentStatus: getExperimentStatus,
    isActive: isActive,
    isRunning: isRunning,
    getExperimentAudienceConditions: getExperimentAudienceConditions,
    getVariationKeyFromId: getVariationKeyFromId,
    getVariationIdFromExperimentAndVariationKey: getVariationIdFromExperimentAndVariationKey,
    getExperimentFromKey: getExperimentFromKey,
    getTrafficAllocation: getTrafficAllocation,
    getExperimentFromId: getExperimentFromId,
    getFeatureFromKey: getFeatureFromKey,
    getVariableForFeature: getVariableForFeature,
    getVariableValueForVariation: getVariableValueForVariation,
    getTypeCastValue: getTypeCastValue,
    getSendFlagDecisionsValue: getSendFlagDecisionsValue,
    getAudiencesById: getAudiencesById,
    eventWithKeyExists: eventWithKeyExists,
    isFeatureExperiment: isFeatureExperiment,
    toDatafile: toDatafile,
    tryCreatingProjectConfig: tryCreatingProjectConfig,
};