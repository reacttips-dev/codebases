import type { ComposeViewState } from 'owa-mail-compose-store';
import createAttachments from '../utils/createAttachments';
import findComposeViewStateById, { IdSource } from '../utils/findComposeViewStateById';
import { logUsage } from 'owa-analytics';
import type { CloudFile } from 'owa-attachment-file-types';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import isSmimeEnabledInViewState from 'owa-smime/lib/utils/isSmimeEnabledInViewState';
import { orchestrator } from 'satcheljs';
import {
    createAttachmentFromLink,
    deleteLink,
    getSharingLinkInfo,
    LinkActionStatus,
    lazySetLinkActionStatus,
    SharingLinkInfo,
    lazyCreateCloudFileFromSharingLink,
} from 'owa-link-data';

// set as a global variable so that it can be called sync in tryRecoverLink
// Will always be defined, since tryRecoverLink is only called as a callback for
// createAttachments inside of createAttachmentForLink, which sets it.
let setLinkActionStatus;

orchestrator(createAttachmentFromLink, async actionMessage => {
    const composeViewState: ComposeViewState = findComposeViewStateById(
        actionMessage.linkId,
        IdSource.Link
    );
    const sharingLink: SharingLinkInfo = getSharingLinkInfo(actionMessage.linkId);
    if (composeViewState && sharingLink) {
        //In Smime attash as a copy will show an error message.
        //In ComposeLinkView we currently don't know if we are Smime or not, so hiding the buttons
        // is non-trivial. Bug 49046 is tracking if we should enable this for Smime or not. Since the
        // error is thrown immidiately we do not bother changing the linkActionStatus.
        if (!isSmimeEnabledInViewState(composeViewState.smimeViewState)) {
            if (!setLinkActionStatus) {
                setLinkActionStatus = await lazySetLinkActionStatus.import();
            }
            setLinkActionStatus(actionMessage.linkId, LinkActionStatus.attachingAsACopy);
        }
        const createCloudFileFromSharingLink = await lazyCreateCloudFileFromSharingLink.import();
        const cloudFile: CloudFile = createCloudFileFromSharingLink(
            sharingLink,
            actionMessage.providerId
        );
        createAttachments(
            [cloudFile],
            composeViewState,
            {
                isInline: false,
                isHiddenInline: false,
                shouldShare: false,
                downsellFromLink: true,
            },
            null /* onAllAttachmentsProcessed /*/,
            (
                parentItemId: ClientItemId,
                attachmentId: ClientAttachmentId,
                attachment: AttachmentType
            ) =>
                tryDeleteLink(
                    actionMessage.linkId,
                    actionMessage.isTryAgain,
                    actionMessage.targetWindow
                ) /* onAttachmentCreatedCallback */,
            (canceled: boolean) =>
                tryRecoverLink(
                    actionMessage.linkId,
                    canceled,
                    actionMessage.isTryAgain
                ) /* onAttachmentCanceledOrFailedCallback */,
            () => {
                logUsage('LinkAttachAsCopyTriedAgain');
                createAttachmentFromLink(
                    actionMessage.linkId,
                    actionMessage.providerId,
                    true /* isTryAgain */,
                    actionMessage.targetWindow
                ); /* tryAgainCallback */
            }
        );
    }
});

// Deletes the link in the body after a copy is attached
function tryDeleteLink(linkId: string, tryAgian: boolean, targetWindow: Window) {
    // We put this in a set timeout in case the user cancels the attachment at the last second.
    // In this case we will get a cancel call back right after the attach call back, which will have changed the
    // actionStatus to let us know the attachment wasn't actually created. The window in which a user can do this
    // is larger than you would think.
    logUsage('linkAttachAsACopySuccess', { isTryAgain: tryAgian });
    setTimeout(() => {
        const sharingLink: SharingLinkInfo = getSharingLinkInfo(linkId);
        if (sharingLink && sharingLink.linkActionStatus === LinkActionStatus.attachingAsACopy) {
            deleteLink(linkId, targetWindow);
        }
    }, 100);
}

// Moves the link in the body back to its normal state after attachAsACopy fails or is canceled
function tryRecoverLink(linkId: string, canceled: boolean, tryAgain: boolean) {
    setLinkActionStatus(linkId, LinkActionStatus.none);
    if (canceled) {
        logUsage('linkAttachAsACopyCanceled', { isTryAGain: tryAgain, isCalendar: false });
    } else {
        logUsage('linkAttachAsACopyFailed', { isTryAgain: tryAgain, isCalendar: false });
    }
}
