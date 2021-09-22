import getContactByPersonaId from './../../../services/people/getContactByPersonaId';
import getPersonaByEmail from './../../../util/getPersonaByEmail';
import synchronizeSearchFolder from './synchronizeSearchFolder';
import datapoints from '../../../datapoints';
import * as pendingFavoritesMapMutators from '../../../mutators/pendingFavoritesMapMutators';
import { logUsage, wrapFunctionForDatapoint } from 'owa-analytics';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import { getGuid } from 'owa-guid';
import type { ActionSource } from 'owa-mail-store';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { trace } from 'owa-trace';
import {
    markSearchFolderAsPopulated,
    MARK_FOLDER_POPULATED_TIMEOUT,
} from './markSearchFolderAsPopulated';
import {
    getStore as getSharedFavoritesStore,
    isPersonaInFavorites,
    updateFavoritesUserOption,
} from 'owa-favorites';
import { FavoritePersonaNode, FolderForestNodeType } from 'owa-favorites-types';
import isFavoritingInProgress from '../../../selectors/isFavoritingInProgress';
import { mutatorAction } from 'satcheljs';

interface ResolvedPersona {
    displayName: string;
    personaId: string;
    emailAddress: string;
    emailAddresses: string[];
}

/**
 * Add a favorite persona given the personaId or email.
 * If personaId is provided, it will be used to resolve the persona, and the email will be ignored
 * @returns A promise wrapping the added FavoritePersonaNode
 */
export default function addFavoritePersona(
    personaId: string,
    emailAddress: string,
    displayName: string,
    actionSource: ActionSource
): Promise<FavoritePersonaNode> {
    if (personaId) {
        return addFavoritePersonaByPersonaId(personaId, displayName, actionSource);
    } else {
        return addFavoritePersonaByEmail(emailAddress, displayName, actionSource);
    }
}

/**
 * Add a favorite node to the favorite store, the persona is resolved by calling findPeople with the email address
 */
async function addFavoritePersonaByEmail(
    emailAddress: string,
    displayName: string,
    actionSource: ActionSource
): Promise<FavoritePersonaNode> {
    if (!emailAddress) {
        throw new Error('No email address was provided.');
    }

    return resolveAndAddFavoritePersona(
        null,
        emailAddress,
        displayName,
        actionSource,
        'email',
        () => getPersonaByEmail(emailAddress, displayName, false /*inludeMailboxAndDirectory*/)
    );
}

/**
 * Add a favorite node to the favorite store, the persona is resolved by calling GetPersona with the persona id
 */
async function addFavoritePersonaByPersonaId(
    personaId: string,
    displayName: string,
    actionSource: ActionSource
): Promise<FavoritePersonaNode> {
    if (!personaId) {
        throw new Error('No persona id was provided.');
    }

    return resolveAndAddFavoritePersona(
        personaId,
        null,
        displayName,
        actionSource,
        'personaId',
        () => getContactByPersonaId(personaId)
    );
}

const resolveAndAddFavoritePersona = wrapFunctionForDatapoint(
    datapoints.AddFavoritePersonaAction,
    async function resolveAndAddFavoritePersona(
        personaId: string | null,
        emailAddress: string | null,
        displayName: string,
        actionSource: ActionSource,
        valueForResolution: string,
        contactResolver: () => Promise<PersonaType | null>
    ): Promise<FavoritePersonaNode> {
        const inProgressKey = emailAddress || personaId;
        let isInProgressSet = false;

        const favoriteNodeId = getGuid();
        try {
            if (isFavoritingInProgress(inProgressKey)) {
                throw new Error('AddFavoritePersona - Favoriting is already in progress');
            }

            pendingFavoritesMapMutators.add(inProgressKey);
            isInProgressSet = true;

            // Check if favoritesPersonaNodes already contains this persona, by checking personaId and emails
            if (isPersonaInFavorites(personaId, emailAddress)) {
                throw new Error(
                    'AddFavoritePersona - Cannot add duplicate personas to favorites. Store already has persona before Persona resolution'
                );
            }

            // Optimistically update the UI with the information that we have on the favorite
            // At this point, the "type" of favorite is not known, so no personaId is present
            const initialFavoritePersonaNode = {
                id: favoriteNodeId,
                type: FolderForestNodeType.Persona,
                displayName: displayName,
                mainEmailAddress: emailAddress,
                allEmailAddresses: emailAddress ? [emailAddress] : [],
                searchFolderId: undefined,
                isSearchFolderPopulated: false,
                isJustAdded: true,
                isSyncUpdateDone: true,
                dropViewState: createDropViewState(),
            } as FavoritePersonaNode;

            addInitialFavoritePersonaNode(favoriteNodeId, initialFavoritePersonaNode);
            addFavoritesNodeId(favoriteNodeId);

            // The node is visible in the UI and we can get the rest of the information
            const persona = await resolvePersona(displayName, emailAddress, contactResolver);

            // Check if favoritesPersonaNodes already contains this persona, by checking personaId
            if (
                persona.personaId &&
                [...getSharedFavoritesStore().favoritesPersonaNodes.values()].some(
                    node => node.personaId === persona.personaId
                )
            ) {
                throw new Error(
                    'AddFavoritePersona - Cannot add duplicate personas to favorites. Store already has persona after Persona resolution.'
                );
            }

            // Update the favorite node with the information from resolving the favorite, this only triggers a re-render
            // if the display name changes.
            const updatedFavoritePersonaNode = updateFavoritePersonaNode(
                favoriteNodeId,
                persona,
                initialFavoritePersonaNode
            );

            // Setup search folder
            if (updatedFavoritePersonaNode.mainEmailAddress) {
                await synchronizeSearchFolder(updatedFavoritePersonaNode, 'OnAdd').catch(error => {
                    throw new Error(
                        'AddFavoritePersona - synchronizeSearchFolder failed with error: ' +
                            (error || {}).toString()
                    );
                });
            }

            await updateFavoritesUserOption();

            setTimeout(() => {
                markSearchFolderAsPopulated(favoriteNodeId);
            }, MARK_FOLDER_POPULATED_TIMEOUT);

            pendingFavoritesMapMutators.remove(inProgressKey);

            return updatedFavoritePersonaNode;
        } catch (error) {
            // Remove the node from the leftNav
            cleanup(favoriteNodeId);

            if (isInProgressSet) {
                pendingFavoritesMapMutators.remove(inProgressKey);
            }

            const eventName = 'AddFavoritePersonaFailure';
            trace.warn(eventName + ': ' + error);
            logUsage(eventName, [error.toString()]);

            throw {
                type: 'AddFavoritePersonaError',
                ...error,
            };
        }
    }
);

/**
 * Resolve the favorite with the provided resolver, if the favorite cannot be resolved a personaType with the provided
 * information is with an Undefined Id.
 */
function resolvePersona(
    displayName: string,
    emailAddress: string,
    contactResolver: () => Promise<PersonaType | null>
): Promise<ResolvedPersona> {
    return contactResolver()
        .then(personaType => {
            // If we cannot resolve the address we have a recipient cache persona without a valid persona id,
            // so we do not define the persona id.
            return personaType
                ? {
                      displayName: personaType.DisplayName || displayName,
                      personaId: personaType.PersonaId.Id,
                      emailAddress:
                          personaType.EmailAddress &&
                          getEmailAddressNameOrAddress(personaType.EmailAddress),
                      emailAddresses:
                          (personaType.EmailAddresses &&
                              personaType.EmailAddresses.map(getEmailAddressNameOrAddress)) ||
                          [],
                  }
                : {
                      displayName: displayName,
                      personaId: undefined,
                      emailAddress: emailAddress,
                      emailAddresses: [emailAddress],
                  };
        })
        .catch(error => {
            throw new Error(
                'AddFavoritePersona - resolvePersona failed with error: ' + (error || {}).toString()
            );
        });
}

const addInitialFavoritePersonaNode = mutatorAction(
    'addInitialFavoritePersonaNode',
    function (favoriteNodeId: string, favoritePersona: FavoritePersonaNode) {
        getSharedFavoritesStore().favoritesPersonaNodes.set(favoriteNodeId, favoritePersona);
    }
);

const addFavoritesNodeId = mutatorAction('addFavoritesNodeId', function (favoriteNodeId: string) {
    getSharedFavoritesStore().orderedFavoritesNodeIds.push(favoriteNodeId);
});

function updateFavoritePersonaNode(
    favoriteNodeId: string,
    persona: ResolvedPersona,
    currentNode: FavoritePersonaNode
): FavoritePersonaNode {
    if ((currentNode.displayName || '') !== (persona.displayName || '')) {
        logUsage('AddFavoritePersona - DisplayName Mismatch');
    }

    const favoritePersona = {
        ...currentNode,
        displayName: persona.displayName,
        mainEmailAddress: persona.emailAddress,
        allEmailAddresses: persona.emailAddresses,
        isJustAdded: false,
    };

    // The personaId field will be populated only if a contact from the myContacts folder was found
    if (persona.personaId) {
        logUsage('AddFavoritePersona - Contact found, storing personaId');
        favoritePersona.personaId = persona.personaId;
    }

    addInitialFavoritePersonaNode(favoriteNodeId, favoritePersona);

    return favoritePersona;
}

const cleanup = mutatorAction('sharedFavoriteCleanup', (personaId: string) => {
    const sharedFavoritesStore = getSharedFavoritesStore();
    const index = sharedFavoritesStore.orderedFavoritesNodeIds.indexOf(personaId);

    if (index > -1) {
        sharedFavoritesStore.orderedFavoritesNodeIds.splice(index, 1);
    }

    if (sharedFavoritesStore.favoritesPersonaNodes.has(personaId)) {
        sharedFavoritesStore.favoritesPersonaNodes.delete(personaId);
    }
});

/**
 * - The OWS FindPeople API returns an X500 address for some contacts. Use the OriginalDisplayName in those cases.
 * - If a persona was created with an email address in an invalid format (E.g.: foobar@example), then the EmailAddressWrapper
 *   from the GetPersona response will have an empty EmailAdress field. In that case, we return the OriginalDisplayName,
 *   which will be populated with the invalid format address.
 */
function getEmailAddressNameOrAddress(emailAddress: EmailAddressWrapper): string {
    return emailAddress.RoutingType && emailAddress.RoutingType.toUpperCase() === 'EX'
        ? emailAddress.OriginalDisplayName
        : emailAddress.EmailAddress || emailAddress.OriginalDisplayName;
}
