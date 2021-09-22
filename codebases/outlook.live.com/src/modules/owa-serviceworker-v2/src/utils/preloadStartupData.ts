import { addSessionDataHeaders, ServiceWorkerSource } from 'owa-serviceworker-common';
import * as trace from './trace';

let windowHeight: number | undefined;
export function setWindowHeight(height: number | undefined) {
    windowHeight = height;
}

let readingPanePosition: number | undefined;
export function setReadingPanePosition(position: number | undefined) {
    readingPanePosition = position;
}

export function preloadStartupData(source: ServiceWorkerSource, requestUrl: URL) {
    const isNative = requestUrl.search.indexOf('hxVersion&') > -1;
    if (source == 'mail' || isNative) {
        trace.log(`Calling PreloadSessionData with ${source}`);
        const headers = new Headers();
        addSessionDataHeaders(
            headers,
            requestUrl.pathname,
            isNative,
            windowHeight,
            readingPanePosition
        );
        if (isNative) {
            headers.append('x-native-host', 'true');
        }
        fetch('/owa/PreloadSessionData.ashx?app=mail', { method: 'POST', headers }).catch(() => {
            /* ignore errors */
        });
    }
}
