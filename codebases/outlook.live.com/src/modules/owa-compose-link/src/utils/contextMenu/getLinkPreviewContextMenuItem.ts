import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { logUsage } from 'owa-analytics';
import { ClientItemId, getUserMailboxInfo } from 'owa-client-ids';
import { ControlIcons } from 'owa-control-icons';
import {
    lazyDocLinkHadPreviewInfo,
    lazyForceGetValidDocLinkPreviewInfo,
} from 'owa-doc-link-click-handler';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isImageFile } from 'owa-file/lib/index';
import { getSharingLinkInfo, SharingLinkInfo } from 'owa-link-data';
import loc from 'owa-localize';
import { PreviewText } from 'owa-locstrings/lib/strings/previewtext.locstring.json';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import {
    previewBeautifulLinkImageInSxS,
    previewSharePointDocumentLinkInSxS,
} from '../../actions/publicActions';
import { closeLinkContextMenu } from '../../components/LinkContextMenu';
import ComposeLinkPreviewMode from '../../store/schema/ComposeLinkPreviewMode';
import getLinkPreviewMode from '../getLinkPreviewMode';

/**
 * This function determines when to add the designated contextMenuItem to the LinkContextMenu.
 * @returns The 'Preview' contextMenuItem if the conditions are met.
 */
export function getLinkPreviewContextMenuItem(
    isCalendar: boolean,
    linkId: string,
    targetWindow: Window,
    isLinkBeautified: boolean,
    linksContainerId: string
): IContextualMenuItem | null {
    if (isCalendar) {
        return null;
    }

    const sharingLinkInfo: SharingLinkInfo = getSharingLinkInfo(linkId);
    const docLinkHadPreviewInfo = lazyDocLinkHadPreviewInfo.tryImportForRender();
    const isLinkImage: boolean = isImageFile(sharingLinkInfo.fileName);

    const linkUrl: string = sharingLinkInfo.unwrappedUrl
        ? sharingLinkInfo.unwrappedUrl
        : sharingLinkInfo.url;

    /*
        Checked the providerType because Image Preview for ODB files is not currently supported.
        Only ODC is currently supported.
    */
    const beautifulLinkImagePreviewCondition: boolean =
        isLinkImage &&
        isFeatureEnabled('doc-SxS-BeautifulLinks-ODC') &&
        sharingLinkInfo.providerType === AttachmentDataProviderType.OneDriveConsumer;

    const docPreviewCondition: boolean =
        isFeatureEnabled('doc-SxS-jsApi-ODB-Links') &&
        sharingLinkInfo.providerType === AttachmentDataProviderType.OneDrivePro &&
        isLinkBeautified &&
        docLinkHadPreviewInfo &&
        docLinkHadPreviewInfo(linkUrl) &&
        getLinkPreviewMode(linkId) === ComposeLinkPreviewMode.None;

    if (beautifulLinkImagePreviewCondition || docPreviewCondition) {
        return {
            name: loc(PreviewText),
            key: 'Preview',
            iconProps:
                isFeatureEnabled('wvn-chicletEditOptions') ||
                isFeatureEnabled('wvn-chicletEditOptionsNoDownload') ||
                isFeatureEnabled('wvn-editOptionsMasterFlight')
                    ? { iconName: ControlIcons.DocumentSearch }
                    : undefined,
            onClick: () => {
                beautifulLinkPreviewHandler(
                    linkUrl,
                    linkId,
                    targetWindow,
                    beautifulLinkImagePreviewCondition,
                    sharingLinkInfo,
                    linksContainerId
                );
                closeLinkContextMenu();
            },
        };
    } else {
        return null;
    }
}

async function beautifulLinkPreviewHandler(
    linkUrl: string,
    linkId: string,
    targetWindow: Window,
    isImagePreviewSupported: boolean,
    sharingLinkInfo: SharingLinkInfo,
    linksContainerId: string
) {
    if (isImagePreviewSupported && sharingLinkInfo.previewUrl && sharingLinkInfo.thumbnailUrl) {
        // Dispatch unique action to kick-off Process of Previewing BeautifulLink Image in SxS
        const parentItemId: ClientItemId = {
            Id: linkId,
            mailboxInfo: getUserMailboxInfo(),
        };
        logUsage('PreviewBeautifulLinkImageInSxS');
        previewBeautifulLinkImageInSxS(linkId, true, targetWindow, parentItemId, linksContainerId);
    } else {
        logUsage('PreviewDocLinkInSxS');
        const forceGetValidDocLinkPreviewInfo = await lazyForceGetValidDocLinkPreviewInfo.import();
        let docLinkPreviewInfo = await forceGetValidDocLinkPreviewInfo(linkUrl);

        previewSharePointDocumentLinkInSxS(
            () => Promise.resolve(docLinkPreviewInfo.wacUrlInfo),
            linkId,
            docLinkPreviewInfo.wacUrlInfo.readOnly,
            targetWindow
        );
    }
}
