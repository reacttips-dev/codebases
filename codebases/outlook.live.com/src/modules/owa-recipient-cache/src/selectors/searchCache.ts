import type { CachePersona } from '../store/schema/RecipientCacheStore';
import rcStore from '../store/store';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { lazySearchCacheTrie } from 'owa-3s-local';

export default function searchCache(
    searchQuery: string,
    numberOfResults: number,
    recipientsToExclude?: { EmailAddress: EmailAddressWrapper }[],
    mailboxTypesToExclude?: string[]
): PersonaType[] {
    const curriedCacheHit = isEmailCacheHit(searchQuery);

    return searchCacheInternal(
        curriedCacheHit,
        numberOfResults,
        recipientsToExclude,
        mailboxTypesToExclude
    );
}

export function searchSuggestionTrie(
    searchQuery: string,
    numberOfResults: number,
    recipientsToExclude?: { EmailAddress: EmailAddressWrapper }[],
    mailboxTypesToExclude?: string[]
): Promise<PersonaType[]> {
    return lazySearchCacheTrie
        .import()
        .then(searchCacheTrie =>
            searchCacheTrie(searchQuery, numberOfResults, person =>
                shouldSkipRecipient(recipientsToExclude, person, mailboxTypesToExclude)
            )
        );
}

export function searchCacheWithFunction(
    searchFunction: (persona: CachePersona) => boolean,
    numberOfResults: number,
    recipientsToExclude?: { EmailAddress: EmailAddressWrapper }[],
    mailboxTypesToExclude?: string[]
): PersonaType[] {
    return searchCacheInternal(
        searchFunction,
        numberOfResults,
        recipientsToExclude,
        mailboxTypesToExclude
    );
}

function searchCacheInternal(
    searchFunction: (persona: CachePersona) => boolean,
    numberOfResults: number,
    recipientsToExclude?: { EmailAddress: EmailAddressWrapper }[],
    mailboxTypesToExclude?: string[]
): PersonaType[] {
    let resultList: CachePersona[] = [];
    let i = 0;
    while (
        resultList.length < numberOfResults &&
        rcStore.recipientCache &&
        i < rcStore.recipientCache.length
    ) {
        const cachePersona = rcStore.recipientCache[i];
        if (searchFunction(cachePersona)) {
            const email = cachePersona.EmailAddress;
            let skipRecipient = shouldSkipRecipient(
                recipientsToExclude,
                email,
                mailboxTypesToExclude
            );

            if (!skipRecipient) {
                resultList.push(cachePersona);
            }
        }
        i++;
    }

    return resultList;
}

export function shouldSkipRecipient(
    recipientsToExclude: { EmailAddress: EmailAddressWrapper }[],
    email: EmailAddressWrapper,
    mailboxTypesToExclude: string[]
): boolean {
    let skipRecipient = false;
    // Skip recipient if it's found in recipientsToExclude list
    if (recipientsToExclude && isDuplicated(email, recipientsToExclude)) {
        skipRecipient = true;
    }

    // Skip recipient if its mailbox type is in mailboxTypesToExclude
    if (mailboxTypesToExclude && mailboxTypesToExclude.indexOf(email.MailboxType) >= 0) {
        skipRecipient = true;
    }
    return skipRecipient;
}

export const isEmailCacheHit = (searchQuery: string) => (persona: CachePersona): boolean => {
    const email = persona.EmailAddress;
    // If the email address matches, it's a hit.
    if (email.EmailAddress && email.EmailAddress.toLowerCase().indexOf(searchQuery) == 0) {
        return true;
    }

    if (email.Name) {
        // If their full name matches, it's a hit.
        if (email.Name.toLowerCase().indexOf(searchQuery) == 0) {
            return true;
        }

        // Else, check individual sub-part of the name.
        const names = email.Name.toLowerCase().split(' ');
        for (let i = 0; i < names.length; i++) {
            if (names[i].indexOf(searchQuery) == 0) {
                return true;
            }
        }
    }

    return false;
};

function isDuplicated(
    email: EmailAddressWrapper,
    recipientsToCheck: { EmailAddress: EmailAddressWrapper }[]
): boolean {
    for (var j = 0; j < recipientsToCheck.length; j++) {
        if (email.EmailAddress == recipientsToCheck[j].EmailAddress.EmailAddress) {
            return true;
        }
    }
    return false;
}
