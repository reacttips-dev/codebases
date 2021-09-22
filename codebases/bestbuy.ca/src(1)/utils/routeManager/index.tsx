import patternUtils from "./patternUtils";
import routeConfig from "./routes";
export class RouteManager {
    constructor(routes) {
        this.routesByKey = {};
        this.routesByKey = routes;
    }
    getKeyByPath(lang, path) {
        for (const key in this.routesByKey) {
            if (this.routesByKey.hasOwnProperty(key)) {
                const route = this.routesByKey[key];
                const pattern = route[lang];
                const match = patternUtils.matchPattern(pattern, path);
                if (match && !match.remainingPathname) {
                    return key;
                }
            }
        }
        throw new Error("No key found for path: " + path);
    }
    getPathByKey(lang, key, ...params) {
        let pattern = this.routesByKey.notFound[lang];
        if (key in this.routesByKey) {
            pattern = this.routesByKey[key][lang] + "";
        }
        const paramNames = patternUtils.getParamNames(pattern);
        const paramsObj = {};
        for (let i = 0; i < params.length; i++) {
            paramsObj[paramNames[i]] = params[i];
        }
        return patternUtils.formatPattern(pattern, paramsObj);
    }
    getParams(lang, path) {
        const key = this.getKeyByPath(lang, path);
        const pattern = this.routesByKey[key] && this.routesByKey[key][lang]
            || this.routesByKey.notFound[lang];
        return patternUtils.getParams(pattern, path);
    }
}
export const getLangRelativeUrl = (langUrl) => {
    if (!langUrl.toLowerCase().startsWith("http")) {
        return langUrl; // return if already relative
    }
    const relativeUrl = "/" + langUrl.split("/").splice(3).join("/"); // remove the host from url
    return relativeUrl;
};
const routeManager = new RouteManager(routeConfig);
export default routeManager;
//# sourceMappingURL=index.js.map