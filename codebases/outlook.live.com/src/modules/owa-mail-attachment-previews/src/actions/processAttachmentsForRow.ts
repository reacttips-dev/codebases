import removeAttachmentPreviewsForRow from './removeAttachmentPreviewsForRow';
import { logUsage } from 'owa-analytics';
import { lazyShouldShowImageView, lazyGetAttachment } from 'owa-attachment-model-store';
import {
    AttachmentFullViewState,
    lazyCreateAttachmentFullViewStateAndStoreBackingModel,
} from 'owa-attachment-well-data';
import type { ClientItemId, ClientAttachmentId, MailboxInfo } from 'owa-client-ids';
import type AttachmentPreviewWellView from 'owa-mail-list-store/lib/store/schema/AttachmentPreviewWellView';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import { mailStore } from 'owa-mail-store';
import type AttachmentPreview from 'owa-service/lib/contract/AttachmentPreview';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ConversationType from 'owa-service/lib/contract/ConversationType';
import { action } from 'satcheljs/lib/legacy';
import { mutatorAction } from 'satcheljs';
import { getGuid } from 'owa-guid';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

// tslint:disable-next-line:forbid-import
import { observable } from 'mobx';

/**
 * Creates and returns the key for a attachment view state for a particular attachment on a row
 * @param rowId  id of the row
 * @param attachmentId id of the attachment
 * @return - key to store the attachmentViewState in the attachmentViewState map
 */
function getRowAttachmentViewStateKey(rowId: string, attachmentId: string): string {
    return rowId + '_' + attachmentId;
}

export async function createAndStoreAttachmentViewState(
    rowId: string,
    parentItemId: ClientItemId,
    attachment: AttachmentType,
    attachmentPreviewWellView: AttachmentPreviewWellView,
    mailboxInfo: MailboxInfo
) {
    const attachmentViewStateKey = getRowAttachmentViewStateKey(rowId, attachment.AttachmentId.Id);
    let attachmentViewState = listViewStore.attachmentViewStates.get(attachmentViewStateKey);

    // Pre-create the client attachment ID as an observable so we can use it throughout this function
    // Get rid of observable.object (bug #38655)
    const attachmentId: ClientAttachmentId = observable.object({
        ...attachment.AttachmentId,
        mailboxInfo: mailboxInfo,
    });

    /**
     * Because we are calling the lazy function we set the attachmentViewState in the promise.
     * This guarantees that the order of the attachments is also preserved. If the attachmentViewState is present
     * in the store and if we directly push it and then push the ones that are not present after they are lazily created
     * there are chances that we go out of order.
     */
    await lazyCreateAttachmentFullViewStateAndStoreBackingModel
        .import()
        .then(async createAttachmentFullViewStateAndStoreBackingModel => {
            attachmentViewState =
                attachmentViewState ||
                createAttachmentFullViewStateAndStoreBackingModel(
                    attachmentId,
                    attachment,
                    true /* isReadOnly */,
                    true /* uploadCompleted */,
                    false /* forceStoreBackingModel */,
                    false /* isSMIMEItem */,
                    false /* isProtectedVoiceMail */,
                    parentItemId
                );

            // Use the attachment model from the store
            attachment = (await lazyGetAttachment.import())(attachmentId).model;

            // Set the attachmentViewState in the store
            setAttachmentViewState(attachmentViewStateKey, attachmentViewState);

            // Add the view state key to the AttachmentPreviewWellView
            const shouldShowImageView = await lazyShouldShowImageView.import();
            addAttachmentViewStateKey(
                attachmentPreviewWellView,
                shouldShowImageView(attachment),
                attachmentViewStateKey
            );
        });
}

const setAttachmentViewState = mutatorAction(
    'setAttachmentViewStates',
    (key: string, attachmentViewState: AttachmentFullViewState) => {
        listViewStore.attachmentViewStates.set(key, attachmentViewState);
    }
);

const addAttachmentViewStateKey = mutatorAction(
    'addAttachmentViewStateKey',
    (
        attachmentPreviewWellView: AttachmentPreviewWellView,
        shouldShowImageView: boolean,
        attachmentViewStateKey: string
    ) => {
        if (shouldShowImageView) {
            attachmentPreviewWellView.imageViewStateIds.push(attachmentViewStateKey);
        } else {
            attachmentPreviewWellView.documentViewStateIds.push(attachmentViewStateKey);
        }
    }
);

export const processAttachmentPreviewsForItems = action('processAttachmentPreviewsForItems')(
    function processAttachmentPreviewsForItems(
        conversations: ConversationType[],
        itemIds: string[],
        mailboxInfo: MailboxInfo
    ) {
        /**
         * Step 1 - Get the conversations for which we have received previews
         * Some shall not return previews as there are false positives.
         */
        const conversationsWithPreviews = conversations.filter(conversation => {
            return conversation.AttachmentPreviews;
        });

        /**
         * Step 2 - Create a collection of all the previews received
         */
        const allAttachmentPreviews: AttachmentPreview[] = [];
        conversationsWithPreviews.forEach(conversation => {
            allAttachmentPreviews.push(...conversation.AttachmentPreviews.Previews);
        });

        /**
         * Step 3- Filter some previews that are missing information to show on the UI
         * FAST seems to leave entries on the files folder that are not cleaned up
         */
        const filteredPreviews = getFilteredPreviews(allAttachmentPreviews);

        /**
         * Step 4 - Create the final list of previews that should be processed
         * Process only the previews whose parent item id is present in the itemIds list which is
         * the list used to fetch the previews for.
         */
        const previewsToProcess = {};
        filteredPreviews.forEach(preview => {
            const itemId = preview.ParentItemId.Id;
            if (itemIds.indexOf(itemId) > -1) {
                if (!previewsToProcess[itemId]) {
                    previewsToProcess[itemId] = [];
                }

                previewsToProcess[itemId].push(preview);
            }
        });

        /**
         * Step 5
         * 1. If the item is already deleted then do not process previews for it. Else
         * 2.1 If preview is not received for item do clean up, set show flag to false and clean up store. else
         * 2.2 Proceed with the processing of the previews
         */
        itemIds.forEach(itemId => {
            const clientItem = mailStore.items.get(itemId);
            if (!clientItem) {
                delete previewsToProcess[itemId];
            } else {
                if (!previewsToProcess[itemId]) {
                    // 1. Set shouldShowAttachmentPreviews flag to false so that the placeholder space is removed.
                    clientItem.shouldShowAttachmentPreviews = false;

                    // 2. Remove attachment previews from the list view store maps
                    removeAttachmentPreviewsForRow(itemId);
                } else {
                    processAttachmentsForRow(itemId, previewsToProcess[itemId], mailboxInfo);
                }
            }
        });
    }
);

/**
 * Create the attachment well view state for the row
 * @param rowId - row id
 * @param previews - previews to be stored for this row
 * @param mailboxInfo - mailbox info to which the preview belongs
 */
export async function processAttachmentsForRow(
    rowId: string,
    previews: AttachmentPreview[],
    mailboxInfo: MailboxInfo
) {
    const attachmentPreviewWellView = {
        documentViewStateIds: [],
        imageViewStateIds: [],
    };

    await Promise.all(
        previews.map(async preview => {
            // Links are missing Ids (which used to be GUIDs) from FAST
            // I am generating client side since our code requires that everything has an Id
            addGuidIfNotPresent(preview);

            await createAndStoreAttachmentViewState(
                rowId,
                {
                    ...preview.ParentItemId,
                    mailboxInfo: mailboxInfo,
                },
                preview.Attachment,
                attachmentPreviewWellView,
                mailboxInfo
            );
        })
    );

    setRowAttachmentPreviewWellViews(rowId, attachmentPreviewWellView);
}

const addGuidIfNotPresent = mutatorAction('addGuidIfNotPresent', (preview: AttachmentPreview) => {
    if (!preview.Attachment.AttachmentId.Id) {
        preview.Attachment.AttachmentId.Id = getGuid();
    }
});

const setRowAttachmentPreviewWellViews = mutatorAction(
    'setRowAttachmentPreviewWellViews',
    (rowId: string, attachmentPreviewWellView: AttachmentPreviewWellView) => {
        listViewStore.rowAttachmentPreviewWellViews.set(rowId, attachmentPreviewWellView);
    }
);

export function getFilteredPreviews(previews: AttachmentPreview[]): AttachmentPreview[] {
    // If the preview has no name, we should not show on the UI
    const validPreviews = previews.filter(isValidPreview);

    validPreviews.forEach(preview => {
        if (!preview.Attachment.AttachmentId?.Id) {
            const refAttachment = preview.Attachment as ReferenceAttachment;
            if (refAttachment.IsLink) {
                //Assigning a random id because links do not have attachment id but some client scenario may assume that they do
                preview.Attachment.AttachmentId = { Id: getGuid() };
            }
        }
    });

    // We filtered some content. Lets log what has been filtered
    // so we can track and get data from Kusto if this happens a lot
    if (validPreviews.length !== previews.length) {
        const invalidPreviews = previews.filter(preview => !isValidPreview(preview));
        const attachmentIdsStr = invalidPreviews
            .map(invalidPreview =>
                invalidPreview.Attachment.AttachmentId
                    ? invalidPreview.Attachment.AttachmentId.Id
                    : 'UNDEFINED'
            )
            .join(',');

        logUsage('InvalidAttachmentPreview', {
            AttachmentIdString: attachmentIdsStr,
        });
    }

    return validPreviews;
}

function isValidPreview(preview: AttachmentPreview): boolean {
    return !!preview.Attachment.Name;
}
