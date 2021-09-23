import EventEmitter from 'events';
import Model from '../model';

export const USER_PREFS_KEY = 'userPrefs';

function makeChangedEventType(key) {
    return `changed:${key}`;
}

const emitter = new EventEmitter();

export function get(key) {
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch (_e) {
        return null;
    }
}

export function set(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        emitter.emit(makeChangedEventType(key), value);
    } catch (e) {
        console.warn('Could not save to localStorage. (localStorage is disabled in private Safari windows)');
    }
}

export function remove(key) {
    try {
        window.localStorage.removeItem(key);
    } catch (_e) {
        // Do nothing.
    }
}

function onStorage(e) {
    if (emitter.listenerCount(makeChangedEventType(e.key)) > 0) {
        try {
            emitter.emit(makeChangedEventType(e.key), JSON.parse(e.newValue));
        } catch (_e) {
            // Do nothing.
        }
    }
}

export function onChange(key, handler) {
    if (emitter.eventNames().length === 0) {
        window.addEventListener('storage', onStorage);
    }

    emitter.on(makeChangedEventType(key), handler);
}

export function offChange(key, handler) {
    emitter.off(makeChangedEventType(key), handler);

    if (emitter.eventNames().length === 0) {
        window.removeEventListener('storage', onStorage);
    }
}

export function shim(I = {}, self = null) {
    I = I || {};
    self = self || Model(I);
    const handlerMap = new WeakMap();

    return self.extend({
        getLocal: get,
        storeLocal: set,
        removeLocal: remove,

        getUserPrefs() {
            return get(USER_PREFS_KEY) || {};
        },

        getUserPref(key) {
            return self.getUserPrefs()[key];
        },

        updateUserPrefs(key, value) {
            const prefs = self.getUserPrefs();
            prefs[key] = value;
            self.storeLocal(USER_PREFS_KEY, prefs);
        },

        onUserPrefChange(key, listener) {
            let prevUserPrefs = self.getUserPrefs();
            const wrappedListener = (userPrefs) => {
                if (prevUserPrefs[key] !== userPrefs[key]) {
                    listener(userPrefs[key]);
                }
                prevUserPrefs = userPrefs;
            };
            handlerMap.set(listener, wrappedListener);
            onChange(USER_PREFS_KEY, wrappedListener);
        },

        removeUserPrefChangeListener(_key, listener) {
            const wrappedListener = handlerMap.get(listener);
            handlerMap.delete(listener);
            offChange(USER_PREFS_KEY, wrappedListener);
        },
    });
}