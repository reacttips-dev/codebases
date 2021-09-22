import fetchTcfVendorList from './fetchTcfVendorList';
import saveGdprTcfTCString from './saveGdprTcfTCString';
import gdprTcfStore from '../store/gdprTcfStore';
import generateTcfString from '../utils/generateTcfString';
import { TCModel, TCString } from '@iabtcf/core';
import { logUsage } from 'owa-analytics';
import {
    lazyGetServerOptionsForFeature,
    GdprAdsV3Options,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

export default async function loadGdprTcfTCString(): Promise<string> {
    // if gdprTcfString is not null, load the string from store instead of option
    if (gdprTcfStore.gdprTcfString != null) {
        return gdprTcfStore.gdprTcfString;
    }

    const currentGvl = await fetchTcfVendorList();
    const cdnVendorListVersion = currentGvl.vendorListVersion;

    let currentEncodedTCString;

    const getServerOptionsForFeature = await lazyGetServerOptionsForFeature.import();

    const response = await getServerOptionsForFeature<GdprAdsV3Options>(
        OwsOptionsFeatureType.GdprAdsV3
    );

    if (response == null || response.encodedTCString == null || response.encodedTCString == '') {
        return null;
    }

    currentEncodedTCString = response.encodedTCString;

    let consentDataTCModel: TCModel;

    // Judge the saved consent data string is a valid Outlook.com consent string.
    // 1. Invalid consent string format will cause the exception in the ConsentString sdk
    // 2. CmpId must be 168.
    // For any invalid consent string, we will return null to let the caller reset the consent string
    try {
        consentDataTCModel = TCString.decode(currentEncodedTCString);
    } catch (err) {
        logUsage('InvalidFormatV3ConsentTCFDataString', {
            consentString: currentEncodedTCString,
            errorMessage: err.message,
        });
        return null;
    }

    if (consentDataTCModel.cmpId != 168) {
        logUsage('InvalidCmpIdConsentDataString', { consentString: currentEncodedTCString });
        return null;
    }

    // If the saved consent string's vendor list version is smaller than the CDN vendor list version, we will re-generate and save a new consent string
    if (consentDataTCModel.vendorListVersion < cdnVendorListVersion) {
        const gdprTcfPurposeFeatureCurrentBits = {
            allStoreAndAccessDevice: response.allStoreAndAccessDevice,
            allowPersonalisedAdsSelectBasicAd: response.allowPersonalisedAdsSelectBasicAd,
            allowPersonalisedAdsCreatePersonalisedAdsProfile:
                response.allowPersonalisedAdsCreatePersonalisedAdsProfile,
            allowPersonalisedAdsSelectPersonalisedAds:
                response.allowPersonalisedAdsSelectPersonalisedAds,
            allowPersonalisedAdsCreatePersonalisedContentProfile:
                response.allowPersonalisedAdsCreatePersonalisedContentProfile,
            allowPersonalisedAdsSelectPersonalisedContent:
                response.allowPersonalisedAdsSelectPersonalisedContent,
            allowPersonalisedAdsMeasureAdPerf: response.allowPersonalisedAdsMeasureAdPerf,
            allowPersonalisedAdsMeasureContentPerformance:
                response.allowPersonalisedAdsMeasureContentPerformance,
            allowPersonalisedAdsApplyMarketResearch:
                response.allowPersonalisedAdsApplyMarketResearch,
            allowDevelopAndImproveProduct: response.allowDevelopAndImproveProduct,
            allowPreciseGeoDataAndIdentifyDeviceGeoData:
                response.allowPreciseGeoDataAndIdentifyDeviceGeoData,
            allowPreciseGeoDataAndIdentifyDeviceScanDevice:
                response.allowPreciseGeoDataAndIdentifyDeviceScanDevice,
        };

        let disselectedVendorIdArray = [];
        // If the user has opt-in all vendors, we will treat the new vendors from the new vendorjson list as in by default
        // If the user has opt-out any vendor, we will treat the new vendors from the new vendorjson list as out by default
        if (response?.disselectedVendorId?.length > 0) {
            const currentDisselectedVendorIds = response.disselectedVendorId.slice() as number[];

            // Need to compare the vendor and add the new vendor
            // We need to find the max vendor id from both the dis-selected vendors and the vendor consents to know the overall max Id of the current vendor list version
            const diselectedMaxId = Math.max(...currentDisselectedVendorIds);
            const userMaxId = Math.max(+consentDataTCModel?.vendorConsents?.maxId, diselectedMaxId);
            let diffVendorIds = [];

            if (userMaxId > 0) {
                const strToInt: (str: string) => number = (str: string): number =>
                    parseInt(str, 10);
                const cdnVendorIds = Object.keys(currentGvl.vendors)
                    .filter(function (key) {
                        // Only get the vendorIds without deletedDate
                        return currentGvl.vendors[key].deletedDate == null;
                    })
                    .map(strToInt);

                diffVendorIds = cdnVendorIds.filter(item => item > userMaxId);
            }
            disselectedVendorIdArray = [].concat(currentDisselectedVendorIds, diffVendorIds);
        }

        const allowedLegitimateInterestsBits = !(response?.selectedVendorId?.indexOf(1) > -1);

        const currentGdprTcfObj = await generateTcfString(
            gdprTcfPurposeFeatureCurrentBits,
            allowedLegitimateInterestsBits,
            disselectedVendorIdArray
        );

        currentEncodedTCString = currentGdprTcfObj.encodedTCString;

        await saveGdprTcfTCString(
            currentGdprTcfObj.encodedTCString,
            currentGdprTcfObj.vendorListVersion
        );
    }

    return currentEncodedTCString;
}
