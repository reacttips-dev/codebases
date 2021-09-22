import getMailTipsViewStateMapFromRecipientEmailAddress from 'owa-mail-tips/lib/utils/getMailTipsViewStateMapFromRecipientEmailAddress';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type { MailTipsViewStateMap } from 'owa-mail-tips/lib/datapoints';
import type ReadWriteRecipientWellViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientWellViewState';
import getCurrentFromAddress from './getFromAddressFromRecipientWell';

/**
 * Returns MailTipsViewStateMap for the recipient email addresses
 * @param recipientWell is the well containing email address
 * @param emailAddresses are the attendee email addresses
 */
export default function getMailTipsViewStateMap(
    recipientWell: ReadWriteRecipientWellViewState,
    emailAddresses: EmailAddressWrapper[]
): MailTipsViewStateMap {
    let mailTipsViewStateMap;
    const fromEmailAddress = getCurrentFromAddress(recipientWell);
    if (fromEmailAddress) {
        // Log datapoint
        mailTipsViewStateMap = getMailTipsViewStateMapFromRecipientEmailAddress(
            emailAddresses,
            fromEmailAddress
        );
    }
    return mailTipsViewStateMap;
}
