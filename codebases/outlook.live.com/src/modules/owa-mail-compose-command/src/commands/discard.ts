import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';
import workaroundFocusIssueForFirefox from 'owa-editor/lib/utils/workaroundFocusIssueForFirefox';
import type { ComposeViewState } from 'owa-mail-compose-store';
import discardCompose, {
    shouldShowDiscardConfirmDialog,
} from 'owa-mail-compose-actions/lib/actions/discardCompose';

export default function discard(viewState: ComposeViewState, targetWindow?: Window) {
    if (shouldShowDiscardConfirmDialog(viewState)) {
        workaroundFocusIssueForFirefox(targetWindow?.document);
    }
    updateContentToViewState(viewState);
    discardCompose(viewState, targetWindow);
}
