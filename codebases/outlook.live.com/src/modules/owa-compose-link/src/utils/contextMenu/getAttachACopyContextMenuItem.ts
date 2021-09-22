import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { logUsage } from 'owa-analytics';
import { AttachmentDataProviderInfo, getDataProviderInfo } from 'owa-attachment-full-data';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isImageFile } from 'owa-file';
import { getSharingLinkInfo, SharingLinkInfo } from 'owa-link-data';
import loc from 'owa-localize';
import { AttachAsACopyText } from 'owa-locstrings/lib/strings/attachasacopytext.locstring.json';
import { closeLinkContextMenu } from '../../components/LinkContextMenu';
import { LinkActionSource } from '../../types/LinkActionSource';
import { canDownloadLink } from '../canDownloadLink';
import { getProviderAndAttachLinkAsCopy } from '../getProviderAndAttachLinkAsCopy';

const AttachmentDataProviderType: string[] = [
    'OneDrivePro',
    'OneDriveConsumer',
    'Dropbox',
    'Box',
    'Mailbox',
    'GDrive',
    'Facebook',
    'WopiBox',
    'WopiEgnyte',
    'WopiDropbox',
    'MailMessage',
];

export function getAttachACopyContextMenuItem(
    linkId: string,
    targetWindow: Window
): IContextualMenuItem {
    const sharingLink: SharingLinkInfo = getSharingLinkInfo(linkId);

    // checks flights, policy, and content type to ensure the file is downloadable
    if (!canDownloadLink(sharingLink)) {
        return null;
    }

    // checks provider type to ensure if it supports attach as a copy
    const dataProviderInfo: AttachmentDataProviderInfo = getDataProviderInfo(
        AttachmentDataProviderType[sharingLink.providerType]
    );
    if (!dataProviderInfo?.supportConvertCloudyToClassic) {
        return null;
    }

    return {
        name: loc(AttachAsACopyText),
        key: 'AttachACopy',
        iconProps:
            isFeatureEnabled('wvn-chicletEditOptions') ||
            isFeatureEnabled('wvn-chicletEditOptionsNoDownload') ||
            isFeatureEnabled('wvn-editOptionsMasterFlight')
                ? { iconName: ControlIcons.Attach }
                : undefined,
        onClick: () => {
            logUsage('AttachmentLinkAttachAsACopy', {
                source: LinkActionSource.contextMenu,
                isImage: isImageFile(sharingLink.fileName),
            });
            closeLinkContextMenu();
            getProviderAndAttachLinkAsCopy(linkId, targetWindow);
        },
    };
}
