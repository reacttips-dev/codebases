import ensureComposeTabHandler from '../utils/composeTabHandler';
import { ComposeViewState, getStore } from 'owa-mail-compose-store';
import { findTabByData, TabType } from 'owa-tab-store';
import activateTab from 'owa-tab-store/lib/actions/activateTab';
import addTab from 'owa-tab-store/lib/utils/addTab';
import setTabIsShown from 'owa-tab-store/lib/actions/setTabIsShown';
import { mutatorAction } from 'satcheljs';

export default function moveComposeToTab(
    viewState: ComposeViewState,
    isShown: boolean,
    makeActive: boolean
): string {
    const composeId = viewState.composeId;
    const tab = findTabByData(composeId);
    if (tab) {
        if (makeActive) {
            activateTab(tab);
        } else {
            setTabIsShown(tab, isShown);
        }
        return tab.id;
    } else {
        const store = getStore();
        if (store.primaryComposeId == composeId) {
            clearPrimaryCompose();
        }

        ensureComposeTabHandler();
        return addTab(TabType.MailCompose, isShown /*isShown*/, makeActive, composeId);
    }
}

const clearPrimaryCompose = mutatorAction('Compose_ClearPrimaryCompose', () => {
    const store = getStore();
    store.primaryComposeId = null;
});
