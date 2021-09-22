import setAsyncSendState from './setAsyncSendState';
import { ComposeViewState, ComposeOperation, AsyncSendState } from 'owa-mail-compose-store';
import { lazyLoadDraftToCompose } from '../index';
import moveComposeToTab from './moveComposeToTab';
import { action } from 'satcheljs/lib/legacy';

export default action('cancelSend')(function cancelSend(
    viewState: ComposeViewState,
    sxsId: string
) {
    // Reopen the compose editor
    // 1. In the drafts folder, load the draft to compose (VSO 36275)
    // 2. In tabview full compose, open the full compose form in a new tab (VSO 34954)
    // 3. In tabview inline compose, handling is done in updateSecondaryReadingPaneTabOrchestrator
    setAsyncSendState(viewState, AsyncSendState.None);
    if (viewState.operation === ComposeOperation.EditDraft) {
        lazyLoadDraftToCompose.importAndExecute(viewState.itemId.Id, sxsId);
    } else if (!viewState.isInlineCompose) {
        moveComposeToTab(viewState, true /* isShown */, true /* makeActive */);
    }
});
