import { HUB, TEAMS_HUB, WIN32_OUTLOOK_HUB } from 'owa-config';
import { getQueryStringParameter, hasQueryStringParameter } from 'owa-querystring';

// getTestHostHub is used in OWA to simulate how the UI will look like for a particular hub
// this helps us to verify and test the UI without the need of running the code hosted in a Hub
export function getTestHostHub() {
    if (hasQueryStringParameter('testHostApp')) {
        const parameterValue = getQueryStringParameter('testHostApp').toLowerCase();

        if (parameterValue == HUB) {
            return HUB;
        }

        if (parameterValue == TEAMS_HUB) {
            return TEAMS_HUB;
        }

        if (parameterValue == WIN32_OUTLOOK_HUB) {
            return WIN32_OUTLOOK_HUB;
        }
    }

    return undefined;
}
