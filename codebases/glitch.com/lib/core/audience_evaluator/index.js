/**
 * Copyright 2016, 2018-2020, Optimizely
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
    sprintf
} from '@optimizely/js-sdk-utils';
import {
    getLogger
} from '@optimizely/js-sdk-logging';

import fns from '../../utils/fns';
import {
    LOG_LEVEL,
    LOG_MESSAGES,
    ERROR_MESSAGES,
} from '../../utils/enums';
import * as conditionTreeEvaluator from '../condition_tree_evaluator';
import * as customAttributeConditionEvaluator from '../custom_attribute_condition_evaluator';

var logger = getLogger();
var MODULE_NAME = 'AUDIENCE_EVALUATOR';

/**
 * Construct an instance of AudienceEvaluator with given options
 * @param {Object=} UNSTABLE_conditionEvaluators A map of condition evaluators provided by the consumer. This enables matching
 *                                                   condition types which are not supported natively by the SDK. Note that built in
 *                                                   Optimizely evaluators cannot be overridden.
 * @constructor
 */
function AudienceEvaluator(UNSTABLE_conditionEvaluators) {
    this.typeToEvaluatorMap = fns.assign({}, UNSTABLE_conditionEvaluators, {
        custom_attribute: customAttributeConditionEvaluator,
    });
}

/**
 * Determine if the given user attributes satisfy the given audience conditions
 * @param  {Array|String|null|undefined}  audienceConditions    Audience conditions to match the user attributes against - can be an array
 *                                                              of audience IDs, a nested array of conditions, or a single leaf condition.
 *                                                              Examples: ["5", "6"], ["and", ["or", "1", "2"], "3"], "1"
 * @param  {Object}                       audiencesById         Object providing access to full audience objects for audience IDs
 *                                                              contained in audienceConditions. Keys should be audience IDs, values
 *                                                              should be full audience objects with conditions properties
 * @param  {Object}                       [userAttributes]      User attributes which will be used in determining if audience conditions
 *                                                              are met. If not provided, defaults to an empty object
 * @return {Boolean}                                            true if the user attributes match the given audience conditions, false
 *                                                              otherwise
 */
AudienceEvaluator.prototype.evaluate = function(audienceConditions, audiencesById, userAttributes) {
    // if there are no audiences, return true because that means ALL users are included in the experiment
    if (!audienceConditions || audienceConditions.length === 0) {
        return true;
    }

    if (!userAttributes) {
        userAttributes = {};
    }

    var evaluateAudience = function(audienceId) {
        var audience = audiencesById[audienceId];
        if (audience) {
            logger.log(
                LOG_LEVEL.DEBUG,
                sprintf(LOG_MESSAGES.EVALUATING_AUDIENCE, MODULE_NAME, audienceId, JSON.stringify(audience.conditions))
            );
            var result = conditionTreeEvaluator.evaluate(
                audience.conditions,
                this.evaluateConditionWithUserAttributes.bind(this, userAttributes)
            );
            var resultText = result === null ? 'UNKNOWN' : result.toString().toUpperCase();
            logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.AUDIENCE_EVALUATION_RESULT, MODULE_NAME, audienceId, resultText));
            return result;
        }

        return null;
    }.bind(this);

    return conditionTreeEvaluator.evaluate(audienceConditions, evaluateAudience) || false;
};

/**
 * Wrapper around evaluator.evaluate that is passed to the conditionTreeEvaluator.
 * Evaluates the condition provided given the user attributes if an evaluator has been defined for the condition type.
 * @param  {Object} userAttributes     A map of user attributes.
 * @param  {Object} condition          A single condition object to evaluate.
 * @return {Boolean|null}              true if the condition is satisfied, null if a matcher is not found.
 */
AudienceEvaluator.prototype.evaluateConditionWithUserAttributes = function(userAttributes, condition) {
    var evaluator = this.typeToEvaluatorMap[condition.type];
    if (!evaluator) {
        logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNKNOWN_CONDITION_TYPE, MODULE_NAME, JSON.stringify(condition)));
        return null;
    }
    try {
        return evaluator.evaluate(condition, userAttributes, logger);
    } catch (err) {
        logger.log(
            LOG_LEVEL.ERROR,
            sprintf(ERROR_MESSAGES.CONDITION_EVALUATOR_ERROR, MODULE_NAME, condition.type, err.message)
        );
    }
    return null;
};

export default AudienceEvaluator;