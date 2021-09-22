import { action } from 'satcheljs/lib/legacy';
import type { ComposeViewState } from 'owa-mail-compose-store';

export default action('setIsSavingSpinnerShown')(function setIsSavingSpinnerShown(
    viewState: ComposeViewState,
    isShown: boolean
) {
    viewState.isSavingSpinnerShown = isShown;
});
