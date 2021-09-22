import type { MailboxInfo } from 'owa-client-ids';
import { getSelectedTableView } from 'owa-mail-list-store';
import { getMailboxInfo } from './index';

// This method is temporary and should not be used without a plan of getting it removed
// mailboxInfo should always come from the ItemId
export default function getCurrentTableMailboxInfo(): MailboxInfo {
    return getMailboxInfo(getSelectedTableView());
}
