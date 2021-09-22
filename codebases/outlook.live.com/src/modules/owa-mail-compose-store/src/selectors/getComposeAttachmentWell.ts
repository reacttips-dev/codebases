import { getStore } from '../store/composeStore';
import type { AttachmentWellViewState } from 'owa-attachment-well-data';

export function getComposeAttachmentWell(linksContainerId: string) {
    let attachmentWell: AttachmentWellViewState;
    let composeViewStateValues = getStore().viewStates.values();

    for (let value of composeViewStateValues) {
        if (value.linksContainerId === linksContainerId) {
            attachmentWell = value.attachmentWell;
            break;
        }
    }

    return attachmentWell;
}
