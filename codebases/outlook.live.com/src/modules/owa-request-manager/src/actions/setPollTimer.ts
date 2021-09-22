import { mutatorAction } from 'satcheljs';
import { store } from '../store/store';

export const setPollTimer = mutatorAction(
    'setPollTimer',
    (requestIdentifier: string, timer: NodeJS.Timer | null) => {
        const currentRequest = store().currentRequest.get(requestIdentifier);
        if (currentRequest) {
            currentRequest.timer = timer;
        }
    }
);
