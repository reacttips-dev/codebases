import getMaxClassicAttachmentsSize from './getMaxClassicAttachmentsSize';
import type AttachmentWellViewState from '../schema/AttachmentWellViewState';
import SaveAllToCloudStatus from '../schema/SaveAllToCloudStatus';

let maxClassicAttachmentSize;

export default function getAttachmentWellInitialValue(
    isReadOnly: boolean,
    isInitialized: boolean,
    composeId: string
): AttachmentWellViewState {
    if (!maxClassicAttachmentSize) {
        maxClassicAttachmentSize = getMaxClassicAttachmentsSize();
    }

    const attachmentWellViewState: AttachmentWellViewState = {
        composeId: composeId,
        allowShowMultipleRows: !isReadOnly,
        didViewOverflowOneRow: false,
        canOverrideAllowShowMultipleRows: true,
        docViewAttachments: [],
        imageViewAttachments: [],
        inlineAttachments: [],
        isInitialized: isInitialized,
        isReadOnly: isReadOnly,
        groupId: null,
        maxTotalClassicAttachmentSize: maxClassicAttachmentSize,
        totalClassicAttachmentSize: 0,
        /* We use inactive as the initial value.
        We need to check wehther the operation is applicable inside the view component,
        as it depends on the saveToCloud status of all the attachments.
        The view render method is a good place to check as it is invoked when the dependent properties change.
        */
        saveAllToCloudStatus: SaveAllToCloudStatus.Inactive,
        supportedMenuActions: null,
        sharingLinkIds: [],
        announcedComponentMessage: null,
    };

    return attachmentWellViewState;
}
