import type BodyType from 'owa-service/lib/contract/BodyType';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';

export default function getBodyTypeAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
): void {
    const adapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    const bodyType: BodyType = adapter.getBodyType();
    const typeString: string = (bodyType && bodyType.toLowerCase()) || null;

    callback(createSuccessResult(typeString));
}
