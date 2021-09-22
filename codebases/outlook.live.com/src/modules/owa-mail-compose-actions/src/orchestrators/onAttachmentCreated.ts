import loadAttachmentPolicyInfoBars from './loadAttachmentPolicyInfoBars';
import findComposeViewStateById, { IdSource } from '../utils/findComposeViewStateById';
import triggerAttachmentsChanged from '../utils/triggerAttachmentsChanged';
import { AttachmentStatusEnum } from 'owa-addins-core';
import { onAttachmentCreated } from 'owa-attachment-well-data';
import { orchestrator } from 'satcheljs';

orchestrator(onAttachmentCreated, actionMessage => {
    const composeViewState = findComposeViewStateById(
        actionMessage.attachmentId,
        IdSource.Attachment
    );
    if (composeViewState) {
        loadAttachmentPolicyInfoBars(composeViewState);

        if (actionMessage.shouldTriggerAddInAttachmentsChangedCallback) {
            // Trigger AttachmentsChanged event for any OWA addins."
            triggerAttachmentsChanged(
                composeViewState.composeId,
                AttachmentStatusEnum.Added,
                actionMessage.attachment
            );
        }
    }
});
