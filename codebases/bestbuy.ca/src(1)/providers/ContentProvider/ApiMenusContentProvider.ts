var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as url from "url";
import fetch from "../../utils/fetch";
import brandsMenuFallBackContentEn from "./fallbacks/brandsMenuFallbackContentEn";
import brandsMenuFallBackContentFr from "./fallbacks/brandsMenuFallbackContentFr";
import globalMenuFallBackContentEn from "./fallbacks/globalMenuFallbackContentEn";
import globalMenuFallBackContentFr from "./fallbacks/globalMenuFallbackContentFr";
import shopMenuFallBackContentEn from "./fallbacks/shopMenuFallbackContentEn";
import shopMenuFallBackContentFr from "./fallbacks/shopMenuFallbackContentFr";
import menuContentCache from "./menuContentCache";
var EndpointPaths;
(function (EndpointPaths) {
    EndpointPaths["shop"] = "menus/shop";
    EndpointPaths["brands"] = "menus/brands";
    EndpointPaths["global"] = "global";
})(EndpointPaths || (EndpointPaths = {}));
export class ApiMenusContentProvider {
    constructor(baseUrl, locale, logger) {
        this.getGlobalMenu = (timeout = 5000) => __awaiter(this, void 0, void 0, function* () {
            const fallback = this.locale === "en-CA"
                ? Object.assign({}, globalMenuFallBackContentEn) : Object.assign({}, globalMenuFallBackContentFr);
            const data = yield this.getMenu(timeout, this.buildUrl(EndpointPaths.global), fallback);
            return Promise.resolve(data.contexts);
        });
        this.locale = locale;
        this.baseUrl = baseUrl;
        this.logger = logger;
    }
    getShopMenu(timeout = 5000) {
        const fallback = this.locale === "en-CA"
            ? shopMenuFallBackContentEn
            : shopMenuFallBackContentFr;
        return this.getMenu(timeout, this.buildUrl(EndpointPaths.shop), fallback);
    }
    getBrandsMenu(timeout = 5000) {
        const fallback = this.locale === "en-CA"
            ? brandsMenuFallBackContentEn
            : brandsMenuFallBackContentFr;
        return this.getMenu(timeout, this.buildUrl(EndpointPaths.brands), fallback);
    }
    getMenu(timeout, apiUrl, fallback) {
        let res;
        let timedOut = false;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const apiTimeout = setTimeout(() => {
                timedOut = true;
                this.logger && this.logger.warn && this.logger.warn("ApiMenusContentProvider fallback content displyed for " + apiUrl);
                resolve(fallback);
            }, timeout);
            const cacheKey = apiUrl;
            try {
                if (typeof window === "undefined") {
                    const content = menuContentCache.get(cacheKey);
                    if (content) {
                        return resolve(content);
                    }
                }
                res = yield fetch(apiUrl);
            }
            catch (error) {
                resolve(fallback);
                return;
            }
            if (!timedOut) {
                try {
                    const json = yield res.json();
                    if (res.ok) {
                        if (typeof window === "undefined") {
                            menuContentCache.set(cacheKey, json);
                        }
                        resolve(json);
                    }
                }
                catch (_a) {
                    // do nothing
                }
                finally {
                    clearTimeout(apiTimeout);
                }
            }
            resolve(fallback);
        }));
    }
    buildUrl(menu) {
        const tempUrl = url.parse(`${this.baseUrl}${menu}`, true);
        tempUrl.query = {
            lang: this.locale,
        };
        return url.format(tempUrl).toLowerCase();
    }
}
//# sourceMappingURL=ApiMenusContentProvider.js.map