import { HUB, TEAMS_HUB, WIN32_OUTLOOK_HUB } from 'owa-config';
import { getQueryStringParameter, hasQueryStringParameter } from 'owa-querystring';

export function getHostHub() {
    if (hasQueryStringParameter('hostApp')) {
        const parameterValue = getQueryStringParameter('hostApp').toLowerCase();

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
