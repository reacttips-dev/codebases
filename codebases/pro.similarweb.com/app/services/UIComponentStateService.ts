/**
 * Created by Sahar.Rehani on 1/12/2017.
 * A Facade service to wrap setting/getting an item on window/sessionStorage/localStorage
 */

import swLog from "@similarweb/sw-log";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";

/**
 * Getter of an item within 'window' object
 * @param id : string
 * @returns {any}
 */
function getWindowItem(id) {
    return window[id];
}

/**
 * Getter of an item within 'sessionStorage'
 * @param id : string
 * @returns {object}
 */
function getSessionItem(id) {
    return JSON.parse(window.sessionStorage.getItem(id));
}

/**
 * Getter of an item within 'localStorage'
 * @param id : string
 * @returns {object}
 */
function getLocalItem(id) {
    return JSON.parse(window.localStorage.getItem(id));
}

/**
 * Setter of an item within 'window' object
 * @param id : string
 * @param item : any
 */
function setWindowItem(id, item) {
    return (window[id] = item);
}

/**
 * Setter of an item within 'sessionStorage'
 * @param id : string
 * @param item : object
 */
function setSessionItem(id, item) {
    return window.sessionStorage.setItem(id, JSON.stringify(item));
}

/**
 * Setter of an item within 'localStorage'
 * @param id : string
 * @param item : object
 */
function setLocalItem(id, item) {
    return window.localStorage.setItem(id, JSON.stringify(item));
}

const _storageGetters = {
    window: getWindowItem,
    sessionStorage: getSessionItem,
    localStorage: getLocalItem,
};

const _storageSetters = {
    window: setWindowItem,
    sessionStorage: setSessionItem,
    localStorage: setLocalItem,
};

/**
 * Builds a root key to prepend to the given key
 * @returns {string}
 */
function getRootKey(global: boolean = false) {
    const swNavigator: any = Injector.get("swNavigator");
    let key = `UIComponentState_${swSettings.user.id}`;
    if (!global) {
        key = `${key}_${swNavigator.current().name}`;
    }
    return key;
}

/**
 * Gets an item from the asked storage (window/sessionStorage/localStorage)
 * @param id : string
 * @param storage : string
 * @returns {any}
 */
function getItem(id: string, storage: string, global?: boolean) {
    try {
        return _storageGetters[storage](`${getRootKey(global)}_${id}`);
    } catch (e) {
        swLog.error("wrong 'id' or 'storageType' parameter(s)", e);
    }
}

/**
 * Sets an item on the asked storage (window/sessionStorage/localStorage)
 * @param id : string
 * @param storage : string
 * @param item : any
 */
function setItem(id: string, storage: string, item: any, global?: boolean) {
    try {
        _storageSetters[storage](`${getRootKey(global)}_${id}`, item);
    } catch (e) {
        swLog.error("wrong 'id' or 'storageType' parameter(s)", e);
    }
}

const UIComponentStateService = {
    getItem,
    setItem,
};

export default UIComponentStateService;
