import { mutatorAction } from 'satcheljs';
import type AttachmentWellViewState from '../schema/AttachmentWellViewState';

export default mutatorAction(
    'changeTotalClassicAttachmentSize',
    function changeTotalClassicAttachmentSize(
        attachmentWell: AttachmentWellViewState,
        offset: number
    ) {
        attachmentWell.totalClassicAttachmentSize += offset;
    }
);
