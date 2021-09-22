import { lazyPreviewAttachment } from 'owa-attachment-preview-sxs-actions';
import { previewAttachment } from 'owa-attachment-select-actions/lib/actions/publicActions';
import { orchestrator } from 'satcheljs';
import { getCurrentModule } from 'owa-app-module-store';
import { Module } from 'owa-workloads';

orchestrator(previewAttachment, actionMessage => {
    const currentModule = getCurrentModule();
    if (
        !currentModule ||
        currentModule === Module.Mail ||
        currentModule === Module.FilesHub ||
        currentModule === Module.MailDeepLink
    ) {
        const { context } = actionMessage;
        lazyPreviewAttachment.importAndExecute(context);
    }
});
