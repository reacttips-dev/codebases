import { IAppCompareItem } from "components/compare/AppsQueryBar/AppsQueryBar";

const itemIsValid = (rawAppItem) => {
    const hasNumericStore = rawAppItem.Store || rawAppItem.Store === 0;
    const hasStore =
        !!rawAppItem.AppStore || !!rawAppItem.appStore || !!rawAppItem.store || hasNumericStore;
    const hasId = !!rawAppItem.Id || !!rawAppItem.ID || !!rawAppItem.id;
    return hasStore && hasId;
};

export const normalizeItem = (rawAppItem): IAppCompareItem => {
    if (!rawAppItem || !itemIsValid(rawAppItem)) {
        return;
    }
    const store = rawAppItem.AppStore
        ? rawAppItem.AppStore
        : rawAppItem.appStore
        ? rawAppItem.appStore
        : rawAppItem.Store === 0
        ? "Google"
        : "Apple";

    const id = rawAppItem.Id || rawAppItem.ID || rawAppItem.id;

    const normalizedItem = {
        title: rawAppItem.Title || rawAppItem.title || id,
        icon: rawAppItem.Icon || rawAppItem.icon,
        store,
        id,
        color: rawAppItem.Color,
    };
    return normalizedItem as IAppCompareItem;
};

export const normalizeAutocompleteSearchesItem = (rawAppItem: {
    name: string;
    image: string;
    store: string;
    id: string;
    color?: string;
}): IAppCompareItem => {
    if (!rawAppItem || !itemIsValid(rawAppItem)) {
        return;
    }
    return {
        title: rawAppItem.name || rawAppItem.id,
        icon: rawAppItem.image,
        store: `${rawAppItem.store.charAt(0).toUpperCase()}${rawAppItem.store.slice(1)}`,
        id: rawAppItem.id,
        color: rawAppItem.color,
    } as IAppCompareItem;
};
