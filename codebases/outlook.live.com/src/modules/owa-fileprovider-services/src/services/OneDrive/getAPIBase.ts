import { assertNever } from 'owa-assert';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { ONE_DRIVE_CONSUMER_API_BASE, ONE_DRIVE_PRO_API_BASE } from './constants';

export type OneDriveProviderType =
    | AttachmentDataProviderType.OneDriveConsumer
    | AttachmentDataProviderType.OneDrivePro;

function getAPIBase(providerType: OneDriveProviderType) {
    switch (providerType) {
        case AttachmentDataProviderType.OneDriveConsumer:
            return ONE_DRIVE_CONSUMER_API_BASE;
        case AttachmentDataProviderType.OneDrivePro:
            return ONE_DRIVE_PRO_API_BASE;
        default:
            return assertNever(providerType);
    }
}

export function getDriveAPIBase(providerType: OneDriveProviderType) {
    return `${getAPIBase(providerType)}/drive`;
}

export function getSharesAPIBase(providerType: OneDriveProviderType) {
    return `${getAPIBase(providerType)}/shares`;
}

export function getAPIBaseForPath(providerType: OneDriveProviderType) {
    return `${getDriveAPIBase(providerType)}/root`;
}

export function getAPIBaseForId(providerType: OneDriveProviderType) {
    return `${getDriveAPIBase(providerType)}/items`;
}
