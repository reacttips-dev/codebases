/****************************************************************************
 * Copyright 2018-2019, 2020 Optimizely, Inc. and contributors              *
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
import { getLogger } from '@optimizely/js-sdk-logging';
import { UserAttributes } from '../../shared_types';

import fns from '../../utils/fns';
import { LOG_MESSAGES } from '../../utils/enums';
import { compareVersion } from '../../utils/semantic_version';

const MODULE_NAME = 'CUSTOM_ATTRIBUTE_CONDITION_EVALUATOR';

const logger = getLogger();

const EXACT_MATCH_TYPE = 'exact';
const EXISTS_MATCH_TYPE = 'exists';
const GREATER_OR_EQUAL_THAN_MATCH_TYPE = 'ge';
const GREATER_THAN_MATCH_TYPE = 'gt';
const LESS_OR_EQUAL_THAN_MATCH_TYPE = 'le';
const LESS_THAN_MATCH_TYPE = 'lt';
const SEMVER_EXACT_MATCH_TYPE = 'semver_eq';
const SEMVER_GREATER_OR_EQUAL_THAN_MATCH_TYPE = 'semver_ge';
const SEMVER_GREATER_THAN_MATCH_TYPE = 'semver_gt';
const SEMVER_LESS_OR_EQUAL_THAN_MATCH_TYPE = 'semver_le';
const SEMVER_LESS_THAN_MATCH_TYPE = 'semver_lt';
const SUBSTRING_MATCH_TYPE = 'substring';

const MATCH_TYPES = [
  EXACT_MATCH_TYPE,
  EXISTS_MATCH_TYPE,
  GREATER_THAN_MATCH_TYPE,
  GREATER_OR_EQUAL_THAN_MATCH_TYPE,
  LESS_THAN_MATCH_TYPE,
  LESS_OR_EQUAL_THAN_MATCH_TYPE,
  SUBSTRING_MATCH_TYPE,
  SEMVER_EXACT_MATCH_TYPE,
  SEMVER_LESS_THAN_MATCH_TYPE,
  SEMVER_LESS_OR_EQUAL_THAN_MATCH_TYPE,
  SEMVER_GREATER_THAN_MATCH_TYPE,
  SEMVER_GREATER_OR_EQUAL_THAN_MATCH_TYPE
];

type Condition = {
  name: string;
  type: string;
  match?: string;
  value: string | number | boolean | null;
}

type ConditionEvaluator = (condition: Condition, userAttributes: UserAttributes) => boolean | null;

const EVALUATORS_BY_MATCH_TYPE: { [conditionType: string]: ConditionEvaluator | undefined } = {};
EVALUATORS_BY_MATCH_TYPE[EXACT_MATCH_TYPE] = exactEvaluator;
EVALUATORS_BY_MATCH_TYPE[EXISTS_MATCH_TYPE] = existsEvaluator;
EVALUATORS_BY_MATCH_TYPE[GREATER_THAN_MATCH_TYPE] = greaterThanEvaluator;
EVALUATORS_BY_MATCH_TYPE[GREATER_OR_EQUAL_THAN_MATCH_TYPE] = greaterThanOrEqualEvaluator;
EVALUATORS_BY_MATCH_TYPE[LESS_THAN_MATCH_TYPE] = lessThanEvaluator;
EVALUATORS_BY_MATCH_TYPE[LESS_OR_EQUAL_THAN_MATCH_TYPE] = lessThanOrEqualEvaluator;
EVALUATORS_BY_MATCH_TYPE[SUBSTRING_MATCH_TYPE] = substringEvaluator;
EVALUATORS_BY_MATCH_TYPE[SEMVER_EXACT_MATCH_TYPE] = semverEqualEvaluator;
EVALUATORS_BY_MATCH_TYPE[SEMVER_GREATER_THAN_MATCH_TYPE] = semverGreaterThanEvaluator;
EVALUATORS_BY_MATCH_TYPE[SEMVER_GREATER_OR_EQUAL_THAN_MATCH_TYPE] = semverGreaterThanOrEqualEvaluator;
EVALUATORS_BY_MATCH_TYPE[SEMVER_LESS_THAN_MATCH_TYPE] = semverLessThanEvaluator;
EVALUATORS_BY_MATCH_TYPE[SEMVER_LESS_OR_EQUAL_THAN_MATCH_TYPE] = semverLessThanOrEqualEvaluator;

/**
 * Given a custom attribute audience condition and user attributes, evaluate the
 * condition against the attributes.
 * @param  {Condition}        condition
 * @param  {UserAttributes}   userAttributes
 * @param  {LoggerFacade}     logger
 * @return {?boolean}         true/false if the given user attributes match/don't match the given condition,
 *                            null if the given user attributes and condition can't be evaluated
 * TODO: Change to accept and object with named properties
 */
export function evaluate(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const conditionMatch = condition.match;
  if (typeof conditionMatch !== 'undefined' && MATCH_TYPES.indexOf(conditionMatch) === -1) {
    logger.warn(LOG_MESSAGES.UNKNOWN_MATCH_TYPE, MODULE_NAME, JSON.stringify(condition));
    return null;
  }

  const attributeKey = condition.name;
  if (!userAttributes.hasOwnProperty(attributeKey) && conditionMatch != EXISTS_MATCH_TYPE) {
    logger.debug(
      LOG_MESSAGES.MISSING_ATTRIBUTE_VALUE, MODULE_NAME, JSON.stringify(condition), attributeKey
    );
    return null;
  }

  let evaluatorForMatch;
  if (!conditionMatch) {
    evaluatorForMatch = exactEvaluator;
  } else {
    evaluatorForMatch = EVALUATORS_BY_MATCH_TYPE[conditionMatch] || exactEvaluator;
  }

  return evaluatorForMatch(condition, userAttributes);
}

/**
 * Returns true if the value is valid for exact conditions. Valid values include
 * strings, booleans, and numbers that aren't NaN, -Infinity, or Infinity.
 * @param value
 * @returns {boolean}
 */
function isValueTypeValidForExactConditions(value: unknown): boolean {
  return typeof value === 'string' || typeof value === 'boolean' || fns.isNumber(value);
}

/**
 * Evaluate the given exact match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @return  {?boolean}        true if the user attribute value is equal (===) to the condition value,
 *                            false if the user attribute value is not equal (!==) to the condition value,
 *                            null if the condition value or user attribute value has an invalid type, or
 *                            if there is a mismatch between the user attribute type and the condition value
 *                            type
 */
function exactEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const conditionValue = condition.value;
  const conditionValueType = typeof conditionValue;
  const conditionName = condition.name;
  const userValue = userAttributes[conditionName];
  const userValueType = typeof userValue;

  if (
    !isValueTypeValidForExactConditions(conditionValue) ||
    (fns.isNumber(conditionValue) && !fns.isSafeInteger(conditionValue))
  ) {
    logger.warn(
      LOG_MESSAGES.UNEXPECTED_CONDITION_VALUE, MODULE_NAME, JSON.stringify(condition)
    );
    return null;
  }

  if (userValue === null) {
    logger.debug(
      LOG_MESSAGES.UNEXPECTED_TYPE_NULL, MODULE_NAME, JSON.stringify(condition), conditionName
    );
    return null;
  }

  if (!isValueTypeValidForExactConditions(userValue) || conditionValueType !== userValueType) {
    logger.warn(
      LOG_MESSAGES.UNEXPECTED_TYPE, MODULE_NAME, JSON.stringify(condition), userValueType, conditionName
    );
    return null;
  }

  if (fns.isNumber(userValue) && !fns.isSafeInteger(userValue)) {
    logger.warn(
      LOG_MESSAGES.OUT_OF_BOUNDS, MODULE_NAME, JSON.stringify(condition), conditionName
    );
    return null;
  }

  return conditionValue === userValue;
}

/**
 * Evaluate the given exists match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @returns {boolean}         true if both:
 *                              1) the user attributes have a value for the given condition, and
 *                              2) the user attribute value is neither null nor undefined
 *                            Returns false otherwise
 */
function existsEvaluator(condition: Condition, userAttributes: UserAttributes): boolean {
  const userValue = userAttributes[condition.name];
  return typeof userValue !== 'undefined' && userValue !== null;
}

/**
 * Validate user and condition values
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @returns {?boolean}        true if values are valid,
 *                            false if values are not valid
 */
function validateValuesForNumericCondition(condition: Condition, userAttributes: UserAttributes): boolean {
  const conditionName = condition.name;
  const userValue = userAttributes[conditionName];
  const userValueType = typeof userValue;
  const conditionValue = condition.value;

  if (conditionValue === null || !fns.isSafeInteger(conditionValue)) {
    logger.warn(
      LOG_MESSAGES.UNEXPECTED_CONDITION_VALUE, MODULE_NAME, JSON.stringify(condition)
    );
    return false;
  }

  if (userValue === null) {
    logger.debug(
      LOG_MESSAGES.UNEXPECTED_TYPE_NULL, MODULE_NAME, JSON.stringify(condition), conditionName
    );
    return false;
  }

  if (!fns.isNumber(userValue)) {
    logger.warn(
      LOG_MESSAGES.UNEXPECTED_TYPE, MODULE_NAME, JSON.stringify(condition), userValueType, conditionName
    );
    return false;
  }

  if (!fns.isSafeInteger(userValue)) {
    logger.warn(
      LOG_MESSAGES.OUT_OF_BOUNDS, MODULE_NAME, JSON.stringify(condition), conditionName
    );
    return false;
  }
  return true;
}

/**
 * Evaluate the given greater than match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?boolean}        true if the user attribute value is greater than the condition value,
 *                            false if the user attribute value is less than or equal to the condition value,
 *                            null if the condition value isn't a number or the user attribute value
 *                            isn't a number
 */
function greaterThanEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const userValue = userAttributes[condition.name];
  const conditionValue = condition.value;

  if (!validateValuesForNumericCondition(condition, userAttributes) || conditionValue === null) {
    return null;
  }
  return userValue > conditionValue;
}

/**
 * Evaluate the given greater or equal than match condition for the given user attributes
 * @param   {Condition}        condition
 * @param   {UserAttributes}   userAttributes
 * @param   {LoggerFacade}     logger
 * @returns {?Boolean}         true if the user attribute value is greater or equal than the condition value,
 *                             false if the user attribute value is less than to the condition value,
 *                             null if the condition value isn't a number or the user attribute value isn't a
 *                             number
 */
function greaterThanOrEqualEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const userValue = userAttributes[condition.name];
  const conditionValue = condition.value;

  if (!validateValuesForNumericCondition(condition, userAttributes) || conditionValue === null) {
    return null;
  }

  return userValue >= conditionValue;
}

/**
 * Evaluate the given less than match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?boolean}        true if the user attribute value is less than the condition value,
 *                            false if the user attribute value is greater than or equal to the condition value,
 *                            null if the condition value isn't a number or the user attribute value isn't a
 *                            number
 */
function lessThanEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const userValue = userAttributes[condition.name];
  const conditionValue = condition.value;

  if (!validateValuesForNumericCondition(condition, userAttributes) || conditionValue === null) {
    return null;
  }

  return userValue < conditionValue;
}

/**
 * Evaluate the given less or equal than match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?Boolean}        true if the user attribute value is less or equal than the condition value,
 *                            false if the user attribute value is greater than to the condition value,
 *                            null if the condition value isn't a number or the user attribute value isn't a
 *                            number
 */
function lessThanOrEqualEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const userValue = userAttributes[condition.name];
  const conditionValue = condition.value;

  if (!validateValuesForNumericCondition(condition, userAttributes) || conditionValue === null) {
    return null;
  }

  return userValue <= conditionValue;
}

/**
 * Evaluate the given substring match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?Boolean}        true if the condition value is a substring of the user attribute value,
 *                            false if the condition value is not a substring of the user attribute value,
 *                            null if the condition value isn't a string or the user attribute value
 *                            isn't a string
 */
function substringEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const conditionName = condition.name;
  const userValue = userAttributes[condition.name];
  const userValueType = typeof userValue;
  const conditionValue = condition.value;

  if (typeof conditionValue !== 'string') {
    logger.warn(
      LOG_MESSAGES.UNEXPECTED_CONDITION_VALUE, MODULE_NAME, JSON.stringify(condition)
    );
    return null;
  }

  if (userValue === null) {
    logger.debug(
      LOG_MESSAGES.UNEXPECTED_TYPE_NULL, MODULE_NAME, JSON.stringify(condition), conditionName
    );
    return null;
  }

  if (typeof userValue !== 'string') {
    logger.warn(
      LOG_MESSAGES.UNEXPECTED_TYPE, MODULE_NAME, JSON.stringify(condition), userValueType, conditionName
    );
    return null;
  }

  return userValue.indexOf(conditionValue) !== -1;
}

/**
 * Evaluate the given semantic version match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?number}         returns compareVersion result
 *                            null if the user attribute version has an invalid type
 */
function evaluateSemanticVersion(condition: Condition, userAttributes: UserAttributes): number | null {
  const conditionName = condition.name;
  const userValue = userAttributes[conditionName];
  const userValueType = typeof userValue;
  const conditionValue = condition.value;

  if (typeof conditionValue !== 'string') {
    logger.warn(
      LOG_MESSAGES.UNEXPECTED_CONDITION_VALUE, MODULE_NAME, JSON.stringify(condition)
    );
    return null;
  }

  if (userValue === null) {
    logger.debug(
      LOG_MESSAGES.UNEXPECTED_TYPE_NULL, MODULE_NAME, JSON.stringify(condition), conditionName
    );
    return null;
  }

  if (typeof userValue !== 'string') {
    logger.warn(
      LOG_MESSAGES.UNEXPECTED_TYPE, MODULE_NAME, JSON.stringify(condition), userValueType, conditionName
    );
    return null;
  }
  
  return compareVersion(conditionValue, userValue);
}

/**
 * Evaluate the given version match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?Boolean}        true if the user attribute version is equal (===) to the condition version,
 *                            false if the user attribute version is not equal (!==) to the condition version,
 *                            null if the user attribute version has an invalid type
 */
function semverEqualEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const result = evaluateSemanticVersion(condition, userAttributes);
  if (result === null ) {
    return null;
  }
  return result === 0;
}

/**
 * Evaluate the given version match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?Boolean}        true if the user attribute version is greater (>) than the condition version,
 *                            false if the user attribute version is not greater than the condition version,
 *                            null if the user attribute version has an invalid type
 */
function semverGreaterThanEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const result = evaluateSemanticVersion(condition, userAttributes);
  if (result === null ) {
    return null;
  }
  return result > 0;
}

/**
 * Evaluate the given version match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?Boolean}        true if the user attribute version is less (<) than the condition version,
 *                            false if the user attribute version is not less than the condition version,
 *                            null if the user attribute version has an invalid type
 */
function semverLessThanEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const result = evaluateSemanticVersion(condition, userAttributes);
  if (result === null ) {
    return null;
  }
  return result < 0;
}

/**
 * Evaluate the given version match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?Boolean}        true if the user attribute version is greater than or equal (>=) to the condition version,
 *                            false if the user attribute version is not greater than or equal to the condition version,
 *                            null if the user attribute version has an invalid type
 */
function semverGreaterThanOrEqualEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const result = evaluateSemanticVersion(condition, userAttributes);
  if (result === null ) {
    return null;
  }
  return result >= 0;
}

/**
 * Evaluate the given version match condition for the given user attributes
 * @param   {Condition}       condition
 * @param   {UserAttributes}  userAttributes
 * @param   {LoggerFacade}    logger
 * @returns {?Boolean}        true if the user attribute version is less than or equal (<=) to the condition version,
 *                            false if the user attribute version is not less than or equal to the condition version,
 *                            null if the user attribute version has an invalid type
 */
function semverLessThanOrEqualEvaluator(condition: Condition, userAttributes: UserAttributes): boolean | null {
  const result = evaluateSemanticVersion(condition, userAttributes);
  if (result === null ) {
    return null;
  }
  return result <= 0;
  
}
