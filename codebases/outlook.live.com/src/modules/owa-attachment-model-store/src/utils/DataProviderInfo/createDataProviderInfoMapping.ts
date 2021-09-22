import { ONE_DRIVE_CONSUMER, ONE_DRIVE_PRO } from 'owa-attachment-constants/lib/fileProviders';
import { convertToAttachmentDataProviderType } from 'owa-attachment-file-types';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

const providerTypes: AttachmentDataProviderType[] = [
    AttachmentDataProviderType.OneDrivePro,
    AttachmentDataProviderType.OneDriveConsumer,
    AttachmentDataProviderType.Box,
    AttachmentDataProviderType.Dropbox,
    AttachmentDataProviderType.Facebook,
    AttachmentDataProviderType.GDrive,
    AttachmentDataProviderType.WopiBox,
    AttachmentDataProviderType.WopiEgnyte,
    AttachmentDataProviderType.Mailbox,
];

export interface CreateDataProviderInfoMappingResult<T> {
    getDataProviderInfo: (providerType: string) => T;
    getDefaultDataProviderInfo: (isConsumer: boolean) => T;
}

export default function createDataProviderInfoMapping<T>(
    createProviderInfo: (type: AttachmentDataProviderType) => T
): CreateDataProviderInfoMappingResult<T> {
    let dataProviderInfoMap: { [key: number]: T } = null;

    const getDataProviderInfoMap = function getDataProviderInfoMap(): { [key: number]: T } {
        if (!dataProviderInfoMap) {
            dataProviderInfoMap = {};

            for (const providerType of providerTypes) {
                dataProviderInfoMap[providerType] = createProviderInfo(providerType);
            }
        }

        return dataProviderInfoMap;
    };

    const getDataProviderInfo = function getDataProviderInfo(providerType: string): T {
        const attachmentDataProviderType = convertToAttachmentDataProviderType(providerType);
        if (attachmentDataProviderType === null) {
            return null;
        }

        return getDataProviderInfoMap()[attachmentDataProviderType];
    };

    const getDefaultDataProviderInfo = function getDefaultDataProviderInfo(isConsumer: boolean): T {
        if (isConsumer) {
            return getDataProviderInfo(ONE_DRIVE_CONSUMER);
        } else {
            return getDataProviderInfo(ONE_DRIVE_PRO);
        }
    };

    return {
        getDataProviderInfo: getDataProviderInfo,
        getDefaultDataProviderInfo: getDefaultDataProviderInfo,
    };
}
