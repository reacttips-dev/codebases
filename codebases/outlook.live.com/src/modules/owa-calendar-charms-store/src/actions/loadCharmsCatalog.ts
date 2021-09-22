import charmsInfoStore from '../store';
import getCalendarIconsFromService from '../services/getCharmsService';
import setCharmInfoInMap from './setCharmInfoInMap';
import setCharmKeywordsInMap from './setCharmKeywordsInMap';
import { action } from 'satcheljs/lib/legacy';
import type { GetCalendarCharmsInfo } from '../index';
import { trace } from 'owa-trace';

let loadCharmsPromise: Promise<void> | undefined = undefined;

export let loadCharmsCatalog = action('loadCharmsCatalog')(function loadCharmsCatalog(
    state: GetCalendarCharmsInfo = { charmStore: charmsInfoStore }
): Promise<void> {
    var store = state.charmStore;
    // avoid overlapping load and repeat load during a session
    if (loadCharmsPromise) {
        return loadCharmsPromise;
    }
    loadCharmsPromise = new Promise<void>(resolve => {
        let servicePromise = getCalendarIconsFromService();
        if (servicePromise == null) {
            return;
        }
        let serviceResponse = servicePromise.then(response => {
            if (response != null && response.icons != null && response.icons.length > 0) {
                setCharmInfoInMap(response);
                store.charmInfoMapMaxId = getCharmInfoMapMaxId(response.icons);
                setCharmKeywordsInMap();
                trace.info('[loadCharmsCatalog] Loaded charms catalog into the charms store.');
                return;
            } else {
                // clear promise to allow re-attempting load when there is a failure
                loadCharmsPromise = undefined;
                trace.info(
                    '[loadCharmsCatalog] Failed to load charms from service. Continuing without charms.'
                );
                return;
            }
        });
        serviceResponse.then(() => {
            return resolve();
        });
    });
    return loadCharmsPromise;
});

function getCharmInfoMapMaxId(responseArray: any): number {
    let maxId = 0;
    for (var responseIcon of responseArray) {
        if (maxId < responseIcon.iconId) {
            maxId = responseIcon.iconId;
        }
    }

    return maxId;
}

export default loadCharmsCatalog;

/** Exported for test purposes only */
export function clearCharmsPromise() {
    loadCharmsPromise = undefined;
}
