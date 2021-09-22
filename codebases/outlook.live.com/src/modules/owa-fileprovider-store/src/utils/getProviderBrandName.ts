import {
    DropboxFileProviderDisplayName,
    BoxFileProviderDisplayName,
    GoogleDriveFileProviderDisplayName,
    FacebookFileProviderDisplayName,
    RecentAttachmentsFileProviderDisplayName,
    EgnyteFileProviderDisplayName,
} from './getProviderBrandName.locstring.json';
import { MailMessageFileProviderDisplayName } from '../strings.locstring.json';
import {
    OneDriveFileProviderDisplayName,
    OneDriveConsumerFileProviderDisplayName,
} from 'owa-locstrings/lib/strings/onedrivefileproviderdisplayname.locstring.json';
import loc from 'owa-localize';
import { assertNever } from 'owa-assert';
import type { FileProviderType } from '../utils/constants';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

export default function getProviderBrandName(
    providerType: FileProviderType,
    isGroupsFileProvider: boolean = false
): string {
    // In groups file provider we do not use branding by request of the team
    if (isGroupsFileProvider) {
        return '';
    }
    switch (providerType) {
        case AttachmentDataProviderType.OneDrivePro:
            return loc(OneDriveFileProviderDisplayName);
        case AttachmentDataProviderType.OneDriveConsumer:
            return loc(OneDriveConsumerFileProviderDisplayName);
        case AttachmentDataProviderType.Dropbox:
        case AttachmentDataProviderType.WopiDropbox:
            return loc(DropboxFileProviderDisplayName);
        case AttachmentDataProviderType.Box:
        case AttachmentDataProviderType.WopiBox:
            return loc(BoxFileProviderDisplayName);
        case AttachmentDataProviderType.GDrive:
            return loc(GoogleDriveFileProviderDisplayName);
        case AttachmentDataProviderType.Facebook:
            return loc(FacebookFileProviderDisplayName);
        case AttachmentDataProviderType.Mailbox:
            return loc(RecentAttachmentsFileProviderDisplayName);
        case AttachmentDataProviderType.MailMessage:
            return loc(MailMessageFileProviderDisplayName);
        case AttachmentDataProviderType.WopiEgnyte:
            return loc(EgnyteFileProviderDisplayName);
        default:
            return assertNever(providerType);
    }
}
