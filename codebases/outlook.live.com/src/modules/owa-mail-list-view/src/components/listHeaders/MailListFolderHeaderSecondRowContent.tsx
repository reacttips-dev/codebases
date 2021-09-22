import { observer } from 'mobx-react-lite';
import FocusedInboxHeader from './FocusedInboxHeader';
import MailListHeaderSecondRowTextContent from './MailListHeaderSecondRowTextContent';
import { getEffectiveFolderDisplayName, isPublicFolder, isFolderInMailboxType } from 'owa-folders';
import { isFocusedInboxEnabled } from 'owa-mail-triage-common';
import getSelectedFolder from 'owa-mail-store/lib/utils/getSelectedFolder';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import * as React from 'react';
import { isFavoritingInProgress } from 'owa-mail-favorites-store';
import { lazyToggleFavoriteFolder } from 'owa-mail-folder-forest-actions';
import { lazyRemovePublicFolderFromFavorites } from 'owa-publicfolder-picker';
import { isFolderInFavorites, isPublicFolderInFavorites } from 'owa-favorites';

export interface MailListFolderHeaderSecondRowContentProps {
    tableViewId: string;
    containerCssClass: string;
    mailListHeaderStylesAsPerUserSettings: string;
}

export default observer(function MailListFolderHeaderSecondRowContent(
    props: MailListFolderHeaderSecondRowContentProps
) {
    const selectedFolder = getSelectedFolder();
    const isInboxSelected = selectedFolder?.FolderId?.Id === folderNameToId('inbox');

    if (isInboxSelected && isFocusedInboxEnabled()) {
        return (
            <FocusedInboxHeader
                tableViewId={props.tableViewId}
                mailListHeaderStylesAsPerUserSettings={props.mailListHeaderStylesAsPerUserSettings}
            />
        );
    }
    if (!selectedFolder) {
        /**
         * This function gets called when when user switches from a favorite persona to a favorite category. At that time, the selected node
         * is set to category node while the table is still persona table. Thus we are expecting the folder to be undefined as the category folder
         * is not saved in folder store.
         */
        return null;
    }
    const selectedFolderId = selectedFolder?.FolderId?.Id;

    const isSharedOrArchiveFolder =
        selectedFolderId &&
        (isFolderInMailboxType(selectedFolderId, 'SharedMailbox') ||
            isFolderInMailboxType(selectedFolderId, 'ArchiveMailbox'));

    const isFolderInFavorite =
        selectedFolderId &&
        (isPublicFolder(selectedFolderId)
            ? isPublicFolderInFavorites(selectedFolderId)
            : isFolderInFavorites(selectedFolderId));

    const toggleFavoriteState = async (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        if (!selectedFolder || !selectedFolderId) {
            return;
        }
        if (isFavoritingInProgress(selectedFolderId)) {
            // Do nothing: favoriting is in progress
            return;
        }
        if (isPublicFolder(selectedFolderId)) {
            const removePublicFolderFromFavorites = await lazyRemovePublicFolderFromFavorites.import();
            removePublicFolderFromFavorites(selectedFolder);
        } else {
            lazyToggleFavoriteFolder.importAndExecute(
                selectedFolderId,
                isFolderInFavorite,
                'FolderHeader'
            );
        }
    };

    return (
        <MailListHeaderSecondRowTextContent
            text={getEffectiveFolderDisplayName(selectedFolder)}
            containerCssClass={props.containerCssClass}
            showFavoriteToggle={!isSharedOrArchiveFolder}
            onFavoriteToggleClick={toggleFavoriteState}
            isInFavorites={isFolderInFavorite}
        />
    );
});
