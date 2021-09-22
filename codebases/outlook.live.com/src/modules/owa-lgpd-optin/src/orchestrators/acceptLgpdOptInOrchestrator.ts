import { acceptLgpdOptIn } from '../actions/internalActions';
import { orchestrator } from 'satcheljs';
import {
    LgpdAdsOptions,
    getOptionsForFeature,
    lazyCreateOrUpdateOptionsForFeature,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';
import { setLgpdOptInBit, calculateCookieTargeting } from 'owa-cookie-targeting';

const acceptLgpdOptInOrchestrator = orchestrator(acceptLgpdOptIn, async () => {
    const savedOptions = getOptionsForFeature<LgpdAdsOptions>(OwsOptionsFeatureType.LgpdAds);

    const newOptions = {
        ...savedOptions,
        optInBit: 2,
    };

    setLgpdOptInBit(2);
    calculateCookieTargeting();

    return lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.LgpdAds,
        newOptions
    );
});

export default acceptLgpdOptInOrchestrator;
