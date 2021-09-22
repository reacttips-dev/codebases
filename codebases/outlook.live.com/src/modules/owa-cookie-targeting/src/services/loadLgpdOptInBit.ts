import {
    lazyGetServerOptionsForFeature,
    LgpdAdsOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

export default async function loadLgpdoptInBit(): Promise<number> {
    const getServerOptionsForFeature = await lazyGetServerOptionsForFeature.import();

    const response = await getServerOptionsForFeature<LgpdAdsOptions>(
        OwsOptionsFeatureType.LgpdAds
    );

    if (response == null || response.optInBit == null) {
        return 0;
    }

    return response.optInBit;
}
