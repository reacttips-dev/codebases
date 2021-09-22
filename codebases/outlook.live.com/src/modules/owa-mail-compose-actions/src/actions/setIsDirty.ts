import { action } from 'satcheljs/lib/legacy';
import type { ComposeViewState } from 'owa-mail-compose-store';

export default action('setIsDirty')(function setIsDirty(
    viewState: ComposeViewState,
    isDirty: boolean = true
) {
    viewState.isDirty = isDirty;
});
