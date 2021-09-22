import { setCurrentRequestId } from '../actions/setCurrentRequestId';
import { isCurrentRequestId } from '../selectors/isCurrentRequestId';

export async function withCurrentRequestCheck<T>(
    requestFunction: () => Promise<T> | T,
    requestIdentifier: string
): Promise<{ response: T } & { isCurrent: boolean }> {
    const requestId = Math.random();
    setCurrentRequestId(requestIdentifier, requestId);
    let requestFunctionResponsePart = await requestFunction();
    const isCurrentResponsePart = {
        isCurrent: isCurrentRequestId(requestIdentifier, requestId),
    };
    return { ...{ response: requestFunctionResponsePart }, ...isCurrentResponsePart };
}
