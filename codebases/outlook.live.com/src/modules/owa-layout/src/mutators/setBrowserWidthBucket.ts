import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';
import type BrowserWidthBucket from '../store/schema/BrowserWidthBucket';

/**
 * Sets browser's current width bucket
 * @param browserWidthBucket Browser width bucket
 */
export default mutatorAction('setBrowserWidthBucket', (browserWidthBucket: BrowserWidthBucket) => {
    getStore().browserWidthBucket = browserWidthBucket;
});
