import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { FileProviders } from 'owa-attachment-constants/lib/fileProviders';

export default function convertToAttachmentDataProviderType(
    providerType: string
): AttachmentDataProviderType | null {
    switch (providerType ? providerType.toLowerCase() : null) {
        case FileProviders.ONE_DRIVE_PRO.toLowerCase():
            return AttachmentDataProviderType.OneDrivePro;
        case FileProviders.GDRIVE.toLowerCase():
            return AttachmentDataProviderType.GDrive;
        case FileProviders.ONE_DRIVE_CONSUMER.toLowerCase():
            return AttachmentDataProviderType.OneDriveConsumer;
        case FileProviders.DROPBOX.toLowerCase():
            return AttachmentDataProviderType.Dropbox;
        case FileProviders.BOX.toLowerCase():
            return AttachmentDataProviderType.Box;
        case FileProviders.WOPI_BOX.toLowerCase():
            return AttachmentDataProviderType.WopiBox;
        case FileProviders.WOPI_EGNYTE.toLowerCase():
            return AttachmentDataProviderType.WopiEgnyte;
        case FileProviders.MAILBOX.toLowerCase():
            return AttachmentDataProviderType.Mailbox;
        case FileProviders.FACEBOOK.toLowerCase():
            return AttachmentDataProviderType.Facebook;
        default:
            return null;
    }
}
