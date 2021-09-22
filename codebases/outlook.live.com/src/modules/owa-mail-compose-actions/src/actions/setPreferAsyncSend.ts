import type { ComposeViewState } from 'owa-mail-compose-store';
import { action } from 'satcheljs/lib/legacy';

export default action('setPreferAsyncSend')(function setPreferAsyncSend(
    viewState: ComposeViewState,
    preferAsyncSend: boolean
) {
    viewState.preferAsyncSend = preferAsyncSend;
});
