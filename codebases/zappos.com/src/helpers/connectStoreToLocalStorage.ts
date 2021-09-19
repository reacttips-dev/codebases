import throttle from 'lodash.throttle';
import { Store } from 'redux';

import { LOAD_INITIAL_LOCAL_STORAGE } from 'constants/reduxActions';
import { loadFromLocalStorage, saveToLocalStorage } from 'helpers/localStorageUtilities';

export default function connectStoreToLocalStorage(store: Store) {
  // hook local storage up to the store
  const localState = loadFromLocalStorage('state');
  const initialLocalStorage = localState?.localStorage || {};

  store.dispatch(loadLocalStorage(initialLocalStorage));

  // automatically save section of store to local storage
  store.subscribe(throttle(() => saveStoreToLocalStorage(store), 1000));

  return initialLocalStorage;
}

export const saveStoreToLocalStorage = (store: Store) => {
  const { localStorage } = store.getState();
  saveToLocalStorage('state', { localStorage });
};

const loadLocalStorage = (initialLocalStorage: any) => ({
  type: LOAD_INITIAL_LOCAL_STORAGE,
  initialLocalStorage
} as const);

export type LocalStorageAction =
  | ReturnType<typeof loadLocalStorage>;
