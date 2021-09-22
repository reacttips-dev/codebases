import { getStore } from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('resetMessageAdListSelection', function (): void {
    const store = getStore();
    if (store) {
        store.selectedAdId = null;
    }
});
