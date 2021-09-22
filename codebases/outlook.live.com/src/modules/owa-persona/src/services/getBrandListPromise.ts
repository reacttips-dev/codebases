import { getPackageBaseUrl } from 'owa-config';
import type BrandList from '../store/schema/BrandList';

export const BRAND_LIST_URI = 'resources/json/brandList.json';
export const BING_BRAND_LIST_URI = 'resources/json/bingPagesManagedBrandList.json';

/**
 * Throws an error if a response is not status: 200 w/ a scenario-specific message.
 *
 * Otherwise, returns a promise of the response's json
 */
const handleBrandResponse = (r: Response) => {
    if (r.status !== 200) {
        throw new Error(
            `error fetching brand list: request for '${r.url}' resolved with status ${r.status}`
        );
    }
    return r.json();
};

/**
 * Gets a promise that resolves to the brand BrandList, depending on flags.
 */
export const getBrandListPromise = (): Promise<BrandList> => {
    let brandListUrl = `${getPackageBaseUrl()}${BRAND_LIST_URI}`;
    return fetch(brandListUrl).then(handleBrandResponse);
};
