import {
    FavoritePrivateDistributionListData,
    OutlookFavoriteServiceDataType,
    FavoritePrivateDistributionListNode,
    FolderForestNodeType,
} from 'owa-favorites-types';
import type { PrivateDistributionListMember } from 'owa-persona-models';
import { convertEWSFolderIdToRestFolderId } from './ewsRestFolderIdConverter';

export function convertFavoritePdlDataToFavoritePdlNode(
    data: FavoritePrivateDistributionListData
): FavoritePrivateDistributionListNode {
    return {
        id: data.favoriteId,
        treeType: 'favorites',
        type: FolderForestNodeType.PrivateDistributionList,
        data: data,
    };
}

export function createInitialFavoritePrivateDistributionListData(
    favoriteId: string,
    displayName: string,
    members: PrivateDistributionListMember[],
    pdlId: string,
    owsPersonaId: string
): FavoritePrivateDistributionListData {
    return {
        treeType: 'favorites',
        type: 'privatedistributionlist',
        favoriteId: favoriteId,
        displayName: displayName,
        members: members,
        pdlId: pdlId,
        searchFolderId: undefined,
        client: 'OWA',
        isSearchFolderPopulated: false,
        owsPersonaId: owsPersonaId,
    };
}

export function createAddFavoritePrivateDistributionListServicePayload(
    displayName: string,
    members: PrivateDistributionListMember[]
): OutlookFavoriteServiceDataType {
    return {
        Type: 'privatedistributionlist',
        DisplayName: displayName,
        MultiValueSettings: [
            {
                Key: 'EmailAddresses',
                Values: members.map(member => member.emailAddress),
            },
            {
                Key: 'MemberNames',
                Values: members.map(member => member.name),
            },
        ],
        Client: 'OWA',
    };
}

export function createAddFavoriteExistingPrivateDistributionListServicePayload(
    displayName: string,
    pdlId: string,
    owsPersonaId: string
): OutlookFavoriteServiceDataType {
    return {
        Type: 'privatedistributionlist',
        DisplayName: displayName,
        SingleValueSettings: [
            {
                Key: 'PdlId',
                Value: convertEWSFolderIdToRestFolderId(pdlId),
            },
            {
                Key: 'PersonaId',
                Value: owsPersonaId,
            },
        ],
        Client: 'OWA',
    };
}

export function createEditPDLServiceData(
    newDisplayName: string,
    newMembers: PrivateDistributionListMember[]
): OutlookFavoriteServiceDataType {
    const dataObject: OutlookFavoriteServiceDataType = {
        Type: 'privatedistributionlist',
        Client: 'OWA',
    };

    if (newDisplayName) {
        dataObject['DisplayName'] = newDisplayName;
    }

    if (newMembers) {
        const settings = [
            {
                Key: 'EmailAddresses',
                Values: newMembers.map(member => member.emailAddress),
            },
            {
                Key: 'MemberNames',
                Values: newMembers.map(member => member.name),
            },
        ];

        dataObject['MultiValueSettings'] = settings;
    }

    return dataObject;
}
