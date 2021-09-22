import { createStore } from 'satcheljs';

interface ModuleDndStore {
    draggedItemType: string | null;
}

const getStore = createStore<ModuleDndStore>('moduleDndStore', <ModuleDndStore>{
    draggedItemType: null,
});

export default getStore;
