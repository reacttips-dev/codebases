import type { GVL } from '@iabtcf/core';
import { lazyGdprTcfVendorList } from 'owa-gdpr-ad-tcfvendorlist';
import fetchOnlineTcfVendorList from '../utils/fetchOnlineTcfVendorList';

let gvlTcfListCache: GVL;

export default async function fetchTcfVendorList(): Promise<GVL> {
    if (!gvlTcfListCache) {
        // Fetch from online
        gvlTcfListCache = await fetchOnlineTcfVendorList();

        if (!gvlTcfListCache) {
            let getTcfVendorList = await lazyGdprTcfVendorList.import();
            gvlTcfListCache = getTcfVendorList();
        }
    }

    return gvlTcfListCache;
}

// This is used in the unit test
export function clearVendorListCache() {
    gvlTcfListCache = null;
}
