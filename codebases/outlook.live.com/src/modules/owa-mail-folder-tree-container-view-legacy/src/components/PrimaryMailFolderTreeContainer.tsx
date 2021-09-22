import { observer } from 'mobx-react-lite';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyDeleteFolder } from 'owa-folder-deletefolder';
import {
    getFolderByDistinguishedId,
    getMailRootFolderChildIds,
    getPrimaryFolderTreeRootFolder,
    getPrimaryMailFolders,
} from 'owa-folders';
import {
    PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
    PRIMARY_FOLDERS_TREE_TYPE,
    PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import type { MailFolder } from 'owa-graph-schema';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import loc from 'owa-localize';
import { lazyToggleFolderTreeCollapsed } from 'owa-mail-folder-tree-container-view';
import { Folders } from 'owa-mail-folder-tree-container-view/lib/components/PrimaryMailFolderTreeContainer.locstring.json';
import { getMailboxInfoFromFolderId } from 'owa-mail-mailboxinfo';
import { ActionSource, isFolderUnderDeletedItemsFolder } from 'owa-mail-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import * as React from 'react';
import MailFolderListWrapper from './MailFolderListWrapper';

export interface PrimaryMailFolderTreeContainerProps {
    showRootNode: boolean;
    className: string;
    primarySmtp?: string;
    setSize?: number;
    positionInSet?: number;
}

/**
 * Primary mailbox container
 */
export default observer(function PrimaryMailFolderTreeContainer(
    props: PrimaryMailFolderTreeContainerProps
) {
    const userConfiguration = getUserConfiguration();
    const isCollapsed = userConfiguration?.UserOptions.IsMailRootFolderTreeCollapsed;

    // Primary mailbox root click handler
    const onRootNodeChevronClicked = () => {
        lazyToggleFolderTreeCollapsed.importAndExecute(
            null /* toggleFolderTreeExpansion */,
            isCollapsed
        );
    };

    const onDeleteFolder = (folder: MailFolder, actionSource: ActionSource) => {
        const isFolderUnderDeletedItemFolder = isFolderUnderDeletedItemsFolder(
            folder,
            PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID
        );

        // VSO:107838 - Remove mutation function null handling from deleteFolder mutation
        let primaryDeletedItemsFolderId;
        if (
            isFeatureEnabled('nh-boot-acctmonaccounts') &&
            isHostAppFeatureEnabled('acctmonaccounts') &&
            isFeatureEnabled('acct-multiaccounts-folderlists')
        ) {
            primaryDeletedItemsFolderId = getFolderByDistinguishedId(
                PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
                props.primarySmtp
            )?.id;
        } else {
            primaryDeletedItemsFolderId = folderNameToId(PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID);
        }

        lazyDeleteFolder.importAndExecute(
            null, // deleteFolderMutation
            folder,
            actionSource,
            primaryDeletedItemsFolderId,
            isFolderUnderDeletedItemFolder,
            getMailboxInfoFromFolderId(primaryDeletedItemsFolderId)
        );
    };

    const onLoadMoreClicked = () => {
        getPrimaryMailFolders(true /* isLoadingMore */);
    };

    const sessionSettings = userConfiguration?.SessionSettings;
    const isExplicitLogon = sessionSettings?.IsExplicitLogon;
    const rootDisplayName =
        isFeatureEnabled('nh-boot-acctmonaccounts') && isHostAppFeatureEnabled('acctmonaccounts')
            ? sessionSettings?.UserEmailAddress || loc(Folders)
            : loc(Folders);

    return (
        <MailFolderListWrapper
            className={props.className}
            key="primarymailboxtree"
            showRootNode={props.showRootNode}
            rootFolder={getPrimaryFolderTreeRootFolder(props.primarySmtp)}
            isRootExpanded={!isCollapsed}
            rootDisplayName={rootDisplayName}
            childFolderIds={getMailRootFolderChildIds('UserMailbox', props.primarySmtp)}
            onRootNodeChevronClickedCallback={onRootNodeChevronClicked}
            treeType={PRIMARY_FOLDERS_TREE_TYPE}
            isFavoritesSupported={!isExplicitLogon} // Favorites not supported for explicit logon scenarios
            onDeleteFolderCallback={onDeleteFolder}
            rootNodeId={PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID}
            shouldBeDroppable={true}
            onLoadMoreClickedCallback={onLoadMoreClicked}
            primarySmtp={props.primarySmtp}
            setSize={props.setSize}
            positionInSet={props.positionInSet}
        />
    );
});
