import {
    GdprAdsV3Options,
    getOptionsForFeature,
    lazyCreateOrUpdateOptionsForFeature,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

export default function saveGdprTcfTCString(
    encodedTCString: string,
    checkedInVendorListVersion: number
) {
    const currentOptions = getOptionsForFeature<GdprAdsV3Options>(OwsOptionsFeatureType.GdprAdsV3);

    const newOptions = {
        ...currentOptions,
        encodedTCString: encodedTCString,
        vendorListVersion: checkedInVendorListVersion,
    };

    return lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.GdprAdsV3,
        newOptions
    );
}
