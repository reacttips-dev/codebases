import { getQueryStringParameter, hasQueryStringParameter } from 'owa-querystring';

const MAX_LENGTH = 25;

export function getHostname() {
    return hasQueryStringParameter('hostname')
        ? getQueryStringParameter('hostname')
              .replace(/\W/g, '')
              .toLowerCase()
              .substring(0, MAX_LENGTH)
        : 'unknown';
}
