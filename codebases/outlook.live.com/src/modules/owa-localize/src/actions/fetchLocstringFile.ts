import { fetchLocstrings, addPreloadUrl } from 'owa-localize-internal';
import { addLocstringsToStore } from './addLocstringsToStore';
import { setLocale } from './setLocale';

let warningShown: boolean = false;
let trackTiming: boolean = true;

export function fetchLocstringFile(locale: string, url: string): Promise<void> {
    addPreloadUrl(url);
    const result = fetchLocstrings(url, undefined, trackTiming).then(stringMap => {
        addLocstringsToStore(stringMap);
    });
    trackTiming = false;
    if (process.env.NODE_ENV !== 'production' && locale !== 'en') {
        result.catch(() => {
            setLocale('en', 'ltr');

            if (!warningShown) {
                warningShown = true;
                alert(`Build does not include locale "${locale}". Falling back to English.`);
            }
        });
    }
    return result;
}
