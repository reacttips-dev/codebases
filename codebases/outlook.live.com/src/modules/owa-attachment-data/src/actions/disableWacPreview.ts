import AttachmentOpenAction from '../schema/AttachmentOpenAction';
import AttachmentPreviewMethod from '../schema/AttachmentPreviewMethod';
import type AttachmentViewStrategy from '../schema/AttachmentViewStrategy';

export default function disableWacPreview(strategy: AttachmentViewStrategy): void {
    if (strategy.previewMethod === AttachmentPreviewMethod.Wac) {
        strategy.previewMethod = AttachmentPreviewMethod.Unsupported;
        strategy.supportedOpenActions = strategy.supportedOpenActions.filter(
            action => action !== AttachmentOpenAction.Preview
        );
    }
}
