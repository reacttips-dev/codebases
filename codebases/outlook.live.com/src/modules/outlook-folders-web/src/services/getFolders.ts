import type * as Schema from 'owa-graph-schema';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type PropertyUri from 'owa-service/lib/contract/PropertyUri';
import folderId from 'owa-service/lib/factory/folderId';
import folderResponseShape from 'owa-service/lib/factory/folderResponseShape';
import getFolderRequest from 'owa-service/lib/factory/getFolderRequest';
import getFolderOperation from 'owa-service/lib/operation/getFolderOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type RequestOptions from 'owa-service/lib/RequestOptions';

/**
 * Web service responsible for fetching folders by id
 */
export async function getFolders(
    additionalProperties: PropertyUri[],
    folderIds: string[],
    shapeName: string | undefined,
    mailboxInfo: Schema.MailboxInfoInput | undefined | null,
    requestOptions: RequestOptions | undefined
) {
    return getFolderOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getFolderRequest({
                FolderShape: folderResponseShape({
                    BaseShape: 'IdOnly',
                    AdditionalProperties: additionalProperties,
                }),
                ShapeName: shapeName,
                FolderIds: folderIds.map(id => folderId({ Id: id })),
            }),
        },
        getMailboxRequestOptions(mailboxInfo, requestOptions)
    ).then(response => {
        return response.Body?.ResponseMessages?.Items;
    });
}
