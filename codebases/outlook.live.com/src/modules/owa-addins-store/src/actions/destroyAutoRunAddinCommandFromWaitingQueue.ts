import { mutatorAction } from 'satcheljs';
import getExtensibilityState from '../store/getExtensibilityState';
import type IAutoRunAddinCommand from '../store/schema/interfaces/IAutoRunAddinCommand';

export default mutatorAction(
    'destroyAutoRunAddinCommandFromWaitingQueue',
    (hostItemIndex: string, autoRunAddinCommand: IAutoRunAddinCommand) => {
        const autoRunAddinCommandWaitingQueue = getExtensibilityState()
            .autoRunAddinCommandWaitingQueue;
        if (autoRunAddinCommandWaitingQueue.has(hostItemIndex)) {
            const autoRunAddinQueue = autoRunAddinCommandWaitingQueue.get(hostItemIndex);
            for (let iter = 0; iter < autoRunAddinQueue.length; iter++) {
                if (autoRunAddinQueue[iter].addinCommand === autoRunAddinCommand) {
                    autoRunAddinQueue.splice(iter, 1);
                    break;
                }
            }
            if (autoRunAddinQueue.length === 0) {
                autoRunAddinCommandWaitingQueue.delete(hostItemIndex);
            }
        }
    }
);
