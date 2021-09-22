import getAllAttachmentIds from '../utils/getAllAttachmentIds';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { lazyGetAttachment } from 'owa-attachment-model-store';
import { lazyGetAccessIssuesForAttachments } from 'owa-attachment-policy-access-issue-checker';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

export default async function loadAttachmentPolicyInfoBars(composeViewState: ComposeViewState) {
    const composeAttachments = await getAllAttachments(composeViewState);
    const getAccessIssuesForAttachments = await lazyGetAccessIssuesForAttachments.import();
    const infoBarIds = getAccessIssuesForAttachments(composeAttachments);
    infoBarIds.forEach(id => addInfoBarMessage(composeViewState, id));
}

async function getAllAttachments(composeViewState: ComposeViewState): Promise<AttachmentType[]> {
    const getAttachment = await lazyGetAttachment.import();
    return getAllAttachmentIds(composeViewState).map(a => getAttachment(a).model);
}
