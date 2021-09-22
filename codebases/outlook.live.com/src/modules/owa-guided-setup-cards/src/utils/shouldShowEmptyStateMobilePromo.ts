import { getUserOutlookClients } from '../services/getUserOutlookClients';
import type { UserOutlookClients } from '../store/schema/UserOutlookClients';
import isGetMobileFeatureEnabled from './isGetMobileFeatureEnabled';
import { hasQueryStringParameter } from 'owa-querystring';
import { owaDate, OwaDate, addDays } from 'owa-datetime';
import { setUserOutlookClientsState } from '../mutators/setUserOutlookClientsState';
import { getUserOutlookClientsState } from '../selectors/getUserOutlookClientsState';
import isPhoneCardDismissed from '../utils/isPhoneCardDismissed';
import isGetQrConnectEnabled from '../utils/isGetQrConnectEnabled';

let shouldShowPromise: Promise<boolean>;

export async function shouldShowEmptyStateMobilePromo(isTest?: boolean): Promise<boolean> {
    if (!shouldShowPromise || isTest) {
        shouldShowPromise = shouldShowPromo();
    }

    return shouldShowPromise;
}

async function shouldShowPromo(): Promise<boolean> {
    let promoDismissDate: OwaDate;
    let daysToSupressPromo: number = 30;
    let mobilePromoOverrideParam = 'emptyStateMobilePromo';

    if (hasQueryStringParameter(mobilePromoOverrideParam)) {
        return true;
    }

    if ((isGetMobileFeatureEnabled() || isGetQrConnectEnabled()) && !isPhoneCardDismissed()) {
        let appInstalled = false;
        let userClients: UserOutlookClients = getUserOutlookClientsState();

        if (userClients.length == 0) {
            userClients = await getUserOutlookClients();
        }

        if (userClients && userClients.length > 0) {
            setUserOutlookClientsState(userClients);

            userClients.forEach(client => {
                if (client.clientType == 'AndroidOutlook' || client.clientType == 'IOSOutlook') {
                    appInstalled = true;
                } else if (
                    client.clientType == 'OWA' &&
                    (!promoDismissDate || promoDismissDate < client.mobilePromoDismissDate)
                ) {
                    promoDismissDate = client.mobilePromoDismissDate;
                }
            });
        } else {
            // If we dont get a response from endpoint
            // then we assume user already have app installed
            appInstalled = true;
        }

        return (
            !appInstalled &&
            (!promoDismissDate ||
                owaDate() >=
                    addDays(owaDate('UTC', promoDismissDate.toString()), daysToSupressPromo))
        );
    }

    return false;
}
