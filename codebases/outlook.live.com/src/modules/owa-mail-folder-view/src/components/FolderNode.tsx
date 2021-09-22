import { paused } from './FolderNode.locstring.json';
import loc from 'owa-localize';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { shallowCompare } from '@fluentui/react/lib/Utilities';
import { selectFolder, lazyToggleFavoriteFolder } from 'owa-mail-folder-forest-actions';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import isArchiveFolder from 'owa-mail-folder-store/lib/utils/isArchiveFolder';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import type { MailFolder, FolderForestTreeType } from 'owa-graph-schema';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';
import { isFolderInFavorites } from 'owa-favorites';

import TreeNode, { ChevronProps } from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import { default as viewStateStore } from 'owa-mail-folder-store/lib/store/store';

import { FolderForestNodeType } from 'owa-favorites-types';
import { isFolderPaused } from 'owa-mail-list-store';
import { touchHandler, ITouchHandlerParams } from 'owa-touch-handler';
import { BulkActionSpinner, isBulkActionRunning } from 'owa-bulk-action-store';
import { UnreadReadCountBadge } from 'owa-unreadread-count-badge';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

// Folders that should show total count instead of unread count
const FOLDERS_TO_SHOW_TOTALCOUNT: DistinguishedFolderIdName[] = [
    'drafts',
    'junkemail',
    'outbox',
    'notes',
    'scheduled',
];

export interface FolderNodeProps extends React.HTMLProps<HTMLDivElement> {
    displayName: string;
    folderId: string;
    treeType: FolderForestTreeType;
    distinguishedFolderId: string;
    totalCount: number;
    unreadCount: number;

    // Optional parameters
    chevronProps?: ChevronProps;
    customIcon?: string;
    depth?: number; // root is 0, every sub node increase this number by 1.
    isBeingDragged?: boolean;
    isDroppedOver?: boolean;
    onContextMenu?: (evt: React.MouseEvent<unknown>, folder?: MailFolder) => void;
    showHoverStateOnDroppedOver?: boolean;
    shouldHideToggleFavorite?: boolean;
    isPublicFolder?: boolean;
}

@observer
export default class FolderNode extends React.Component<FolderNodeProps, {}> {
    @computed
    get isSelected(): boolean {
        const selectedNode = getSelectedNode();
        return (
            this.props.treeType == selectedNode.treeType && this.props.folderId == selectedNode.id
        );
    }

    @computed
    get isWithContextMenuOpen(): boolean {
        return this.props.folderId == viewStateStore.withContextMenuFolderId;
    }

    shouldComponentUpdate(nextProps: FolderNodeProps, nextState: {}) {
        return !shallowCompare(this.props, nextProps);
    }

    @computed
    get touchHandler() {
        const touchHandlerParams: ITouchHandlerParams = {
            onLongPress: this.props.onContextMenu,
        };
        return touchHandler(touchHandlerParams);
    }

    render() {
        return (
            <TreeNode
                {...this.touchHandler}
                chevronProps={this.props.chevronProps}
                customIcon={this.props.customIcon}
                depth={this.props.depth}
                displayName={this.props.displayName}
                isBeingDragged={this.props.isBeingDragged}
                isDroppedOver={this.props.isDroppedOver}
                isRootNode={false}
                isSelected={this.isSelected}
                isWithContextMenuOpen={this.isWithContextMenuOpen}
                key={this.props.folderId}
                onKeyDown={this.onKeyDown}
                onClick={this.onClick}
                onContextMenu={this.props.onContextMenu}
                renderRightCharm={this.renderRightCharm}
                showAsHoverOnDroppedOver={this.props.showHoverStateOnDroppedOver}
                isFavorited={isFolderInFavorites(this.props.folderId)}
                toggleFavorite={this.toggleFavorite}
                isinSharedFolderTree={this.props.treeType == 'sharedFolderTree'}
            />
        );
    }

    private renderRightCharm = (): JSX.Element => {
        const { folderId } = this.props;

        if (isFolderPaused(folderId)) {
            return renderPausedIndicator();
        }

        if (isBulkActionRunning(folderId)) {
            return <BulkActionSpinner folderId={folderId} folderName={this.props.displayName} />;
        }

        if (!isArchiveFolder(folderId) || isHostAppFeatureEnabled('showArchiveUnreadCount')) {
            return this.renderUnreadOrTotalCount();
        }

        return null;
    };

    private renderUnreadOrTotalCount = (): JSX.Element => {
        const shouldDisplayTotalCount =
            FOLDERS_TO_SHOW_TOTALCOUNT.indexOf(
                this.props.distinguishedFolderId as DistinguishedFolderIdName
            ) >= 0 && this.props.totalCount > 0;
        let count = shouldDisplayTotalCount ? this.props.totalCount : this.props.unreadCount;
        count = count == 0 ? null : count; // We do not display the number 0;
        return (
            <UnreadReadCountBadge
                count={count}
                shouldDisplayTotalCount={shouldDisplayTotalCount}
                isSelected={this.isSelected}
            />
        );
    };

    private onClick = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        selectFolder(
            this.props.folderId,
            this.props.treeType,
            'FolderNodeClick' /* actionSource */,
            this.props.isPublicFolder
                ? FolderForestNodeType.PublicFolder
                : FolderForestNodeType.Folder
        );
    };

    private onKeyDown = (evt: React.KeyboardEvent<unknown>) => {
        switch (evt.keyCode) {
            case KeyboardCharCodes.Enter:
            case KeyboardCharCodes.Space:
                evt.stopPropagation();

                // explicity cancelling event so click won't fire after this in case when folder pane is opened as overlay.
                // only stopPropagation is not enough
                evt.preventDefault();
                selectFolder(
                    this.props.folderId,
                    this.props.treeType,
                    'Keyboard' /* actionSource */
                );
                break;
        }
    };

    private toggleFavorite = () => {
        const isFavorite = isFolderInFavorites(this.props.folderId);
        lazyToggleFavoriteFolder.importAndExecute(this.props.folderId, isFavorite, 'ContextFolder');
    };
}

function renderPausedIndicator(): JSX.Element {
    return <>{loc(paused)}</>;
}
