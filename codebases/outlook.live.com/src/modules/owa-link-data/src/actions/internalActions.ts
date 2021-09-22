import type { OwaDate } from 'owa-datetime';
import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import type { SharingTipRecipientInfo } from 'owa-sharing-data';
import type { SharingDialogResponse } from 'owa-sharing-dialog';
import { action } from 'satcheljs';
import type SharingLinkInfo from '../store/schema/SharingLinkInfo';
import type { LinkActionStatus } from '../types/LinkActionStatus';

export const updateSharingLinkFromSharingDialog = action(
    'UPDATE_SHARING_LINK_FROM_SHARING_DIALOG',
    (linkId: string, sharingDialogResponse: SharingDialogResponse) => ({
        linkId: linkId,
        sharingDialogResponse: sharingDialogResponse,
    })
);

export const updateSharingLinkPermission = action(
    'UPDATE_SHAREPOINT_LINK_PERMISSION',
    (linkId: string, newPermission: AttachmentPermissionLevel) => ({
        linkId: linkId,
        newPermission: newPermission,
    })
);

export const updateSharingLinkUrl = action(
    'UPDATE_SHAREPOINT_LINK_URL',
    (linkId: string, newLinkUrl: string, oldLinkUrl: string, expirationDate: OwaDate) => ({
        linkId: linkId,
        newLinkUrl: newLinkUrl,
        oldLinkUrl: oldLinkUrl,
        expirationDate: expirationDate,
    })
);

export const setRefreshStatus = action(
    'SET_REFRESH_STATUS_FOR_LINK',
    (linkId: string, actionStatus: LinkActionStatus) => ({
        linkId: linkId,
        actionStatus: actionStatus,
    })
);

export const createOrUpdateSharingLink = action(
    'CREATE_OR_UPDATE_SHARING_LINK',
    (
        linkId: string,
        sharingUrl: string,
        currentUrl: string,
        canonicalUrl: string,
        newPermissionLevel: AttachmentPermissionLevel,
        providerType: AttachmentDataProviderType,
        composeId: string,
        recipientInfos: SharingTipRecipientInfo[],
        isCalendar: boolean
    ) => ({
        linkId: linkId,
        sharingUrl: sharingUrl,
        currentUrl: currentUrl,
        canonicalUrl: canonicalUrl,
        newPermissionLevel: newPermissionLevel,
        providerType: providerType,
        composeId: composeId,
        recipientInfos: recipientInfos,
        isCalendar: isCalendar,
    })
);

export const addSharingLinkInfo = action(
    'ADD_SHARING_LINK_INFO',
    (linkId: string, linkModel: SharingLinkInfo) => ({
        linkId: linkId,
        linkModel: linkModel,
    })
);

export const tokenUnavailable = action('TOKEN_UNAVAILABLE', (linkId: string) => ({
    linkId: linkId,
}));
