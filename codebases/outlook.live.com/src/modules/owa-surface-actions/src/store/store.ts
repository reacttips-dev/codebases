import type AddinOptionSurfaceItems from './schema/AddinOptionSurfaceItems';
import type SurfaceActionsStore from './schema/SurfaceActionsStore';
import { createStore } from 'satcheljs';

const initialSurfaceActionsStore: SurfaceActionsStore = {
    addinOptionSurfaceItems: <AddinOptionSurfaceItems>{},
};
const store = createStore<SurfaceActionsStore>('SurfaceActionsStore', initialSurfaceActionsStore)();

export default store;
