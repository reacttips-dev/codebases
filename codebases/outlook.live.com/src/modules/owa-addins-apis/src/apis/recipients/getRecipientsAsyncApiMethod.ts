import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type Recipient from './Recipient';
import type { RecipientFieldEnum } from 'owa-addins-apis-types';
import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { getRecipientType } from '../getInitialData/EmailAddressDetails';

export interface GetRecipientsArgs {
    recipientField: RecipientFieldEnum;
}

export const MAX_RECIPIENTS: number = 500;

export default function getRecipientsAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: GetRecipientsArgs,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    const wrappers: EmailAddressWrapper[] = adapter.getRecipients(data.recipientField);
    let recipients: Recipient[] = [];

    recipients = wrappers.slice(0, MAX_RECIPIENTS).map(
        wrapper =>
            <Recipient>{
                name: wrapper.Name,
                address: wrapper.EmailAddress,
                recipientType: getRecipientType(wrapper.MailboxType),
            }
    );

    callback(createSuccessResult(recipients));
}
