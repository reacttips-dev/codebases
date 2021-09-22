import {
    markAsReadNumberOfItems,
    markAsReadNumberOfConversations,
    markAsReadNumberOfConversationsWhenCountIsNegative,
    markAsReadNumberOfItemsWhenCountIsNegative,
} from 'owa-locstrings/lib/strings/markallasread.locstring.json';
import {
    markAsUnreadNumberOfConversationsWhenCountIsNegative,
    markAsUnreadNumberOfItemsWhenCountIsNegative,
    markAsUnreadNumberOfConversations,
    markAsUnreadNumberOfItems,
    markAsUnread,
} from 'owa-locstrings/lib/strings/markasunread.locstring.json';
import { markAsRead } from 'owa-locstrings/lib/strings/markasread.locstring.json';
import {
    markAsReadGroupFolderConversations,
    markAsReadGroupFolderItems,
    markAsUnreadGroupFolderConversations,
    markAsUnreadGroupFolderItems,
} from 'owa-locstrings/lib/strings/markasreadgroupfolder.locstring.json';
import loc, { format } from 'owa-localize';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { MAX_LABEL_ITEM_COUNT } from 'owa-mail-store/lib/utils/bulkTriageConstants';
import { trace } from 'owa-trace';
import {
    markAsReadFolderAllConversationsConfirmText,
    markAsReadFolderAllItemsConfirmText,
    markAsReadFolderSelectedConversationsConfirmText,
    markAsReadFolderSelectedItemsConfirmText,
} from '../actions/triage/markAsReadInTable.locstring.json';
import {
    markAsUnreadFolderAllConversationsConfirmText,
    markAsUnreadFolderAllItemsConfirmText,
    markAsUnreadFolderSelectedConversationsConfirmText,
    markAsUnreadFolderSelectedItemsConfirmText,
} from '../actions/triage/markAsUnreadInTable.locstring.json';
import type ReadUnreadConfirmText from './ConfirmDialogText';

/**
 * Gets the confirm text for mark as read/unread all dialog.
 * @param actOnAllItemsInFolder Flag determining whether we are acting on folder level for mark all as read
 * @param listViewType The view type of the folder being deleted
 * @param totalCount The total count of items in folder
 * @param displayName Display name of the folder, needed for confirm dialog body
 * @param isReadValueToSet is read value to be set
 * @param inVirtualSelectModeWithExclusion if in virtual select mode with exclusion list greater than 0
 * @param inSelectedRowsMode only a subset of rows are selected in the table view
 * @returns The text shown in mark as read/unread confirm dialog along with the body text
 */

export default function getMarkAsReadUnreadAllConfirmText(
    actOnAllItemsInFolder: boolean,
    listViewType: ReactListViewType,
    totalCount: number,
    displayName: string,
    isReadValueToSet: boolean,
    inVirtualSelectModeWithExclusion: boolean,
    inSelectedRowsMode: boolean,
    isGroup: boolean
): ReadUnreadConfirmText {
    let headerText = '';
    let bodyText = '';
    const isMessageView = listViewType === ReactListViewType.Message;
    const isActingOnItems = actOnAllItemsInFolder || isMessageView;

    // Determine the header text of the confirm dialog
    // Do not show the count if it happens to be negative
    if (totalCount < 0) {
        trace.warn('totalCount in getMarkAsReadUnreadAllConfirmText should not be negative.');
        headerText = isActingOnItems
            ? isReadValueToSet
                ? loc(markAsReadNumberOfItemsWhenCountIsNegative)
                : loc(markAsUnreadNumberOfItemsWhenCountIsNegative)
            : isReadValueToSet
            ? loc(markAsReadNumberOfConversationsWhenCountIsNegative)
            : loc(markAsUnreadNumberOfConversationsWhenCountIsNegative);
    }

    if (totalCount == 1) {
        headerText = isReadValueToSet ? loc(markAsRead) : loc(markAsUnread);
    }

    let totalCountToShow;
    if (totalCount < MAX_LABEL_ITEM_COUNT) {
        totalCountToShow = totalCount;
    } else {
        totalCountToShow = '10000+';
    }

    headerText = isActingOnItems
        ? isReadValueToSet
            ? format(loc(markAsReadNumberOfItems), totalCountToShow)
            : format(loc(markAsUnreadNumberOfItems), totalCountToShow)
        : isReadValueToSet
        ? format(loc(markAsReadNumberOfConversations), totalCountToShow)
        : format(loc(markAsUnreadNumberOfConversations), totalCountToShow);

    // Return the "items" text as for acting on folder level and mark as read from command bar
    // we are acting on items.
    if (actOnAllItemsInFolder) {
        bodyText = isReadValueToSet
            ? format(loc(markAsReadFolderAllItemsConfirmText), displayName)
            : format(loc(markAsUnreadFolderAllItemsConfirmText), displayName);
    }

    // If we are in virtual select mode with some rows deselected or we only have a small
    // set of rows selected, then we want to return "selected" items/conversations.
    else if (inVirtualSelectModeWithExclusion || inSelectedRowsMode) {
        bodyText = isMessageView
            ? isReadValueToSet
                ? format(loc(markAsReadFolderSelectedItemsConfirmText), displayName)
                : format(loc(markAsUnreadFolderSelectedItemsConfirmText), displayName)
            : isReadValueToSet
            ? format(loc(markAsReadFolderSelectedConversationsConfirmText), displayName)
            : format(loc(markAsUnreadFolderSelectedConversationsConfirmText), displayName);
    } else {
        // Either we are working from Mark All as Read condition at the folder level or we have
        // selected everything in the table with no exclusion list or not selected anything, we want to return "all" items/conversations.
        bodyText = isMessageView
            ? isReadValueToSet
                ? format(loc(markAsReadFolderAllItemsConfirmText), displayName)
                : format(loc(markAsUnreadFolderAllItemsConfirmText), displayName)
            : isReadValueToSet
            ? format(loc(markAsReadFolderAllConversationsConfirmText), displayName)
            : format(loc(markAsUnreadFolderAllConversationsConfirmText), displayName);
    }

    // For Groups, this is a special case, where we want to provide a complete string for the confirm dialog.
    if (isGroup) {
        bodyText = isMessageView
            ? isReadValueToSet
                ? loc(markAsReadGroupFolderItems)
                : loc(markAsUnreadGroupFolderItems)
            : isReadValueToSet
            ? loc(markAsReadGroupFolderConversations)
            : loc(markAsUnreadGroupFolderConversations);
    }

    return <ReadUnreadConfirmText>{
        headerText: headerText,
        bodyText: bodyText,
    };
}
