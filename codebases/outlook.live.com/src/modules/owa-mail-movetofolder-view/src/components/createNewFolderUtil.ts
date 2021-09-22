import type { MutationFunction } from '@apollo/client';
import type {
    CreateFolderMutationVariables,
    CreateFolderMutation,
} from 'owa-folder-createnew/lib/graphql/__generated__/CreateFolderMutation.interface';
import type { MailboxInfo } from 'owa-client-ids';
import { lazyCreateNewFolder } from 'owa-folder-createnew';

export function createNewFolder(
    createFolderMutation: MutationFunction<CreateFolderMutation, CreateFolderMutationVariables>,
    displayName: string,
    parentId: string,
    mailboxInfo: MailboxInfo
): Promise<string | null> {
    return lazyCreateNewFolder.importAndExecute(createFolderMutation, {
        parentId,
        displayName,
        mailboxInfo,
    });
}
