import { loadItemAttachment } from 'owa-attachment-preview-sxs-actions';
import { lazyLoadItemAttachment } from 'owa-itemattachment-store';
import { orchestrator } from 'satcheljs';

orchestrator(loadItemAttachment, actionMessage => {
    const { itemAttachmentId, perfDatapoint } = actionMessage;
    lazyLoadItemAttachment.importAndExecute(itemAttachmentId, perfDatapoint);
});
