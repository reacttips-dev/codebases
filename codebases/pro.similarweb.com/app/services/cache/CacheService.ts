import { openDB } from "idb";
import swLog from "@similarweb/sw-log";
import UserDataWorker from "../../../single-spa/UserDataWorker";
import {
    clearBypassCache,
    isSettingCacheBypass,
    isUserDataCacheBypass,
} from "services/cache/Bypass";
import { fetchStartupSettings, fetchStartupUserData } from "services/cache/Fetch";

const CURRENT_IDB_VERSION = 5;

const verifyAndOpenTransaction = (db) => {
    verifyStore(db);
    return db.transaction(["cache"], "readwrite");
};

const upgradeDB = (db, oldVersion, newVersion, transaction) => {
    swLog.log("Upgrading DB");
    verifyStore(db);
};

const verifyStore = (db) => {
    if (!db.objectStoreNames.contains("cache")) {
        const cacheOS = db.createObjectStore("cache", { keyPath: "key" });
        cacheOS.createIndex("key", "key", { unique: false });
        cacheOS.createIndex("value", "value", { unique: false });
    }
};

const getDb = async (shouldUpgrade = true) =>
    openDB("pro-cache-db", CURRENT_IDB_VERSION, shouldUpgrade && { upgrade: upgradeDB });

const isIndexedDB = () => Boolean(window.indexedDB);
const isWorker = () => typeof Worker !== "undefined";

const updateCache = (key, value, storeKey, createCacheItem): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        if (!isIndexedDB() || !isWorker()) reject();
        let db = null;
        let tx = null;
        let store = null;
        let data = null;

        try {
            db = await getDb(false);
            tx = db.transaction(["cache"], "readwrite");
            store = tx.objectStore("cache");
            data = await store.get(storeKey);
        } catch (e) {
            swLog.warn("Could not open objectStore");
            reject();
        }

        const putTx = db.transaction(["cache"], "readwrite");
        const putStore = putTx.objectStore("cache");

        const item = createCacheItem({ data, key, value, storeKey });

        putStore.put(item);
        await putTx.done;
        db.close();
        resolve();
    });
};

const createUserDataCacheItem = ({ data, key, value, storeKey }) => {
    const newData = {
        ...data?.value,
        [key]: value,
    };
    const item = {
        key: storeKey,
        value: newData,
    };
    return item;
};

const updateUserCache = (userDataKey, userDataValue): Promise<void> => {
    return updateCache(userDataKey, userDataValue, "userdata", createUserDataCacheItem);
};

const getCache = async (isCacheBypass, fetchData, storeKey, setupWorker) => {
    if (!isIndexedDB() || !isWorker()) {
        return fetchData();
    }
    const db = await getDb();

    // check for cache bypass via cookie or query string
    if (!isCacheBypass()) {
        const tx = verifyAndOpenTransaction(db);
        const store = tx.objectStore("cache");
        const data = await store.get(storeKey);

        // Make sure the cache item exists and has a value that's an object
        // and that the value property exists and is an object as well.
        // This is to make sure we don't get stuck an any weird edge
        // case with idb locks and multiple tabs and such
        if (typeof data === "object" && typeof data.value === "object") {
            return setupWorker(data);
        }
    }

    const resJson = await fetchData();
    const putTx = db.transaction(["cache"], "readwrite");
    const putStore = putTx.objectStore("cache");

    const item = {
        key: storeKey,
        value: resJson,
    };

    putStore.put(item);

    await putTx.done;
    db.close();

    return resJson;
};

const getSettingsCache = async (setupSettingsWorker) => {
    const cacheSettings = getCache(
        isSettingCacheBypass,
        fetchStartupSettings,
        "settings",
        setupSettingsWorker,
    );
    return cacheSettings;
};

const getI18nCache = async () => {
    if (!window.indexedDB) {
        return fetch("/api/i18n", { credentials: "include" })
            .then((res) => res.json())
            .then((res) => fetch(res.json.slice(1)))
            .then((res) => res.json());
    }
    const versionRes = await fetch("/api/i18n", { credentials: "include" });
    const versionResJson = await versionRes.json();
    const i18nUrl = versionResJson.json.slice(1);
    const { version, locale } = versionResJson;
    swLog.log(`i18n version: ${version}, locale: ${locale}`);

    const i18nKey = `i18n_${locale}`;
    const i18nVersionKey = `i18nVersion_${locale}`;

    const db = await getDb();

    const tx = verifyAndOpenTransaction(db);
    const store = tx.objectStore("cache");
    const versionInfo = await store.get(i18nVersionKey);

    if (versionInfo && version === versionInfo.value) {
        swLog.log(`Existing i18n version: ${versionInfo.value}`);
        swLog.log("Got i18n from cache");
        const cachedi18n = await store.get(i18nKey);
        return cachedi18n.value;
    } else {
        const i18nRes = await fetch(i18nUrl);
        const resJson = await i18nRes.json();
        const item = {
            key: i18nKey,
            value: resJson,
        };
        const newVersion = {
            key: i18nVersionKey,
            value: version,
        };

        const tx = db.transaction(["cache"], "readwrite");
        const store = tx.objectStore("cache");
        store.put(item);
        store.put(newVersion);
        await tx.done;
        db.close();

        return resJson;
    }
};

export const setupUserDataWorker = (data) => {
    const worker = new UserDataWorker();
    worker.getUserData();
    return data.value;
};

export const getUserDataCache = async () => {
    const cacheUserData = CacheService.getCache(
        isUserDataCacheBypass,
        fetchStartupUserData,
        "userdata",
        setupUserDataWorker,
    );
    return cacheUserData;
};

export const CacheService = {
    updateUserCache,
    getSettingsCache,
    getI18nCache,
    clearBypassCache,
    updateCache,
    getCache,
    getUserDataCache,
    CURRENT_IDB_VERSION,
};
