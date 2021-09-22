import { makeGetRequest } from 'owa-ows-gateway';
import { isSuccessStatusCode } from 'owa-http-status-codes';

const AD_TARGETING_ENDPOINT = 'ows/beta/AdsTargetingOptOutController';

let getAdTargetingOptOutBit: boolean;

async function getAdTargetingOptOut(anid: string): Promise<boolean> {
    // If anid is undefined or null, it means the client-side JavaScript does not get ANID successfully as the ANON cookie is httpOnly
    // We need pass the all cookies to the server-side to process
    // If we can get the ANON cookie, we prefer to pass the ANON cookie value only without passing the whole request cookie
    let includeCredentials = anid ? false : true;

    // We need to convert anid to an empty string if anid is undefined or null
    anid = anid || '';

    if (getAdTargetingOptOutBit == undefined) {
        const response = await makeGetRequest(
            AD_TARGETING_ENDPOINT,
            undefined /* correlationId */,
            true /* returnFullResponse */,
            {
                PreferAnid: anid,
            } /*customheaders*/,
            false /*throwServiceError*/,
            // This flag is to by pass a framework flight that drops all cookies.
            // Dropping cookies will result the auto label server side not able to
            // get all the cookies and return a 401.
            includeCredentials /*includeCredentials*/
        );
        if (isSuccessStatusCode(response.status)) {
            const adTargetingResponse = await response.json();
            getAdTargetingOptOutBit = adTargetingResponse;
            return getAdTargetingOptOutBit;
        }

        // When the OwS call fails, we emit false which is the same as today's topt value
        // However, we do not set the cached value of the outputbit to give other chance to retry if possible
        return false;
    }

    return getAdTargetingOptOutBit;
}

export default getAdTargetingOptOut;

// Test only method to clear the cached value
export function setAdTargetingOptOutBitUndefined() {
    getAdTargetingOptOutBit = undefined;
}
