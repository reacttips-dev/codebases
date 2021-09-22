import { getConfig } from './config';

type SimpleHeaders = { [key: string]: string };

export function addImmutableIdPreference(headers: Headers | SimpleHeaders) {
    const config = getConfig();
    if (config.isFeatureEnabled?.('fwk-immutable-ids')) {
        const prefer = buildPreferHeader(headers);
        if (isHeaders(headers)) {
            headers.set('prefer', prefer);
        } else {
            headers['prefer'] = prefer;
        }
    }
}

function buildPreferHeader(headers: Headers | SimpleHeaders) {
    const preferImmutable = 'IdType="ImmutableId"';
    const existingPrefer = isHeaders(headers) ? headers.get('prefer') : headers['prefer'];
    return existingPrefer ? `${existingPrefer}, ${preferImmutable}` : preferImmutable;
}

function isHeaders(headers: Headers | SimpleHeaders): headers is Headers {
    return !!headers.get && !!headers.set;
}
