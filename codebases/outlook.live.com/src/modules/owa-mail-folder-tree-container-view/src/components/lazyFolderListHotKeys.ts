import type * as React from 'react';
import type { KeydownConfig } from 'owa-hotkeys';
import { getCommands } from 'owa-mail-hotkeys/lib/utils/MailModuleHotKeys';
import { initiateMailFolderTextField } from 'owa-mail-folder-store/lib/actions/folderTextFieldActions';
import type { FolderForestTreeType, MailFolder } from 'owa-graph-schema';

export function setupMailFolderListKeys(props: {
    rootFolder: MailFolder;
    treeType: FolderForestTreeType;
}): KeydownConfig[] {
    return [
        {
            command: getCommands().newFolder,
            handler: evt =>
                onNewFolderNodeClicked(
                    evt,
                    props.rootFolder.FolderId.Id,
                    props.treeType,
                    props.rootFolder.mailboxInfo.mailboxSmtpAddress
                ),
        },
    ];
}

export function onNewFolderNodeClicked(
    evt: React.MouseEvent<unknown> | React.KeyboardEvent | KeyboardEvent,
    folderId: string,
    treeType: FolderForestTreeType,
    mailboxSmtpAddress: string
) {
    evt.stopPropagation();
    evt.preventDefault();
    initiateMailFolderTextField(folderId, 'new', treeType, mailboxSmtpAddress);
}
