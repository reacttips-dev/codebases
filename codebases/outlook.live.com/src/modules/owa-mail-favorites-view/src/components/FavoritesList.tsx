import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import {
    addFavoriteLabel,
    newFavoritePickedText,
    renameFavoriteLabel,
} from './FavoritesList.locstring.json';
import loc, { format } from 'owa-localize';
import FavoriteNode from './FavoriteNode';
import { logUsage } from 'owa-analytics';
import { getStore as getSharedFavoritesStore } from 'owa-favorites';
import { FavoritesPicker } from 'owa-mail-favorites-picker';
import { FavoriteNodeContextMenu } from '../index';
import { setContextMenuState } from 'owa-mail-favorites-store/lib/actions/favoritesContextMenu';
import {
    showFindFavoritesPicker,
    getStore as getMailFavoritesStore,
} from 'owa-mail-favorites-store';
import folderStore, { getEffectiveFolderDisplayName, getFolderTable } from 'owa-folders';
import { FAVORITE_FOLDERS_TREE_TYPE } from 'owa-folders-constants';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import { isFeatureEnabled } from 'owa-feature-flags';
import FavoriteNodeV2 from './roaming/FavoriteNodeV2';
import { FavoriteFolderData, FolderForestNodeType } from 'owa-favorites-types';
import { default as viewStateStore } from 'owa-mail-folder-store/lib/store/store';
import { getDensityModeString } from 'owa-fabric-theme';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';
import { getMailboxInfoFromFolderId } from 'owa-mail-mailboxinfo';
import { FolderOperationNode } from 'owa-mail-folder-view';

import styles from 'owa-tree-node/lib/components/NodeHeight.scss';
import classnamesBind from 'classnames/bind';
let classNames = classnamesBind.bind(styles);

export default observer(function FavoritesList(props: any) {
    const [favoriteUpdateText, setFavoriteUpdateText] = React.useState<string>('');
    const favoritesStore = useComputed(() => {
        return getSharedFavoritesStore();
    });

    const renderOutlookFavorites = (): JSX.Element[] => {
        return favoritesStore.get().orderedOutlookFavoritesIds.map(favoriteId => {
            const folderTextFieldViewState = viewStateStore.folderTextFieldViewState;
            if (
                folderTextFieldViewState &&
                folderTextFieldViewState.folderId == favoriteId &&
                folderTextFieldViewState.folderNodeType === FAVORITE_FOLDERS_TREE_TYPE
            ) {
                const folderId = (favoritesStore
                    .get()
                    .outlookFavorites.get(favoriteId) as FavoriteFolderData).folderId;
                const currentFolderName = getEffectiveFolderDisplayName(
                    getFolderTable().get(folderId)
                );
                return (
                    <FolderOperationNode
                        key="favoriteTextField"
                        folderId={folderId}
                        treeType={FAVORITE_FOLDERS_TREE_TYPE}
                        nestDepth={0}
                        operationType={'rename'}
                        originalValue={currentFolderName}
                        mailboxInfo={getMailboxInfoFromFolderId(folderId)}
                        ariaAnnouncementLabel={renameFavoriteLabel}
                    />
                );
            }
            return <FavoriteNodeV2 key={favoriteId} favoriteId={favoriteId} />;
        });
    };
    const renderFavoriteNodes = (): JSX.Element[] => {
        return favoritesStore.get().orderedFavoritesNodeIds.map(nodeId => {
            return <FavoriteNode key={nodeId} favoriteId={nodeId} />;
        });
    };
    const renderFindFavoritesComponents = (): JSX.Element[] => {
        return [renderAddNewFavoriteNode(), renderFavoritesPicker()];
    };
    const renderFavoritesPicker = (): JSX.Element => {
        if (getMailFavoritesStore().mailFavoritesViewState.shouldShowFindFavoritesPicker) {
            return (
                <div className={classNames(getDensityModeString(), styles.nodeHeight)}>
                    <FavoritesPicker onItemSelected={onItemSelected} />
                </div>
            );
        }
        return null;
    };
    const onItemSelected = (displayName: string) => {
        setFavoriteUpdateText(format(loc(newFavoritePickedText), displayName));
    };
    const isShowingFavoriteStar = isFeatureEnabled('acct-favoritestar');
    return (
        <>
            <div className={isShowingFavoriteStar ? styles.monarchFavoriteList : undefined}>
                {isFeatureEnabled('tri-favorites-roaming')
                    ? renderOutlookFavorites()
                    : renderFavoriteNodes()}
                {renderContextMenuIfOpen()}
            </div>
            {!isShowingFavoriteStar && renderFindFavoritesComponents()}
            <span className="screenReaderOnly" aria-live="assertive" aria-atomic="true">
                {favoriteUpdateText}
            </span>
        </>
    );
});

function onContextMenuDismissed() {
    setContextMenuState(null);
}

function onNewFavoriteNodeClicked(evt: React.MouseEvent<unknown> | KeyboardEvent) {
    showFindFavoritesPicker(true /* shouldShow */);
    logUsage('FindFavoritesClicked');
}

function renderContextMenuIfOpen(): JSX.Element {
    const contextMenuState = getMailFavoritesStore().mailFavoritesViewState.contextMenuState;
    // Render the context menu if it is set to be visible
    if (!contextMenuState) {
        return null;
    }

    let folder;
    if (contextMenuState.nodeType == FolderForestNodeType.PublicFolder) {
        folder = publicFolderFavoriteStore.folderTable.get(contextMenuState.folderId);
    } else {
        folder = folderStore.folderTable.get(contextMenuState.folderId);
    }

    return (
        <FavoriteNodeContextMenu
            anchorPoint={contextMenuState.anchor}
            nodeId={contextMenuState.nodeId}
            nodeType={contextMenuState.nodeType}
            folder={folder}
            onDismiss={onContextMenuDismissed}
        />
    );
}

function renderAddNewFavoriteNode(): JSX.Element {
    // Render a TreeNode with empty text if we're showing the picker.
    // This is because we want to preserve the same space as the original 'New favorite' node
    // so that the UI doesn't jump, and blank out the text so it doesn't temporarily show while the
    // picker animates in.
    if (getMailFavoritesStore().mailFavoritesViewState.shouldShowFindFavoritesPicker) {
        return null;
    }
    return (
        <TreeNode
            displayName={loc(addFavoriteLabel)}
            isCustomActionNode={true}
            isRootNode={false}
            key={'newFavorite'}
            onClick={onNewFavoriteNodeClicked}
        />
    );
}
