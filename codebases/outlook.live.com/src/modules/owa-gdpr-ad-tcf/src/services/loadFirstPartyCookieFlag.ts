import {
    lazyGetServerOptionsForFeature,
    GdprAdsV3Options,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';
import gdprTcfStore from '../store/gdprTcfStore';

export default async function loadFirstPartyCookieFlag(): Promise<number> {
    // if gdprTcfString is not null, load the string from store instead of option
    if (gdprTcfStore.firstPartyCookieFlag != 0) {
        return gdprTcfStore.firstPartyCookieFlag;
    }

    const getServerOptionsForFeature = await lazyGetServerOptionsForFeature.import();

    const response = await getServerOptionsForFeature<GdprAdsV3Options>(
        OwsOptionsFeatureType.GdprAdsV3
    );

    if (response == null || response.selectedVendorId == null) {
        return -1;
    }

    const selectedVendorId = response.selectedVendorId;
    if (selectedVendorId.indexOf(2) > -1) {
        return 2;
    } else if (selectedVendorId.indexOf(3) > -1) {
        return 3;
    }

    return -1;
}
