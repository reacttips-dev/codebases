import { createStore } from 'satcheljs';
import type { FavoritePrivateDistributionListData } from 'owa-favorites-types';

type ViewMode = 'create' | 'edit' | 'closed';

interface PdlEditorStore {
    currentState: ViewMode;
    currentPdl: FavoritePrivateDistributionListData;
}

const defaultStoreData: PdlEditorStore = {
    currentState: 'closed',
    currentPdl: null,
};

export let getStore = createStore<PdlEditorStore>('pdlEditorModal', defaultStoreData);
const store = getStore();

export default store;
