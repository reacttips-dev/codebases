import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import classnamesBind from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { isGroupsEnabled } from 'owa-account-capabilities/lib/isGroupsEnabled';
import Droppable from 'owa-dnd/lib/components/Droppable';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { getDensityModeString } from 'owa-fabric-theme';
import { favoritesStore } from 'owa-favorites';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getArchiveFolderTreeRootFolder } from 'owa-folders';
import { GroupListTree } from 'owa-group-left-nav-mail';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import loc from 'owa-localize';
import { navigationPaneScreenReaderOnlyText } from 'owa-locstrings/lib/strings/navigationpanescreenreaderonlytext.locstring.json';
import { AccountsTreeView } from 'owa-mail-accounts-view';
import { Favorites } from 'owa-mail-favorites-view';
import { AttachmentFilesTree } from 'owa-mail-files-view';
import setIsDraggedOverState from 'owa-mail-folder-store/lib/actions/setIsDraggedOverState';
import type { FolderTextFieldViewState } from 'owa-mail-folder-store/lib/store/schema/FolderTextFieldViewState';
import { default as viewStateStore } from 'owa-mail-folder-store/lib/store/store';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getSharedFolderUserEmails } from 'owa-shared-folder/lib/selectors/getSharedFolderUserEmails';
import { useStrategy } from 'owa-strategies';
import { isBrowserEdge, isBrowserIE } from 'owa-user-agent/lib/userAgent';
import * as React from 'react';
import styles from './FolderPane.scss';
import FolderPaneToggleButton from './FolderPaneToggleButton';
import type { FolderViewStrategyProps } from './FolderViewStrategyProps';

const classNames = classnamesBind.bind(styles);

export interface FolderPaneProps {
    withContextMenuFolderId?: string | null;
    folderTextFieldViewState?: FolderTextFieldViewState | null;
    isDraggedOver?: boolean;
}

export default observer(function FolderPane(props: FolderPaneProps) {
    props = {
        withContextMenuFolderId: viewStateStore.withContextMenuFolderId,
        folderTextFieldViewState: viewStateStore.folderTextFieldViewState,
        isDraggedOver: viewStateStore.isDraggedOver,
        ...props,
    };
    const isIEOrEdge = React.useRef(isBrowserEdge() || isBrowserIE());
    const isFirefox = React.useRef(navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
    const { withContextMenuFolderId, folderTextFieldViewState } = props;
    const containerClassNames = classNames(
        styles.container,
        isFeatureEnabled('mon-densities') && getDensityModeString(),
        isIEOrEdge.current && styles.isIEOrEdge, // handle auto hiding overlay scrollbar in IE using -ms-autohiding-scrollbar
        isFirefox.current && styles.isFirefox, // show persistent scrollbar in Firefox since it does not support overlay scrollbar
        props.isDraggedOver ? styles.showScrollbar : styles.hideScrollbar, // show auto hiding scrollbar on hover
        !!withContextMenuFolderId && styles.withContextMenuOpen, // show the scrollbar:auto if context menu is open
        !!folderTextFieldViewState && styles.withNewFolderTextField, // do not show the scrollbar if we have a new text field
        'customScrollBar',
        'disableTextSelection'
    );

    const MailFolderTreesParentContainer = useStrategy<FolderViewStrategyProps>('folderView')!;

    /* TODO: OW:16444: [Accessibility] [Folder] We should be able to tab into the regular Folder tree even if the Favorites tree exists */
    return (
        <FocusZone
            key="folderPane"
            className={containerClassNames}
            direction={FocusZoneDirection.vertical}>
            {renderFolderForest(MailFolderTreesParentContainer!)}
        </FocusZone>
    );
});

function onDragOver(dragInfo: DragData) {
    setIsDraggedOverState(true);
}

function onDragLeave(dragInfo: DragData) {
    setIsDraggedOverState(false);
}

function onDrop(dragInfo: DragData) {
    // NOOP
}

function shouldShowFavoriteList(): boolean {
    let numOfFavoriteFolders;
    let numOfFavoritePersonas;
    let numOfFavoriteGroups;
    let numOfFavoriteSearches;
    let numOfFavoriteCategories;
    let numOfFavoritePublicFolders;
    if (isFeatureEnabled('tri-favorites-roaming')) {
        // When using the heterogeneous favorites API, show the favorites header when
        // there is any favorite folder or group to show
        return favoritesStore.outlookFavorites.size > 0;
    } else {
        numOfFavoriteFolders = favoritesStore.favoritesFolderNodes.size;
        numOfFavoritePersonas = favoritesStore.favoritesPersonaNodes.size;
        numOfFavoriteGroups = 0;
        numOfFavoriteSearches = isFeatureEnabled('tri-favoriteSearch')
            ? favoritesStore.favoriteSearches.size
            : 0;
        numOfFavoriteCategories = favoritesStore.favoriteCategories.size;
        numOfFavoritePublicFolders = 0;
    }
    return (
        numOfFavoriteFolders +
            numOfFavoritePersonas +
            numOfFavoriteGroups +
            numOfFavoriteSearches +
            numOfFavoriteCategories +
            numOfFavoritePublicFolders >
        0
    );
}

function renderFolderForest(
    MailFolderTreesParentContainer: React.FC<FolderViewStrategyProps>
): JSX.Element {
    let positionInSet = 0;
    const showAccountsList =
        isFeatureEnabled('nh-boot-acctmonaccounts') && isHostAppFeatureEnabled('acctmonaccounts');
    const showGroupList = isGroupsEnabled() && !showAccountsList;
    const showFavoriteList = shouldShowFavoriteList();
    const showFilesList =
        isFeatureEnabled('woven-filesTreeFilesHubTemplate') ||
        isFeatureEnabled('woven-filesTreeFilesHubCollapseFixed') ||
        isFeatureEnabled('woven-fileshub-templatesAndOneDrive') ||
        isFeatureEnabled('woven-fileshub-templates');

    const setSize = getSetSize([!!showGroupList, showFilesList, showFavoriteList]);

    // Show the 'Folders' header when either favorites or groups list is shown
    const isFavoriteOrGroupListShown = showFavoriteList || showGroupList;
    const emptyDropViewState = createDropViewState();
    // Must pass bypassActOnDrop as true so that children nodes' canDrop evaluation
    // is not masked by this component's canDrop, which is always true by default
    const bypassActOnDrop = true;
    const isCollapsibleFolderPane = isFeatureEnabled('mon-tri-collapsibleFolderPane');

    return (
        <Droppable
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            dropViewState={emptyDropViewState}
            greedy={true}
            bypassActOnDrop={bypassActOnDrop}>
            <span className="screenReaderOnly" role="heading" aria-level={2}>
                {loc(navigationPaneScreenReaderOnlyText)}
            </span>
            {isCollapsibleFolderPane && (
                <div className={styles.folderPaneToggleContainer}>
                    <FolderPaneToggleButton />
                </div>
            )}
            {showFavoriteList && (
                <Favorites
                    key="favorites"
                    className={classNames(
                        !isCollapsibleFolderPane && styles.leftNavSectionWithSectionHeaders
                    )}
                    setSize={setSize}
                    positionInSet={++positionInSet}
                />
            )}
            {showFilesList && (
                <AttachmentFilesTree
                    key="files"
                    className={styles.leftNavSectionWithSectionHeaders}
                    setSize={setSize}
                    positionInSet={++positionInSet}
                />
            )}
            {!showAccountsList && (
                <MailFolderTreesParentContainer
                    isFavoriteOrGroupListShown={!!isFavoriteOrGroupListShown}
                    leftNavStyleWithSectionHeaders={styles.leftNavSectionWithSectionHeaders}
                    leftNavStyleWithNoSectionHeaders={styles.leftNavSectionWithNoSectionHeaders}
                    setSize={setSize}
                    positionInSet={++positionInSet}
                />
            )}
            {showGroupList && (
                <GroupListTree
                    className={styles.leftNavSectionWithSectionHeaders}
                    setSize={setSize}
                    positionInSet={setSize} // since it is the last item and position in set is indexed by 1
                />
            )}
            {showAccountsList && (
                <AccountsTreeView
                    key="accounts"
                    className={styles.leftNavSectionWithSectionHeaders}
                />
            )}
        </Droppable>
    );
}

/**
 * Gets the amount of folders that will be displayed by retrieving which folder trees are shown.
 * @param treeConditions an array corresponding to whether the group,favorites and files trees are shown
 * @return The total amount of folder trees shown for the aria-size
 */
function getSetSize(treeConditions: boolean[]): number {
    let setSize = 1; // Primary "Folders" tree will always be shown

    for (let shouldShowTree of treeConditions) {
        shouldShowTree && setSize++;
    }

    if (!isConsumer()) {
        // Check if the shared folder tree will be displayed for SharedFolder Tree
        getSharedFolderUserEmails()?.length && setSize++;

        getArchiveFolderTreeRootFolder() != null && setSize++; // For ArchiveFolder Tree
    }

    return setSize;
}
