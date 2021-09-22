import { mutatorAction } from 'satcheljs';
import { store } from '../store/store';

export const setCurrentRequestId = mutatorAction(
    'setCurrentRequestId',
    (requestIdentifier: string, rId: number) => {
        let req = store().currentRequest.get(requestIdentifier);
        if (req) {
            req.requestId = rId;
        } else {
            store().currentRequest.set(requestIdentifier, { requestId: rId, timer: null });
        }
    }
);
