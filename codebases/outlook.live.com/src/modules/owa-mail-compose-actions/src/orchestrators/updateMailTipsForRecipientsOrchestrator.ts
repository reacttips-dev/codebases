import { orchestrator } from 'satcheljs';
import updateMailtips from 'owa-mail-tips/lib/actions/updateMailtips';
import getCurrentFromAddress from '../utils/getFromAddressFromRecipientWell';
import getRecipientEmailAddress from 'owa-recipient-common/lib/utils/getRecipientEmailAddress';
import updateMailTipsForRecipients from '../actions/updateMailTipsForRecipients';

/**
 * Calls updateMailtips action in owa-mail-tips with an array of recipient email addresses and from email address
 */
export default orchestrator(updateMailTipsForRecipients, actionMessage => {
    const { composeId, recipientWell, recipients } = actionMessage;
    if (recipientWell && recipients && recipients.length) {
        const recipientEmailAddresses = recipients.map(recipient => {
            return getRecipientEmailAddress(recipient);
        });
        const fromEmailAddress = getCurrentFromAddress(recipientWell);
        updateMailtips(composeId, fromEmailAddress, recipientEmailAddresses);
    }
});
