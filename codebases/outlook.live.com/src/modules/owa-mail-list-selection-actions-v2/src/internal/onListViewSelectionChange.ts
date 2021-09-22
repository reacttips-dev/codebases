import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import type ListViewStore from 'owa-mail-list-store/lib/store/schema/ListViewStore';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { action } from 'satcheljs/lib/legacy';
import type { ClientItemId } from 'owa-client-ids';
import { isValidConversationCache } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { isDumpsterSearchTable } from 'owa-mail-list-search';
import { isDumpsterTable, listViewStore, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import { lazyLogSearchEntityActions } from 'owa-search-instrumentation';
import { lazyLoadConversation } from 'owa-mail-store-actions';
import { logUsage, PerformanceDatapoint } from 'owa-analytics';
import {
    lazyLoadConversationReadingPaneForSingleMailItemSelected,
    lazyLoadItemReadingPaneForSingleMailItemSelected,
} from 'owa-mail-reading-pane-store';
import { SearchScenarioId } from 'owa-search-store/lib/store/schema/SearchScenarioId';
import { getAggregationBucket } from 'owa-analytics-actions';
import { setShowListPane } from 'owa-mail-layout/lib/actions/setShowListPane';
import { setShowReadingPane } from 'owa-mail-layout/lib/actions/setShowReadingPane';
import {
    isReadingPanePositionBottom,
    isReadingPanePositionRight,
    isReadingPanePositionOff,
} from 'owa-mail-layout/lib/selectors/readingPanePosition';
import { getActiveContentTab, lazyActivateTab, primaryTab } from 'owa-tab-store';
import {
    isSpotlightEnabled,
    isSpotlightItem,
    lazyLogSpotlightItemClicked,
} from 'owa-mail-spotlight';

export interface ListSelectionChangeState {
    listViewStore: ListViewStore;
}

/**
 * Handles no item selection in list view
 */
function handleListViewNoItemSelectedChange() {
    setShowListPane(true /* showListPane */);

    if (isReadingPanePositionOff()) {
        setShowReadingPane(false /* showReadingPane */);
    } else {
        setShowReadingPane(true /* showReadingPane */);
    }
}

/**
 * Handles single item selection in list view
 * @param rowKey The row key
 * @param listViewType The list view type
 * @param subject The subject
 * @param isUserNavigation Did user initiate selection
 * @param mailListItemSelectionSource The source of selection on mail item
 */
function handleListViewSingleItemSelectedChangedWhenReadingPaneOff(
    rowKey: string,
    listViewType: ReactListViewType,
    subject: string,
    categories: string[],
    isUserNavigation: boolean,
    mailListItemSelectionSource: MailListItemSelectionSource,
    instrumentationContext: InstrumentationContext,
    shouldLoadCompose: boolean,
    itemToScrollTo: string,
    tableView: TableView
): Promise<void> {
    let promiseToReturn = Promise.resolve();
    let showReadingPane = false;
    let showListPane = true;
    const rowId = MailRowDataPropertyGetter.getRowClientItemId(rowKey, tableView);
    const rowIdToLoadOnReadingPane = shouldShowUnstackedReadingPane()
        ? MailRowDataPropertyGetter.getRowIdToShowInReadingPane(rowKey, tableView)
        : rowId;

    switch (mailListItemSelectionSource) {
        case MailListItemSelectionSource.MailListItemBody:
        case MailListItemSelectionSource.CommandBarArrows: // Only shown in immersive reading pane
        case MailListItemSelectionSource.KeyboardEnter:
        case MailListItemSelectionSource.MailListItemExpansion:
        case MailListItemSelectionSource.MailListItemRichPreview:
        case MailListItemSelectionSource.SearchSuggestionClick:
        case MailListItemSelectionSource.RouteHandler:
            showReadingPane = true;
            showListPane = false;
            break;
        case MailListItemSelectionSource.MailListItemTwisty:
            promiseToReturn = loadConversationItemsFromTwistyClick(rowId);
            showReadingPane = false;
            showListPane = true;
            break;
        case MailListItemSelectionSource.ImmersiveReadingPaneDelete:
            if (getUserConfiguration().UserOptions.NextSelection === 'ReturnToView') {
                showReadingPane = false;
                showListPane = true;
            } else {
                showReadingPane = true;
                showListPane = false;
            }
            break;
        case MailListItemSelectionSource.KeyboardUpDown:
        case MailListItemSelectionSource.MailListItemCheckbox:
        case MailListItemSelectionSource.KeyboardCtrlSpace:
        case MailListItemSelectionSource.MailListItemContextMenu:
        case MailListItemSelectionSource.NewConversation:
        case MailListItemSelectionSource.Reset:
        case MailListItemSelectionSource.RowRemoval:
        default:
            showReadingPane = false;
            showListPane = true;
            break;
    }

    if (showReadingPane) {
        instrumentationContext?.dp?.addCheckpoint?.('OFF_LRP');
        promiseToReturn = loadReadingPane(
            rowIdToLoadOnReadingPane,
            listViewType,
            subject,
            categories,
            isUserNavigation,
            instrumentationContext,
            shouldLoadCompose,
            itemToScrollTo
        );
    }

    setShowReadingPane(showReadingPane);
    setShowListPane(showListPane);

    return promiseToReturn;
}

let propagateLoadReadingPaneTask: NodeJS.Timer;
let lastKeyboardSelectionTime: number = 0;

/**
 * Handles single item selection in list view
 * @param rowKey The row key
 * @param listViewType the list view type
 * @param subject The subject
 * @param isUserNavigation Did user initiate selection
 * @param mailListItemSelectionSource The source of selection on mail item
 */
function handleListViewSingleItemSelectedChangedWhenReadingPaneOn(
    rowKey: string,
    listViewType: ReactListViewType,
    subject: string,
    categories: string[],
    isUserNavigation: boolean,
    mailListItemSelectionSource: MailListItemSelectionSource,
    instrumentationContext: InstrumentationContext,
    shouldLoadCompose: boolean,
    itemToScrollTo: string,
    tableView: TableView
): Promise<void> {
    if (propagateLoadReadingPaneTask) {
        clearTimeout(propagateLoadReadingPaneTask);
        propagateLoadReadingPaneTask = null;
    }

    const rowId = MailRowDataPropertyGetter.getRowClientItemId(rowKey, tableView);
    const showUnstackedReadingPane = shouldShowUnstackedReadingPane();
    const rowIdToLoadOnReadingPane = showUnstackedReadingPane
        ? MailRowDataPropertyGetter.getRowIdToShowInReadingPane(rowKey, tableView)
        : rowId;
    // If the selection source is twisty and unstackedReading pane is on, we need to call GCI to populate itemparts
    // on twisty expansion
    if (
        showUnstackedReadingPane &&
        mailListItemSelectionSource === MailListItemSelectionSource.MailListItemTwisty
    ) {
        loadConversationItemsFromTwistyClick(rowId);
    }

    if (mailListItemSelectionSource !== MailListItemSelectionSource.MailListItemContextMenu) {
        setShowReadingPane(true /* showReadingPane */);
    }
    setShowListPane(true /* showListPane */);

    // [Perf optimization] If user is moving through the listview via keyboard up/down arrows, add a slight delay
    // to avoid us having to load every conversation/item if user is just trying to scroll (each stroke is within a small window).
    if (mailListItemSelectionSource === MailListItemSelectionSource.KeyboardUpDown) {
        const currentKeyboardSelectionTime = Date.now();
        const selectionTimeDiff = currentKeyboardSelectionTime - lastKeyboardSelectionTime;
        lastKeyboardSelectionTime = currentKeyboardSelectionTime;

        if (
            selectionTimeDiff <= 500 // milliseconds
        ) {
            return new Promise<void>((resolve, reject) => {
                instrumentationContext?.dp?.addCheckpoint?.('ON_LRP_TO');
                propagateLoadReadingPaneTask = setTimeout(() => {
                    propagateLoadReadingPaneTask = null;
                    loadReadingPane(
                        rowIdToLoadOnReadingPane,
                        listViewType,
                        subject,
                        categories,
                        isUserNavigation,
                        instrumentationContext,
                        shouldLoadCompose,
                        itemToScrollTo
                    )
                        .then(resolve)
                        .catch(reject);
                }, 250);
            });
        }
    }

    instrumentationContext?.dp?.addCheckpoint?.('ON_LRP');
    return loadReadingPane(
        rowIdToLoadOnReadingPane,
        listViewType,
        subject,
        categories,
        isUserNavigation,
        instrumentationContext,
        shouldLoadCompose,
        itemToScrollTo
    );
}

function loadReadingPane(
    rowId: ClientItemId,
    listViewType: ReactListViewType,
    subject: string,
    categories: string[],
    isUserNavigation: boolean,
    instrumentationContext: InstrumentationContext,
    shouldLoadCompose: boolean,
    itemToScrollTo?: string
) {
    switch (listViewType) {
        case ReactListViewType.Conversation:
            // Feature [mon-rp-unstackedConversation] adds a win32 like mixed reading pane where
            // reading pane shows conversations as thread instead of current conversation view
            // where itemparts are rendered as expandable cards stacked one below the other.
            if (shouldShowUnstackedReadingPane()) {
                return lazyLoadItemReadingPaneForSingleMailItemSelected.importAndExecute(
                    rowId,
                    isUserNavigation,
                    instrumentationContext,
                    shouldLoadCompose,
                    'UnstackedReadingPane'
                );
            }
            return lazyLoadConversationReadingPaneForSingleMailItemSelected.importAndExecute(
                rowId,
                isUserNavigation,
                instrumentationContext,
                subject,
                categories,
                itemToScrollTo
            );

        case ReactListViewType.Message:
            return lazyLoadItemReadingPaneForSingleMailItemSelected.importAndExecute(
                rowId,
                isUserNavigation,
                instrumentationContext,
                shouldLoadCompose
            );

        default:
            return Promise.resolve();
    }
}

/**
 * Called when selection in list view changes to orchestrate what happens next
 * @param tableView The tableview
 * @param isUserNavigation Did user initiate selection
 * @param mailListItemSelectionSource The source of selection on mail item
 * Note that it needs to be an action to make all operations inside atomic.
 */
const onListViewSelectionChange = action('onListViewSelectionChange')(
    async function onListViewSelectionChange(
        tableView: TableView,
        isUserNavigation: boolean,
        mailListItemSelectionSource: MailListItemSelectionSource,
        selectMailItemDatapoint: PerformanceDatapoint,
        state: ListSelectionChangeState = { listViewStore: listViewStore }
    ): Promise<void> {
        if (mailListItemSelectionSource == MailListItemSelectionSource.MessageAd) {
            // return when MailListItemSelectionSource is MessageAd as selectedRowsCount is 0 at this time
            // We should not enter the handleListViewNoItemSelectedChange block to change the reading pane hide/show status
            return;
        }
        let promiseToReturn = Promise.resolve();
        const selectedRowsCount = tableView.selectedRowKeys.size;
        const originalActiveTab = getActiveContentTab();
        if (selectedRowsCount == 0) {
            handleListViewNoItemSelectedChange();
        } else if (
            // If only one row is selected and we are not in SLV checked mode, go into one selected row logic,
            // otherwise go into muliselect case.
            selectedRowsCount == 1 &&
            !(isReadingPanePositionOff() && tableView.isInCheckedMode)
        ) {
            let itemToScrollTo = null;
            const rowKey = [...tableView.selectedRowKeys.keys()][0];
            const isDraft = MailRowDataPropertyGetter.getIsDraft(rowKey, tableView);
            const isSubmitted = MailRowDataPropertyGetter.getIsSubmitted(rowKey, tableView);
            const tableQuery = tableView.tableQuery;
            const shouldAlwaysShowMultiselectRP =
                isDumpsterTable(tableQuery) || isDumpsterSearchTable(tableQuery);
            const shouldLoadCompose = isDraft && !isSubmitted && !shouldAlwaysShowMultiselectRP;
            const instrumentationContext = getInstrumentationContextsFromTableView(
                [rowKey],
                tableView
            )[0];
            const categories = MailRowDataPropertyGetter.getCategories(rowKey, tableView);
            const subject = MailRowDataPropertyGetter.getSubject(rowKey, tableView);
            if (
                getUserConfiguration().SessionSettings.IsSubstrateSearchServiceAvailable &&
                instrumentationContext
            ) {
                const referenceKey =
                    instrumentationContext.referenceKey ||
                    (instrumentationContext.index + 1).toString();
                lazyLogSearchEntityActions.importAndExecute(
                    SubstrateSearchScenario.Mail,
                    null,
                    null,
                    instrumentationContext.logicalId,
                    null /* traceId */,
                    referenceKey,
                    'EntityClicked'
                );
                // 3S returns the overloads the itemIds property and stores the most relevant item in a conversation
                // as the first element of that list.  This property is mapped to the MailRow itemIds property
                // in this function - convertSearchResultConversationToConversationType
                const itemIds = MailRowDataPropertyGetter.getItemIds(rowKey, tableView);
                itemToScrollTo = itemIds ? itemIds[0] : null;
                logSearchResultSelectedDatapoint(rowKey, tableView);
            }
            if (!shouldAlwaysShowMultiselectRP) {
                if (instrumentationContext && selectMailItemDatapoint) {
                    instrumentationContext.dp = selectMailItemDatapoint;
                }
                if (isReadingPanePositionRight() || isReadingPanePositionBottom()) {
                    promiseToReturn = handleListViewSingleItemSelectedChangedWhenReadingPaneOn(
                        rowKey,
                        tableQuery.listViewType,
                        subject,
                        categories,
                        isUserNavigation,
                        mailListItemSelectionSource,
                        instrumentationContext,
                        shouldLoadCompose,
                        itemToScrollTo,
                        tableView
                    );
                } else if (isReadingPanePositionOff()) {
                    promiseToReturn = handleListViewSingleItemSelectedChangedWhenReadingPaneOff(
                        rowKey,
                        tableQuery.listViewType,
                        subject,
                        categories,
                        isUserNavigation,
                        mailListItemSelectionSource,
                        instrumentationContext,
                        shouldLoadCompose,
                        itemToScrollTo,
                        tableView
                    );
                }
            }
            if (isSpotlightEnabled() && isSpotlightItem({ rowKey })) {
                lazyLogSpotlightItemClicked.importAndExecute(rowKey);
            }
        } else {
            // Multi-select case
            if (isReadingPanePositionOff()) {
                setShowReadingPane(false /* showReadingPane */);
                setShowListPane(true /* showListPane */);
            }
        }
        // - We should not activate the primary tab and possibly disrupt the user from their current active tab if the ListView change
        // - is not triggered by user interaction. In case the change is triggered by user,
        // - when in SLV: any change in the list view should be reflected in the primary tab, so always activate the primary tab
        // - when list view is always shown: when list view is reset (ex. by switching to another pivot)
        if (
            isUserNavigation &&
            (isReadingPanePositionOff() ||
                (originalActiveTab == getActiveContentTab() &&
                    mailListItemSelectionSource !== MailListItemSelectionSource.Reset))
        ) {
            lazyActivateTab.importAndExecute(primaryTab);
        }
        return promiseToReturn;
    }
);

function loadConversationItemsFromTwistyClick(rowId: ClientItemId): Promise<void> {
    // If has valid conversation cache, no need to load item parts
    if (isValidConversationCache(rowId.Id)) {
        return Promise.resolve();
    }
    return lazyLoadConversation.importAndExecute(rowId, 'LoadConversationReadingPane');
}

const logSearchResultSelectedDatapoint = (rowKey: string, tableView: TableView) => {
    const parentFolderId = MailRowDataPropertyGetter.getParentFolderId(rowKey, tableView);

    /**
     * Check if we know the parent folder ID of the selected item,
     * because it's necessary for data logging. In the case of selecting
     * an email suggestion from search results, we DO NOT have this
     * information, so we can't log the search result selection.
     */
    if (!parentFolderId) {
        return;
    }

    /**
     * Iterate over search results and determine:
     * a.) Are there any results from the "Deleted Items" folder?
     * b.) Are there any results that aren't from the "Deleted Items" folder?
     */
    let resultSetHasAnyItemsFromDeletedItems = false;
    let resultSetHasAnyItemsFromNonDeletedItems = false;
    for (const currentRowKey of tableView.rowKeys) {
        // If we've already found instances of both cases, then break iteration.
        if (resultSetHasAnyItemsFromDeletedItems && resultSetHasAnyItemsFromNonDeletedItems) {
            break;
        }

        const isFromDeletedItems =
            folderIdToName(
                MailRowDataPropertyGetter.getParentFolderId(currentRowKey, tableView)
            ) === 'deleteditems';

        if (isFromDeletedItems && !resultSetHasAnyItemsFromDeletedItems) {
            resultSetHasAnyItemsFromDeletedItems = true;
        }

        if (!isFromDeletedItems && !resultSetHasAnyItemsFromNonDeletedItems) {
            resultSetHasAnyItemsFromNonDeletedItems = true;
        }
    }

    /**
     * Log datapoint that tells us about the search result that
     * was clicked.
     */
    const buckets = [10, 25, 75, 150, 250];
    logUsage('SearchResultSelected', [
        MailRowDataPropertyGetter.getExecuteSearchSortOrder(rowKey, tableView) === 'Relevance',
        folderIdToName(parentFolderId),
        getAggregationBucket({
            value: tableView.rowKeys.indexOf(rowKey),
            buckets,
        }),
        getAggregationBucket({
            value: tableView.rowKeys.length,
            buckets,
        }),
        resultSetHasAnyItemsFromDeletedItems,
        resultSetHasAnyItemsFromNonDeletedItems,
        SearchScenarioId.Mail,
    ]);
};

export default onListViewSelectionChange;
