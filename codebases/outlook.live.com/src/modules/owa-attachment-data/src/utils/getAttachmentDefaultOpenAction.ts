import type AttachmentViewStrategy from '../schema/AttachmentViewStrategy';
import AttachmentOpenAction from '../schema/AttachmentOpenAction';

export default function getAttachmentDefaultOpenAction(
    strategy: AttachmentViewStrategy
): AttachmentOpenAction {
    return (
        (strategy.supportedOpenActions.length && strategy.supportedOpenActions[0]) ||
        AttachmentOpenAction.NoAction
    );
}
