/****************************************************************************
 * Copyright 2016-2020, Optimizely, Inc. and contributors                   *
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

import { NOTIFICATION_TYPES as notificationTypesEnum } from '@optimizely/js-sdk-utils';

/**
 * Contains global enums used throughout the library
 */
export const LOG_LEVEL = {
  NOTSET: 0,
  DEBUG: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
};

export const ERROR_MESSAGES = {
  CONDITION_EVALUATOR_ERROR: '%s: Error evaluating audience condition of type %s: %s',
  DATAFILE_AND_SDK_KEY_MISSING: '%s: You must provide at least one of sdkKey or datafile. Cannot start Optimizely',
  EXPERIMENT_KEY_NOT_IN_DATAFILE: '%s: Experiment key %s is not in datafile.',
  FEATURE_NOT_IN_DATAFILE: '%s: Feature key %s is not in datafile.',
  IMPROPERLY_FORMATTED_EXPERIMENT: '%s: Experiment key %s is improperly formatted.',
  INVALID_ATTRIBUTES: '%s: Provided attributes are in an invalid format.',
  INVALID_BUCKETING_ID: '%s: Unable to generate hash for bucketing ID %s: %s',
  INVALID_DATAFILE: '%s: Datafile is invalid - property %s: %s',
  INVALID_DATAFILE_MALFORMED: '%s: Datafile is invalid because it is malformed.',
  INVALID_CONFIG: '%s: Provided Optimizely config is in an invalid format.',
  INVALID_JSON: '%s: JSON object is not valid.',
  INVALID_ERROR_HANDLER: '%s: Provided "errorHandler" is in an invalid format.',
  INVALID_EVENT_DISPATCHER: '%s: Provided "eventDispatcher" is in an invalid format.',
  INVALID_EVENT_TAGS: '%s: Provided event tags are in an invalid format.',
  INVALID_EXPERIMENT_KEY: '%s: Experiment key %s is not in datafile. It is either invalid, paused, or archived.',
  INVALID_EXPERIMENT_ID: '%s: Experiment ID %s is not in datafile.',
  INVALID_GROUP_ID: '%s: Group ID %s is not in datafile.',
  INVALID_LOGGER: '%s: Provided "logger" is in an invalid format.',
  INVALID_ROLLOUT_ID: '%s: Invalid rollout ID %s attached to feature %s',
  INVALID_USER_ID: '%s: Provided user ID is in an invalid format.',
  INVALID_USER_PROFILE_SERVICE: '%s: Provided user profile service instance is in an invalid format: %s.',
  NO_DATAFILE_SPECIFIED: '%s: No datafile specified. Cannot start optimizely.',
  NO_JSON_PROVIDED: '%s: No JSON object to validate against schema.',
  NO_VARIATION_FOR_EXPERIMENT_KEY: '%s: No variation key %s defined in datafile for experiment %s.',
  UNDEFINED_ATTRIBUTE: '%s: Provided attribute: %s has an undefined value.',
  UNRECOGNIZED_ATTRIBUTE: '%s: Unrecognized attribute %s provided. Pruning before sending event to Optimizely.',
  UNABLE_TO_CAST_VALUE: '%s: Unable to cast value %s to type %s, returning null.',
  USER_NOT_IN_FORCED_VARIATION: '%s: User %s is not in the forced variation map. Cannot remove their forced variation.',
  USER_PROFILE_LOOKUP_ERROR: '%s: Error while looking up user profile for user ID "%s": %s.',
  USER_PROFILE_SAVE_ERROR: '%s: Error while saving user profile for user ID "%s": %s.',
  VARIABLE_KEY_NOT_IN_DATAFILE: '%s: Variable with key "%s" associated with feature with key "%s" is not in datafile.',
  VARIATION_ID_NOT_IN_DATAFILE: '%s: No variation ID %s defined in datafile for experiment %s.',
  VARIATION_ID_NOT_IN_DATAFILE_NO_EXPERIMENT: '%s: Variation ID %s is not in the datafile.',
  INVALID_INPUT_FORMAT: '%s: Provided %s is in an invalid format.',
  INVALID_DATAFILE_VERSION: '%s: This version of the JavaScript SDK does not support the given datafile version: %s',
  INVALID_VARIATION_KEY: '%s: Provided variation key is in an invalid format.',
};

export const LOG_MESSAGES = {
  ACTIVATE_USER: '%s: Activating user %s in experiment %s.',
  DISPATCH_CONVERSION_EVENT: '%s: Dispatching conversion event to URL %s with params %s.',
  DISPATCH_IMPRESSION_EVENT: '%s: Dispatching impression event to URL %s with params %s.',
  DEPRECATED_EVENT_VALUE: '%s: Event value is deprecated in %s call.',
  EVENT_KEY_NOT_FOUND: '%s: Event key %s is not in datafile.',
  EXPERIMENT_NOT_RUNNING: '%s: Experiment %s is not running.',
  FEATURE_ENABLED_FOR_USER: '%s: Feature %s is enabled for user %s.',
  FEATURE_NOT_ENABLED_FOR_USER: '%s: Feature %s is not enabled for user %s.',
  FEATURE_HAS_NO_EXPERIMENTS: '%s: Feature %s is not attached to any experiments.',
  FAILED_TO_PARSE_VALUE: '%s: Failed to parse event value "%s" from event tags.',
  FAILED_TO_PARSE_REVENUE: '%s: Failed to parse revenue value "%s" from event tags.',
  FORCED_BUCKETING_FAILED: '%s: Variation key %s is not in datafile. Not activating user %s.',
  INVALID_OBJECT: '%s: Optimizely object is not valid. Failing %s.',
  INVALID_CLIENT_ENGINE: '%s: Invalid client engine passed: %s. Defaulting to node-sdk.',
  INVALID_VARIATION_ID: '%s: Bucketed into an invalid variation ID. Returning null.',
  NOTIFICATION_LISTENER_EXCEPTION: '%s: Notification listener for (%s) threw exception: %s',
  NO_ROLLOUT_EXISTS: '%s: There is no rollout of feature %s.',
  NOT_ACTIVATING_USER: '%s: Not activating user %s for experiment %s.',
  NOT_TRACKING_USER: '%s: Not tracking user %s.',
  PARSED_REVENUE_VALUE: '%s: Parsed revenue value "%s" from event tags.',
  PARSED_NUMERIC_VALUE: '%s: Parsed event value "%s" from event tags.',
  RETURNING_STORED_VARIATION:
    '%s: Returning previously activated variation "%s" of experiment "%s" for user "%s" from user profile.',
  ROLLOUT_HAS_NO_EXPERIMENTS: '%s: Rollout of feature %s has no experiments',
  SAVED_VARIATION: '%s: Saved variation "%s" of experiment "%s" for user "%s".',
  SAVED_VARIATION_NOT_FOUND:
    '%s: User %s was previously bucketed into variation with ID %s for experiment %s, but no matching variation was found.',
  SHOULD_NOT_DISPATCH_ACTIVATE: '%s: Experiment %s is not in "Running" state. Not activating user.',
  SKIPPING_JSON_VALIDATION: '%s: Skipping JSON schema validation.',
  TRACK_EVENT: '%s: Tracking event %s for user %s.',
  USER_ASSIGNED_TO_EXPERIMENT_BUCKET: '%s: Assigned bucket %s to user with bucketing ID %s.',
  USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP: '%s: User %s is in experiment %s of group %s.',
  USER_BUCKETED_INTO_TARGETING_RULE: '%s: User %s bucketed into targeting rule %s.',
  USER_IN_FEATURE_EXPERIMENT: '%s: User %s is in variation %s of experiment %s on the feature %s.',
  USER_IN_ROLLOUT: '%s: User %s is in rollout of feature %s.',
  USER_BUCKETED_INTO_EVERYONE_TARGETING_RULE: '%s: User %s bucketed into everyone targeting rule.',
  USER_NOT_BUCKETED_INTO_EVERYONE_TARGETING_RULE:
    '%s: User %s not bucketed into everyone targeting rule due to traffic allocation.',
  USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP: '%s: User %s is not in experiment %s of group %s.',
  USER_NOT_BUCKETED_INTO_ANY_EXPERIMENT_IN_GROUP: '%s: User %s is not in any experiment of group %s.',
  USER_NOT_BUCKETED_INTO_TARGETING_RULE:
    '%s User %s not bucketed into targeting rule %s due to traffic allocation. Trying everyone rule.',
  USER_NOT_IN_FEATURE_EXPERIMENT: '%s: User %s is not in any experiment on the feature %s.',
  USER_NOT_IN_ROLLOUT: '%s: User %s is not in rollout of feature %s.',
  USER_FORCED_IN_VARIATION: '%s: User %s is forced in variation %s.',
  USER_MAPPED_TO_FORCED_VARIATION: '%s: Set variation %s for experiment %s and user %s in the forced variation map.',
  USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE: '%s: User %s does not meet conditions for targeting rule %s.',
  USER_MEETS_CONDITIONS_FOR_TARGETING_RULE: '%s: User %s meets conditions for targeting rule %s.',
  USER_HAS_VARIATION: '%s: User %s is in variation %s of experiment %s.',
  USER_HAS_FORCED_VARIATION: '%s: Variation %s is mapped to experiment %s and user %s in the forced variation map.',
  USER_HAS_NO_VARIATION: '%s: User %s is in no variation of experiment %s.',
  USER_HAS_NO_FORCED_VARIATION: '%s: User %s is not in the forced variation map.',
  USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT: '%s: No experiment %s mapped to user %s in the forced variation map.',
  USER_NOT_IN_ANY_EXPERIMENT: '%s: User %s is not in any experiment of group %s.',
  USER_NOT_IN_EXPERIMENT: '%s: User %s does not meet conditions to be in experiment %s.',
  USER_RECEIVED_DEFAULT_VARIABLE_VALUE:
    '%s: User "%s" is not in any variation or rollout rule. Returning default value for variable "%s" of feature flag "%s".',
  FEATURE_NOT_ENABLED_RETURN_DEFAULT_VARIABLE_VALUE:
    '%s: Feature "%s" is not enabled for user %s. Returning the default variable value "%s".',
  VARIABLE_NOT_USED_RETURN_DEFAULT_VARIABLE_VALUE:
    '%s: Variable "%s" is not used in variation "%s". Returning default value.',
  USER_RECEIVED_VARIABLE_VALUE: '%s: Got variable value "%s" for variable "%s" of feature flag "%s"',
  VALID_DATAFILE: '%s: Datafile is valid.',
  VALID_USER_PROFILE_SERVICE: '%s: Valid user profile service provided.',
  VARIATION_REMOVED_FOR_USER: '%s: Variation mapped to experiment %s has been removed for user %s.',
  VARIABLE_REQUESTED_WITH_WRONG_TYPE:
    '%s: Requested variable type "%s", but variable is of type "%s". Use correct API to retrieve value. Returning None.',
  VALID_BUCKETING_ID: '%s: BucketingId is valid: "%s"',
  BUCKETING_ID_NOT_STRING: '%s: BucketingID attribute is not a string. Defaulted to userId',
  EVALUATING_AUDIENCE: '%s: Starting to evaluate audience "%s" with conditions: %s.',
  EVALUATING_AUDIENCES_COMBINED: '%s: Evaluating audiences for %s "%s": %s.',
  AUDIENCE_EVALUATION_RESULT: '%s: Audience "%s" evaluated to %s.',
  AUDIENCE_EVALUATION_RESULT_COMBINED: '%s: Audiences for %s %s collectively evaluated to %s.',
  MISSING_ATTRIBUTE_VALUE:
    '%s: Audience condition %s evaluated to UNKNOWN because no value was passed for user attribute "%s".',
  UNEXPECTED_CONDITION_VALUE:
    '%s: Audience condition %s evaluated to UNKNOWN because the condition value is not supported.',
  UNEXPECTED_TYPE:
    '%s: Audience condition %s evaluated to UNKNOWN because a value of type "%s" was passed for user attribute "%s".',
  UNEXPECTED_TYPE_NULL:
    '%s: Audience condition %s evaluated to UNKNOWN because a null value was passed for user attribute "%s".',
  UNKNOWN_CONDITION_TYPE:
    '%s: Audience condition %s has an unknown condition type. You may need to upgrade to a newer release of the Optimizely SDK.',
  UNKNOWN_MATCH_TYPE:
    '%s: Audience condition %s uses an unknown match type. You may need to upgrade to a newer release of the Optimizely SDK.',
  UPDATED_OPTIMIZELY_CONFIG: '%s: Updated Optimizely config to revision %s (project id %s)',
  OUT_OF_BOUNDS:
    '%s: Audience condition %s evaluated to UNKNOWN because the number value for user attribute "%s" is not in the range [-2^53, +2^53].',
  UNABLE_TO_ATTACH_UNLOAD: '%s: unable to bind optimizely.close() to page unload event: "%s"',
};

export const RESERVED_EVENT_KEYWORDS = {
  REVENUE: 'revenue',
  VALUE: 'value',
};

export const CONTROL_ATTRIBUTES = {
  BOT_FILTERING: '$opt_bot_filtering',
  BUCKETING_ID: '$opt_bucketing_id',
  STICKY_BUCKETING_KEY: '$opt_experiment_bucket_map',
  USER_AGENT: '$opt_user_agent',
};

export const JAVASCRIPT_CLIENT_ENGINE = 'javascript-sdk';
export const NODE_CLIENT_ENGINE = 'node-sdk';
export const REACT_CLIENT_ENGINE = 'react-sdk';
export const NODE_CLIENT_VERSION = '4.4.2';

export const VALID_CLIENT_ENGINES = [
  NODE_CLIENT_ENGINE,
  REACT_CLIENT_ENGINE,
  JAVASCRIPT_CLIENT_ENGINE,
];

export const NOTIFICATION_TYPES = notificationTypesEnum;

export const DECISION_NOTIFICATION_TYPES = {
  AB_TEST: 'ab-test',
  FEATURE: 'feature',
  FEATURE_TEST: 'feature-test',
  FEATURE_VARIABLE: 'feature-variable',
  ALL_FEATURE_VARIABLES: 'all-feature-variables',
};

/*
 * Represents the source of a decision for feature management. When a feature
 * is accessed through isFeatureEnabled or getVariableValue APIs, the decision
 * source is used to decide whether to dispatch an impression event to
 * Optimizely.
 */
export const DECISION_SOURCES = {
  FEATURE_TEST: 'feature-test',
  ROLLOUT: 'rollout',
  EXPERIMENT: 'experiment',
};

export const AUDIENCE_EVALUATION_TYPES = {
  RULE: 'rule',
  EXPERIMENT: 'experiment',
};

/*
 * Possible types of variables attached to features
 */
export const FEATURE_VARIABLE_TYPES = {
  BOOLEAN: 'boolean',
  DOUBLE: 'double',
  INTEGER: 'integer',
  STRING: 'string',
  JSON: 'json',
};

/*
 * Supported datafile versions
 */
export const DATAFILE_VERSIONS = {
  V2: '2',
  V3: '3',
  V4: '4',
};

/*
* Pre-Release and Build symbols
*/
export const enum VERSION_TYPE {
  PRE_RELEASE_VERSION_DELIMITER = '-',
  BUILD_VERSION_DELIMITER = '+'
}
