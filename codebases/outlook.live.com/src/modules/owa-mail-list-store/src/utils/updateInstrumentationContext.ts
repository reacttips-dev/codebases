import getTableConversationRelation from './getTableConversationRelation';
import getTableItemRelation from './getTableItemRelation';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type TableView from '../store/schema/TableView';

export default function updateInstrumentationContext(
    rowKey: string,
    tableView: TableView,
    instrumentationContext: InstrumentationContext
) {
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            const tableConversationRelation = getTableConversationRelation(rowKey, tableView.id);
            tableConversationRelation.instrumentationContext = instrumentationContext;
            break;
        case ReactListViewType.Message:
            const tableItemRelation = getTableItemRelation(rowKey, tableView.id);
            tableItemRelation.instrumentationContext = instrumentationContext;
            break;
    }
}
