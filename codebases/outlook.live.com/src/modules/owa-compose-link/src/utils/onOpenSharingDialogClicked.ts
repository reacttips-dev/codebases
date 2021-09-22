import { logUsage, PerformanceDatapoint } from 'owa-analytics';
import { onLinkHasChanged, updateSharingLinkFromSharingDialog } from 'owa-link-data';
import type AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import type { ODBSharingInfo, SharingTipRecipientInfo } from 'owa-sharing-data';
import { lazyOpenSharingDialogIframe } from 'owa-sharing-dialog-iframe';
import { closeLinkContextMenu } from '../components/LinkContextMenu';

export async function onOpenSharingDialogClicked(
    sharingInfo: ODBSharingInfo,
    linkId: string,
    permissionLevel: AttachmentPermissionLevel,
    composeId: string,
    recipientInfos: SharingTipRecipientInfo[],
    targetWindow: Window,
    isCalendar: boolean
) {
    closeLinkContextMenu();
    const datapoint: PerformanceDatapoint = new PerformanceDatapoint('sharingDialogOpened');
    datapoint.addCustomData({ IsIframe: true });
    const openSharingDialogIframe = await lazyOpenSharingDialogIframe.import();
    try {
        const response = await openSharingDialogIframe(
            sharingInfo.siteUrl,
            sharingInfo.itemUniqueId,
            sharingInfo.mimeType === 'text/directory',
            sharingInfo.shareId,
            permissionLevel,
            targetWindow,
            datapoint
        );

        if (!response) {
            return;
        }

        const linkHasChanged: boolean = response.shareId !== sharingInfo.shareId;
        updateSharingLinkFromSharingDialog(linkId, response);

        if (linkHasChanged) {
            onLinkHasChanged(linkId, recipientInfos, composeId, isCalendar);
            logUsage('LinkChangedFromSharingDialogIframe');
        }
    } catch (error) {
        logUsage('SharingDialogIframeCatchedError', { message: error.message });
        return;
    }
}
