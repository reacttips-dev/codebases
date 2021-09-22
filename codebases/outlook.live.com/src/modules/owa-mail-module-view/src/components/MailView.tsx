import { observer } from 'mobx-react-lite';
import { readingPane, skipToMessage } from './MailView.locstring.json';
import loc from 'owa-localize';
import { isFeatureEnabled } from 'owa-feature-flags';
import { ListPane } from 'owa-mail-list-pane-view';
import {
    listViewStore,
    shouldSuppressServerMarkReadOnReplyOrForward,
    getIsSearchTableShown,
} from 'owa-mail-list-store';
import {
    lazySetListViewDimension,
    isReadingPanePositionBottom,
    isReadingPanePositionRight,
    shouldShowListView,
    shouldShowReadingPane,
    getListViewContainerStyles,
    getReadingPaneContainerStyles,
} from 'owa-mail-layout';
import ReadingPaneContainer from 'owa-mail-reading-pane-container/lib/components/ReadingPaneContainer';
import { NotificationBarHost } from 'owa-notification-bar';
import { lazyTriggerResizeEvent } from 'owa-resize-event';
import { ResizeHandle, ResizeHandleDirection } from 'owa-resize-handle';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { TabType, TabViewState } from 'owa-tab-store';
import { TabBar } from 'owa-tab-view';
import * as React from 'react';
import getMailListHeader from 'owa-mail-list-pane-view/lib/components/getMailListHeader';
import getStyleSelectorAsPerUserSettings from 'owa-mail-list-view/lib/utils/getStyleSelectorAsPerUserSettings';
import { SkipLinkRegion } from 'owa-skip-link/lib/components/SkipLinkRegion';
import { NotesPane } from 'owa-notes-components';
import folderStore from 'owa-folders';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { MailHotkeysMap } from 'owa-mail-hotkeys';
import { shouldShowSinglePersonaHeader } from 'owa-mail-list-pane-view/lib/selectors/shouldShowSinglePersonaHeader';
import { shouldShowMultiPersonaHeader } from 'owa-mail-list-pane-view/lib/selectors/shouldShowMultiPersonaHeader';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { MailPersonaSearchResultsHeader } from 'owa-mail-list-view';
import { isGetStartedUser } from 'owa-session-store/lib/utils/isGetStartedUser';
import { GetStartedPaneInMailView } from 'owa-getstarted';
import isInteractiveFiltersEnabled from 'owa-mail-search/lib/utils/isInteractiveFiltersEnabled';

import classNames from 'classnames';
import styles from './MailModule.scss';

export interface Props {
    activeTab: TabViewState;
    isDumpsterOrDumpsterSearchTable: boolean;
}

export default observer(function MailView(props: Props) {
    const { activeTab, isDumpsterOrDumpsterSearchTable } = props;
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId);
    const styleSelectorAsPerUserSettings = getStyleSelectorAsPerUserSettings(tableViewId);
    const isRPPositionRight = isReadingPanePositionRight();
    const isRPPositionBottom = isReadingPanePositionBottom();
    let showReadingPane = shouldShowReadingPane();
    let showListPane = shouldShowListView();
    // Adjust list view & reading pane state for tab view
    if (activeTab && !isDumpsterOrDumpsterSearchTable) {
        if (isRPPositionBottom) {
            // When reading pane is on bottom and current tab is full compose, we need to hide list view
            // to give compose enough space.
            // Here we only check TabType.MailCompose. There are still 2 cases that compose can be show but
            // we don't check them here, because:
            // 1. current tab is Primary tab and we have primary compose. This happens when user is open
            // draft items folder. In that case we still show list view otherwise user can never see list
            // view of draft folder.
            // 2. inline compose. This should never happen when reading pane is on bottom.
            showListPane = showListPane && activeTab.type != TabType.MailCompose;
        } else if (!isRPPositionRight) {
            // When reading pane is off, need to adjust reading pane/list view according to current tab type
            // When active tab is primary tab, show reading pane/list view according to the setting in mailStore
            // Otherwise, always show reading pane since reading pane is the container for all other tabs
            showReadingPane = activeTab.type != TabType.Primary || shouldShowReadingPane();
            showListPane = activeTab.type == TabType.Primary && shouldShowListView();
        }
    }
    const showTabBarInListView =
        showListPane && !showReadingPane && !isDumpsterOrDumpsterSearchTable;
    const showTabBarInReadingPane = !showTabBarInListView && !isDumpsterOrDumpsterSearchTable;
    const mailListClasses = classNames(
        isRPPositionRight ? styles.mailList : styles.mailListSLV,
        !showListPane && styles.mailListHide,
        isRPPositionBottom && styles.mailListBottomBorder,
        getListViewContainerStyles()
    );
    const subCommandBarPaneClasses = classNames(
        isRPPositionBottom ? styles.subCommandBarPaneColumn : styles.subCommandBarPaneRow,
        styles.subCommandBarPaneCommon,
        styles.subCommandBarPaneMail
    );
    const showNotificationBar = !isRPPositionRight;
    const isSearchTable = getIsSearchTableShown();
    const showPersonaHeader =
        shouldShowSinglePersonaHeader(isSearchTable, tableView?.id, getSelectedNode()) ||
        shouldShowMultiPersonaHeader(isSearchTable, tableView?.id, getSelectedNode());
    const showInteractiveFilterExtendedHeader =
        isInteractiveFiltersEnabled() && isSearchTable && !showPersonaHeader;
    const showPersonaSearchExtendedHeader =
        isInteractiveFiltersEnabled() &&
        isSearchTable &&
        showPersonaHeader &&
        !getSelectedNode().id;
    const shouldShowHeader = showInteractiveFilterExtendedHeader && isRPPositionRight;
    const isNotesFolder = tableView?.tableQuery.folderId === folderNameToId('notes');
    const sourceFolder = tableView && folderStore.folderTable.get(tableView.tableQuery.folderId);

    if (
        !!sourceFolder &&
        folderIdToName(sourceFolder.FolderId.Id) == 'notes' &&
        isFeatureEnabled('notes-folder-view')
    ) {
        if (window.performance) {
            window.performance.mark('StartStickyNotesSDKLoad');
        }
        return (
            <NotesPane
                scenario="NotesFolder"
                header={getMailListHeader(tableViewId, styles.notesHeader)}
            />
        );
    }

    return (
        <div className={styles.rightPane}>
            {isGetStartedUser() && <GetStartedPaneInMailView />}
            {shouldShowHeader && getMailListHeader(tableViewId, styleSelectorAsPerUserSettings)}
            {showPersonaSearchExtendedHeader && (
                <MailPersonaSearchResultsHeader
                    tableView={tableView}
                    hideFilter={true}
                    showInteractiveFilters={true}
                    hideCheckAll={false}
                    styleSelectorAsPerUserSettings={styleSelectorAsPerUserSettings}
                />
            )}
            <div className={subCommandBarPaneClasses}>
                <ListPane
                    className={mailListClasses}
                    tableViewId={tableViewId}
                    shouldShowHeader={shouldShowHeader}
                    tabBar={showTabBarInListView ? <TabBar /> : null}
                    styleSelectorAsPerUserSettings={styleSelectorAsPerUserSettings}
                />
                {showReadingPane && showListPane && (
                    <ResizeHandle
                        direction={
                            isRPPositionBottom
                                ? ResizeHandleDirection.horizontal
                                : ResizeHandleDirection.vertical
                        }
                        onResize={onRightPaneResize}
                    />
                )}
                {showReadingPane && (
                    <SkipLinkRegion
                        skipLinkName={loc(skipToMessage)}
                        role="complementary"
                        regionName={loc(readingPane)}
                        className={classNames(styles.readingPane, getReadingPaneContainerStyles())}>
                        <ReadingPaneContainer
                            isDumpsterOrDumpsterSearchTable={isDumpsterOrDumpsterSearchTable}
                            suppressServerMarkReadOnReplyOrForward={shouldSuppressServerMarkReadOnReplyOrForward(
                                tableView
                            )}
                            isNotesFolder={isNotesFolder}
                        />
                        {showTabBarInReadingPane && <TabBar />}
                    </SkipLinkRegion>
                )}
                {showNotificationBar && (
                    <NotificationBarHost
                        hostId={'MailModuleNotificationBarHost'}
                        onNotificationBlur={lazyResetFocus.importAndExecute}
                    />
                )}
            </div>
            <MailHotkeysMap />
        </div>
    );
});

function onRightPaneResize(listViewDimension: number, readingPaneDimension: number) {
    const isWidth = isReadingPanePositionRight();
    lazySetListViewDimension.importAndExecute(listViewDimension, isWidth);
    lazyTriggerResizeEvent.importAndExecute();
}
