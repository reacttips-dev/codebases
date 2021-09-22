import { makeGetRequest } from 'owa-ows-gateway';
import { isSuccessStatusCode } from 'owa-http-status-codes';

const AD_TARGETING_ENVELOPID_ENDPOINT = 'ows/beta/AdsTargetingOptOutController/GetEnvelopId';

let liveRampEnvelopeId: string;

async function getLiveRampEnvelopId(anid: string): Promise<string> {
    // If anid is undefined or null, it means the client-side JavaScript does not get ANID successfully as the ANON cookie is httpOnly
    // We need pass the all cookies to the server-side to process
    // If we can get the ANON cookie, we prefer to pass the ANON cookie value only without passing the whole request cookie
    let includeCredentials = anid ? false : true;

    // We need to convert anid to an empty string if anid is undefined or null
    anid = anid || '';

    if (liveRampEnvelopeId == undefined) {
        const response = await makeGetRequest(
            AD_TARGETING_ENVELOPID_ENDPOINT,
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
            const adTargetingEnvelopIdResponse = await response.json();
            liveRampEnvelopeId = adTargetingEnvelopIdResponse;
            return liveRampEnvelopeId;
        }

        // When the OwS call fails, we emit the null value
        return null;
    }

    return liveRampEnvelopeId;
}

export default getLiveRampEnvelopId;

// Test only method to clear the cached value
export function setEnvelopeIdUndefined() {
    liveRampEnvelopeId = undefined;
}
