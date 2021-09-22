import type ActivationRuleEvaluator from './ActivationRuleEvaluator';
import type CollectionRule from 'owa-service/lib/contract/CollectionRule';
import createActivationRuleEvaluator from './ActivationRuleEvaluatorFactory';
import type Item from 'owa-service/lib/contract/Item';
import type { EvaluationContext } from './EvaluationContext';

const AND_MODE: string = 'AND';
const OR_MODE: string = 'OR';

export default class CollectionRuleEvaluator implements ActivationRuleEvaluator {
    /**
     * Creates an instance of the CollectionRuleEvaluator class
     * @param collectionRule the collection rule
     */
    constructor(private collectionRule: CollectionRule) {}

    /**
     * Evaluates this rule on the given item and puts the results into the evaluation context
     * @param item The item to Evaluate
     * @param evaluationContext The context in which to add evaluation results
     * @returns true if the add-in can be activated based on this evaluation
     */
    Evaluate(item: Item, evaluationContext: EvaluationContext): boolean {
        let evaluationResult: boolean = this.GetInitialEvaluationResult();

        for (const rule of this.collectionRule.Rules) {
            const evaluator = createActivationRuleEvaluator(rule);

            const childEvaluationResult: boolean = evaluator.Evaluate(item, evaluationContext);

            evaluationResult = this.UpdateEvaluationResult(evaluationResult, childEvaluationResult);
        }

        return evaluationResult;
    }

    /**
     * Returns false if any of the child rules are not ready
     * @param item The item to check
     * @returns Indicates whether the item has all of the properties needed to evaluate this rule
     */
    ItemIsReadyForEvaluation(item: Item): boolean {
        for (const rule of this.collectionRule.Rules) {
            const evaluator = createActivationRuleEvaluator(rule);
            const itemIsReady: boolean = evaluator.ItemIsReadyForEvaluation(item);

            if (!itemIsReady) {
                return false;
            }
        }

        return true;
    }

    /** Gets the initial value for the evaluation result */
    private GetInitialEvaluationResult(): boolean {
        if (this.collectionRule.Mode.toUpperCase() == AND_MODE) {
            return true;
        } else if (this.collectionRule.Mode.toUpperCase() == OR_MODE) {
            return false;
        } else {
            throw new Error(`Invalid mode for a Collection rule: ${this.collectionRule.Mode}`);
        }
    }

    /** Updates the evaluation result given a child's evaluation result */
    private UpdateEvaluationResult(
        evaluationResult: boolean,
        childEvaluationResult: boolean
    ): boolean {
        if (this.collectionRule.Mode.toUpperCase() == AND_MODE && !childEvaluationResult) {
            return false;
        } else if (this.collectionRule.Mode.toUpperCase() == OR_MODE && childEvaluationResult) {
            return true;
        }

        return evaluationResult;
    }
}
