import onMailTipRetrieved from '../actions/onMailTipRetrieved';
import updateMailtips from '../actions/updateMailtips';
import getMailTips from '../selectors/getMailTips';
import getMailTipsService from '../services/getMailTipsService';
import addMailTipsToCache from '../utils/addMailTipsToCache';
import getMailTipsInformationFromXML from '../utils/getMailTipsInformationFromXML';
import { logUsage } from 'owa-analytics';
import { orchestrator } from 'satcheljs';

/**
 * Calls getMailTips and stores the response in MailTipsCache by calling addMailTipsToCache
 */
export default orchestrator(updateMailtips, async actionMessage => {
    const { composeId, fromEmailAddress, recipients } = actionMessage;

    // We make the service call for the below conditions:
    // 1. If there are no mailTips for the given sender email address in which case we know that there doesn't exist any mailTips for the recipient + sender combination
    // 2. If there are no mailTips present for the recipient email address.
    if (fromEmailAddress && recipients && recipients.length) {
        const mailTips = getMailTips();
        const uncachedRecipientEmailAddresses = recipients.filter(recipientEmailAddress => {
            return (
                recipientEmailAddress &&
                !mailTips.containsValueForKey(fromEmailAddress, recipientEmailAddress)
            );
        });
        if (uncachedRecipientEmailAddresses.length) {
            // Make service call
            const response = await getMailTipsService(
                fromEmailAddress,
                uncachedRecipientEmailAddresses
            );
            // Populate response
            if (response) {
                const mailTipsInformationArray = response.ResponseMessages.map(
                    singleResponseMessage => {
                        return getMailTipsInformationFromXML(singleResponseMessage.MessageText);
                    }
                ).filter(value => !!value);
                if (mailTipsInformationArray && mailTipsInformationArray.length > 0) {
                    addMailTipsToCache(mailTipsInformationArray, fromEmailAddress);
                    onMailTipRetrieved(composeId, fromEmailAddress);
                }
            }
        }

        // Log datapoint
        let cachedRecipients = recipients.filter(
            recipient => uncachedRecipientEmailAddresses.indexOf(recipient) == -1
        );

        logUsage('UpdateMailtipsDatapoint', {
            owa_1: cachedRecipients.length > 0,
            rec: recipients.length,
            ca: cachedRecipients.length,
        });
    }
});
