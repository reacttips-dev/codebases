import type ActivationRuleEvaluator from './ActivationRuleEvaluator';
import type BaseEntityType from 'owa-service/lib/contract/BaseEntityType';
import HighlightType from 'owa-service/lib/contract/HighlightType';
import type Item from 'owa-service/lib/contract/Item';
import type ItemHasKnownEntityRule from 'owa-service/lib/contract/ItemHasKnownEntityRule';
import KnownEntityType from 'owa-service/lib/contract/KnownEntityType';
import type MeetingSuggestionType from 'owa-service/lib/contract/MeetingSuggestionType';
import { evaluateRegularExpression } from 'owa-addins-apis';
import type { EvaluationContext } from './EvaluationContext';
import type { EvaluationResult } from 'owa-addins-store';

import assign from 'object-assign';

/**
 * The address PropertyName name used as a highlighted term
 */
const AddressPropertyName = 'Address';

/**
 * The contact PropertyName name used as a highlighted term
 */
const ContactPropertyName = 'ContactString';

/**
 * The email address PropertyName name used as a highlighted term
 */
const EmailAddressPropertyName = 'EmailAddress';

/**
 * The meeting suggestion PropertyName name used as a highlighted term
 */
const MeetingSuggestionPropertyName = 'MeetingString';

/**
 * The phone number PropertyName name used as a highlighted term
 */
const PhoneNumberPropertyName = 'OriginalPhoneString';

/**
 * The task suggestion PropertyName name used as a highlighted term
 */
const TaskSuggestionPropertyName = 'TaskString';

/**
 * The url PropertyName name used as a highlighted term
 */
const UrlPropertyName = 'Url';

export default class ItemHasKnownEntityRuleEvaluator implements ActivationRuleEvaluator {
    /**
     * Creates an instance of the ItemHasKnownEntityRuleEvaluator class
     * @param itemHasKnownEntityRule the item has known entity rule
     */
    constructor(private itemHasKnownEntityRule: ItemHasKnownEntityRule) {}

    /**
     * Evaluates this rule on the given item and puts the results into the evaluation context
     * @param item The item to Evaluate
     * @param evaluationContext The context in which to add evaluation results
     * @returns true if the add-in can be activated based on this evaluation
     */
    Evaluate(item: Item, evaluationContext: EvaluationContext): boolean {
        if (!item.EntityExtractionResult) {
            return false;
        }

        switch (this.itemHasKnownEntityRule.EntityType) {
            case KnownEntityType.Address:
                return this.EvaluateForEntityType(
                    item,
                    evaluationContext,
                    item.EntityExtractionResult.Addresses,
                    AddressPropertyName
                );
            case KnownEntityType.Contact:
                return this.EvaluateForEntityType(
                    item,
                    evaluationContext,
                    item.EntityExtractionResult.Contacts,
                    ContactPropertyName
                );
            case KnownEntityType.EmailAddress:
                return this.EvaluateForEntityType(
                    item,
                    evaluationContext,
                    item.EntityExtractionResult.EmailAddresses,
                    EmailAddressPropertyName
                );
            case KnownEntityType.MeetingSuggestion:
                return this.EvaluateForEntityType(
                    item,
                    evaluationContext,
                    item.EntityExtractionResult.MeetingSuggestions,
                    MeetingSuggestionPropertyName
                );
            case KnownEntityType.PhoneNumber:
                return this.EvaluateForEntityType(
                    item,
                    evaluationContext,
                    item.EntityExtractionResult.PhoneNumbers,
                    PhoneNumberPropertyName
                );
            case KnownEntityType.TaskSuggestion:
                return this.EvaluateForEntityType(
                    item,
                    evaluationContext,
                    item.EntityExtractionResult.TaskSuggestions,
                    TaskSuggestionPropertyName
                );
            case KnownEntityType.Url:
                return this.EvaluateForEntityType(
                    item,
                    evaluationContext,
                    item.EntityExtractionResult.Urls,
                    UrlPropertyName
                );
            default:
                throw new Error(
                    `Unexpected known entity: ${this.itemHasKnownEntityRule.EntityType}`
                );
        }
    }

    /**
     * Evaluates whether or not an item has an entity in the entity extraction results and
     * if it does, caches the term to highlight in the EvaluationContext.
     * @param item The item to Evaluate
     * @param evaluationContext The context in which to add evaluation results
     * @param entityListPropertyName The list property containing the entities to evaluate
     * @param entityPropertyName The entity property to highlight
     */
    private EvaluateForEntityType(
        item: Item,
        evaluationContext: EvaluationContext,
        entityList: BaseEntityType[],
        entityPropertyName: string
    ): boolean {
        if (!entityList) {
            // There were no entities of the given type
            return false;
        }

        const filteredEntities: BaseEntityType[] = [];
        let entitiesMatched = false;
        let highlightableEntityCount: number = 0;

        for (const entity of entityList) {
            if (this.EvaluateRegExForTerm(entity[entityPropertyName])) {
                entitiesMatched = true;

                // Keep track of which entities have been matched during this evaluation
                if (
                    evaluationContext.evaluationResult.matchedKnownEntityTypes.indexOf(
                        this.itemHasKnownEntityRule.EntityType as KnownEntityType
                    ) === -1
                ) {
                    evaluationContext.evaluationResult.matchedKnownEntityTypes.push(
                        this.itemHasKnownEntityRule.EntityType as KnownEntityType
                    );
                }

                if (
                    this.itemHasKnownEntityRule.Highlight !== HighlightType.None &&
                    entity.Position !== 'Subject'
                ) {
                    evaluationContext.terms.push(getSafeRegExTerm(entity, entityPropertyName));
                    highlightableEntityCount++;
                }

                // Add this entity to the filtered list of entities for this expression, and create a copy
                // so we don't wrap the item's copy in @observable when we add it to an observable map
                // Note that assign creates a shallow copy, which only prevents the item's BaseEntityTypes (i.e. MeetingSuggestionType)
                // from being wrapped in Observable
                const entityCopy = assign({}, entity);
                filteredEntities.push(entityCopy);
            }
        }

        if (this.itemHasKnownEntityRule.FilterName && this.itemHasKnownEntityRule.RegExFilter) {
            // Save the array of entities even if it is an empty array
            this.SaveRegexMatches(filteredEntities, evaluationContext.evaluationResult);
        }

        if (highlightableEntityCount > 0) {
            const previousHighlightableEntityCount =
                evaluationContext.highlightableEntities[this.itemHasKnownEntityRule.EntityType];

            // Only update if the new count is greater than the previous count
            if (
                !previousHighlightableEntityCount ||
                highlightableEntityCount > previousHighlightableEntityCount
            ) {
                evaluationContext.highlightableEntities[
                    this.itemHasKnownEntityRule.EntityType
                ] = highlightableEntityCount;
            }
        }

        return entitiesMatched;
    }

    /**
     * Evaluates the regular expression rule on the entity if present
     * @param body The entity string to evaluate RegEx
     * @returns true if there is no regex rule, or if there is and matches were found.
     */
    private EvaluateRegExForTerm(body: string): boolean {
        const ignoreCase = this.itemHasKnownEntityRule.IgnoreCase;
        const regExValue = this.itemHasKnownEntityRule.RegExFilter;
        if (!regExValue) {
            return true;
        }

        const matches = evaluateRegularExpression(body, regExValue, ignoreCase);
        return matches && matches.length > 0;
    }

    /**
     * Evaluates whether the item has all of the properties needed to evaluate this rule
     * @param item The item to check
     * @returns Indicates whether the item has all of the properties needed to evaluate this rule
     */
    ItemIsReadyForEvaluation(item: Item): boolean {
        if (item.EntityExtractionResult) {
            // EntityExtractionResult is already on the client
            return true;
        } else if (this.ItemHasEntityOnServer(item)) {
            // The entity for this rule exists on the server
            return false;
        } else {
            // The entity for this rule doesn't exist on the server
            return true;
        }
    }

    /** Checks if the item has a needed entity property on the server that is missing from the client */
    private ItemHasEntityOnServer(item: Item): boolean {
        if (!item.PropertyExistence) {
            // There are no entities on the server
            return false;
        }

        switch (this.itemHasKnownEntityRule.EntityType) {
            case KnownEntityType.Address:
                return item.PropertyExistence.ExtractedAddresses;
            case KnownEntityType.Contact:
                return item.PropertyExistence.ExtractedContacts;
            case KnownEntityType.EmailAddress:
                return item.PropertyExistence.ExtractedEmails;
            case KnownEntityType.MeetingSuggestion:
                return item.PropertyExistence.ExtractedMeetings;
            case KnownEntityType.PhoneNumber:
                return item.PropertyExistence.ExtractedPhones;
            case KnownEntityType.TaskSuggestion:
                return item.PropertyExistence.ExtractedTasks;
            case KnownEntityType.Url:
                return item.PropertyExistence.ExtractedUrls;
            default:
                return false;
        }
    }

    /**
     * Stores entities with regex matches in the evaluation context
     * @param filteredEntities An array of the entities that matched the expression
     * @param evaluationContext The context in which to add evaluation results
     */
    private SaveRegexMatches(
        filteredEntities: BaseEntityType[],
        evaluationResult: EvaluationResult
    ) {
        switch (this.itemHasKnownEntityRule.EntityType) {
            case KnownEntityType.Address:
                if (!evaluationResult.filteredEntityMatches.Addresses) {
                    evaluationResult.filteredEntityMatches.Addresses = {};
                }
                evaluationResult.filteredEntityMatches.Addresses[
                    this.itemHasKnownEntityRule.FilterName
                ] = filteredEntities;
                break;
            case KnownEntityType.Contact:
                if (!evaluationResult.filteredEntityMatches.Contacts) {
                    evaluationResult.filteredEntityMatches.Contacts = {};
                }
                evaluationResult.filteredEntityMatches.Contacts[
                    this.itemHasKnownEntityRule.FilterName
                ] = filteredEntities;
                break;
            case KnownEntityType.EmailAddress:
                if (!evaluationResult.filteredEntityMatches.EmailAddresses) {
                    evaluationResult.filteredEntityMatches.EmailAddresses = {};
                }
                evaluationResult.filteredEntityMatches.EmailAddresses[
                    this.itemHasKnownEntityRule.FilterName
                ] = filteredEntities;
                break;
            case KnownEntityType.MeetingSuggestion:
                if (!evaluationResult.filteredEntityMatches.MeetingSuggestions) {
                    evaluationResult.filteredEntityMatches.MeetingSuggestions = {};
                }
                evaluationResult.filteredEntityMatches.MeetingSuggestions[
                    this.itemHasKnownEntityRule.FilterName
                ] = filteredEntities;
                break;
            case KnownEntityType.PhoneNumber:
                if (!evaluationResult.filteredEntityMatches.PhoneNumbers) {
                    evaluationResult.filteredEntityMatches.PhoneNumbers = {};
                }
                evaluationResult.filteredEntityMatches.PhoneNumbers[
                    this.itemHasKnownEntityRule.FilterName
                ] = filteredEntities;
                break;
            case KnownEntityType.TaskSuggestion:
                if (!evaluationResult.filteredEntityMatches.TaskSuggestions) {
                    evaluationResult.filteredEntityMatches.TaskSuggestions = {};
                }
                evaluationResult.filteredEntityMatches.TaskSuggestions[
                    this.itemHasKnownEntityRule.FilterName
                ] = filteredEntities;
                break;
            case KnownEntityType.Url:
                if (!evaluationResult.filteredEntityMatches.Urls) {
                    evaluationResult.filteredEntityMatches.Urls = {};
                }
                evaluationResult.filteredEntityMatches.Urls[
                    this.itemHasKnownEntityRule.FilterName
                ] = filteredEntities;
                break;
        }
    }
}

export function getSafeRegExTerm(entity: BaseEntityType, propertyName: string): string {
    if (propertyName === MeetingSuggestionPropertyName) {
        return tryBuildTimeRegularExpression(entity as MeetingSuggestionType, propertyName);
    } else {
        return entity[propertyName];
    }
}

export function tryBuildTimeRegularExpression(
    meeting: MeetingSuggestionType,
    propertyName: string
): string {
    const meetingString: string = meeting[propertyName];

    if (!meeting.TimeStringLength) {
        return meetingString;
    }

    const timeExpression = meetingString.slice(
        meeting.TimeStringBeginIndex,
        meeting.TimeStringBeginIndex + meeting.TimeStringLength
    );
    const lookahead = meetingString.slice(
        meeting.TimeStringBeginIndex + meeting.TimeStringLength,
        meetingString.length
    );

    if (lookahead.length == 0) {
        return timeExpression;
    }

    return timeExpression + '(?=' + lookahead + ')';
}
