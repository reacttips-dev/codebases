import configureResponse from '../utils/configureResponse';
import getAttachmentDataProviderUploadFolderPropsOperation from 'owa-service/lib/operation/getAttachmentDataProviderUploadFolderPropsOperation';
import getHeaders from '../utils/getHeaders';
import { getUploadFolder } from '../selectors/uploadFolderSelectors';
import { getUserConfiguration } from 'owa-session-store';
import { trace } from 'owa-trace';
import { UploadFolder, UploadFolderMailboxType } from '../store/schema/UploadFolder';
import { uploadFolderLoaded } from '../actions/publicActions';

/**
 * Fetch the upload folder for a mailbox. By default this
 * fetches the upload folder for the user's mailbox.
 */
export async function fetchUploadFolder(
    mailboxId: string | null = null,
    type: UploadFolderMailboxType = UploadFolderMailboxType.User
): Promise<UploadFolder> {
    try {
        mailboxId = mailboxId || getUserConfiguration().SessionSettings.UserEmailAddress;
        const uploadFolder = getUploadFolder(mailboxId);

        if (uploadFolder) {
            // If we already have the upload folder then
            // just return it as is
            return uploadFolder;
        }

        const response = await getAttachmentDataProviderUploadFolderPropsOperation(
            {},
            { headers: getHeaders(mailboxId, type) }
        );
        const configuredResponse = configureResponse(mailboxId, type, response);
        uploadFolderLoaded(mailboxId, configuredResponse);
        return configuredResponse;
    } catch (error) {
        trace.warn('fetchUploadFolder got error: ' + error.message);
        return null;
    }
}
