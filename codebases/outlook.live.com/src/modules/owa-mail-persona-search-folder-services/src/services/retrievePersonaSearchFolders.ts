import {
    EXTENDED_PROPERTY_PERSONA_NODE_ID,
    searchFolderShape,
} from './fetchFavoritePersonaSearchFolder';
import type FindFolderRequest from 'owa-service/lib/contract/FindFolderRequest';
import type FindFolderResponseMessage from 'owa-service/lib/contract/FindFolderResponseMessage';
import type FolderType from 'owa-service/lib/contract/Folder';
import type IsEqualTo from 'owa-service/lib/contract/IsEqualTo';
import constant from 'owa-service/lib/factory/constant';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import fieldURIOrConstantType from 'owa-service/lib/factory/fieldURIOrConstantType';
import findFolderRequest from 'owa-service/lib/factory/findFolderRequest';
import folderIdFactory from 'owa-service/lib/factory/folderId';
import isEqualTo from 'owa-service/lib/factory/isEqualTo';
import orType from 'owa-service/lib/factory/or';
import restrictionType from 'owa-service/lib/factory/restrictionType';
import findFolderOperation from 'owa-service/lib/operation/findFolderOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

function folderPersonaIdRestriction(personaId: string): IsEqualTo {
    return isEqualTo({
        FieldURIOrConstant: fieldURIOrConstantType({
            Item: constant({
                Value: personaId,
            }),
        }),
        Item: extendedPropertyUri(EXTENDED_PROPERTY_PERSONA_NODE_ID),
    });
}

function configureRequestBody(personaIds: string[], parentFolderId: string): FindFolderRequest {
    const personaIdsRestrictions = personaIds.map(personaId =>
        folderPersonaIdRestriction(personaId)
    );

    return findFolderRequest({
        FolderShape: searchFolderShape(),
        Paging: null,
        ParentFolderIds: [folderIdFactory({ Id: parentFolderId })],
        ReturnParentFolder: true,
        ShapeName: 'Folder',
        Traversal: 'Deep',
        Restriction: restrictionType({
            Item: orType({
                Items: personaIdsRestrictions,
            }),
        }),
    });
}

/*
 * Returns all the search folders that have a given personaId as extended property. The folders is
 * used to show the unread count.
 */
export default function retrievePersonaSearchFolders(
    personaIds: string[],
    parentFolderId: string
): Promise<FolderType[]> {
    return findFolderOperation({
        Header: getJsonRequestHeader(),
        Body: configureRequestBody(personaIds, parentFolderId),
    }).then(response => {
        if (response.Body.ResponseMessages.Items[0].ResponseClass === 'Success') {
            return Promise.resolve(
                (response.Body.ResponseMessages.Items[0] as FindFolderResponseMessage).RootFolder
                    .Folders as FolderType[]
            );
        } else {
            return Promise.reject(
                response.Body.ResponseMessages.Items[0].ResponseCode +
                    ': ' +
                    response.Body.ResponseMessages.Items[0].MessageText
            );
        }
    });
}
