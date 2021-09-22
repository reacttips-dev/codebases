import { orchestrator } from 'satcheljs';
import { downloadFileSuggestion, exitSearch } from 'owa-search-actions';
import { downloadFileFromUrl } from 'download-file-from-url';
import { getUserMailboxInfo, ClientAttachmentId } from 'owa-client-ids';
import { getAttachmentUrl } from 'owa-attachment-url';
import { isAttachmentOfFileType } from 'owa-attachment-type/lib/isAttachmentOfFileType';

export default orchestrator(downloadFileSuggestion, actionMessage => {
    let downloadUrl = '';
    //Create download url for classic attachments
    if (isAttachmentOfFileType(actionMessage.attachmentType)) {
        const attachmentId: ClientAttachmentId = {
            Id: actionMessage.attachmentId,
            mailboxInfo: getUserMailboxInfo(),
        };
        downloadUrl = getAttachmentUrl(
            attachmentId /* ClientAttachmentId */,
            actionMessage.attachmentType /* AttachmentType */,
            0 /* AttachmentUrlType where 0 = FullFile*/,
            false /* isCloudy */,
            false /* isReadyOnly */
        );
    }
    downloadFileFromUrl(downloadUrl, false);
    exitSearch('CommandExecuted', actionMessage.scenarioId);
});
