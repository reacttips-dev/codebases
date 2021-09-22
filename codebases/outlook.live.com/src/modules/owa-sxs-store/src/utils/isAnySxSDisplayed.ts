import { getActiveContentTab } from 'owa-tab-store';
import getOrCreateSxSStoreData from '../store/Store';

/**
 * This function returns true if any SxS is being displayed in main window
 * For now it handles both legacy and refactored SxS
 */
export default function isAnySxSDisplayedInMainWindow(): boolean {
    const sxsId = getActiveContentTab().sxsId;
    return getOrCreateSxSStoreData(sxsId).shouldShow;
}
