import isItemReadingPaneViewStateLoaded from './isItemReadingPaneViewStateLoaded';
import loadConversationReadingPaneForSingleMailItemSelected from '../actions/loadConversationReadingPaneForSingleMailItemSelected';
import loadItemReadingPane from '../actions/loadItemReadingPane';
import setItemReadingPaneViewState from '../actions/setItemReadingPaneViewState';
import isConversationReadingPaneViewStateLoaded from '../utils/isConversationReadingPaneViewStateLoaded';
import type { ClientItemId } from 'owa-client-ids';
import { shouldShowReadingPane } from 'owa-mail-layout/lib/selectors/shouldShowReadingPane';
import { getSelectedTableView, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { registerTabHandler, TabHandler, TabType, TabViewState } from 'owa-tab-store';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';

const primaryReadingPaneTabHandler: TabHandler = {
    onActivate: (viewState: TabViewState) => {
        const tableView = getSelectedTableView();
        if (!shouldShowReadingPane() || !tableView) {
            return;
        }

        const isInVirtualSelectAllMode = tableView.isInVirtualSelectAllMode;
        const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
        if (selectedRowKeys.length == 1 && !isInVirtualSelectAllMode) {
            // 1 item selected: display reading pane only if select all is not checked
            const selectedRowId = MailRowDataPropertyGetter.getRowIdToShowInReadingPane(
                selectedRowKeys[0],
                tableView
            );

            const listViewType = tableView.tableQuery.listViewType;
            const instrumentationContext = getInstrumentationContextsFromTableView(
                [selectedRowKeys[0]],
                tableView
            )[0];
            switch (listViewType) {
                case ReactListViewType.Conversation:
                    if (shouldShowUnstackedReadingPane()) {
                        loadItemReadingPaneForSelectedRowId(selectedRowId, instrumentationContext);
                    } else {
                        const selectedRowSubject = MailRowDataPropertyGetter.getSubject(
                            selectedRowKeys[0],
                            tableView
                        );
                        const selectedRowCategories = MailRowDataPropertyGetter.getCategories(
                            selectedRowKeys[0],
                            tableView
                        );
                        if (!isConversationReadingPaneViewStateLoaded(selectedRowId.Id)) {
                            loadConversationReadingPaneForSingleMailItemSelected(
                                selectedRowId,
                                true /* isUserNavigation */,
                                instrumentationContext,
                                selectedRowSubject,
                                selectedRowCategories
                            );
                        }
                    }
                    break;
                case ReactListViewType.Message:
                    loadItemReadingPaneForSelectedRowId(selectedRowId, instrumentationContext);
                    break;
            }
        }
    },
};

function loadItemReadingPaneForSelectedRowId(
    rowId: ClientItemId,
    instrumentationContext: InstrumentationContext
) {
    if (!isItemReadingPaneViewStateLoaded(rowId.Id)) {
        loadItemReadingPane(
            rowId,
            instrumentationContext,
            setItemReadingPaneViewState,
            null /* isPrint */,
            null /* isPreviewPane */
        );
    }
}

export default function ensurePrimaryReadingPaneTabHandler() {
    registerTabHandler(TabType.Primary, primaryReadingPaneTabHandler);
}
