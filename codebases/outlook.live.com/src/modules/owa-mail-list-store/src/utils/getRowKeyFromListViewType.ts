import type { MailListRowDataType } from '../index';
import type { ConversationType, ItemRow } from 'owa-graph-schema';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { trace } from 'owa-trace';

/**
 * Get the row instance key from the list view type
 * @param row the row data
 * @param listViewType the list view type
 */
export default function getRowKeyFromListViewType(
    row: MailListRowDataType,
    listViewType: ReactListViewType
): string {
    switch (listViewType) {
        case ReactListViewType.Conversation:
            return (row as ConversationType).InstanceKey;

        case ReactListViewType.Message:
            return (row as ItemRow).InstanceKey;

        default:
            trace.warn('listViewType:' + listViewType + ' not supported');
            return null;
    }
}
