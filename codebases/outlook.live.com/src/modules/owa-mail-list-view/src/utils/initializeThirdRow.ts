import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { IsShadowMailboxUser } from 'owa-mail-ads-shared/lib/sharedAdsUtils';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import * as React from 'react';
import loc, { format } from 'owa-localize';
import {
    junkMailHeader,
    singleItem,
    noneOrMultipleItems,
    recoverItemsDeletedFromThisFolder,
    goBackToDeletedItems,
    deletedItemsFolderWarning,
} from './mailListActionRow.locstring.json';
import MailListActionHeaderRow from '../components/listHeaders/MailListActionHeaderRow';
import folderStore from 'owa-folders';
import { ControlIcons } from 'owa-control-icons';
import { isDeletedItemsFolderFromAnyMailbox } from 'owa-mail-store';
import {
    ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
    ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { selectFolder } from 'owa-mail-folder-forest-actions';
import type { TableView } from 'owa-mail-list-store';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

export default function initializeThirdRow(
    dumpsterFolderDistinguishedId: string,
    dumpsterFolderId: string,
    deletedItemsFolderDistinguishedId: string,
    folderId: string,
    treeType: string,
    styleSelectorAsPerUserSettings: string,
    mailListThirdRowCssClass: string,
    tableView?: TableView
) {
    const isDeletedTable = isDeletedItemsFolderFromAnyMailbox(folderId);
    const recoverDeletedItemsEnabled = getUserConfiguration().RecoverDeletedItemsEnabled;
    const isConsumerAccount = isConsumer();
    const isItemView = tableView?.tableQuery?.listViewType === ReactListViewType.Message;
    /**
     * Only show junk email folder header if we're in "Junk Email" folder. In
     * Cloud Cache mailboxes, the junk email folder is called "Spam" so we
     * shouldn't show it.
     */

    if (folderIdToName(folderId) == 'junkemail' && !IsShadowMailboxUser()) {
        const retentionPolicyTags = getUserConfiguration().RetentionPolicyTags;
        let showJunkMailThirdRow = isConsumerAccount;

        let retentionDays = 10; // Default
        for (const policy of retentionPolicyTags) {
            if (policy.DisplayName == ('JunkMail' || 'Junk Email')) {
                retentionDays = policy.RetentionPeriod;
                showJunkMailThirdRow = true;
                break;
            }
        }

        // Do not display third row junk mail header if enterprise account does not have a retention policy for junk
        if (showJunkMailThirdRow) {
            return React.createElement(
                MailListActionHeaderRow,
                {
                    alternativeIcon: ControlIcons.Warning,
                    containerCssClass: mailListThirdRowCssClass,
                    text: format(loc(junkMailHeader), retentionDays),
                    mailListHeaderStylesAsPerUserSettings: styleSelectorAsPerUserSettings,
                    isItemView: isItemView,
                },
                null /* children */
            );
        }
    }

    const isDumpsterTable = dumpsterFolderId === folderId;

    if (isDeletedTable && recoverDeletedItemsEnabled) {
        // Dumpster folder is lazily loaded and fetched,
        // and hence may not be ready
        const dumpsterFolder = folderStore.folderTable.get(dumpsterFolderId);
        const dumpsterTotalCount = dumpsterFolder ? dumpsterFolder.TotalCount : -1;
        let dumpsterLinkNumItemsString;
        let showLoadingSpinner = false;
        const warningText = loc(deletedItemsFolderWarning);

        if (dumpsterTotalCount < 0) {
            showLoadingSpinner = true;
        } else if (dumpsterTotalCount === 1) {
            dumpsterLinkNumItemsString = format(loc(singleItem), dumpsterTotalCount);
        } else {
            dumpsterLinkNumItemsString = format(loc(noneOrMultipleItems), dumpsterTotalCount);
        }

        let dumpsterLinkString = loc(recoverItemsDeletedFromThisFolder);
        // Currently, we don't not show the number for archive mailbox because
        // the count gets updated by hierarchy notifications
        if (!showLoadingSpinner && treeType === 'primaryFolderTree') {
            dumpsterLinkString = format(
                '{0} {1}{2}{3}',
                loc(recoverItemsDeletedFromThisFolder),
                '(',
                dumpsterLinkNumItemsString,
                ')'
            );
        }
        return [
            isConsumerAccount &&
                React.createElement(
                    MailListActionHeaderRow,
                    {
                        text: warningText,
                        showLoadingSpinner: showLoadingSpinner,
                        mailListHeaderStylesAsPerUserSettings: styleSelectorAsPerUserSettings,
                        alternativeIcon: ControlIcons.Warning,
                        isItemView: isItemView,
                    },
                    null /* children */
                ),
            React.createElement(
                MailListActionHeaderRow,
                {
                    containerCssClass: mailListThirdRowCssClass,
                    text: dumpsterLinkString,
                    onClick: () => goToDumpster(dumpsterFolderDistinguishedId),
                    showLoadingSpinner: showLoadingSpinner,
                    mailListHeaderStylesAsPerUserSettings: styleSelectorAsPerUserSettings,
                    alternativeIcon: ControlIcons.RemoveFromTrash,
                    isItemView: isItemView,
                },
                null /* children */
            ),
        ];
    } else if (isDumpsterTable) {
        return React.createElement(
            MailListActionHeaderRow,
            {
                alternativeIcon: ControlIcons.ChevronLeft,
                containerCssClass: mailListThirdRowCssClass,
                text: loc(goBackToDeletedItems),
                onClick: () => goToDeletedItems(deletedItemsFolderDistinguishedId),
                mailListHeaderStylesAsPerUserSettings: styleSelectorAsPerUserSettings,
                showBackArrow: true,
                isItemView: isItemView,
            },
            null /* children */
        );
    }

    return null;
}

function goToDumpster(distinguishedFolderId: string) {
    const treeType =
        distinguishedFolderId === ARCHIVE_DUMPSTER_DISTINGUISHED_ID
            ? 'archiveFolderTree'
            : 'primaryFolderTree';
    selectFolder(folderNameToId(distinguishedFolderId), treeType, 'Dumpster');
}

function goToDeletedItems(distinguishedFolderId: string) {
    const treeType =
        distinguishedFolderId === ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID
            ? 'archiveFolderTree'
            : 'primaryFolderTree';
    selectFolder(folderNameToId(distinguishedFolderId), treeType, 'Dumpster');
}
