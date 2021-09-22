import type { ComposeViewState } from 'owa-mail-compose-store';
import { action } from 'satcheljs/lib/legacy';

export default action('updateSubject')(function updateSubject(
    viewState: ComposeViewState,
    subject: string
) {
    viewState.subject = subject;
    viewState.isDirty = true;
});
