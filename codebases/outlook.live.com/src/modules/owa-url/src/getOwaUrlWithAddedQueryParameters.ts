import { getHostLocation } from './hostLocation';
import getScopedPath from './getScopedPath';
import { getOrigin } from './getOrigin';

export function getOwaUrlWithAddedQueryParameters(params: { [key: string]: string }) {
    let hostLocation = getHostLocation();
    let origin = getOrigin();
    let url = origin + getScopedPath('/owa') + '/';
    let hasExistingQuery = hostLocation.search && hostLocation.search.length > 0;
    url += hasExistingQuery ? hostLocation.search : '?';

    let keys = Object.keys(params);
    let addAmpersand = hasExistingQuery;
    for (let i = 0; i < keys.length; i++) {
        if (addAmpersand) {
            url += '&';
        } else {
            addAmpersand = true;
        }

        url += keys[i] + '=' + params[keys[i]];
    }

    return url;
}
