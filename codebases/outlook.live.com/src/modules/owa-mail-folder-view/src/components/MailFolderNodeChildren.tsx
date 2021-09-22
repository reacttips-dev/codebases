import { observer } from 'mobx-react-lite';
import type { FolderForestTreeType } from 'owa-graph-schema';
import * as React from 'react';
import type { RenderFolderNodeFunc } from './MailFolderNodeTreeProps';

interface MailFolderNodeChildrenProps {
    nestDepth: number;
    folderIdsToRender: string[];
    treeType: FolderForestTreeType;
    distinguishedFolderParentIds?: string[];
    isFavoritesSupported?: boolean;
    isRootExpanded?: boolean;

    renderFolderNode: RenderFolderNodeFunc;
    onContextMenu?: (
        evt: React.MouseEvent<unknown>,
        folderId: string,
        distinguishedFolderParentIds: string[]
    ) => void;
}

/**
 * Component responsible for rendering the nested folder tree
 */
export default observer(function MailFolderNodeChildren(props: MailFolderNodeChildrenProps) {
    const {
        distinguishedFolderParentIds,
        folderIdsToRender,
        isFavoritesSupported,
        isRootExpanded,
        nestDepth,
        onContextMenu,
        renderFolderNode,
        treeType,
    } = props;

    const renderChildren = (folderIdsToRender: string[], nestDepth: number): JSX.Element[] => {
        const renderedNodes: JSX.Element[] = [];
        if (nestDepth == 0) {
            if (isRootExpanded) {
                const renderedChildNodes = renderChildren(folderIdsToRender, nestDepth + 1);
                Array.prototype.push.apply(renderedNodes, renderedChildNodes);
            }
        } else {
            folderIdsToRender.forEach(folderId => {
                const folderNode = renderFolderNode(
                    folderId,
                    nestDepth,
                    treeType,
                    isFavoritesSupported,
                    onContextMenu,
                    distinguishedFolderParentIds
                );

                if (folderNode) {
                    renderedNodes.push(folderNode);
                }
            });
        }

        return renderedNodes;
    };

    return <>{renderChildren(folderIdsToRender, nestDepth)}</>;
});
