import URLSearchParamsPolyfill from "@ungap/url-search-params";
import swLog from "@similarweb/sw-log";

export const BYPASS_CACHE_COOKIE_NAME = "RESET_PRO_CACHE";
export const BYPASS_CACHE_QUERY_STRING_NAME = "clear-cache";
export const BYPASS_USER_DATA_CACHE_QUERY_STRING_NAME = "clear-userdata-cache";

export const hasBypassCookie = () => {
    // does cookie exist
    if (
        !document.cookie
            .split(";")
            .some((itm) => itm.trim().startsWith(`${BYPASS_CACHE_COOKIE_NAME}=`))
    ) {
        return false;
    }

    // have we already handled this cookie
    const cookieNameRegexp = new RegExp(
        String.raw`(?:(?:^|.*;\s*)${BYPASS_CACHE_COOKIE_NAME}\s*\=\s*([^;]*).*$)|^.*$`,
    );
    return document.cookie.replace(cookieNameRegexp, "$1").toLocaleLowerCase() === "true";
};

export const hasBypassQueryString = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.has(BYPASS_CACHE_QUERY_STRING_NAME);
};

export const hasUserDataBypassQueryString = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.has(BYPASS_USER_DATA_CACHE_QUERY_STRING_NAME);
};

export const isUserDataCacheBypass = () => {
    // feature detection for out IE11 friends
    if (!("URLSearchParams" in window)) {
        window.URLSearchParams = URLSearchParamsPolyfill;
    }

    return hasBypassCookie() || hasBypassQueryString() || hasUserDataBypassQueryString();
};

export const isSettingCacheBypass = () => {
    // feature detection for out IE11 friends
    if (!("URLSearchParams" in window)) {
        window.URLSearchParams = URLSearchParamsPolyfill;
    }

    return hasBypassCookie() || hasBypassQueryString();
};

export const clearBypassCache = () => {
    if (hasBypassCookie()) {
        // clear cookie
        const domainForCookie = getDomainForCookie(location.hostname);
        const bypassCookie = `${BYPASS_CACHE_COOKIE_NAME}=False;domain=${domainForCookie};expires=0;`;
        document.cookie = bypassCookie;
        swLog.log(`Bypassed cache with cookie. Clearing...`);
    }

    if (hasBypassQueryString()) {
        const urlParams = new URLSearchParams(location.search);
        urlParams.delete(BYPASS_CACHE_QUERY_STRING_NAME);
        let newUrl = `${location.pathname}`;
        if (urlParams && urlParams.toString()?.length > 0) {
            newUrl = `${newUrl}?${urlParams}`;
        }

        // rewrite the url. clean up our mess.
        window.history.replaceState({}, "", newUrl);
        swLog.log(`Bypassed cache with query string. Clearing...`);
    }

    if (hasUserDataBypassQueryString()) {
        const urlParams = new URLSearchParams(location.search);
        urlParams.delete(BYPASS_USER_DATA_CACHE_QUERY_STRING_NAME);
        let newUrl = `${location.pathname}`;
        if (urlParams && urlParams.toString()?.length > 0) {
            newUrl = `${newUrl}?${urlParams}`;
        }
        if (location.hash) {
            newUrl = `${newUrl}${location.hash}`;
        }

        // rewrite the url. clean up our mess.
        window.history.replaceState({}, "", newUrl);
        swLog.log(`Bypassed cache with query string. Clearing...`);
    }
};

const getDomainForCookie = (url: string) => {
    let idx = url.indexOf("sandbox.");
    if (idx !== -1) {
        return `.${url.substring(idx)}`;
    }

    idx = url.indexOf("similarweb.");
    if (idx !== -1) {
        return `.${url.substring(idx)}`;
    }
};
