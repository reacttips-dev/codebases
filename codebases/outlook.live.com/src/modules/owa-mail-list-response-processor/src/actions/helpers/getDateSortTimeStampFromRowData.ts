import type { ConversationType, ItemRow } from 'owa-graph-schema';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type { MailListRowDataType } from 'owa-mail-list-store';

/**
 * Get the date sort time stamp from server row data
 * @param row the row data
 * @param listViewType of the table
 * @returns the lastDeliveryOrRenewTimeStamp and lastDeliveryTimeStamp of the row data
 */
export default function getDateSortTimeStampFromRowData(
    row: MailListRowDataType,
    listViewType: ReactListViewType
) {
    let lastDeliveryOrRenewTimeStamp;
    let lastDeliveryTimeStamp;
    switch (listViewType) {
        case ReactListViewType.Conversation:
            lastDeliveryOrRenewTimeStamp = (row as ConversationType).LastDeliveryOrRenewTime;
            lastDeliveryTimeStamp = (row as ConversationType).LastDeliveryTime;
            break;

        case ReactListViewType.Message:
            lastDeliveryOrRenewTimeStamp = (row as ItemRow).ReceivedOrRenewTime;
            lastDeliveryTimeStamp = (row as ItemRow).DateTimeReceived;
            break;
    }

    return { lastDeliveryOrRenewTimeStamp, lastDeliveryTimeStamp };
}
