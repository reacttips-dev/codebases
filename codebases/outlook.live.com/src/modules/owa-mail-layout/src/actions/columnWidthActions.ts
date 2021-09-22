import { action } from 'satcheljs';

export const onFirstColumnHandleChanged = action(
    'onFirstColumnHandleChanged',
    (senderColumnWidth: number, subjectColumnWidth: number) => ({
        senderColumnWidth,
        subjectColumnWidth,
    })
);

export const onSecondColumnHandleChanged = action(
    'onSecondColumnHandleChanged',
    (subjectColumnWidth: number, receivedColumnWidth: number) => ({
        subjectColumnWidth,
        receivedColumnWidth,
    })
);
