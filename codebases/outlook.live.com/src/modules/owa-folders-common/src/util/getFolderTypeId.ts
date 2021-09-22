import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

/**
 * Return the Id to lookup the folder fragment in the cache
 * @param folderId the id of the folder
 */
export function getFolderTypeId(folderId: string, client: ApolloClient<NormalizedCacheObject>) {
    const folder = {
        __typename: 'MailFolder',
        id: folderId,
    };

    return client.cache.identify(folder);
}
