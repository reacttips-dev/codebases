import type GdprTcfPurposesFeaturesBits from './GdprTcfPurposesFeaturesBits';
import fetchTcfVendorList from '../services/fetchTcfVendorList';
import { TCModel, TCString } from '@iabtcf/core';
import { getCurrentCulture } from 'owa-localize';

export interface GdprTcfObj {
    encodedTCString: string;
    vendorListVersion: number;
}

// Purpose 1 - Store and/or access information on a device
// Purpose 2 - Select basic ads
// Purpose 3 - Create a personalised ads profile
// Purpose 4 - Select personalised ads
// Purpose 5 - Create a personalised content profile
// Purpose 6 - Select personalised content
// Purpose 7 - Measure ad performance
// Purpose 8 - Measure content performance
// Purpose 9 - Apply market research to generate audience insights
// Purpose 10 - Develop and improve products
// Special Feature 1 - Use precise geolocation data
// Special Feature 2 - Actively scan device characteristics for identification
export default async function generateTcfString(
    gdprTcfPurposeFeatureBits: GdprTcfPurposesFeaturesBits,
    allowedLegitimateInterestsBits: boolean,
    disselectedVendorId: number[]
): Promise<GdprTcfObj> {
    const gvl = await fetchTcfVendorList();

    const tcModel = new TCModel(gvl);

    tcModel.cmpId = 168;
    tcModel.cmpVersion = 2;
    tcModel.consentScreen = 1;

    // Determine the user's culture
    const culture = getCurrentCulture();
    const consentLanguage = culture ? culture.split('-')[0] : 'en';
    tcModel.consentLanguage = consentLanguage;

    // Set service specific
    tcModel.isServiceSpecific = true;

    const purposeFlags = [
        gdprTcfPurposeFeatureBits.allStoreAndAccessDevice,
        gdprTcfPurposeFeatureBits.allowPersonalisedAdsSelectBasicAd,
        gdprTcfPurposeFeatureBits.allowPersonalisedAdsCreatePersonalisedAdsProfile,
        gdprTcfPurposeFeatureBits.allowPersonalisedAdsSelectPersonalisedAds,
        gdprTcfPurposeFeatureBits.allowPersonalisedAdsCreatePersonalisedContentProfile,
        gdprTcfPurposeFeatureBits.allowPersonalisedAdsSelectPersonalisedContent,
        gdprTcfPurposeFeatureBits.allowPersonalisedAdsMeasureAdPerf,
        gdprTcfPurposeFeatureBits.allowPersonalisedAdsMeasureContentPerformance,
        gdprTcfPurposeFeatureBits.allowPersonalisedAdsApplyMarketResearch,
        gdprTcfPurposeFeatureBits.allowDevelopAndImproveProduct,
    ];

    const allowedPurposes: number[] = [];
    purposeFlags.forEach((allowed, index) => {
        if (allowed) {
            allowedPurposes.push(index + 1);
        }
    });
    tcModel.purposeConsents.set(allowedPurposes);

    // For LegitimateInterests, we either allow 2,7,8,9,10 or nothing
    const allowedLegitimateInterests = allowedLegitimateInterestsBits ? [2, 7, 8, 9, 10] : [];
    tcModel.purposeLegitimateInterests.set(allowedLegitimateInterests);

    // For allowPreciseGeoDataAndIdentifyDeviceScanDevice, Outlook always sets it to false
    const speicalFeatureFlags = [
        gdprTcfPurposeFeatureBits.allowPreciseGeoDataAndIdentifyDeviceGeoData,
        false,
    ];
    const allowedSpecialFlags: number[] = [];
    speicalFeatureFlags.forEach((allowed, index) => {
        if (allowed) {
            allowedSpecialFlags.push(index + 1);
        }
    });
    tcModel.specialFeatureOptins.set(allowedSpecialFlags);

    const strToInt: (str: string) => number = (str: string): number => parseInt(str, 10);
    const allVendorIds = Object.keys(gvl.vendors)
        .filter(function (key) {
            // Only get the vendorIds without deletedDate
            return gvl.vendors[key].deletedDate == null;
        })
        .map(strToInt);

    const allowedVendorIds: number[] = [];

    allVendorIds.forEach(vendorId => {
        if (disselectedVendorId.indexOf(vendorId) == -1) {
            allowedVendorIds.push(vendorId);
        }
    });
    tcModel.vendorConsents.set(allowedVendorIds);
    tcModel.vendorLegitimateInterests.set(allowedVendorIds);

    const encodedTCString = TCString.encode(tcModel, { isForVendors: true });
    const vendorListVersion: number = +tcModel.vendorListVersion;
    return { encodedTCString: encodedTCString, vendorListVersion: vendorListVersion };
}
