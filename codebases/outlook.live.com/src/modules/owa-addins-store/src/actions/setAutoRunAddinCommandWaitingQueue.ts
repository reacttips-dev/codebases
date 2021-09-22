import { mutatorAction } from 'satcheljs';
import getExtensibilityState from '../store/getExtensibilityState';
import type IExtendedAddinCommand from '../store/schema/interfaces/IExtendedAddinCommand';

export default mutatorAction(
    'setAutoRunAddinCommandWaitingQueue',
    (extendedAddinCommand: IExtendedAddinCommand, hostItemIndex: string) => {
        const autoRunAddinCommandWaitingQueue = getExtensibilityState()
            .autoRunAddinCommandWaitingQueue;

        if (!autoRunAddinCommandWaitingQueue.has(hostItemIndex)) {
            autoRunAddinCommandWaitingQueue.set(hostItemIndex, new Array<IExtendedAddinCommand>());
        }
        autoRunAddinCommandWaitingQueue.get(hostItemIndex).push(extendedAddinCommand);
    }
);
