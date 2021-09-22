import { format } from 'owa-localize';
import type { BrandUnsubscribeInfo, PersonaIdentifiers } from '../personaConfig';

import { makeGetRequest } from 'owa-ows-gateway';
import { trace } from 'owa-trace';
const GET_BRAND_SUBSCRIPTION_INFO_FORMAT = 'ows/api/beta/subscriptions/brands/{0}';

export type DataCallback<T> = ((data: T, error: undefined) => void) &
    ((data: undefined, error: string) => void);

export default async function getBrandUnsubscribeInfo(
    personaId: PersonaIdentifiers,
    targetBrandSatoriId: string,
    callback: DataCallback<BrandUnsubscribeInfo[]>
) {
    trace.info(`[getBrandUnsubscribeInfo] targetBrandSatoriId: ${targetBrandSatoriId}`);

    const requestUrl = format(GET_BRAND_SUBSCRIPTION_INFO_FORMAT, targetBrandSatoriId);
    try {
        let response = await makeGetRequest(requestUrl);
        if (response?.subscriptions) {
            let brandUnsubscribeInfo = response.subscriptions.map(subscription => {
                let brandName = subscription.brand
                    ? subscription.brand.brandName
                    : subscription.smtpInfo.displayName;
                return {
                    smtp: subscription.smtpInfo.smtpAddress,
                    smtpIdentifier: subscription.smtpInfo.smtpIdentifier,
                    smtpDisplayName: brandName,
                    unsubscribeSilentUri: subscription.unsubscribeSilentUris,
                    unsubscribeHttpUri: subscription.unsubscribeHttpUris,
                };
            });
            callback(brandUnsubscribeInfo, undefined);
        } else {
            callback(undefined, 'Call to get brand info returned empty response');
        }
    } catch (reason) {
        trace.info('[getBrandUnsubscribeInfo] exception from network request: ' + reason);
        callback(undefined, reason);
    }
}
