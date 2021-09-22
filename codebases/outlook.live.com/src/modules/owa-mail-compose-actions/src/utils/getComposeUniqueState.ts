import type { ComposeViewState } from 'owa-mail-compose-store';
import { ComposeUniqueState } from 'owa-attachment-filepicker';

export default function getComposeUniqueState(viewState: ComposeViewState): ComposeUniqueState {
    if (viewState.protectionViewState?.IRMData?.RmsTemplateId) {
        return ComposeUniqueState.Encrypted;
    }
    if (viewState.bodyType !== 'HTML') {
        return ComposeUniqueState.PlainText;
    }

    return ComposeUniqueState.None;
}
