import store from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('MARK_IMPORT_AS_LOADED', function markImportAsLoaded(id: string) {
    store.loadedImports.set(id, true);
});
