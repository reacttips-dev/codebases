import { get } from './nonObservableStoreUtils';

export default function getSmimeAdminSettings() {
    return get().smime;
}
