import { isOptedOut } from 'owa-linkedin';
import { LOKI_LINKEDINPREBIND_UI_FLIGHTNAME } from './lokiFlightNames';
import { fetchLokiConfigSync } from 'owa-people-loki';
import {
    getOptionsForFeature,
    OwsOptionsFeatureType,
    LinkedInViewProfileOptions,
} from 'owa-outlook-service-options';
import isLinkedInViewProfileFeatureFlagEnabled from './isLinkedInViewProfileFeatureFlagEnabled';

// For prebind dark flight, we want to gather the data (make the appropriate calls) but NOT show the UX
const LOKI_LINKEDINPREBIND_DARK_FLIGHTNAME = 'linkedindataprebinddark';
const LOKI_LINKEDIN_FLIGHTNAME = 'linkedinui';

export default function isLinkedInViewProfileEnabled(): boolean {
    /*
    LinkedIn View profile feature is enabled if:
    - The OWA flight is enabled
    - Two Loki flights are enabled
    - The user is not opted out of LinkedIn
    - The user has not explicity disabled it via the feedback UX
    */
    return (
        isLinkedInViewProfileFeatureFlagEnabled() &&
        areLokiFlightsEnabled() &&
        !isOptedOut() &&
        !isLinkedInViewProfileExplicitlyDisabled()
    );
}

function isLinkedInViewProfileExplicitlyDisabled(): boolean {
    const options = getOptionsForFeature<LinkedInViewProfileOptions>(
        OwsOptionsFeatureType.LinkedInViewProfile
    );

    return !!options?.dismissed;
}

function areLokiFlightsEnabled(): boolean {
    // Is the linkedinui flight turned on and atleast ONE of the prebind flights is enabled
    const config = fetchLokiConfigSync();
    return config
        ? config.Flights.includes(LOKI_LINKEDIN_FLIGHTNAME) &&
              (config.Flights.includes(LOKI_LINKEDINPREBIND_UI_FLIGHTNAME) ||
                  config.Flights.includes(LOKI_LINKEDINPREBIND_DARK_FLIGHTNAME))
        : false;
}
