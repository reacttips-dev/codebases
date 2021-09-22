import { linkedInStore } from '../store/store';

export function isOptedOut(): boolean {
    let store = linkedInStore();
    return (
        store.status == null ||
        store.status == 'OptOut' ||
        store.status == 'OptOutBound' ||
        store.status == 'DisabledBound'
    );
}
