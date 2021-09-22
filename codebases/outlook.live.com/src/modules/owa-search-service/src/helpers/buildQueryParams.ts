import { getPartnerParam } from './getPartnerParam';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getQueryStringParameter } from 'owa-querystring';

const debugHookParamName = 'searchtesthook';
export function getDebugHook(): { [paramName: string]: string } {
    let debugHook = {};
    const debugHookURIString = getQueryStringParameter(debugHookParamName);
    const debugHookString = decodeURIComponent(debugHookURIString || '').trim();

    if (isFeatureEnabled('sea-debugHook') && debugHookString.length > 0) {
        // the searchtesthook query param takes the form of a string of more query params which we want
        // to use as overrides on our 3S requests. To that end, we turn the debugHook value into a
        // dictionary
        const debugHookKeyValuePairStrings = debugHookString.split('&');
        debugHook = debugHookKeyValuePairStrings.reduce((acc, e) => {
            const [key, value] = e.split('=');
            acc[key] = value;
            return acc;
        }, {});
    }

    return debugHook;
}

export default function buildQueryParams(defaultQueryParams: { [key: string]: string } = {}) {
    const params = mergeObjectsWithCommaDelimitedValues(
        ['setflight'], // Allow server flights from both querystring and debug hook
        defaultQueryParams,
        getDebugHook(),
        getPartnerParam()
    );

    const filtered = Object.keys(params)
        .filter(key => params[key] !== null)
        .reduce((obj, key) => {
            return {
                ...obj,
                [key]: params[key],
            };
        }, {});

    return filtered;
}

// Merge any number of objects containing key/value mappings
// If a key in propsToCombine is found in multiple objects, combine those values in a comma-delimited string instead of overwriting
export function mergeObjectsWithCommaDelimitedValues(
    propsToCombine: string[],
    ...objects: { [key: string]: string }[]
) {
    const mergedObject = {};
    for (const obj of objects) {
        for (const prop of Object.keys(obj)) {
            if (propsToCombine.includes(prop) && mergedObject.hasOwnProperty(prop)) {
                mergedObject[prop] = mergedObject[prop] + ',' + obj[prop];
            } else {
                mergedObject[prop] = obj[prop];
            }
        }
    }
    return mergedObject;
}
