import type {
    FavoritePersonaData,
    FavoritePersonaNode,
    OutlookFavoriteServiceDataType,
} from 'owa-favorites-types';
import { convertEWSFolderIdToRestFolderId } from '../index';

export function convertFavoritePersonaDataToFavoritePersonaNode(
    data: FavoritePersonaData
): FavoritePersonaNode {
    return {
        id: data.favoriteId,
        treeType: 'favorites',
        type: 1,
        allEmailAddresses: data.allEmailAddresses,
        displayName: data.displayName,
        mainEmailAddress: data.mainEmailAddress,
        searchFolderId: data.searchFolderId,
        isSyncUpdateDone: true,
        isJustAdded: false,
        isSearchFolderPopulated: data.isSearchFolderPopulated,
        markedForDeletion: false,
        dropViewState: null,
        personaId: data.personaId,
    };
}

export function createClientFavoritePersonaDataFromFavoriteNode(
    favoriteId: string,
    personaNode: FavoritePersonaNode,
    index: number
): FavoritePersonaData {
    return {
        treeType: 'favorites',
        type: 'persona',
        favoriteId: favoriteId,
        displayName: personaNode.displayName,
        searchFolderId: personaNode.searchFolderId,
        client: 'Migration',
        allEmailAddresses: personaNode.allEmailAddresses,
        personaId: personaNode.personaId,
        mainEmailAddress: personaNode.mainEmailAddress,
        isSearchFolderPopulated: !!personaNode.searchFolderId,
        isSyncUpdateDone: true,
    };
}

export function createInitialFavoritePersonaData(
    favoriteId: string,
    displayName: string,
    emailAddress: string
): FavoritePersonaData {
    return {
        treeType: 'favorites',
        type: 'persona',
        favoriteId: favoriteId,
        displayName: displayName,
        searchFolderId: undefined,
        client: 'OWA',
        allEmailAddresses: [emailAddress],
        personaId: undefined,
        mainEmailAddress: emailAddress,
        isSearchFolderPopulated: false,
        isSyncUpdateDone: true,
    };
}

export function createAddFavoritePersonaServicePayload(
    displayName: string,
    emailAddress: string
): OutlookFavoriteServiceDataType {
    return {
        Type: 'persona',
        DisplayName: displayName,
        SingleValueSettings: [
            {
                Key: 'MainEmailAddress',
                Value: emailAddress,
            },
        ],
        Client: 'OWA',
    };
}

/**
 * Create a favorite migration service object by passing all the available info
 */
export function createOwsFavoritePersonaMigrationData(
    favoriteId: string,
    personaNode: FavoritePersonaNode
): OutlookFavoriteServiceDataType {
    const singleValueSettings = [];

    if (personaNode.mainEmailAddress) {
        singleValueSettings.push({
            Key: 'MainEmailAddress',
            Value: personaNode.mainEmailAddress,
        });
    }

    if (personaNode.personaId) {
        singleValueSettings.push({
            Key: 'PersonaId',
            Value: convertEWSFolderIdToRestFolderId(personaNode.personaId),
        });
    }

    if (personaNode.searchFolderId) {
        singleValueSettings.push({
            Key: 'SearchFolderId',
            Value: convertEWSFolderIdToRestFolderId(personaNode.searchFolderId),
        });
    }

    return {
        Type: 'persona',
        DisplayName: personaNode.displayName,
        SingleValueSettings: singleValueSettings,
        MultiValueSettings: personaNode.allEmailAddresses
            ? [
                  {
                      Key: 'EmailAddresses',
                      Values: personaNode.allEmailAddresses,
                  },
              ]
            : [],
        Client: 'Migration',
    };
}
