let parsedQueryString: Record<string, string> | null = null;
let sourceParam: string | undefined = undefined;

export function getQueryStringParameters(
    locationObj: Pick<Location, 'search'> = location
): { [key: string]: string } {
    if (locationObj === location) {
        // Cache the parsed value for the main window
        return parsedQueryString || (parsedQueryString = parseQuery(location));
    } else {
        // Parsing the querystring for an iframe or such
        return parseQuery(locationObj);
    }
}

export function getQueryStringParameter(
    key: string,
    locationObj?: Pick<Location, 'search'>
): string {
    return getQueryStringParameters(locationObj)[key];
}

export function hasQueryStringParameter(key: string, locationObj?: Pick<Location, 'search'>) {
    return Object.prototype.hasOwnProperty.call(getQueryStringParameters(locationObj), key);
}

function parseQuery(locationObj: Pick<Location, 'search'>) {
    if (typeof locationObj !== 'undefined') {
        return locationObj.search ? nodeParseQueryString(locationObj.search.substr(1)) : {};
    }

    // We're running outside a browser window, so return an empty property bag
    return {};
}

export function getSourceQueryParam(): string | undefined {
    return sourceParam || (sourceParam = getAndStripSourceQueryParam());
}

function getAndStripSourceQueryParam(): string | undefined {
    let source = getQueryStringParameter('source');
    if (source) {
        const newSearch = removeQuery(location.search, 'source');
        history.replaceState(history.state, '/', location.pathname + newSearch);
    }
    return source;
}

export function removeQuery(search: string, queryKey: string) {
    const regex = new RegExp('(\\?|&)' + queryKey + '=\\w*&?', 'g');
    let newSearch = search.split(regex).join('');
    const lastChar = newSearch[newSearch.length - 1];
    if (lastChar === '?' || lastChar === '&') {
        newSearch = newSearch.substr(0, newSearch.length - 1);
    }
    return newSearch;
}

const maxKeys = 1000;
const regexp = /\+/g;
export function nodeParseQueryString(qs: string): { [key: string]: string } {
    const result = {};
    if (typeof qs === 'string' && qs.length > 0) {
        const qsParts = qs.split('&');
        const length = qsParts.length > maxKeys ? maxKeys : qsParts.length;
        for (let i = 0; i < length; ++i) {
            const qsPartSplit = qsParts[i].replace(regexp, '%20').split('=');
            result[decodeURIComponent(qsPartSplit[0])] = decodeURIComponent(
                qsPartSplit.slice(1).join('=')
            );
        }
    }

    return result;
}

export function stringify(params: { [key: string]: string }): string {
    if (params) {
        return Object.keys(params)
            .map(
                k => encodeURIComponent(k) + (params[k] ? '=' + encodeURIComponent(params[k]) : '')
            )
            .join('&');
    }
    return '';
}

export function test_reset() {
    parsedQueryString = null;
    sourceParam = undefined;
}

export const isGulpingValue = hasQueryStringParameter('gulp');
export const isGulpOrBranchingValue = isGulpingValue || hasQueryStringParameter('branch');
