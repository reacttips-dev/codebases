import { FileProviderViewState, getFileProviders } from 'owa-fileprovider-store';
import { createAttachmentFromLink, getSharingLinkInfo } from 'owa-link-data';
import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import * as trace from 'owa-trace';

export function getProviderAndAttachLinkAsCopy(linkId: string, targetWindow: Window) {
    const sharingLink = getSharingLinkInfo(linkId);
    const providerId = getProviderId(getFileProviders(), sharingLink.providerType);

    if (!isNullOrWhiteSpace(providerId)) {
        createAttachmentFromLink(linkId, providerId, false /* isTryAgain */, targetWindow);
    }
}

function getProviderId(
    providers: FileProviderViewState[],
    providerType: AttachmentDataProviderType
) {
    for (let i = 0; i < providers.length; i++) {
        if (providers[i].type === providerType) {
            return providers[i].model.Id;
        }
    }

    trace.errorThatWillCauseAlert(
        `createAttachmentFromLink: Could not get ${providerType.toString()} provider ID. File will not upload.`
    );

    return '';
}
