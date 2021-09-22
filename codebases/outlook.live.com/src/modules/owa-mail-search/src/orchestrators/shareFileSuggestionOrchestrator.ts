import { orchestrator } from 'satcheljs';
import { exitSearch, shareFileSuggestion } from 'owa-search-actions';
import { lazyCreateAttachmentFileFromExistingMailboxAttachment } from 'owa-attachment-well-data';
import { shareByEmail } from 'owa-attachment-sharebyemail';
import { ComposeTarget } from 'owa-mail-compose-store';
import { newMessageV3 } from 'owa-mail-actions/lib/composeActions';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

export default orchestrator(shareFileSuggestion, async actionMessage => {
    const { attachmentType, scenarioId } = actionMessage;
    if ((attachmentType as ReferenceAttachment).ProviderType) {
        newMessageV3(
            'SearchBoxSuggestionDropDown',
            null /* groupId */,
            null /* toEmailAddressWrappers */,
            null /* subject */,
            `<div>${encodeURI((attachmentType as ReferenceAttachment).AttachLongPathName)}</div>`
        );
    } else {
        const createAttachmentFileFromExistingMailboxAttachment = await lazyCreateAttachmentFileFromExistingMailboxAttachment.import();
        attachmentType.Size = 0; //Setting size as 0 to work around a check in getAttachmentInfo that does not apply in this case
        const attachmentFile = createAttachmentFileFromExistingMailboxAttachment(attachmentType);
        shareByEmail([attachmentFile], ComposeTarget.SecondaryTab);
    }

    exitSearch('CommandExecuted', scenarioId);
});
