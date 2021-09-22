// eslint-disable-next-line node/no-deprecated-api
import * as url from 'url';

export function formatUrl(basePath: string, route: string, search: string): string {
    const urlObj: url.UrlObject = {
        pathname: basePath + route,
        search,
    };

    return url.format(urlObj);
}
