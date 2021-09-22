import type RecursiveReadOnly from 'owa-service/lib/RecursiveReadOnly';
import type {
    ReadOnlySmimeAdminSettingsType,
    ReadOnlyOwaUnifiedGroupsSetsType,
    ReadOnlyOutlookFavorites,
} from 'owa-service/lib/ReadOnlyTypes';

interface SessionStorage {
    smime?: ReadOnlySmimeAdminSettingsType;
    groups?: ReadOnlyOwaUnifiedGroupsSetsType;
    favorites?: ReadOnlyOutlookFavorites;
}

const storage: SessionStorage = {};

export function set<TKey extends keyof SessionStorage>(key: TKey, value: SessionStorage[TKey]) {
    storage[key] = value;
}

export function get(): RecursiveReadOnly<SessionStorage> {
    return storage;
}
