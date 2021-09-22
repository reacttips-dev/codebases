import getContactByPersonaId from './../../../services/people/getContactByPersonaId';
import getPersonaByEmail from './../../../util/getPersonaByEmail';
import { getStore as getSharedFavoritesStore } from 'owa-favorites';
import { isGuid } from 'owa-guid';
import type { FavoritePersonaNode } from 'owa-favorites-types';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { logUsage, wrapFunctionForDatapoint } from 'owa-analytics';
import datapoints from '../../../datapoints';
import { action } from 'satcheljs/lib/legacy';

/**
 * Uses the current persona information to check for updates.
 * @returns A promise with a boolean value indicating whether any information on the persona has changed
 */
export default wrapFunctionForDatapoint(
    datapoints.ValidateAndUpdateFavorite,
    async function validateAndUpdateFavorite(currentNodeId: string): Promise<boolean> {
        const favoritePersona = getSharedFavoritesStore().favoritesPersonaNodes.get(currentNodeId);
        const idToLog = isGuid(currentNodeId) ? currentNodeId : '';

        if (favoritePersona.personaId) {
            // Create a promise for a fallback email lookup, in case getting a personaId is unsuccessful.
            const contactForEmailPromise = getPersonaByEmail(
                favoritePersona.mainEmailAddress,
                favoritePersona.displayName,
                false /* includeMailboxAndDirectory */
            );

            // Try to retrieve a contact for given personaId
            const persona = await getContactByPersonaId(favoritePersona.personaId);

            // If the GetPersona call fails, the contact might have been deleted or linked with another. Await the getPersonaByEmail call to check
            const newPersona = persona ? persona : await contactForEmailPromise;

            if (!newPersona) {
                //The contact for this PersonaId was deleted, convert the favorite to a recipient cache persona by deleting the personaId field

                logUsage('ValidateAndUpdateFavorite: Change Detected', [
                    'ContactToRecipentCache',
                    idToLog,
                ]);
                updatePersona(
                    favoritePersona,
                    favoritePersona.displayName,
                    favoritePersona.mainEmailAddress,
                    favoritePersona.allEmailAddresses
                );

                return true;
            } else {
                //We potentially have new info for the contact, update it
                const newDisplayName = newPersona.DisplayName;
                const newMainEmailAddress = getEmailAddressNameOrAddress(newPersona.EmailAddress);
                const newAllEmailAddresses = (newPersona.EmailAddresses || []).map(
                    getEmailAddressNameOrAddress
                );

                const displayNameChanged = favoritePersona.displayName !== newDisplayName;
                const mainEmailAddressChanged =
                    favoritePersona.mainEmailAddress !== newMainEmailAddress;
                const allEmailAddressesChanged = !hasSameItems(
                    favoritePersona.allEmailAddresses,
                    newAllEmailAddresses
                );

                if (displayNameChanged || mainEmailAddressChanged || allEmailAddressesChanged) {
                    logUsage('ValidateAndUpdateFavorite: Change Detected', [
                        'ContactToUpdatedContact',
                        idToLog,
                        displayNameChanged,
                        mainEmailAddressChanged,
                        allEmailAddressesChanged,
                    ]);
                    updatePersona(
                        favoritePersona,
                        newDisplayName,
                        newMainEmailAddress,
                        newAllEmailAddresses,
                        newPersona.PersonaId.Id
                    );

                    return true;
                }

                return false;
            }
        } else {
            // The current favorite has no personaId
            // Check if we now have a contact for the given mailAddress and displayName
            // persona will be null if a contact does not exist
            const persona = await getPersonaByEmail(
                favoritePersona.mainEmailAddress,
                favoritePersona.displayName,
                false /* includeMailboxAndDirectory */
            );

            if (persona) {
                // There is now a contact for this favorite. Update it with the new info and a personaId
                logUsage('ValidateAndUpdateFavorite: Change Detected', [
                    'RecipientCacheToContact',
                    idToLog,
                ]);

                updatePersona(
                    favoritePersona,
                    persona.DisplayName,
                    getEmailAddressNameOrAddress(persona.EmailAddress),
                    persona.EmailAddresses.map(getEmailAddressNameOrAddress),
                    persona.PersonaId.Id
                );

                return true;
            } else {
                // Do nothing: This is still a recipient cache contact, it will be checked again next time it is clicked
                return false;
            }
        }
    }
);

// This is extracted to separate action due to bug in Satchel which occurs in tests:
// [mobx] Invariant failed: It is not allowed to create or change state outside an `action` when MobX is in strict mode.
const updatePersona = action('updatePersona')(function updatePersona(
    favoritePersona: FavoritePersonaNode,
    newDisplayName: string,
    newMainEmailAddress: string,
    newAllEmailAddresses: string[],
    personaId?: string
): void {
    // Fallback to email if new persona has no displayName
    favoritePersona.displayName = newDisplayName || newMainEmailAddress;
    favoritePersona.mainEmailAddress = newMainEmailAddress;
    favoritePersona.allEmailAddresses = newAllEmailAddresses;

    if (!personaId) {
        delete favoritePersona.personaId;
    } else {
        // We don't update the list of sorted ids not to cause a re-render
        // Also, we do not update favoritePersona.id, as that is an ID identifying the node, and not the persona in it.
        favoritePersona.personaId = personaId;
    }
});

function hasSameItems(left: string[], right: string[]): boolean {
    return (
        left &&
        right &&
        left.length === right.length &&
        left.every(element => right.includes(element))
    );
}

/**
 * - The OWS FindPeople API returns an X500 address for some contacts. Use the OriginalDisplayName in those cases.
 * - If a persona was created with an email address in an invalid format (E.g.: foobar@example), then the EmailAddressWrapper
 *   from the GetPersona response will have an empty EmailAdress field. In that case, we return the OriginalDisplayName,
 *   which will be populated with the invalid format address.
 */
function getEmailAddressNameOrAddress(emailAddress: EmailAddressWrapper): string {
    if (!emailAddress) {
        return '';
    }

    return emailAddress.RoutingType && emailAddress.RoutingType.toUpperCase() === 'EX'
        ? emailAddress.OriginalDisplayName
        : emailAddress.EmailAddress || emailAddress.OriginalDisplayName;
}
