import { getStore } from '../store/store';

export function getAutoOpenRegistrationMap() {
    return getStore().autoOpenRegistrationMap;
}
