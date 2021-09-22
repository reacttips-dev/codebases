import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import getAttachmentPolicy from 'owa-session-store/lib/utils/getAttachmentPolicy';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { assertNever } from 'owa-assert';
import { isFeatureEnabled } from 'owa-feature-flags';

// returns whether a fileprovider is enabled throughout OWA
export default function isAttachmentDataProviderTypeEnabled(
    provider: AttachmentDataProviderType
): boolean {
    const attachmentPolicy = getAttachmentPolicy();
    switch (provider) {
        case AttachmentDataProviderType.GDrive:
            return (
                attachmentPolicy?.GoogleDriveAttachmentsEnabled &&
                attachmentPolicy?.ThirdPartyAttachmentsEnabled &&
                isFeatureEnabled('doc-fileProvider-gdrive')
            );
        case AttachmentDataProviderType.Mailbox:
        case AttachmentDataProviderType.OneDrivePro:
            return true;
        case AttachmentDataProviderType.Box:
            return (
                attachmentPolicy?.BoxAttachmentsEnabled &&
                attachmentPolicy?.ThirdPartyAttachmentsEnabled &&
                isFeatureEnabled('doc-fileProvider-box')
            );
        case AttachmentDataProviderType.Dropbox:
            return (
                attachmentPolicy?.DropboxAttachmentsEnabled &&
                attachmentPolicy?.ThirdPartyAttachmentsEnabled &&
                isFeatureEnabled('doc-fileProvider-dropbox')
            );
        case AttachmentDataProviderType.Facebook:
            return (
                attachmentPolicy?.ThirdPartyAttachmentsEnabled &&
                isFeatureEnabled('doc-fileProvider-facebook')
            );
        case AttachmentDataProviderType.OneDriveConsumer:
            if (isConsumer()) {
                // If its a consumer account then OneDriveConsumer
                // would always be enabledisAttachmentDataProviderTypeEnabled
                return true;
            }

            return (
                attachmentPolicy?.OnedriveAttachmentsEnabled &&
                attachmentPolicy?.ThirdPartyAttachmentsEnabled
            );
        case AttachmentDataProviderType.MailMessage:
            return isFeatureEnabled('doc-filePicker-mailMessageAttachment');
        case AttachmentDataProviderType.WopiBox:
        case AttachmentDataProviderType.WopiEgnyte:
        case AttachmentDataProviderType.WopiDropbox:
            return (
                attachmentPolicy?.ThirdPartyAttachmentsEnabled &&
                isFeatureEnabled('doc-fileProvider-wopiClient')
            );
        default:
            return assertNever(provider);
    }
}
