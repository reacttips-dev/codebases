import { searchFolderShape } from './fetchFavoritePersonaSearchFolder';
import type FindFolderRequest from 'owa-service/lib/contract/FindFolderRequest';
import type FindFolderResponseMessage from 'owa-service/lib/contract/FindFolderResponseMessage';
import type FolderType from 'owa-service/lib/contract/Folder';
import type IsEqualTo from 'owa-service/lib/contract/IsEqualTo';
import constant from 'owa-service/lib/factory/constant';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';
import fieldURIOrConstantType from 'owa-service/lib/factory/fieldURIOrConstantType';
import findFolderRequest from 'owa-service/lib/factory/findFolderRequest';
import isEqualTo from 'owa-service/lib/factory/isEqualTo';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import restrictionType from 'owa-service/lib/factory/restrictionType';
import findFolderOperation from 'owa-service/lib/operation/findFolderOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import * as trace from 'owa-trace';

function folderDisplayNameRestriction(): IsEqualTo {
    return isEqualTo({
        FieldURIOrConstant: fieldURIOrConstantType({
            Item: constant({
                Value: 'FavoritePersonas',
            }),
        }),
        Item: propertyUri({
            FieldURI: 'FolderDisplayName',
        }),
    });
}

function configureRequestBody(): FindFolderRequest {
    return findFolderRequest({
        FolderShape: searchFolderShape(),
        Paging: null,
        ParentFolderIds: [distinguishedFolderId({ Id: 'root' })],
        ReturnParentFolder: true,
        ShapeName: 'Folder',
        Traversal: 'Deep',
        Restriction: restrictionType({
            Item: folderDisplayNameRestriction(),
        }),
    });
}

export default function retrieveRootFavoritePersonasFolder(): Promise<FolderType | undefined> {
    return findFolderOperation({
        Header: getJsonRequestHeader(),
        Body: configureRequestBody(),
    }).then(response => {
        const folders = (response.Body.ResponseMessages.Items[0] as FindFolderResponseMessage)
            .RootFolder.Folders as FolderType[];
        return new Promise((resolve, reject) => {
            if (folders.length === 1) {
                resolve(folders[0]);
            } else if (folders.length > 1) {
                trace.trace.warn('More than one "FavoritePersonas" folder found.');
                resolve(folders[0]);
            } else if (folders.length === 0) {
                resolve(undefined);
            } else {
                trace.errorThatWillCauseAlert(response.Body.ResponseMessages.Items[0].MessageText);
                reject(response.Body.ResponseMessages.Items[0].MessageText);
            }
        });
    });
}
