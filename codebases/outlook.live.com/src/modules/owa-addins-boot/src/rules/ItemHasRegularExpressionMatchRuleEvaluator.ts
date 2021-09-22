import * as ActivationRuleLimits from './ActivationRuleLimits';
import type ActivationRuleEvaluator from './ActivationRuleEvaluator';
import type BodyContentType from 'owa-service/lib/contract/BodyContentType';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import HighlightType from 'owa-service/lib/contract/HighlightType';
import type Item from 'owa-service/lib/contract/Item';
import type ItemHasRegularExpressionMatchRule from 'owa-service/lib/contract/ItemHasRegularExpressionMatchRule';
import type Message from 'owa-service/lib/contract/Message';
import RegExPropertyName from 'owa-service/lib/contract/RegExPropertyName';
import { assertNever } from 'owa-assert';
import { convertHtmlToPlainText, evaluateRegularExpression } from 'owa-addins-apis';
import type { EvaluationContext } from './EvaluationContext';
import { IsAppointment, IsMessage } from './ItemIsRuleEvaluator';

export default class ItemHasRegularExpressionMatchRuleEvaluator implements ActivationRuleEvaluator {
    limits: any;

    /**
     * Creates an instance of the ItemHasRegularExpressionMatchRuleEvaluator class
     * @param itemHasRegularExpressionMatchRule the item has known entity rule
     * @param state
     */
    constructor(
        private itemHasRegularExpressionMatchRule: ItemHasRegularExpressionMatchRule,
        limits?: any
    ) {
        this.limits = limits ? limits : ActivationRuleLimits;
    }

    /**
     * Evaluates this rule on the given item and puts the results into the evaluation context
     * @param item The item to Evaluate
     * @param evaluationContext The context in which to add evaluation results
     * @returns true if the add-in can be activated based on this evaluation
     */
    Evaluate(item: Item, evaluationContext: EvaluationContext): boolean {
        const body: string = this.GetPropertyForEvaluation(item, evaluationContext);
        const regExValue: string = this.itemHasRegularExpressionMatchRule.RegExValue;
        const ignoreCase: boolean = this.itemHasRegularExpressionMatchRule.IgnoreCase;
        let matches: RegExpMatchArray = null;

        if (body != null) {
            matches = evaluateRegularExpression(body, regExValue, ignoreCase);
        }

        if (
            this.itemHasRegularExpressionMatchRule.PropertyName ===
            RegExPropertyName.BodyAsPlaintext
        ) {
            const quotedText = item.QuotedTextList?.length > 0 ? item.QuotedTextList[0] : null;
            if (quotedText) {
                let quotedBodyMatches: RegExpMatchArray = evaluateRegularExpression(
                    quotedText,
                    regExValue,
                    ignoreCase
                );
                matches.push(...quotedBodyMatches);
            }
        }

        if (matches == null) {
            // Keep track of the regex rules that exist without a match.
            // This is done so that the JS API returns an empty array for regex rules
            // that are specified in the manifest.  (and null when there is no such regex rule
            // in the manifest)
            evaluationContext.evaluationResult.regExMatches[
                this.itemHasRegularExpressionMatchRule.RegExName
            ] = [];

            return false;
        }

        const terms: string[] = this.removeDuplicatesAndApplyMatchLimits(matches as string[]);

        evaluationContext.evaluationResult.regExMatches[
            this.itemHasRegularExpressionMatchRule.RegExName
        ] = terms;

        if (this.itemHasRegularExpressionMatchRule.Highlight === HighlightType.None) {
            // Don't return terms for highlight=None rules
            return true;
        }

        if (
            this.itemHasRegularExpressionMatchRule.PropertyName == RegExPropertyName.BodyAsPlaintext
        ) {
            // Only return terms based on the plain-text body
            for (const term of terms) {
                evaluationContext.terms.push(term);
            }
        }

        return true;
    }

    /**
     * Returns true because the item should always have the properties needed to evaluate this rule
     * @param item The item to check
     * @returns Indicates whether the item has all of the properties needed to evaluate this rule
     */
    ItemIsReadyForEvaluation(item: Item): boolean {
        return true;
    }

    /**
     * Applies length limits to the matches and removes duplicates
     * @param matches an array of matches
     * @returns an array of unique matches
     */
    private removeDuplicatesAndApplyMatchLimits(matches: string[]): string[] {
        const uniqueMatches = {};
        let matchCount = 0;

        for (const match of matches) {
            if (matchCount >= this.limits.MAX_REGEX_MATCHES) {
                break;
            }

            if (match.length <= this.limits.MAX_REGEX_MATCH_LENGTH) {
                uniqueMatches[match] = 1;
                matchCount++;
            }
        }

        return Object.keys(uniqueMatches);
    }

    /** Gets a property to evaluate based on the PropertyName in the rule */
    private GetPropertyForEvaluation(item: Item, evaluationContext: EvaluationContext): string {
        switch (this.itemHasRegularExpressionMatchRule.PropertyName) {
            case RegExPropertyName.Subject:
                return item.Subject;
            case RegExPropertyName.SenderSMTPAddress:
                return this.GetSenderSMTPAddress(item);
            case RegExPropertyName.BodyAsHTML:
                return this.GetBodyWithLimits(item);
            case RegExPropertyName.BodyAsPlaintext:
                if (evaluationContext.plainTextBody) {
                    return evaluationContext.plainTextBody;
                }

                const body: string = this.GetBodyWithLimits(item);
                evaluationContext.plainTextBody = convertHtmlToPlainText(body);

                return evaluationContext.plainTextBody;
            default:
                assertNever(this.itemHasRegularExpressionMatchRule.PropertyName);
                return '';
        }
    }

    /** Gets the sender's SMTP address depending on if it is a message or appointment */
    private GetSenderSMTPAddress(item: Item): string {
        if (IsMessage(item.ItemClass.toLowerCase())) {
            const message: Message = item as Message;
            if (!!message.Sender && !!message.Sender.Mailbox) {
                return message.Sender.Mailbox.EmailAddress;
            }
        }

        if (IsAppointment(item.ItemClass.toLowerCase())) {
            const appointment: CalendarItem = item as CalendarItem;
            if (!!appointment.Organizer && !!appointment.Organizer.Mailbox) {
                return appointment.Organizer.Mailbox.EmailAddress;
            }
        }

        return null;
    }

    /** Gets the item's body with body length limits applied */
    private GetBodyWithLimits(item: Item): string {
        const body: string = this.GetBody(item);

        if (body != null && body.length > this.limits.MAX_BODY_REGEX_ACTIVATION_LENGTH) {
            return null;
        }

        return body;
    }

    /** Gets the item's body */
    private GetBody(item: Item): string {
        let body: BodyContentType;
        if (item.NormalizedBody) {
            body = item.NormalizedBody;
        } else if (item.UniqueBody) {
            body = item.UniqueBody;
        } else if (item.Body) {
            body = item.Body;
        }

        const regexPropertyName = this.itemHasRegularExpressionMatchRule.PropertyName;

        // Add-ins that activate on BodyAsHTML should not activate on items with plaintext body
        if (
            body &&
            !(body.BodyType === 'Text' && regexPropertyName === RegExPropertyName.BodyAsHTML)
        ) {
            return body.Value;
        }

        return null;
    }
}
