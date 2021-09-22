import Cookie from "../Cookie/Cookie";
const EMPTY_VALUE = "";
const MIN_EXPIRY_DATE = new Date(1970, 1, 1, 0, 0, 1);
export const CookieUtils = {
    getCookie: (name) => {
        if (typeof document === "undefined" || !document.cookie) {
            return undefined;
        }
        try {
            const regexp = new RegExp("(?:(?:^|.*;\\s*)" + name + "\\s*\\=\\s*([^;]*).*$)|^.*$");
            // find within all cookies the cookie value or provided cookie name
            const browserCookieValue = document.cookie.replace(regexp, "$1");
            if (!browserCookieValue) {
                return undefined;
            }
            return new Cookie(name, browserCookieValue);
        }
        catch (error) {
            return undefined;
        }
    },
    setCookie: (cookie) => {
        if (typeof document === "undefined") {
            throw new Error("Document object of browser does not exist.");
        }
        if (!cookie) {
            throw new Error("Invalid cookie");
        }
        document.cookie = cookie.serialize();
    },
    removeCookie: (name, domain) => {
        const cookieToRemove = CookieUtils.getCookie(name);
        if (!cookieToRemove) {
            throw new Error("Cookie to be removed does not exist");
        }
        cookieToRemove.value = EMPTY_VALUE;
        cookieToRemove.maxAge = 0;
        cookieToRemove.expires = MIN_EXPIRY_DATE;
        if (domain) {
            cookieToRemove.domain = domain;
        }
        CookieUtils.setCookie(cookieToRemove);
    },
};
export default CookieUtils;
//# sourceMappingURL=CookieUtils.js.map