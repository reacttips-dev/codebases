import { LoadMoreFolderNode } from './lazy/lazyFolderComponents';
import { FolderOperationNode } from '../index';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { observer } from 'mobx-react-lite';
import { FolderForestNodeType } from 'owa-favorites-types';
import type { FolderForestTreeType, MailboxInfoInput } from 'owa-graph-schema';
import { showFolderTreeContextMenu } from 'owa-mail-folder-store/lib/actions/folderTreeContextMenu';
import { getAnchorForContextMenu } from 'owa-positioning';
import { LazyPublicFolderPicker } from 'owa-publicfolder-picker';
import MailFolderNodeChildren from './MailFolderNodeChildren';
import type { RenderFolderNodeFunc } from './MailFolderNodeTreeProps';
import * as React from 'react';

export interface MailFolderListProps extends React.HTMLProps<HTMLDivElement> {
    childFolderIds: string[]; // Children folder ids to render the sub-folders under root
    hasMoreData: boolean; // Whether the tree has more data that can be fetched
    isFavoritesSupported: boolean; // this tree's folders can or can't support favorites for folder
    rootNodeId: string;
    rootFolderId: string; // Root folder details
    shouldShowLoadingSpinner: boolean;
    treeType: FolderForestTreeType; // Type of folder tree
    mailboxInfo: MailboxInfoInput;

    // Callbacks
    renderFolderNode: RenderFolderNodeFunc;
    renderLoadNode?: () => JSX.Element;
    onLoadMoreClickedCallback: () => void; // On load more
}

/**
 * Folder list that renders folders supplied to it and their children. This is responsible to render
 * the expanded state of any folder hierarchy
 */
export default observer(function MailFolderList(props: MailFolderListProps) {
    const {
        childFolderIds,
        hasMoreData,
        isFavoritesSupported,
        onLoadMoreClickedCallback,
        renderFolderNode,
        rootNodeId,
        rootFolderId,
        shouldShowLoadingSpinner,
        treeType,
        mailboxInfo,
        renderLoadNode,
    } = props;

    const onContextMenu = React.useCallback(
        (
            evt: React.MouseEvent<HTMLElement>,
            folderId: string,
            distinguishedFolderParentIds: string[]
        ) => {
            showFolderTreeContextMenu(
                folderId,
                FolderForestNodeType.Folder,
                folderId,
                getAnchorForContextMenu(evt),
                treeType,
                rootNodeId,
                false /* showRootNodeMenu */,
                distinguishedFolderParentIds
            );
        },
        [treeType]
    );

    const renderAddNewNode = (
        folderId: string,
        treeType: FolderForestTreeType,
        nestDepth: number
    ): JSX.Element => {
        return (
            <FolderOperationNode
                folderId={folderId}
                treeType={treeType}
                nestDepth={nestDepth}
                operationType={'newNode'}
                mailboxInfo={mailboxInfo}
            />
        );
    };

    let shouldRenderSubTree = props.childFolderIds && props.childFolderIds.length > 0;

    return (
        <>
            {shouldRenderSubTree && (
                <MailFolderNodeChildren
                    folderIdsToRender={childFolderIds}
                    nestDepth={1} // Increase depth when rendering root's children
                    treeType={treeType}
                    isFavoritesSupported={isFavoritesSupported}
                    onContextMenu={onContextMenu}
                    renderFolderNode={renderFolderNode}
                    distinguishedFolderParentIds={[rootNodeId]}
                />
            )}

            {renderLoadNode?.()}

            {/* Spinner will be shown for initial load and load more scenarios */}
            {!renderLoadNode && shouldShowLoadingSpinner && <Spinner size={SpinnerSize.medium} />}

            {/* Render LoadMore if hasMoreData and it is not loading */}
            {!renderLoadNode &&
                hasMoreData &&
                !shouldShowLoadingSpinner &&
                onLoadMoreClickedCallback && (
                    <LoadMoreFolderNode onLoadMoreClickedCallback={onLoadMoreClickedCallback} />
                )}

            {/* Add new folder node at the end of the tree.*/}
            {rootFolderId && renderAddNewNode(rootFolderId, treeType, 0 /* nestDepth */)}

            {/* Initialize public folder picker */}
            {<LazyPublicFolderPicker />}
        </>
    );
});
