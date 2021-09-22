import { TEAMS } from 'owa-config';
import { getQueryStringParameter, hasQueryStringParameter } from 'owa-querystring';

export function isHostedInTeams() {
    if (hasQueryStringParameter('hostApp', window.location)) {
        return getQueryStringParameter('hostApp').toLowerCase() == TEAMS;
    }
    return false;
}
