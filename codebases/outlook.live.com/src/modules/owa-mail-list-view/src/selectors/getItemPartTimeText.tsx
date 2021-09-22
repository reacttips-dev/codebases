import * as React from 'react';
import folderStore, { getEffectiveFolderDisplayName } from 'owa-folders';
import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import { formatRelativeDate } from 'owa-observable-datetime';
import type Message from 'owa-service/lib/contract/Message';
import { FolderTag } from '../index';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function getItemPartTimeText(item: Message): string | JSX.Element {
    const parentFolder = folderStore.folderTable.get(item.ParentFolderId.Id);

    // Show parent folder if item part is not being viewed within parent folder
    if (parentFolder && getFolderIdForSelectedNode() != parentFolder.FolderId.Id) {
        return isFeatureEnabled('mon-tri-itemPartFolderInfo') ? (
            <FolderTag
                folderId={item.ParentFolderId.Id}
                isPreviewTextOn={false} // Passing in false for both params ensures that there is no extra left margin added.
                isSingleLine={false}
            />
        ) : (
            getEffectiveFolderDisplayName(parentFolder)
        );
    } else if (item.IsDraft && item.LastModifiedTime) {
        return formatRelativeDate(item.LastModifiedTime);
    } else if (item.DateTimeReceived) {
        return formatRelativeDate(item.DateTimeReceived);
    } else {
        return '';
    }
}
