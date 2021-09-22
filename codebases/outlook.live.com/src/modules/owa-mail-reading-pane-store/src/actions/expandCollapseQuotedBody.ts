import datapoints from '../datapoints';
import { loadQuotedBody } from '../services/loadQuotedBody';
import type QuotedBodyViewState from '../store/schema/QuotedBodyViewState';
import type { ObservableMap } from 'mobx';
import { getSelectedTableView, TableView } from 'owa-mail-list-store';
import type { ClientItem } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import { mutatorAction } from 'satcheljs';
import { wrapFunctionForDatapoint } from 'owa-analytics';

export interface ExpandCollapseQuotedBodyState {
    items: ObservableMap<string, ClientItem>;
    tableView: TableView;
}

const updateQuotedBodyViewState = mutatorAction(
    'updateQuotedBodyViewState',
    function updateQuotedBodyViewState(
        quotedBody: string[],
        itemInCache: ClientItem,
        viewState: QuotedBodyViewState
    ) {
        viewState.loadingState.isLoading = false;
        const hasLoadFailed = !quotedBody;
        itemInCache.QuotedTextList = quotedBody;
        viewState.loadingState.hasLoadFailed = hasLoadFailed;
        viewState.isExpanded = !hasLoadFailed;
    }
);

export default wrapFunctionForDatapoint(
    datapoints.RPCountExpCollQuotedText,
    async function expandCollapseQuotedBody(
        viewState: QuotedBodyViewState,
        itemId: string,
        isQuotedTextChanged: boolean,
        state: ExpandCollapseQuotedBodyState = {
            items: mailStore.items,
            tableView: getSelectedTableView(),
        }
    ) {
        const item = state.items.get(itemId);
        if (item) {
            if (viewState.isExpanded) {
                // If already expanded, collapse and logUsage data
                setQuotedBodyViewStateExpand(viewState, false);
            } else if (!viewState.loadingState.isLoading) {
                // If expanding, start PerformanceDatapoint
                if (item.QuotedTextList) {
                    // If collapsed, but we already have the quotedText, simply expand
                    setQuotedBodyViewStateExpand(viewState, true);
                } else {
                    // Otherwise, go load the quotedText
                    setQuotedBodyViewIsLoading(viewState);
                    const quotedBody = await loadQuotedBody(itemId, item.MailboxInfo);
                    updateQuotedBodyViewState(quotedBody, item, viewState);
                }
            }
        }
    }
);

const setQuotedBodyViewStateExpand = mutatorAction(
    'setQuotedBodyViewStateExpand',
    (viewState: QuotedBodyViewState, isExpanded: boolean) => {
        viewState.isExpanded = isExpanded;
    }
);

const setQuotedBodyViewIsLoading = mutatorAction(
    'setQuotedBodyViewStateExpand',
    (viewState: QuotedBodyViewState) => {
        viewState.loadingState.isLoading = true;
    }
);
