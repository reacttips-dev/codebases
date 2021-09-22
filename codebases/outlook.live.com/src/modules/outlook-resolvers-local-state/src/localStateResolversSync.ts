import type { Resolvers } from 'owa-graph-schema';
import { lazyRenameFolder } from 'renamefolder-mutation';

/**
 * Please keep these fields alphabetized to minimize merge conflicts
 */
export const localStateResolvers: Resolvers = {
    Mutation: {
        renameFolder: lazyRenameFolder,
    },
};
