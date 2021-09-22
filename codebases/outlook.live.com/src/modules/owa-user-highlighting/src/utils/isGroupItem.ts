import type { ClientItem } from 'owa-mail-store';

export default function isGroupItem(item: ClientItem): boolean {
    return item?.MailboxInfo && item.MailboxInfo.type == 'GroupMailbox';
}
