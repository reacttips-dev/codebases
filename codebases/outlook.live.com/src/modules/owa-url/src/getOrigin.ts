import { getHostLocation } from './hostLocation';

export function getOrigin() {
    let hostLocation = getHostLocation();
    let origin = hostLocation.origin;

    if (!origin) {
        // Some older versions of IE11 have a bug where location.origin is not populated. So, manually fix it up here.
        origin =
            hostLocation.protocol +
            '//' +
            hostLocation.hostname +
            (hostLocation.port ? ':' + hostLocation.port : '');
    }

    return origin;
}

export function getOriginWithTrailingSlash() {
    return getOrigin() + '/';
}
