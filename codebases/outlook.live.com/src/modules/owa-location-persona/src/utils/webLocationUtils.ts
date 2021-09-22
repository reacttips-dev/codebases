import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import { isEnhancedLocation } from '../index';

/**
 * Checks if the location is a Web URL. it returns true if the location is a string location and
 * contains a url that starts with http(s) or www
 */
export function containsWebUrlLocation(location: EnhancedLocation): boolean {
    let doesContainWebUrlLocation = false;
    if (location.DisplayName) {
        doesContainWebUrlLocation = getWebUrlsFromString(location.DisplayName)?.length > 0;
    }
    return !isEnhancedLocation(location.PostalAddress) && doesContainWebUrlLocation;
}

export function openWebLocation(location: string) {
    return function () {
        const protocolRegex = /^http*/i;
        // if protocol is not specified (like in www.microsoft.com) we need to add // to the URL to start a new root address
        const url = protocolRegex.test(location) ? location : '//' + location;
        window.open(url, '_blank');
    };
}

export function getWebUrlsFromString(location: string): string[] {
    return location.match(/\S+/g)?.filter(token => isWebUrl(token));
}

export function isWebUrl(location: string): boolean {
    // URL starting with http(s) or www
    const urlRegex = /^((http[s]?:\/\/)|(www\.)?){1}[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}\b([-a-zA-Z0-9@:*%_\+.~#?&//=]*)/i;
    return urlRegex.test(location);
}
