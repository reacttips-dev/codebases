import type AddressEntityType from 'owa-service/lib/contract/AddressEntityType';
import type ContactType from 'owa-service/lib/contract/ContactType';
import type EmailAddressEntityType from 'owa-service/lib/contract/EmailAddressEntityType';
import type EntityExtractionResultType from 'owa-service/lib/contract/EntityExtractionResultType';
import evaluateRegularExpression from '../../utils/evaluateRegularExpression';
import type Item from 'owa-service/lib/contract/Item';
import type MeetingSuggestionType from 'owa-service/lib/contract/MeetingSuggestionType';
import type PhoneEntityType from 'owa-service/lib/contract/PhoneEntityType';
import RequestedCapabilities from 'owa-service/lib/contract/RequestedCapabilities';
import type TaskSuggestionType from 'owa-service/lib/contract/TaskSuggestionType';
import type UrlEntityType from 'owa-service/lib/contract/UrlEntityType';
import type { IAddinCommand } from 'owa-addins-store';
import { toJS } from 'mobx';
import assign from 'object-assign';

export interface Entities {
    Addresses?: string[];
    Urls?: string[];
    PhoneNumbers?: PhoneEntityType[];
    Contacts?: ContactType[];
    MeetingSuggestions?: MeetingSuggestionType[];
    TaskSuggestions?: TaskSuggestionType[];
    EmailAddresses?: string[];
    IsLegacyExtraction?: boolean;
}

export function getEntities(
    result: EntityExtractionResultType,
    item: Item,
    addinCommand: IAddinCommand
): Entities {
    if (!result) {
        return {};
    }
    const entities: Entities = {
        Addresses: result.Addresses
            ? result.Addresses.map((value: AddressEntityType) => {
                  return value.Address;
              })
            : [],
        Urls: result.Urls
            ? result.Urls.map((value: UrlEntityType) => {
                  return value.Url;
              })
            : [],
        PhoneNumbers: result.PhoneNumbers ? result.PhoneNumbers : [],
    };

    entities.IsLegacyExtraction = isLegacyExtraction(item);

    if (addinCommand.extension.RequestedCapabilities != RequestedCapabilities.Restricted) {
        entities.Contacts = result.Contacts ? result.Contacts : [];
        entities.EmailAddresses = result.EmailAddresses
            ? result.EmailAddresses.map((value: EmailAddressEntityType) => {
                  return value.EmailAddress;
              })
            : [];
        entities.MeetingSuggestions = result.MeetingSuggestions
            ? result.MeetingSuggestions.map(fixTimeValues.bind(entities))
            : [];
        entities.TaskSuggestions = result.TaskSuggestions ? result.TaskSuggestions : [];
    }

    return entities;
}

export function getSelectedEntities(entities: Entities, terms: string[]): Entities {
    const selectedEntities: Entities = {};
    if (entities && terms) {
        if (entities.Addresses) {
            selectedEntities.Addresses = entities.Addresses.filter(address => {
                return hasMatchedTerm(address, terms);
            });
        }

        if (entities.MeetingSuggestions) {
            selectedEntities.MeetingSuggestions = entities.MeetingSuggestions.filter(
                meetingSuggestion => {
                    return hasMatchedTerm(meetingSuggestion.MeetingString, terms);
                }
            );
        }

        if (entities.TaskSuggestions) {
            selectedEntities.TaskSuggestions = entities.TaskSuggestions.filter(taskSuggestion => {
                return hasMatchedTerm(taskSuggestion.TaskString, terms);
            });
        }

        if (entities.PhoneNumbers) {
            selectedEntities.PhoneNumbers = entities.PhoneNumbers.filter(phoneNumber => {
                return hasMatchedTerm(phoneNumber.OriginalPhoneString, terms);
            });
        }

        if (entities.Urls) {
            selectedEntities.Urls = entities.Urls.filter(url => {
                return hasMatchedTerm(url, terms);
            });
        }

        if (entities.Contacts) {
            selectedEntities.Contacts = entities.Contacts.filter(contact => {
                return hasMatchedTerm(contact.ContactString, terms);
            });
        }

        if (entities.EmailAddresses) {
            selectedEntities.EmailAddresses = entities.EmailAddresses.filter(emailAddress => {
                return hasMatchedTerm(emailAddress, terms);
            });
        }
    }

    return selectedEntities;
}

function hasMatchedTerm(text: string, terms: string[]): boolean {
    for (const term of terms) {
        const matches = evaluateRegularExpression(text, term, true);
        if (matches && matches.length > 0) {
            return true;
        }
    }

    return false;
}

function isLegacyExtraction(item: Item): boolean {
    return (
        !item.EntityDocument &&
        (!item.PropertyExistence || !item.PropertyExistence.TextEntityExtractions)
    );
}

function fixTimeValues(this: Entities, entity: MeetingSuggestionType) {
    const isLegacyExtraction = this.IsLegacyExtraction;
    const clonedEntity = toJS(assign({}, entity));
    clonedEntity.EndTime = isLegacyExtraction
        ? getUTCinMilliseconds(clonedEntity.EndTime)
        : new Date(clonedEntity.EndTime).getTime();
    clonedEntity.StartTime = isLegacyExtraction
        ? getUTCinMilliseconds(clonedEntity.StartTime)
        : new Date(clonedEntity.StartTime).getTime();
    return clonedEntity;
}

function getUTCinMilliseconds(value: string) {
    const date = new Date(value);
    const result = new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        )
    );
    result.setUTCFullYear(date.getFullYear());
    return result.getTime();
}
