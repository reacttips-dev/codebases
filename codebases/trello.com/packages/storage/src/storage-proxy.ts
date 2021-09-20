import { Dispatch, Store } from 'redux';
import {
  ErrorListener,
  ErrorListenerArgs,
  Listener,
  ListenerArgs,
} from '../types';

// eslint-disable-next-line @trello/ban-identifiers
export const LOCAL = window.localStorage;

// eslint-disable-next-line @trello/ban-identifiers
export const SESSION = window.sessionStorage;

export class StorageProxy {
  private storage: Storage;
  private listeners: Set<Listener>;
  private errorListeners: Set<ErrorListener>;
  private listenersSyncedAcrossBrowser: Set<Listener>;
  private dispatch: Dispatch | undefined;

  private LISTENER_IGNORABLE_KEY_PREFIXES = /^(awc\.)/;

  constructor(storageProvider = LOCAL) {
    this.listeners = new Set();
    this.errorListeners = new Set();
    this.listenersSyncedAcrossBrowser = new Set();
    this.storage = storageProvider;
    window.addEventListener('storage', this.onStorage);
  }

  onStorage = (e: StorageEvent) => {
    const { key, oldValue, newValue } = e;
    if (!key || key.match(this.LISTENER_IGNORABLE_KEY_PREFIXES)) {
      return;
    }

    this.broadcastChangeFromOtherInstance({ key, oldValue, newValue });
  };

  listen(listener: Listener) {
    this.listeners.add(listener);
  }

  addErrorListener(listener: ErrorListener) {
    this.errorListeners.add(listener);
  }

  listenSyncedAcrossBrowser(listener: Listener) {
    this.listenersSyncedAcrossBrowser.add(listener);

    // If we change localStorage in the current tab, but are only
    // listening for changes in other tabs, the current tab's
    // listeners won't get run. Thus, we add *all* browser-synced
    // listeners to the list of local listeners
    this.listen(listener);
  }

  unlisten(listener: Listener) {
    this.listeners.delete(listener);
    this.listenersSyncedAcrossBrowser.delete(listener);
  }

  broadcastLocalChange(args: ListenerArgs) {
    this.listeners.forEach((listener: Listener) => {
      listener(args, this.dispatch);
    });
  }

  broadcastError(args: ErrorListenerArgs) {
    this.errorListeners.forEach((listener: ErrorListener) => {
      listener(args, this.dispatch);
    });
  }

  broadcastChangeFromOtherInstance(args: ListenerArgs) {
    this.listenersSyncedAcrossBrowser.forEach((listener: Listener) => {
      listener(args, this.dispatch);
    });
  }

  isEnabled() {
    return !!this.storage;
  }

  set(name: string, value: object | string | number) {
    try {
      if (this.isEnabled()) {
        const oldValue = this.getRaw(name);
        const newValue = JSON.stringify(value);
        this.storage.setItem(name, newValue);
        this.broadcastLocalChange({ key: name, oldValue, newValue });
      }
    } catch (error) {
      console.warn(error);
      this.broadcastError({
        key: name,
        error,
      });
    }
  }

  get(name: string) {
    let retVal = null;
    const rawValue = this.getRaw(name);

    if (rawValue) {
      try {
        retVal = JSON.parse(rawValue);
      } catch (ex) {
        console.warn(ex);
      }
    }

    return retVal;
  }

  getRaw(name: string) {
    return this.isEnabled() ? this.storage.getItem(name) : null;
  }

  unset(name: string): void {
    if (this.isEnabled() && this.getRaw(name) !== null) {
      this.storage.removeItem(name);
    }
  }

  setStore = (store: Store) => {
    this.dispatch = store.dispatch;
  };

  getAllKeys = () => {
    return this.isEnabled() ? Object.keys(this.storage) : [];
  };
}

// eslint-disable-next-line @trello/no-module-logic
export const TrelloStorage = new StorageProxy(LOCAL);
// eslint-disable-next-line @trello/no-module-logic
export const TrelloSessionStorage = new StorageProxy(SESSION);
