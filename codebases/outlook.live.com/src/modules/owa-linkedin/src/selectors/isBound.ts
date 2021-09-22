import { linkedInStore } from '../store/store';

export function isBound(): boolean {
    let store = linkedInStore();
    return store.status === 'Bound';
}
