import store from '../store/store';

export default function isImportLoaded(id: string) {
    return store.loadedImports.has(id);
}
