import type { ComposeViewState } from 'owa-mail-compose-store';
import { mailStore } from 'owa-mail-store';

export default function safelyGetStampedLanguage(composeViewState: ComposeViewState): string {
    if (composeViewState) {
        const referenceItem = mailStore.items.get(composeViewState.referenceItemId?.Id);

        if (referenceItem) {
            const language = referenceItem?.stampedLanguage?.language;
            return language ? language : '';
        }
    }

    return '';
}
