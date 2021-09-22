import createDataProviderInfoMapping from './createDataProviderInfoMapping';
import shouldPreviewGoogleDoc from '../../utils/shouldPreviewGoogleDoc';
import { assertNever } from 'owa-assert';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

export interface AttachmentDataProviderInfo {
    supportDownload: boolean;
    supportImageThumbnail: boolean;
    supportPreview: (attachment?: ReferenceAttachment, isConsumer?: boolean) => boolean;
    supportedPermissionLevels: AttachmentPermissionLevel[];
    requiresFetchingSharingInformation: boolean;
}

function createDefaultAttachmentDataProviderInfo(): AttachmentDataProviderInfo {
    return {
        supportDownload: true,
        supportImageThumbnail: false,
        supportPreview: (_, __) => true,
        supportedPermissionLevels: [],
        requiresFetchingSharingInformation: false,
    };
}

function createDataProviderOneDriveProInfo(): AttachmentDataProviderInfo {
    return {
        ...createDefaultAttachmentDataProviderInfo(),
        supportedPermissionLevels: [AttachmentPermissionLevel.Edit, AttachmentPermissionLevel.View],
        requiresFetchingSharingInformation: true,
    };
}

function createDataProviderOneDriveConsumerInfo(): AttachmentDataProviderInfo {
    return {
        ...createDefaultAttachmentDataProviderInfo(),
        supportImageThumbnail: true,
        supportPreview: (_, isConsumer) => isConsumer,
        supportedPermissionLevels: [AttachmentPermissionLevel.Edit, AttachmentPermissionLevel.View],
    };
}

function createDataProviderGDriveInfo(): AttachmentDataProviderInfo {
    return {
        ...createDefaultAttachmentDataProviderInfo(),
        supportDownload: false,
        supportImageThumbnail: false,
        supportPreview: attachment => shouldPreviewGoogleDoc(attachment),
        supportedPermissionLevels: [
            AttachmentPermissionLevel.AnonymousEdit,
            AttachmentPermissionLevel.AnonymousView,
        ],
    };
}

function createDataProviderBoxInfo(): AttachmentDataProviderInfo {
    return {
        ...createDefaultAttachmentDataProviderInfo(),
        supportDownload: false,
        supportPreview: (_, __) => false,
    };
}

function createDataProviderDropboxInfo(): AttachmentDataProviderInfo {
    return {
        ...createDefaultAttachmentDataProviderInfo(),
        supportPreview: (_, __) => false,
    };
}

function createDataProviderWopiInfo(): AttachmentDataProviderInfo {
    return {
        ...createDefaultAttachmentDataProviderInfo(),
        supportDownload: false,
        supportPreview: (_, __) => false,
    };
}

function createDataProviderMailboxInfo(): AttachmentDataProviderInfo {
    return {
        supportDownload: false,
        supportImageThumbnail: false,
        supportPreview: (_, __) => false,
        supportedPermissionLevels: [],
        requiresFetchingSharingInformation: false,
    };
}

function createDataProviderFacebookInfo(): AttachmentDataProviderInfo {
    return {
        supportDownload: false,
        supportImageThumbnail: true,
        supportPreview: (_, __) => false,
        supportedPermissionLevels: [],
        requiresFetchingSharingInformation: false,
    };
}

function createDataProviderInfo(
    providerType: AttachmentDataProviderType
): AttachmentDataProviderInfo {
    switch (providerType) {
        case AttachmentDataProviderType.OneDrivePro:
            return createDataProviderOneDriveProInfo();
        case AttachmentDataProviderType.OneDriveConsumer:
            return createDataProviderOneDriveConsumerInfo();
        case AttachmentDataProviderType.Box:
            return createDataProviderBoxInfo();
        case AttachmentDataProviderType.Dropbox:
            return createDataProviderDropboxInfo();
        case AttachmentDataProviderType.Facebook:
            return createDataProviderFacebookInfo();
        case AttachmentDataProviderType.GDrive:
            return createDataProviderGDriveInfo();
        case AttachmentDataProviderType.WopiBox:
        case AttachmentDataProviderType.WopiEgnyte:
        case AttachmentDataProviderType.WopiDropbox:
            return createDataProviderWopiInfo();
        case AttachmentDataProviderType.Mailbox:
        case AttachmentDataProviderType.MailMessage:
            return createDataProviderMailboxInfo();
        default:
            return assertNever(providerType);
    }
}

const {
    getDataProviderInfo,
    getDefaultDataProviderInfo,
} = createDataProviderInfoMapping<AttachmentDataProviderInfo>(createDataProviderInfo);

export default getDataProviderInfo;
export { getDefaultDataProviderInfo };
