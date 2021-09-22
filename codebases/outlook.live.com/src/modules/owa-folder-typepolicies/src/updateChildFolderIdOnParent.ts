import { gql } from '@apollo/client';
import type { FieldFunctionOptions } from '@apollo/client/cache';

// tslint:disable: no-multiline-string
export function updateChildFolderIdsOnParent(
    childIds: string[],
    folderId: string,
    options: FieldFunctionOptions
) {
    options.cache.writeFragment({
        id: 'MailFolder:' + folderId,
        fragment: gql`
            fragment ChildFolderIds on MailFolder {
                childFolderIds
            }
        `,
        data: {
            childFolderIds: childIds,
        },
    });
}
