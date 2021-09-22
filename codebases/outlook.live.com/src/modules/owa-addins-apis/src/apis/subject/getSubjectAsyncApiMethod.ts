import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';

export default function getSubjectAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    const subject: string = adapter.getSubject() || '';
    callback(createSuccessResult(subject));
}
