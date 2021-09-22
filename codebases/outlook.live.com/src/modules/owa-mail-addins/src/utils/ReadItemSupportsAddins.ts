import { isGroupsEnabled } from 'owa-account-capabilities/lib/isGroupsEnabled';
import type { ClientItem } from 'owa-mail-store';
import type Item from 'owa-service/lib/contract/Item';

function isIRM(item: Item): boolean {
    return item.RightsManagementLicenseData != null;
}

function isSMIME(itemClass: string): boolean {
    return (
        itemClass.indexOf('ipm.note.smime') == 0 &&
        itemClass.indexOf('ipm.note.smime.multipartsigned') == -1
    );
}

function isReport(itemClass: string): boolean {
    return itemClass.indexOf('report') == 0;
}

export default function readItemSupportsAddins(item: ClientItem): boolean {
    if (!item) {
        return false;
    } else if (isIRM(item)) {
        return false;
    } else if (item.IsDraft) {
        return false;
    } else if (isGroupsEnabled() && item.MailboxInfo && item.MailboxInfo.type === 'GroupMailbox') {
        return false;
    } else {
        const itemClass = item.ItemClass.toLowerCase();
        if (isSMIME(itemClass) || isReport(itemClass)) {
            return false;
        }
    }

    return true;
}
