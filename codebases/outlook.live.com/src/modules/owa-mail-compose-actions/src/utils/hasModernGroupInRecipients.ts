import type { ComposeViewState } from 'owa-mail-compose-store';
import { getAllRecipients } from './getAllRecipientsAsEmailAddressStrings';

const GROUP_MAIL_BOX = 'GroupMailbox';

/**
 * This util will return
 * True - If the any of the recipients are of type GroupMailbox,
 * False- When no recipients are present or no recipients are of type GroupMailbox
 */
export default function hasModernGroupInRecipients(viewState: ComposeViewState): boolean {
    return getAllRecipients(viewState).some(recipient => recipient.MailboxType == GROUP_MAIL_BOX);
}
