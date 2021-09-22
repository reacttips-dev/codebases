import { WarningAttachmentsCanNotBeDeleted } from 'owa-locstrings/lib/strings/warningattachmentscannotbedeleted.locstring.json';
import loc, { format } from 'owa-localize';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import trySaveMessage, { waitForActiveSaving } from '../actions/trySaveMessage';
import { SMIME_CONTROL_ERROR_MESSAGE_ID } from '../orchestrators/onSmimeOptionsChangeOrchestrator';
import type { ComposeViewState } from 'owa-mail-compose-store';
import createAttachments from '../utils/createAttachments';
import isInlineAttachmentStateType from 'owa-attachment-full-data/lib/utils/isInlineAttachmentStateType';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import type { AttachmentState, AttachmentType } from 'owa-attachment-well-data';
import removeAttachmentFromWell from 'owa-attachment-well-data/lib/actions/removeAttachmentFromWell';
import updateChangeKeyOnItemId from 'owa-attachment-well-data/lib/actions/updateChangeKeyOnItemId';
import { exportedHelperFunctions as deleteAttachmentHelperFunctions } from 'owa-attachment-well-data/lib/actions/deleteAttachment';
import type { ClientItemId } from 'owa-client-ids';
import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';
import createBlob from 'owa-encoding-utils/lib/utils/base64/createBlob';
import encode from 'owa-encoding-utils/lib/utils/base64/encode';
import blobToFile from 'owa-encoding-utils/lib/utils/blobToFile';
import { getComposeItemResponseShape } from 'owa-mail-compose-item-response-shape/lib/getComposeItemResponseShape';
import getItem from 'owa-mail-store/lib/services/getItem';
import getSmimeAttachmentType from 'owa-smime/lib/utils/getSmimeAttachmentType';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import { lazySetOriginalSrcForSmime } from 'owa-inline-image';

import * as trace from 'owa-trace';
import { getTypeOfAttachment, TypeOfAttachment } from 'owa-attachment-type';
import {
    ClientAttachmentId,
    SmimeAttachmentType,
    isSmimeAttachment,
} from 'owa-attachment-model-store';
import {
    createLocalComputerFiles,
    createMailItemFileForSmime,
    AttachmentFileList,
} from 'owa-attachment-file-types';
import {
    SMIME_INSTALLED_HEADER_KEY,
    SMIME_INSTALLED_HEADER_TRUE,
} from 'owa-smime/lib/utils/constants';

const MAIL_FILE_EXTENSION = '.eml';

export default async function onSmimeModeDisabled(viewState: ComposeViewState) {
    // Remove if any control error infobars are present.
    removeInfoBarMessage(viewState, SMIME_CONTROL_ERROR_MESSAGE_ID);

    if (viewState.itemId) {
        // Check and remove p7m file if its a switch from S/MIME message to non-S/MIME message
        // and item is already created. We await this to ensure that the p7m attachment is deleted before the action is completed
        await tryDeleteSmimeAttachmentType(viewState);
        moveAttachmentsFromClientToServer(viewState);
    } else if (!(await waitForActiveSaving(viewState))) {
        // If we don't have itemId it means a save has never been done, so before we start uploading attachments we need to do a save action.
        await trySaveMessage(viewState);
    }
}

/**
 * For every S/MIME attachment, we should remove it from the well and create it again
 * using the upload queue once S/MIME is disabled
 * @param viewState
 */
function moveAttachmentsFromClientToServer(viewState: ComposeViewState): void {
    const attachments: AttachmentState[] = [
        ...viewState.attachmentWell.docViewAttachments,
        ...viewState.attachmentWell.inlineAttachments,
    ];
    attachments.forEach(async attachment => {
        const attachmentId = attachment.attachmentId.Id;
        const attachmentModel = getAttachment(attachment.attachmentId);
        if (attachmentModel && isSmimeAttachment(attachmentId)) {
            const smimeAttachment = attachmentModel.model as SmimeAttachmentType;
            if (!smimeAttachment) {
                trace.errorThatWillCauseAlert(
                    'SmimeTraceError: Attachment not found in moveAttachmentsFromClientToServer'
                );
                return;
            }
            const attachmentType = getTypeOfAttachment(smimeAttachment);
            let changedFiles: AttachmentFileList;
            if (attachmentType === TypeOfAttachment.Mail) {
                changedFiles = createMailItemFileForSmime(
                    smimeAttachment.Name,
                    encode(smimeAttachment.MimeContent),
                    smimeAttachment.Size
                );
            } else {
                const file = createFileFromSmimeAttachment(smimeAttachment);
                changedFiles = createLocalComputerFiles([file]);
            }
            // Remove existing attachments from the well
            removeAttachmentFromWell(viewState.attachmentWell, attachment);
            // Recreate the same attachments
            if (isInlineAttachmentStateType(attachment)) {
                createAttachments(
                    changedFiles,
                    viewState,
                    {
                        isInline: true,
                        isHiddenInline: false,
                        shouldShare: false,
                        skipProcessInlineImage: true /* Since image is already present from S/MIME mode, we need not process it again */,
                    },
                    null /* onFinish */,
                    (
                        parentItemId: ClientItemId,
                        attachmentId: ClientAttachmentId,
                        attachmentType: AttachmentType
                    ) =>
                        onAttachmentCreated(
                            attachmentId,
                            attachmentType,
                            smimeAttachment.ContentId,
                            viewState
                        )
                );
            } else {
                createAttachments(changedFiles, viewState, {
                    isInline: false,
                    isHiddenInline: true,
                    shouldShare: false,
                });
            }
        }
    });
}

async function onAttachmentCreated(
    attachmentIdFromServer: ClientAttachmentId,
    attachmentType: AttachmentType,
    oldContentId: string,
    viewState: ComposeViewState
) {
    const setOriginalSrcForSmime = await lazySetOriginalSrcForSmime.import();
    const isElementReplaced = await setOriginalSrcForSmime(
        viewState,
        oldContentId,
        attachmentType.ContentId
    );
    isElementReplaced && updateContentToViewState(viewState);
}

function createFileFromSmimeAttachment(smimeAttachment: SmimeAttachmentType) {
    const { Name, ContentType, MimeContent, Content } = smimeAttachment;
    const nameWithExtension = MimeContent ? Name + MAIL_FILE_EXTENSION : Name;
    const fileContent = MimeContent ? encode(MimeContent) : Content;
    const blob = createBlob(fileContent, ContentType);
    return blobToFile(blob, nameWithExtension);
}

// Delete the S/MIME attachment type (p7m file), if present in the item
async function tryDeleteSmimeAttachmentType(viewState: ComposeViewState) {
    const { itemId } = viewState;
    const shape = getComposeItemResponseShape(viewState.bodyType);
    try {
        const smimeHeaders = new Headers();
        smimeHeaders.set(SMIME_INSTALLED_HEADER_KEY, SMIME_INSTALLED_HEADER_TRUE);
        const requestOptions = {
            headers: smimeHeaders,
        };
        const item = await getItem(
            itemId.Id,
            shape,
            'MailCompose',
            null /*requestServerVersion*/,
            undefined /*mailboxInfo*/,
            requestOptions
        );
        if (item && !(item instanceof Error)) {
            const smimeAttachment: AttachmentType = getSmimeAttachmentType(item);

            if (item && smimeAttachment && smimeAttachment.AttachmentId) {
                const attachmentId = {
                    Id: smimeAttachment.AttachmentId.Id,
                } as ClientAttachmentId;
                const deleteAttachmentResult = await deleteAttachmentHelperFunctions.invokeDeleteAttachmentFromDraftMutation(
                    attachmentId,
                    null, // parent item ID needed for Hx resolver only and Monarch does not support SMIME yet
                    requestOptions
                );
                updateChangeKeyOnItemId(
                    itemId,
                    deleteAttachmentResult.RootItemId.RootItemChangeKey
                );
            }
        }
    } catch (error) {
        trace.errorThatWillCauseAlert('SmimeTraceError: ' + error.message);
        addInfoBarMessage(viewState, 'WarningAttachmentCanNotBeDeleted', [
            format(loc(WarningAttachmentsCanNotBeDeleted), 'smime.p7m'),
        ]);
    }
}
