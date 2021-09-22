import { TCString } from '@iabtcf/core';
import { loadGdprTcfTCString } from 'owa-gdpr-ad-tcf';
import { isGdprAdMarket } from 'owa-mail-ads-shared';
import { lazyAdTcfInitialization } from 'owa-mail-ads-tcf';

export interface GdprDataPoint {
    gdprConsentDataString: string;
    consentStringPurpose: number[];
    consentStringVersion: number;
}

export async function loadGdprCmp(): Promise<GdprDataPoint> {
    // If the gdpr feature is enabled, import the ConsentManagementPlatform file to allow ast.js to check
    // Even if the user is not in EU, we need pass gdprApplies as false to cmp to AST
    let consentStringPurpose = [];
    let gdprConsentDataString: string;

    if (isGdprAdMarket()) {
        gdprConsentDataString = await loadGdprTcfTCString();
    }

    await lazyAdTcfInitialization.importAndExecute();

    if (gdprConsentDataString?.length > 0) {
        const tcModel = TCString.decode(gdprConsentDataString);
        tcModel.purposeConsents.forEach((value: boolean, id: number): void => {
            if (value) {
                consentStringPurpose.push(id);
            }
        });

        if (consentStringPurpose == null || consentStringPurpose.length == 0) {
            // Set consent string purpose to 0 to be easier logging to show the user has opted out everything
            consentStringPurpose = [0];
        }
    } else {
        // Set the consent string purpose to -1 to easy logging as there is no valid GDPR consent string out
        consentStringPurpose = [-1];
    }

    let gdprdataPoint = {
        gdprConsentDataString: gdprConsentDataString,
        consentStringPurpose: consentStringPurpose,
        consentStringVersion: 2,
    };
    return Promise.resolve(gdprdataPoint);
}
