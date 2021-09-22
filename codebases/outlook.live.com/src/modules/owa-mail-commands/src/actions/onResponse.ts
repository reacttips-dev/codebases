import type { ActionSource } from 'owa-analytics-types';
import {
    listViewStore,
    shouldSuppressServerMarkReadOnReplyOrForward,
    MailRowDataPropertyGetter,
    TableQueryType,
} from 'owa-mail-list-store';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';
import {
    lazyReplyToItem,
    lazyReplyToConversation,
    lazyForwardConversation,
    lazyForwardItem,
} from 'owa-mail-message-actions';
import {
    lazyGetLatestNonDraftItemIdFromConversation,
    lazyReplyByMeeting,
} from 'owa-mail-reading-pane-store';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

export const enum ResponseType {
    Reply,
    ReplyAll,
    Forward,
}

export function onForward(actionSource: ActionSource) {
    onResponse(ResponseType.Forward, actionSource);
}

export function onReply(actionSource: ActionSource) {
    onResponse(ResponseType.Reply, actionSource);
}

export function onReplyAll(actionSource: ActionSource) {
    onResponse(ResponseType.ReplyAll, actionSource);
}

function onResponse(responseType: ResponseType, actionSource: ActionSource) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKey = [...tableView.selectedRowKeys.keys()][0];
    const rowId = MailRowDataPropertyGetter.getRowIdToShowInReadingPane(rowKey, tableView);
    const suppressServerMarkReadOnReplyOrForward = shouldSuppressServerMarkReadOnReplyOrForward(
        tableView
    );
    let instrumentationContexts;
    if (tableView.tableQuery.type == TableQueryType.Search) {
        instrumentationContexts = getInstrumentationContextsFromTableView([rowKey], tableView);
    }
    const listViewType: ReactListViewType = tableView.tableQuery.listViewType;
    const isSingleMessage: boolean =
        listViewType === ReactListViewType.Message || shouldShowUnstackedReadingPane();

    switch (responseType) {
        case ResponseType.Forward:
            if (isSingleMessage) {
                lazyForwardItem.importAndExecute(
                    rowId,
                    actionSource,
                    instrumentationContexts,
                    suppressServerMarkReadOnReplyOrForward
                );
                break;
            }

            // Conversation
            lazyForwardConversation.importAndExecute(
                rowId,
                actionSource,
                instrumentationContexts,
                suppressServerMarkReadOnReplyOrForward
            );
            break;

        case ResponseType.Reply:
        case ResponseType.ReplyAll:
            if (isSingleMessage) {
                lazyReplyToItem.importAndExecute(
                    rowId,
                    responseType === ResponseType.ReplyAll,
                    actionSource,
                    instrumentationContexts,
                    suppressServerMarkReadOnReplyOrForward
                );
                break;
            }

            // Conversation
            lazyReplyToConversation.importAndExecute(
                rowId,
                responseType === ResponseType.ReplyAll,
                actionSource,
                instrumentationContexts,
                suppressServerMarkReadOnReplyOrForward
            );
            break;

        default:
            break;
    }
}

export async function onReplyWithMeeting(actionSource: ActionSource) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKey = [...tableView.selectedRowKeys.keys()][0];
    const listViewType: ReactListViewType = tableView.tableQuery.listViewType;
    const isConversation: boolean =
        listViewType !== ReactListViewType.Message && !shouldShowUnstackedReadingPane();
    let rowId = MailRowDataPropertyGetter.getRowIdToShowInReadingPane(rowKey, tableView);

    if (isConversation) {
        const getLatestNonDraftItemIdFromConversation = await lazyGetLatestNonDraftItemIdFromConversation.import();
        rowId = await getLatestNonDraftItemIdFromConversation(rowId);
    }

    if (rowId) {
        lazyReplyByMeeting.importAndExecute(
            rowId.Id,
            undefined /*calendarInlineComposeViewState*/,
            false /*shouldSend*/,
            actionSource
        );
    }
}
