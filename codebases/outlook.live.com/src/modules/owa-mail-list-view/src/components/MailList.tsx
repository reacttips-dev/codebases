import { observer } from 'mobx-react-lite';
import MailListContent from './MailListContent';
import { logUsage } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getNativeAdInitialPlacement, NativeAdPlacement } from 'owa-mail-ads-shared';
import { lazyClearFilter } from 'owa-mail-filter-actions';
import {
    registerComponent,
    resetFocus,
} from 'owa-mail-focus-manager/lib/mailModuleAutoFocusManager';
import { FocusComponent } from 'owa-mail-focus-manager';
import { hideMailItemContextMenu } from 'owa-mail-list-actions/lib/actions/itemContextMenuActions';
import { isFocusedInboxEnabled } from 'owa-mail-triage-common';
import { MailListItemContextMenu } from 'owa-mail-list-context-menu';
import { MailListEmptyState, MailListShimmerState } from 'owa-mail-list-empty-state';
import {
    listViewStore,
    TableView,
    getFocusedFilterForTable,
    TableQueryType,
} from 'owa-mail-list-store';
import type MailListItemContextMenuState from 'owa-mail-list-store/lib/store/schema/MailListItemContextMenuState';
import { messageAdListViewStatusStore } from 'owa-mail-messagead-list-store';
import { MailListViewState } from 'owa-mail-store/lib/store/schema/MailListViewState';
import { shouldShowListView, isReadingPanePositionOff, setShowReadingPane } from 'owa-mail-layout';
import { getMailListLoadStateFromTableView } from 'owa-mail-list-store/lib/utils/getMailListLoadState';
import { loadTableViewFromTableQuery } from 'owa-mail-table-loading-actions';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isGetStartedUser } from 'owa-session-store/lib/utils/isGetStartedUser';
import * as React from 'react';
import isAnswerFeatureEnabled from 'owa-mail-search/lib/utils/isAnswerFeatureEnabled';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import type { SearchTableQuery } from 'owa-mail-list-search';

import classNames from 'classnames';
import styles from './MailList.scss';

export interface MailListProps {
    itemContextMenuState?: MailListItemContextMenuState;
    tableViewId: string;
    styleSelectorAsPerUserSettings: string;
}

export default observer(function MailList(props: MailListProps) {
    props = {
        ...props,
        itemContextMenuState: props.itemContextMenuState ?? listViewStore.itemContextMenuState,
    };
    React.useEffect(() => {
        // Register the component with FocusManager.
        // This should NOT be moved to lazy, as we want the
        // focus to be delegated immediately upon mount and
        // can't afford to wait for the lazy import.
        // See https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/79563.
        const unregisterComponent: () => void = registerComponent(
            FocusComponent.MailList,
            trySetFocus
        );
        // Unregister our component from FocusManager when we unmount
        return function cleanup() {
            if (unregisterComponent) {
                unregisterComponent();
            }
        };
    }, []);

    React.useEffect(() => {
        if (isFeatureEnabled('tri-scrollMoreDataPoint')) {
            oldNumRows.current = listViewStore.tableViews.get(props.tableViewId).rowKeys.length;
        }
    }, [props.tableViewId]);

    const listViewContainer = React.useRef<HTMLDivElement>();
    const mailListContent = React.useRef<HTMLDivElement>();
    const oldNumRows = React.useRef<number>(0);
    const itemsLoaded = React.useRef<boolean>(false);
    const tableView = listViewStore.tableViews.get(props.tableViewId);
    const mailListViewState: MailListViewState = useComputedValue(() => {
        return getMailListLoadStateFromTableView(tableView);
    }, [tableView]);

    React.useEffect(() => {
        if (mailListViewState == MailListViewState.Loaded) {
            itemsLoaded.current = true;
        } else if (mailListViewState == MailListViewState.Loading) {
            itemsLoaded.current = false;
        }
    }, [mailListViewState]);

    /*
    We should show the message Ad list when all of the following conditions are true:
    1. When the view is in the other pivot, native ads will be shown either OtherInboxOnly or AllInbox flight is on
    2. When any all inbox flight is on, AllInbox flight needs to be on
    3. Search does not run
    4. listRemoved is not true in message ad list view status store. This means the message Ad list is not removed by the user manually in this session
    */
    const shouldShowMessageAdList = (tableView: TableView): boolean => {
        if (!isConsumer()) {
            return false;
        }
        if (messageAdListViewStatusStore?.showAdCount == 0) {
            return false;
        }
        const inOtherPivot = getFocusedFilterForTable(tableView) == FocusedViewFilter.Other;
        const nativeAdInitialPlacement = getNativeAdInitialPlacement();
        if (nativeAdInitialPlacement === NativeAdPlacement.None) {
            return false;
        }
        return (
            (inOtherPivot &&
                (nativeAdInitialPlacement == NativeAdPlacement.OtherOnly ||
                    nativeAdInitialPlacement == NativeAdPlacement.OtherPrefer)) ||
            (tableView.tableQuery.folderId == folderNameToId('inbox') &&
                tableView.tableQuery.type != TableQueryType.Search &&
                (nativeAdInitialPlacement == NativeAdPlacement.AllInbox ||
                    (nativeAdInitialPlacement == NativeAdPlacement.OtherPrefer &&
                        !isFocusedInboxEnabled())))
        );
    };
    const shouldShowGetStartedList = (tableView: TableView): boolean => {
        return (
            tableView.tableQuery.folderId == folderNameToId('inbox') &&
            tableView.tableQuery.type != TableQueryType.Search &&
            isGetStartedUser()
        );
    };
    /**
     * Callback when the list view gains focus from the focus manager
     */
    const trySetFocus = (): boolean => {
        // This can be null when component is not fully mounted
        if (!listViewContainer.current) {
            return false;
        }
        const currentShowListPane = shouldShowListView();
        if (currentShowListPane) {
            // mailListViewContent instance can be null until content gets
            // fully mounted when 1) user switches folder or 2) OWA reloads
            // Or when the state of the MailLIstViewState is still loading
            if (mailListContent.current && mailListViewState == MailListViewState.Loaded) {
                // Focus on content if it exists
                mailListContent.current.focus();
                return true;
            } else {
                listViewContainer.current.focus();
                return true;
            }
        }
        // Let FocusManager handle the job when listview is hidden
        return false;
    };
    /**
     * Returns flag indicating whether the document active element is contained within this MailList
     */
    const isFocusInMailList = React.useCallback((): boolean => {
        return !!listViewContainer.current?.contains?.(document.activeElement);
    }, []);

    const isFocusOnMailList = React.useCallback((): boolean => {
        return listViewContainer.current == document.activeElement;
    }, []);
    /**
     * Reload the default list view for selected folder id
     */
    const reloadTable = () => {
        const tableView = listViewStore.tableViews.get(props.tableViewId);
        loadTableViewFromTableQuery(
            tableView.tableQuery,
            null /* loadTableViewDatapoint */,
            'EmptyListState'
        );
        // Log that retry was clicked
        logUsage('TnS_RetryLoadMailListClicked');
    };
    const setlistViewContainerRef = (ref: HTMLDivElement) => {
        listViewContainer.current = ref;
    };
    const onDragOver = (evt: React.DragEvent<EventTarget>) => {
        /* We need preventDefault so that the circle-slash ghost icon does not show and to prevent redirection in firefox */
        evt.preventDefault();
    };
    const onDrop = (evt: React.DragEvent<EventTarget>) => {
        /* We need preventDefault to prevent redirection in firefox */
        evt.preventDefault();
    };
    /**
     * Renders the mail list item context menu by initiating the itemContextMenuState state in store
     */
    const renderItemContextMenu = (): JSX.Element => {
        const { itemContextMenuState } = props;
        return (
            itemContextMenuState && (
                <MailListItemContextMenu
                    anchorPoint={itemContextMenuState.anchor}
                    menuType={itemContextMenuState.menuType}
                    menuSource={itemContextMenuState.menuSource}
                    onDismiss={dismissContextMenu}
                    tableViewId={props.tableViewId}
                />
            )
        );
    };
    /**
     * Called when mail list scroll
     */
    const onMailListScroll = React.useCallback(
        (ev: MouseEvent) => {
            // If context menu was open, dismiss the context menu
            if (props.itemContextMenuState) {
                dismissContextMenu(ev);
            }
            if (isFeatureEnabled('tri-scrollMoreDataPoint')) {
                const { rowKeys, totalRowsInView } = listViewStore.tableViews.get(
                    props.tableViewId
                );
                const newNumRows = rowKeys.length;
                // Log how many total rows loaded in after user scroll and total number of rows in the view
                // This dp is TEMPORARY (as it will be very noisy)
                if (newNumRows > oldNumRows.current) {
                    logUsage('TnS_ScrollLoadMore', [newNumRows, totalRowsInView]);
                    oldNumRows.current = newNumRows;
                }
            }
        },
        [props.itemContextMenuState, isFeatureEnabled('tri-scrollMoreDataPoint'), props.tableViewId]
    );
    /**
     * Dismiss the context menu and reset focus
     */
    const dismissContextMenu = (ev?: MouseEvent) => {
        hideMailItemContextMenu();
        // After dismissing context menu show the reading pane so that user does not
        // have to select the item again
        if (!isReadingPanePositionOff()) {
            setShowReadingPane(true /* showReadingPane */);
        }
        resetFocus();
    };
    let listViewContent: JSX.Element;
    const shouldShowSearchAnswer = isAnswerFeatureEnabled();
    // Render when table is Loaded.
    if (mailListViewState == MailListViewState.Loaded) {
        listViewContent = (
            <>
                <MailListContent
                    ref={mailListContent}
                    isFocusOnMailList={isFocusOnMailList}
                    isFocusInMailList={isFocusInMailList}
                    tableViewId={props.tableViewId}
                    onScroll={onMailListScroll}
                    shouldShowMessageAdList={shouldShowMessageAdList(tableView)}
                    shouldShowGetStartedList={shouldShowGetStartedList(tableView)}
                    styleSelectorAsPerUserSettings={props.styleSelectorAsPerUserSettings}
                />
                {renderItemContextMenu()}
            </>
        );
    } else {
        const scenarioType = (tableView.tableQuery as SearchTableQuery).scenarioType;
        const isSearch =
            tableView.tableQuery.type === TableQueryType.Search &&
            scenarioType !== 'persona' &&
            scenarioType !== 'privateDistributionList';
        listViewContent =
            mailListViewState === MailListViewState.Loading &&
            (isFeatureEnabled('sea-loadingShimmer') || !isSearch) ? (
                <MailListShimmerState
                    heightOfView={
                        listViewContainer.current ? listViewContainer.current.offsetHeight : 0
                    }
                />
            ) : (
                <MailListEmptyState
                    tableViewId={props.tableViewId}
                    stateType={mailListViewState}
                    clearFilterCommand={clearFilter}
                    reloadCommand={reloadTable}
                    shouldShowMessageAdList={shouldShowMessageAdList(tableView)}
                    shouldShowGetStartedList={shouldShowGetStartedList(tableView)}
                    shouldShowSearchAnswer={shouldShowSearchAnswer}
                    itemsPreviouslyLoaded={itemsLoaded.current}
                />
            );
    }
    return (
        <div
            tabIndex={-1}
            ref={setlistViewContainerRef}
            className={classNames(styles.wrapperDiv, shouldShowSearchAnswer && 'customScrollBar')}
            {...(mailListViewState == MailListViewState.Loaded && {
                onDragOver,
                onDrop,
            })}>
            {listViewContent}
        </div>
    );
});
function clearFilter() {
    lazyClearFilter.importAndExecute('EmptyListState');
}
