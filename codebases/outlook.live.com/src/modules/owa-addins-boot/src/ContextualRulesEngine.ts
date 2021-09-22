import type ActivationRule from 'owa-service/lib/contract/ActivationRule';
import type ActivationRuleEvaluator from './rules/ActivationRuleEvaluator';
import createActivationRuleEvaluator from './rules/ActivationRuleEvaluatorFactory';
import type Item from 'owa-service/lib/contract/Item';
import type { ContextualAddinCommand, EvaluationResult } from 'owa-addins-store';
import { createEvaluationContext, EvaluationContext } from './rules/EvaluationContext';
import { ObservableMap } from 'mobx';

/**
 * Run rule evaulation on the item for each add-in, and return the terms and activated add-ins.
 * @param enabledAddins The add-ins that contain rules for evaluation
 * @param item The item to run the rules on
 * @param evaluationResults a map from extension id to EvaluationResult
 * @return A map from a term (found in the item) to an array of add-ins for that term.
 */
export function evaluateRulesForEnabledAddinCommands(
    enabledAddins: ContextualAddinCommand[],
    item: Item,
    evaluationResults: { [index: string]: EvaluationResult }
): ObservableMap<string, ContextualAddinCommand[]> {
    const termMap: any = {};

    if (enabledAddins.length > 0) {
        let evaluationContext: EvaluationContext;

        enabledAddins.forEach((contextualAddin: ContextualAddinCommand) => {
            // Carry forward some data from the previous evaluation
            evaluationContext = createEvaluationContext(evaluationContext);

            const addinTerms = evaluateAddin(contextualAddin, item, evaluationContext);
            for (const addinTerm of addinTerms) {
                if (!termMap[addinTerm]) {
                    termMap[addinTerm] = [contextualAddin];
                } else {
                    termMap[addinTerm].push(contextualAddin);
                }
            }

            if (addinTerms.length > 0) {
                evaluationResults[contextualAddin.extension.Id] =
                    evaluationContext.evaluationResult;
            }
        });
    }

    return new ObservableMap<string, ContextualAddinCommand[]>(termMap);
}

/**
 * Checks whether an item has all the properties needed to evaluate rules for the enabled add-ins
 * @param enabledAddins An array of contextual addin commands
 * @param item The item to check
 * @return whether an item has all the needed properties
 */
export function itemIsReadyForEvaluation(
    enabledAddins: ContextualAddinCommand[],
    item: Item
): boolean {
    for (const contextualAddin of enabledAddins) {
        const itemIsReady: boolean = itemIsReadyForAddinEvaluation(contextualAddin, item);
        if (!itemIsReady) {
            return false;
        }
    }

    return true;
}

/**
 * Evaluates an add-in's contextual rule on the given item
 * @param addin The addin containing the rule to evaluate
 * @param item The item to run the rule on
 * @param evaluationResult an EvaluationResult
 * @return An array of terms found the item that the add-in may activate on
 */
function evaluateAddin(
    addin: ContextualAddinCommand,
    item: Item,
    evaluationContext: EvaluationContext
): string[] {
    try {
        return evaluateRule(addin.detectedEntity.Rule, item, evaluationContext);
    } catch (error) {
        return [];
    }
}

/**
 * Evaluate a single rule on the given item
 * @param rule The rule to evaluate
 * @param item The item to run the rule on
 * @param evaluationResult an EvaluationResult
 * @return An array of terms found the item that an add-in may activate on
 */
function evaluateRule(
    rule: ActivationRule,
    item: Item,
    evaluationContext: EvaluationContext
): string[] {
    const evaluator: ActivationRuleEvaluator = createActivationRuleEvaluator(rule);

    if (evaluator.Evaluate(item, evaluationContext)) {
        return evaluationContext.terms;
    }

    return [];
}

/**
 * Checks if the item is ready for contextual rule evaluation and handles errors
 * @param addin The addin containing the rule to evaluate
 * @param item The item to examine
 * @return Whether the item is ready for evaluation
 */
function itemIsReadyForAddinEvaluation(addin: ContextualAddinCommand, item: Item): boolean {
    try {
        return itemIsReadyForRuleEvaluation(addin.detectedEntity.Rule, item);
    } catch (error) {
        // Return true because we don't want additional properties from the item
        return true;
    }
}

/**
 * Checks if the item is ready for contextual rule evaluation
 * @param rule The rule to consider
 * @param item The item to examine
 * @return Whether the item is ready for evaluation
 */
function itemIsReadyForRuleEvaluation(rule: ActivationRule, item: Item): boolean {
    const evaluator: ActivationRuleEvaluator = createActivationRuleEvaluator(rule);
    return evaluator.ItemIsReadyForEvaluation(item);
}
