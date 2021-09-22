import type MailListItemDataProps from '../utils/types/MailListItemDataProps';
import type MailListTableProps from '../utils/types/MailListTableProps';

export default function getUnreadItemClass(
    itemProps: MailListItemDataProps,
    tableProps: MailListTableProps,
    isChecked: boolean,
    unreadClass: any, // Class to be applied when item is unread
    darkerUnreadClass: any // Class to be applied when item is unread (and has non-default background color)
) {
    const { isSelected, isFlagged, isPinned } = itemProps;
    const { supportsFlagging, supportsPinning } = tableProps;

    // Determine item state by checking item and table properties.
    const isItemSelected = isSelected || isChecked;
    const isItemFlagged = supportsFlagging && isFlagged;
    const isItemPinned = supportsPinning && isPinned;

    /**
     * If item is in a state with a non-default background color, return
     * darkerUnreadClass (which should set font color to be darker than unreadClass
     * does).
     */
    if (isItemSelected || isItemFlagged || isItemPinned) {
        return darkerUnreadClass;
    }

    // If item is unread and without any special state, return unreadClass.
    return unreadClass;
}
