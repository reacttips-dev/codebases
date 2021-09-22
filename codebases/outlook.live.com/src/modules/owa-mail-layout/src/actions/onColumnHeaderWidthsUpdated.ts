import { getStore } from '../store/Store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'onColumnHeaderWidthsUpdated',
    (senderColumnWidth: number, subjectColumnWidth: number, receivedColumnWidth: number) => {
        getStore().senderColumnWidth = senderColumnWidth;
        getStore().subjectColumnWidth = subjectColumnWidth;
        getStore().receivedColumnWidth = receivedColumnWidth;
    }
);
