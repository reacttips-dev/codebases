import { ObservableMap } from 'mobx';
import { mutatorAction } from 'satcheljs';
import { trace } from 'owa-trace';
import { getStore } from '../store/store';
import type { LightningUnseenItem, LightningState } from '../store/schema/LightningState';

export interface InitializeLightningState {
    store: LightningState;
}

/**
 * Action that happens to initialize lightning store
 */
export default mutatorAction(
    'initializeLightning',
    function initializeLightning(unseenItems: LightningUnseenItem[]) {
        trace.info('initialize lightning store');

        getStore().lastShownId = null;
        getStore().lightedCount = 0;
        getStore().unseenItems = new ObservableMap<string, LightningUnseenItem>();

        if (unseenItems) {
            for (let unseenItem of unseenItems) {
                getStore().unseenItems.set(unseenItem.identity, unseenItem);
            }
        }
    }
);
