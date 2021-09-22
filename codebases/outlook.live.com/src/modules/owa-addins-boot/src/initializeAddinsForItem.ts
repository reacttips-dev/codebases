import initializeExtensibilityContext from './initializeExtensibilityContext';
import runContextualEvaluation from './runContextualEvaluationAndUpdate';
import { isContextualScenario } from './ContextualChecker';
import { isPersistentTaskpaneEnabled } from 'owa-addins-feature-flags';
import { populatePersistedAddins } from 'owa-addins-persistent';
import {
    initializeExtensibilityHostItem,
    whenExtensibilityContextInitialized,
} from 'owa-addins-store';
import {
    lazyInitializeExtensibilityFrameworkComponent,
    onItemNavigation,
    SelectionType,
} from 'owa-addins-view';
import { initializeExtensibilityNotifications } from 'owa-addins-apis';
import { addAdapter, MessageComposeAdapter, MessageReadAdapter } from 'owa-addins-adapters';
import type Item from 'owa-service/lib/contract/Item';

/** @param renderTaskPaneInPanel This should be called with the same value everywhere in the application */
export default async function initializeAddinsForItem(
    index: string,
    adapter: MessageComposeAdapter | MessageReadAdapter,
    renderTaskPaneInPanel: boolean = true,
    targetWindow: Window = window /*fallback is main window*/
) {
    addAdapter(index, adapter);
    initializeExtensibilityHostItem(index);
    if (isContextualScenario(adapter.mode)) {
        const readAdapter = adapter as MessageReadAdapter;
        whenExtensibilityContextInitialized(initializeContextualTerms(readAdapter, index));
    }
    initializeExtensibilityNotifications(index);
    await populatePersistedAddins(adapter.mode);
    await initializeExtensibilityContext();
    isPersistentTaskpaneEnabled() && onItemNavigation(SelectionType.Single, index, targetWindow);
    lazyInitializeExtensibilityFrameworkComponent(renderTaskPaneInPanel, index, targetWindow);
}

function initializeContextualTerms(readAdapter: MessageReadAdapter, index: string): () => void {
    return () =>
        readAdapter.getItem().then(item =>
            // runContextualEvaluation is too narrow in its typing -- right now it
            // requests the full item type despite only reading a small subset of
            // the fields. This is an issue because the MessageReadAdapter type
            // does not actually return an item from owa-service. To be specific,
            // the LastUpdatedTime for calendar-like items does not match the
            // field on Item.
            //
            // Here we downcast to Item because nothing in runContextualEvaluation
            // actually reads the LastUpdatedTime.
            runContextualEvaluation(item as Item, index)
        );
}
