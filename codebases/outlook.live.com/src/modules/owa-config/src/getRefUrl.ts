import { scrubForPii } from './scrubForPii';

// this returns an encoded version of the current path
// but makes sure it is not longer than 100 characters
export default function getRefUrl(): string | undefined {
    let refUrl = scrubForPii(window?.location?.href);
    if (refUrl && refUrl.length > 100) {
        refUrl = refUrl.substr(0, 100);
    }
    return refUrl && encodeURIComponent(refUrl);
}
