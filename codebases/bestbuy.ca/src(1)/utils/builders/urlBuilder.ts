import * as url from "url";
export const externalUrlBuilder = (uri = "", queryStrings = {}) => {
    const href = url.parse(uri);
    href.query = queryStrings;
    return url.format(href);
};
export const internalUrlBuilder = (uri = "", queryStrings = {}) => {
    const href = url.parse(`${uri}`);
    href.query = queryStrings;
    return url.format(href);
};
export const urlBuilder = {
    external: externalUrlBuilder,
    internal: internalUrlBuilder,
};
export const urlCleaner = (utlStr) => utlStr ? utlStr.replace(/\/$/, "") : "";
//# sourceMappingURL=urlBuilder.js.map