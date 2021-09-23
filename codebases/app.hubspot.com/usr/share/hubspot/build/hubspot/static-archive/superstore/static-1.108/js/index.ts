import Superstore, { createAsyncLocalSuperstore, createIndexedDBSuperstore, createSyncLocalSuperstore } from './Superstore';
import LocalStorageBackend from './localstorage';
import IndexedDBBackend from './indexeddb';
export default Superstore;
export var LocalStorage = LocalStorageBackend;
export var IndexedDB = IndexedDBBackend;
export { createAsyncLocalSuperstore, createIndexedDBSuperstore, createSyncLocalSuperstore };