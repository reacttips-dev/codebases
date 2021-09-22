import { trace } from 'owa-trace';
import { getUnseenItemsFromServer } from '../services/getUnseenItemsFromServer';
import initializeLightning from '../actions/initializeLightning';
import type { LightningUnseenItem } from '../store/schema/LightningState';

/**
 * Initialize lightning from server response
 */
export function initializeLightningFromServer(): Promise<void> {
    trace.info('initialize lightning from server');

    return getUnseenItemsFromServer().then(unseenItems => {
        let mappedItems = unseenItems.map(getUnseenItem);
        initializeLightning(mappedItems);
    });
}

function getUnseenItem(item: any): LightningUnseenItem {
    if (item.category) {
        return {
            identity: item.id,
            visible: false,
            category: item.category,
        };
    } else {
        return {
            identity: item,
            visible: false,
        };
    }
}
