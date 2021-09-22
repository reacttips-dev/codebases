import type { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react/lib/ContextualMenu';
import { logUsage } from 'owa-analytics';
import { getLinkPermissionLevelString } from 'owa-attachment-permission';
import { createOrUpdateSharingLink, getSharingLinkInfo, SharingLinkInfo } from 'owa-link-data';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import type { ODBSharingInfo, SharingTipRecipientInfo } from 'owa-sharing-data';
import { closeLinkContextMenu } from '../../components/LinkContextMenu';
import type ComposeLinkViewState from '../../store/schema/ComposeLinkViewState';

import styles from '../../components/LinkContextMenu.scss';

export function getChangePermissionContextMenuItem(
    composeLinkViewState: ComposeLinkViewState,
    composeId: string,
    recipientInfos: SharingTipRecipientInfo[],
    isCalendar: boolean
): IContextualMenuItem | null {
    const sharingLinkInfo = getSharingLinkInfo(composeLinkViewState.linkId);
    return {
        text: getLinkPermissionLevelString(
            sharingLinkInfo.permissionLevel,
            AttachmentDataProviderType.OneDrivePro
        ), // VSTO: 58237 will fix the hardcoded value
        key: 'changePermission',
        className: styles.smallFontContextMenu,
        subMenuProps: getSupportedPermissionLevelsSubMenuItems(
            sharingLinkInfo,
            composeId,
            recipientInfos,
            isCalendar
        ),
    };
}

export function getSupportedPermissionLevelsSubMenuItems(
    sharingLinkInfo: SharingLinkInfo,
    composeId: string,
    recipientInfos: SharingTipRecipientInfo[],
    isCalendar: boolean
): IContextualMenuProps {
    const subMenuItems: IContextualMenuItem[] = [];

    if (sharingLinkInfo.supportedPermissionLevels) {
        sharingLinkInfo.supportedPermissionLevels.forEach(permissionLevel => {
            if (
                permissionLevel !== AttachmentPermissionLevel.View &&
                permissionLevel !== AttachmentPermissionLevel.Edit
            ) {
                const permission = getLinkPermissionLevelString(
                    permissionLevel,
                    sharingLinkInfo.providerType
                );
                subMenuItems.push({
                    text: permission,
                    key: permission,
                    title: permission,
                    onClick: () => {
                        logUsage('AttachmentLinkViewChangePermission');
                        setSharingLinkPermission(
                            permissionLevel,
                            sharingLinkInfo,
                            composeId,
                            recipientInfos,
                            isCalendar
                        );
                        closeLinkContextMenu();
                    },
                    isChecked: permissionLevel === sharingLinkInfo.permissionLevel,
                    canCheck: true,
                });
            }
        });
    }
    if (subMenuItems.length > 0) {
        return {
            items: subMenuItems,
            className: styles.fixWidthContextMenu,
            directionalHintFixed: true,
        };
    } else {
        return null;
    }
}

async function setSharingLinkPermission(
    newPermissionLevel: AttachmentPermissionLevel,
    sharingLinkInfo: SharingLinkInfo,
    composeId: string,
    recipientInfos: SharingTipRecipientInfo[],
    isCalendar: boolean
) {
    if (newPermissionLevel === sharingLinkInfo.permissionLevel) {
        return;
    }

    const sharingUrl = tryGetSharingUrlFromSharingInfo(newPermissionLevel, sharingLinkInfo);

    //TODO: VSO 36802 - add error checking code
    let canonicalUrl: string = null;
    if (sharingLinkInfo.providerType === AttachmentDataProviderType.OneDrivePro) {
        const sharingInfo: ODBSharingInfo = <ODBSharingInfo>sharingLinkInfo.sharingInfo;
        canonicalUrl = sharingInfo.canonicalUrl;
    }

    createOrUpdateSharingLink(
        sharingLinkInfo.linkId,
        sharingUrl,
        sharingLinkInfo.url,
        canonicalUrl,
        newPermissionLevel,
        sharingLinkInfo.providerType,
        composeId,
        recipientInfos,
        isCalendar
    );

    return;
}

function tryGetSharingUrlFromSharingInfo(
    newPermissionLevel: AttachmentPermissionLevel,
    sharingLinkInfo: SharingLinkInfo
): string | null {
    if (sharingLinkInfo.providerType !== AttachmentDataProviderType.OneDrivePro) {
        return null;
    }
    // For anonymous links we should aways return null, as the current url could be expired
    switch (newPermissionLevel) {
        case AttachmentPermissionLevel.OrganizationEdit:
            return sharingLinkInfo.sharingUrls.organizationEditLink;
        case AttachmentPermissionLevel.OrganizationView:
            return sharingLinkInfo.sharingUrls.organizationViewLink;
        case AttachmentPermissionLevel.Edit:
        case AttachmentPermissionLevel.View:
        case AttachmentPermissionLevel.None:
            // Only ODB links have these permission levels.
            const sharingInfo: ODBSharingInfo = <ODBSharingInfo>sharingLinkInfo.sharingInfo;
            return sharingInfo.canonicalUrl;
        default:
            return null;
    }
}
