import type { ClientItemId } from 'owa-client-ids';
import { orchestrator } from 'satcheljs';
import {
    addOpenDocumentPreviewEventListener,
    tryQueueGetWacInfo,
} from '../actions/internalActions';
import { previewLinkInSxS } from '../actions/publicActions';
import { OD_LINK_CLICK_EVENT_LISTENER, OD_LINK_MOUSEUP_EVENT_LISTENER } from '../utils/constants';
import documentLinkMouseUpHandler from '../utils/documentLinkMouseUpHandler';
import forceGetWacInfoOperation from '../utils/forceGetWacInfoOperation';
import { getValidDocLinkPreviewInfoWithReason } from '../utils/getValidDocLinkPreviewInfo';
import logSharePointLinkClick from '../utils/logSharePointLinkClick';
import serviceGeneratedLinkClickHandler from '../utils/serviceGeneratedLinkClickHandler';
import { getExtensionFromFileName } from 'owa-file';
import { AttachmentSelectionSource } from 'owa-attachment-data';

orchestrator(addOpenDocumentPreviewEventListener, actionMessage => {
    const {
        element,
        href,
        itemId,
        isSafeLinkWrapped,
        isSafeLinkVerified,
        isOfficeSPLink,
    } = actionMessage;
    tryQueueGetWacInfo(href);
    const eventListener = (ev: MouseEvent) => {
        documentLinkPreviewClickHandler(
            ev,
            itemId,
            href,
            isSafeLinkWrapped,
            isSafeLinkVerified,
            isOfficeSPLink,
            element.ownerDocument.defaultView
        );
    };
    element.addEventListener('click', eventListener);
    element[OD_LINK_CLICK_EVENT_LISTENER] = eventListener;

    const mouseupListener = (ev: MouseEvent) => {
        documentLinkMouseUpHandler(ev, isSafeLinkWrapped, isSafeLinkVerified);
    };
    element.addEventListener('mouseup', mouseupListener);
    element[OD_LINK_MOUSEUP_EVENT_LISTENER] = mouseupListener;
});

function documentLinkPreviewClickHandler(
    ev: MouseEvent,
    itemId: ClientItemId,
    unwrappedUrl: string,
    isSafeLinkWrapped: boolean,
    isSafeLinkVerified: boolean,
    isOfficeSPLink: boolean,
    targetWindow: Window
) {
    let newTabReason: string = null;

    // only try to open in SxS if non of the modifier keys is pressed
    if (!ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
        const { docLinkPreviewInfo, reason } = getValidDocLinkPreviewInfoWithReason(unwrappedUrl);

        if (docLinkPreviewInfo?.needRedeem || reason === 'Expired') {
            previewLinkInSxS(
                async () => {
                    const docLinkPreviewInfo2 = await forceGetWacInfoOperation(
                        unwrappedUrl,
                        true /* shouldReturnDocLinkPreviewInfo */,
                        true /* redeemSharingLinkIfNecessary */
                    );

                    const extraInfo = docLinkPreviewInfo?.needRedeem
                        ? 'redeem'
                        : 'retryAfterCacheExpire';
                    const fileName = docLinkPreviewInfo2?.wacUrlInfo?.jsApiInfo?.fileName;
                    const fileExtension = getExtensionFromFileName(fileName);
                    logSharePointLinkClick(
                        null,
                        isSafeLinkWrapped,
                        isSafeLinkVerified,
                        extraInfo,
                        isOfficeSPLink,
                        null,
                        fileExtension
                    );
                    return { ...docLinkPreviewInfo2.wacUrlInfo, extraInfo };
                },
                itemId,
                targetWindow,
                AttachmentSelectionSource.ReadingPaneDocLink
            );
            ev.preventDefault();
            return;
        }

        if (!!docLinkPreviewInfo) {
            previewLinkInSxS(
                () => Promise.resolve(docLinkPreviewInfo.wacUrlInfo),
                itemId,
                targetWindow,
                AttachmentSelectionSource.ReadingPaneDocLink
            );
            ev.preventDefault();
            const fileName = docLinkPreviewInfo?.wacUrlInfo?.jsApiInfo?.fileName;
            const fileExtension = getExtensionFromFileName(fileName);
            logSharePointLinkClick(
                null,
                isSafeLinkWrapped,
                isSafeLinkVerified,
                null /*extraInfo*/,
                isOfficeSPLink,
                null,
                fileExtension
            );
            return;
        }

        newTabReason = reason;
    }

    // If the code reached this point
    // the browser will open a new tab of the link
    serviceGeneratedLinkClickHandler(ev, isSafeLinkWrapped, isSafeLinkVerified, newTabReason);
}
