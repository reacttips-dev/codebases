import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export interface SetSubjectArgs {
    subject: string;
}

const MAX_SUBJECT_LENGTH: number = 255;

export default function setSubjectAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: SetSubjectArgs,
    callback: ApiMethodCallback
) {
    if (data.subject.length > MAX_SUBJECT_LENGTH) {
        callback(createErrorResult(null));
        return;
    }

    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    adapter.setSubject(data.subject);
    callback(createSuccessResult());
}
