import type { TypedTypePolicies } from 'owa-graph-schema-type-policies';
import { folderHierarchyTypePolicy } from './folderHierarchyTypePolicy';

export const folderTypePolicies: TypedTypePolicies = {
    MailFolder: {
        fields: {
            childFolderIds: {
                // Short for always preferring incoming over existing data.
                merge: false,
                read(existing) {
                    if (!existing) {
                        return [];
                    }

                    return existing;
                },
            },
            ParentFolderId: {
                merge(existing, incoming) {
                    return {
                        Id: incoming?.Id || existing?.Id,
                        ChangeKey: existing?.ChangeKey || incoming?.ChangeKey || null,
                        __typename: 'FolderId',
                    };
                },
            },
            FolderId: {
                merge(existing, incoming) {
                    return {
                        Id: incoming?.Id || existing?.Id,
                        ChangeKey: existing?.ChangeKey || incoming?.ChangeKey || null,
                        __typename: 'FolderId',
                    };
                },
            },
        },
    },
    Query: {
        fields: {
            folder(_, { args, toReference }) {
                return toReference({
                    __typename: 'MailFolder',
                    id: args?.id,
                });
            },
            folderHierarchy: folderHierarchyTypePolicy,
        },
    },
};
