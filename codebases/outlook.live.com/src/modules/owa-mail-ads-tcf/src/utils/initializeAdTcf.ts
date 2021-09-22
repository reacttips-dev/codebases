import { CmpApi } from '@iabtcf/cmpapi';
import * as cmpstub from '@iabtcf/stub';
import { loadGdprTcfTCString } from 'owa-gdpr-ad-tcf';
import { isGdprAdMarket } from 'owa-mail-ads-shared';

export default async function initializeAdTcf(): Promise<void> {
    // This is to create the Tcf stub code so that the Ad publisher like AOL and Appnexus can retrieve the Tcf data
    // References:
    // Public spec: https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md#requirements-for-the-cmp-stub-api-script

    // Add a hidden TcfApiLocator iFrame so that the Ads running in the cross-domain iFrame could know __tcfapi will be defined
    cmpstub();

    // use cmpApi to register the APIs. The first parameter is the Outlook cmpId and the second is the cmp version we use
    const gdprAppliesToUser = isGdprAdMarket();

    let encodedTCString: string;
    if (!gdprAppliesToUser) {
        encodedTCString = null;
    } else {
        encodedTCString = await loadGdprTcfTCString();

        // We must set the encodedTCString to an empty string when the user has GDPR applied purpose instead of a null value to distinguish between the non-GDPR users
        if (encodedTCString == null) {
            encodedTCString = '';
        }
    }

    const cmpApi = new CmpApi(168, 2, false);
    cmpApi.update(encodedTCString);

    return Promise.resolve();
}
