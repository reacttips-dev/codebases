import initializeAttachmentFullViewState from './initialization/initializeAttachmentFullViewState';
import loadWacAttachmentInfo from './loadWacAttachmentInfo';
import checkAttachmentPermissionsForWacJsApi from './checkAttachmentPermissionsForWacJsApi';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import type AttachmentMenuAction from '../schema/AttachmentMenuAction';
import createAttachmentFullViewState from '../utils/createAttachmentFullViewState';
import { AttachmentFileType } from 'owa-attachment-file-types';
import { calculateUseJsApi } from '../index';
import { TypeOfAttachment } from 'owa-attachment-type';
import addAndInitializeAttachments from 'owa-attachment-model-store/lib/actions/addAndInitializeAttachments';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

/**
 * Stores the attachment in the attachment store and returns the attachment view state creates.
 * @param attachmentId is the ID of the attachment containing the mailbox information
 * @param attachment for which to create the view state
 * @param isReadOnly - whether this is read only scenario
 * @param uploadCompleted - whether the upload is completed
 * @param forceStoreBackingModel - Force the storage of backing model so if it exists then it will override it
 * @param parentItemId - the ItemId related to the parent Item of the attachment
 * @param supportedMenuActions - The list of supported menu actions for the attachment
 * @param preloadWacAttachmentInfo - whether to preload WacAttachmentInfo
 */
export default function createAttachmentFullViewStateAndStoreBackingModel(
    attachmentId: ClientAttachmentId,
    attachment: AttachmentType,
    isReadOnly: boolean,
    uploadCompleted: boolean,
    forceStoreBackingModel: boolean,
    isSMIME: boolean,
    isProtectedVoiceMail: boolean,
    parentItemId: ClientItemId = null,
    supportedMenuActions?: AttachmentMenuAction[],
    preloadWacAttachmentInfo: boolean = false
): AttachmentFullViewState {
    // Store attachment
    addAndInitializeAttachments(
        [{ attachmentId: attachmentId, attachment: attachment }],
        isReadOnly,
        forceStoreBackingModel
    );
    const attachmentModel = getAttachment(attachmentId);

    // Create ViewState
    const attachmentViewState: AttachmentFullViewState = createAttachmentFullViewState(
        attachmentId,
        isReadOnly,
        uploadCompleted,
        attachmentModel.type === TypeOfAttachment.Reference,
        AttachmentFileType.Unknown,
        false, // IsPlaceHolder
        parentItemId
    );

    // Initialize the attachment view state
    initializeAttachmentFullViewState(
        attachmentViewState,
        attachmentModel,
        false /* treatLinksAsAttachments */,
        supportedMenuActions,
        isSMIME,
        isProtectedVoiceMail
    );

    if (preloadWacAttachmentInfo) {
        const providerType: string = (attachmentModel.model as ReferenceAttachment).ProviderType;
        const useJsApi: boolean = calculateUseJsApi(
            attachmentViewState.isCloudy,
            providerType,
            attachmentModel.model.Name
        );

        // Existing prefetching is based on legacy WAC access. We will implement JsAPI prefetching separately.
        if (!useJsApi) {
            loadWacAttachmentInfo(attachmentViewState);
        } else {
            checkAttachmentPermissionsForWacJsApi(attachmentModel, attachmentViewState);
        }
    }

    return attachmentViewState;
}
