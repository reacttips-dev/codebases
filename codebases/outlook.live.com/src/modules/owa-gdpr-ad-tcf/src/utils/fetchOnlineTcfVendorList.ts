import type { GVL } from '@iabtcf/core';

const vendorListCdnUrl = 'https://res-1.cdn.office.net/assets/ads/7dttl/vendor-list.json';

export default async function fetchOnlineTcfVendorList(): Promise<GVL | undefined> {
    try {
        const response = await fetch(vendorListCdnUrl);

        if (response?.status === 200) {
            const onlineTcfList = await response.json();
            return onlineTcfList;
        }
    } catch {}

    return undefined;
}
