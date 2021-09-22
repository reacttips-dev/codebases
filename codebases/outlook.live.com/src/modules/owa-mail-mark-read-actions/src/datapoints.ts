import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import {
    TableView,
    MailRowDataPropertyGetter,
    getFocusedFilterForTable,
    getRowKeysFromRowIds,
    getViewFilterForTable,
} from 'owa-mail-list-store';
import type { ActionSource } from 'owa-analytics-types';

export default {
    markConversationAsRead: {
        name: (
            conversationIds: string[],
            tableView: TableView,
            isReadValue: boolean,
            isExplicit: boolean,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[],
            rowKeysToUpdate: string[]
        ) => {
            let name = 'TnS_MarkConversation';
            name += isReadValue ? 'Read' : 'Unread';
            if (!isExplicit) {
                name += 'Background';
            }
            return name;
        },
        options: (
            conversationIds: string[],
            tableView: TableView,
            isReadValue: boolean,
            isExplicit: boolean,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[],
            rowKeysToUpdate: string[]
        ) => {
            return isExplicit ? { isCore: true } : { sessionSampleRate: 10 };
        },
        customData: (
            conversationIds: string[],
            tableView: TableView,
            isReadValue: boolean,
            isExplicit: boolean,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[],
            rowKeysToUpdate: string[]
        ) => [
            actionSource,
            conversationIds.length,
            getFocusedFilterForTable(tableView),
            getViewFilterForTable(tableView),
        ],
        cosmosOnlyData: (
            conversationIds: string[],
            tableView: TableView,
            isReadValue: boolean,
            isExplicit: boolean,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[],
            rowKeysToUpdate: string[]
        ) => {
            const itemIds = [];
            const rowKeys = getRowKeysFromRowIds(conversationIds, tableView);

            for (const rowKey of rowKeys) {
                itemIds.push(MailRowDataPropertyGetter.getItemIds(rowKey, tableView));
            }

            return JSON.stringify({ itemIds: itemIds, conversationIds: conversationIds });
        },
    },
    markItemReadUnread: {
        name: (
            tableView: TableView,
            itemIds: string[],
            isReadValue: boolean,
            isExplicit: boolean,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[]
        ) => {
            let name = 'TnS_MarkItem';
            name += isReadValue ? 'Read' : 'Unread';
            if (!isExplicit) {
                name += 'Background';
            }
            return name;
        },
        options: (
            tableView: TableView,
            itemIds: string[],
            isReadValue: boolean,
            isExplicit: boolean,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[]
        ) => {
            return isExplicit ? { isCore: true } : {};
        },
        customData: (
            tableView: TableView,
            itemIds: string[],
            isReadValue: boolean,
            isExplicit: boolean,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[]
        ) => {
            // Tableview will be null in photohub
            const tableQueryType = tableView ? tableView.tableQuery.type : null;
            const focusedFilter = tableView ? getFocusedFilterForTable(tableView) : null;
            const viewFilter = tableView ? getViewFilterForTable(tableView) : null;
            return [tableQueryType, itemIds.length, focusedFilter, viewFilter];
        },
        cosmosOnlyData: (
            tableView: TableView,
            itemIds: string[],
            isReadValue: boolean,
            isExplicit: boolean,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[]
        ) => {
            return JSON.stringify({ itemIds: itemIds });
        },
        actionSource: (
            tableView: TableView,
            itemIds: string[],
            isReadValue: boolean,
            isExplicit: boolean,
            actionSource: ActionSource
        ) => actionSource,
    },
};
