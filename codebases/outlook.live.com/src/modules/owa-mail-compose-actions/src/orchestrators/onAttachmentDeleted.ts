import loadAttachmentPolicyInfoBars from './loadAttachmentPolicyInfoBars';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import findComposeViewStateById, { IdSource } from '../utils/findComposeViewStateById';
import { AttachmentStatusEnum } from 'owa-addins-core';
import { refreshSharingTips } from '../utils/refreshSharingTips';
import triggerAttachmentsChanged from '../utils/triggerAttachmentsChanged';
import { AccessIssues, getInfoBarId } from 'owa-attachment-policy-access-issue-checker';
import { onAttachmentDeleted } from 'owa-attachment-well-data';
import { orchestrator } from 'satcheljs';
import deleteContentWithSelector from 'owa-addins-editor-plugin/lib/utils/deleteContentWithSelector';
import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';

orchestrator(onAttachmentDeleted, actionMessage => {
    const composeViewState = findComposeViewStateById(
        actionMessage.parentItemId,
        IdSource.ComposeItem
    );
    if (composeViewState) {
        // clear the attachment issue infobars, and reload based on remaining attachments
        const potentialAccessIssueInfoBarIds = AccessIssues.map(getInfoBarId);
        removeInfoBarMessage(composeViewState, potentialAccessIssueInfoBarIds);
        loadAttachmentPolicyInfoBars(composeViewState);
        refreshSharingTips(composeViewState);

        // when InlineAttachmnet is deleted, it gets deleted from attachmentWell but it remains in Compose mail body,
        // So it appears as broken image link. Below code will remove inline attachmnet from body content.
        if (actionMessage.attachment.IsInline) {
            const cid = 'cid:' + actionMessage.attachment.ContentId;
            deleteContentWithSelector(composeViewState, `img[originalsrc^="${cid}"]`);
            updateContentToViewState(composeViewState);
        }

        if (actionMessage.shouldTriggerAddInAttachmentsChangedCallback) {
            // Trigger AttachmentsChanged event for any OWA addins.
            triggerAttachmentsChanged(
                composeViewState.composeId,
                AttachmentStatusEnum.Deleted,
                actionMessage.attachment
            );
        }
    }
});
