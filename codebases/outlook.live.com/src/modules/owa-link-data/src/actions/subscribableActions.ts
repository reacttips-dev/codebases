import type { LinkProviderType } from 'owa-fileprovider-link';
import type { GetSharingInfoResponseBase } from 'owa-fileprovider-link-services';
import type { FluidOwaSource } from 'owa-fluid-validations';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type { SharingTipRecipientInfo } from 'owa-sharing-data';
import { action } from 'satcheljs';
import type { AnchorElementsSource } from '../types/AnchorElementsSource';

// TODO VSO 33492: mutators should not take in the object they are mutating as a parameter.
export const addSharingLink = action(
    'ADD_SHARING_LINK',
    (
        linkId: string,
        url: string,
        sharingLinkIds: string[],
        response: GetSharingInfoResponseBase,
        source: AnchorElementsSource,
        providerType: LinkProviderType,
        linksContainerId: string | undefined,
        unwrappedUrl?: string,
        creationDateTime?: string,
        thumbnailUrl?: string,
        previewUrl?: string,
        shareId?: string
    ) => ({
        linkId: linkId,
        url: url,
        sharingLinkIds: sharingLinkIds,
        response: response,
        source: source,
        providerType: providerType,
        linksContainerId: linksContainerId,
        unwrappedUrl: unwrappedUrl,
        creationDateTime: creationDateTime,
        thumbnailUrl: thumbnailUrl,
        previewUrl: previewUrl,
        shareId: shareId,
    })
);

// TODO VSO 33492: mutators should not take in the object they are mutating as a parameter.
export const sharingLinkRemoved = action(
    'SHARING_LINK_REMOVED',
    (
        linkId: string,
        sharingLinkIds: string[],
        fileName: string,
        providerType: AttachmentDataProviderType,
        linksContainerId?: string
    ) => ({
        linkId: linkId,
        sharingLinkIds: sharingLinkIds,
        fileName: fileName,
        providerType: providerType,
        linksContainerId: linksContainerId,
    })
);

export const deleteLink = action('DELETE_LINK', (linkId: string, targetWindow: Window) => ({
    linkId: linkId,
    targetWindow: targetWindow,
}));

export const createAttachmentFromLink = action(
    'CREATE_ATTACHMENT_FROM_LINK',
    (linkId: string, providerId: string, isTryAgain: boolean, targetWindow: Window) => ({
        linkId: linkId,
        providerId: providerId,
        isTryAgain: isTryAgain,
        targetWindow: targetWindow,
    })
);

export const onLinkHasChanged = action(
    'ON_LINK_HAS_CHANGED',
    (
        linkId: string,
        recipientInfos: SharingTipRecipientInfo[],
        composeId: string,
        isCalendar: boolean
    ) => ({
        linkId: linkId,
        recipientInfos: recipientInfos,
        composeId: composeId,
        isCalendar: isCalendar,
    })
);

// TODO VSO 33492: mutators should not take in the object they are mutating as a parameter.
export const addSharingLinkToContainer = action(
    'ADD_SHARING_LINK_TO_CONTAINER',
    (linkId: string, linkIdContainer: string[]) => ({
        linkId: linkId,
        linkIdContainer: linkIdContainer,
    })
);

// TODO VSO 33492: mutators should not take in the object they are mutating as a parameter.
export const removeSharingLinkFromContainer = action(
    'REMOVE_SHARING_LINK_FROM_CONTAINER',
    (linkId: string, linkIdContainer: string[]) => ({
        linkId: linkId,
        linkIdContainer: linkIdContainer,
    })
);

export const onFluidLinkCreated = action(
    'ON_FLUID_LINK_CREATED',
    (
        linkId: string,
        containerId: string,
        owaSource: FluidOwaSource,
        url: string,
        viewStateId: string | undefined
    ) => ({
        linkId: linkId,
        containerId: containerId,
        owaSource: owaSource,
        url: url,
        viewStateId: viewStateId,
    })
);

export const onExistingFluidLinkProcessed = action(
    'ON_EXISTING_FLUID_LINK_PROCESSED',
    (
        linkId: string,
        containerId: string,
        owaSource: FluidOwaSource,
        url: string,
        viewStateId: string | undefined
    ) => ({
        linkId: linkId,
        containerId: containerId,
        owaSource: owaSource,
        url: url,
        viewStateId: viewStateId,
    })
);
