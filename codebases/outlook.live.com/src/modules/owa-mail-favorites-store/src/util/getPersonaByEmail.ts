import { findContactsByEmail, findPeopleByEmail } from '../services/people/findPeopleByEmail';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { trace } from 'owa-trace';
import { logUsage } from 'owa-analytics';
import datapoints from '../datapoints';

export default function getPersonaByEmail(
    emailAddress: string,
    displayName: string,
    includeMailboxAndDirectory: boolean
): Promise<PersonaType> {
    return includeMailboxAndDirectory
        ? findContactsAndRecipientCacheEntriesByEmail(emailAddress, displayName)
        : getConcreteContactByEmail(emailAddress, displayName);
}

async function findContactsAndRecipientCacheEntriesByEmail(
    emailAddress: string,
    displayName: string
): Promise<PersonaType> {
    const people = findPeopleByEmail(emailAddress);
    const contacts = await findContactsByEmail(emailAddress);

    // First we check if the emailAddress is found in contacts if not we use the result from
    // the mailbox / directory
    const response = contacts.personas && contacts.personas.length > 0 ? contacts : await people;

    // We can get several hits for the given email with different displayNames, to avoid confusion for the user
    // we use the one favorited
    if (response.personas && response.personas.length > 0) {
        const personasForDisplayName = response.personas.filter(
            persona =>
                persona.DisplayName &&
                displayName &&
                persona.DisplayName.toLocaleLowerCase() === displayName.toLocaleLowerCase()
        );

        if (personasForDisplayName.length > 0) {
            return personasForDisplayName[0];
        }

        const personaToReturn = response.personas[0];

        // Contact from the recipient cache without a proper displayName,
        // fall back on the provided display name
        if (
            personaToReturn.DisplayName === emailAddress &&
            personaToReturn.EmailAddress.MailboxType === 'OneOff'
        ) {
            logUsage(datapoints.OneOffAddressUsedForFavorite);

            return {
                ...personaToReturn,
                DisplayName: displayName,
            };
        }

        return personaToReturn;
    } else {
        trace.warn(`Cannot find persona by email: ${emailAddress}`);
        throw new Error(
            `Persona not found (people: ${response.requestId}, contacts: ${
                contacts.requestId
            }, length: ${emailAddress ? emailAddress.length : 'no email address'})`
        );
    }
}

/**
 * If multiple contacts are found for the given email, the one with DisplayName equal to displayNameHint is returned.
 * Otherwise, we return the dirst one
 */
async function getConcreteContactByEmail(
    emailAddress: string,
    displayNameHint: string
): Promise<PersonaType> {
    const contacts = await findContactsByEmail(emailAddress);

    // We can get several hits for the given email with different displayNames, to avoid confusion for the user
    // we use the one favorited
    if (contacts.personas && contacts.personas.length > 0) {
        const personasForDisplayName = contacts.personas.filter(
            persona =>
                persona.DisplayName &&
                displayNameHint &&
                persona.DisplayName.toLocaleLowerCase() === displayNameHint.toLocaleLowerCase()
        );

        if (personasForDisplayName.length > 0) {
            return personasForDisplayName[0];
        }

        return contacts.personas[0];
    } else {
        return null;
    }
}
