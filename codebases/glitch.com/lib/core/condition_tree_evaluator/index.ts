/****************************************************************************
 * Copyright 2018, 2020, Optimizely, Inc. and contributors                  *
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

const AND_CONDITION = 'and';
const OR_CONDITION = 'or';
const NOT_CONDITION = 'not';

const DEFAULT_OPERATOR_TYPES = [AND_CONDITION, OR_CONDITION, NOT_CONDITION];
export type ConditionTree<Leaf> = Leaf | unknown[];

type LeafEvaluator<Leaf> = (leaf: Leaf) => boolean | null;

/**
 * Top level method to evaluate conditions
 * @param  {ConditionTree<Leaf>}    conditions      Nested array of and/or conditions, or a single leaf
 *                                                  condition value of any type
 *                                                  Example: ['and', '0', ['or', '1', '2']]
 * @param  {LeafEvaluator<Leaf>}    leafEvaluator   Function which will be called to evaluate leaf condition
 *                                                  values
 * @return {?boolean}                               Result of evaluating the conditions using the operator
 *                                                  rules and the leaf evaluator. A return value of null
 *                                                  indicates that the conditions are invalid or unable to be
 *                                                  evaluated.
 */
export function evaluate<Leaf>(conditions: ConditionTree<Leaf>, leafEvaluator: LeafEvaluator<Leaf>): boolean | null {
  if (Array.isArray(conditions)) {
    let firstOperator = conditions[0];
    let restOfConditions = conditions.slice(1);

    if (typeof firstOperator === 'string' && DEFAULT_OPERATOR_TYPES.indexOf(firstOperator) === -1) {
      // Operator to apply is not explicit - assume 'or'
      firstOperator = OR_CONDITION;
      restOfConditions = conditions;
    }

    switch (firstOperator) {
      case AND_CONDITION:
        return andEvaluator(restOfConditions, leafEvaluator);
      case NOT_CONDITION:
        return notEvaluator(restOfConditions, leafEvaluator);
      default:
        // firstOperator is OR_CONDITION
        return orEvaluator(restOfConditions, leafEvaluator);
    }
  }

  const leafCondition = conditions;
  return leafEvaluator(leafCondition);
}

/**
 * Evaluates an array of conditions as if the evaluator had been applied
 * to each entry and the results AND-ed together.
 * @param  {unknown[]}             conditions      Array of conditions ex: [operand_1, operand_2]
 * @param  {LeafEvaluator<Leaf>}   leafEvaluator   Function which will be called to evaluate leaf condition values
 * @return {?boolean}                              Result of evaluating the conditions. A return value of null
 *                                                 indicates that the conditions are invalid or unable to be
 *                                                 evaluated.
 */
function andEvaluator<Leaf>(conditions: ConditionTree<Leaf>, leafEvaluator: LeafEvaluator<Leaf>): boolean | null {
  let sawNullResult = false;
  if (Array.isArray(conditions)) {
    for (let i = 0; i < conditions.length; i++) {
      const conditionResult = evaluate(conditions[i] as ConditionTree<Leaf>, leafEvaluator);
      if (conditionResult === false) {
        return false;
      }
      if (conditionResult === null) {
        sawNullResult = true;
      }
    }
    return sawNullResult ? null : true;
  }
  return null;
}

/**
 * Evaluates an array of conditions as if the evaluator had been applied
 * to a single entry and NOT was applied to the result.
 * @param  {unknown[]}             conditions      Array of conditions ex: [operand_1]
 * @param  {LeafEvaluator<Leaf>}   leafEvaluator   Function which will be called to evaluate leaf condition values
 * @return {?boolean}                              Result of evaluating the conditions. A return value of null
 *                                                 indicates that the conditions are invalid or unable to be
 *                                                 evaluated.
 */
function notEvaluator<Leaf>(conditions: ConditionTree<Leaf>, leafEvaluator: LeafEvaluator<Leaf>): boolean | null {
  if (Array.isArray(conditions) && conditions.length > 0) {
    const result = evaluate(conditions[0] as ConditionTree<Leaf>, leafEvaluator);
    return result === null ? null : !result;
  }
  return null;
}

/**
 * Evaluates an array of conditions as if the evaluator had been applied
 * to each entry and the results OR-ed together.
 * @param  {unknown[]}             conditions      Array of conditions ex: [operand_1, operand_2]
 * @param  {LeafEvaluator<Leaf>}   leafEvaluator   Function which will be called to evaluate leaf condition values
 * @return {?boolean}                              Result of evaluating the conditions. A return value of null
 *                                                 indicates that the conditions are invalid or unable to be
 *                                                 evaluated.
 */
function orEvaluator<Leaf>(conditions: ConditionTree<Leaf>, leafEvaluator: LeafEvaluator<Leaf>): boolean | null {
  let sawNullResult = false;
  if (Array.isArray(conditions)) {
    for (let i = 0; i < conditions.length; i++) {
      const conditionResult = evaluate(conditions[i] as ConditionTree<Leaf>, leafEvaluator);
      if (conditionResult === true) {
        return true;
      }
      if (conditionResult === null) {
        sawNullResult = true;
      }
    }
    return sawNullResult ? null : false;
  }
  return null;
}
