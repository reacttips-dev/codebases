import _ from "lodash";
import { AppsResourceService } from "../../../app/services/AppsResourceService";
import { LRU } from "./lruCache";

const appInfoCache = new LRU();

const buildKey = (appId: string, store: string, mainItem: number): string => {
    return `${store.toLowerCase()}_${appId.toLowerCase()}_${mainItem}`;
};

const putCache = (appId: string, store: string, mainItem: number, value: any): void => {
    appInfoCache.put(buildKey(appId, store, mainItem), value);
};

const getCache = (appId: string, store: string, mainItem: number): string => {
    return appInfoCache.get(buildKey(appId, store, mainItem));
};

export interface IAppInfoService {
    getInfo: (appId: string, store: string) => Promise<Record<string, any>>;
    getAppServerId: (appId: string, appStoreName: string) => string;
}

const getInfo = async (appId: string, store: string): Promise<Record<string, any>> => {
    const res = {};
    const notCached = [];
    let notCachedMainItem = null;
    let responseAppData = null;

    appId.split(",").forEach((id, index) => {
        const cached = getCache(id, store, +(index === 0));
        if (cached) {
            res[id] = cached;
        } else if (index === 0) {
            // it is mainItem
            notCachedMainItem = id;
        } else {
            notCached.push(id);
        }
    });

    if (!notCached.length && _.isEmpty(notCachedMainItem)) {
        return { ...res };
    } else if (!notCached.length && !_.isEmpty(notCachedMainItem)) {
        const response = await AppsResourceService.appInfoAndRelatedInfo({
            appId: notCachedMainItem,
            store: store,
        });

        responseAppData = _.get(response, "data.AppInfo.0.Value", {});
        if (!_.isEmpty(responseAppData)) {
            responseAppData.RelatedSites = response.data["RelatedSites"];
            responseAppData.RelatedApps = response.data["RelatedApps"];
            putCache(notCachedMainItem, store, 0, responseAppData);
            res[notCachedMainItem] = responseAppData;

            return { ...res };
        } else {
            return {};
        }
    } else {
        const response = await AppsResourceService.appInfoAndRelatedInfo({
            appId: notCachedMainItem,
            store: store,
        });

        responseAppData = _.get(response, "data.AppInfo.0.Value", {});
        responseAppData.RelatedSites = response.data["RelatedSites"];
        responseAppData.RelatedApps = response.data["RelatedApps"];
        putCache(notCachedMainItem, store, 0, responseAppData);
        res[notCachedMainItem] = responseAppData;

        appId = notCached.join(",");

        const params = {
            appId,
            store,
        };
        AppsResourceService.appInfo(params, (appInfoResponse) => {
            appInfoResponse.data.forEach(function (item, index) {
                putCache(item.Key, params.store, 0, item.Value);
                res[item.Key] = item.Value;
            });

            return { ...res };
        });
    }
};

const getAppServerId = (appId: string, appStoreName: string): string => {
    const storeId = appStoreName === "Google" ? 0 : 1;
    return `${storeId}_${appId}`;
};

export const AppInfoService: IAppInfoService = {
    getInfo,
    getAppServerId,
};
