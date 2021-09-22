import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { action } from 'satcheljs';

export default action(
    'createFeedbackForCortana',
    (
        source: any,
        groupId: string,
        toRecipients: EmailAddressWrapper[],
        subject: string,
        body: string
    ) => ({
        source,
        groupId,
        toRecipients,
        subject,
        body,
    })
);
