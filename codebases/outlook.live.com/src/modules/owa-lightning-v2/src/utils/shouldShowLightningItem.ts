import { store } from 'owa-lightning-core-v2/lib/store/store';

export function shouldShowLightningItem(lid: string): boolean {
    if (store.unseenItems) {
        let viewState = store.unseenItems.get(lid);

        if (viewState?.visible) {
            return true;
        }
    }
    return false;
}
