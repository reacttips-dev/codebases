import { observer } from 'mobx-react-lite';
import { getEffectiveFolderDisplayName, getFolderTable } from 'owa-folders';
import getFolderViewStateFromId from 'owa-mail-folder-store/lib/selectors/getFolderViewStateFromId';
import * as React from 'react';
import {
    MailFolderNode,
    MailFolderNodeChildren,
    MailFolderNodeTreeProps,
} from 'owa-mail-folder-view';
import { getMailboxInfoFromFolderId } from 'owa-mail-mailboxinfo';

/**
 * Component responsible for rendering the Node and then its children
 */
export default observer(function MailFolderNodeTree(props: MailFolderNodeTreeProps) {
    const renderNodeSubTree = (): JSX.Element => {
        const {
            folderId,
            isFavoritesSupported,
            nestDepth,
            onContextMenu,
            treeType,
            moveFolder,
        } = props;

        const folder = getFolderTable().get(folderId);
        if (!folder) {
            return null;
        }

        /**
         * Add child nodes of this node if the node is expanded
         */
        const viewState = getFolderViewStateFromId(folderId);
        const hasChildFolders = folder.childFolderIds && folder.childFolderIds.length > 0;
        const shouldRenderSubTree = viewState.isExpanded && hasChildFolders;
        const effectiveFolderDisplayName = getEffectiveFolderDisplayName(folder);

        return (
            <>
                {/* Render folder node tree*/}
                <MailFolderNode
                    key={folderId}
                    depth={nestDepth}
                    folderId={folderId}
                    isBeingDragged={viewState.drag.isBeingDragged}
                    onContextMenu={onContextMenu}
                    shouldHideToggleFavorite={!isFavoritesSupported}
                    treeType={treeType}
                    folder={folder}
                    isFolderExpandable={hasChildFolders}
                    effectiveFolderDisplayName={effectiveFolderDisplayName}
                    mailboxInfo={folder.mailboxInfo ?? getMailboxInfoFromFolderId(folderId)}
                    moveFolder={moveFolder}
                />

                {/* Render sub node tree*/}
                {shouldRenderSubTree && (
                    <MailFolderNodeChildren
                        key={folderId + 'MailFolderNodeChildren'}
                        folderIdsToRender={folder.childFolderIds}
                        nestDepth={nestDepth + 1}
                        treeType={treeType}
                        isFavoritesSupported={isFavoritesSupported}
                        onContextMenu={onContextMenu}
                        renderFolderNode={props.renderFolderNode}
                    />
                )}
            </>
        );
    };

    return <>{renderNodeSubTree()}</>;
});
