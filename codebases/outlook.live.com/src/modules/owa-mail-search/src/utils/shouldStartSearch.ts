import mailSearchStore from '../store/store';
import isMailSearchAction from '../utils/isMailSearchAction';
import getFolderNameFromScope from '../utils/getFolderNameFromScope';
import type { ActionSource } from 'owa-mail-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { SearchScenarioId } from 'owa-search-store';

export default function shouldStartSearch(
    scenarioId: SearchScenarioId,
    actionSource: ActionSource
) {
    if (!isMailSearchAction(scenarioId)) {
        return false;
    }

    // Do not start 3S search for StickyNotes experience
    const folderName: string = mailSearchStore.staticSearchScope
        ? getFolderNameFromScope(mailSearchStore.staticSearchScope)
        : '';
    if (folderName == 'notes' && isFeatureEnabled('notes-folder-view')) {
        return false;
    }

    return true;
}
