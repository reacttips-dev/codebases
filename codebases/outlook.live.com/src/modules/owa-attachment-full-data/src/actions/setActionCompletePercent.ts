import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setActionCompletePercent',
    function setActionCompletePercent(
        attachment: AttachmentFullViewState,
        completePercent: number
    ) {
        attachment.actionCompletePercent = completePercent;
    }
);
