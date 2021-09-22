import { fetchLocstrings } from './fetchLocstrings';
import { getItem, setItem } from 'owa-local-storage';
import { getClientVersion, getApp } from 'owa-config';

const PRELOAD_STRINGS_STORAGE_KEY_SUFFIX = 'OwaPreloadStrings';
let preloadUrls: string[] | undefined = [];

export function preloadLocStrings(source: string) {
    if (process.env.NODE_ENV !== 'dev') {
        try {
            const urlsString = getItem(window, getApp() + PRELOAD_STRINGS_STORAGE_KEY_SUFFIX);
            if (urlsString) {
                const urls: string[] = JSON.parse(urlsString);

                // we should only preload the loc strings if the strings in
                // local storage match the version that we are asking for
                if (urls[0]?.indexOf(getClientVersion()) > -1) {
                    for (const url of urls) {
                        fetchLocstrings(url, source);
                    }
                }
            }
        } catch {
            // nothing should handle if we fail
        }
    }
}

export function addPreloadUrl(url: string): void {
    if (preloadUrls) {
        preloadUrls.push(url);
    }
}

export function cachePreloadUrls(): void {
    setItem(window, getApp() + PRELOAD_STRINGS_STORAGE_KEY_SUFFIX, JSON.stringify(preloadUrls));

    // clear preload urls so we stop adding to the array to avoid a memory leak
    preloadUrls = undefined;
}
