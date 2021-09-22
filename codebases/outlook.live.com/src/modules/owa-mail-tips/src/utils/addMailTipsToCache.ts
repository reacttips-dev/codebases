import type MailTipsInformation from '../store/schema/MailTipsInformation';
import getMailTips from '../selectors/getMailTips';
import MailTipsCacheEntry from '../store/schema/MailTipsCacheEntry';

/**
 * Populate MailTipsCache with MailTipsInformation object for a given from address
 * @param {MailTipsInformation[]} mailTipsInformationArray containing mailtips information to be saved in cache
 * @param {string} fromEmailAddress is the sender email address
 */
export default function addMailTipsToCache(
    mailTipsInformationArray: MailTipsInformation[],
    fromEmailAddress: string
) {
    if (mailTipsInformationArray && mailTipsInformationArray.length > 0 && fromEmailAddress) {
        const mailTips = getMailTips();

        mailTipsInformationArray.map(mailTipsInformation => {
            mailTips.add(
                fromEmailAddress,
                new MailTipsCacheEntry(
                    mailTipsInformation,
                    fromEmailAddress,
                    mailTipsInformation.RecipientAddress
                )
            );
        });
    }
}
