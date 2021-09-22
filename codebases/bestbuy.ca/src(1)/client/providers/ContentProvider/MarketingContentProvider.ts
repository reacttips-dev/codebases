import * as url from "url";
import {HttpRequestType} from "errors";
import fetch from "utils/fetch/";
import getLogger from "../../../common/logging/getLogger";
import contentCache from "./contentCache";

export interface MarketingContentProvider<T> {
    url?: string;
    getContent(...args: any[]): Promise<T>;
}

export abstract class ApiMarketingContentProvider<T> implements MarketingContentProvider<T> {
    public url: string;

    constructor(
        baseUrl: string,
        locale?: Locale,
        regionCode?: string,
        resourceType?: string,
        resourceId?: string,
        queryParams?: {[key: string]: string},
    ) {
        let resourceLocation = resourceType ? `${resourceType}/` : ``;
        resourceLocation = resourceLocation && resourceId ? `${resourceLocation}${resourceId}` : resourceLocation;
        const tempUrl = url.parse((baseUrl + resourceLocation).split("?")[0], true);

        tempUrl.query = {
            ...queryParams,
            lang: locale,
        };

        if (regionCode) {
            tempUrl.query.regionCode = regionCode;
        }
        this.url = url.format(tempUrl).toLowerCase();
    }

    public getContent(defaultJson: T, requestType: HttpRequestType, timeout = 3000): Promise<T> {
        let res: Response;
        let timedOut = false;

        return new Promise(async (resolve, reject) => {
            const apiTimeout = setTimeout(() => {
                timedOut = true;
                getLogger().warn(`${this.url} timed out`);
                resolve(defaultJson);
            }, timeout);

            const cacheKey = this.url;
            if (typeof window === "undefined") {
                const content = contentCache.get(cacheKey);
                if (content) {
                    clearTimeout(apiTimeout);
                    resolve(content);
                    return;
                }
            }

            try {
                res = await fetch(this.url, requestType);
            } catch (error) {
                reject(error);
                return;
            }

            if (!timedOut) {
                try {
                    defaultJson = await res.json();
                    if (typeof window === "undefined") {
                        contentCache.set(cacheKey, defaultJson);
                    }
                    resolve(defaultJson);
                } catch {
                    // do nothing
                } finally {
                    clearTimeout(apiTimeout);
                }
            }
            resolve(defaultJson);
        });
    }
}
