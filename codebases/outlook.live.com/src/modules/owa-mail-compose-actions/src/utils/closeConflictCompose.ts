import { CloseConflictComposeTask, getStore } from 'owa-mail-compose-store';
import trySaveAndCloseCompose from '../actions/trySaveAndCloseCompose';
import moveComposeToTab from '../actions/moveComposeToTab';

export default function closeConflictCompose(task: CloseConflictComposeTask) {
    const store = getStore();
    const { originalPrimaryComposeId, originalInlineComposeId } = task;
    const originalPrimaryViewState =
        originalPrimaryComposeId &&
        store.primaryComposeId != originalPrimaryComposeId && // Only close original primary compose when it is not primary compose any more (conflict case)
        store.viewStates.get(task.originalPrimaryComposeId);
    const originalInlineViewState =
        originalInlineComposeId && store.viewStates.get(originalInlineComposeId);

    [originalPrimaryViewState, originalInlineViewState].forEach(viewState => {
        if (viewState) {
            // No need to return this promise here because it is not depended by other tasks, we expect this task is run in parallel with others
            trySaveAndCloseCompose(viewState).then(() => {
                // If the compose viewstate is still in store, it means we have failed to save
                // So we should show it in a tab to prevent data loss
                if (store.viewStates.get(viewState.composeId)) {
                    moveComposeToTab(viewState, true /*isShown*/, false /*makeActive*/);
                }
            });
        }
    });
}
