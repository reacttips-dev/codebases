import {
    lazyFolderHierarchyWeb,
    lazyFolderWeb,
    lazyFoldersWeb,
    lazyUpdateFolderPermissionsWeb,
} from 'outlook-folders-web';
import type { Resolvers } from 'owa-graph-schema';
import { lazyCreateFolderWeb } from 'create-folder-mutation-web';
import { lazyDeleteFolderWeb } from 'delete-folder-mutation-web';
import { lazyMoveFolderWeb } from 'move-folder-mutation-web';
import { lazyRenameFolderWeb } from 'rename-folder-mutation-web';

/**
 * Please keep fields alphebatized to minimize merge conflicts
 */
export const webResolvers: Resolvers = {
    /* ======================== */
    /* Resolvers for root types */
    /* ======================== */

    /**
     * The root query type. All queries that fetch data start at the Query type.
     * Resolvers under Query should not have effects
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Query: {
        folder: lazyFolderWeb,
        folderHierarchy: lazyFolderHierarchyWeb,
        folders: lazyFoldersWeb,
    },

    /**
     * The root mutation type. All queries that alter data start at the Mutation type.
     * Mutations typically return the mutated data.
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Mutation: {
        createFolder: lazyCreateFolderWeb,
        deleteFolder: lazyDeleteFolderWeb,
        moveFolder: lazyMoveFolderWeb,
        renameFolder: lazyRenameFolderWeb,
        updateFolderPermissions: lazyUpdateFolderPermissionsWeb,
    },

    /**
     * The root subscription type. Resolvers under subscriptions return an event stream
     * that the client responds to.
     *
     * For for definition and rationale, see https://graphql.org/blog/subscriptions-in-graphql-and-relay/#event-based-subscriptions
     * For resolver implementation, see https://www.apollographql.com/docs/apollo-server/data/subscriptions
     * For client consumption, see https://www.apollographql.com/docs/react/data/subscriptions
     */
    Subscription: {},
};
