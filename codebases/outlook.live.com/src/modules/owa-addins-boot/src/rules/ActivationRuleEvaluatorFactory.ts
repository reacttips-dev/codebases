import type ActivationRule from 'owa-service/lib/contract/ActivationRule';
import type ActivationRuleEvaluator from './ActivationRuleEvaluator';
import type CollectionRule from 'owa-service/lib/contract/CollectionRule';
import CollectionRuleEvaluator from './CollectionRuleEvaluator';
import ItemHasAttachmentRuleEvaluator from './ItemHasAttachmentRuleEvaluator';
import type ItemHasKnownEntityRule from 'owa-service/lib/contract/ItemHasKnownEntityRule';
import ItemHasKnownEntityRuleEvaluator from './ItemHasKnownEntityRuleEvaluator';
import type ItemHasRegularExpressionMatchRule from 'owa-service/lib/contract/ItemHasRegularExpressionMatchRule';
import ItemHasRegularExpressionMatchRuleEvaluator from './ItemHasRegularExpressionMatchRuleEvaluator';
import type ItemIsRule from 'owa-service/lib/contract/ItemIsRule';
import ItemIsRuleEvaluator from './ItemIsRuleEvaluator';

/**
 * Creates an instance of an evaluator to evaluate the given rule
 *
 * @param rule An ActivationRule
 * @returns The ActivationRuleEvaluator for the given rule
 */
export default function createActivationRuleEvaluator(
    rule: ActivationRule
): ActivationRuleEvaluator {
    if (rule.Type == 'ItemIs') {
        return new ItemIsRuleEvaluator(rule as ItemIsRule);
    } else if (rule.Type == 'ItemHasAttachment') {
        return new ItemHasAttachmentRuleEvaluator();
    } else if (rule.Type == 'ItemHasKnownEntity') {
        return new ItemHasKnownEntityRuleEvaluator(rule as ItemHasKnownEntityRule);
    } else if (rule.Type == 'ItemHasRegularExpressionMatch') {
        return new ItemHasRegularExpressionMatchRuleEvaluator(
            rule as ItemHasRegularExpressionMatchRule
        );
    } else if (rule.Type == 'Collection') {
        return new CollectionRuleEvaluator(rule as CollectionRule);
    } else {
        throw new Error(`Rule type not supported: ${rule.Type}`);
    }
}
