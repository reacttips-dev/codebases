import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import type MailTipDetails from '../store/schema/MailTipDetails';

/**
 * Utility to check whether large audience mailtip to be shown or not.
 * returns true when totalRecipeintCount is greater than or equal to
 * UserConfiguration.MailTipsLargeAudienceThreshold and there is atleast one
 * group in list of recipients added.
 */
const shouldShowLargeAudienceMailTip = (recipientInfos: MailTipDetails[]): boolean => {
    const { totalRecipients, hasAGroup } = recipientInfos.reduce(
        (acc, recipientInfo) => ({
            totalRecipients: acc.totalRecipients + recipientInfo.count,
            hasAGroup: acc.hasAGroup || recipientInfo.count > 1,
        }),
        { totalRecipients: 0, hasAGroup: false }
    );

    return hasAGroup && totalRecipients >= getUserConfiguration().MailTipsLargeAudienceThreshold;
};

export default shouldShowLargeAudienceMailTip;
