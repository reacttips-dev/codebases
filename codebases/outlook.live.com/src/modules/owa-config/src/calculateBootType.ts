import type { BootType } from './types/BootType';
import { isPwa } from './isPwa';
import { getResourcePath } from './bootstrapOptions';
import { getItem, setItem } from 'owa-local-storage';

const LocaleStorageKey = 'BootTypeScriptVer';

let calculateError: Error;

export async function calculateBootType(startTime: number): Promise<BootType> {
    if (isPwa()) {
        return 'Pwa';
    }
    try {
        const fetchUrl = `${getResourcePath()}analytics-ping.js`;
        const response = await fetch(fetchUrl);
        return parseResponse(startTime, response, fetchUrl);
    } catch (e) {
        calculateError = e;
        return 'Unknown';
    }
}

// this is a temporary function to get more information on why IE is not calculating the boot type correctly.
export function getCalculateBootTypeError() {
    return calculateError;
}

function parseResponse(startTime: number, response: Response, fetchUrl: string) {
    if (response.headers.get('x-sw-active-cache')) {
        return 'SwCache';
    }

    let responseDateString = response.headers.get('Date');

    // Some versions of edge and IE don't expose the date header
    // So we are going to store the url that we check against in local storage.
    // Then if it matches the same url that we fetch, we can make a best guess that it
    // was browser cache. This will probably work most of the time because when the
    // browser cache is cleared then local storage should also be cleared
    if (responseDateString == null) {
        const matchesCachedVersion = getItem(window, LocaleStorageKey) == fetchUrl;
        setItem(window, LocaleStorageKey, fetchUrl);
        return matchesCachedVersion ? 'BrowserCache' : 'NoCache';
    }

    let responseDateTimestamp = Date.parse(responseDateString);
    if (isNaN(responseDateTimestamp)) {
        throw new Error('InvalidDate');
    }

    // If the resource date is retrieved after the session start, so this is loaded from online
    // Given that there can be clock difference between server and browser, we allow 1000ms for the delta
    return responseDateTimestamp - startTime > -1000 ? 'NoCache' : 'BrowserCache';
}
