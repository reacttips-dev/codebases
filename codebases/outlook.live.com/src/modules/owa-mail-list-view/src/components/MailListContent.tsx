import { messageListAriaLabel, skipToMessageList } from './MailListContent.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import Draggable from 'owa-dnd/lib/components/Draggable';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import getMailListRowDragData from 'owa-mail-list-store/lib//utils/getMailListRowDragData';
import getMailListTableProps from '../utils/getMailListTableProps';
import { shouldShowListView, isSingleLineListView } from 'owa-mail-layout';
import { lazyLoadMoreInTable, getCanTableLoadMore } from 'owa-mail-triage-table-load-extra';
import LoadMoreListView, {
    LoadMoreListViewHandle,
} from 'owa-loadmore-listview/lib/components/LoadMoreListView';
import MailListGroupHeader from './MailListGroupHeader';
import MailListItemDataProvider from './MailListItemDataProvider';
import MailListLoading from './MailListLoading';
import type MailListTableProps from '../utils/types/MailListTableProps';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { MessageAdList } from 'owa-mail-messagead-list-view';
import { observer } from 'mobx-react-lite';
import { lazyResetFocus, tabIndex } from 'owa-mail-focus-manager';
import {
    getMailListGroupHeader,
    getMailListGroupHeaderGenerator,
} from 'owa-mail-list-group-headers';
import {
    getMailListDragPreview,
    MAIL_ITEM_DRAG_XOFFSET,
    MAIL_ITEM_DRAG_YOFFSET,
} from '../utils/mailListDragUtil';
import {
    getFocusedFilterForTable,
    getIsEverythingSelectedInTable,
    listViewStore,
    TableView,
    getItemsOrConversationsSelectedText,
    getIsSearchTableShown,
} from 'owa-mail-list-store';
import { GetStartedListInListView } from 'owa-getstarted';
import { AnswersContainer, isAnswerFeatureEnabled } from 'owa-mail-search';
import { useLazyKeydownHandler } from 'owa-hotkeys';
import {
    lazySetupMailListContentKeys,
    lazySetupTriageActionKeys,
    lazyUpdateMailItemHeights,
    lazyUpdateMailItemHeightsThrottled,
} from './lazy/lazyListViewModule';
import { useMergedRefs } from 'owa-react-hooks/lib/useMergedRefs';
import { useWindowEvent } from 'owa-react-hooks/lib/useWindowEvent';
import { RollupContainer } from 'owa-mail-rollup';
import { SkipLinkRegion } from 'owa-skip-link/lib/components/SkipLinkRegion';
import { hasSenderImageOffInFullView } from '../utils/hasSenderImageOffInFullView';
import updateLastIndexToRender from '../utils/updateLastIndexToRender';
import { getDensityModeString } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';
import { FilterSearchPrompt } from 'owa-mail-search-list-view';

import styles from './MailList.scss';
import classNames from 'classnames';

export interface MailListContentProps {
    isFocusOnMailList: () => boolean;
    isFocusInMailList: () => boolean;
    tableViewId: string;
    onScroll?: (ev?: any) => void;
    shouldShowMessageAdList: boolean;
    shouldShowGetStartedList: boolean;
    styleSelectorAsPerUserSettings: string;
}

function useFocusManager(
    props: Pick<MailListContentProps, 'isFocusInMailList' | 'isFocusOnMailList'>,
    trySetFocus: () => boolean,
    tableView: TableView
) {
    React.useEffect(() => {
        // If the listview loads without cached content, only MailList is displayed.
        // When the mail list content gets rendered layer, it needs to transfer focus from MailList to MailListContent
        // to support keyboard navigation.
        window.requestAnimationFrame(() => {
            if (props.isFocusOnMailList()) {
                trySetFocus();
            }
        });
    });

    React.useEffect(() => {
        return () => {
            if (props.isFocusInMailList()) {
                // Reset focus such that it can be restored when component is updated
                lazyResetFocus.importAndExecute();
            }
        };
    }, []);

    const currentShowListPane = shouldShowListView();
    const lastShowListPane = React.useRef<boolean>();
    const lastTableViewId = React.useRef<string>();
    React.useEffect(() => {
        // When list pane changes from shown to hidden, it means we have gone into immersive reading pane and we need to
        // save current scroll position for if user exits and goes back to same list pane (in same table). When user
        // exits immersive reading pane and returns to the same table / previously shown list pane which changes list pane
        // from hidden to shown, we need to reset focus
        if (
            lastShowListPane.current !== undefined &&
            lastShowListPane.current !== currentShowListPane &&
            lastTableViewId.current === tableView.id
        ) {
            lazyResetFocus.importAndExecute();
        }

        lastShowListPane.current = currentShowListPane;
        lastTableViewId.current = tableView.id;
    }, [currentShowListPane]);
}

function useMemoizedMailListTableProps(tableViewId: string) {
    // Because the value depends on computed properties, we can't simply use React.useMemo()
    // with just tableViewId as a dependency. However, we do need to use useMemo to keep the
    // object reference the same
    return React.useMemo(() => getMailListTableProps(tableViewId), [
        ...Object.values(getMailListTableProps(tableViewId)),
    ]);
}

export default observer(
    function MailListContent(props: MailListContentProps, ref: React.Ref<HTMLDivElement>) {
        const mailListViewContent = React.useRef<HTMLDivElement>();
        const containerRef = useMergedRefs(mailListViewContent, ref);
        const listView = React.useRef<LoadMoreListViewHandle>();
        const propagateScrollingTask = React.useRef<number>();
        const propagateResizeTask = React.useRef<number>();

        const tableView = listViewStore.tableViews.get(props.tableViewId);
        const mailListTableProps = useMemoizedMailListTableProps(props.tableViewId);
        const mailListGroupHeaderGenerator = React.useMemo(
            () => getMailListGroupHeaderGenerator(tableView),
            [tableView]
        );
        const densityModeString = getDensityModeString();

        const trySetFocus = React.useCallback((): boolean => {
            if (mailListViewContent.current) {
                mailListViewContent.current.focus();

                return true;
            }
            return false;
        }, []);

        useLazyKeydownHandler(
            mailListViewContent,
            lazySetupMailListContentKeys.importAndExecute,
            props.tableViewId
        );

        useLazyKeydownHandler(
            null /* applies handler to document.body */,
            lazySetupTriageActionKeys.importAndExecute,
            props.tableViewId
        );

        // Determine last index to render on folder switch, list view change, or density mode change
        React.useEffect(() => {
            updateLastIndexToRender(tableView.rowKeys, tableView);
        }, [
            isSingleLineListView(),
            densityModeString,
            tableView.tableQuery.folderId,
            tableView.rowKeys.length,
        ]);

        // Determine last index to render on window resize. Propagate resize task to avoid calling too many times
        useWindowEvent(
            'resize',
            () => {
                if (propagateResizeTask.current) {
                    window.clearTimeout(propagateResizeTask.current);
                    propagateResizeTask.current = null;
                }

                propagateResizeTask.current = window.setTimeout(() => {
                    propagateResizeTask.current = null;
                    updateLastIndexToRender(tableView.rowKeys, tableView);
                }, 150);
            },
            []
        );

        useFocusManager(props, trySetFocus, tableView);

        const getCanCurrentTableLoadMore = React.useCallback((): boolean => {
            return getCanTableLoadMore(tableView);
        }, [tableView]);

        const getAriaLabel = () => {
            let ariaLabel = loc(messageListAriaLabel);

            if (getIsEverythingSelectedInTable(tableView) || tableView.selectedRowKeys.size == 0) {
                ariaLabel += ' ' + getItemsOrConversationsSelectedText(props.tableViewId);
            }

            return ariaLabel;
        };

        const onScroll = React.useCallback(
            (event: any, scrollTop: number, offsetHeight: number) => {
                props.onScroll(event);
                const rowKeys = tableView.rowKeys;

                // Virtualization will only kick in after a certain amount of rows have been loaded in.
                // Or immediately if virtualize on table load flight is enabled
                if (isFeatureEnabled('tri-virtualizeLessAggressively')) {
                    lazyUpdateMailItemHeightsThrottled.importAndExecute(
                        rowKeys,
                        scrollTop,
                        offsetHeight
                    );
                } else {
                    if (propagateScrollingTask.current) {
                        window.clearTimeout(propagateScrollingTask.current);
                        propagateScrollingTask.current = null;
                    }

                    propagateScrollingTask.current = window.setTimeout(() => {
                        propagateScrollingTask.current = null;
                        lazyUpdateMailItemHeights.importAndExecute(
                            rowKeys,
                            scrollTop,
                            offsetHeight
                        );
                    }, 100);
                }
            },
            [props.onScroll, tableView]
        );

        /**
         * Clear tabindex of container such that container is not in a sequential
         * keyboard navigation when an item is selected in listview
         */
        const resetListViewContentTabIndex = React.useCallback(() => {
            if (mailListViewContent.current.getAttribute('tabindex') == tabIndex.sequentialIndex) {
                mailListViewContent.current.setAttribute('tabindex', tabIndex.nonSequentialIndex);
            }
        }, []);

        const onLoadMoreRows = React.useCallback(() => {
            lazyLoadMoreInTable.importAndExecute(tableView);
        }, [tableView]);

        const canDrag = React.useCallback(() => {
            return mailListTableProps.canDragFromTable;
        }, [mailListTableProps.canDragFromTable]);

        const isDraggable = React.useCallback(() => {
            return getMailListRowDragData().rowKeys.length > 0 && mailListTableProps.isDraggable;
        }, [mailListTableProps.isDraggable]);

        const createMailListItem = React.useCallback(
            (rowKey: string, itemIndex: number, listProps: MailListTableProps) => {
                // The unique key must be provided to the outermost element, otherwise React will
                // default to using the list index. This would be VERY bad as any row delete/additions
                // will cause a re-render
                return (
                    <React.Fragment key={`item_${rowKey}`}>
                        <MailListItemDataProvider
                            rowKey={rowKey}
                            mailListTableProps={listProps}
                            resetListViewContentTabIndex={resetListViewContentTabIndex}
                            isFocusInMailList={props.isFocusInMailList}
                            styleSelectorAsPerUserSettings={props.styleSelectorAsPerUserSettings}
                        />
                    </React.Fragment>
                );
            },
            [
                resetListViewContentTabIndex,
                props.isFocusInMailList,
                props.styleSelectorAsPerUserSettings,
            ]
        );

        const createHeader = React.useCallback(
            (previousRowKey: string, currentRowKey: string) => {
                const headers: JSX.Element[] = [];
                const headerText = getMailListGroupHeader(
                    previousRowKey,
                    currentRowKey,
                    tableView,
                    mailListGroupHeaderGenerator
                );

                if (headerText) {
                    headers.push(
                        <MailListGroupHeader
                            key={`gh_${headerText}`}
                            headerText={headerText}
                            groupHeaderStylesAsPerUserSettings={
                                props.styleSelectorAsPerUserSettings
                            }
                            hasSenderImageOffInFullView={hasSenderImageOffInFullView(tableView)}
                        />
                    );
                }

                headers.push(
                    <RollupContainer
                        key={`rollup_${currentRowKey}`}
                        previousRowKey={previousRowKey}
                        currentRowKey={currentRowKey}
                        folderId={tableView.tableQuery.folderId}
                        focusedViewFilter={getFocusedFilterForTable(tableView)}
                        styleSelectorAsPerUserSettings={props.styleSelectorAsPerUserSettings}
                        tableView={tableView}
                    />
                );

                return <React.Fragment key={`header_${currentRowKey}`}>{headers}</React.Fragment>;
            },
            [
                mailListGroupHeaderGenerator,
                tableView,
                props.styleSelectorAsPerUserSettings,
                props.tableViewId,
            ]
        );

        const loadingSpinner = React.useMemo((): JSX.Element => {
            // Do not render the loading spinner if the table cannot load more. If the table is in loading state but cannot load more,
            // it indicates it's doing a reload in which case we don't want to show the load more spinner.
            return getCanCurrentTableLoadMore() ? <MailListLoading /> : null;
        }, [getCanCurrentTableLoadMore()]);

        const SpinnerPlaceholder = React.useCallback((): JSX.Element => {
            // Do not show the placeholder if we're loading and showing the spinner, or this table
            // cannot load more which means the spinner won't ever appear.
            if (tableView.isLoading || !getCanCurrentTableLoadMore()) {
                return null;
            }

            // Create an element to render after all rows that take up the same space as the loading indicator,
            // so that the height of the scroll region doesn't change when loading indicator appears
            return <div className={styles.spinnerPlaceHolder} />;
        }, [tableView.isLoading, getCanCurrentTableLoadMore]);

        const FilterPrompt = React.useCallback((): JSX.Element => {
            // Only show prompt for filter if the end of a search table is being shown
            if (
                !isFeatureEnabled('sea-listView-promptAdvancedSearch') ||
                !getIsSearchTableShown() ||
                tableView.isLoading ||
                getCanCurrentTableLoadMore()
            ) {
                return null;
            }
            return <FilterSearchPrompt rowCount={tableView.rowKeys.length} />;
        }, [
            tableView.rowKeys.length,
            tableView.isLoading,
            getCanCurrentTableLoadMore,
            getIsSearchTableShown,
        ]);

        const preRowsComponent = React.useCallback(() => {
            return (
                <>
                    {isAnswerFeatureEnabled() && (
                        <AnswersContainer tableQuery={tableView.tableQuery} />
                    )}
                    {props.shouldShowMessageAdList && (
                        <MessageAdList
                            loadInOtherPivot={
                                getFocusedFilterForTable(tableView) == FocusedViewFilter.Other
                            }
                            loadInEmptyPivot={false}
                            loadInItemView={
                                tableView.tableQuery.listViewType == ReactListViewType.Message
                            }
                            tableView={tableView}
                        />
                    )}
                </>
            );
        }, [tableView, tableView.tableQuery, tableView.id, props.shouldShowMessageAdList]);

        const postRowsComponent = React.useCallback(() => {
            return (
                <>
                    {props.shouldShowGetStartedList && (
                        <div className={styles.getStartedContainer}>
                            <GetStartedListInListView rowCount={tableView.rowKeys.length} />
                        </div>
                    )}
                    <SpinnerPlaceholder />
                    <FilterPrompt />
                </>
            );
        }, [
            props.shouldShowGetStartedList,
            tableView.rowKeys.length,
            SpinnerPlaceholder,
            FilterPrompt,
        ]);
        const renderListViewContent = (): JSX.Element => {
            const listProps = mailListTableProps;

            const loadMoreListView = (
                <SkipLinkRegion
                    skipLinkName={loc(skipToMessageList)}
                    role="complementary"
                    className={styles.wrapperDiv}>
                    <div
                        tabIndex={0}
                        role="listbox"
                        aria-multiselectable={true}
                        aria-label={getAriaLabel()}
                        ref={containerRef}
                        className={styles.wrapperDiv}>
                        <LoadMoreListView
                            ref={listView}
                            className={classNames('customScrollBar', styles.outerScrollContainer)}
                            dataSourceId={tableView.id}
                            itemIds={tableView.rowKeys}
                            onScroll={onScroll}
                            onRenderRow={createMailListItem}
                            onRenderHeader={createHeader}
                            onLoadMoreRows={onLoadMoreRows}
                            isLoadRowsInProgress={tableView.isLoading}
                            getCanLoadMore={getCanCurrentTableLoadMore}
                            currentLoadedIndex={tableView.currentLoadedIndex}
                            guardPageCount={3}
                            loadingComponent={loadingSpinner}
                            rowWrapperClass={styles.rowWrapper}
                            PreRowsComponent={preRowsComponent}
                            PostRowsComponent={postRowsComponent}
                            listProps={listProps}
                        />
                    </div>
                </SkipLinkRegion>
            );

            return loadMoreListView;
        };

        return (
            <Draggable
                canDrag={canDrag}
                isDraggable={isDraggable}
                getDragData={getMailListRowDragData}
                getDragPreview={getMailListDragPreview}
                xOffset={MAIL_ITEM_DRAG_XOFFSET}
                yOffset={MAIL_ITEM_DRAG_YOFFSET}
                classNames={styles.draggableDiv}>
                {renderListViewContent()}
            </Draggable>
        );
    },
    { forwardRef: true }
);
