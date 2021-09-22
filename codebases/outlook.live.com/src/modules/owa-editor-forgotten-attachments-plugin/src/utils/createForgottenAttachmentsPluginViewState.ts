import type { ForgottenAttachmentsPluginViewState } from '../store/schema/ForgottenAttachmentsPluginViewState';

export function createForgottenAttachmentsPluginViewState(): ForgottenAttachmentsPluginViewState {
    return {
        hasAttachmentTriggerWords: false,
        attachmentKeywordsDetectedBeforeUserInput: null,
    };
}
