/****************************************************************************
 * Copyright 2017-2020 Optimizely, Inc. and contributors                    *
 *                                                                          *
 * Licensed under the Apache License, Version 2.0 (the "License");          *
 * you may not use this file except in compliance with the License.         *
 * You may obtain a copy of the License at                                  *
 *                                                                          *
 *    http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                          *
 * Unless required by applicable law or agreed to in writing, software      *
 * distributed under the License is distributed on an "AS IS" BASIS,        *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *
 * See the License for the specific language governing permissions and      *
 * limitations under the License.                                           *
 ***************************************************************************/
import {
    sprintf
} from '@optimizely/js-sdk-utils';

import fns from '../../utils/fns';
import bucketer from '../bucketer';
import * as enums from '../../utils/enums';
import projectConfig from '../project_config';
import AudienceEvaluator from '../audience_evaluator';
import * as stringValidator from '../../utils/string_value_validator';

var MODULE_NAME = 'DECISION_SERVICE';
var ERROR_MESSAGES = enums.ERROR_MESSAGES;
var LOG_LEVEL = enums.LOG_LEVEL;
var LOG_MESSAGES = enums.LOG_MESSAGES;
var DECISION_SOURCES = enums.DECISION_SOURCES;
var AUDIENCE_EVALUATION_TYPES = enums.AUDIENCE_EVALUATION_TYPES;

/**
 * Optimizely's decision service that determines which variation of an experiment the user will be allocated to.
 *
 * The decision service contains all logic around how a user decision is made. This includes all of the following (in order):
 *   1. Checking experiment status
 *   2. Checking forced bucketing
 *   3. Checking whitelisting
 *   4. Checking user profile service for past bucketing decisions (sticky bucketing)
 *   5. Checking audience targeting
 *   6. Using Murmurhash3 to bucket the user.
 *
 * @constructor
 * @param   {Object} options
 * @param   {Object} options.userProfileService An instance of the user profile service for sticky bucketing.
 * @param   {Object} options.logger An instance of a logger to log messages.
 * @returns {Object}
 */
function DecisionService(options) {
    this.audienceEvaluator = new AudienceEvaluator(options.UNSTABLE_conditionEvaluators);
    this.forcedVariationMap = {};
    this.logger = options.logger;
    this.userProfileService = options.userProfileService || null;
}

/**
 * Gets variation where visitor will be bucketed.
 * @param  {Object}      configObj      The parsed project configuration object
 * @param  {string}      experimentKey
 * @param  {string}      userId
 * @param  {Object}      attributes
 * @return {string|null} the variation the user is bucketed into.
 */
DecisionService.prototype.getVariation = function(configObj, experimentKey, userId, attributes) {
    // by default, the bucketing ID should be the user ID
    var bucketingId = this._getBucketingId(userId, attributes);

    if (!this.__checkIfExperimentIsActive(configObj, experimentKey)) {
        return null;
    }
    var experiment = configObj.experimentKeyMap[experimentKey];
    var forcedVariationKey = this.getForcedVariation(configObj, experimentKey, userId);
    if (forcedVariationKey) {
        return forcedVariationKey;
    }

    var variation = this.__getWhitelistedVariation(experiment, userId);
    if (variation) {
        return variation.key;
    }

    // check for sticky bucketing
    var experimentBucketMap = this.__resolveExperimentBucketMap(userId, attributes);
    variation = this.__getStoredVariation(configObj, experiment, userId, experimentBucketMap);
    if (variation) {
        this.logger.log(
            LOG_LEVEL.INFO,
            sprintf(LOG_MESSAGES.RETURNING_STORED_VARIATION, MODULE_NAME, variation.key, experimentKey, userId)
        );
        return variation.key;
    }

    // Perform regular targeting and bucketing
    if (!this.__checkIfUserIsInAudience(configObj, experimentKey, AUDIENCE_EVALUATION_TYPES.EXPERIMENT, userId, attributes, '')) {
        var userDoesNotMeetConditionsLogMessage = sprintf(
            LOG_MESSAGES.USER_NOT_IN_EXPERIMENT,
            MODULE_NAME,
            userId,
            experimentKey
        );
        this.logger.log(LOG_LEVEL.INFO, userDoesNotMeetConditionsLogMessage);
        return null;
    }

    var bucketerParams = this.__buildBucketerParams(configObj, experimentKey, bucketingId, userId);
    var variationId = bucketer.bucket(bucketerParams);
    variation = configObj.variationIdMap[variationId];
    if (!variation) {
        var userHasNoVariationLogMessage = sprintf(
            LOG_MESSAGES.USER_HAS_NO_VARIATION,
            MODULE_NAME,
            userId,
            experimentKey
        );
        this.logger.log(LOG_LEVEL.DEBUG, userHasNoVariationLogMessage);
        return null;
    }

    var userInVariationLogMessage = sprintf(
        LOG_MESSAGES.USER_HAS_VARIATION,
        MODULE_NAME,
        userId,
        variation.key,
        experimentKey
    );
    this.logger.log(LOG_LEVEL.INFO, userInVariationLogMessage);
    // persist bucketing
    this.__saveUserProfile(experiment, variation, userId, experimentBucketMap);

    return variation.key;
};

/**
 * Merges attributes from attributes[STICKY_BUCKETING_KEY] and userProfileService
 * @param  {Object} attributes
 * @return {Object} finalized copy of experiment_bucket_map
 */
DecisionService.prototype.__resolveExperimentBucketMap = function(userId, attributes) {
    attributes = attributes || {};
    var userProfile = this.__getUserProfile(userId) || {};
    var attributeExperimentBucketMap = attributes[enums.CONTROL_ATTRIBUTES.STICKY_BUCKETING_KEY];
    return fns.assign({}, userProfile.experiment_bucket_map, attributeExperimentBucketMap);
};

/**
 * Checks whether the experiment is running
 * @param  {Object}  configObj     The parsed project configuration object
 * @param  {string}  experimentKey Key of experiment being validated
 * @param  {string}  userId        ID of user
 * @return {boolean} True if experiment is running
 */
DecisionService.prototype.__checkIfExperimentIsActive = function(configObj, experimentKey) {
    if (!projectConfig.isActive(configObj, experimentKey)) {
        var experimentNotRunningLogMessage = sprintf(LOG_MESSAGES.EXPERIMENT_NOT_RUNNING, MODULE_NAME, experimentKey);
        this.logger.log(LOG_LEVEL.INFO, experimentNotRunningLogMessage);
        return false;
    }

    return true;
};

/**
 * Checks if user is whitelisted into any variation and return that variation if so
 * @param  {Object} experiment
 * @param  {string} userId
 * @return {string|null} Forced variation if it exists for user ID, otherwise null
 */
DecisionService.prototype.__getWhitelistedVariation = function(experiment, userId) {
    if (experiment.forcedVariations && experiment.forcedVariations.hasOwnProperty(userId)) {
        var forcedVariationKey = experiment.forcedVariations[userId];
        if (experiment.variationKeyMap.hasOwnProperty(forcedVariationKey)) {
            var forcedBucketingSucceededMessageLog = sprintf(
                LOG_MESSAGES.USER_FORCED_IN_VARIATION,
                MODULE_NAME,
                userId,
                forcedVariationKey
            );
            this.logger.log(LOG_LEVEL.INFO, forcedBucketingSucceededMessageLog);
            return experiment.variationKeyMap[forcedVariationKey];
        } else {
            var forcedBucketingFailedMessageLog = sprintf(
                LOG_MESSAGES.FORCED_BUCKETING_FAILED,
                MODULE_NAME,
                forcedVariationKey,
                userId
            );
            this.logger.log(LOG_LEVEL.ERROR, forcedBucketingFailedMessageLog);
            return null;
        }
    }

    return null;
};

/**
 * Checks whether the user is included in experiment audience
 * @param  {Object}  configObj            The parsed project configuration object
 * @param  {string}  experimentKey        Key of experiment being validated
 * @param  {string}  evaluationAttribute  String representing experiment key or rule
 * @param  {string}  userId               ID of user
 * @param  {Object}  attributes           Optional parameter for user's attributes
 * @param  {string}  loggingKey           String representing experiment key or rollout rule. To be used in log messages only.
 * @return {boolean} True if user meets audience conditions
 */
DecisionService.prototype.__checkIfUserIsInAudience = function(configObj, experimentKey, evaluationAttribute, userId, attributes, loggingKey) {
    var experimentAudienceConditions = projectConfig.getExperimentAudienceConditions(configObj, experimentKey);
    var audiencesById = projectConfig.getAudiencesById(configObj);
    this.logger.log(
        LOG_LEVEL.DEBUG,
        sprintf(
            LOG_MESSAGES.EVALUATING_AUDIENCES_COMBINED,
            MODULE_NAME,
            evaluationAttribute,
            loggingKey || experimentKey,
            JSON.stringify(experimentAudienceConditions)
        )
    );
    var result = this.audienceEvaluator.evaluate(experimentAudienceConditions, audiencesById, attributes);
    this.logger.log(
        LOG_LEVEL.INFO,
        sprintf(
            LOG_MESSAGES.AUDIENCE_EVALUATION_RESULT_COMBINED,
            MODULE_NAME,
            evaluationAttribute,
            loggingKey || experimentKey,
            result.toString().toUpperCase()
        )
    );

    return result;
};

/**
 * Given an experiment key and user ID, returns params used in bucketer call
 * @param  configObj     The parsed project configuration object
 * @param  experimentKey Experiment key used for bucketer
 * @param  bucketingId   ID to bucket user into
 * @param  userId        ID of user to be bucketed
 * @return {Object}
 */
DecisionService.prototype.__buildBucketerParams = function(configObj, experimentKey, bucketingId, userId) {
    var bucketerParams = {};
    bucketerParams.experimentKey = experimentKey;
    bucketerParams.experimentId = projectConfig.getExperimentId(configObj, experimentKey);
    bucketerParams.userId = userId;
    bucketerParams.trafficAllocationConfig = projectConfig.getTrafficAllocation(configObj, experimentKey);
    bucketerParams.experimentKeyMap = configObj.experimentKeyMap;
    bucketerParams.groupIdMap = configObj.groupIdMap;
    bucketerParams.variationIdMap = configObj.variationIdMap;
    bucketerParams.logger = this.logger;
    bucketerParams.bucketingId = bucketingId;
    return bucketerParams;
};

/**
 * Pull the stored variation out of the experimentBucketMap for an experiment/userId
 * @param  {Object} configObj           The parsed project configuration object
 * @param  {Object} experiment
 * @param  {String} userId
 * @param  {Object} experimentBucketMap mapping experiment => { variation_id: <variationId> }
 * @return {Object} the stored variation or null if the user profile does not have one for the given experiment
 */
DecisionService.prototype.__getStoredVariation = function(configObj, experiment, userId, experimentBucketMap) {
    if (experimentBucketMap.hasOwnProperty(experiment.id)) {
        var decision = experimentBucketMap[experiment.id];
        var variationId = decision.variation_id;
        if (configObj.variationIdMap.hasOwnProperty(variationId)) {
            return configObj.variationIdMap[decision.variation_id];
        } else {
            this.logger.log(
                LOG_LEVEL.INFO,
                sprintf(LOG_MESSAGES.SAVED_VARIATION_NOT_FOUND, MODULE_NAME, userId, variationId, experiment.key)
            );
        }
    }

    return null;
};

/**
 * Get the user profile with the given user ID
 * @param  {string} userId
 * @return {Object|undefined} the stored user profile or undefined if one isn't found
 */
DecisionService.prototype.__getUserProfile = function(userId) {
    var userProfile = {
        user_id: userId,
        experiment_bucket_map: {},
    };

    if (!this.userProfileService) {
        return userProfile;
    }

    try {
        return this.userProfileService.lookup(userId);
    } catch (ex) {
        this.logger.log(
            LOG_LEVEL.ERROR,
            sprintf(ERROR_MESSAGES.USER_PROFILE_LOOKUP_ERROR, MODULE_NAME, userId, ex.message)
        );
    }
};

/**
 * Saves the bucketing decision to the user profile
 * @param {Object} userProfile
 * @param {Object} experiment
 * @param {Object} variation
 * @param {Object} experimentBucketMap
 */
DecisionService.prototype.__saveUserProfile = function(experiment, variation, userId, experimentBucketMap) {
    if (!this.userProfileService) {
        return;
    }

    try {
        experimentBucketMap[experiment.id] = {
            variation_id: variation.id
        };

        this.userProfileService.save({
            user_id: userId,
            experiment_bucket_map: experimentBucketMap,
        });

        this.logger.log(
            LOG_LEVEL.INFO,
            sprintf(LOG_MESSAGES.SAVED_VARIATION, MODULE_NAME, variation.key, experiment.key, userId)
        );
    } catch (ex) {
        this.logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.USER_PROFILE_SAVE_ERROR, MODULE_NAME, userId, ex.message));
    }
};

/**
 * Given a feature, user ID, and attributes, returns an object representing a
 * decision. If the user was bucketed into a variation for the given feature
 * and attributes, the returned decision object will have variation and
 * experiment properties (both objects), as well as a decisionSource property.
 * decisionSource indicates whether the decision was due to a rollout or an
 * experiment.
 * @param   {Object} configObj  The parsed project configuration object
 * @param   {Object} feature    A feature flag object from project configuration
 * @param   {String} userId     A string identifying the user, for bucketing
 * @param   {Object} attributes Optional user attributes
 * @return  {Object} An object with experiment, variation, and decisionSource
 * properties. If the user was not bucketed into a variation, the variation
 * property is null.
 */
DecisionService.prototype.getVariationForFeature = function(configObj, feature, userId, attributes) {
    var experimentDecision = this._getVariationForFeatureExperiment(configObj, feature, userId, attributes);
    if (experimentDecision.variation !== null) {
        return experimentDecision;
    }

    var rolloutDecision = this._getVariationForRollout(configObj, feature, userId, attributes);
    if (rolloutDecision.variation !== null) {
        this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_IN_ROLLOUT, MODULE_NAME, userId, feature.key));
        return rolloutDecision;
    }

    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_NOT_IN_ROLLOUT, MODULE_NAME, userId, feature.key));
    return rolloutDecision;
};

DecisionService.prototype._getVariationForFeatureExperiment = function(configObj, feature, userId, attributes) {
    var experiment = null;
    var variationKey = null;

    if (feature.hasOwnProperty('groupId')) {
        var group = configObj.groupIdMap[feature.groupId];
        if (group) {
            experiment = this._getExperimentInGroup(configObj, group, userId);
            if (experiment && feature.experimentIds.indexOf(experiment.id) !== -1) {
                variationKey = this.getVariation(configObj, experiment.key, userId, attributes);
            }
        }
    } else if (feature.experimentIds.length > 0) {
        // If the feature does not have a group ID, then it can only be associated
        // with one experiment, so we look at the first experiment ID only
        experiment = projectConfig.getExperimentFromId(configObj, feature.experimentIds[0], this.logger);
        if (experiment) {
            variationKey = this.getVariation(configObj, experiment.key, userId, attributes);
        }
    } else {
        this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.FEATURE_HAS_NO_EXPERIMENTS, MODULE_NAME, feature.key));
    }

    var variation = null;
    if (variationKey !== null && experiment !== null) {
        variation = experiment.variationKeyMap[variationKey];
    }
    return {
        experiment: experiment,
        variation: variation,
        decisionSource: DECISION_SOURCES.FEATURE_TEST,
    };
};

DecisionService.prototype._getExperimentInGroup = function(configObj, group, userId) {
    var experimentId = bucketer.bucketUserIntoExperiment(group, userId, userId, this.logger);
    if (experimentId) {
        this.logger.log(
            LOG_LEVEL.INFO,
            sprintf(LOG_MESSAGES.USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP, MODULE_NAME, userId, experimentId, group.id)
        );
        var experiment = projectConfig.getExperimentFromId(configObj, experimentId, this.logger);
        if (experiment) {
            return experiment;
        }
    }

    this.logger.log(
        LOG_LEVEL.INFO,
        sprintf(LOG_MESSAGES.USER_NOT_BUCKETED_INTO_ANY_EXPERIMENT_IN_GROUP, MODULE_NAME, userId, group.id)
    );
    return null;
};

DecisionService.prototype._getVariationForRollout = function(configObj, feature, userId, attributes) {
    if (!feature.rolloutId) {
        this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.NO_ROLLOUT_EXISTS, MODULE_NAME, feature.key));
        return {
            experiment: null,
            variation: null,
            decisionSource: DECISION_SOURCES.ROLLOUT,
        };
    }

    var rollout = configObj.rolloutIdMap[feature.rolloutId];
    if (!rollout) {
        this.logger.log(
            LOG_LEVEL.ERROR,
            sprintf(ERROR_MESSAGES.INVALID_ROLLOUT_ID, MODULE_NAME, feature.rolloutId, feature.key)
        );
        return {
            experiment: null,
            variation: null,
            decisionSource: DECISION_SOURCES.ROLLOUT,
        };
    }

    if (rollout.experiments.length === 0) {
        this.logger.log(LOG_LEVEL.ERROR, sprintf(LOG_MESSAGES.ROLLOUT_HAS_NO_EXPERIMENTS, MODULE_NAME, feature.rolloutId));
        return {
            experiment: null,
            variation: null,
            decisionSource: DECISION_SOURCES.ROLLOUT,
        };
    }

    var bucketingId = this._getBucketingId(userId, attributes);

    // The end index is length - 1 because the last experiment is assumed to be
    // "everyone else", which will be evaluated separately outside this loop
    var endIndex = rollout.experiments.length - 1;
    var index;
    var rolloutRule;
    var bucketerParams;
    var variationId;
    var variation;
    var loggingKey;
    for (index = 0; index < endIndex; index++) {
        rolloutRule = configObj.experimentKeyMap[rollout.experiments[index].key];
        loggingKey = index + 1;

        if (!this.__checkIfUserIsInAudience(configObj, rolloutRule.key, AUDIENCE_EVALUATION_TYPES.RULE, userId, attributes, loggingKey)) {
            this.logger.log(
                LOG_LEVEL.DEBUG,
                sprintf(LOG_MESSAGES.USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE, MODULE_NAME, userId, loggingKey)
            );
            continue;
        }

        this.logger.log(
            LOG_LEVEL.DEBUG,
            sprintf(LOG_MESSAGES.USER_MEETS_CONDITIONS_FOR_TARGETING_RULE, MODULE_NAME, userId, loggingKey)
        );
        bucketerParams = this.__buildBucketerParams(configObj, rolloutRule.key, bucketingId, userId);
        variationId = bucketer.bucket(bucketerParams);
        variation = configObj.variationIdMap[variationId];
        if (variation) {
            this.logger.log(
                LOG_LEVEL.DEBUG,
                sprintf(LOG_MESSAGES.USER_BUCKETED_INTO_TARGETING_RULE, MODULE_NAME, userId, loggingKey)
            );
            return {
                experiment: rolloutRule,
                variation: variation,
                decisionSource: DECISION_SOURCES.ROLLOUT,
            };
        } else {
            this.logger.log(
                LOG_LEVEL.DEBUG,
                sprintf(LOG_MESSAGES.USER_NOT_BUCKETED_INTO_TARGETING_RULE, MODULE_NAME, userId, loggingKey)
            );
            break;
        }
    }

    var everyoneElseRule = configObj.experimentKeyMap[rollout.experiments[endIndex].key];
    if (this.__checkIfUserIsInAudience(configObj, everyoneElseRule.key, AUDIENCE_EVALUATION_TYPES.RULE, userId, attributes, 'Everyone Else')) {
        this.logger.log(
            LOG_LEVEL.DEBUG,
            sprintf(LOG_MESSAGES.USER_MEETS_CONDITIONS_FOR_TARGETING_RULE, MODULE_NAME, userId, 'Everyone Else')
        );
        bucketerParams = this.__buildBucketerParams(configObj, everyoneElseRule.key, bucketingId, userId);
        variationId = bucketer.bucket(bucketerParams);
        variation = configObj.variationIdMap[variationId];
        if (variation) {
            this.logger.log(
                LOG_LEVEL.DEBUG,
                sprintf(LOG_MESSAGES.USER_BUCKETED_INTO_EVERYONE_TARGETING_RULE, MODULE_NAME, userId)
            );
            return {
                experiment: everyoneElseRule,
                variation: variation,
                decisionSource: DECISION_SOURCES.ROLLOUT,
            };
        } else {
            this.logger.log(
                LOG_LEVEL.DEBUG,
                sprintf(LOG_MESSAGES.USER_NOT_BUCKETED_INTO_EVERYONE_TARGETING_RULE, MODULE_NAME, userId)
            );
        }
    }

    return {
        experiment: null,
        variation: null,
        decisionSource: DECISION_SOURCES.ROLLOUT,
    };
};

/**
 * Get bucketing Id from user attributes.
 * @param {String} userId
 * @param {Object} attributes
 * @returns {String} Bucketing Id if it is a string type in attributes, user Id otherwise.
 */
DecisionService.prototype._getBucketingId = function(userId, attributes) {
    var bucketingId = userId;

    // If the bucketing ID key is defined in attributes, than use that in place of the userID for the murmur hash key
    if (
        attributes != null &&
        typeof attributes === 'object' &&
        attributes.hasOwnProperty(enums.CONTROL_ATTRIBUTES.BUCKETING_ID)
    ) {
        if (typeof attributes[enums.CONTROL_ATTRIBUTES.BUCKETING_ID] === 'string') {
            bucketingId = attributes[enums.CONTROL_ATTRIBUTES.BUCKETING_ID];
            this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.VALID_BUCKETING_ID, MODULE_NAME, bucketingId));
        } else {
            this.logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.BUCKETING_ID_NOT_STRING, MODULE_NAME));
        }
    }

    return bucketingId;
};

/**
 * Removes forced variation for given userId and experimentKey
 * @param  {string} userId         String representing the user id
 * @param  {number} experimentId   Number representing the experiment id
 * @param  {string} experimentKey  Key representing the experiment id
 * @throws If the user id is not valid or not in the forced variation map
 */
DecisionService.prototype.removeForcedVariation = function(userId, experimentId, experimentKey) {
    if (!userId) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_USER_ID, MODULE_NAME));
    }

    if (this.forcedVariationMap.hasOwnProperty(userId)) {
        delete this.forcedVariationMap[userId][experimentId];
        this.logger.log(
            LOG_LEVEL.DEBUG,
            sprintf(LOG_MESSAGES.VARIATION_REMOVED_FOR_USER, MODULE_NAME, experimentKey, userId)
        );
    } else {
        throw new Error(sprintf(ERROR_MESSAGES.USER_NOT_IN_FORCED_VARIATION, MODULE_NAME, userId));
    }
};

/**
 * Sets forced variation for given userId and experimentKey
 * @param  {string} userId        String representing the user id
 * @param  {number} experimentId  Number representing the experiment id
 * @param  {number} variationId   Number representing the variation id
 * @throws If the user id is not valid
 */
DecisionService.prototype.__setInForcedVariationMap = function(userId, experimentId, variationId) {
    if (this.forcedVariationMap.hasOwnProperty(userId)) {
        this.forcedVariationMap[userId][experimentId] = variationId;
    } else {
        this.forcedVariationMap[userId] = {};
        this.forcedVariationMap[userId][experimentId] = variationId;
    }

    this.logger.log(
        LOG_LEVEL.DEBUG,
        sprintf(LOG_MESSAGES.USER_MAPPED_TO_FORCED_VARIATION, MODULE_NAME, variationId, experimentId, userId)
    );
};

/**
 * Gets the forced variation key for the given user and experiment.
 * @param  {Object} configObj        Object representing project configuration
 * @param  {string} experimentKey    Key for experiment.
 * @param  {string} userId           The user Id.
 * @return {string|null} Variation   The variation which the given user and experiment should be forced into.
 */
DecisionService.prototype.getForcedVariation = function(configObj, experimentKey, userId) {
    var experimentToVariationMap = this.forcedVariationMap[userId];
    if (!experimentToVariationMap) {
        this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_HAS_NO_FORCED_VARIATION, MODULE_NAME, userId));
        return null;
    }

    var experimentId;
    try {
        var experiment = projectConfig.getExperimentFromKey(configObj, experimentKey);
        if (experiment.hasOwnProperty('id')) {
            experimentId = experiment['id'];
        } else {
            // catching improperly formatted experiments
            this.logger.log(
                LOG_LEVEL.ERROR,
                sprintf(ERROR_MESSAGES.IMPROPERLY_FORMATTED_EXPERIMENT, MODULE_NAME, experimentKey)
            );
            return null;
        }
    } catch (ex) {
        // catching experiment not in datafile
        this.logger.log(LOG_LEVEL.ERROR, ex.message);
        return null;
    }

    var variationId = experimentToVariationMap[experimentId];
    if (!variationId) {
        this.logger.log(
            LOG_LEVEL.DEBUG,
            sprintf(LOG_MESSAGES.USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT, MODULE_NAME, experimentKey, userId)
        );
        return null;
    }

    var variationKey = projectConfig.getVariationKeyFromId(configObj, variationId);
    if (variationKey) {
        this.logger.log(
            LOG_LEVEL.DEBUG,
            sprintf(LOG_MESSAGES.USER_HAS_FORCED_VARIATION, MODULE_NAME, variationKey, experimentKey, userId)
        );
    } else {
        this.logger.log(
            LOG_LEVEL.DEBUG,
            sprintf(LOG_MESSAGES.USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT, MODULE_NAME, experimentKey, userId)
        );
    }

    return variationKey;
};

/**
 * Sets the forced variation for a user in a given experiment
 * @param  {Object}      configObj      Object representing project configuration
 * @param  {string}      experimentKey  Key for experiment.
 * @param  {string}      userId         The user Id.
 * @param  {string|null} variationKey   Key for variation. If null, then clear the existing experiment-to-variation mapping
 * @return {boolean}     A boolean value that indicates if the set completed successfully.
 */
DecisionService.prototype.setForcedVariation = function(configObj, experimentKey, userId, variationKey) {
    if (variationKey != null && !stringValidator.validate(variationKey)) {
        this.logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.INVALID_VARIATION_KEY, MODULE_NAME));
        return false;
    }

    var experimentId;
    try {
        var experiment = projectConfig.getExperimentFromKey(configObj, experimentKey);
        if (experiment.hasOwnProperty('id')) {
            experimentId = experiment['id'];
        } else {
            // catching improperly formatted experiments
            this.logger.log(
                LOG_LEVEL.ERROR,
                sprintf(ERROR_MESSAGES.IMPROPERLY_FORMATTED_EXPERIMENT, MODULE_NAME, experimentKey)
            );
            return false;
        }
    } catch (ex) {
        // catching experiment not in datafile
        this.logger.log(LOG_LEVEL.ERROR, ex.message);
        return false;
    }

    if (variationKey == null) {
        try {
            this.removeForcedVariation(userId, experimentId, experimentKey, this.logger);
            return true;
        } catch (ex) {
            this.logger.log(LOG_LEVEL.ERROR, ex.message);
            return false;
        }
    }

    var variationId = projectConfig.getVariationIdFromExperimentAndVariationKey(configObj, experimentKey, variationKey);

    if (!variationId) {
        this.logger.log(
            LOG_LEVEL.ERROR,
            sprintf(ERROR_MESSAGES.NO_VARIATION_FOR_EXPERIMENT_KEY, MODULE_NAME, variationKey, experimentKey)
        );
        return false;
    }

    try {
        this.__setInForcedVariationMap(userId, experimentId, variationId);
        return true;
    } catch (ex) {
        this.logger.log(LOG_LEVEL.ERROR, ex.message);
        return false;
    }
};

/**
 * Creates an instance of the DecisionService.
 * @param  {Object} options               Configuration options
 * @param  {Object} options.userProfileService
 * @param  {Object} options.logger
 * @return {Object} An instance of the DecisionService
 */
export var createDecisionService = function(options) {
    return new DecisionService(options);
};

export default {
    createDecisionService: createDecisionService,
};