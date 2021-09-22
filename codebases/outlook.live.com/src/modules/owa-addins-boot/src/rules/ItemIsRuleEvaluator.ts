import type ActivationRuleEvaluator from './ActivationRuleEvaluator';
import type Item from 'owa-service/lib/contract/Item';
import type ItemIsRule from 'owa-service/lib/contract/ItemIsRule';
import ItemIsRuleItemType from 'owa-service/lib/contract/ItemIsRuleItemType';
import type { EvaluationContext } from './EvaluationContext';

/**
 * Evaluates if the item class is a message
 * @param itemClass the item class
 * @returns true if it is a message type
 */
export function IsMessage(itemClass: string): boolean {
    return (
        itemClass.indexOf('ipm.note') === 0 ||
        itemClass.indexOf('ipm.schedule') === 0 ||
        itemClass.indexOf('ipm.sharing') === 0
    );
}

/**
 * Evaluates if the item class is an appointment
 * @param itemClass the item class
 * @returns true if it is an appointment type
 */
export function IsAppointment(itemClass: string): boolean {
    return (
        itemClass.indexOf('ipm.appointment') === 0 ||
        itemClass == 'ipm.ole.class.{00061055-0000-0000-c000-000000000046}'
    );
}

export default class ItemIsRuleEvaluator implements ActivationRuleEvaluator {
    /**
     * Creates an instance of the ItemIsRuleEvaluator class
     * @param itemIsRule the item-is rule
     */
    constructor(private itemIsRule: ItemIsRule) {}

    /**
     * Evaluates this rule on the given item and puts the results into the evaluation context
     * @param item The item to Evaluate
     * @param evaluationContext The context in which to add evaluation results
     * @returns true if the add-in can be activated based on this evaluation
     */
    Evaluate(item: Item, evaluationContext: EvaluationContext): boolean {
        return this.EvaluateItemType(item) && this.EvaluateItemClass(item);
    }

    /**
     * Evaluates the item type based on the item class
     * @param item the item context
     * @returns true if the ItemType matches the ItemType of the message
     */
    private EvaluateItemType(item: Item) {
        const itemClass = item.ItemClass;
        if (
            this.itemIsRule.ItemType == ItemIsRuleItemType.Message &&
            itemClass &&
            IsMessage(itemClass.toLowerCase())
        ) {
            return true;
        }
        if (
            this.itemIsRule.ItemType == ItemIsRuleItemType.Appointment &&
            itemClass &&
            IsAppointment(itemClass.toLowerCase())
        ) {
            return true;
        }
        return !this.itemIsRule.ItemType;
    }

    /**
     * Evaluates the item class for the item.
     * @param item the item context
     * @returns true if the ItemClass matches the ItemClass of the message
     * @remarks an example item class is the meeting request ItemClass: IPM.Schedule.Meeting.Request
     * SubClasses are denoted by periods
     */
    private EvaluateItemClass(item: Item) {
        const itemClass = item.ItemClass;
        if (!this.itemIsRule.ItemClass) {
            return true;
        } else if (this.itemIsRule.IncludeSubClasses) {
            return (
                itemClass &&
                itemClass.toLowerCase().indexOf(this.itemIsRule.ItemClass.toLowerCase()) === 0
            );
        } else {
            return itemClass && this.itemIsRule.ItemClass.toLowerCase() === itemClass.toLowerCase();
        }
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
