import { get } from './nonObservableStoreUtils';

export default function getFavorites() {
    return get().favorites;
}
