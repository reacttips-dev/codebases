import type ActivationRuleEvaluator from './ActivationRuleEvaluator';
import type Item from 'owa-service/lib/contract/Item';
import type { EvaluationContext } from './EvaluationContext';

export default class ItemHasAttachmentRuleEvaluator implements ActivationRuleEvaluator {
    /**
     * Evaluates this rule on the given item and puts the results into the evaluation context
     * @param item The item to Evaluate
     * @param evaluationContext The context in which to add evaluation results
     * @returns true if the add-in can be activated based on this evaluation
     */
    Evaluate(item: Item, evaluationContext: EvaluationContext): boolean {
        return !!item.HasAttachments;
    }

    /**
     * Returns true because the item should always have the properties needed to evaluate this rule
     * @param item The item to check
     * @returns Indicates whether the item has all of the properties needed to evaluate this rule
     */
    ItemIsReadyForEvaluation(item: Item): boolean {
        return true;
    }
}
