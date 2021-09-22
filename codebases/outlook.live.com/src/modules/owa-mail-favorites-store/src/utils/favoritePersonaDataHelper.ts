import type {
    FavoritePersonaData,
    OutlookFavoriteServiceDataType,
    FavoritePersonaNode,
} from 'owa-favorites-types';
import { convertEWSFolderIdToRestFolderId } from 'owa-favorites';

export function createClientFavoritePersonaData(
    favoriteId: string,
    personaNode: FavoritePersonaNode,
    isMigration: boolean
): FavoritePersonaData {
    return {
        treeType: 'favorites',
        type: 'persona',
        favoriteId: favoriteId,
        displayName: personaNode.displayName,
        searchFolderId: personaNode.searchFolderId,
        client: isMigration ? 'Migration' : 'OWA',
        allEmailAddresses: personaNode.allEmailAddresses,
        personaId: personaNode.personaId,
        mainEmailAddress: personaNode.mainEmailAddress,
        isSearchFolderPopulated: !!personaNode.searchFolderId,
        isSyncUpdateDone: true,
    };
}

/**
 * Create a favorite migration service object by passing all the available info
 */
export function createOwsFavoritePersonaData(
    personaNode: FavoritePersonaNode
): OutlookFavoriteServiceDataType {
    const singleValueSettings = [];
    const multiValueSettings = [];

    // Provide mainEmailAddress as fallback if email is not defined
    const favoriteName = personaNode.displayName || personaNode.mainEmailAddress;

    if (!favoriteName) {
        // If there's no valid name, cannot build valid OWS data from this favorite.
        return undefined;
    }

    if (personaNode.mainEmailAddress) {
        singleValueSettings.push({
            Key: 'MainEmailAddress',
            Value: personaNode.mainEmailAddress,
        });

        // Only provide Email-related fields if the main email address is defined.

        if (personaNode.searchFolderId) {
            singleValueSettings.push({
                Key: 'SearchFolderId',
                Value: convertEWSFolderIdToRestFolderId(personaNode.searchFolderId),
            });
        }

        // Filter undefined addresses
        const validEmailAddresses =
            personaNode.allEmailAddresses && personaNode.allEmailAddresses.filter(email => !!email);

        if (validEmailAddresses.length > 0) {
            multiValueSettings.push({
                Key: 'EmailAddresses',
                Values: validEmailAddresses,
            });
        } else {
            // If no valid addresses were found, fall back to mainEmailAddress
            multiValueSettings.push({
                Key: 'EmailAddresses',
                Values: [personaNode.mainEmailAddress],
            });
        }
    }

    if (personaNode.personaId) {
        singleValueSettings.push({
            Key: 'PersonaId',
            Value: convertEWSFolderIdToRestFolderId(personaNode.personaId),
        });
    }

    if (singleValueSettings.length === 0) {
        // If neither Email adress nor PersonaId is defined, Cannot build valid OWS data from this favorite.
        return undefined;
    }

    return {
        Type: 'persona',
        DisplayName: favoriteName,
        SingleValueSettings: singleValueSettings,
        MultiValueSettings: multiValueSettings,
        Client: 'Migration',
    };
}
