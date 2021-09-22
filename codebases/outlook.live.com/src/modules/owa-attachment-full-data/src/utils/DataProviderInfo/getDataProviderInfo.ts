import { assertNever } from 'owa-assert';
import createDataProviderInfoMapping from 'owa-attachment-model-store/lib/utils/DataProviderInfo/createDataProviderInfoMapping';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export const UnsupportedFileProvidersForAttachingAsCopy: AttachmentDataProviderType[] = [
    AttachmentDataProviderType.Dropbox,
    AttachmentDataProviderType.Box,
];

export interface AttachmentDataProviderInfo {
    supportViewInProvider: boolean;
    supportConvertCloudyToClassic: boolean;
}

function createDefaultAttachmentDataProviderInfo(): AttachmentDataProviderInfo {
    return {
        supportViewInProvider: false,
        supportConvertCloudyToClassic: false,
    };
}

function createDataProviderOneDriveProInfo(): AttachmentDataProviderInfo {
    const defaultInfo = createDefaultAttachmentDataProviderInfo();
    return {
        ...defaultInfo,
        supportViewInProvider: true,
        supportConvertCloudyToClassic: true,
    };
}

function createDataProviderOneDriveConsumerInfo(): AttachmentDataProviderInfo {
    const defaultInfo = createDefaultAttachmentDataProviderInfo();
    return {
        ...defaultInfo,
        supportConvertCloudyToClassic: isConsumer(),
    };
}

function createDataProviderGDriveInfo(): AttachmentDataProviderInfo {
    return createDefaultAttachmentDataProviderInfo();
}

function createDataProviderBoxInfo(): AttachmentDataProviderInfo {
    return createDefaultAttachmentDataProviderInfo();
}

function createDataProviderDropboxInfo(): AttachmentDataProviderInfo {
    return createDefaultAttachmentDataProviderInfo();
}

function createDataProviderWopiInfo(): AttachmentDataProviderInfo {
    return createDefaultAttachmentDataProviderInfo();
}

function createDataProviderMailboxInfo(): AttachmentDataProviderInfo {
    return createDefaultAttachmentDataProviderInfo();
}

function createDataProviderFacebookInfo(): AttachmentDataProviderInfo {
    return createDefaultAttachmentDataProviderInfo();
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
            return createDataProviderMailboxInfo();
        case AttachmentDataProviderType.MailMessage:
            return createDefaultAttachmentDataProviderInfo();
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
