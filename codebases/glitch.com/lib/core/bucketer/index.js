/**
 * Copyright 2016, 2019-2020, Optimizely
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

/**
 * Bucketer API for determining the variation id from the specified parameters
 */
import {
    sprintf
} from '@optimizely/js-sdk-utils';
import murmurhash from 'murmurhash';

import {
    ERROR_MESSAGES,
    LOG_LEVEL,
    LOG_MESSAGES,
} from '../../utils/enums';

var HASH_SEED = 1;
var MAX_HASH_VALUE = Math.pow(2, 32);
var MAX_TRAFFIC_VALUE = 10000;
var MODULE_NAME = 'BUCKETER';
var RANDOM_POLICY = 'random';

/**
 * Determines ID of variation to be shown for the given input params
 * @param  {Object}         bucketerParams
 * @param  {string}         bucketerParams.experimentId
 * @param  {string}         bucketerParams.experimentKey
 * @param  {string}         bucketerParams.userId
 * @param  {Object[]}       bucketerParams.trafficAllocationConfig
 * @param  {Array}          bucketerParams.experimentKeyMap
 * @param  {Object}         bucketerParams.groupIdMap
 * @param  {Object}         bucketerParams.variationIdMap
 * @param  {string}         bucketerParams.varationIdMap[].key
 * @param  {Object}         bucketerParams.logger
 * @param  {string}         bucketerParams.bucketingId
 * @return Variation ID that user has been bucketed into, null if user is not bucketed into any experiment
 */
export var bucket = function(bucketerParams) {
    // Check if user is in a random group; if so, check if user is bucketed into a specific experiment
    var experiment = bucketerParams.experimentKeyMap[bucketerParams.experimentKey];
    var groupId = experiment['groupId'];
    if (groupId) {
        var group = bucketerParams.groupIdMap[groupId];
        if (!group) {
            throw new Error(sprintf(ERROR_MESSAGES.INVALID_GROUP_ID, MODULE_NAME, groupId));
        }
        if (group.policy === RANDOM_POLICY) {
            var bucketedExperimentId = this.bucketUserIntoExperiment(
                group,
                bucketerParams.bucketingId,
                bucketerParams.userId,
                bucketerParams.logger
            );

            // Return if user is not bucketed into any experiment
            if (bucketedExperimentId === null) {
                var notbucketedInAnyExperimentLogMessage = sprintf(
                    LOG_MESSAGES.USER_NOT_IN_ANY_EXPERIMENT,
                    MODULE_NAME,
                    bucketerParams.userId,
                    groupId
                );
                bucketerParams.logger.log(LOG_LEVEL.INFO, notbucketedInAnyExperimentLogMessage);
                return null;
            }

            // Return if user is bucketed into a different experiment than the one specified
            if (bucketedExperimentId !== bucketerParams.experimentId) {
                var notBucketedIntoExperimentOfGroupLogMessage = sprintf(
                    LOG_MESSAGES.USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP,
                    MODULE_NAME,
                    bucketerParams.userId,
                    bucketerParams.experimentKey,
                    groupId
                );
                bucketerParams.logger.log(LOG_LEVEL.INFO, notBucketedIntoExperimentOfGroupLogMessage);
                return null;
            }

            // Continue bucketing if user is bucketed into specified experiment
            var bucketedIntoExperimentOfGroupLogMessage = sprintf(
                LOG_MESSAGES.USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP,
                MODULE_NAME,
                bucketerParams.userId,
                bucketerParams.experimentKey,
                groupId
            );
            bucketerParams.logger.log(LOG_LEVEL.INFO, bucketedIntoExperimentOfGroupLogMessage);
        }
    }
    var bucketingId = sprintf('%s%s', bucketerParams.bucketingId, bucketerParams.experimentId);
    var bucketValue = this._generateBucketValue(bucketingId);

    var bucketedUserLogMessage = sprintf(
        LOG_MESSAGES.USER_ASSIGNED_TO_EXPERIMENT_BUCKET,
        MODULE_NAME,
        bucketValue,
        bucketerParams.userId
    );
    bucketerParams.logger.log(LOG_LEVEL.DEBUG, bucketedUserLogMessage);

    var entityId = this._findBucket(bucketValue, bucketerParams.trafficAllocationConfig);

    if (!bucketerParams.variationIdMap.hasOwnProperty(entityId)) {
        if (entityId) {
            var invalidVariationIdLogMessage = sprintf(LOG_MESSAGES.INVALID_VARIATION_ID, MODULE_NAME);
            bucketerParams.logger.log(LOG_LEVEL.WARNING, invalidVariationIdLogMessage);
        }
        return null;
    }

    return entityId;
};

/**
 * Returns bucketed experiment ID to compare against experiment user is being called into
 * @param {Object} group        Group that experiment is in
 * @param {string} bucketingId  Bucketing ID
 * @param {string} userId       ID of user to be bucketed into experiment
 * @param {Object} logger       Logger implementation
 * @return {string|null} ID of experiment if user is bucketed into experiment within the group, null otherwise
 */
export var bucketUserIntoExperiment = function(group, bucketingId, userId, logger) {
    var bucketingKey = sprintf('%s%s', bucketingId, group.id);
    var bucketValue = this._generateBucketValue(bucketingKey);
    logger.log(
        LOG_LEVEL.DEBUG,
        sprintf(LOG_MESSAGES.USER_ASSIGNED_TO_EXPERIMENT_BUCKET, MODULE_NAME, bucketValue, userId)
    );
    var trafficAllocationConfig = group.trafficAllocation;
    var bucketedExperimentId = this._findBucket(bucketValue, trafficAllocationConfig);
    return bucketedExperimentId;
};

/**
 * Returns entity ID associated with bucket value
 * @param  {string}   bucketValue
 * @param  {Object[]} trafficAllocationConfig
 * @param  {number}   trafficAllocationConfig[].endOfRange
 * @param  {number}   trafficAllocationConfig[].entityId
 * @return {string|null}   Entity ID for bucketing if bucket value is within traffic allocation boundaries, null otherwise
 */
export var _findBucket = function(bucketValue, trafficAllocationConfig) {
    for (var i = 0; i < trafficAllocationConfig.length; i++) {
        if (bucketValue < trafficAllocationConfig[i].endOfRange) {
            return trafficAllocationConfig[i].entityId;
        }
    }
    return null;
};

/**
 * Helper function to generate bucket value in half-closed interval [0, MAX_TRAFFIC_VALUE)
 * @param  {string} bucketingKey String value for bucketing
 * @return {string} the generated bucket value
 * @throws If bucketing value is not a valid string
 */
export var _generateBucketValue = function(bucketingKey) {
    try {
        // NOTE: the mmh library already does cast the hash value as an unsigned 32bit int
        // https://github.com/perezd/node-murmurhash/blob/master/murmurhash.js#L115
        var hashValue = murmurhash.v3(bucketingKey, HASH_SEED);
        var ratio = hashValue / MAX_HASH_VALUE;
        return parseInt(ratio * MAX_TRAFFIC_VALUE, 10);
    } catch (ex) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_BUCKETING_ID, MODULE_NAME, bucketingKey, ex.message));
    }
};

export default {
    bucket: bucket,
    bucketUserIntoExperiment: bucketUserIntoExperiment,
    _findBucket: _findBucket,
    _generateBucketValue: _generateBucketValue,
};