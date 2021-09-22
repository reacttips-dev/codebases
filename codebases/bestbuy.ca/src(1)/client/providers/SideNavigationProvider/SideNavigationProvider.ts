import * as url from "url";
import { SideNavigationNode } from "models";
import { HttpRequestType } from "errors";
import fetch from "utils/fetch/";
import getLogger from "../../../common/logging/getLogger";

const defaultAPITimeout = 3000;

export interface SideNavigationProvider {
    getNavigation(...args: any[]): Promise<SideNavigationNode>;
}

export class ApiCmsSideNavigationProvider {
    public url: string;

    constructor(baseUrl: string, resourceLocation: string, locale?: Locale, regionCode?: string) {
        const tempUrl = url.parse(baseUrl + resourceLocation);
        tempUrl.query = {
            lang: locale,
        };

        if (regionCode) {
            tempUrl.query.regionCode = regionCode;
        }

        this.url = url.format(tempUrl).toLowerCase();
    }

    public getResourceNavigation(defaultJson, requestType: HttpRequestType, timeout = defaultAPITimeout) {
        let res;
        let timedOut = false;

        return new Promise(async (resolve, reject) => {
            const apiTimeout = setTimeout(() => {
                timedOut = true;
                getLogger().warn(`${this.url} timed out`);
                resolve(defaultJson);
            }, timeout);

            try {
                res = await fetch(this.url, requestType);
            } catch (error) {
                reject(error);
                return;
            }

            if (!timedOut) {
                try {
                    defaultJson = await res.json();
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
