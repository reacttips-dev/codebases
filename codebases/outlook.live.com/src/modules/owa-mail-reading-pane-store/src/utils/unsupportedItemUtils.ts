import folderStore, { getEffectiveFolderDisplayName } from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import mailStore from 'owa-mail-store/lib/store/Store';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';
import type Item from 'owa-service/lib/contract/Item';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

const APPOINTMENT_CLASS_NAME = 'IPM.Appointment';
const CONTACT_CLASS_NAME = 'IPM.Contact';
const DISTRIBUTION_LIST_CLASS_NAME = 'IPM.DistList';
const TASK_CLASS_NAME = 'IPM.Task';
const CALENDAR_FOLDERID_NAME: DistinguishedFolderIdName = 'calendar';
const CONTACTS_FOLDERID_NAME: DistinguishedFolderIdName = 'contacts';
const TASK_FOLDERID_NAME: DistinguishedFolderIdName = 'tasks';
const INBOX_FOLDERID_NAME: DistinguishedFolderIdName = 'inbox';

export function isUnsupportedItem(item: Item): boolean {
    return (
        item &&
        (isAppointmentItemClass(item.ItemClass) ||
            isContactItemClass(item.ItemClass) ||
            isDistributionListItemClass(item.ItemClass) ||
            isTaskItemClass(item.ItemClass))
    );
}

export function getUnsupportedItemIdFromConversation(conversationId: string): string {
    const itemParts = mailStore.conversations.get(conversationId);
    const conversationNode = mailStore.conversationNodes.get(
        itemParts && itemParts.conversationNodeIds[0]
    );
    if (conversationNode) {
        const itemId = conversationNode.itemIds[0];
        if (isUnsupportedItem(mailStore.items.get(itemId))) {
            return itemId;
        }
    }

    return null;
}

export function getDefaultFolderId(itemId: string): string {
    const item = mailStore.items.get(itemId);
    if (isAppointmentItemClass(item.ItemClass)) {
        return folderNameToId(CALENDAR_FOLDERID_NAME);
    } else if (isContactItemClass(item.ItemClass) || isDistributionListItemClass(item.ItemClass)) {
        return folderNameToId(CONTACTS_FOLDERID_NAME);
    } else if (isTaskItemClass(item.ItemClass)) {
        return folderNameToId(TASK_FOLDERID_NAME);
    } else {
        return folderNameToId(INBOX_FOLDERID_NAME);
    }
}

export function getFolderName(folderId: string): string {
    let folderName = '';
    const folder: MailFolder = folderStore.folderTable.get(folderId);
    if (folder) {
        folderName = getEffectiveFolderDisplayName(folder);
    }

    return folderName;
}

function isAppointmentItemClass(itemClass: string): boolean {
    return itemClass.indexOf(APPOINTMENT_CLASS_NAME) == 0;
}

function isContactItemClass(itemClass: string): boolean {
    return itemClass.indexOf(CONTACT_CLASS_NAME) == 0;
}

function isDistributionListItemClass(itemClass: string): boolean {
    return itemClass.indexOf(DISTRIBUTION_LIST_CLASS_NAME) == 0;
}

function isTaskItemClass(itemClass: string): boolean {
    return itemClass.indexOf(TASK_CLASS_NAME) == 0;
}
