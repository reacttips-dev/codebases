import type SpotlightStore from './schema/SpotlightStore';
import { createStore } from 'satcheljs';

const spotlightStore: SpotlightStore = {
    spotlightItems: [],
    rollupDismissed: false,
    logicalId: null,
    requestStartTime: null,
    spotlightTableQuery: null,
};

export const getStore = createStore<SpotlightStore>('spotlightStore', spotlightStore);
export default getStore;
