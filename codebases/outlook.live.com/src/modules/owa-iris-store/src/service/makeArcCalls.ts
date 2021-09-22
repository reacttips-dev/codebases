import { getDelegationTokenForOwa, getAccessTokenforResourceAsLazy } from 'owa-tokenprovider';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import { getUserConfiguration } from 'owa-session-store';
import { format, getCurrentCulture } from 'owa-localize';
import type { ArcApiResponse } from './schema/arcApiResponse';
import { logUsage } from 'owa-analytics';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

const ARC_ENPOINT =
    'https://arc.msn.com/v4/api/selection?placement={0}&puid={1}&country={2}&locale={3}&nct=1{4}';
const TOKEN_SCOPE = 'service::ads.arcct.msn.com::MBI_SSL';

export async function makeArcCall(
    placementId: string,
    extraUrlParams: string = ''
): Promise<ArcApiResponse> {
    let headers = new Headers();

    let token;

    if (isConsumer()) {
        token = await getDelegationTokenForOwa(TOKEN_SCOPE);
    } else {
        let [authToken, tokenPromise] = getAccessTokenforResourceAsLazy(
            'https://arc.msn.com/v4',
            'OwaIrisStore'
        );
        if (!authToken) {
            token = await tokenPromise;
        } else {
            token = authToken;
        }
    }

    headers.append('authorization', `WLID1.1 t=${token}`);
    const request: RequestInit = {
        method: 'GET',
        headers: headers,
    };

    const locale = getCurrentCulture();
    // Split the locale with a - and get the last two letter which is mostly the country code
    let country = '';
    if (locale) {
        country = locale.split('-').pop();
    }
    let puid = getUserConfiguration().SessionSettings?.UserPuid;
    return Promise.race([
        fetch(
            format(ARC_ENPOINT, placementId, puid, country, locale, extraUrlParams),
            request
        ).then(handleResponse),
        rejectAfterTimeout(),
    ]);
}

function rejectAfterTimeout() {
    return new Promise((_resolve, reject) => {
        setTimeout(() => reject(), 2000);
    });
}

export function makeBeaconCall(uri: string, beaconName: string) {
    const request: RequestInit = {
        method: 'GET',
    };

    //Replace the content between {ACTION} with beaconname.
    var formattedUri = uri.replace(new RegExp('{' + 'ACTION' + '}'), beaconName);
    fetch(formattedUri, request).then(handleResponse);
}

export function makeImpressionCall(uri: string) {
    const request: RequestInit = {
        method: 'GET',
    };
    fetch(uri, request).then(handleResponse);
}

const handleResponse = (r: Response) => {
    if (!isSuccessStatusCode(r.status)) {
        logUsage('FailedIrisApi', { st: r.status, te: r.statusText });
    }
    return r.json();
};
