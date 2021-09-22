import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import type { EmailAddressDetails } from '../getInitialData/EmailAddressDetails';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';

export default function getFromAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    const from: EmailAddressWrapper = adapter.getFrom();
    if (!from) {
        callback(createErrorResult());
        return;
    }
    const details: EmailAddressDetails = { name: from.Name, address: from.EmailAddress };
    callback(createSuccessResult(details));
}
