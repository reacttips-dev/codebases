import { getCurrentCulture } from 'owa-localize';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import { makeGetRequest } from 'owa-ows-gateway';
import * as trace from 'owa-trace';

let GET_OUTLOOK_OPTIONS_URL: string = 'ows/v1.0/CalendarIcons/?AssetType=svg&Lang=';
let MIN_LOCALEID_LEN: number = 2;
let onGetIconsFromServicePromise: Promise<any> = null;

export default function getCalendarIconsFromService(): Promise<any> {
    if (onGetIconsFromServicePromise != null) {
        return onGetIconsFromServicePromise;
    }

    let localeId = '';
    if (!isNullOrWhiteSpace(getCurrentCulture())) {
        localeId = getCurrentCulture().toLowerCase();
    }

    if (localeId.length < MIN_LOCALEID_LEN) {
        trace.errorThatWillCauseAlert(
            `[getCalendarIconsFromService] Failed to get locale, got: ${localeId}.`
        );
        return null;
    }

    let serviceUrl = GET_OUTLOOK_OPTIONS_URL + localeId;

    onGetIconsFromServicePromise = new Promise<any>(resolve => {
        let serviceResponse = makeGetRequest(serviceUrl);
        serviceResponse.then(response => {
            if (response != null) {
                trace.trace.info(
                    `[getCalendarIconsFromService] Got response for locale: ${localeId}.`
                );
                return resolve(response);
            } else {
                trace.errorThatWillCauseAlert(
                    `[getCalendarIconsFromService] Failed to get response for locale: ${localeId}.`
                );
                return resolve(null);
            }
        });
    });

    return onGetIconsFromServicePromise;
}
