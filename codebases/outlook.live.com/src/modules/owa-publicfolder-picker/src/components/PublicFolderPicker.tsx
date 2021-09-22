import { observer } from 'mobx-react-lite';
import {
    addToFavoritesButtonText,
    allPublicFoldersDisplayName,
    closeButton_0,
} from './PublicFolderPicker.locstring.json';
import loc from 'owa-localize';
/* tslint:disable:jsx-no-lambda WI:47728 */
import * as React from 'react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { ControlIcons } from 'owa-control-icons';
import publicFolderPickerStore from '../store/publicFolderPickerStore';
import type { PublicFolder } from '../store/publicFolderTable';
import { publicFolderPickerController } from '../actions/updatePublicFolderPickerProps';
import TreeNode, { ChevronProps } from 'owa-tree-node/lib/components/TreeNode';
import PublicFolderNode from '../components/PublicFolderNode';
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import addPublicFolderToFavorites from '../actions/addPublicFolderToFavorites';
import { PublicFolderPickerHeader } from '../components/PublicFolderPickerHeader';
import { togglePublicFolderNodeExpansion } from '../actions/updatePublicFolder';
import { clearPublicFolderTable } from '../actions/updatePublicFolderTable';
import { PublicFolderErrorDialog } from '../components/PublicFolderErrorDialog';

import getPublicFolderFromFolderId from '../selectors/getPublicFolderFromFolderId';
import getRootPublicFolder from '../selectors/getRootPublicFolder';

import styles from './styles/PublicFolderPicker.scss';

export default observer(function PublicFolderPicker(props: {}) {
    const renderChildFolders = (renderedFolderIds: string[], nestDepth: number) => {
        const renderedNodes: JSX.Element[] = [];
        if (nestDepth == 0) {
            const isRootFolderExpanded = getRootPublicFolder().isExpanded;
            if (isRootFolderExpanded) {
                // Recursively add subfolders
                const renderedChildNodes = renderChildFolders(renderedFolderIds, nestDepth + 2);
                Array.prototype.push.apply(renderedNodes, renderedChildNodes);
            }
        } else {
            renderedFolderIds.forEach(folderId => {
                const folder = getPublicFolderFromFolderId(folderId);
                renderedNodes.push(renderFolderNode(folder, nestDepth));
                if (
                    folder.isExpanded &&
                    folder.childFolderIds &&
                    folder.childFolderIds.length > 0
                ) {
                    const renderedChildNodes = renderChildFolders(
                        folder.childFolderIds,
                        nestDepth + 1
                    );
                    Array.prototype.push.apply(renderedNodes, renderedChildNodes);
                }
            });
        }
        return renderedNodes;
    };
    const rootFolder = getRootPublicFolder();
    const childFolderIds = getChildFolders(rootFolder);
    return (
        <>
            <Panel
                isOpen={publicFolderPickerStore.showPanel}
                onDismiss={_closePanel}
                isLightDismiss={true}
                onLightDismissClick={_closePanel}
                isBlocking={false}
                type={PanelType.largeFixed}
                onRenderHeader={() => {
                    return <PublicFolderPickerHeader />;
                }}
                onRenderNavigation={() => {
                    return renderTopRibbon();
                }}>
                <div>
                    {publicFolderPickerStore.showPanel &&
                        rootFolder &&
                        renderFolderRoot(rootFolder)}
                    {publicFolderPickerStore.showPanel &&
                        childFolderIds.length > 0 &&
                        renderChildFolders(childFolderIds, 0)}
                </div>
            </Panel>
            <PublicFolderErrorDialog isHidden={!publicFolderPickerStore.showErrorDialog} />
        </>
    );
});

function onRootNodeChevronClicked(evt: React.MouseEvent<unknown> | KeyboardEvent) {
    evt.stopPropagation();
    togglePublicFolderNodeExpansion(getRootPublicFolder());
}

function addToFavorites(evt: React.MouseEvent<unknown> | KeyboardEvent) {
    if (publicFolderPickerStore.selectedFolderId != null) {
        addPublicFolderToFavorites(publicFolderPickerStore.selectedFolderId);
    }
}

function getChildFolders(rootFolder: PublicFolder) {
    const folderIds: string[] = [];
    if (rootFolder?.childFolderIds) {
        rootFolder.childFolderIds.map(childId => {
            const folder = getPublicFolderFromFolderId(childId);
            if (folder) {
                folderIds.push(folder.FolderId.Id);
            }
        });
    }
    return folderIds;
}

function renderFolderNode(folder: PublicFolder, nestDepth: number): JSX.Element {
    return (
        <PublicFolderNode
            depth={nestDepth}
            folderId={folder.FolderId.Id}
            key={folder.FolderId.Id}
        />
    );
}

function _closePanel() {
    publicFolderPickerController(false);
    clearPublicFolderTable();
}

function renderTopRibbon() {
    const favoriteIcon = ControlIcons.FavoriteStar;
    return (
        <>
            <ActionButton
                className={styles.addToFavoriteButton}
                onClick={addToFavorites}
                iconProps={{
                    iconName: favoriteIcon,
                }}>
                {loc(addToFavoritesButtonText)}
            </ActionButton>
            <IconButton
                className={styles.closeButton}
                disabled={false}
                checked={false}
                onClick={_closePanel}
                iconProps={{ iconName: ControlIcons.Cancel }}
                title={loc(closeButton_0)}
                ariaLabel={loc(closeButton_0)}
            />
        </>
    );
}

function renderFolderRoot(rootFolder: PublicFolder): JSX.Element {
    const chevronProps: ChevronProps = {
        isExpanded: rootFolder.isExpanded,
        onClick: onRootNodeChevronClicked,
    };
    const rootFolderId = rootFolder.FolderId.Id;
    return (
        <TreeNode
            chevronProps={chevronProps}
            depth={0}
            displayName={loc(allPublicFoldersDisplayName)}
            isRootNode={true}
            key={rootFolderId}
            onClick={chevronProps.onClick}
        />
    );
}
