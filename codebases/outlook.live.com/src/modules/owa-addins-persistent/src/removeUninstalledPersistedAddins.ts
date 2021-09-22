import persistedAddins from './persistedAddins';
import { setPersistedAddinByModeString } from './setPersistedAddin';
import { terminatePersistantTaskPaneAddinWithAppId } from 'owa-addins-store';

export default function removeUninstalledPersistedAddins(installedAddinIds: string[]): void {
    let modes = Object.keys(persistedAddins());
    for (let i = 0; i < modes.length; i++) {
        const mode = modes[i];
        const persistedAddin = persistedAddins()[mode];
        if (persistedAddin) {
            if (installedAddinIds.indexOf(persistedAddin.addinId) < 0) {
                setPersistedAddinByModeString(mode, null /* persistedAddin */);
                terminatePersistantTaskPaneAddinWithAppId(persistedAddin.addinId);
            }
        }
    }
}
