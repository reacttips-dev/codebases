import extensibilityState from '../store/store';
import { mutatorAction } from 'satcheljs';

/*  The action will be used to store if addins should be highlighted or not
    If so, will also store the theme specific button data
 */

export const updateStoreToHighlightAddins = mutatorAction(
    'updateStoreToHighlightAddins',
    (highlightData: string) => {
        extensibilityState.shouldHighlightUnpinnedAdminAddins = true;
        extensibilityState.themeSpecificHighlightDataStore = highlightData;
    }
);
