import { getStore } from '../store/Store';
import { mutatorAction } from 'satcheljs';

export const onSenderColumnWidthChangedInternal = mutatorAction(
    'onSenderColumnWidthChangedInternal',
    (senderColumnWidth: number) => {
        getStore().senderColumnWidth = senderColumnWidth;
    }
);

export const onSubjectColumnWidthChangedInternal = mutatorAction(
    'onSubjectColumnWidthChangedInternal',
    (subjectColumnWidth: number) => {
        getStore().subjectColumnWidth = subjectColumnWidth;
    }
);

export const onReceivedColumnWidthChangedInternal = mutatorAction(
    'onReceivedColumnWidthChangedInternal',
    (receivedColumnWidth: number) => {
        getStore().receivedColumnWidth = receivedColumnWidth;
    }
);
