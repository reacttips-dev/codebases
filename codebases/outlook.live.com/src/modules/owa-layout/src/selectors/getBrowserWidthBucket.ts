import { getStore } from '../store/store';
import type BrowserWidthBucket from '../store/schema/BrowserWidthBucket';

export default function getBrowserWidthBucket(): BrowserWidthBucket {
    // store.browserWidthBucket can be null as some apps (e.g. Mail) do not initialize
    // dynamic layout store if the flight is not enabled.
    // This value is used in app logic and compared with the Enum BrowserWidthBucket
    // using the number comparison style (e.g. browserWidthBucket <= BrowserWidthBucket.From900_To918)
    // if null such conditions are evaluated as true. Hence returning undefined is required.
    // The comparison with undefined is evaluated as intended.
    const storeBrowserWidthBucket = getStore().browserWidthBucket;
    return storeBrowserWidthBucket ? storeBrowserWidthBucket : undefined;
}
