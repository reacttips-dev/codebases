import setNumberOfWaitingAttachments from '../actions/setNumberOfWaitingAttachments';
import trySaveMessage, { waitForActiveSaving } from '../actions/trySaveMessage';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { logUsage } from 'owa-analytics';
import {
    AttachmentFileList,
    AttachmentFile,
    AttachmentFileType,
    ExpirableBase64InlineImageFile,
} from 'owa-attachment-file-types';
import { ClientAttachmentId, getUserMailboxInfo } from 'owa-client-ids';
import triggerPolicyTips from '../actions/triggerPolicyTips';
import { isPolicyTipsEnabled } from 'owa-policy-tips/lib/utils/isPolicyTipsEnabled';
import EventTrigger from 'owa-service/lib/contract/EventTrigger';
import { lazyCreateSmimeAttachmentsFromFiles } from 'owa-smime';
import isSmimeEnabledInViewState from 'owa-smime/lib/utils/isSmimeEnabledInViewState';
import { trace } from 'owa-trace';
import {
    lazyProcessInlineImageBeforeUpload,
    lazyGetExpirableImageBase64Src,
    lazyOnImageError,
} from 'owa-inline-image';
import { CONTEXT_UPLOAD, FILETYPE_ATTACHMENT } from 'owa-inline-image/lib/utils/constants';
import {
    lazyCreateAttachmentsViaQueueManager,
    CreateAttachmentsProperties,
    OnAttachmentCreatedCallback,
    OnAttachmentCanceledOrFailedCallback,
} from 'owa-attachment-well-data';
import { lazyLogImageLoadError } from 'owa-inline-image-loader';
import { isFeatureEnabled } from 'owa-feature-flags';

// Error message for expirable image loading error
const EXPIRABLE_IMAGE_LOAD_ERROR = 'ExpirableImageLoadingFail';

const BASE64_IMAGE_REGEX = new RegExp('^data:(image\\/\\w+);base64,([A-Za-z0-9+/=]+?)$', 'i');

interface SplittedAttachmentFiles {
    nonExpirableFiles: AttachmentFile[];
    expirableFiles: ExpirableBase64InlineImageFile[];
}

function createAttachmentsHandler(
    files: AttachmentFileList,
    composeViewState: ComposeViewState,
    properties: CreateAttachmentsProperties,
    onAllAttachmentsProcessed?: (attachmentId: ClientAttachmentId) => void,
    onAttachmentCreatedCallback?: OnAttachmentCreatedCallback,
    onAttachmentCanceledOrFailedCallback?: OnAttachmentCanceledOrFailedCallback,
    tryAgainCallback?: () => void
) {
    const { nonExpirableFiles, expirableFiles } = splitAttachmentFiles(files);
    if (isSmimeEnabledInViewState(composeViewState.smimeViewState)) {
        lazyCreateSmimeAttachmentsFromFiles.import().then(async createSmimeAttachmentsFromFiles => {
            try {
                const filesQueuedToAttach = await createSmimeAttachmentsFromFiles(
                    nonExpirableFiles,
                    {
                        ...composeViewState.itemId,
                        mailboxInfo: getUserMailboxInfo(),
                    },
                    composeViewState.attachmentWell,
                    properties,
                    composeViewState
                );

                inlineAttachmentsHandler(properties, filesQueuedToAttach, composeViewState);
            } catch (e) {
                logUsage(
                    'CreateSmimeAttachmentsFromFilesErrorDatapoint',
                    { errorMessage: e.message },
                    { isCore: true }
                );
                trace.warn(e);
            }
        });
    } else {
        if (expirableFiles.length > 0) {
            Promise.all([
                lazyGetExpirableImageBase64Src.import(),
                lazyCreateAttachmentsViaQueueManager.import(),
                lazyProcessInlineImageBeforeUpload.import(),
                lazyOnImageError.import(),
            ]).then(
                ([
                    getExpirableImageBase64Src,
                    createAttachmentsViaQueueManager,
                    processInlineImageBeforeUpload,
                    onImageError,
                ]) => {
                    expirableFiles.forEach(
                        (expirableImageFileInfo: ExpirableBase64InlineImageFile) => {
                            getExpirableImageBase64Src(expirableImageFileInfo.imageSrc)
                                .then(imageSrc => {
                                    const base64Match = imageSrc.match(BASE64_IMAGE_REGEX);
                                    expirableImageFileInfo.type = base64Match[1];
                                    expirableImageFileInfo.dataUri = base64Match[2];
                                    createAttachmentsViaQueueManager(
                                        composeViewState.attachmentWell,
                                        {
                                            ...composeViewState.itemId,
                                            mailboxInfo: properties.mailboxInfo
                                                ? properties.mailboxInfo
                                                : getUserMailboxInfo(),
                                        },
                                        [expirableImageFileInfo],
                                        composeViewState,
                                        properties,
                                        onAllAttachmentsProcessed,
                                        onAttachmentCreatedCallback,
                                        onAttachmentCanceledOrFailedCallback,
                                        tryAgainCallback
                                    );
                                })
                                .catch(() => {
                                    lazyLogImageLoadError.import().then(imageLoadErrorLogger => {
                                        imageLoadErrorLogger(
                                            FILETYPE_ATTACHMENT /* type */,
                                            '' /* howLoad */,
                                            EXPIRABLE_IMAGE_LOAD_ERROR /* error */,
                                            '' /* statusCode */,
                                            CONTEXT_UPLOAD /* context */
                                        );
                                    });
                                    onImageError(
                                        composeViewState.inlineImage,
                                        composeViewState,
                                        expirableImageFileInfo.tempId
                                    );
                                });
                            processInlineImageBeforeUpload(
                                composeViewState.inlineImage,
                                composeViewState,
                                expirableImageFileInfo.tempId,
                                expirableImageFileInfo
                            );
                        }
                    );
                }
            );
        }
        if (nonExpirableFiles.length > 0) {
            lazyCreateAttachmentsViaQueueManager.import().then(createAttachmentsViaQueueManager => {
                const filesQueuedToAttach = createAttachmentsViaQueueManager(
                    composeViewState.attachmentWell,
                    {
                        ...composeViewState.itemId,
                        mailboxInfo: properties.mailboxInfo
                            ? properties.mailboxInfo
                            : getUserMailboxInfo(),
                    },
                    nonExpirableFiles,
                    composeViewState,
                    properties,
                    onAllAttachmentsProcessed,
                    onAttachmentCreatedCallback,
                    onAttachmentCanceledOrFailedCallback,
                    tryAgainCallback
                );

                inlineAttachmentsHandler(properties, filesQueuedToAttach, composeViewState);
            });
        }
    }
}

function inlineAttachmentsHandler(
    properties: CreateAttachmentsProperties,
    filesQueuedToAttach: AttachmentFileList,
    composeViewState: ComposeViewState
) {
    if (properties.isInline && !isFeatureEnabled('cmp-inlineImageV2')) {
        const fileLength = filesQueuedToAttach.length;
        const inlineAttachmentsLength = composeViewState.attachmentWell.inlineAttachments.length;
        lazyProcessInlineImageBeforeUpload.import().then(processInlineImageBeforeUpload => {
            for (let i = 0; i < fileLength; i++) {
                // Get the last fileLength number of inline attachments
                // since they are the new ones created from above createAttachmentsViaQueueManager.
                const attachmentState =
                    composeViewState.attachmentWell.inlineAttachments[
                        inlineAttachmentsLength - fileLength + i
                    ];
                processInlineImageBeforeUpload(
                    composeViewState.inlineImage,
                    composeViewState,
                    attachmentState.placeholderId,
                    filesQueuedToAttach[i]
                );
            }
        });
    }
}

export default async function createAttachments(
    files: AttachmentFileList,
    composeViewState: ComposeViewState,
    properties: CreateAttachmentsProperties,
    onAllAttachmentsProcessed?: (attachmentId: ClientAttachmentId) => void,
    onAttachmentCreatedCallback?: OnAttachmentCreatedCallback,
    onAttachmentCanceledOrFailedCallback?: OnAttachmentCanceledOrFailedCallback,
    tryAgainCallback?: () => void
) {
    let attachmentIsWaiting = false;

    // We are checking for S/MIME mail here, because we don't need an itemId to create S/MIME attachments
    // ItemId is not required because S/MIME attachments are not uploaded to the server.
    const isSmimeCompose = isSmimeEnabledInViewState(composeViewState.smimeViewState);

    if (!composeViewState.itemId && !isSmimeCompose) {
        // Until item id is retrieved, attachment creation is put on hold
        // and messages are prevented from being sent with a wait dialog.
        // This mimics the behavior in jsMVVM (VSO 33271)
        attachmentIsWaiting = true;
        setNumberOfWaitingAttachments(
            composeViewState,
            composeViewState.numberOfWaitingAttachments + 1
        );
    }

    try {
        if (
            !composeViewState.itemId &&
            !isSmimeCompose &&
            !(await waitForActiveSaving(composeViewState))
        ) {
            await trySaveMessage(composeViewState);
        }

        createAttachmentsHandler(
            files,
            composeViewState,
            properties,
            attachmentId => {
                if (onAllAttachmentsProcessed) {
                    onAllAttachmentsProcessed(attachmentId);
                }
                if (isPolicyTipsEnabled()) {
                    triggerPolicyTips(composeViewState, EventTrigger.AttachmentAdded);
                }
            },
            onAttachmentCreatedCallback,
            onAttachmentCanceledOrFailedCallback,
            tryAgainCallback
        );
    } finally {
        if (attachmentIsWaiting) {
            // Always decrement the number of waiting attachments in the end,
            // even if the save failed and the attachment was not handled, so
            // that the user can still send the message
            setNumberOfWaitingAttachments(
                composeViewState,
                composeViewState.numberOfWaitingAttachments - 1
            );
        }
    }
}

function splitAttachmentFiles(files: AttachmentFileList): SplittedAttachmentFiles {
    const expirableFiles: ExpirableBase64InlineImageFile[] = [];
    const nonExpirableFiles: AttachmentFile[] = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].fileType === AttachmentFileType.ExpirableBase64InlineImage) {
            expirableFiles.push(files[i] as ExpirableBase64InlineImageFile);
        } else {
            nonExpirableFiles.push(files[i]);
        }
    }
    return { nonExpirableFiles, expirableFiles };
}
