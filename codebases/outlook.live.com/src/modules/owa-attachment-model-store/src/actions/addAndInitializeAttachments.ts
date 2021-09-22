import initializeAttachment from './initialization/initializeAttachment';
import type AttachmentModel from '../store/schema/AttachmentModel';
import type AttachmentStore from '../store/schema/AttachmentStore';
import getStore from '../store/store';
import createAttachmentModel from '../utils/createAttachmentModel';
import { action } from 'satcheljs/lib/legacy';
import type {
    default as AttachmentInitializationParameters,
    AttachmentModelPropertyValues,
} from '../store/schema/AttachmentInitializationParameters';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import { isCloudyAttachmentType } from '../utils/isCloudyAttachment';

function setInitialValuesForModel(
    attachment: AttachmentModel,
    initialValue: AttachmentModelPropertyValues
) {
    initialValue = initialValue ? initialValue : {};

    Object.keys(initialValue).forEach(propertyName => {
        if (initialValue[propertyName]) {
            attachment[propertyName] = initialValue[propertyName];
        }
    });
}

export default action('addAndInitializeAttachments')(function addAndInitializeAttachments(
    coreAttachments: AttachmentInitializationParameters[],
    isReadOnly: boolean,
    forceAdd: boolean = false,
    skipInitialization: boolean = false
): void {
    const store: AttachmentStore = getStore();

    if (!forceAdd) {
        // Filter out all the attachments we already have in the store as we don't want to recreate them
        coreAttachments = coreAttachments.filter(
            attachmentWrapper =>
                !store.attachments.has(attachmentWrapper.attachment.AttachmentId.Id)
        );
    }

    // Create the models and initialize them
    const models: AttachmentModel[] = coreAttachments.map(
        (attachmentWrapper: AttachmentInitializationParameters) => {
            const {
                attachmentId,
                attachment,
                permissionInfo,
                modelInitializationValues,
            } = attachmentWrapper;
            const model: AttachmentModel = createAttachmentModel(attachmentId, attachment);
            if (!skipInitialization) {
                initializeAttachment(model, permissionInfo, isReadOnly);
            }

            setInitialValuesForModel(model, modelInitializationValues || {});
            return model;
        }
    );

    // Adding all the attachments in the store
    models.forEach(model => {
        const attachment = model.model;
        // some service commands do not include AttachmentOriginalUrl
        // try to set AttachmentOriginalUrl from existing model in the store
        if (attachment && !attachment.AttachmentOriginalUrl) {
            const oldModel = store.attachments.get(model.id.Id);
            if (oldModel?.model?.AttachmentOriginalUrl) {
                attachment.AttachmentOriginalUrl = oldModel.model.AttachmentOriginalUrl;
            }
        }

        if (attachment && isCloudyAttachmentType(attachment)) {
            const newReferenceAttachment = attachment as ReferenceAttachment;
            if (!newReferenceAttachment.AttachLongPathName) {
                const oldModel = store.attachments.get(model.id.Id);
                const oldReferenceAttachment = oldModel?.model as ReferenceAttachment;
                if (oldReferenceAttachment?.AttachLongPathName) {
                    newReferenceAttachment.AttachLongPathName =
                        oldReferenceAttachment.AttachLongPathName;
                }
            }
        }

        store.attachments.set(model.id.Id, model);
    });
});
