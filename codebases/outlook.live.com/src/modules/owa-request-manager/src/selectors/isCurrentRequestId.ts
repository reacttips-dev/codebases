import { store } from '../store/store';

export function isCurrentRequestId(requestIdentifier: string, requestId: number) {
    return store().currentRequest.get(requestIdentifier).requestId === requestId;
}
