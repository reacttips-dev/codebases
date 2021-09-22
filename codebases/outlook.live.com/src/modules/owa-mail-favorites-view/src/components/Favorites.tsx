import { observer } from 'mobx-react-lite';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { getUserMailboxInfo } from 'owa-client-ids';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import loc, { format } from 'owa-localize';
import {
    favoritesHeaderText,
    favoritesWithAccountNameHeaderText,
} from 'owa-locstrings/lib/strings/favoritesheadertext.locstring.json';
import getProfileStore from 'owa-mail-account-store/lib/store/profileStore';
import { lazyToggleFavoritesTreeExpansion } from 'owa-mail-favorites-store';
import type { FolderTextFieldViewState } from 'owa-mail-folder-store/lib/store/schema/FolderTextFieldViewState';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import FavoritesList from './FavoritesList';

export interface FavoritesProps extends React.HTMLProps<HTMLDivElement> {
    withContextMenuFolderId?: string;
    folderTextFieldViewState?: FolderTextFieldViewState;
    setSize: number;
    positionInSet: number;
}

export default observer(function Favorites(props: FavoritesProps) {
    const ariaProps: AriaProperties = {
        role: AriaRoles.tree,
    };
    const isFavoritesTreeExpanded = !getUserConfiguration().UserOptions
        .IsFavoritesFolderTreeCollapsed;
    const accountSources = getProfileStore().accountSources;
    return (
        <div
            style={props.style}
            className={props.className}
            {...generateDomPropertiesForAria(ariaProps)}>
            {renderFavoriteRoot(
                isFavoritesTreeExpanded,
                accountSources.length,
                props.setSize,
                props.positionInSet
            )}
            {isFavoritesTreeExpanded && renderFavoritesList()}
        </div>
    );
});

function onClick(evt: React.MouseEvent<unknown>) {
    evt.stopPropagation();
    lazyToggleFavoritesTreeExpansion.importAndExecute();
}

// We disable the context menu on the root.
function onRootNodeContextMenu(evt: React.MouseEvent<unknown>) {
    evt.preventDefault();
}

function renderFavoritesList(): JSX.Element {
    return <FavoritesList key="favoriteFolderList" />;
}

function renderFavoriteRoot(
    isFavoritesTreeExpanded: boolean,
    numOfAccounts: number,
    setSize?: number,
    positionInSet?: number
): JSX.Element {
    const displayName =
        numOfAccounts > 1 &&
        isFeatureEnabled('nh-boot-acctmonaccounts') &&
        isHostAppFeatureEnabled('acctmonaccounts')
            ? format(
                  loc(favoritesWithAccountNameHeaderText),
                  getUserMailboxInfo().mailboxSmtpAddress
              )
            : loc(favoritesHeaderText);

    // We cannot use orderedFavoritesNodeIds here, because user might delete favorites on other client and the list hasn't been updated.
    // favoritesFolderNodes and favoritesPersonaNodes are the filtered nodes which represent the nodes that we could show.
    return (
        <TreeNode
            chevronProps={{ isExpanded: isFavoritesTreeExpanded, onClick: onClick }}
            displayName={displayName}
            depth={0}
            isRootNode={true}
            isSelected={false}
            key="favoritesRoot"
            onClick={onClick}
            onContextMenu={onRootNodeContextMenu}
            setSize={setSize}
            positionInSet={positionInSet}
        />
    );
}
