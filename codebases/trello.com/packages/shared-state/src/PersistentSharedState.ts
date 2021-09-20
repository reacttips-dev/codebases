import { TrelloStorage, TrelloSessionStorage } from '@trello/storage';

import { SharedState } from './SharedState';

interface PersistentSharedStateOptions {
  storageKey: string;
  session?: boolean;
}

export class PersistentSharedState<
  Value extends string | number | object
> extends SharedState<Value> {
  #hasSyncLock: boolean = false;

  constructor(
    initialValue: Value,
    { storageKey, session = false }: PersistentSharedStateOptions,
  ) {
    super(initialValue);

    const Storage = session ? TrelloSessionStorage : TrelloStorage;

    const existingValue = Storage.get(storageKey);
    if (existingValue !== null && existingValue !== initialValue) {
      this.setValue(existingValue);
    }

    this.subscribe((value) => {
      if (this.#hasSyncLock) {
        return;
      }

      Storage.set(storageKey, value);
    });

    Storage.listenSyncedAcrossBrowser(({ key, newValue }) => {
      if (key !== storageKey) {
        return;
      }

      const value =
        newValue !== null ? (JSON.parse(newValue) as Value) : initialValue;

      this.#hasSyncLock = true;
      this.setValue(value);
      this.#hasSyncLock = false;
    });
  }
}
