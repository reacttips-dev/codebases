import ActionType from '../schema/ActionType';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';

export default function isSaveToCloudApplicable(attachment: AttachmentFullViewState): boolean {
    if (!attachment.strategy.isSaveToCloudSupported) {
        return false;
    }

    return attachment.completedActions.indexOf(ActionType.SaveToCloud) === -1;
}
