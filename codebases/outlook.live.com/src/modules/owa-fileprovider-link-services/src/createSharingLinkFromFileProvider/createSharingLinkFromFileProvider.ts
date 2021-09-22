import { logUsage } from 'owa-analytics';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import { createSharingLinkFromBox } from './createSharingLinkFromBox';
import { createSharingLinkFromDropbox } from './createSharingLinkFromDropbox';
import type { CreateSharingLinkFromFileProviderResult } from './CreateSharingLinkFromFileProviderResult';
import { createSharingLinkFromGDrive } from './createSharingLinkFromGDrive';
import { createSharingLinkFromOneDriveConsumer } from './createSharingLinkFromOneDriveConsumer';
import { createSharingLinkFromOneDrivePro } from './createSharingLinkFromOneDrivePro';

export async function createSharingLinkFromFileProvider(
    attachmentDataProviderType: AttachmentDataProviderType,
    dataProviderItemId: string, // fileId
    location: string,
    isFolder: boolean,
    providerEndpointUrl?: string,
    shouldEnforceOrgLink?: boolean
): Promise<CreateSharingLinkFromFileProviderResult> {
    if (isNullOrWhiteSpace(location)) {
        throw new Error('CreateSharingLinkFromFileProvider should have valid location.');
    }
    let sharingLink = null;
    switch (attachmentDataProviderType) {
        case AttachmentDataProviderType.OneDriveConsumer:
            sharingLink = await createSharingLinkFromOneDriveConsumer(dataProviderItemId, location);
            break;
        case AttachmentDataProviderType.OneDrivePro:
            sharingLink = await createSharingLinkFromOneDrivePro(
                location,
                providerEndpointUrl,
                shouldEnforceOrgLink
            );
            break;
        case AttachmentDataProviderType.Dropbox:
            sharingLink = await createSharingLinkFromDropbox(location);
            break;
        case AttachmentDataProviderType.Box:
            sharingLink = await createSharingLinkFromBox(dataProviderItemId, isFolder);
            break;
        case AttachmentDataProviderType.GDrive:
            sharingLink = await createSharingLinkFromGDrive(dataProviderItemId);
            break;
        default:
            throw new Error(`File provider ${attachmentDataProviderType} is not supported.`);
    }

    if (!!sharingLink.expirationDateTime) {
        logUsage('expiration time found', [sharingLink.expirationDateTime]);
    }
    return sharingLink;
}
