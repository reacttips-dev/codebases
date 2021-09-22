import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

/**
 * Get the list view type string corresponding to the enum
 * @param listViewType the list view type of the table view
 */
export default function getListViewTypeString(listViewType: ReactListViewType): string {
    let listViewTypeString: string;
    switch (listViewType) {
        case ReactListViewType.Conversation:
            listViewTypeString = 'Conversation';
            break;

        case ReactListViewType.Message:
            listViewTypeString = 'Message';
            break;

        default:
            listViewTypeString = 'Unknown';
            break;
    }

    return listViewTypeString;
}
