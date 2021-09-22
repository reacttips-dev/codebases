import {CookieUtils} from "@bbyca/bbyca-components";

const patt = /(?:MCMID\|)([0-9a-zA-Z]*|)/;

export const getAdobeVisitorId = (): string => {
    const cookieVal = CookieUtils.getCookie("AMCV_[^=]*");
    const str = cookieVal ? decodeURIComponent(cookieVal.value) : "";
    const id = patt.exec(str);
    if (id === null || id.length < 2) {
        return "";
    }
    return id[1];
};
