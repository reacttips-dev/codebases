/**
 * Copyright 2019-2020, Optimizely
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
    isFeatureExperiment
} from '../project_config';

// Get Experiment Ids which are part of rollouts
function getRolloutExperimentIds(rollouts) {
    return (rollouts || []).reduce(function(experimentIds, rollout) {
        rollout.experiments.forEach(function(e) {
            experimentIds[e.id] = true;
        });
        return experimentIds;
    }, {});
}

// Gets Map of all experiments except rollouts
function getExperimentsMap(configObj) {
    var rolloutExperimentIds = getRolloutExperimentIds(configObj.rollouts);
    var featureVariablesMap = (configObj.featureFlags || []).reduce(function(resultMap, feature) {
        resultMap[feature.id] = feature.variables;
        return resultMap;
    }, {});
    return (configObj.experiments || []).reduce(function(experiments, experiment) {
        // skip experiments that are part of a rollout
        if (!rolloutExperimentIds[experiment.id]) {
            experiments[experiment.key] = {
                id: experiment.id,
                key: experiment.key,
                variationsMap: (experiment.variations || []).reduce(function(variations, variation) {
                    variations[variation.key] = {
                        id: variation.id,
                        key: variation.key,
                        variablesMap: getMergedVariablesMap(configObj, variation, experiment.id, featureVariablesMap),
                    };
                    if (isFeatureExperiment(configObj, experiment.id)) {
                        variations[variation.key].featureEnabled = variation.featureEnabled;
                    }
                    return variations;
                }, {}),
            };
        }
        return experiments;
    }, {});
}

// Merges feature key and type from feature variables to variation variables.
function getMergedVariablesMap(configObj, variation, experimentId, featureVariablesMap) {
    var featureId = configObj.experimentFeatureMap[experimentId];
    var variablesObject = {};
    if (featureId) {
        var experimentFeatureVariables = featureVariablesMap[featureId];
        // Temporary variation variables map to get values to merge.
        var tempVariablesIdMap = (variation.variables || []).reduce(function(variablesMap, variable) {
            variablesMap[variable.id] = {
                id: variable.id,
                value: variable.value,
            };
            return variablesMap;
        }, {});
        variablesObject = (experimentFeatureVariables || []).reduce(function(variablesMap, featureVariable) {
            var variationVariable = tempVariablesIdMap[featureVariable.id];
            var variableValue =
                variation.featureEnabled && variationVariable ? variationVariable.value : featureVariable.defaultValue;
            variablesMap[featureVariable.key] = {
                id: featureVariable.id,
                key: featureVariable.key,
                type: featureVariable.type,
                value: variableValue,
            };
            return variablesMap;
        }, {});
    }
    return variablesObject;
}

// Gets map of all experiments
function getFeaturesMap(configObj, allExperiments) {
    return (configObj.featureFlags || []).reduce(function(features, feature) {
        features[feature.key] = {
            id: feature.id,
            key: feature.key,
            experimentsMap: (feature.experimentIds || []).reduce(function(experiments, experimentId) {
                var experimentKey = configObj.experimentIdMap[experimentId].key;
                experiments[experimentKey] = allExperiments[experimentKey];
                return experiments;
            }, {}),
            variablesMap: (feature.variables || []).reduce(function(variables, variable) {
                variables[variable.key] = {
                    id: variable.id,
                    key: variable.key,
                    type: variable.type,
                    value: variable.defaultValue,
                };
                return variables;
            }, {}),
        };
        return features;
    }, {});
}

/**
 * The OptimizelyConfig class
 * @param {Object} configObj
 * @param {string} datafile
 */
export function OptimizelyConfig(configObj, datafile) {
    this.experimentsMap = getExperimentsMap(configObj);
    this.featuresMap = getFeaturesMap(configObj, this.experimentsMap);
    this.revision = configObj.revision;
    this.__datafile = datafile;
}

/**
 * Get the datafile
 * @returns {string} JSON string representation of the datafile that was used to create the current config object
 */
OptimizelyConfig.prototype.getDatafile = function() {
    return this.__datafile;
}

export default {
    OptimizelyConfig: OptimizelyConfig
}