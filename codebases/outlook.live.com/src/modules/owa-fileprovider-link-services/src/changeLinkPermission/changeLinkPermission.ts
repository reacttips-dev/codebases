import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import type { CreateSharingLinkFromFileProviderResult } from '../createSharingLinkFromFileProvider/CreateSharingLinkFromFileProviderResult';
import { changeLinkPermissionGDrive } from './changeLinkPermissionGDrive';
import { changeLinkPermissionOneDriveConsumer } from './changeLinkPermissionOneDriveConsumer';

export async function changeLinkPermission(
    attachmentDataProviderType: AttachmentDataProviderType,
    originalUrl: string,
    permissionLevel: AttachmentPermissionLevel
): Promise<CreateSharingLinkFromFileProviderResult | void> {
    if (isNullOrWhiteSpace(originalUrl)) {
        throw new Error('CreateSharingLinkFromFileProvider should have valid location.');
    }

    if (attachmentDataProviderType === AttachmentDataProviderType.OneDriveConsumer) {
        return changeLinkPermissionOneDriveConsumer(originalUrl, permissionLevel);
    } else if (attachmentDataProviderType === AttachmentDataProviderType.GDrive) {
        await changeLinkPermissionGDrive(originalUrl, permissionLevel);
    }
}
