import type * as Schema from 'owa-graph-schema';
import { mapOWSFolderToGql } from 'owa-folder-gql-mappers';
import type FolderInfoResponseMessage from 'owa-service/lib/contract/FolderInfoResponseMessage';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import handleServerResponseSuccessAndError from 'owa-service-utils/lib/handleServerResponseSuccessAndError';
import type PropertyUri from 'owa-service/lib/contract/PropertyUri';
import { getFolders } from '../services/getFolders';

/**
 * Web resolver responsible for fetching folders by id
 */
export const foldersWeb = async (
    parent: any,
    args: Schema.QueryFoldersArgs,
    context: Schema.ResolverContext,
    info: any
): Promise<Schema.MailFolder[]> => {
    let additionalProperties: PropertyUri[] = [];
    let shapeName;

    if (args.options?.additionalProperties) {
        // Whenever additional properties are requested, request
        // other properties that client has specified as non-nullable.
        additionalProperties = args.options.additionalProperties.map(prop =>
            propertyUri({ FieldURI: prop })
        );
        additionalProperties.push(propertyUri({ FieldURI: 'ParentFolderId' }));
    } else {
        // Folder shape name is a wellknown shape name which
        // encompasses a set of properties. This is t he same shapeName also used when
        // fetching folders in the folder hierarchy request. This wellknown shapename is defined in OWS layer
        // and the purpose of this was to reduce the byte in the request payload.
        shapeName = 'Folder';
    }

    const responseMessages = await getFolders(
        additionalProperties,
        args.ids,
        shapeName,
        args.options?.mailboxInfo,
        context.requestOptions
    );

    // Throw if response is not successful or expected data is not found
    await handleServerResponseSuccessAndError(responseMessages);

    const folders: Schema.MailFolder[] = [];
    responseMessages!.forEach(responseMessage => {
        (responseMessage as FolderInfoResponseMessage).Folders?.forEach(folder => {
            const gqlFolder = mapOWSFolderToGql(folder, args.options.mailboxInfo);

            if (gqlFolder) {
                folders.push(gqlFolder);
            }
        });
    });

    if (folders.length === 0) {
        throw new Error('foldersWeb: failed to get folders');
    }

    // TODO - fix the merging logic once a folder gets back and is merged in the cache
    return folders;
};
