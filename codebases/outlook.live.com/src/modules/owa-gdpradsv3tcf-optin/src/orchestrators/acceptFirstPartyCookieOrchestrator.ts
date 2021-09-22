import { acceptFirstPartyCookie } from '../actions/internalActions';
import { orchestrator } from 'satcheljs';
import {
    GdprAdsV3Options,
    getOptionsForFeature,
    lazyCreateOrUpdateOptionsForFeature,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

const acceptFirstPartyCookieOrchestrator = orchestrator(acceptFirstPartyCookie, async () => {
    let allAcceptSelectedVendorId: number[];

    const savedOptions = getOptionsForFeature<GdprAdsV3Options>(OwsOptionsFeatureType.GdprAdsV3);
    if (savedOptions.selectedVendorId == null) {
        allAcceptSelectedVendorId = [2];
    } else {
        allAcceptSelectedVendorId = savedOptions.selectedVendorId;
        allAcceptSelectedVendorId = allAcceptSelectedVendorId.filter(i => i != 3);
        allAcceptSelectedVendorId.push(2);
    }

    const newOptions = {
        ...savedOptions,
        selectedVendorId: allAcceptSelectedVendorId,
    };

    return lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.GdprAdsV3,
        newOptions
    );
});

export default acceptFirstPartyCookieOrchestrator;
