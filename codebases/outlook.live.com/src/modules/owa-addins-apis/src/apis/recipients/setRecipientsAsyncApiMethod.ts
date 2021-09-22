import type AddSetRecipientsArgs from './AddSetRecipientsArgs';
import convertRecipientsToEmailAddressWrappers from './convertRecipientsToEmailAddressWrappers';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

export default function setRecipientsAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: AddSetRecipientsArgs,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    const emailAddressWrappers: EmailAddressWrapper[] = convertRecipientsToEmailAddressWrappers(
        data.recipientArray
    );
    try {
        adapter.setRecipients(data.recipientField, emailAddressWrappers);
        callback(createSuccessResult());
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}
