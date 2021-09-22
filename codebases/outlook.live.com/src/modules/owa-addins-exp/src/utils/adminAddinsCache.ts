import { getItem, setItem, removeItem, itemExists } from 'owa-local-storage';
import { PREVIOUS_ADMIN_ADDINS_KEY } from './cacheConstants';
import { trace } from 'owa-trace';

interface AdminAddinsItem {
    addinId?: string;
}

export function isPreviousAdminAddinsInCache(): boolean {
    return itemExists(window, PREVIOUS_ADMIN_ADDINS_KEY);
}

export function getPreviousAdminInstalledAddins(): string[] {
    const adminAddinsItemValue = getItem(window, PREVIOUS_ADMIN_ADDINS_KEY);
    if (!adminAddinsItemValue) {
        return [];
    }

    let adminAddins: AdminAddinsItem[];
    try {
        adminAddins = JSON.parse(adminAddinsItemValue);
    } catch (ex) {
        trace.warn('Unable to parse adminAddins data: ' + adminAddinsItemValue);
        return [];
    }
    return adminAddins.map(item => item.addinId);
}

export function setPreviousAdminInstalledAddins(addins: string[]) {
    let adminAddins: AdminAddinsItem[] = [];

    for (const addinId of addins) {
        let item: AdminAddinsItem = { addinId };
        adminAddins.push(item);
    }

    setItem(window, PREVIOUS_ADMIN_ADDINS_KEY, JSON.stringify(adminAddins));
}

export function removePreviousAdminInstalledAddins() {
    removeItem(window, PREVIOUS_ADMIN_ADDINS_KEY);
}
