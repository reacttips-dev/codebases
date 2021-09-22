import getDefaultFolderIdToLoad from './helpers/getDefaultFolderIdToLoad';
import selectFolder from './selectFolder';
import { isFolderInFavorites } from 'owa-favorites';
import type { FolderForestTreeType } from 'owa-graph-schema';
import type { ActionSource } from 'owa-mail-store';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export default function selectDefaultFolder(
    actionSource: ActionSource,
    sessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): void {
    const defaultFolderIdToLoad = getDefaultFolderIdToLoad();
    const treeType: FolderForestTreeType = isFolderInFavorites(defaultFolderIdToLoad)
        ? 'favorites'
        : 'primaryFolderTree';
    selectFolder(
        defaultFolderIdToLoad,
        treeType,
        actionSource,
        undefined,
        sessionData,
        apolloClientPromise
    );
}
