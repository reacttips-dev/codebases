import { MailFolderList, MailFolderContextMenu, MailFolderRoot } from 'owa-mail-folder-view';
import { observer } from 'mobx-react-lite';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { LazyAction, LazyModule } from 'owa-bundling';
import type { FolderForestTreeType, MailFolder } from 'owa-graph-schema';
import { useLazyKeydownHandler } from 'owa-hotkeys';
import { hideFolderTreeContextMenu } from 'owa-mail-folder-store/lib/actions/folderTreeContextMenu';
import { default as viewStateStore } from 'owa-mail-folder-store/lib/store/store';
import MailFolderNodeTree from './MailFolderNodeTree';
import type { ActionSource } from 'owa-mail-store';
import * as React from 'react';
import {
    getFolderTable,
    FolderTreeLoadStateEnum,
    getFolderTreeLoadingState,
    getFolderTreeHasMoreData,
} from 'owa-folders';
import { lazyToggleFolderTreeCollapsed } from 'owa-mail-folder-tree-container-view';
import { PRIMARY_FOLDERS_TREE_TYPE, SHARED_FOLDERS_TREE_TYPE } from 'owa-folders-constants';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getMailboxInfoFromFolderId } from 'owa-mail-mailboxinfo';
import { MailboxInfo, getUserMailboxInfo } from 'owa-client-ids';
import { lazyMoveFolder } from 'owa-folder-movefolder';

const lazyModule = new LazyModule(
    () => import('owa-mail-folder-tree-container-view/lib/components/lazyFolderListHotKeys')
);
const lazySetupMailFolderListKeys = new LazyAction(lazyModule, m => m.setupMailFolderListKeys);

export interface MailFolderListWrapperProps extends React.HTMLProps<HTMLDivElement> {
    childFolderIds: string[]; // Children folder ids to render the sub-folders under root
    isFavoritesSupported: boolean; // this tree's folders can or can't support favorites for folder
    isRootExpanded: boolean; // Whether the root node should be in an expanded state
    onDeleteFolderCallback: (folder: MailFolder, actionSource: ActionSource) => void; // Callback on click of Delete folder
    onRootNodeChevronClickedCallback: () => void; // Callback on click of root folder
    rootDisplayName: string; // Display name of root node
    rootFolder: MailFolder; // Root folder details
    showRootNode: boolean; // Whether or not to show root node
    treeType: FolderForestTreeType; // Type of folder tree
    rootNodeId: string; // The unique identifier of the root node of the folder tree
    shouldBeDroppable: boolean;
    onLoadMoreClickedCallback: () => void; // Callback on click of the Load More button
    primarySmtp?: string;
    setSize?: number;
    positionInSet?: number;
}

export default observer(function MailFolderListWrapper(props: MailFolderListWrapperProps) {
    const containerRef = React.useRef<HTMLDivElement>();

    React.useEffect(() => {
        if (!props.showRootNode && !props.isRootExpanded) {
            // If the 'Folders' root node is hidden, and the root node is collapsed
            // we need to explicitly expand the root node for it to be accessible
            lazyToggleFolderTreeCollapsed.importAndExecute(
                null /* toggleFolderTreeExpansion */,
                !props.isRootExpanded /* isCollapsed */
            );
        }
    }, [props.showRootNode, props.isRootExpanded]);

    useLazyKeydownHandler(containerRef, lazySetupMailFolderListKeys.importAndExecute, props);

    /**
     * Returns whether the context menu should be displayed or not
     */
    const shouldShowContextMenu = React.useCallback((): boolean => {
        const { contextMenuState } = viewStateStore;
        // Render the context menu if it is set to be visible and for different folder tree, we render a new context menu
        if (!contextMenuState || contextMenuState.treeType != props.treeType) {
            return false;
        }
        // Additionally for shared folder trees, we need to check the folderId property because treeType is same for all shared folder roots
        if (contextMenuState.treeType === SHARED_FOLDERS_TREE_TYPE) {
            const folder = getFolderTable().get(contextMenuState.folderId);
            if (folder.principalSMTPAddress != props.rootFolder.principalSMTPAddress) {
                return false;
            }
        }
        // To support multi-accounts, we must check and make context menu only show on the expected account's folder view.
        if (props.primarySmtp) {
            const folder = getFolderTable().get(contextMenuState.folderId);
            return props.primarySmtp === folder.mailboxInfo.mailboxSmtpAddress;
        }
        return true;
    }, [props.treeType, props.rootFolder.principalSMTPAddress]);

    const renderContextMenu = (): JSX.Element => {
        const contextMenuState = viewStateStore.contextMenuState;
        return (
            <MailFolderContextMenu
                anchorPoint={contextMenuState.anchor}
                folderId={contextMenuState.folderId}
                onDismiss={onContextMenuDismissed}
                onDeleteFolder={props.onDeleteFolderCallback}
                shouldHideToggleFavorite={!props.isFavoritesSupported}
                nodeType={contextMenuState.nodeType}
                treeType={props.treeType}
            />
        );
    };

    const moveFolder = (
        destinationFolderId: string,
        destinationFolderMailboxInfo: MailboxInfo,
        sourceFolderId: string,
        sourceFolderMailboxInfo: MailboxInfo,
        sourceFolderParentFolderId: string,
        sourceFolderDisplayName: string
    ) => {
        lazyMoveFolder.importAndExecute(
            null /* moveFolderMutation */,
            destinationFolderId,
            destinationFolderMailboxInfo,
            sourceFolderId,
            sourceFolderMailboxInfo,
            sourceFolderParentFolderId,
            sourceFolderDisplayName
        );
    };

    const hasMoreData = getFolderTreeHasMoreData(props.rootNodeId);
    const shouldShowLoadingSpinner =
        getFolderTreeLoadingState(props.rootNodeId, props.primarySmtp) ===
        FolderTreeLoadStateEnum.Loading;

    const shouldShowRootNodeContextMenu = React.useCallback(() => {
        return (
            props.treeType === SHARED_FOLDERS_TREE_TYPE ||
            (props.treeType === PRIMARY_FOLDERS_TREE_TYPE && !isConsumer())
        );
    }, [props.treeType]);

    const rootFolder = props.rootFolder;
    if (!rootFolder) {
        return null;
    }

    const ariaProps: AriaProperties = {
        role: AriaRoles.tree,
    };

    const {
        childFolderIds,
        isRootExpanded,
        isFavoritesSupported,
        onLoadMoreClickedCallback,
        onRootNodeChevronClickedCallback,
        positionInSet,
        rootDisplayName,
        rootNodeId,
        setSize,
        shouldBeDroppable,
        showRootNode,
        treeType,
    } = props;

    const renderFolderNode = (
        folderId: string,
        nestDepth: number,
        treeType: FolderForestTreeType,
        isFavoritesSupported: boolean,
        onContextMenu: (
            evt: React.MouseEvent<unknown>,
            folderId: string,
            distinguishedFolderParentIds: string[]
        ) => void
    ) => {
        return (
            <MailFolderNodeTree
                key={folderId}
                folderId={folderId}
                nestDepth={nestDepth}
                treeType={treeType}
                isFavoritesSupported={isFavoritesSupported}
                onContextMenu={onContextMenu}
                renderFolderNode={renderFolderNode}
                moveFolder={moveFolder}
            />
        );
    };

    return (
        <div
            ref={containerRef}
            style={props.style}
            className={props.className}
            {...generateDomPropertiesForAria(ariaProps)}>
            {showRootNode && (
                <MailFolderRoot
                    displayName={rootDisplayName}
                    onRootNodeChevronClickedCallback={onRootNodeChevronClickedCallback}
                    positionInSet={positionInSet}
                    rootFolder={rootFolder}
                    rootNodeId={rootNodeId}
                    setSize={setSize}
                    shouldBeDroppable={shouldBeDroppable}
                    treeType={treeType}
                    mailboxInfo={getMailboxInfoFromFolderId(rootNodeId)}
                    isRootExpanded={isRootExpanded}
                    shouldShowRootNodeContextMenu={shouldShowRootNodeContextMenu()}
                    moveFolder={moveFolder}
                />
            )}
            {/* Render tree */}
            {isRootExpanded && (
                <MailFolderList
                    childFolderIds={childFolderIds}
                    isFavoritesSupported={isFavoritesSupported}
                    onLoadMoreClickedCallback={onLoadMoreClickedCallback}
                    rootNodeId={rootNodeId}
                    rootFolderId={rootFolder?.FolderId?.Id}
                    treeType={treeType}
                    hasMoreData={hasMoreData}
                    shouldShowLoadingSpinner={shouldShowLoadingSpinner}
                    renderFolderNode={renderFolderNode}
                    mailboxInfo={
                        props.primarySmtp
                            ? getUserMailboxInfo(props.primarySmtp)
                            : getMailboxInfoFromFolderId(rootNodeId)
                    }
                />
            )}
            {/* Render context menu */ shouldShowContextMenu() && renderContextMenu()}
        </div>
    );
});

function onContextMenuDismissed() {
    hideFolderTreeContextMenu();
}
