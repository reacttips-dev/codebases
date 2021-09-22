import type { AttachmentWellViewState } from 'owa-attachment-well-data';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { getCountOfAttachmentTriggerKeywords } from 'owa-editor-forgotten-attachments-plugin';

export default function checkForForgottenAttachments(viewState: ComposeViewState): boolean {
    const isHTMLBody = viewState.bodyType === 'HTML';

    if (
        (isHTMLBody && doesComposeHTMLBodyContainAttachmentTriggerWords(viewState)) ||
        (!isHTMLBody && doesComposeTextBodyContainAttachmentTriggerWords(viewState))
    ) {
        return !checkForAttachments(viewState.attachmentWell);
    }

    return false;
}

function checkForAttachments(attachmentWellViewState: AttachmentWellViewState): boolean {
    return (
        attachmentWellViewState.docViewAttachments.length > 0 ||
        attachmentWellViewState.imageViewAttachments.length > 0 ||
        attachmentWellViewState.inlineAttachments.length > 0
    );
}

function doesComposeHTMLBodyContainAttachmentTriggerWords(viewState: ComposeViewState): boolean {
    return viewState.forgottenAttachments?.hasAttachmentTriggerWords;
}

function doesComposeTextBodyContainAttachmentTriggerWords(viewState: ComposeViewState): boolean {
    const { content, quotedBody, useSmartResponse, forgottenAttachments } = viewState;
    if (!useSmartResponse && quotedBody) {
        const attachmentTriggersInContent = getCountOfAttachmentTriggerKeywords(content);

        // If `attachmentKeywordsDetectedBeforeUserInput` is not null and the current
        // `bodyType` is 'Text' then it means user switched from HTML to text
        // so we just look at the alrady detected keywords before user input.
        // If it is null then it means the user is defaulted to a plain text editor
        // in which case the quoted body should be a plain text and we can count
        // trigger words from it directly.
        const attachmentTriggersInQuotedBody =
            forgottenAttachments &&
            forgottenAttachments.attachmentKeywordsDetectedBeforeUserInput !== null
                ? forgottenAttachments.attachmentKeywordsDetectedBeforeUserInput
                : getCountOfAttachmentTriggerKeywords(quotedBody);

        if (attachmentTriggersInContent > attachmentTriggersInQuotedBody) {
            return true;
        }
    } else {
        return getCountOfAttachmentTriggerKeywords(content) > 0;
    }

    return false;
}
