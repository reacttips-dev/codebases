export default function getUrlWithAddedQueryParameters(
    url: string,
    params: { [key: string]: string }
) {
    if (!params || Object.keys(params).length == 0) {
        return url;
    }
    const hasExistingQuery = url.indexOf('?') !== -1;
    url += hasExistingQuery ? '&' : '?';

    const encodedParams = Object.keys(params)
        .map((key, i) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    return url + encodedParams;
}
