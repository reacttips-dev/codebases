import { getStore } from '../store/Store';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import { isConversationView, TableView } from 'owa-mail-list-store';

export default function getListViewColumnWidths(
    tableView: TableView
): {
    senderColumnWidth: number;
    subjectColumnWidth: number;
    receivedColumnWidth: number;
} {
    let senderColumnWidth = getStore().senderColumnWidth || 332;
    let subjectColumnWidth = getStore().subjectColumnWidth || 1000;
    let receivedColumnWidth = getStore().receivedColumnWidth || 80;

    const isSenderImageOff = getIsBitSet(ListViewBitFlagsMasks.HideSenderImage);
    const _isConversationView = isConversationView(tableView);

    if (_isConversationView && !isSenderImageOff) {
        senderColumnWidth += 68;
    }

    if (_isConversationView && isSenderImageOff) {
        senderColumnWidth += 53;
    }

    if (!_isConversationView && !isSenderImageOff) {
        senderColumnWidth += 48;
    }

    if (!_isConversationView && isSenderImageOff) {
        senderColumnWidth += 40;
    }

    // Remove 6 pixels for column spacing
    subjectColumnWidth -= 6;

    return {
        senderColumnWidth,
        subjectColumnWidth,
        receivedColumnWidth,
    };
}
