import { acceptTargetedAds } from '../actions/internalActions';
import { generateTcfString, setGdprTcfString, setFirstPartyCookieFlag } from 'owa-gdpr-ad-tcf';
import { orchestrator } from 'satcheljs';
import {
    GdprAdsV3Options,
    getOptionsForFeature,
    lazyCreateOrUpdateOptionsForFeature,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

const acceptTargetedAdsOrchestrator = orchestrator(acceptTargetedAds, async () => {
    const gdprTcfPurposeFeatureAllAcceptBits = {
        allStoreAndAccessDevice: true,
        allowPersonalisedAdsSelectBasicAd: true,
        allowPersonalisedAdsCreatePersonalisedAdsProfile: true,
        allowPersonalisedAdsSelectPersonalisedAds: true,
        allowPersonalisedAdsCreatePersonalisedContentProfile: true,
        allowPersonalisedAdsSelectPersonalisedContent: true,
        allowPersonalisedAdsMeasureAdPerf: true,
        allowPersonalisedAdsMeasureContentPerformance: true,
        allowPersonalisedAdsApplyMarketResearch: true,
        allowDevelopAndImproveProduct: true,
        allowPreciseGeoDataAndIdentifyDeviceGeoData: true,
        allowPreciseGeoDataAndIdentifyDeviceScanDevice: true,
    };
    const gdprTcfObj = await generateTcfString(gdprTcfPurposeFeatureAllAcceptBits, true, []);
    const allAcceptSelectedVendorId = [2];

    const savedOptions = getOptionsForFeature<GdprAdsV3Options>(OwsOptionsFeatureType.GdprAdsV3);

    const newOptions = {
        ...savedOptions,
        allStoreAndAccessDevice: true,
        allowDevelopAndImproveProduct: true,
        allowPersonalisedAds: true,
        allowPersonalisedAdsSelectBasicAd: true,
        allowPersonalisedAdsApplyMarketResearch: true,
        allowPersonalisedAdsMeasureContentPerformance: true,
        allowPersonalisedAdsSelectPersonalisedAds: true,
        allowPersonalisedAdsMeasureAdPerf: true,
        allowPersonalisedAdsSelectPersonalisedContent: true,
        allowPersonalisedAdsCreatePersonalisedContentProfile: true,
        allowPersonalisedAdsCreatePersonalisedAdsProfile: true,
        allowPreciseGeoDataAndIdentifyDevice: true,
        allowPreciseGeoDataAndIdentifyDeviceScanDevice: true,
        allowPreciseGeoDataAndIdentifyDeviceGeoData: true,
        disselectedVendorId: [],
        selectedVendorId: allAcceptSelectedVendorId,
        ...(gdprTcfObj
            ? {
                  encodedTCString: gdprTcfObj.encodedTCString,
                  vendorListVersion: gdprTcfObj.vendorListVersion,
              }
            : null),
    };

    setGdprTcfString(gdprTcfObj.encodedTCString);
    setFirstPartyCookieFlag(2);

    return lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.GdprAdsV3,
        newOptions
    );
});

export default acceptTargetedAdsOrchestrator;
