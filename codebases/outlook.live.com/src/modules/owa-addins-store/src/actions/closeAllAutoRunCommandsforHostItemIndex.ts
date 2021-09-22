import { mutatorAction } from 'satcheljs';
import getExtensibilityState from '../store/getExtensibilityState';

export default mutatorAction('closeAllAutoRunCommandsforHostItemIndex', (hostItemIndex: string) => {
    const autoRunAddinCommandWaitingQueue = getExtensibilityState().autoRunAddinCommandWaitingQueue;
    autoRunAddinCommandWaitingQueue.delete(hostItemIndex);
});
